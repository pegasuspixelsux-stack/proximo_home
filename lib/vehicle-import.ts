import { HOME_AMENITIES, HOME_FEATURES } from "@/app/data/home-features";
import {
  ZONES,
  vehicleReference,
  type Dealership,
  type SellerType,
  type Vehicle,
  type Zone,
} from "@/app/data/vehicles";

// Bulk import: a plain one-sheet Excel/Sheets table whose columns map onto the
// home model (the `Vehicle` type). Photos are not part of it: imported homes
// are created without photos and stay hidden from the public site until photos
// are uploaded from the edit modal.

export const TEMPLATE_FILE_NAME = "Plantilla_Carga_Casas.xlsx";

const CURRENCIES = ["USD", "ARS"] as const;
const SELLERS: Record<string, SellerType> = {
  Inmobiliaria: "dealer",
  Particular: "private",
};
type Column = {
  key: string;
  header: string;
  width: number;
  /** Fixed choices, offered as a dropdown in the template. */
  options?: string[];
  wrap?: boolean;
};

export const COLUMNS: Column[] = [
  { key: "reference", header: "Referencia", width: 14 },
  { key: "name", header: "Nombre", width: 26 },
  { key: "zone", header: "Zona", width: 16, options: [...ZONES] },
  { key: "location", header: "Ubicacion", width: 24 },
  { key: "bedrooms", header: "Dormitorios", width: 13 },
  { key: "bathrooms", header: "Banos", width: 10 },
  { key: "guests", header: "Huespedes", width: 12 },
  { key: "price", header: "Precio", width: 14 },
  { key: "currency", header: "Moneda", width: 10, options: [...CURRENCIES] },
  { key: "area", header: "Superficie", width: 14 },
  { key: "seller", header: "Tipo_Vendedor", width: 16, options: Object.keys(SELLERS) },
  { key: "dealership", header: "Inmobiliaria", width: 22 },
  { key: "sellerPhone", header: "Telefono_Propietario", width: 20 },
  { key: "badge", header: "Etiqueta", width: 14 },
  { key: "features", header: "Caracteristicas", width: 34, wrap: true },
  { key: "amenities", header: "Amenities", width: 34, wrap: true },
  { key: "description", header: "Descripcion", width: 48, wrap: true },
];

const SAMPLES: Record<string, string | number>[] = [
  {
    reference: "0101",
    name: "Casa Los Pinos",
    zone: "La Barra",
    location: "Barrio Los Médanos",
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    price: 780000,
    currency: "USD",
    area: "320 m²",
    seller: "Inmobiliaria",
    dealership: "Costa Este Propiedades",
    badge: "Nueva",
    features: "Vista al mar; Parrillero; Jardín",
    amenities: "Piscina; Wi-Fi; Aire acondicionado",
    description: "Casa de diseño a pocos minutos de la playa, rodeada de pinos.",
  },
  {
    reference: "0102",
    name: "Villa Manantiales",
    zone: "Manantiales",
    location: "Ruta 10 km 160",
    bedrooms: 5,
    bathrooms: 5,
    guests: 10,
    price: 1250000,
    currency: "USD",
    seller: "Particular",
    sellerPhone: "59899000102",
    features: "Terraza; Chimenea; Garage",
    amenities: "Piscina climatizada; Gimnasio; Seguridad 24 h",
    description: "Villa con amplios espacios de living y quincho.",
  },
];

/** Loads exceljs on demand (it is large) and copes with CJS/ESM interop. */
async function loadExcel(): Promise<typeof import("exceljs")> {
  const mod = await import("exceljs");
  return mod.default ?? mod;
}

