# SEO: pendientes fuera del código

## Datos del negocio que faltan (marcados TODO(seo) en `lib/seo.ts` y `Footer.tsx`)
- Dominio definitivo: se usa `tuproximacasa.online` como marcador en `lib/seo.ts` y `next.config.ts`.
- Dirección completa de la oficina, código postal, coordenadas (geo), horarios y teléfono.
- URLs de Instagram, Facebook y LinkedIn (cargarlas en `BUSINESS.sameAs` y en el footer).
- Páginas legales: revisar Términos, Privacidad, Cookies y Soporte.

## Google Search Console
1. Crear propiedad de tipo **Dominio** con el dominio definitivo y verificar con el registro TXT.
2. Enviar `/sitemap.xml`.
3. Pedir indexación de `/`, `/casas` y `/inmobiliarias`.

## Bing Webmaster Tools
Importar el sitio desde Search Console y enviar el mismo sitemap.

## Google Business Profile
Crear y verificar la ficha de la oficina en Punta del Este con el mismo nombre, dirección y teléfono que el footer.

## Reseñas y citaciones
- Pedir reseñas en Google a cada huésped o comprador.
- Presencia con los mismos datos (NAP) en portales inmobiliarios, Facebook, Instagram y directorios locales de Maldonado / Punta del Este.

## Analítica
Agregar Vercel Analytics (`@vercel/analytics`) y/o Google Analytics 4 (requiere el ID de medición).

## Dominio
En Vercel: agregar el dominio y su versión `www`. La redirección sin www → www está en `next.config.ts`.

## Ideas de páginas nuevas (no creadas)
- Una página por zona: "Casas en La Barra", "Casas en José Ignacio", etc., cuando haya stock real.
- Guía de temporada (Punta del Este en enero y febrero).

## Redirecciones
`/autos`, `/autos/:id` y `/concesionarias` redirigen (301) a `/casas`, `/casas/:id` e `/inmobiliarias`.
