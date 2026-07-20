/**
 * Configuración pública de FREEPORT.
 *
 * Este archivo se publica y cualquier visitante puede leerlo. El proyecto usa
 * Groq directamente desde script.js por decisión expresa de despliegue.
 */
window.FREEPORT_CONFIG = Object.freeze({
    // El panel administrativo permanece oculto en la versión pública. Las tareas
    // administrativas deben realizarse desde Supabase/Google o desde un backend.
    ENABLE_PUBLIC_ADMIN: false,
    ADMIN_ACCESS_CODE: ''
});
