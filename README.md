# FREEPORT: Framework de Modelo de Madurez IoT para PYMEs

FREEPORT es un marco de trabajo basado en la web diseñado para evaluar y mejorar la madurez tecnológica del Internet de las Cosas (IoT) en Pequeñas y Medianas Empresas (PYMEs), enfocándose particularmente en el contexto latinoamericano. Utiliza el modelo de madurez ATLANTIS, proporcionando una evaluación holística a través de las dimensiones tecnológica, organizacional y humana, basada en investigación establecida.

Esta herramienta ayuda a las PYMEs a comprender sus capacidades actuales de IoT, identificar áreas de mejora y planificar su adopción estratégica de tecnologías IoT.

**[Enlace a la Demo en Vivo]** (Reemplaza con la URL de tu GitHub Pages una vez desplegado, si aplica)

## Características

*   **Presentación del Proyecto:** Visión general detallada del framework FREEPORT, sus componentes y objetivos.
*   **Información del Equipo:** Presenta al equipo de investigación detrás del proyecto.
*   **Registro de Empresa:** Un formulario para registrar detalles de la empresa (nombre, país, actividad, tamaño, figura legal, correos de contacto). Genera un ID único.
*   **Acceso Basado en Perfil:** Permite que diferentes perfiles de usuario (Gerente, Ingeniero, Técnico) accedan y respondan las partes relevantes del cuestionario usando el ID único de la empresa.
*   **Cuestionario de Madurez IoT:** Cuestionario completo derivado del modelo ATLANTIS, segmentado por perfil, componente (Gestión de Dispositivos, Conectividad, Nube/Borde, etc.) y dimensión (Tecnológica, Humana, Organizacional).
*   **Cálculo de Puntuación:** Calcula automáticamente las puntuaciones basadas en las respuestas del usuario para cada componente, dimensión y una puntuación de madurez general (0-100).
*   **Visualización de Resultados:** Presenta las puntuaciones calculadas usando gráficos interactivos:
    *   Puntuaciones por Componente (Gráfico de Barras)
    *   Puntuaciones por Dimensión (Gráfico de Radar)
    *   Puntuación General (Gráfico de Dona)
*   **Feedback Generado por IA:** Utiliza la API Google Gemini para proporcionar análisis personalizados y recomendaciones accionables basadas en las puntuaciones y el perfil de la empresa.
*   **Notificaciones por Email:** Envía correos electrónicos a través de EmailJS para:
    *   Confirmación de registro de la empresa con el ID único.
    *   Resumen de resultados, incluyendo puntuaciones y feedback de IA, al completar el proceso.
*   **Panel de Administrador:** Una sección protegida por contraseña para administradores para:
    *   Exportar todos los datos de las empresas registradas y sus puntuaciones a un archivo Excel (`.xlsx`).
    *   Restablecer/eliminar todos los datos almacenados (requiere confirmación).
*   **Lista de Publicaciones:** Muestra publicaciones académicas relacionadas realizadas por el equipo de investigación.

## Cómo Usar FREEPORT (Guía de Usuario)

1.  **Registra tu Empresa:**
    *   Navega a la pestaña "Registrar Empresa".
    *   Completa los detalles requeridos de la empresa.
    *   **Crucial:** Proporciona al menos una dirección de correo electrónico válida (preferiblemente para el rol de Gerente) para recibir el ID único de la Empresa. Proporciona correos para otros roles si van a participar.
    *   Haz clic en "Registrar".
    *   **Guarda el ID único de la Empresa** que se muestra y se envía por correo electrónico. Lo necesitarás para iniciar sesión.
2.  **Ingresa con tu Perfil:**
    *   Ve a la pestaña "Ingresar".
    *   Introduce el ID único de la Empresa que recibiste.
    *   Haz clic en "Cargar Progreso".
    *   Selecciona tu rol (Manager, Engineer o Technician). Solo verás los botones para los roles que tuvieron una dirección de correo registrada.
3.  **Responde el Cuestionario:**
    *   Serás dirigido a la pestaña "Modelo de Madurez".
    *   Responde las preguntas correspondientes a tu perfil. Selecciona la opción que mejor refleje el estado actual de tu empresa.
    *   Haz clic en "Guardar respuestas de [Tu Perfil]".
4.  **Calcula la Puntuación:**
    *   Una vez que *todos* los perfiles participantes (Manager, Engineer, Technician para quienes se registraron correos) hayan guardado sus respuestas, el botón "Calcular Puntuación" se activará.
    *   Cualquier perfil de usuario puede hacer clic en este botón.
5.  **Visualiza los Resultados:**
    *   La aplicación calculará y mostrará las puntuaciones en la sección "Resultados" de la pestaña "Modelo de Madurez".
    *   Esto incluye gráficos detallados, desgloses de puntuaciones y feedback generado por IA.
    *   También se enviará un correo electrónico de resumen a las direcciones de correo registradas.

## Pila Tecnológica (Stack)

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Gráficos:** [Chart.js](https://www.chartjs.org/)
*   **Exportación a Excel:** [SheetJS (xlsx)](https://sheetjs.com/)
*   **Envío de Email:** [EmailJS](https://www.emailjs.com/)
*   **Feedback de IA:** [Google Gemini API](https://ai.google.dev/)
*   **Persistencia de Datos:** [Google Apps Script](https://developers.google.com/apps-script) (actuando como un backend simple conectado a Google Sheets mediante la Fetch API)
*   **Estilos:** CSS Básico, [Font Awesome](https://fontawesome.com/) (Iconos), [Google Fonts](https://fonts.google.com/) (Roboto)

## Equipo y Publicaciones

La información sobre el equipo de investigación y las publicaciones académicas relacionadas se puede encontrar directamente en el sitio web, dentro de las pestañas 'Equipo de Trabajo' y 'Publicaciones'.

## Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo `LICENSE` para más detalles (Deberías añadir un archivo `LICENSE` a tu repositorio si lo haces público, eligiendo una licencia como MIT).
