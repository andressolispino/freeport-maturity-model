# FREEPORT · evaluación de madurez tecnológica IoT

Aplicación web estática del proyecto doctoral FREEPORT/ATLANTIS. Permite registrar una empresa, completar los cuestionarios de gerente, ingeniero y técnico, calcular resultados normalizados y generar un informe de mejora.

## Ejecución local

No requiere compilación. Para evitar las restricciones de los navegadores al abrir archivos directamente, conviene servir la carpeta por HTTP:

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000/`.

Las pruebas automatizadas sí requieren Node.js:

```powershell
npm test
npm run check
```

## Arquitectura conservada

- **Supabase:** almacenamiento principal mediante la clave pública `anon`. No se modificaron tablas, columnas ni políticas.
- **Google Apps Script:** respaldo independiente de empresas y perfiles. La integración existente se conserva.
- **EmailJS:** correos de registro y resultados.
- **GitHub Pages:** el proyecto continúa siendo HTML, CSS y JavaScript estáticos; puede publicarse desde la raíz sin proceso de construcción.
- **Informe con IA:** se genera mediante una llamada directa desde el navegador a Groq, sin modificar Supabase ni Google Apps Script.

En la carga normal solo se consulta el identificador de empresa solicitado. La lectura completa de datos queda reservada para la exportación administrativa explícita.

## Configuración segura

[`config.js`](./config.js) contiene únicamente opciones publicables:

```js
window.FREEPORT_CONFIG = Object.freeze({
  ENABLE_PUBLIC_ADMIN: false,
  ADMIN_ACCESS_CODE: ''
});
```

Nunca agregue a ese archivo claves `service_role`, contraseñas de Google ni otros secretos de backend. Todo lo que se publica en GitHub Pages puede ser leído por cualquier visitante.

Por decisión del proyecto, la clave de Groq está en `script.js` y por tanto es pública. Se recomienda aplicar límites de uso en Groq, supervisar el consumo y rotarla cuando sea necesario. Si Groq falla, la aplicación muestra el error y no presenta un informe local como si hubiera sido generado por IA.

El acceso administrativo está deshabilitado por defecto. Un código escrito en JavaScript solo oculta la interfaz y **no constituye autenticación segura**. Para datos reales, la exportación administrativa debe trasladarse a un backend autenticado.

La guía para el responsable del backend está en [`docs/SEGURIDAD_BACKEND.md`](./docs/SEGURIDAD_BACKEND.md). El ejemplo de proxy se conserva solo como una alternativa futura y no forma parte del flujo actual.

## Datos esperados

La aplicación conserva las tablas existentes:

- `companies`: identificación, datos descriptivos, correos, siete puntajes por componente, tres puntajes por dimensión, puntaje global y `last_updated`.
- `profiles`: `company_id`, el JSON `profile_data` y `last_updated`.

Los borradores siguen guardándose dentro de `profile_data`; ahora cada pregunta también tiene un identificador estable, manteniendo compatibilidad con respuestas antiguas basadas en índices.

## Publicación en GitHub Pages

1. Ejecute `npm test` y `npm run check`.
2. Confirme que la cuenta de Groq tenga límites y alertas de consumo adecuados.
3. Suba los archivos de la raíz y la carpeta `docs` al repositorio.
4. Configure GitHub Pages para publicar desde la rama y carpeta correspondientes.
5. Realice una evaluación de prueba con una empresa nueva y confirme Groq, Supabase, el respaldo de Google y los correos.

No publique capturas, archivos `.env` ni exportaciones que contengan datos de empresas o claves.