/** Builds the template (header + sample rows) and downloads it in the browser. */
export async function downloadTemplate() {
  const { Workbook } = await loadExcel();
  const wb = new Workbook();
  const ws = wb.addWorksheet("Casas");
  ws.columns = COLUMNS.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width,
  }));
  for (const row of SAMPLES) ws.addRow(row);

  const header = ws.getRow(1);
  header.height = 24;
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F3864" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });
  COLUMNS.forEach((c, i) => {
    const col = ws.getColumn(i + 1);
    if (c.wrap) col.alignment = { vertical: "top", wrapText: true };
    if (c.options) {
      for (let r = 2; r <= 300; r++) {
        ws.getCell(r, i + 1).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`"${c.options.join(",")}"`],
        };
      }
    }
  });
  ws.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = TEMPLATE_FILE_NAME;
  a.click();
  URL.revokeObjectURL(url);
}

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/** Maps accent/underscore-insensitive text to one of the allowed values. */
function pick<T extends string>(raw: string, options: readonly T[]) {
  return options.find((o) => norm(o) === norm(raw));
}

/** Cell contents as plain text (handles rich text, formulas and hyperlinks). */
function cellText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object") {
    const v = value as {
      text?: unknown;
      result?: unknown;
      richText?: { text: string }[];
      hyperlink?: string;
    };
    if (v.richText) return v.richText.map((t) => t.text).join("").trim();
    if (v.text != null) return cellText(v.text);
    if (v.result != null) return cellText(v.result);
    if (v.hyperlink) return v.hyperlink;
    if (value instanceof Date) return value.toISOString();
  }
  return String(value).trim();
}

/** "1.234,5" / "1,234.5" / "1234" -> number (NaN when not numeric). */
function toNumber(raw: string) {
  let s = raw.replace(/[^\d.,-]/g, "");
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", ".");
  else if (lastDot > lastComma && /\.\d{3}($|\.)/.test(s) && lastComma < 0)
    s = s.replace(/\./g, "");
  else s = s.replace(/,/g, "");
  return s === "" ? NaN : Number(s);
}

/** Spreadsheet-managed fields. Photos, id, dates and order are never in the file. */
export type VehicleFields = Omit<
  Vehicle,
  "id" | "createdAt" | "image" | "images" | "order"
>;

export type ImportRow = {
  data: VehicleFields;
  /** The home this row updates, matched by Referencia; absent for new homes. */
  existing?: Vehicle;
};

export type ImportResult = {
  rows: ImportRow[];
  errors: string[];
};

/** Detail rows the spreadsheet owns; other rows are kept on update. */
const MANAGED_SPECS = ["Superficie"];

