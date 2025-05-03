// script.js

const GEMINI_API_KEY = 'AIzaSyCXeBmyXuw69lLPNUBizk6MAc1mtPqK7N0'; // <-- PASTE YOUR KEY HERE
const GEMINI_MODEL = 'gemini-1.5-flash-latest'; // Or 'gemini-pro', etc.
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;


let companyProfiles = {};
let allCompaniesData = [];
//let urlbase="http://localhost:8090/model/api/infoModel"
let urlbase = 'https://script.google.com/macros/s/AKfycbyE2-lgyoQPBuIOpzd129JPPnDA0nUmeYFj80mzvIvp3hRf82pkZCrmBDH-1PCDxAI7PQ/exec';

const questions = {
  manager: [
      { text: '¿Se implementan anualmente estrategias de formación para la gestión de dispositivos IoT en la organización?', component: 'Device Management', dimension: 'human', answers: { 'No hay cursos de actualizaciones y actividades de mantenimiento de dispositivos IoT': 1, 'Formación ad hoc limitada para dispositivos IoT o casos de uso específicos': 5, '1-5 cursos disponibles anualmente': 10, 'Más de 5 cursos disponibles anualmente': 15, 'No sabe/no contesta': 0 } },
      { text: '¿En qué áreas funcionales de la empresa se aplican las tecnologías IoT?', component: 'Enterprise Integration', dimension: 'organizational', answers: { 'En ningún área funcional de la empresa': 1, 'En 1 a 2 áreas funcionales de la empresa': 5, 'En 3 a 4 áreas funcionales de la empresa': 10, 'En 5 o más áreas funcionales de la empresa': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Cómo se integran las tecnologías IoT en los procesos empresariales existentes?', component: 'Enterprise Integration', dimension: 'organizational', answers: { 'Sin procesos empresariales integrados con tecnologías IoT': 1, '0-2 procesos empresariales integrados con tecnologías IoT': 5, '3-5 procesos empresariales integrados con tecnologías IoT': 10, '6 o más procesos empresariales integrados con tecnologías IoT': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Se utilizan las tecnologías IoT para implicar a los clientes en la organización?', component: 'Enterprise Integration', dimension: 'human', answers: { 'No se utilizan': 1, 'Se utilizan': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Se generan informes o cuadros de mando basados en datos del IoT en la organización?', component: 'Enterprise Integration', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Ha implantado la empresa procesos para garantizar el cumplimiento de la normativa pertinente sobre el IoT (por ejemplo, soberanía de los datos, seguridad de los dispositivos, certificación)?', component: 'Compliance', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Colabora su organización con organismos reguladores o asociaciones del sector para mantenerse informada sobre los cambios en la normativa relacionada con IoT?', component: 'Compliance', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Sus soluciones IoT en la organización responden a sus necesidades específicas del sector o son genéricas?', component: 'Contextualization', dimension: 'organizational', answers: { 'Son genéricas': 1, 'Son específicos del sector o la empresa': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Existen recursos (financieros, humanos, técnicos) para explorar nuevas implementaciones de IoT en la organización?', component: 'Contextualization', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Ha evaluado la organización el posible retorno de la inversión (ROI) de las implementaciones de IoT?', component: 'Contextualization', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Cuáles son los obstáculos o retos (financieros, culturales o tecnológicos) que la organización percibe para la adopción de IoT?', component: 'Contextualization', dimension: 'organizational', answers: { 'No se han identificado los obstáculos ni los retos': 1, 'Se identifican algunos obstáculos y retos, pero no se proponen soluciones': 5, 'Barreras y retos identificados y soluciones propuestas': 10, 'Barreras y retos identificados proactivamente y soluciones implementadas': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Existen iniciativas para colaborar con instituciones de investigación, universidades o consorcios industriales sobre IoT?', component: 'Contextualization', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Existe un mecanismo de colaboración con el cliente para comprender sus retos específicos y crear soluciones conjuntas de IoT?', component: 'Contextualization', dimension: 'human', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
  ],

  engineer: [ 
      { text: '¿Cómo se gestiona el ciclo de vida de los dispositivos IoT en la organización?', component: 'Device Management', dimension: 'technological', answers: { 'Gestión ad hoc del ciclo de vida de los dispositivos IoT, con sustituciones o actualizaciones no planificadas': 1, 'La duración media del ciclo de vida de los dispositivos IoT es inferior a 1 año': 5, 'La duración media del ciclo de vida de los dispositivos IoT es de 1-3 años': 10, 'La duración media del ciclo de vida de los dispositivos IoT es superior a 3 años': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Cómo se mide el rendimiento de las tecnologías IoT en la organización?', component: 'Device Management', dimension: 'organizational', answers: { 'No hay métricas de rendimiento definidas ni procesos de supervisión establecidos': 1, '1-2 métricas de rendimiento': 5, '3-5 métricas de rendimiento': 10, '6 o más métricas de rendimiento definidas': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Utiliza su empresa alguna tecnología de virtualización para gestionar dispositivos u operaciones de IoT?', component: 'Connectivity Management', dimension: 'technological', answers: { 'No existe una red central virtualizada': 1, 'Existe una red central virtualizada dedicada a las operaciones de IoT': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Dispone la empresa de una plataforma de gestión de la conectividad o de un sistema de supervisión de red?', component: 'Connectivity Management', dimension: 'technological', answers: { 'No existe ninguna plataforma de gestión de la conectividad': 1, 'Existe y se utiliza una plataforma de gestión de la conectividad': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Dispone la empresa de análisis de datos basados en la información de red de los dispositivos IoT de la organización?', component: 'Connectivity Management', dimension: 'technological', answers: { 'La empresa no realiza análisis basados en información de la red IoT': 1, 'La empresa realiza análisis basados en información de la red IoT': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Como se procesan los datos de los dispositivos IoT en la organización?', component: 'Cloud/Edge Management', dimension: 'organizational', answers: { 'Los datos de IoT no se recopilan o se almacenan para procesar sin ningún tipo de análisis': 1, 'El análisis de los datos de IoT se realiza ad hoc': 5, 'El análisis de datos IoT es un proceso regular y estructurado': 10, 'El análisis de datos de IoT está automatizado e integrado con los procesos empresariales': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Existen equipos o recursos dedicados al análisis de datos de IoT en la organización?', component: 'Cloud/Edge Management', dimension: 'human', answers: { 'No hay equipos ni recursos dedicados al análisis de datos de IoT': 1, 'El análisis de datos de IoT lo realiza el personal operativo o de TI existente como responsabilidad adicional': 5, 'Existe un equipo o recursos dedicados al análisis de datos de IoT, con un tamaño de equipo moderado (de 1 a 3 personas)': 10, 'Hay un equipo de personal dedicado al análisis de datos de IoT (4 o más individuos)': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Qué servicios en la nube se utilizan para operaciones con el IoT?', component: 'Cloud/Edge Management', dimension: 'technological', answers: { 'No se utilizan servicios en la nube para las operaciones de IoT': 1, 'Los servicios en la nube básicos, como el almacenamiento en la nube o las copias de seguridad, se utilizan para el almacenamiento de datos de IoT.': 5, 'Se utilizan múltiples servicios en la nube para las operaciones de IoT, incluyendo computación en la nube, análisis de datos y herramientas de visualización': 10, 'Existe una estrategia en la nube completa y avanzada, que aprovecha una amplia gama de servicios en la nube para las operaciones de IoT': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Emplea la empresa edge computing para procesar y almacenar datos más cerca de los dispositivos IoT?', component: 'Cloud/Edge Management', dimension: 'technological', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Dispone la empresa de capacidad para gestionar con Inteligencia Artificial (IA) los conjuntos de datos producidos por dispositivos IoT y la nube?', component: 'Cloud/Edge Management', dimension: 'technological', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Utiliza los hiperescaladores de la nube (por ejemplo, AWS, Microsoft Azure)?', component: 'Cloud/Edge Management', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Cómo se integran los datos del IoT en los procesos operativos?', component: 'Enterprise Integration', dimension: 'organizational', answers: { 'Los datos de IoT están aislados y no se comparten entre procesos': 1, 'Algunos datos de IoT se comparten entre algunos procesos, pero la integración es limitada (menos de 3 procesos))': 5, 'Los datos de IoT se integran y comparten en la mayoría (más de 3 procesos) de los procesos operativos': 10, 'Los datos de IoT están totalmente integrados y se comparten sin problemas en todos los procesos operativos': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Dispone actualmente la organización de sistemas empresariales (por ejemplo, CRM, ERP)?', component: 'Enterprise Integration', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Participan actualmente en una plataforma de intercambio de datos IoT para su empresa?', component: 'Enterprise Integration', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Se han identificado riesgos de seguridad en la aplicación de tecnologías IoT por parte de la organización?', component: 'Security', dimension: 'technological', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Se ha capacitado a los empleados con respecto a la seguridad de los sistemas IoT en la organización?', component: 'Security', dimension: 'human', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Se realizan auditorías de seguridad del IoT en la organización?', component: 'Security', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Se ha asociado la empresa con otras organizaciones para debatir o trabajar conjuntamente sobre la seguridad de IoT en la organización?', component: 'Security', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Cuáles son las consideraciones éticas para el uso de datos de IoT?', component: 'Compliance', dimension: 'human', answers: { 'No se realizan comprobaciones de cumplimiento ético': 1, 'Se realizan 1-2 comprobaciones de cumplimiento ético anualmente': 5, 'Se realizan de 3 a 5 comprobaciones de cumplimiento ético anualmente': 10, 'Se realizan más de 5 comprobaciones de cumplimiento ético anualmente': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Existen asociaciones o colaboraciones con proveedores de soluciones IoT o expertos del sector?', component: 'Compliance', dimension: 'organizational', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Ha implementado su organización procesos y procedimientos para garantizar el cumplimiento de la normativa relacionada con IoT?', component: 'Compliance', dimension: 'organizational', answers: { 'No existe un sistema o marco de gestión del cumplimiento específico de IoT': 1, 'Procesos informales o ad hoc para el cumplimiento relacionado con IoT': 5, 'Sistema o marco de gestión del cumplimiento específico de IoT documentado e implementado': 10, 'Sistema o marco de gestión del cumplimiento específico de IoT completo, automatizado y continuamente actualizado.': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Cómo garantiza su organización que las conexiones IoT y los sistemas asociados cumplen las normativas pertinentes y las políticas?', component: 'Compliance', dimension: 'human', answers: { 'No hay un equipo dedicado o una persona responsable de gestionar el cumplimiento de IoT': 1, 'Responsabilidad informal o ad hoc para gestionar el cumplimiento de IoT': 5, 'Persona responsable de gestionar el cumplimiento de IoT': 10, 'Equipo dedicado e interfuncional responsable de gestionar el cumplimiento de IoT, con revisiones y actualizaciones periódicas': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Existen recursos o equipos dedicados a la investigación y el desarrollo del IoT en la organización?', component: 'Contextualization', dimension: 'human', answers: { 'No hay un equipo dedicado a la investigación y el desarrollo de IoT': 1, 'Una persona dedicada a la investigación y desarrollo de IoT': 5, 'Equipo de investigación y desarrollo de IoT de tamaño medio (2 a 4 personas)': 10, 'Equipo de investigación y desarrollo de IoT grande (5 personas o más).': 15, 'No sabe/no contesta': 0 } },
  ],


  technician: [
      { text: '¿Cuántos dispositivos IoT se utilizan en la organización?', component: 'Device Management', dimension: 'technological', answers: { 'No hay dispositivos IoT desplegados': 1, '1-10 dispositivos IoT desplegados': 5, '11-30 dispositivos IoT desplegados': 10, 'Más de 30 dispositivos IoT desplegados': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Cuál es el tiempo promedio dedicado a configurar nuevos dispositivos IoT en la organización?', component: 'Device Management', dimension: 'technological', answers: { 'No se mide el tiempo de configuración y despliegue': 1, '1-2 días en configurar y desplegar un nuevo dispositivo': 5, 'Entre 2 y 8 horas en configurar y desplegar un nuevo dispositivo': 10, 'Configuración de dispositivos que tardan menos de 2 horas en configurar e implantar un nuevo dispositivo': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Cómo aprovisiona y configura actualmente los dispositivos IoT en su organización?', component: 'Device Management', dimension: 'technological', answers: { 'Aprovisionamiento y configuración manuales': 1, 'Existe un proceso estandarizado y automatizado para el aprovisionamiento y configuración de dispositivos': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Se actualiza el firmware y el software de los dispositivos IoT de la organización?', component: 'Device Management', dimension: 'technological', answers: { 'No existe un proceso estructurado para gestionar las actualizaciones de los dispositivos': 1, 'Procesos ad hoc para gestionar las actualizaciones de dispositivos': 5, 'Existe un proceso estructurado': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Existen procesos u operaciones en los que se recopilen datos de dispositivos IoT conectados en la organización?', component: 'Connectivity Management', dimension: 'organizational', answers: { 'Ningún proceso u operación implica la recopilación de datos de dispositivos conectados': 1, '1 a 2 procesos u operaciones que implican la recopilación de datos de dispositivos conectados.': 5, '3 a 5 procesos y operaciones que implican la recopilación de datos de dispositivos conectados': 10, 'Más de 5 procesos u operaciones de dispositivos conectados que implican la recopilación de datos de dispositivos conectados': 15, 'No sabe/no contesta': 0 } },
      { text: '¿La empresa dispone de dispositivos IoT que se conectan mediante tarjetas SIM?', component: 'Connectivity Management', dimension: 'technological', answers: {'Sí': 15, 'No': 1, 'No sabe/no contesta': 0} },
      { text: '¿Cómo gestiona las tarjetas SIM y maneja el aprovisionamiento remoto para sus dispositivos IoT en la organización?', component: 'Connectivity Management', dimension: 'technological', answers: { 'La empresa gestiona manualmente tarjetas SIM físicas para dispositivos IoT': 1, 'La empresa utiliza métodos tradicionales de aprovisionamiento de SIM, pero no ha adoptado las tecnologías eSIM o iSIM.': 5, 'La empresa ha adoptado parcialmente las tecnologías eSIM o iSIM para el aprovisionamiento remoto de algunos dispositivos IoT (Liberg et al., 2018).': 10, 'La empresa ha adoptado completamente las tecnologías eSIM e iSIM en toda su flota de dispositivos IoT': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Existe una infraestructura de red específica para los dispositivos IoT, o comparten la misma red que otros sistemas informáticos?', component: 'Connectivity Management', dimension: 'technological', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Qué herramientas y técnicas de análisis de datos se utilizan para los datos de IoT en la organización?', component: 'Cloud/Edge Management', dimension: 'organizational', answers: { 'No se utilizan herramientas o técnicas de análisis de datos específicas para los datos de IoT': 1, 'Se utilizan herramientas o técnicas básicas de análisis de datos para los datos de IoT, como software de hojas de cálculo o análisis estadísticos sencillos': 5, 'Se utilizan herramientas y técnicas de análisis de datos dedicadas para los datos de IoT, como la visualización de datos, el aprendizaje automático o el análisis predictivo': 10, 'Se utilizan herramientas y técnicas avanzadas de análisis de datos para los datos de IoT, como el análisis en tiempo real, el procesamiento de datos en streaming o la inteligencia artificial (IA) y el aprendizaje profundo': 15, 'No sabe/no contesta': 0 } },
      { text: '¿Dispone su organización de un sistema para detectar malware en sus dispositivos IoT?', component: 'Security', dimension: 'technological', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Dispone la organización de un mecanismo para bloquear el IMEI (Identidad Internacional de Equipo Móvil) del dispositivo a la tarjeta SIM conectada, impidiendo el intercambio de datos no autorizado?', component: 'Security', dimension: 'technological', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Utiliza un punto de acceso privado (APN) para su conectividad IoT con el fin de aislar su red IoT de la Internet pública?', component: 'Security', dimension: 'technological', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Ha implementado el cifrado de extremo a extremo para sus comunicaciones del IoT en la organización?', component: 'Security', dimension: 'technological', answers: { 'Sí': 15, 'No': 1, 'No sabe/no contesta': 0 } },
      { text: '¿Existen iniciativas para explorar el análisis avanzado (IA/ML) de los datos de IoT?', component: 'Contextualization', dimension: 'organizational', answers: { 'No hay iniciativas de IA/ML sobre datos de IoT': 1, 'Exploración inicial de iniciativas de IA/ML sobre datos de IoT': 5, 'Iniciativas de IA/ML sobre datos de IoT en curso': 10, 'Las iniciativas de IA/ML sobre datos de IoT están totalmente implementadas': 15, 'No sabe/no contesta': 0 } },
  ]
};

const componentWeights = {
  'Device Management': 20,
  'Connectivity Management': 20,
  'Cloud/Edge Management': 15,
  'Enterprise Integration': 20,
  Security: 15,
  Compliance: 5,
  Contextualization: 5,
};

const answers = {manager: {}, engineer: {}, technician: {}};

const latinAmericanCountries = [
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'República Dominicana',
  'Ecuador',
  'El Salvador',
  'Guatemala',
  'Haití',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'Uruguay',
  'Venezuela',
];

const otherCountries = [
  'Estados Unidos',
  'Canadá',
  'España',
  'Reino Unido',
  'Francia',
  'Alemania',
  'Italia',
  'China',
  'Japón',
  'India',
  'Australia',
  'Rusia',
  'Sudáfrica',
  'Otro',
];

const industrialActivities = [
  'Agroindustria y Producción de Alimentos',
  'Artesanías y Productos Artesanales',
  'Autopartes y Componentes',
  'Avicultura',
  'Biotecnología',
  'Construcción y Materiales de Construcción',
  'Cuero y Calzado',
  'Electrónica y Electrodomésticos',
  'Energía Renovable',
  'Equipos Médicos y Dispositivos de Salud',
  'Explotación Forestal Sostenible',
  'Fabricación de Muebles',
  'Floricultura',
  'Ganadería',
  'Industria Aeroespacial',
  'Industria Automotriz (ensamblaje de vehículos)',
  'Industria de la Impresión y Gráfica',
  'Industria del Vidrio',
  'Industria Láctea',
  'Industria Naval',
  'Industria Química y Farmacéutica',
  'Mantenimiento de maquinaria',
  'Manufactura Textil y Confección',
  'Metalmecánica',
  'Minería y Procesamiento de Minerales',
  'Petroquímica',
  'Plásticos y Materiales Sintéticos',
  'Procesamiento de Bebidas (alcohólicas y no alcohólicas)',
  'Procesamiento de Carne y Productos Cárnicos',
  'Producción de Cemento y Concreto',
  'Producción de Pulpa de Celulosa',
  'Productos Agrícolas',
  'Productos de Madera',
  'Productos de Papel y Cartón',
  'Reciclaje y Gestión de Residuos',
  'Servicios de Ingeniería y Consultoría para la Industria',
  'Tecnologías de la Información y Software',
  'Textiles de Fibras Naturales',
];

const legalFigures = [
  'Persona Física',
  'Sociedad Anónima',
  'Sociedad Anónima Cerrada',
  'Sociedad de Responsabilidad Limitada',
  'Sociedad Cooperativa',
  'Sociedad en Comandita Simple',
  'Empresa Individual de Responsabilidad Limitada',
  'Sociedad por Acciones Simplificada',
  'Sociedad Colectiva',
  'Sociedad en Comandita por Acciones',
  'Sociedad de Hecho',
  'Cooperativa',
  'Sucursal de Empresa Extranjera',
  'Empresa Unipersonal',
  'Sociedad Civil',
  'Asociación Civil',
  'Fundación',
];

let companyData = {};

function toggleCountryList () {
  const countryType = document.getElementById ('country-type').value;
  const countrySelect = document.getElementById ('country');
  countrySelect.innerHTML = '<option value="">Seleccionar País</option>';

  const countries = countryType === 'latam'
    ? latinAmericanCountries
    : otherCountries;
  countries.forEach (country => {
    const option = document.createElement ('option');
    option.value = country;
    option.text = country;
    countrySelect.add (option);
  });
}

function openTab(tabName) {
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => (content.style.display = 'none'));

  // Ensure the correct tab content is displayed
  const targetTab = document.getElementById(tabName);
  if (targetTab) {
       targetTab.style.display = 'block';
  } else {
       console.error(`Tab content with ID '${tabName}' not found.`);
       // Optionally display the presentation tab as a fallback
       document.getElementById('presentation').style.display = 'block';
       // Also update the active button state if needed
       document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
       document.querySelector('.tabs button[onclick="openTab(\'presentation\')"]')?.classList.add('active');
       return; // Stop further execution if tab not found
  }


  // --- Update active button state ---
  // Find the button corresponding to the tabName
  const clickedButton = document.querySelector(`.tabs button[onclick="openTab('${tabName}')"]`);

  // Remove active class from all buttons
  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));

  // Add active class to the clicked button (if found)
  if (clickedButton) {
      clickedButton.classList.add('active');
  } else {
       // Handle case where button might not be found (e.g., if called programmatically)
       // Maybe activate the presentation button as fallback
       document.querySelector('.tabs button[onclick="openTab(\'presentation\')"]')?.classList.add('active');
  }
   // --- End update active button state ---

  // No automatic loading here anymore
}


function loadCompanyProgress() {
  const companyIdInput = document.getElementById('company-id'); // Get the input element
  const companyId = companyIdInput.value.trim(); // Get the value and remove whitespace
  const progressDiv = document.getElementById('company-progress'); // Get progress display div

  // Clear previous progress display when trying to load
  progressDiv.innerHTML = '';

  // Check if the ID field is empty
  if (!companyId) {
      alert('Por favor, ingrese el ID de su empresa.'); // Ask user to enter ID
      companyIdInput.focus(); // Optionally focus the input field
      return; // Stop execution
  }

  // Proceed with existing logic only if an ID was entered
  if (companyProfiles[companyId]) {
      const progress = checkCompanyProgress(companyId);
      progressDiv.innerHTML = `
          <h3>Progreso de la empresa:</h3>
          <p>Gerente: ${progress.manager.toFixed(2)}%</p>
          <p>Ingeniero: ${progress.engineer.toFixed(2)}%</p>
          <p>Técnico: ${progress.technician.toFixed(2)}%</p>
      `;
      // This part might be redundant now, as the tab is already open
      // document.getElementById('profiles').style.display = 'block';
      // document.getElementById('profiles-tab').style.display = 'inline';
  } else {
      alert(
          'ID de empresa no encontrado. Por favor, verifique el ID o registre una nueva empresa.'
      );
      // Clear progress display again in case of error after trying
       progressDiv.innerHTML = '';
  }
}

function populateDropdowns () {
  toggleCountryList (); // Initialize country list
  // Populate country dropdown
  const countrySelect = document.getElementById ('country');
  latinAmericanCountries.forEach (country => {
    const option = document.createElement ('option');
    option.value = country;
    option.text = country;
    countrySelect.add (option);
  });

  // Populate main activity dropdown
  const activitySelect = document.getElementById ('main-activity');
  industrialActivities.forEach (activity => {
    const option = document.createElement ('option');
    option.value = activity;
    option.text = activity;
    activitySelect.add (option);
  });

  // Populate legal figure dropdown (keep this part as it was)
  const legalFigureSelect = document.getElementById ('legal-figure');
  legalFigures.forEach (figure => {
    const option = document.createElement ('option');
    option.value = figure;
    option.text = figure;
    legalFigureSelect.add (option);
  });
}

async function registerCompany () {
  const registerButton = document.querySelector('#registration-form button');

  if (registerButton) {
      registerButton.disabled = true;
      registerButton.textContent = 'Registrando...';
  }

  try {
      const companyName = document.getElementById ('company-name').value;
      const country = document.getElementById ('country').value;
      const mainActivity = document.getElementById ('main-activity').value;
      const companySize = document.getElementById ('company-size').value;
      const legalFigure = document.getElementById ('legal-figure').value;
      const managerEmail = document.getElementById ('manager-email').value;
      const engineerEmail = document.getElementById ('engineer-email').value;
      const technicianEmail = document.getElementById ('technician-email').value;

      // --- Input Validation ---
      let missingFields = [];
      if (!companyName) missingFields.push("Nombre de la empresa");
      if (!country) missingFields.push("País");
      if (!mainActivity) missingFields.push("Actividad principal");
      if (!companySize) missingFields.push("Tamaño de la empresa");
      if (!legalFigure) missingFields.push("Figura legal");
      if (!managerEmail && !engineerEmail && !technicianEmail) missingFields.push("Al menos un correo electrónico");

      if (missingFields.length > 0) {
          alert (`Por favor, complete los siguientes campos obligatorios:\n- ${missingFields.join('\n- ')}`);
          if (registerButton) { // Re-enable button before returning on validation fail
              registerButton.disabled = false;
              registerButton.textContent = 'Registrar';
          }
          return;
      }
      // --- End Validation ---

      const companyId = generateUniqueId ();
      const companyData = {
        id: companyId,
        companyName,
        country,
        mainActivity,
        companySize,
        legalFigure,
        managerEmail,
        engineerEmail,
        technicianEmail,
        componentScores: {},
        dimensionScores: {},
        overallScore: null
      };

      // Prepare the data to be saved. Create copies to avoid potential modification issues.
      const profilesToSave = JSON.parse(JSON.stringify(companyProfiles)); // Deep copy
      if (!profilesToSave[companyId]) {
          profilesToSave[companyId] = {
            manager: {},
            engineer: {},
            technician: {},
          };
      }

      const allDataToSave = JSON.parse(JSON.stringify(allCompaniesData)); // Deep copy
      allDataToSave.push(companyData);


      // --- Perform Saves Sequentially ---
      console.log("Attempting to save companyProfiles structure (type 1)...");
      await saveInfo (profilesToSave, 1); // Save profile structure
      console.log("Profile structure save successful. Attempting to save company data (type 2)...");
      await saveInfo (allDataToSave, 2); // Save company details array
      console.log("Company data save successful.");
      // --- End Saves ---

      // --- Fetch latest data AFTER saves are confirmed ---
      console.log("Fetching latest data from backend...");
      await fetchData();
      console.log("Local data synchronized.");
      // --- End Fetch ---


      // Send emails asynchronously
      sendRegistrationEmails (
        companyId,
        managerEmail,
        engineerEmail,
        technicianEmail
      );

      alert (`Empresa registrada con éxito! Su ID único es: ${companyId}`);

      // Switch UI
      document.getElementById ('registration').style.display = 'none';
      document.getElementById ('registration-tab').style.display = 'none';
      document.getElementById ('profiles').style.display = 'block';
      document.getElementById ('profiles-tab').style.display = 'inline';

      // Pre-fill ID and clear form
      document.getElementById ('company-id').value = companyId;
      document.getElementById('registration-form').reset();

      // Now loadCompanyProgress should work immediately because fetchData updated local state
      loadCompanyProgress(); // Try calling this automatically

  } catch (error) {
      console.error("Error during company registration:", error);
      // Provide a more user-friendly error message
      alert(`Error al registrar la empresa: ${error.message || 'Ocurrió un problema de comunicación con el servidor.'}. Por favor, revise la consola para más detalles e intente de nuevo.`);
  } finally {
      // Ensure button is re-enabled
      if (registerButton) {
          registerButton.disabled = false;
          registerButton.textContent = 'Registrar';
      }
  }
}

function generateUniqueId () {
  return Date.now ().toString (36) + Math.random ().toString (36).substr (2);
}

function sendRegistrationEmails (
  companyId,
  managerEmail,
  engineerEmail,
  technicianEmail
) {
  // Configurar EmailJS (reemplaza 'YOUR_USER_ID' con tu ID de usuario de EmailJS)
  emailjs.init ('g9Z2DR7zaXpn8GfVK');

  const emailParams = {
    to_email: managerEmail,
    company_id: companyId,
  };

  // Enviar correo al manager
  emailjs.send ('service_t3olazu', 'template_2ptke6v', emailParams).then (
    function (response) {
      console.log (
        'Correo enviado al manager con éxito',
        response.status,
        response.text
      );
    },
    function (error) {
      console.log ('Error al enviar correo al manager', error);
    }
  );

  // Enviar correos a engineer y technician si se proporcionaron sus correos
  if (engineerEmail) {
    emailParams.to_email = engineerEmail;
    emailjs.send ('service_t3olazu', 'template_2ptke6v', emailParams);
  }
  if (technicianEmail) {
    emailParams.to_email = technicianEmail;
    emailjs.send ('service_t3olazu', 'template_2ptke6v', emailParams);
  }
}

function selectProfile (profile) {
  const companyId = document.getElementById ('company-id').value;
  if (!companyId || !companyProfiles[companyId]) {
    alert ('Por favor, ingrese un ID de empresa válido.');
    return;
  }

  document.getElementById ('profiles').style.display = 'none';
  document.getElementById ('model').style.display = 'block';
  document.getElementById ('model-tab').style.display = 'inline';

  loadQuestions (profile, companyId);
}

function loadQuestions (profile, companyId) {
  const questionsContainer = document.getElementById ('questions-container');
  questionsContainer.innerHTML = '';

  questions[profile].forEach ((question, index) => {
    const questionDiv = document.createElement ('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `<h3>${question.text} <span class="question-meta">(${question.component} / ${question.dimension})</span></h3>`;


    for (const answer in question.answers) {
      const answerValue = question.answers[answer];
      const radioButtonName = `${profile}-q${index}`;
      const checked = companyProfiles[companyId][profile][index] == answerValue
        ? 'checked'
        : '';
      questionDiv.innerHTML += `<input type="radio" name="${radioButtonName}" value="${answerValue}" ${checked}> ${answer}<br>`;
    }

    questionsContainer.appendChild (questionDiv);
  });
  showSaveButton (profile, companyId);
  updateCalculateButton (companyId);
}

async function saveAnswers (profile, companyId) { // Make the function async
  let allAnswered = true;
  const saveButton = document.getElementById(`save-button-${profile}`); // Get the button

  // Disable button and show loading state immediately
  if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent = 'Guardando...'; // Visual feedback
  }

  try {
      const questionDivs = document.querySelectorAll ('#questions-container .question'); // Be more specific with selector
      questionDivs.forEach ((questionDiv, index) => {
        const radioButtonName = `${profile}-q${index}`;
        const selectedAnswer = questionDiv.querySelector (
          `input[name="${radioButtonName}"]:checked`
        );
        if (selectedAnswer) {
          // Ensure the profile object exists before assigning
          if (!companyProfiles[companyId]) companyProfiles[companyId] = {};
          if (!companyProfiles[companyId][profile]) companyProfiles[companyId][profile] = {};
          companyProfiles[companyId][profile][index] = parseInt (
            selectedAnswer.value
          );
        } else {
          allAnswered = false;
        }
      });

      if (allAnswered) {
        // --- Await the saveInfo operation ---
        console.log(`Attempting to save answers for ${profile}...`);
        // The local companyProfiles is already updated above
        await saveInfo (companyProfiles, 1); // Wait for saveInfo to complete
        console.log(`Answers saved successfully for ${profile}.`);
        alert (`Respuestas guardadas para ${profile} de la empresa ${companyId}!`);
        // Note: saveInfo internally calls fetchData on success, which updates the local state again.
      } else {
        alert (
          `Por favor, responda todas las preguntas para ${profile} antes de guardar.`
        );
      }
      // Update the calculate button state regardless of save success/failure,
      // as the local answers might have changed.
      updateCalculateButton (companyId);

  } catch (error) {
      console.error(`Error saving answers for ${profile}:`, error);
      alert(`Error al guardar las respuestas para ${profile}. Por favor, intente de nuevo. Detalles: ${error.message}`);
  } finally {
      // Re-enable button and restore text AFTER the operation completes (success or failure)
      if (saveButton) {
          saveButton.disabled = false;
          saveButton.textContent = `Guardar respuestas de ${profile
            .charAt (0)
            .toUpperCase () + profile.slice (1)}`;
      }
  }
}


function componentName (dimension) {
  for (const component in componentWeights) {
    if (component.includes (dimension)) {
      // Check if the dimension is present in component name
      return component;
    }
  }
  return component;
}



// script.js

// ... (keep all other code the same) ...

async function calculateScore (companyId) { // Stays async
  const resultsDiv = document.getElementById ('results');
  resultsDiv.innerHTML = ''; // Clear previous results
  resultsDiv.classList.remove('show'); // Hide results area initially

  // --- Add loading indicator ---
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-feedback'; // Use this ID to find and remove later
  // You can add more styling or a spinner GIF/SVG here if desired
  loadingDiv.innerHTML = '<p style="text-align: center; padding: 30px; font-style: italic; color: var(--secondary-color);">Calculando puntuaciones y generando comentarios personalizados, por favor espere...</p>';
  resultsDiv.appendChild(loadingDiv);
  resultsDiv.classList.add('show'); // Show the loading message immediately
  // ---

  // --- Find Company Data (Crucial Step) ---
  const companyIndex = allCompaniesData.findIndex(company => company.id === companyId);
  let companyInfo = null;

  if (companyIndex !== -1) {
      companyInfo = allCompaniesData[companyIndex];
      console.log("Found company info for feedback:", companyInfo.companyName);
  } else {
      console.error(`Error: Company data not found for ID ${companyId} when trying to calculate scores.`);
      // Remove loading indicator before showing error
      const loadingElement = document.getElementById('loading-feedback');
      if (loadingElement) loadingElement.remove();
      alert("Error crítico: No se encontró la información de la empresa. No se pueden calcular los resultados ni generar feedback.");
      resultsDiv.classList.remove('show'); // Hide results area again on error
      return; // Stop execution
  }
  // --- End Find Company Data ---

  try { // Wrap the main processing in a try block to ensure loading removal even on error

      // Crear el título principal (append later)
      const titleDiv = document.createElement ('div');
      titleDiv.innerHTML =
      '<h2 class="results-main-title">Resultados obtenidos con FREEPORT</h2>';

      const componentScores = {};
      let overallScore = 0;
      const dimensionScores = {technological: 0, human: 0, organizational: 0};

      // Initialize component scores
      for (const component in componentWeights) {
          componentScores[component] = 0;
      }

      // Calculate component and dimension scores
      if (companyProfiles[companyId]) {
          // ... (Your existing score calculation logic - keep it as is) ...
          for (const profile in companyProfiles[companyId]) {
              if (questions[profile]) {
                  questions[profile].forEach ((question, index) => {
                  if (companyProfiles[companyId][profile] && companyProfiles[companyId][profile].hasOwnProperty(index)) {
                      const score = companyProfiles[companyId][profile][index];
                      const componentName = question.component;
                      const dimensionName = question.dimension;

                      if (componentName && componentWeights.hasOwnProperty(componentName)) {
                          const maxPointsForQuestion = 15;
                          let numQuestionsComponent = 0;
                          for (const prof in questions) {
                              if(questions[prof]) {
                                  numQuestionsComponent += questions[prof].filter(
                                      q => q.component === componentName
                                  ).length;
                              }
                          }
                          if (numQuestionsComponent > 0) {
                              componentScores[componentName] +=
                                  (score / maxPointsForQuestion) *
                                  componentWeights[componentName] *
                                  (1 / numQuestionsComponent);
                          } else {
                              console.warn(`Component ${componentName} seems to have no questions.`);
                          }
                      } else if (componentName) {
                          console.warn(`Weight not found for component: ${componentName}`);
                      }

                      if (dimensionName && dimensionScores.hasOwnProperty(dimensionName)) {
                          dimensionScores[dimensionName] += score;
                      } else if (dimensionName) {
                          console.warn(`Dimension score object does not have key: ${dimensionName}`);
                      }

                  }
                  });
              } else {
                  console.warn(`Profile "${profile}" not found in questions definition.`);
              }
          }
      } else {
          console.error(`Error: Profile data for company ID ${companyId} not found.`);
          // Remove loading before alert
          const loadingElement = document.getElementById('loading-feedback');
          if (loadingElement) loadingElement.remove();
          alert("Error: No se encontraron los datos de los perfiles para esta empresa. No se pueden calcular los resultados.");
          resultsDiv.classList.remove('show');
          return; // Exit if no profile data
      }


      // Calculate overall score
      overallScore = 0;
      for (const component in componentScores) {
          overallScore += componentScores[component];
      }
      overallScore = Math.min(overallScore, 100); // Cap at 100


      // --- Update company data and Save ---
      const updatedCompanyData = {
          ...companyInfo,
          componentScores,
          dimensionScores,
          overallScore,
      };
      allCompaniesData[companyIndex] = updatedCompanyData;

      try {
          console.log("Attempting to save updated company data with scores...");
          await saveInfo(allCompaniesData, 2); // Wait for save to complete
          console.log('Company data with scores saved successfully.');
      } catch (error) {
          console.error('Error saving company data with scores:', error);
          alert("Advertencia: Hubo un error al guardar los puntajes calculados. Los resultados se mostrarán, pero podrían no estar persistidos.");
          // Decide if you want to proceed or stop if saving fails. Currently proceeds.
      }
      // --- End Save ---


      // --- Generate Feedback using Gemini ---
      let feedbackText = "Feedback generation is currently unavailable."; // Default
      const scoresForFeedback = {
          overallScore: overallScore,
          componentScores: componentScores,
          dimensionScores: dimensionScores
      };
      try {
          console.log("Generating AI feedback (this might take a moment)...");
          feedbackText = await generateFeedbackWithGemini(scoresForFeedback, companyInfo);
          console.log("AI feedback generated.");
      } catch (error) {
          console.error("Failed to generate feedback:", error);
          alert("Advertencia: No se pudo generar el feedback de la IA. Se mostrarán los puntajes básicos.");
          // Use the default feedbackText.
      }
      // --- End Generate Feedback ---


      // --- Remove loading indicator ---
      // IMPORTANT: Do this *after* the potentially slow operations (save, AI call)
      // and *before* adding the final content.
      const loadingElement = document.getElementById('loading-feedback');
      if (loadingElement) {
          loadingElement.remove();
      }
      // ---

      // --- Now add the title and results ---
      resultsDiv.appendChild(titleDiv); // Add the title first

      // --- Display Charts and Scores ---
      const chartsDiv = document.createElement ('div');
      chartsDiv.className = 'charts-container';
      for (let i = 0; i < 3; i++) {
          const canvas = document.createElement ('canvas');
          canvas.id = `chart${i}`;
          chartsDiv.appendChild (canvas);
      }
      resultsDiv.appendChild (chartsDiv);

      // Destroy existing charts if they exist
      ['chart0', 'chart1', 'chart2'].forEach(id => {
          const chartInstance = Chart.getChart(id);
          if (chartInstance) {
              chartInstance.destroy();
          }
      });

      createComponentChart (componentScores);
      createDimensionChart (dimensionScores);
      createOverallScoreChart (overallScore);

      // --- Display Scores Text ---
      let scoresText = `
          <div class="results-section"> <div class="scores-container"> <h3>Puntuación por Componentes</h3> <ul>`;
      for (const component in componentScores) {
          scoresText += `<li><b>${component}:</b> ${componentScores[component]?.toFixed (2) ?? 'N/A'}</li>`;
      }
      scoresText += `</ul></div></div> <div class="results-section"> <div class="scores-container"> <h3>Puntuación por Dimensiones (Puntaje Bruto)</h3> <ul>`;
      for (const dimension in dimensionScores) {
          const dimensionCapitalized = dimension.charAt(0).toUpperCase() + dimension.slice(1);
          scoresText += `<li><b>${dimensionCapitalized}:</b> ${dimensionScores[dimension]?.toFixed(2) ?? 'N/A'}</li>`;
      }
      scoresText += `</ul> </div> </div> <div class="results-section"> <div class="scores-container"> <h3>Puntuación General</h3> <p><b>Puntuación total obtenida con FREEPORT:</b> ${overallScore.toFixed (2)} / 100</p> </div> </div>`;

      const scoresDiv = document.createElement ('div');
      scoresDiv.innerHTML = scoresText;
      resultsDiv.appendChild (scoresDiv);


      // --- Display AI Feedback ---
      const feedbackDiv = document.createElement('div');
      feedbackDiv.className = 'results-section ai-feedback-section'; // Add a specific class if you want to style it
      feedbackDiv.innerHTML = `
          <h3><i class="fas fa-lightbulb"></i> Análisis y Recomendaciones (IA)</h3>
          <div class="ai-feedback-content">
              ${feedbackText
                  .replace(/\n\*\s/g, '<br>• ')
                  .replace(/\n\-/g, '<br>• ')
                  .replace(/\n/g, '<br>')
                  .replace(/### (.*?)<br>/g, '<h4>$1</h4><br>')
                  .replace(/## (.*?)<br>/g, '<h3>$1</h3><br>')
                  .replace(/# (.*?)<br>/g, '<h2>$1</h2><br>')
                  .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                  .replace(/\*(.*?)\*/g, '<i>$1</i>')
              }
          </div>
          <small><i>Nota: Esta retroalimentación es generada por inteligencia artificial basada en sus puntuaciones y puede servir como guía inicial.</i></small>
      `;
      resultsDiv.appendChild(feedbackDiv);
      // --- End Display AI Feedback ---

      // Ensure results are visible (already done when adding loading, but safe to keep)
      resultsDiv.classList.add ('show');

      // --- Send Email with Feedback ---
      // This happens after results are displayed, which is fine.
      console.log("Preparing to send results email after display...");
      await sendResultsEmailWithFeedback(companyId, companyInfo, scoresForFeedback, feedbackText);
      console.log("Email sending process initiated.");


  } catch (generalError) {
      // Catch any unexpected errors during the main processing
      console.error("An unexpected error occurred during score calculation:", generalError);

      // Ensure loading indicator is removed even if a general error occurs
      const loadingElement = document.getElementById('loading-feedback');
      if (loadingElement) {
          loadingElement.remove();
      }

      // Display an error message in the results area
      resultsDiv.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">Ocurrió un error al calcular los resultados. Por favor, intente de nuevo o contacte al soporte.</p>`;
      resultsDiv.classList.add('show'); // Make sure the error message is visible
  }
}





async function sendResultsEmailWithFeedback(companyId, companyInfo, scores, feedbackText) {
  console.log(`Attempting to send results email for ${companyInfo.companyName} (ID: ${companyId})`);

  const managerEmail = companyInfo.managerEmail;
  const engineerEmail = companyInfo.engineerEmail;
  const technicianEmail = companyInfo.technicianEmail;
  const companyName = companyInfo.companyName;

  // --- Format Scores for HTML Email ---
  let componentScoresHtml = '<ul>';
  for (const component in scores.componentScores) {
      componentScoresHtml += `<li><b>${component}:</b> ${scores.componentScores[component]?.toFixed(2) ?? 'N/A'}</li>`;
  }
  componentScoresHtml += '</ul>';

  let dimensionScoresHtml = '<ul>';
  for (const dimension in scores.dimensionScores) {
      const dimensionCapitalized = dimension.charAt(0).toUpperCase() + dimension.slice(1);
      dimensionScoresHtml += `<li><b>${dimensionCapitalized}:</b> ${scores.dimensionScores[dimension]?.toFixed(2) ?? 'N/A'}</li>`;
  }
  dimensionScoresHtml += '</ul>';
  // --- End Format Scores ---


  // --- Format AI Feedback for HTML Email ---
  const feedbackHtml = feedbackText
        .replace(/\n\*\s/g, '<br>• ')
        .replace(/\n\-/g, '<br>• ')
        .replace(/\n/g, '<br>')
        .replace(/### (.*?)<br>/g, '<h4>$1</h4><br>')
        .replace(/## (.*?)<br>/g, '<h3>$1</h3><br>')
        .replace(/# (.*?)<br>/g, '<h2>$1</h2><br>')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>');
   // --- End Format Feedback ---

  // --- Prepare Base Email Parameters ---
  // ***** CORRECTED VERSION *****
  const baseEmailParams = {
      company_name: companyName,
      company_id: companyId,
      overall_score: scores.overallScore.toFixed(2),
      component_scores_html: componentScoresHtml,
      dimension_scores_html: dimensionScoresHtml,
      // ADD THE AI FEEDBACK HERE with the key matching the template {{{ai_feedback}}}
      ai_feedback: feedbackHtml
  };
  // ***** END CORRECTION *****

  const serviceID = 'service_t3olazu';
  const resultsTemplateID = 'template_qfq5d68';

  // --- Determine Recipients ---
  const emailsToSend = [];
  if (managerEmail && managerEmail.trim() !== '') emailsToSend.push(managerEmail.trim());
  if (engineerEmail && engineerEmail.trim() !== '') emailsToSend.push(engineerEmail.trim());
  if (technicianEmail && technicianEmail.trim() !== '') emailsToSend.push(technicianEmail.trim());

  if (emailsToSend.length === 0) {
      console.warn(`No valid email addresses found for company ${companyId}. Cannot send results email.`);
      alert("Advertencia: No se encontraron correos electrónicos válidos para enviar los resultados.");
      return;
  }
  console.log(`Will send results to: ${emailsToSend.join(', ')}`);
  // --- End Determine Recipients ---


  // --- Send Email Loop ---
  let emailsSentSuccessfully = 0;
  for (const email of emailsToSend) {
      // Spread the base params and add the specific recipient email
      const emailParams = { ...baseEmailParams, to_email: email };
      try {
          console.log(`Sending results email to ${email}...`);
          const response = await emailjs.send(serviceID, resultsTemplateID, emailParams);
          console.log(`Results email sent successfully to ${email}`, response.status, response.text);
          emailsSentSuccessfully++;
      } catch (error) {
          console.error(`Failed to send results email to ${email}:`, error);
          if (error.text) {
              console.error("EmailJS Error Details:", error.text);
          }
      }
  }
  // --- End Send Email Loop ---

  // --- Final User Feedback ---
  if (emailsSentSuccessfully > 0 && emailsSentSuccessfully === emailsToSend.length) {
       alert(`¡Resultados y análisis enviados por correo electrónico a ${emailsToSend.join(', ')}!`);
  } else if (emailsSentSuccessfully > 0) {
       alert(`Resultados enviados a ${emailsSentSuccessfully} de ${emailsToSend.length} correos. Hubo problemas enviando a los demás. Revise la consola.`);
  } else {
       alert(`Error: No se pudieron enviar los resultados por correo electrónico. Por favor, revise la consola para más detalles.`);
  }
  console.log("Finished processing results emails.");
}


// --- NEW FUNCTION to Send Results Email ---
function sendResultsEmail(params) {
  const serviceID = 'service_t3olazu'; // Verify this is your correct Service ID
  const templateID = 'template_qfq5d68'; // Use the NEW Template ID you created

  // Ensure EmailJS is initialized (it should be from sendRegistrationEmails, but doesn't hurt to check)
  if (typeof emailjs === 'undefined') {
      console.error("EmailJS library not loaded!");
      alert("Error: La librería para enviar correos no está cargada.");
      return;
  }
   // Re-init just in case, although usually not necessary if loaded globally
  emailjs.init ('g9Z2DR7zaXpn8GfVK'); // Your User ID / Public Key

  emailjs.send(serviceID, templateID, params)
      .then(function(response) {
         console.log('Correo de resultados enviado con éxito!', response.status, response.text);
         // Optional feedback to the user
         alert('¡Un resumen de los resultados ha sido enviado al correo electrónico del gerente registrado!');
      }, function(error) {
         console.error('Error al enviar correo de resultados:', error);
         // Inform the user about the failure
         alert('Hubo un error al intentar enviar el correo con los resultados. Sin embargo, los resultados se muestran en pantalla. Por favor, revise la consola para más detalles del error.');
      });
}

function createComponentChart (componentScores) {
  const ctx = document.getElementById ('chart0').getContext ('2d');
  new Chart (ctx, {
    type: 'bar',
    data: {
      labels: Object.keys (componentScores),
      datasets: [
        {
          label: 'Puntuaciones por Componente',
          data: Object.values (componentScores),
          backgroundColor: 'rgba(52, 152, 219, 0.5)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, //  Permite ajustar el tamaño del canvas
      aspectRatio: 1.5,
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: Math.max (...Object.values (componentScores)) * 1.1,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Puntuaciones por Componente',
        },
      },
    },
  });
}

function createDimensionChart (dimensionScores) {
  const ctx = document.getElementById ('chart1').getContext ('2d');
  new Chart (ctx, {
    type: 'radar',
    data: {
      labels: Object.keys (dimensionScores),
      datasets: [
        {
          label: 'Puntuaciones por Dimensión',
          data: Object.values (dimensionScores),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, //  Permite ajustar el tamaño del canvas
      aspectRatio: 1.5,
      scales: {
        r: {
          beginAtZero: true,
          suggestedMax: Math.max (...Object.values (dimensionScores)) * 1.1,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Puntuaciones por Dimensión',
        },
      },
    },
  });
}

function createOverallScoreChart (overallScore) {
  const ctx = document.getElementById ('chart2').getContext ('2d');
  new Chart (ctx, {
    type: 'doughnut',
    data: {
      labels: ['Puntuación', 'Restante'],
      datasets: [
        {
          data: [overallScore, 100 - overallScore],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(201, 203, 207, 0.6)',
          ],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(201, 203, 207, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Permite ajustar el tamaño
      aspectRatio: 1.5, // Relación de aspecto. 1 = circular. >1 más ancho que alto.
      circumference: 180,
      rotation: -90,
      plugins: {
        title: {
          display: true,
          text: 'Puntuación General',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed}%`;
            },
          },
        },
      },
    },
  });
}

function resetForm () {
  // 1. Clear answers
  for (const profile in answers) {
    answers[profile] = {};
  }

  // 2. Reset form fields (registration form)
  document.getElementById ('registration-form').reset ();

  // 3. Clear results
  document.getElementById ('results').innerHTML = '';

  // 4. Reset questions container
  document.getElementById ('questions-container').innerHTML = '';

  // 5. Show registration tab and hide others
  document.getElementById ('registration').style.display = 'block';
  document.getElementById ('registration-tab').style.display = 'inline';
  document.getElementById ('model').style.display = 'none';
  document.getElementById ('model-tab').style.display = 'none';
  document.getElementById ('presentation').style.display = 'none';

  // 6. Clear company data.
  companyData = {};
  companyData = {};
  companyProfiles = {};

  // 7. Reset country list in case the user changed it.
  toggleCountryList ();

  // 8. Go back to the presentation tab (optional)
  openTab ('presentation');

  // 9. Reset Calculate Score button state.
  const calculateButton = document.querySelector (
    'button[onclick="calculateScore()"]'
  );
  if (calculateButton) {
    calculateButton.disabled = true;
  }
}

function exportToExcel() {
  console.log('Iniciando exportación a Excel...');

  try {
    if (!allCompaniesData || allCompaniesData.length === 0) {
      console.error('No hay datos para exportar');
      alert(
        'No hay datos para exportar. Por favor, asegúrese de que hay empresas registradas con datos completos.'
      );
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws_data = [];

    // Encabezados
    ws_data.push([
      'Company Name',
      'Country',
      'Main Activity',
      'Company Size',
      'Legal Figure',
      'Device Management',
      'Connectivity Management',
      'Cloud/Edge Management',
      'Enterprise Integration',
      'Security',
      'Compliance',
      'Contextualization',
      'Technological Dimension',
      'Human Dimension',
      'Organizational Dimension',
      'Overall Score',
    ]);

    // Agregar datos de todas las empresas
    allCompaniesData.forEach((company, index) => {
      try {
        ws_data.push([
          company.companyName || 'N/A',
          company.country || 'N/A',
          company.mainActivity || 'N/A',
          company.companySize || 'N/A',
          company.legalFigure || 'N/A',
          company.componentScores?.['Device Management'] !== undefined
            ? parseFloat(company.componentScores['Device Management'].toFixed(2))
            : null,
          company.componentScores?.['Connectivity Management'] !== undefined
            ? parseFloat(
                company.componentScores['Connectivity Management'].toFixed(2)
              )
            : null,
          company.componentScores?.['Cloud/Edge Management'] !== undefined
            ? parseFloat(
                company.componentScores['Cloud/Edge Management'].toFixed(2)
              )
            : null,
          company.componentScores?.['Enterprise Integration'] !== undefined
            ? parseFloat(
                company.componentScores['Enterprise Integration'].toFixed(2)
              )
            : null,
          company.componentScores?.['Security'] !== undefined
            ? parseFloat(company.componentScores['Security'].toFixed(2))
            : null,
          company.componentScores?.['Compliance'] !== undefined
            ? parseFloat(company.componentScores['Compliance'].toFixed(2))
            : null,
          company.componentScores?.['Contextualization'] !== undefined
            ? parseFloat(
                company.componentScores['Contextualization'].toFixed(2)
              )
            : null,
          company.dimensionScores?.technological !== undefined
            ? parseFloat(company.dimensionScores.technological.toFixed(2))
            : null,
          company.dimensionScores?.human !== undefined
            ? parseFloat(company.dimensionScores.human.toFixed(2))
            : null,
          company.dimensionScores?.organizational !== undefined
            ? parseFloat(company.dimensionScores.organizational.toFixed(2))
            : null,
          company.overallScore !== undefined
            ? parseFloat(company.overallScore.toFixed(2))
            : null,
        ]);
      } catch (companyError) {
        console.error(
          `Error procesando la empresa en el índice ${index}:`,
          companyError
        );
        // Continuar con la siguiente empresa
      }
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Ajustar el ancho de las columnas
    const columnWidths = ws_data[0].map((_, index) => ({
      wch: Math.max(
        ...ws_data.map(row => (row[index] ? row[index].toString().length : 0))
      ),
    }));
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Maturity Data');

    // Usar un nombre de archivo con timestamp para evitar problemas de caché
    const fileName = `maturity_data_${Date.now()}.xlsx`;
    XLSX.writeFile(wb, fileName);

    console.log('Exportación a Excel completada con éxito');
  } catch (error) {
    console.error('Error durante la exportación a Excel:', error);
    alert(
      'Ocurrió un error durante la exportación. Por favor, intente nuevamente y si el problema persiste, contacte al soporte técnico.'
    );
  }
}

// In script.js

function showSaveButton(profile, companyId) {
  const buttonsContainer = document.getElementById('buttons-container');
  buttonsContainer.innerHTML = ''; // Clear previous buttons

  // --- Existing Save Button ---
  const saveButton = document.createElement('button');
  saveButton.id = `save-button-${profile}`; // Keep the existing ID
  saveButton.textContent = `Guardar respuestas de ${profile
      .charAt(0)
      .toUpperCase() + profile.slice(1)}`;
  saveButton.onclick = () => saveAnswers(profile, companyId);
  saveButton.classList.add('form-button'); // Add class for styling if needed
  buttonsContainer.appendChild(saveButton);

  // --- NEW Clear Answers Button ---
  const clearButton = document.createElement('button');
  clearButton.id = `clear-button-${profile}`; // Optional ID for the new button
  clearButton.textContent = `Limpiar mis respuestas`;
  // Call the new clear function, passing the current profile and companyId
  clearButton.onclick = () => clearProfileAnswers(profile, companyId);
  // Add classes for styling - maybe a secondary look
  clearButton.classList.add('form-button', 'secondary-button');
  buttonsContainer.appendChild(clearButton);
  // --- End NEW ---
}


// Add this new function in script.js

function clearProfileAnswers(profile, companyId) {
  console.log(`Clearing answers for profile: ${profile}, companyId: ${companyId}`);

  // 1. Confirm with the user
  if (!confirm(`¿Está seguro de que desea borrar todas las respuestas seleccionadas para el perfil '${profile}'? Esta acción no se puede deshacer hasta que responda de nuevo.`)) {
      return; // Stop if user cancels
  }

  // 2. Find all question divs currently displayed
  const questionDivs = document.querySelectorAll('#questions-container .question');

  // 3. Iterate through questions and deselect radio buttons for the current profile
  questionDivs.forEach((questionDiv, index) => {
      const radioButtonName = `${profile}-q${index}`;
      const radioButtons = questionDiv.querySelectorAll(`input[type="radio"][name="${radioButtonName}"]`);
      radioButtons.forEach(radio => {
          radio.checked = false;
      });
  });

  // 4. Clear the corresponding data in the local companyProfiles object
  //    This is crucial so that if they save later without re-answering,
  //    the cleared state is reflected.
  if (companyProfiles[companyId] && companyProfiles[companyId][profile]) {
      companyProfiles[companyId][profile] = {}; // Reset this profile's answers to an empty object
      console.log(`Local data cleared for ${profile}`);
  }

  // 5. Provide feedback to the user
  alert(`Las respuestas para el perfil '${profile}' han sido borradas. Por favor, selecciónelas de nuevo si desea guardarlas.`);

  // 6. Update the "Calculate Score" button state
  //    Since answers are now missing, the calculation should likely be disabled.
  updateCalculateButton(companyId);
}

function loginAdmin () {
  const password = document.getElementById ('admin-password').value;
  // En un entorno real, esta verificación debería hacerse en el servidor
  if (password === 'admin123') {
    // Cambia esto por una contraseña segura
    document.getElementById ('admin-login').style.display = 'none';
    document.getElementById ('admin-panel').style.display = 'block';
  } else {
    alert ('Contraseña incorrecta');
  }
}

async function resetAllData() { // Make async
  if (
    confirm(
      '¿Está seguro de que desea borrar todos los datos? Esta acción no se puede deshacer.'
    )
  ) {
    try {
      // Call the async delete function and wait for it
      await deleteInfo();

      // Clear any data shown in the interface
      document.getElementById('results').innerHTML = '';
      document.getElementById('questions-container').innerHTML = '';
      document.getElementById('company-progress').innerHTML = '';
      // Optionally clear form fields too if needed

      alert('Todos los datos han sido borrados exitosamente.');

      // Optional: redirect the user to the home page or reload the page
      window.location.reload();

    } catch (error) {
       // The error should have been logged by deleteInfo, but we can alert here too
       alert('Ocurrió un error al intentar borrar los datos.');
    }
  }
}

function updateCalculateButton(companyId) {
  let allProfilesAnswered = true;
  
  for (const profile in companyProfiles[companyId]) {
    if (
      !questions[profile].every(
        (_, index) => companyProfiles[companyId][profile][index] != null
      )
    ) {
      allProfilesAnswered = false;
      break;
    }
  }

  const calculateButton = document.querySelector(
    'button[onclick="calculateScore()"]'
  );
  if (calculateButton) {
    calculateButton.disabled = !allProfilesAnswered;
    calculateButton.onclick = () => calculateScore(companyId);
  }
}


/* function updateCalculateButton (companyId) {
  let allProfilesAnswered = true;
  for (const profile in companyProfiles[companyId]) {
    console.log(profile)
    if (
      !questions[profile].every (
        (_, index) => companyProfiles[companyId][profile][index]
      )
    ) {
      console.log(companyProfiles) 
      allProfilesAnswered = false;
      break;
    }
  }

  const calculateButton = document.querySelector (
    'button[onclick="calculateScore()"]'
  );
  if (calculateButton) {
    calculateButton.disabled = !allProfilesAnswered;
    calculateButton.onclick = () => calculateScore (companyId);
  }
} */

function checkCompanyProgress (companyId) {
  const progress = {
    manager: 0,
    engineer: 0,
    technician: 0,
  };

  for (const profile in companyProfiles[companyId]) {
    const answeredQuestions = Object.keys (companyProfiles[companyId][profile])
      .length;
    const totalQuestions = questions[profile].length;
    progress[profile] = answeredQuestions / totalQuestions * 100;
  }

  return progress;
}

function initializePage () {
  // Initialize EmailJS ONCE here
  try {
    emailjs.init("g9Z2DR7zaXpn8GfVK"); // Your EmailJS Public Key (User ID)
    console.log("EmailJS Initialized on page load.");
  } catch(e) {
    console.error("Failed to initialize EmailJS on page load. Email sending might fail.", e);
    alert("Error: Could not initialize the email service. Please check console.");
  }

  populateDropdowns ();
  openTab ('presentation');
  fetchData (); // Load data from backend/Apps Script
}

/* Implementacin de funcion asicronca que conecta con api encargada de almacenar infomracin en base de datos*/

// In saveInfo, REMOVE the fetchData call
async function saveInfo (dataToSave, tipo) {
  const url = urlbase; // Apps script URL handles routing via doPost

  const jsonDataPayload = {
    json: JSON.stringify(dataToSave),
    tipo: tipo,
  };

  try {
    console.log(`Sending data (type ${tipo}) to Apps Script...`);
    const response = await fetch (url, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: {
         'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(jsonDataPayload),
    });

    if (!response.ok) {
       let errorText = response.statusText;
       try {
          const errorBody = await response.text();
          // Avoid logging large HTML error pages if Apps Script returns one
          if (errorBody && !errorBody.trim().startsWith('<')) {
              errorText += ` - ${errorBody}`;
          }
       } catch (e) { /* Ignore if cannot read body */ }
       throw new Error(`Error saving data (type ${tipo}): ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`Apps Script Response for type ${tipo}:`, result);

    // --- REMOVED THIS LINE ---
    // await fetchData(); // <-- REMOVE THIS FETCH FROM HERE

    // Check if Apps Script explicitly signaled an error in its JSON response
    if (result && result.status === 'error') {
        throw new Error(`Apps Script reported error for type ${tipo}: ${result.message || 'Unknown error'}`);
    }

    return result; // Return the parsed response from Apps Script

  } catch (error) {
    console.error (`Error in saveInfo for type ${tipo}:`, error);
    throw error; // Re-throw the error to be caught by the calling function (registerCompany)
  }
}

//extraccion de base ded atos y almacenado en los json definidos
async function fetchData() {
  const url = urlbase; // GET requests go to the same URL

  try {
    console.log("Fetching data from Apps Script...");
    const response = await fetch(url, {
       method: 'GET',
       mode: 'cors',
       redirect: 'follow' // Important for Apps Script GET requests
    });

    if (!response.ok) {
      // Try to get more details from the response body if possible
       let errorText = response.statusText;
       try {
          const errorBody = await response.text();
          errorText += ` - ${errorBody}`;
       } catch (e) { /* Ignore if cannot read body */ }
      throw new Error(`Error fetching data: ${response.status} - ${errorText}`);
    }

    // Apps script doGet returns an array of {json, tipo} objects stringified
    const dataArray = await response.json();
    console.log("Data received from Apps Script:", dataArray);
    getData(dataArray); // Call existing getData function

  } catch (error) {
    console.error('Error fetching data via Apps Script:', error);
    // Reset local data on fetch error to prevent using stale data
    companyProfiles = {};
    allCompaniesData = [];
  }
}

function getData (json) {
  json.forEach (item => {
    try {
      const jsonObject = JSON.parse (item.json); // Parsear el JSON del campo "json"

      // Actualizar variables globales en base al tipo
      if (item.tipo === 1) {
        companyProfiles = jsonObject;
      } else if (item.tipo === 2) {
        allCompaniesData = jsonObject;
      }
    } catch (error) {
      console.error (
        `Error al parsear el JSON del item con ID ${item.id}:`,
        error.message
      );
    }
  });
}

async function deleteInfo() {
  const url = urlbase;

  // Payload indicating a delete operation
  const jsonDataPayload = {
    tipo: 'delete'
  };

  try {
    console.log("Sending delete request to Apps Script...");
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(jsonDataPayload),
    });

    if (!response.ok) {
       let errorText = response.statusText;
       try {
          const errorBody = await response.text();
          errorText += ` - ${errorBody}`;
       } catch (e) { /* Ignore if cannot read body */ }
       throw new Error(`Error deleting data: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Apps Script Delete Response:', result);

    // Clear local data immediately after successful deletion
    companyProfiles = {};
    allCompaniesData = [];

    // Optionally refresh the page or UI state here
    // alert('Todos los datos han sido borrados exitosamente.'); // Already handled in resetAllData
    // window.location.reload(); // Already handled in resetAllData

  } catch (error) {
    console.error('Error deleting data via Apps Script:', error);
    alert('Error al borrar los datos. Verifique la consola para más detalles.');
    // Rethrow or handle as needed
    throw error;
  }
}

// Ejecutar la función cuando el HTML esté completamente cargado

document.addEventListener ('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll ('.tabs button');
  const tabContents = document.querySelectorAll ('.tab-content');

  tabs.forEach ((tab, index) => {
    tab.addEventListener ('click', () => {
      tabs.forEach (t => t.classList.remove ('active'));
      tabContents.forEach (tc => tc.classList.remove ('active'));

      tab.classList.add ('active');
      tabContents[index].classList.add ('active');
    });
  });
});



async function generateFeedbackWithGemini(scores, companyInfo) {
  console.log("Generating feedback for:", companyInfo.companyName, "Scores:", scores);
  // --- Prompt Engineering ---
  // Craft a prompt that tells the AI what to do.
  const prompt = `
You are an expert consultant specializing in IoT maturity for Small and Medium Enterprises (SMEs).
Analyze the following IoT maturity scores for an SME named "${companyInfo.companyName}".
The company's main activity is: ${companyInfo.mainActivity}.
The company size is: ${companyInfo.companySize}.

The scores are calculated based on the FREEPORT model. Higher scores indicate higher maturity.
The maximum possible overall score is 100. Component scores contribute percentages to this total.

Scores:
- Overall Score: ${scores.overallScore.toFixed(2)} / 100
- Component Scores:
    - Device Management: ${scores.componentScores['Device Management']?.toFixed(2) ?? 'N/A'} (Weight: ${componentWeights['Device Management']}%)
    - Connectivity Management: ${scores.componentScores['Connectivity Management']?.toFixed(2) ?? 'N/A'} (Weight: ${componentWeights['Connectivity Management']}%)
    - Cloud/Edge Management: ${scores.componentScores['Cloud/Edge Management']?.toFixed(2) ?? 'N/A'} (Weight: ${componentWeights['Cloud/Edge Management']}%)
    - Enterprise Integration: ${scores.componentScores['Enterprise Integration']?.toFixed(2) ?? 'N/A'} (Weight: ${componentWeights['Enterprise Integration']}%)
    - Security: ${scores.componentScores['Security']?.toFixed(2) ?? 'N/A'} (Weight: ${componentWeights['Security']}%)
    - Compliance: ${scores.componentScores['Compliance']?.toFixed(2) ?? 'N/A'} (Weight: ${componentWeights['Compliance']}%)
    - Contextualization: ${scores.componentScores['Contextualization']?.toFixed(2) ?? 'N/A'} (Weight: ${componentWeights['Contextualization']}%)
- Dimension Scores (Total points accumulated per dimension, max varies):
    - Technological: ${scores.dimensionScores.technological?.toFixed(2) ?? 'N/A'}
    - Human: ${scores.dimensionScores.human?.toFixed(2) ?? 'N/A'}
    - Organizational: ${scores.dimensionScores.organizational?.toFixed(2) ?? 'N/A'}

Task:
Based ONLY on these scores and the company context provided:
1. Provide a brief (1-2 sentence) overall assessment of the company's current IoT maturity level.
2. Highlight 1-2 key strengths based on the highest scoring components or dimensions relative to their weight/importance.
3. Identify the 2-3 most critical areas for improvement based on the lowest scoring components (considering their weight) or dimensions.
4. For each critical improvement area identified, suggest 1-2 specific, practical, and actionable next steps the SME could take to enhance its maturity. Focus on realistic steps for an SME.
5. Keep the tone constructive, encouraging, and professional.
6. Format the output clearly using Markdown (e.g., headings like "Overall Assessment", "Strengths", "Areas for Improvement", "Recommendations", and bullet points for steps). Do NOT include the original scores in your response. Just provide the analysis and recommendations.
`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    // Optional: Add safety settings if needed
    // safetySettings: [
    //   { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    //   { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
    // ],
    generationConfig: {
      // Optional: Adjust temperature, topK, topP if needed
      temperature: 0.7, // Controls randomness (0=deterministic, 1=creative)
      // maxOutputTokens: 8192,
    }
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error Response:', errorBody);
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extract the generated text
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      const feedbackText = data.candidates[0].content.parts[0].text;
      console.log("Feedback generated successfully.");
      return feedbackText;
    } else {
      console.error("No valid feedback content found in Gemini response:", data);
      throw new Error("Could not extract feedback from Gemini response.");
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Return a fallback message or rethrow the error
    return "Error: Could not generate personalized feedback at this time.";
  }
}

window.addEventListener ('DOMContentLoaded', initializePage);