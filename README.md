# FREEPORT: IoT Maturity Model Framework for SMEs

FREEPORT is a web-based framework designed to assess and improve the Internet of Things (IoT) technological maturity in Small and Medium Enterprises (SMEs), particularly focusing on the Latin American context. It utilizes the ATLANTIS maturity model, providing a holistic evaluation across technological, organizational, and human dimensions based on established research.

This tool helps SMEs understand their current IoT capabilities, identify areas for improvement, and plan their strategic adoption of IoT technologies.

**[Link to Live Demo]** (Replace with your GitHub Pages URL once deployed, if applicable)

## Features

*   **Project Presentation:** Detailed overview of the FREEPORT framework, its components, and objectives.
*   **Team Information:** Introduces the research team behind the project.
*   **Company Registration:** A form to register company details (name, country, activity, size, legal figure, contact emails). Generates a unique ID.
*   **Profile-Based Access:** Allows different user profiles (Manager, Engineer, Technician) to access and answer relevant parts of the questionnaire using the unique company ID.
*   **IoT Maturity Questionnaire:** Comprehensive questionnaire derived from the ATLANTIS model, segmented by profile, component (Device Management, Connectivity, Cloud/Edge, etc.), and dimension (Technological, Human, Organizational).
*   **Scoring Calculation:** Automatically calculates scores based on user responses for each component, dimension, and an overall maturity score (0-100).
*   **Results Visualization:** Presents the calculated scores using interactive charts:
    *   Component Scores (Bar Chart)
    *   Dimension Scores (Radar Chart)
    *   Overall Score (Doughnut Chart)
*   **AI-Generated Feedback:** Utilizes the Google Gemini API to provide personalized analysis and actionable recommendations based on the company's scores and profile.
*   **Email Notifications:** Sends emails via EmailJS for:
    *   Company registration confirmation with the unique ID.
    *   Results summary, including scores and AI feedback, upon completion.
*   **Admin Panel:** A password-protected section for administrators to:
    *   Export all registered company data and scores to an Excel file (`.xlsx`).
    *   Reset/delete all stored data (requires confirmation).
*   **Publications List:** Showcases related academic publications by the research team.

## How to Use FREEPORT (User Guide)

1.  **Register Your Company:**
    *   Navigate to the "Registrar Empresa" tab.
    *   Fill in the required company details.
    *   **Crucial:** Provide at least one valid email address (preferably for the Manager role) to receive the unique Company ID. Provide emails for other roles if they will participate.
    *   Click "Registrar".
    *   **Save the unique Company ID** displayed and sent via email. You'll need it to log in.
2.  **Log In with Your Profile:**
    *   Go to the "Ingresar" tab.
    *   Enter the unique Company ID you received.
    *   Click "Cargar Progreso".
    *   Select your role (Manager, Engineer, or Technician). You will only see buttons for roles that had an email address registered.
3.  **Answer the Questionnaire:**
    *   You will be directed to the "Modelo de Madurez" tab.
    *   Answer the questions corresponding to your profile. Select the option that best reflects your company's current state.
    *   Click "Guardar respuestas de [Your Profile]".
4.  **Calculate Score:**
    *   Once *all* participating profiles (Manager, Engineer, Technician for whom emails were registered) have saved their answers, the "Calcular Puntuación" button will become active.
    *   Any user profile can click this button.
5.  **View Results:**
    *   The application will calculate and display the scores in the "Resultados" section of the "Modelo de Madurez" tab.
    *   This includes detailed charts, score breakdowns, and AI-generated feedback.
    *   A summary email will also be sent to the registered email addresses.

## Technology Stack

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Charting:** [Chart.js](https://www.chartjs.org/)
*   **Excel Export:** [SheetJS (xlsx)](https://sheetjs.com/)
*   **Email Sending:** [EmailJS](https://www.emailjs.com/)
*   **AI Feedback:** [Google Gemini API](https://ai.google.dev/)
*   **Data Persistence:** [Google Apps Script](https://developers.google.com/apps-script) (acting as a simple backend connected to Google Sheets via Fetch API)
*   **Styling:** Basic CSS, [Font Awesome](https://fontawesome.com/) (Icons), [Google Fonts](https://fonts.google.com/) (Roboto)

## Configuration and Setup

**IMPORTANT SECURITY NOTICE:**

This project utilizes external services requiring API keys and credentials:

*   **Google Gemini API Key:** Found in `script.js` (variable `GEMINI_API_KEY`). Required for generating AI feedback.
*   **EmailJS Service ID, Template IDs, and User ID (Public Key):** Used in `script.js` (within `emailjs.init` and `emailjs.send` calls). Required for sending emails.

**DO NOT commit these keys directly into the `script.js` file or any other file in the repository, especially if the repository is public.** Exposing these keys is a security risk.

**How to Handle Keys:**

1.  **(Recommended for Deployment)** Use environment variables provided by your hosting platform (like Netlify, Vercel, or others if not using GitHub Pages for private repos). Modify `script.js` to read keys from `process.env` or the platform's equivalent.
2.  **(For Local Development)** Create a separate configuration file (e.g., `config.js`) that is *not* committed to Git (add it to `.gitignore`). Define your keys in `config.js` and import them into `script.js`.
3.  **(Manual - Least Secure)** Manually insert the keys into your local copy of `script.js` *after* cloning/downloading and *before* running. **Be extremely careful not to commit them.**

**Other Configuration:**

*   **Google Apps Script URL:** The `urlbase` variable in `script.js` points to your deployed Google Apps Script web app URL, which handles data storage. You need to deploy your own instance of the associated Apps Script code.
*   **HTML File:** The main HTML file is `Codigoo.txt`. For standard web serving and GitHub Pages, rename this file to `index.html`.

## Data Storage

Company registration data, profile answers, and calculated scores are persisted using a Google Apps Script connected to a Google Sheet, acting as a simple database. The `script.js` file interacts with the deployed Apps Script web app URL via the Fetch API to save and retrieve data.

## Team & Publications

Information about the research team and related academic publications can be found directly on the website within the 'Equipo de Trabajo' and 'Publicaciones' tabs.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details (You should add a LICENSE file to your repository if you make it public, choosing a license like MIT).