/** Reads an uploaded .xlsx and validates every row against the home model. */
export async function parseInventoryFile(
  file: File,
  existing: Vehicle[],
  dealerships: Dealership[],
): Promise<ImportResult> {
  const { Workbook } = await loadExcel();
  const wb = new Workbook();
  try {
    await wb.xlsx.load(await file.arrayBuffer());
  } catch {
    return { rows: [], errors: ["No se pudo leer el archivo. Usá un .xlsx."] };
  }
  const ws = wb.worksheets[0];
  if (!ws) return { rows: [], errors: ["El archivo no tiene hojas."] };

  // Header text -> column number, ignoring case, accents and underscores.
  const colOf = new Map<string, number>();
  ws.getRow(1).eachCell((cell, n) => colOf.set(norm(cellText(cell.value)), n));
  const missing = COLUMNS.filter((c) => !colOf.has(norm(c.header))).map(
    (c) => c.header,
  );
  if (missing.length)
    return {
      rows: [],
      errors: [
        `Faltan columnas: ${missing.join(", ")}. Descargá la plantilla y no cambies los encabezados.`,
      ],
    };

  const errors: string[] = [];
  const rows: ImportRow[] = [];
  // Referencia is the unique key: a known one updates that home, a new one creates it.
  const byReference = new Map(existing.map((v) => [vehicleReference(v), v]));
  const seen = new Set<string>();
  const idByLabel = (list: { id: string; label: string }[]) =>
    new Map(
      list.flatMap((f) => [
        [norm(f.label), f.id] as const,
        [norm(f.id), f.id] as const,
      ]),
    );
  const featureByLabel = idByLabel(HOME_FEATURES);
  const amenityByLabel = idByLabel(HOME_AMENITIES);

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const get = (key: string) =>
      cellText(row.getCell(colOf.get(norm(COLUMNS.find((c) => c.key === key)!.header))!).value);
    if (!COLUMNS.some((c) => get(c.key))) return; // blank row

    const problems: string[] = [];
    const need = (key: string, label: string) => {
      const v = get(key);
      if (!v) problems.push(`${label} es obligatorio`);
      return v;
    };

    const reference = need("reference", "Referencia");
    if (reference) {
      if (!/^[A-Za-z0-9-]{1,20}$/.test(reference))
        problems.push("Referencia solo admite letras, números y guiones (máx. 20)");
      else if (seen.has(reference))
        problems.push(`la Referencia ${reference} está repetida en el archivo`);
      else seen.add(reference);
    }

    const name = need("name", "Nombre");

    const zone: Zone | undefined = pick(need("zone", "Zona"), ZONES);
    if (get("zone") && !zone) problems.push(`Zona debe ser: ${ZONES.join(", ")}`);

    const count = (key: string, label: string, min: number) => {
      const n = toNumber(need(key, label));
      if (get(key) && !(Number.isInteger(n) && n >= min && n <= 100))
        problems.push(`${label} inválido`);
      return n;
    };
    const bedrooms = count("bedrooms", "Dormitorios", 0);
    const bathrooms = count("bathrooms", "Banos", 0);
    const guests = count("guests", "Huespedes", 1);

    const price = toNumber(need("price", "Precio"));
    if (get("price") && !(price >= 0)) problems.push("Precio inválido");

    const currency = pick(need("currency", "Moneda"), CURRENCIES);
    if (get("currency") && !currency)
      problems.push("Moneda debe ser USD o ARS");

    const sellerName = pick(need("seller", "Tipo_Vendedor"), Object.keys(SELLERS));
    if (get("seller") && !sellerName)
      problems.push("Tipo_Vendedor debe ser Inmobiliaria o Particular");
    const sellerType = sellerName ? SELLERS[sellerName] : undefined;

    let dealership: Dealership | undefined;
    let sellerPhone = "";
    if (sellerType === "dealer") {
      const dName = need("dealership", "Inmobiliaria");
      dealership = dealerships.find((d) => norm(d.name) === norm(dName));
      if (dName && !dealership)
        problems.push(`la inmobiliaria "${dName}" no existe en el panel`);
    } else if (sellerType === "private") {
      sellerPhone = get("sellerPhone").replace(/\D/g, "");
      if (!/^\d{8,15}$/.test(sellerPhone))
        problems.push("Telefono_Propietario debe tener 8 a 15 dígitos con código de país");
    }

    const readIds = (
      key: string,
      label: string,
      lookup: Map<string, string>,
    ) => {
      const ids: string[] = [];
      for (const item of get(key).split(/[;\n]+/).map((s) => s.trim()).filter(Boolean)) {
        const id = lookup.get(norm(item));
        if (id) ids.push(id);
        else problems.push(`${label} desconocido: "${item}"`);
      }
      return ids;
    };
    const features = readIds("features", "Característica", featureByLabel);
    const amenities = readIds("amenities", "Amenity", amenityByLabel);

    if (problems.length) {
      errors.push(`Fila ${rowNumber}: ${problems.join("; ")}.`);
      return;
    }

    const known = byReference.get(reference);
    const specs: Record<string, string> = Object.fromEntries(
      Object.entries(known?.specs ?? {}).filter(
        ([k]) => !MANAGED_SPECS.includes(k),
      ),
    );
    if (get("area")) specs["Superficie"] = get("area");

    rows.push({
      existing: known,
      data: {
        reference,
        name,
        zone: zone!,
        location: get("location"),
        bedrooms,
        bathrooms,
        guests,
        price,
        priceCurrency: currency,
        specs,
        features,
        amenities,
        description: get("description"),
        sellerType: sellerType!,
        ...(dealership && { dealership }),
        ...(sellerType === "private" && { sellerPhone }),
        ...(get("badge") && { badge: get("badge") }),
      },
    });
  });

  if (!rows.length && !errors.length)
    errors.push("El archivo no tiene filas con datos.");
  return { rows, errors };
}
