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
- **Informe con IA:** se genera con GPT-4o mini mediante un proxy independiente de Google Apps Script. La clave permanece en Script Properties y nunca llega al navegador.

En la carga normal solo se consulta el identificador de empresa solicitado. La lectura completa de datos queda reservada para la exportación administrativa explícita.

### Evitar la pausa por inactividad

El robot local de Windows está en [`scripts/supabase-keepalive.ps1`](./scripts/supabase-keepalive.ps1). La tarea programada consulta Supabase los lunes, miércoles y viernes, sin crear empresas, respuestas ni resultados, y vence el 30 de junio de 2027.

## Configurar OpenAI

El frontend contiene únicamente la URL pública del proxy:

```js
const OPENAI_MODEL = 'gpt-4o-mini';
const OPENAI_PROXY_URL = 'https://script.google.com/macros/s/.../exec';
const OPENAI_MAX_OUTPUT_TOKENS = 16384;
const OPENAI_REQUEST_TIMEOUT_MS = 150000;
```

El margen de salida y el tiempo de espera permiten completar informes extensos
con muchas brechas sin aceptar resultados truncados. El frontend conserva la
validación que rechaza cualquier informe que omita recomendaciones y solicita
acciones concisas para aprovechar el margen disponible.

La clave privada está guardada como `OPENAI_API_KEY` en Script Properties del proyecto independiente `FREEPORT OpenAI Proxy`. No es necesario modificar el Apps Script de respaldo, Supabase ni `config.js`. El prompt, el modelo, el formato y el procesamiento del informe se conservan.

## Configuración pública

[`config.js`](./config.js) contiene únicamente opciones publicables:

```js
window.FREEPORT_CONFIG = Object.freeze({
  ENABLE_PUBLIC_ADMIN: false,
  ADMIN_ACCESS_CODE: ''
});
```

Todo lo publicado en GitHub Pages puede ser leído por cualquier visitante. La URL del proxy es publicable, pero la clave de OpenAI nunca debe copiarse en el repositorio, `script.js`, `config.js` ni capturas. Use una clave exclusiva para este proyecto, mantenga límites de gasto y rótela si detecta uso no reconocido.

El acceso administrativo está deshabilitado por defecto. Un código escrito en JavaScript solo oculta la interfaz y **no constituye autenticación segura**. Para datos reales, la exportación administrativa debe trasladarse a un backend autenticado.

La guía para el responsable del backend está en [`docs/SEGURIDAD_BACKEND.md`](./docs/SEGURIDAD_BACKEND.md). El ejemplo de proxy se conserva únicamente como alternativa futura y no forma parte del flujo actual.

## Datos esperados

La aplicación conserva las tablas existentes:

- `companies`: identificación, datos descriptivos, correos, siete puntajes por componente, tres puntajes por dimensión, puntaje global y `last_updated`.
- `profiles`: `company_id`, el JSON `profile_data` y `last_updated`.

Los borradores siguen guardándose dentro de `profile_data`; ahora cada pregunta también tiene un identificador estable, manteniendo compatibilidad con respuestas antiguas basadas en índices.

## Publicación en GitHub Pages

1. Confirme que `OPENAI_PROXY_URL` apunta al despliegue `/exec` vigente.
2. Ejecute `npm test` y `npm run check`.
3. Suba los archivos de la raíz y la carpeta `docs` al repositorio.
4. Configure GitHub Pages para publicar desde la rama y carpeta correspondientes.
5. Realice una evaluación de prueba con una empresa nueva y confirme OpenAI, Supabase, el respaldo de Google y los correos.

No publique capturas, archivos `.env` ni exportaciones que contengan datos de empresas o claves adicionales.
