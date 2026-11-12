"use client";

import {
  collection,
  deleteField,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { db } from "@/lib/firebase";
import {
  MAX_PHOTO_BYTES,
  photoError,
  uploadPhoto,
} from "@/lib/imagekit-upload";
import { isHeic, processVehicleImage } from "@/lib/utils/imageProcessor";
import { HOME_AMENITIES, HOME_FEATURES } from "../data/home-features";
import {
  ZONES,
  vehicleReference,
  type Dealership,
  type SellerType,
  type Vehicle,
  type Zone,
} from "../data/vehicles";
import { revalidateVehicles } from "./actions";

const PHOTO_ERROR =
  "Error al procesar o subir la imagen. Por favor intente nuevamente o use formato JPG/PNG.";

/** Rejects if a step hangs (stalled network, converter stuck) instead of spinning forever. */
function withTimeout<T>(promise: Promise<T>, ms: number, what: string) {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Tiempo de espera agotado: ${what}`)),
      ms,
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** Logs a photo failure with enough detail to debug it (errors can be non-Error objects). */
function logPhotoError(error: unknown, file?: File) {
  const e = error as {
    message?: unknown;
    stack?: unknown;
    $ResponseMetadata?: { statusCode?: number; requestId?: string };
  } | null;
  console.error("Error detallado en carga/conversión de imagen:", {
    message: typeof e?.message === "string" ? e.message : String(error),
    // Set when ImageKit answered: its HTTP status and request id, for its support team.
    imagekitStatus: e?.$ResponseMetadata?.statusCode,
    imagekitRequestId: e?.$ResponseMetadata?.requestId,
    stack: typeof e?.stack === "string" ? e.stack : undefined,
    file: file?.name,
    type: file?.type,
    size: file?.size,
  });
}

const FIELD =
  "w-full rounded-xl border border-line bg-bg/60 px-3 py-2 text-sm text-fg outline-none transition-colors duration-150 placeholder:text-subtle focus:border-fg/40";

/** Parses "Label: value" lines into the extra technical-sheet rows. */
function parseSpecs(text: string) {
  const specs: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const i = line.indexOf(":");
    const label = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (i > 0 && label && value) specs[label] = value;
  }
  return specs;
}

function Labeled({
  label,
  children,
  wide,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function VehicleModal({
  vehicle,
  dealerships,
  vehicles,
  onClose,
  onSaved,
}: {
  /** Vehicle being edited; omit to create a new one. */
  vehicle?: Vehicle;
  dealerships: Dealership[];
  /** All listings, used to keep the reference number unique. */
  vehicles: Vehicle[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const titleId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(
    vehicle?.images?.length ? vehicle.images : vehicle?.image ? [vehicle.image] : [],
  );
  // Index into `images` of the featured photo.
  const [featured, setFeatured] = useState(() => {
    const i = vehicle?.images?.indexOf(vehicle.image) ?? -1;
    return i > 0 ? i : 0;
  });
  // Photo batch progress: overall 0-100 plus what is happening right now.
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  // Shown right under the photo picker so a failure is never out of sight.
  const [photoMessage, setPhotoMessage] = useState("");
  const [sellerType, setSellerType] = useState<SellerType>(
    vehicle?.sellerType ?? "dealer",
  );
  const [priceCurrency, setPriceCurrency] = useState<"USD" | "ARS">(
    vehicle?.priceCurrency ?? "USD",
  );
  const [priceInput, setPriceInput] = useState(
    vehicle ? String(vehicle.price) : "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onPhotos(files: FileList | null) {
    if (!files?.length) return;
    // Copy first: clearing the input below empties the live FileList.
    const list = Array.from(files);
    const total = list.length;
    const problems: string[] = [];
    let current: File | undefined;
    setPhotoMessage("");
    setIsUploading(true);
    setUploadProgress(0);
    try {
      // One file at a time: convert (HEIC only), check, upload. Each file owns an
      // equal slice of the bar; a HEIC file spends the first half converting.
      for (let i = 0; i < total; i++) {
        const original = list[i];
        current = original;
        const heic = isHeic(original);
        const slice = (fraction: number) =>
          Math.round(((i + fraction) / total) * 100);

        try {
          let file = original;
          // HEIC gets converted; any photo over the size limit gets shrunk.
          if (heic || original.size > MAX_PHOTO_BYTES) {
            setCurrentStepText(
              heic
                ? `Convirtiendo imagen ${i + 1} de ${total} (${original.name})…`
                : `Optimizando imagen ${i + 1} de ${total} (${original.name})…`,
            );
            setUploadProgress(slice(0.05));
            try {
              file = await withTimeout(
                processVehicleImage(original),
                120_000,
                "conversión de la imagen",
              );
            } catch (e) {
              logPhotoError(e, original);
              problems.push(
                heic
                  ? `${original.name}: no se pudo convertir la imagen .HEIC. Intente subir formato JPG o PNG.`
                  : `${original.name}: ${PHOTO_ERROR}`,
              );
              setUploadProgress(slice(1));
              continue;
            }
          }

          const invalid = photoError(file);
          if (invalid) {
            logPhotoError(new Error(invalid), file);
            problems.push(`${original.name}: ${invalid}`);
            setUploadProgress(slice(1));
            continue;
          }

          setCurrentStepText(
            `Subiendo imagen ${i + 1} de ${total} (${file.name})…`,
          );
          const base = file !== original ? 0.5 : 0;
          setUploadProgress(slice(base));
          const url = await withTimeout(
            uploadPhoto(file, "/vehicles", (pct) =>
              setUploadProgress(slice(base + (pct / 100) * (1 - base))),
            ),
            180_000,
            "subida de la imagen",
          );
          setImages((prev) => [...prev, url]);
          setUploadProgress(slice(1));
        } catch (e) {
          // Upload, network or authorization failure: stop, keep what already uploaded.
          logPhotoError(e, current);
          problems.push(`${original.name}: ${PHOTO_ERROR}`);
          break;
        }
      }
    } catch (e) {
      // Anything unexpected outside the per-file steps.
      logPhotoError(e, current);
      problems.push(PHOTO_ERROR);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentStepText("");
      if (problems.length) setPhotoMessage(problems.join("\n"));
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removePhoto(i: number) {
    setImages((prev) => prev.filter((_, j) => j !== i));
    // Keep the same photo featured; fall back to the first when it was removed.
    setFeatured((f) => (i === f ? 0 : i < f ? f - 1 : f));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!images.length) return setError("Subí al menos una foto de la casa.");
    const f = new FormData(e.currentTarget);
    const str = (k: string) => String(f.get(k) ?? "").trim();
    const dealership =
      sellerType === "dealer"
        ? dealerships.find((d) => d.id === str("dealershipId"))
        : undefined;
    if (sellerType === "dealer" && !dealership)
      return setError("Elegí una inmobiliaria.");

    const reference = str("reference");
    if (!/^[A-Za-z0-9-]{1,20}$/.test(reference))
      return setError(
        "El número de referencia solo puede tener letras, números y guiones (máx. 20).",
      );
    if (
      vehicles.some(
        (v) => v.id !== vehicle?.id && vehicleReference(v) === reference,
      )
    )
      return setError("Ese número de referencia ya lo usa otra casa.");

    // The price is stored exactly as entered, with the currency it was listed in.
    const price = Number(priceInput);
    if (!Number.isFinite(price) || price < 0)
      return setError("Ingresá un precio válido.");

    const fields = {
      reference,
      name: str("name"),
      zone: str("zone") as Zone,
      location: str("location"),
      bedrooms: Number(str("bedrooms")),
      bathrooms: Number(str("bathrooms")),
      guests: Number(str("guests")),
      price,
      priceCurrency,
      image: images[featured] ?? images[0],
      images,
      specs: parseSpecs(str("specs")),
      features: f.getAll("features").map(String),
      amenities: f.getAll("amenities").map(String),
      description: str("description"),
      sellerType,
    };

    setSaving(true);
    setError("");
    try {
      if (vehicle) {
        await updateDoc(doc(db, "vehicles", vehicle.id), {
          ...fields,
          dealership: dealership ?? deleteField(),
          sellerPhone:
            sellerType === "private" ? str("sellerPhone") : deleteField(),
        });
      } else {
        const ref = doc(collection(db, "vehicles"));
        await setDoc(ref, {
          ...fields,
          id: ref.id,
          createdAt: new Date().toISOString().slice(0, 10),
          // Negative timestamp: new listings sort ahead of the seeded ones.
          order: -Date.now(),
          ...(dealership && { dealership }),
          ...(sellerType === "private" && { sellerPhone: str("sellerPhone") }),
        });
      }
      await revalidateVehicles();
      onSaved();
    } catch {
      setError(
        "No se pudo guardar. Revisá tu conexión y los permisos de Firestore.",
      );
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="vehicle-modal"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-line bg-bg text-fg shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id={titleId} className="text-lg font-medium tracking-tight">
            {vehicle ? "Editar casa" : "Agregar casa"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:text-fg"
          >
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <form onSubmit={onSubmit} className="overflow-y-auto px-5 py-5">
          <div>
            {images.length > 0 && (
              <ul
                data-testid="photo-list"
                className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4"
              >
                {images.map((src, i) => (
                  <li key={src} className="flex flex-col gap-1.5">
                    <span
                      className={`relative block aspect-[4/3] overflow-hidden rounded-xl border bg-surface ${
                        i === featured ? "border-fg" : "border-line"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`Foto ${i + 1} de la casa`}
                        fill
                        sizes="144px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        aria-label={`Quitar foto ${i + 1}`}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors duration-150 hover:bg-black/80"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={() => setFeatured(i)}
                      aria-pressed={i === featured}
                      data-testid={`photo-featured-${i}`}
                      className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-150 ${
                        i === featured
                          ? "border-fg bg-inverse text-on-inverse"
                          : "border-line text-muted hover:border-fg/40"
                      }`}
                    >
                      {i === featured ? "Principal" : "Hacer principal"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.heic,.heif"
              multiple
              data-testid="photo-input"
              onChange={(e) => onPhotos(e.target.files)}
              className="sr-only"
              id={`${titleId}-photo`}
            />
            <label
              htmlFor={`${titleId}-photo`}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 hover:border-fg/40 ${
                isUploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <ImagePlus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {isUploading
                ? "Procesando fotos…"
                : images.length
                  ? "Agregar más fotos"
                  : "Subir fotos"}
            </label>
            {isUploading && (
              <div data-testid="upload-progress" className="mt-3">
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span
                    aria-live="polite"
                    data-testid="upload-step"
                    className="min-w-0 truncate text-muted"
                  >
                    {currentStepText}
                  </span>
                  <span
                    data-testid="upload-percent"
                    className="shrink-0 font-medium tabular-nums"
                  >
                    {uploadProgress}%
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Progreso de la subida de fotos"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={uploadProgress}
                  className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-line"
                >
                  <div
                    className="h-2.5 rounded-full bg-inverse transition-[width] duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            {photoMessage && (
              <p
                role="alert"
                data-testid="photo-error"
                className="mt-3 whitespace-pre-line rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
              >
                {photoMessage}
              </p>
            )}
            <p className="mt-2 text-xs text-muted">
              JPG, PNG, WebP o HEIC (iPhone, se convierte a WebP). Máx. 10 MB
              cada una. La foto principal se muestra primero.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Labeled label="N.º de referencia" wide>
              <input
                name="reference"
                required
                maxLength={20}
                defaultValue={vehicle ? vehicleReference(vehicle) : ""}
                placeholder="Ej. 0012"
                data-testid="vehicle-reference"
                className={FIELD}
              />
            </Labeled>
            <Labeled label="Nombre de la casa" wide>
              <input
                name="name"
                required
                defaultValue={vehicle?.name}
                placeholder="Casa Los Pinos"
                data-testid="home-name"
                className={FIELD}
              />
            </Labeled>
            <Labeled label="Zona">
              <select
                name="zone"
                required
                defaultValue={vehicle?.zone ?? ""}
                data-testid="home-zone"
                className={FIELD}
              >
                <option value="" disabled>
                  Elegí una zona…
                </option>
                {ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </Labeled>
            <Labeled label="Ubicación (barrio o referencia)">
              <input
                name="location"
                defaultValue={vehicle?.location}
                placeholder="Ej. Barrio Los Médanos"
                className={FIELD}
              />
            </Labeled>
            <Labeled label="Dormitorios">
              <input
                name="bedrooms"
                type="number"
                required
                min={0}
                max={50}
                defaultValue={vehicle?.bedrooms}
                className={FIELD}
              />
            </Labeled>
            <Labeled label="Baños">
              <input
                name="bathrooms"
                type="number"
                required
                min={0}
                max={50}
                defaultValue={vehicle?.bathrooms}
                className={FIELD}
              />
            </Labeled>
            <Labeled label="Huéspedes (máx.)">
              <input
                name="guests"
                type="number"
                required
                min={1}
                max={100}
                defaultValue={vehicle?.guests}
                className={FIELD}
              />
            </Labeled>
            <Labeled label="Moneda">
              <select
                value={priceCurrency}
                onChange={(e) =>
                  setPriceCurrency(e.target.value as "USD" | "ARS")
                }
                data-testid="vehicle-price-currency"
                className={FIELD}
              >
                <option value="USD">Dólares (USD)</option>
                <option value="ARS">Pesos argentinos (ARS)</option>
              </select>
            </Labeled>
            <Labeled label={`Precio (${priceCurrency === "ARS" ? "ARS" : "USD"})`}>
              <input
                name="price"
                type="number"
                required
                min={0}
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                data-testid="vehicle-price-input"
                className={FIELD}
              />
            </Labeled>
            <Labeled label="Vendedor">
              <select
                value={sellerType}
                onChange={(e) => setSellerType(e.target.value as SellerType)}
                className={FIELD}
              >
                <option value="dealer">Inmobiliaria</option>
                <option value="private">Particular</option>
              </select>
            </Labeled>
            {sellerType === "dealer" ? (
              <Labeled label="Inmobiliaria">
                <select
                  name="dealershipId"
                  required
                  defaultValue={vehicle?.dealership?.id ?? ""}
                  className={FIELD}
                >
                  <option value="" disabled>
                    Elegí una…
                  </option>
                  {dealerships.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Labeled>
            ) : (
              <>
                <Labeled label="WhatsApp del propietario" wide>
                  <input
                    name="sellerPhone"
                    required
                    inputMode="numeric"
                    placeholder="59899123456"
                    defaultValue={vehicle?.sellerPhone}
                    className={FIELD}
                  />
                </Labeled>
              </>
            )}
          </div>

          <label className="mt-6 flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted">
              Descripción
            </span>
            <textarea
              name="description"
              rows={4}
              maxLength={2000}
              defaultValue={vehicle?.description}
              placeholder="Descripción de la casa, entorno, distancia a la playa, detalles a destacar…"
              data-testid="home-description"
              className={`${FIELD} resize-y`}
            />
          </label>

          <label className="mt-6 flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted">
              Datos adicionales (una línea por dato, «Etiqueta: valor»)
            </span>
            <textarea
              name="specs"
              rows={4}
              defaultValue={Object.entries(vehicle?.specs ?? {})
                .map(([k, v]) => `${k}: ${v}`)
                .join("\n")}
              placeholder={"Superficie: 320 m²\nTerreno: 1.200 m²\nDistancia al mar: 300 m"}
              data-testid="vehicle-specs"
              className={`${FIELD} resize-y`}
            />
          </label>

          <fieldset className="mt-6">
            <legend className="text-[10px] font-medium uppercase tracking-widest text-muted">
              Características
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {HOME_FEATURES.map(({ id, label }) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    name="features"
                    value={id}
                    defaultChecked={vehicle?.features?.includes(id)}
                    className="h-4 w-4 shrink-0 accent-[var(--inverse)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-[10px] font-medium uppercase tracking-widest text-muted">
              Amenities
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {HOME_AMENITIES.map(({ id, label }) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    name="amenities"
                    value={id}
                    defaultChecked={vehicle?.amenities?.includes(id)}
                    className="h-4 w-4 shrink-0 accent-[var(--inverse)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-line px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 hover:border-fg/40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || isUploading}
              data-testid="vehicle-save"
              className="rounded-full bg-inverse px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-on-inverse transition-[transform,opacity] duration-150 hover:opacity-85 active:scale-95 disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
