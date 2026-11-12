# Tu Próxima Casa

Sitio de casas de veraneo en Punta del Este (Península, Playa Brava, Playa Mansa, La Barra, Manantiales y José Ignacio). Next.js + Firebase + ImageKit.

## Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Datos de ejemplo

```bash
npm run seed            # carga 12 casas y 3 inmobiliarias de ejemplo en Firestore
npm run seed:settings
```

Necesita `SEED_EMAIL` / `SEED_PASSWORD` en `.env.local`.

## Rutas

- `/casas` y `/casas/[id]`: listado y detalle de casas.
- `/inmobiliarias`: directorio de inmobiliarias.
- `/dashboard`: panel de administración.

Nota: internamente el tipo `Vehicle` y la colección `vehicles` de Firestore representan casas (se mantuvo el nombre para no migrar datos).
