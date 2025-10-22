// script.js

const GEMINI_API_KEY = 'AIzaSyDlqcl58hBc1VuEwe5eB1Xrd1RPW5_BQxk'; // <-- PASTE YOUR KEY HERE
const GEMINI_MODEL = 'gemini-2.5-pro'; // Or 'gemini-pro', etc.
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;


let companyProfiles = {};
let allCompaniesData = [];
let urlbase = 'https://script.google.com/macros/s/AKfycbyE2-lgyoQPBuIOpzd129JPPnDA0nUmeYFj80mzvIvp3hRf82pkZCrmBDH-1PCDxAI7PQ/exec';

const questions = {
  manager: [
    {
      text: '¿Se implementan anualmente estrategias de formación para la gestión de dispositivos IoT en la organización?',
      component: 'Device Management',
      dimension: 'human',
      answers: [
        { text: 'No hay cursos de actualizaciones y actividades de mantenimiento de dispositivos IoT', level: 'Estático', score: 1 },
        { text: 'Formación ad hoc limitada para dispositivos IoT o casos de uso específicos', level: 'Reactivo', score: 5 },
        { text: '1-5 cursos disponibles anualmente', level: 'Proactivo', score: 10 },
        { text: 'Más de 5 cursos disponibles anualmente', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿En qué áreas funcionales de la empresa se aplican las tecnologías IoT?',
      component: 'Enterprise Integration',
      dimension: 'organizational',
      answers: [
        { text: 'En ningún área funcional de la empresa', level: 'Estático', score: 1 },
        { text: 'En 1 a 2 áreas funcionales de la empresa', level: 'Reactivo', score: 5 },
        { text: 'En 3 a 4 áreas funcionales de la empresa', level: 'Proactivo', score: 10 },
        { text: 'En 5 o más áreas funcionales de la empresa', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Cómo se integran las tecnologías IoT en los procesos empresariales existentes?',
      component: 'Enterprise Integration',
      dimension: 'organizational',
      answers: [
        { text: 'Sin procesos empresariales integrados con tecnologías IoT', level: 'Estático', score: 1 },
        { text: '0-2 procesos empresariales integrados con tecnologías IoT', level: 'Reactivo', score: 5 },
        { text: '3-5 procesos empresariales integrados con tecnologías IoT', level: 'Proactivo', score: 10 },
        { text: '6 o más procesos empresariales integrados con tecnologías IoT', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Se utilizan las tecnologías IoT para implicar a los clientes en la organización?',
      component: 'Enterprise Integration',
      dimension: 'human',
      answers: [
        { text: 'No se utilizan', level: 'Estático', score: 1 },
        { text: 'Se utilizan', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Se generan informes o cuadros de mando basados en datos del IoT en la organización?',
      component: 'Enterprise Integration',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Ha implantado la empresa procesos para garantizar el cumplimiento de la normativa pertinente sobre el IoT (por ejemplo, soberanía de los datos, seguridad de los dispositivos, certificación)?',
      component: 'Compliance',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Colabora su organización con organismos reguladores o asociaciones del sector para mantenerse informada sobre los cambios en la normativa relacionada con IoT?',
      component: 'Compliance',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Sus soluciones IoT en la organización responden a sus necesidades específicas del sector o son genéricas?',
      component: 'Contextualization',
      dimension: 'organizational',
      answers: [
        { text: 'Son genéricas', level: 'Estático', score: 1 },
        { text: 'Son específicos del sector o la empresa', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Existen recursos (financieros, humanos, técnicos) para explorar nuevas implementaciones de IoT en la organización?',
      component: 'Contextualization',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Ha evaluado la organización el posible retorno de la inversión (ROI) de las implementaciones de IoT?',
      component: 'Contextualization',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Cuáles son los obstáculos o retos (financieros, culturales o tecnológicos) que la organización percibe para la adopción de IoT?',
      component: 'Contextualization',
      dimension: 'organizational',
      answers: [
        { text: 'No se han identificado los obstáculos ni los retos', level: 'Estático', score: 1 },
        { text: 'Se identifican algunos obstáculos y retos, pero no se proponen soluciones', level: 'Reactivo', score: 5 },
        { text: 'Barreras y retos identificados y soluciones propuestas', level: 'Proactivo', score: 10 },
        { text: 'Barreras y retos identificados proactivamente y soluciones implementadas', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Existen iniciativas para colaborar con instituciones de investigación, universidades o consorcios industriales sobre IoT?',
      component: 'Contextualization',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Existe un mecanismo de colaboración con el cliente para comprender sus retos específicos y crear soluciones conjuntas de IoT?',
      component: 'Contextualization',
      dimension: 'human',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
  ],

  engineer: [
    {
      text: '¿Cómo se gestiona el ciclo de vida de los dispositivos IoT en la organización?',
      component: 'Device Management',
      dimension: 'technological',
      answers: [
        { text: 'Gestión ad hoc del ciclo de vida de los dispositivos IoT, con sustituciones o actualizaciones no planificadas', level: 'Estático', score: 1 },
        { text: 'La duración media del ciclo de vida de los dispositivos IoT es inferior a 1 año', level: 'Reactivo', score: 5 },
        { text: 'La duración media del ciclo de vida de los dispositivos IoT es de 1-3 años', level: 'Proactivo', score: 10 },
        { text: 'La duración media del ciclo de vida de los dispositivos IoT es superior a 3 años', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Cómo se mide el rendimiento de las tecnologías IoT en la organización?',
      component: 'Device Management',
      dimension: 'organizational',
      answers: [
        { text: 'No hay métricas de rendimiento definidas ni procesos de supervisión establecidos', level: 'Estático', score: 1 },
        { text: '1-2 métricas de rendimiento', level: 'Reactivo', score: 5 },
        { text: '3-5 métricas de rendimiento', level: 'Proactivo', score: 10 },
        { text: '6 o más métricas de rendimiento definidas', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Utiliza su empresa alguna tecnología de virtualización para gestionar dispositivos u operaciones de IoT?',
      component: 'Connectivity Management',
      dimension: 'technological',
      answers: [
        { text: 'No existe una red central virtualizada', level: 'Estático', score: 1 },
        { text: 'Existe una red central virtualizada dedicada a las operaciones de IoT', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Dispone la empresa de una plataforma de gestión de la conectividad o de un sistema de supervisión de red?',
      component: 'Connectivity Management',
      dimension: 'technological',
      answers: [
        { text: 'No existe ninguna plataforma de gestión de la conectividad', level: 'Estático', score: 1 },
        { text: 'Existe y se utiliza una plataforma de gestión de la conectividad', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Dispone la empresa de análisis de datos basados en la información de red de los dispositivos IoT de la organización?',
      component: 'Connectivity Management',
      dimension: 'technological',
      answers: [
        { text: 'La empresa no realiza análisis basados en información de la red IoT', level: 'Estático', score: 1 },
        { text: 'La empresa realiza análisis basados en información de la red IoT', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Como se procesan los datos de los dispositivos IoT en la organización?',
      component: 'Cloud/Edge Management',
      dimension: 'organizational',
      answers: [
        { text: 'Los datos de IoT no se recopilan o se almacenan para procesar sin ningún tipo de análisis', level: 'Estático', score: 1 },
        { text: 'El análisis de los datos de IoT se realiza ad hoc', level: 'Reactivo', score: 5 },
        { text: 'El análisis de datos IoT es un proceso regular y estructurado', level: 'Proactivo', score: 10 },
        { text: 'El análisis de datos de IoT está automatizado e integrado con los procesos empresariales', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Existen equipos o recursos dedicados al análisis de datos de IoT en la organización?',
      component: 'Cloud/Edge Management',
      dimension: 'human',
      answers: [
        { text: 'No hay equipos ni recursos dedicados al análisis de datos de IoT', level: 'Estático', score: 1 },
        { text: 'El análisis de datos de IoT lo realiza el personal operativo o de TI existente como responsabilidad adicional', level: 'Reactivo', score: 5 },
        { text: 'Existe un equipo o recursos dedicados al análisis de datos de IoT, con un tamaño de equipo moderado (de 1 a 3 personas)', level: 'Proactivo', score: 10 },
        { text: 'Hay un equipo de personal dedicado al análisis de datos de IoT (4 o más individuos)', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Qué servicios en la nube se utilizan para operaciones con el IoT?',
      component: 'Cloud/Edge Management',
      dimension: 'technological',
      answers: [
        { text: 'No se utilizan servicios en la nube para las operaciones de IoT', level: 'Estático', score: 1 },
        { text: 'Los servicios en la nube básicos, como el almacenamiento en la nube o las copias de seguridad, se utilizan para el almacenamiento de datos de IoT.', level: 'Reactivo', score: 5 },
        { text: 'Se utilizan múltiples servicios en la nube para las operaciones de IoT, incluyendo computación en la nube, análisis de datos y herramientas de visualización', level: 'Proactivo', score: 10 },
        { text: 'Existe una estrategia en la nube completa y avanzada, que aprovecha una amplia gama de servicios en la nube para las operaciones de IoT', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Emplea la empresa edge computing para procesar y almacenar datos más cerca de los dispositivos IoT?',
      component: 'Cloud/Edge Management',
      dimension: 'technological',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Dispone la empresa de capacidad para gestionar con Inteligencia Artificial (IA) los conjuntos de datos producidos por dispositivos IoT y la nube?',
      component: 'Cloud/Edge Management',
      dimension: 'technological',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Utiliza los hiperescaladores de la nube (por ejemplo, AWS, Microsoft Azure)?',
      component: 'Cloud/Edge Management',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Cómo se integran los datos del IoT en los procesos operativos?',
      component: 'Enterprise Integration',
      dimension: 'organizational',
      answers: [
        { text: 'Los datos de IoT están aislados y no se comparten entre procesos', level: 'Estático', score: 1 },
        { text: 'Algunos datos de IoT se comparten entre algunos procesos, pero la integración es limitada (menos de 3 procesos))', level: 'Reactivo', score: 5 },
        { text: 'Los datos de IoT se integran y comparten en la mayoría (más de 3 procesos) de los procesos operativos', level: 'Proactivo', score: 10 },
        { text: 'Los datos de IoT están totalmente integrados y se comparten sin problemas en todos los procesos operativos', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Dispone actualmente la organización de sistemas empresariales (por ejemplo, CRM, ERP)?',
      component: 'Enterprise Integration',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Participan actualmente en una plataforma de intercambio de datos IoT para su empresa?',
      component: 'Enterprise Integration',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Se han identificado riesgos de seguridad en la aplicación de tecnologías IoT por parte de la organización?',
      component: 'Security',
      dimension: 'technological',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Se ha capacitado a los empleados con respecto a la seguridad de los sistemas IoT en la organización?',
      component: 'Security',
      dimension: 'human',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Se realizan auditorías de seguridad del IoT en la organización?',
      component: 'Security',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Se ha asociado la empresa con otras organizaciones para debatir o trabajar conjuntamente sobre la seguridad de IoT en la organización?',
      component: 'Security',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Cuáles son las consideraciones éticas para el uso de datos de IoT?',
      component: 'Compliance',
      dimension: 'human',
      answers: [
        { text: 'No se realizan comprobaciones de cumplimiento ético', level: 'Estático', score: 1 },
        { text: 'Se realizan 1-2 comprobaciones de cumplimiento ético anualmente', level: 'Reactivo', score: 5 },
        { text: 'Se realizan de 3 a 5 comprobaciones de cumplimiento ético anualmente', level: 'Proactivo', score: 10 },
        { text: 'Se realizan más de 5 comprobaciones de cumplimiento ético anualmente', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Existen asociaciones o colaboraciones con proveedores de soluciones IoT o expertos del sector?',
      component: 'Compliance',
      dimension: 'organizational',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Ha implementado su organización procesos y procedimientos para garantizar el cumplimiento de la normativa relacionada con IoT?',
      component: 'Compliance',
      dimension: 'organizational',
      answers: [
        { text: 'No existe un sistema o marco de gestión del cumplimiento específico de IoT', level: 'Estático', score: 1 },
        { text: 'Procesos informales o ad hoc para el cumplimiento relacionado con IoT', level: 'Reactivo', score: 5 },
        { text: 'Sistema o marco de gestión del cumplimiento específico de IoT documentado e implementado', level: 'Proactivo', score: 10 },
        { text: 'Sistema o marco de gestión del cumplimiento específico de IoT completo, automatizado y continuamente actualizado.', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Cómo garantiza su organización que las conexiones IoT y los sistemas asociados cumplen las normativas pertinentes y las políticas?',
      component: 'Compliance',
      dimension: 'human',
      answers: [
        { text: 'No hay un equipo dedicado o una persona responsable de gestionar el cumplimiento de IoT', level: 'Estático', score: 1 },
        { text: 'Responsabilidad informal o ad hoc para gestionar el cumplimiento de IoT', level: 'Reactivo', score: 5 },
        { text: 'Persona responsable de gestionar el cumplimiento de IoT', level: 'Proactivo', score: 10 },
        { text: 'Equipo dedicado e interfuncional responsable de gestionar el cumplimiento de IoT, con revisiones y actualizaciones periódicas', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Existen recursos o equipos dedicados a la investigación y el desarrollo del IoT en la organización?',
      component: 'Contextualization',
      dimension: 'human',
      answers: [
        { text: 'No hay un equipo dedicado a la investigación y el desarrollo de IoT', level: 'Estático', score: 1 },
        { text: 'Una persona dedicada a la investigación y desarrollo de IoT', level: 'Reactivo', score: 5 },
        { text: 'Equipo de investigación y desarrollo de IoT de tamaño medio (2 a 4 personas)', level: 'Proactivo', score: 10 },
        { text: 'Equipo de investigación y desarrollo de IoT grande (5 personas o más).', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
  ],

  technician: [
    {
      text: '¿Cuántos dispositivos IoT se utilizan en la organización?',
      component: 'Device Management',
      dimension: 'technological',
      answers: [
        { text: 'No hay dispositivos IoT desplegados', level: 'Estático', score: 1 },
        { text: '1-10 dispositivos IoT desplegados', level: 'Reactivo', score: 5 },
        { text: '11-30 dispositivos IoT desplegados', level: 'Proactivo', score: 10 },
        { text: 'Más de 30 dispositivos IoT desplegados', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Cuál es el tiempo promedio dedicado a configurar nuevos dispositivos IoT en la organización?',
      component: 'Device Management',
      dimension: 'technological',
      answers: [
        { text: 'No se mide el tiempo de configuración y despliegue', level: 'Estático', score: 1 },
        { text: '1-2 días en configurar y desplegar un nuevo dispositivo', level: 'Reactivo', score: 5 },
        { text: 'Entre 2 y 8 horas en configurar y desplegar un nuevo dispositivo', level: 'Proactivo', score: 10 },
        { text: 'Configuración de dispositivos que tardan menos de 2 horas en configurar e implantar un nuevo dispositivo', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Cómo aprovisiona y configura actualmente los dispositivos IoT en su organización?',
      component: 'Device Management',
      dimension: 'technological',
      answers: [
        { text: 'Aprovisionamiento y configuración manuales', level: 'Estático', score: 1 },
        { text: 'Existe un proceso estandarizado y automatizado para el aprovisionamiento y configuración de dispositivos', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Se actualiza el firmware y el software de los dispositivos IoT de la organización?',
      component: 'Device Management',
      dimension: 'technological',
      answers: [
        { text: 'No existe un proceso estructurado para gestionar las actualizaciones de los dispositivos', level: 'Estático', score: 1 },
        { text: 'Procesos ad hoc para gestionar las actualizaciones de dispositivos', level: 'Reactivo', score: 5 },
        { text: 'Existe un proceso estructurado', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Existen procesos u operaciones en los que se recopilen datos de dispositivos IoT conectados en la organización?',
      component: 'Connectivity Management',
      dimension: 'organizational',
      answers: [
        { text: 'Ningún proceso u operación implica la recopilación de datos de dispositivos conectados', level: 'Estático', score: 1 },
        { text: '1 a 2 procesos u operaciones que implican la recopilación de datos de dispositivos conectados.', level: 'Reactivo', score: 5 },
        { text: '3 a 5 procesos y operaciones que implican la recopilación de datos de dispositivos conectados', level: 'Proactivo', score: 10 },
        { text: 'Más de 5 procesos u operaciones de dispositivos conectados que implican la recopilación de datos de dispositivos conectados', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿La empresa dispone de dispositivos IoT que se conectan mediante tarjetas SIM?',
      component: 'Connectivity Management',
      dimension: 'technological',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Cómo gestiona las tarjetas SIM y maneja el aprovisionamiento remoto para sus dispositivos IoT en la organización?',
      component: 'Connectivity Management',
      dimension: 'technological',
      answers: [
        { text: 'La empresa gestiona manualmente tarjetas SIM físicas para dispositivos IoT', level: 'Estático', score: 1 },
        { text: 'La empresa utiliza métodos tradicionales de aprovisionamiento de SIM, pero no ha adoptado las tecnologías eSIM o iSIM.', level: 'Reactivo', score: 5 },
        { text: 'La empresa ha adoptado parcialmente las tecnologías eSIM o iSIM para el aprovisionamiento remoto de algunos dispositivos IoT (Liberg et al., 2018).', level: 'Proactivo', score: 10 },
        { text: 'La empresa ha adoptado completamente las tecnologías eSIM e iSIM en toda su flota de dispositivos IoT', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Existe una infraestructura de red específica para los dispositivos IoT, o comparten la misma red que otros sistemas informáticos?',
      component: 'Connectivity Management',
      dimension: 'technological',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Qué herramientas y técnicas de análisis de datos se utilizan para los datos de IoT en la organización?',
      component: 'Cloud/Edge Management',
      dimension: 'organizational',
      answers: [
        { text: 'No se utilizan herramientas o técnicas de análisis de datos específicas para los datos de IoT', level: 'Estático', score: 1 },
        { text: 'Se utilizan herramientas o técnicas básicas de análisis de datos para los datos de IoT, como software de hojas de cálculo o análisis estadísticos sencillos', level: 'Reactivo', score: 5 },
        { text: 'Se utilizan herramientas y técnicas de análisis de datos dedicadas para los datos de IoT, como la visualización de datos, el aprendizaje automático o el análisis predictivo', level: 'Proactivo', score: 10 },
        { text: 'Se utilizan herramientas y técnicas avanzadas de análisis de datos para los datos de IoT, como el análisis en tiempo real, el procesamiento de datos en streaming o la inteligencia artificial (IA) y el aprendizaje profundo', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Dispone su organización de un sistema para detectar malware en sus dispositivos IoT?',
      component: 'Security',
      dimension: 'technological',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Dispone la organización de un mecanismo para bloquear el IMEI (Identidad Internacional de Equipo Móvil) del dispositivo a la tarjeta SIM conectada, impidiendo el intercambio de datos no autorizado?',
      component: 'Security',
      dimension: 'technological',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Utiliza un punto de acceso privado (APN) para su conectividad IoT con el fin de aislar su red IoT de la Internet pública?',
      component: 'Security',
      dimension: 'technological',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Ha implementado el cifrado de extremo a extremo para sus comunicaciones del IoT en la organización?',
      component: 'Security',
      dimension: 'technological',
      answers: [
        { text: 'No', level: 'Estático', score: 1 },
        { text: 'Sí', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
    {
      text: '¿Existen iniciativas para explorar el análisis avanzado (IA/ML) de los datos de IoT?',
      component: 'Contextualization',
      dimension: 'organizational',
      answers: [
        { text: 'No hay iniciativas de IA/ML sobre datos de IoT', level: 'Estático', score: 1 },
        { text: 'Exploración inicial de iniciativas de IA/ML sobre datos de IoT', level: 'Reactivo', score: 5 },
        { text: 'Iniciativas de IA/ML sobre datos de IoT en curso', level: 'Proactivo', score: 10 },
        { text: 'Las iniciativas de IA/ML sobre datos de IoT están totalmente implementadas', level: 'Innovador', score: 15 },
        { text: 'No sabe/no contesta', level: null, score: 0 }
      ]
    },
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
'Elaboración de bebidas',
'Elaboración de productos alimenticios',
'Elaboración de productos de tabaco',
'Fabricación de coque y productos de la refinación del petróleo',
'Fabricación de equipo eléctrico y electrónico',
'Fabricación de maquinaria y equipo',
'Fabricación de metales comunes (minería y metalmecánica)',
'Fabricación de muebles',
'Fabricación de otros tipos de equipo de transporte (barcos, trenes, aviones)',
'Fabricación de papel y productos de papel',
'Fabricación de partes y accesorios para vehículos (autopartes)',
'Fabricación de prendas de vestir',
'Fabricación de productos de caucho, materiales sintéticos y plástico',
'Fabricación de productos de cuero y calzado',
'Fabricación de productos elaborados de metal',
'Fabricación de productos farmacéuticos',
'Fabricación de productos farmacéuticos, sustancias químicas medicinales y productos botánicos de uso farmacéutico',
'Fabricación de productos minerales no metálicos',
'Fabricación de productos químicos',
'Fabricación de productos textiles',
'Fabricación de vehículos automotores, remolques y semirremolques',
'Impresión y reproducción de grabaciones',
'Otras industrias',
'Producción de madera y fabricación de productos de madera y corcho',
'Reparación e instalación de maquinaria y equipo',
];

const legalFigures = [
  'Asociación Civil',
  'Cooperativa',
  'Empresa Individual de Responsabilidad Limitada',
  'Empresa Unipersonal',
  'Fundación',
  'Persona Física',
  'Sociedad Anónima Cerrada',
  'Sociedad Anónima',
  'Sociedad Civil',
  'Sociedad Colectiva',
  'Sociedad Cooperativa',
  'Sociedad de Hecho',
  'Sociedad de Responsabilidad Limitada',
  'Sociedad en Comandita por Acciones',
  'Sociedad en Comandita Simple',
  'Sociedad por Acciones Simplificada',
  'Sucursal de Empresa Extranjera',
];






const rubricData = {
    "Device Management": {
        "¿Cuántos dispositivos o sensores habilitados para IoT se utilizan en la organización?": {
            "Estático": "No hay dispositivos IoT desplegados.",
            "Reactivo": "1-10 dispositivos IoT desplegados.",
            "Proactivo": "11-30 dispositivos IoT desplegados.",
            "Innovador": "Más de 30 dispositivos IoT desplegados."
        },
        "¿Tiempo promedio dedicado a configurar nuevos dispositivos IoT en la organización?": {
            "Estático": "No se mide el tiempo de configuración y despliegue",
            "Reactivo": "1-2 días en configurar y desplegar un nuevo dispositivo.",
            "Proactivo": "Entre 2 y 8 horas en configurar y desplegar un nuevo dispositivo.",
            "Innovador": "Configuración de dispositivos que tardan menos de 2 horas en configurar e implantar un nuevo dispositivo"
        },
        "¿Qué procesos existen para gestionar y mantener los dispositivos IoT?": {
            "Estático": "No hay prácticas de gestión de la conectividad establecidas.",
            "Reactivo": "Procesos ad hoc para gestionar dispositivos IoT",
            "Proactivo": "Prácticas de gestión de la conectividad para el 1-75% de los dispositivos IoT.",
            "Innovador": "Prácticas de gestión de la conectividad para más del 75% de los dispositivos IoT."
        },
        "¿Cómo se realizan los procesos de gestión o mantenimiento de los dispositivos IoT?": {
            "Estático": "No hay dispositivos IoT con procesos de gestión o mantenimiento documentados.",
            "Reactivo": "Procesos documentados para menos del 25% de los dispositivos IoT.",
            "Proactivo": "Procesos documentados para el 25-75% de los dispositivos IoT.",
            "Innovador": "Procesos documentados para más del 75% de los dispositivos IoT."
        },
        "¿Cuáles son los retos a los que se enfrenta la gestión y el mantenimiento de los dispositivos IoT?": {
            "Estático": "No hay SLA definidos para el mantenimiento.",
            "Reactivo": "SLAs definidos para menos del 25% de los dispositivos IoT.",
            "Proactivo": "Acuerdos de Nivel de Servicio definidos para el 25-75% de los dispositivos IoT.",
            "Innovador": "SLA definidos para más del 75% de los dispositivos IoT."
        },
        "¿Se implementan anualmente estrategias de formación para la gestión de dispositivos IoT en la organización?": {
            "Estático": "No hay cursos de actualizaciones y actividades de mantenimiento de dispositivos IoT.",
            "Reactivo": "Formación ad hoc limitada para dispositivos IoT o casos de uso específicos.",
            "Proactivo": "1-5 cursos disponibles.",
            "Innovador": "Más de 5 cursos disponibles."
        },
        "¿Cómo se gestiona el ciclo de vida de los dispositivos IoT en la organización?": {
            "Estático": "Gestión ad hoc del ciclo de vida de los dispositivos IoT, con sustituciones o actualizaciones no planificadas",
            "Reactivo": "La duración media del ciclo de vida de los dispositivos IoT es inferior a 1 año.",
            "Proactivo": "La duración media del ciclo de vida es de 1-3 años.",
            "Innovador": "La duración media del ciclo de vida es superior a 3 años."
        },
        "¿Cómo se mide el rendimiento de las tecnologías IoT?": {
            "Estático": "No hay métricas de rendimiento definidas ni procesos de supervisión establecidos.",
            "Reactivo": "1-2 métricas de rendimiento",
            "Proactivo": "3-5 métricas de rendimiento.",
            "Innovador": "Más de 5 métricas de rendimiento definidas"
        },
        "¿Cómo se evalúan e integran las nuevas tecnologías de IoT en las operaciones?": {
            "Estático": "No hay estrategias para integrar las nuevas tecnologías IoT.",
            "Reactivo": "Evaluación e integración ad hoc de nuevas tecnologías IoT según sea necesario.",
            "Proactivo": "1-5 estrategias disponibles.",
            "Innovador": "Más de 5 estrategias disponibles."
        },
        "¿Cómo aprovisiona y configura actualmente los dispositivos IoT en su organización?": {
            "Estático": "Aprovisionamiento y configuración manuales",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Existe un proceso estandarizado y automatizado para el aprovisionamiento y configuración de dispositivos"
        },
        "¿Existencia de mecanismos de autenticación de seguridad utiliza para los dispositivos IoT en la organización?": {
            "Estático": "Sin métodos de autenticación",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Existen métodos de autenticación"
        },
        "¿Cómo se actualiza el firmware y el software de los dispositivos IoT de la organización?": {
            "Estático": "No existe un proceso estructurado para gestionar las actualizaciones de los dispositivos.",
            "Reactivo": "Procesos ad hoc para gestionar las actualizaciones de dispositivos",
            "Proactivo": "",
            "Innovador": "Existe un proceso estructurado."
        },
        "¿Utiliza una plataforma dedicada a la gestión de dispositivos?": {
            "Estático": "No existe ninguna plataforma de gestión de dispositivos dedicada.",
            "Reactivo": "Capacidades básicas de gestión de dispositivos, pero no una plataforma dedicada.",
            "Proactivo": "",
            "Innovador": "Se dispone de una plataforma de gestión de dispositivos dedicada"
        }
    },
    "Connectivity Management": {
        "¿Existen procesos u operaciones en los que se recopilen datos de dispositivos IoT conectados en la organización?": {
            "Estático": "Ningún proceso u operación implica la recopilación de datos de dispositivos conectados.",
            "Reactivo": "1 a 2 procesos u operaciones que implican la recopilación de datos de dispositivos conectados.",
            "Proactivo": "3 a 5 procesos y operaciones que implican la recopilación de datos de dispositivos conectados.",
            "Innovador": "Más de 5 procesos u operaciones de dispositivos conectados que implican la recopilación de datos de dispositivos conectados."
        },
        "¿Qué protocolos y normas de conectividad se utilizan para los dispositivos IoT?": {
            "Estático": "No se han adoptado protocolos o estándares de conectividad específicos.",
            "Reactivo": "Se utilizan algunos protocolos y estándares de conectividad básicos (por ejemplo, Wi-Fi, Bluetooth) para los dispositivos IoT.",
            "Proactivo": "Se han adoptado una serie de protocolos y estándares de conectividad estándar del sector (por ejemplo, LoRaWAN, Zigbee, MQTT).",
            "Innovador": "La empresa explora y adopta activamente protocolos y estándares de conectividad emergentes, manteniendo una infraestructura IoT preparada para el futuro."
        },
        "¿Cantidad de datos que se transfieren al día por el IoT?": {
            "Estático": "Menos de 1 MB de datos transferidos al día",
            "Reactivo": "1 MB - 1 GB de datos transferidos al día.",
            "Proactivo": "1 GB - 10 GB de datos transferidos al día.",
            "Innovador": "Más de 10 GB de datos transferidos al día."
        },
        "¿Cómo se mide la eficacia de las prácticas de conectividad IoT?": {
            "Estático": "Sin seguimiento del tiempo de inactividad debido a problemas de conectividad IoT.",
            "Reactivo": "El tiempo de inactividad debido a problemas de conectividad de IoT se rastrea de forma reactiva, pero no hay métricas ni procesos establecidos.",
            "Proactivo": "Más de 2 horas de inactividad a la semana registradas debido a problemas de conectividad",
            "Innovador": "Entre 0 minutos y 2 horas de tiempo de inactividad a la semana con esfuerzos para reducirlo"
        },
        "¿Utiliza su empresa alguna tecnología de virtualización para gestionar dispositivos u operaciones de IoT?": {
            "Estático": "No existe una red central virtualizada.",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Existe una red central virtualizada dedicada a las operaciones de IoT."
        },
        "¿Dispone la empresa de una plataforma de gestión de la conectividad o de un sistema de supervisión de red?": {
            "Estático": "No existe ninguna plataforma de gestión de la conectividad (CMP).",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Existe y se utiliza una plataforma de gestión de la conectividad (CMP)."
        },
        "¿Dispone la empresa de análisis de datos basados en la información de red de los dispositivos IoT de la organización?": {
            "Estático": "La empresa no realiza análisis basados en información de la red IoT.",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "La empresa realiza análisis basados en información de la red IoT."
        },
        "¿Cuántos empleados de su empresa tienen conocimientos en tecnologías de gestión de la conectividad IoT (por ejemplo, virtualización de redes, SDN, eSIM, RSP)?": {
            "Estático": "La empresa no tiene empleados con experiencia o certificaciones",
            "Reactivo": "La empresa cuenta con 1 o 2 empleados con formación en gestión de la conectividad IoT.",
            "Proactivo": "La empresa cuenta con un equipo (3 a 5 empleados) de gestión de la conectividad IoT",
            "Innovador": "La empresa cuenta con un equipo (>5 empleados) con conocimientos en tecnologías de gestión de conectividad IoT."
        },
        "¿Dispone su empresa de mecanismos para compartir conocimientos y documentar las mejores prácticas relacionadas con la gestión de la conectividad IoT?": {
            "Estático": "La empresa no dispone de mecanismos ni documentación para compartir conocimientos relacionados con la gestión de la conectividad IoT",
            "Reactivo": "La empresa dispone de alguna documentación ad hoc o procesos informales de intercambio de conocimientos, pero no de un repositorio centralizado.",
            "Proactivo": "La empresa tiene una base de conocimientos centralizada o un repositorio de documentación para las mejores prácticas de gestión de la conectividad IoT y el intercambio de conocimientos (Ding et al., 2018).",
            "Innovador": ""
        },
        "¿Cómo gestiona las tarjetas SIM y maneja el aprovisionamiento remoto para sus dispositivos IoT?": {
            "Estático": "La empresa gestiona manualmente tarjetas SIM físicas para dispositivos IoT",
            "Reactivo": "La empresa utiliza métodos tradicionales de aprovisionamiento de SIM, pero no ha adoptado las tecnologías eSIM o iSIM.",
            "Proactivo": "La empresa ha adoptado parcialmente las tecnologías eSIM o iSIM para el aprovisionamiento remoto de algunos dispositivos IoT (Liberg et al., 2018).",
            "Innovador": "La empresa ha adoptado completamente las tecnologías eSIM e iSIM en toda su flota de dispositivos IoT"
        },
        "¿Explora la empresa posibles servicios basados en la monetización de los datos de red (por ejemplo, Crowd Insights)?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Existe una infraestructura de red específica para los dispositivos IoT, o comparten la misma red que otros sistemas informáticos?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        }
    },
    "Cloud/Edge Management": {
        "¿Como se procesan los datos de los dispositivos IoT en la organización?": {
            "Estático": "Los datos de IoT no se recopilan o se almacenan para procesar sin ningún tipo de análisis",
            "Reactivo": "El análisis de los datos de IoT se realiza ad hoc.",
            "Proactivo": "El análisis de datos IoT es un proceso regular y estructurado.",
            "Innovador": "El análisis de datos de IoT está automatizado e integrado con los procesos empresariales."
        },
        "¿Qué herramientas y técnicas de análisis de datos se utilizan para los datos de IoT?": {
            "Estático": "No se utilizan herramientas o técnicas de análisis de datos específicas para los datos de IoT",
            "Reactivo": "Se utilizan herramientas o técnicas básicas de análisis de datos para los datos de IoT, como software de hojas de cálculo o análisis estadísticos sencillos",
            "Proactivo": "Se utilizan herramientas y técnicas de análisis de datos dedicadas para los datos de IoT, como la visualización de datos, el aprendizaje automático o el análisis predictivo",
            "Innovador": "Se utilizan herramientas y técnicas avanzadas de análisis de datos para los datos de IoT, como el análisis en tiempo real, el procesamiento de datos en streaming o la inteligencia artificial (IA) y el aprendizaje profundo"
        },
        "¿Cómo se aprovechan los datos de IoT para supervisar el rendimiento empresarial?": {
            "Estático": "Los datos de IoT no se utilizan para supervisar el rendimiento empresarial.",
            "Reactivo": "La supervisión de los datos de IoT se realiza de forma manual o ad hoc.",
            "Proactivo": "Los datos de IoT se utilizan para supervisar una serie de métricas de rendimiento empresarial, como la eficiencia operativa, la utilización de recursos y la satisfacción del cliente (Entre 1 a 5 métricas)",
            "Innovador": "Los datos de IoT se utilizan para supervisar un conjunto completo de métricas de rendimiento empresarial, incluidas métricas financieras, operativas y estratégicas (Más de 5 métricas)"
        },
        "¿Existen equipos o recursos dedicados al análisis de datos de IoT?": {
            "Estático": "No hay equipos ni recursos dedicados al análisis de datos de IoT",
            "Reactivo": "El análisis de datos de IoT lo realiza el personal operativo o de TI existente como responsabilidad adicional",
            "Proactivo": "Existe un equipo o recursos dedicados al análisis de datos de IoT, con un tamaño de equipo moderado (de 1 a 3 personas).",
            "Innovador": "Hay un equipo de personal dedicado al análisis de datos de IoT (4 o más individuos)"
        },
        "¿Cómo se garantiza la calidad de los datos de IoT?": {
            "Estático": "No existen procesos ni medidas para garantizar la calidad de los datos de IoT",
            "Reactivo": "Se realizan comprobaciones básicas de la calidad de los datos de IoT, como la comprobación de valores atípicos o ausentes",
            "Proactivo": "El número de métricas de calidad de los datos de IoT es limitado (1-2 métricas, por ejemplo, integridad, validez).",
            "Innovador": "Se utiliza un número de métricas de calidad de datos IoT (3 en adelante, por ejemplo, integridad, validez, coherencia, puntualidad, precisión)."
        },
        "¿Qué prácticas de gestión de nube/borde se aplican a las tecnologías IoT?": {
            "Estático": "No se aplican prácticas de gestión de la nube ni borde a los dispositivos IoT.",
            "Reactivo": "Existen prácticas de gestión de la nube/borde para un pequeño porcentaje de dispositivos IoT (menos del 25%)",
            "Proactivo": "Existen prácticas de gestión de la nube/borde para un porcentaje moderado de dispositivos IoT (25-75%).",
            "Innovador": "Un alto porcentaje de dispositivos IoT (más del 75%) dispone de prácticas de gestión de la nube/borde."
        },
        "¿Qué servicios en la nube se utilizan para operaciones con el IoT?": {
            "Estático": "No se utilizan servicios en la nube para las operaciones de IoT",
            "Reactivo": "Los servicios en la nube básicos, como el almacenamiento en la nube o las copias de seguridad, se utilizan para el almacenamiento de datos de IoT.",
            "Proactivo": "Se utilizan múltiples servicios en la nube para las operaciones de IoT, incluyendo computación en la nube, análisis de datos y herramientas de visualización.",
            "Innovador": "Existe una estrategia en la nube completa y avanzada, que aprovecha una amplia gama de servicios en la nube para las operaciones de IoT."
        },
        "¿Qué capacidades de análisis y visualización de datos están disponibles para los datos de IoT?": {
            "Estático": "No se dispone de herramientas dedicadas de análisis o visualización de datos para los datos de IoT.",
            "Reactivo": "Existen herramientas básicas de análisis y visualización de datos, pero su uso es ad hoc y reactivo.",
            "Proactivo": "Existen herramientas completas de análisis y visualización de datos para los datos de IoT.",
            "Innovador": "Las capacidades avanzadas de análisis y visualización de datos, como el aprendizaje automático, la inteligencia artificial y los cuadros de mando interactivos, se integran en el ecosistema de IoT."
        },
        "¿Emplea la empresa edge computing para procesar y almacenar datos más cerca de los dispositivos IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Utiliza la empresa conectores de nube o soluciones similares para agilizar la entrega de datos desde y hacia la nube?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Dispone la empresa de capacidad para gestionar con Inteligencia Artificial (IA) los conjuntos de datos producidos por dispositivos IoT y la nube?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Hasta qué punto es diverso el ecosistema de proveedores y plataformas de la empresa para soluciones IoT?": {
            "Estático": "Entre 1 y 2 proveedores distintos de soluciones IoT",
            "Reactivo": "Entre 3 y 5 proveedores distintos de soluciones IoT",
            "Proactivo": "Entre 6 y 8 proveedores distintos de soluciones IoT",
            "Innovador": "Más de 9 proveedores distintos de soluciones IoT"
        },
        "¿Utiliza los hiperescaladores de la nube (por ejemplo, AWS, Microsoft)?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        }
    },
    "Business Integration Management": {
        "¿En qué áreas funcionales de la empresa se aplican las tecnologías IoT?": {
            "Estático": "En ningún área funcional de la empresa",
            "Reactivo": "En 1 a 2 áreas funcionales de la empresa",
            "Proactivo": "En 3 a 4 áreas funcionales de la empresa",
            "Innovador": "En 5 o más áreas funcionales de la empresa"
        },
        "¿Cómo se integran los datos del IoT en los procesos operativos?": {
            "Estático": "Los datos de IoT están aislados y no se comparten entre procesos.",
            "Reactivo": "Algunos datos de IoT se comparten entre algunos procesos, pero la integración es limitada",
            "Proactivo": "Los datos de IoT se integran y comparten en la mayoría de los procesos operativos",
            "Innovador": "Los datos de IoT están totalmente integrados y se comparten sin problemas en todos los procesos operativos"
        },
        "¿Existen retos o limitaciones para la integración de IoT en todas las operaciones?": {
            "Estático": "4 o más problemas o cuellos de botella de integración de IoT notificados",
            "Reactivo": "3 problemas o cuellos de botella de integración de IoT notificados",
            "Proactivo": "1-2 problemas o cuellos de botella de integración de IoT notificados",
            "Innovador": "No se ha informado de problemas o cuellos de botella en la integración de IoT"
        },
        "¿Cómo se integran las tecnologías IoT en los procesos empresariales existentes?": {
            "Estático": "0-2 procesos empresariales integrados con tecnologías IoT",
            "Reactivo": "3-5 procesos empresariales integrados con tecnologías IoT",
            "Proactivo": "6-8 procesos empresariales integrados con tecnologías IoT",
            "Innovador": "9 o más procesos empresariales integrados con tecnologías IoT"
        },
        "¿Cómo aprovecha la organización los datos del IoT para la optimización de procesos o la oferta de nuevos productos/servicios?": {
            "Estático": "0 mejoras de procesos a partir de datos de IoT",
            "Reactivo": "1-3 mejoras de procesos a partir de datos de IoT",
            "Proactivo": "4-6 mejoras de procesos a partir de datos de IoT",
            "Innovador": "7 o más mejoras de procesos a partir de datos de IoT"
        },
        "¿Cómo se integran los sistemas IoT con los sistemas empresariales (ERP, CRM, etc.)?": {
            "Estático": "Los sistemas IoT no están integrados con los sistemas empresariales",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Los sistemas IoT están integrados con los sistemas empresariales."
        },
        "¿Dispone actualmente la organización de sistemas empresariales (por ejemplo, CRM, ERP)?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Cómo impulsan los conocimientos de IoT la toma de decisiones y la estrategia empresarial?": {
            "Estático": "Los conocimientos de IoT no afectan a la estrategia empresarial ni a la toma de decisiones.",
            "Reactivo": "Los conocimientos de IoT afectan a 1-2 procesos o decisiones empresariales",
            "Proactivo": "Los conocimientos de IoT afectan a entre 3 y 5 procesos o decisiones empresariales",
            "Innovador": "Los conocimientos de IoT afectan a 6 o más procesos o decisiones empresariales"
        },
        "¿Cómo se alinean las iniciativas de IoT con las metas y objetivos de la organización?": {
            "Estático": "Las iniciativas de IoT no están alineadas con las metas y objetivos de la organización",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Las iniciativas de IoT están alineadas con las metas y objetivos organizativos"
        },
        "¿Se utilizan las tecnologías IoT para implicar a los clientes en la organización?": {
            "Estático": "No se utilizan",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Se utilizan"
        },
        "¿Qué procesos existen para la mejora continua y la optimización de las tecnologías de IoT?": {
            "Estático": "0-25% de las tecnologías IoT cuentan con procesos de mejora continua.",
            "Reactivo": "26-50% de las tecnologías IoT cuentan con procesos de mejora continua.",
            "Proactivo": "51-75% de las tecnologías IoT disponen de procesos de mejora continua.",
            "Innovador": "76-100% de las tecnologías IoT cuentan con procesos de mejora continua"
        },
        "¿Participa actualmente o está considerando participar en una plataforma de intercambio de datos IoT para su empresa?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Cuál es el conocimiento actual sobre los dispositivos IoT y sus capacidades?": {
            "Estático": "No hay empleados con conocimientos básicos de IoT.",
            "Reactivo": "Menos del 25% de los empleados tienen conocimientos básicos de IoT.",
            "Proactivo": "Entre el 25 y el 75% de los empleados tienen conocimientos básicos de IoT.",
            "Innovador": "Más del 75% de los empleados tienen conocimientos básicos de IoT."
        },
        "¿Está explorando la empresa oportunidades e innovaciones emergentes en IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Se generan informes o cuadros de mando basados en datos del IoT en la organización?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Cómo recoge e incorpora los comentarios de los usuarios finales para mejorar continuamente sus soluciones IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        }
    },
    "Security": {
        "¿Qué políticas de privacidad y gobernanza de datos se aplican a los datos de IoT?": {
            "Estático": "La organización desconoce o no cumple las leyes y normativas pertinentes.",
            "Reactivo": "La organización cumple las leyes y normativas cuando surgen problemas.",
            "Proactivo": "La organización revisa y actualiza periódicamente su cumplimiento de las leyes y reglamentos.",
            "Innovador": "La organización se anticipa a los cambios en las leyes y reglamentos y ajusta sus políticas en consecuencia"
        },
        "¿Se han identificado riesgos de seguridad en la aplicación de tecnologías IoT por parte de la organización?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Se ha capacitado a los empleados en relación a la seguridad de los sistemas IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Se realizan auditorías de seguridad?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Cómo se supervisan y optimizan los sistemas de IoT en cuanto a seguridad?": {
            "Estático": "Los sistemas IoT no se supervisan en materia de seguridad.",
            "Reactivo": "La seguridad de los sistemas IoT se supervisa, pero solo después de un incidente de seguridad",
            "Proactivo": "Los sistemas IoT se supervisan regularmente en cuanto a seguridad.",
            "Innovador": "Los sistemas IoT se supervisan continuamente."
        },
        "¿Cómo se supervisan y adoptan las mejores prácticas de IoT y las tendencias del sector?": {
            "Estático": "No hay seguimiento activo ni adopción de las mejores prácticas y tendencias del sector de la IoT.",
            "Reactivo": "Seguimiento ocasional de las mejores prácticas de IoT y las tendencias del sector, con adopción ad hoc de algunas prácticas.",
            "Proactivo": "Supervisión periódica de las mejores prácticas de IoT y las tendencias del sector, con un proceso definido para evaluar y adoptar las prácticas pertinentes",
            "Innovador": "Participación activa en consorcios, eventos e iniciativas de intercambio de conocimientos de la industria de IoT, con un fuerte enfoque en contribuir y dar forma a las mejores prácticas de la industria."
        },
        "¿Dispone su organización de un sistema para detectar malware en sus dispositivos IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Dispone de un mecanismo para bloquear el IMEI (Identidad Internacional de Equipo Móvil) del dispositivo a la tarjeta SIM conectada, evitando el intercambio no autorizado de SIM?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Utiliza un punto de acceso privado (APN) para su conectividad IoT con el fin de aislar su red IoT de la Internet pública?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Ha implementado el cifrado de extremo a extremo para sus comunicaciones IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Utiliza VPN IPSec para proteger los canales de comunicación entre sus dispositivos IoT y los sistemas backend?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Ha adoptado la norma IoT SAFE u otra similar para aprovechar la tarjeta SIM como elemento de confianza basado en hardware para la autenticación entre sus dispositivos IoT y los servidores en la nube?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Se ha asociado la empresa con otras organizaciones para debatir o trabajar conjuntamente sobre la seguridad de IoT en la organización?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        }
    },
    "Compliance": {
        "¿Ha implantado la empresa procesos para garantizar el cumplimiento de la normativa pertinente (por ejemplo, soberanía de los datos, seguridad de los dispositivos, certificación)?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Cómo se supervisan y auditan las tecnologías IoT para garantizar su cumplimiento?": {
            "Estático": "Menos del 25% de los dispositivos IoT han establecido procesos de supervisión y auditoría del cumplimiento.",
            "Reactivo": "Entre el 25 y el 50% de los dispositivos IoT han establecido procesos de supervisión y auditoría de la conformidad.",
            "Proactivo": "Entre el 51% y el 75% de los dispositivos IoT han establecido procesos de supervisión y auditoría del cumplimiento.",
            "Innovador": "Más del 75% de los dispositivos IoT han establecido procesos de supervisión y auditoría del cumplimiento."
        },
        "¿Cuáles son las consideraciones éticas para el uso de datos de IoT?": {
            "Estático": "No se realizan comprobaciones de cumplimiento ético.",
            "Reactivo": "Se realizan 1-2 comprobaciones de cumplimiento ético.",
            "Proactivo": "Se realizan de 3 a 5 comprobaciones de cumplimiento ético.",
            "Innovador": "Se realizan más de 5 comprobaciones de cumplimiento ético."
        },
        "¿Existen asociaciones o colaboraciones con proveedores de soluciones IoT o expertos del sector?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Qué estrategias existen para ampliar las soluciones IoT?": {
            "Estático": "No existen estrategias para ampliar las soluciones IoT.",
            "Reactivo": "1 estrategia para ampliar las soluciones IoT.",
            "Proactivo": "2-3 estrategias para ampliar las soluciones IoT.",
            "Innovador": "Más de 3 estrategias implementadas para escala"
        },
        "¿Ha implantado su organización procesos y procedimientos para garantizar el cumplimiento de la normativa relacionada con IoT?": {
            "Estático": "No existe un sistema o marco de gestión del cumplimiento específico de IoT.",
            "Reactivo": "Procesos informales o ad hoc para el cumplimiento relacionado con IoT.",
            "Proactivo": "Sistema o marco de gestión del cumplimiento específico de IoT documentado e implementado.",
            "Innovador": "Sistema o marco de gestión del cumplimiento específico de IoT completo, automatizado y continuamente actualizado."
        },
        "¿Colabora su organización con organismos reguladores o asociaciones del sector para mantenerse informada sobre los cambios en la normativa relacionada con IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Ha considerado o implementado su organización una solución de cumplimiento como servicio para gestionar los requisitos normativos relacionados con IoT?": {
            "Estático": "Sin conocimiento de las ofertas de cumplimiento como servicio de IoT.",
            "Reactivo": "Conocimiento de las ofertas de conformidad de IoT como servicio, pero sin implementación.",
            "Proactivo": "Consideración de las ofertas de cumplimiento de IoT como servicio, con implementación parcial.",
            "Innovador": "Implementación de ofertas de cumplimiento de IoT como servicio para gestionar los requisitos normativos."
        },
        "¿Cómo garantiza su organización que las conexiones IoT y los sistemas asociados cumplen las normativas pertinentes y las políticas?": {
            "Estático": "No hay un equipo dedicado o una persona responsable de gestionar el cumplimiento de IoT.",
            "Reactivo": "Responsabilidad informal o ad hoc para gestionar el cumplimiento de IoT.",
            "Proactivo": "Persona responsable de gestionar el cumplimiento de IoT.",
            "Innovador": "Equipo dedicado e interfuncional responsable de gestionar el cumplimiento de IoT, con revisiones y actualizaciones periódicas."
        },
        "¿Utiliza su empresa plataformas GRC para gestionar la gobernanza, el riesgo y el cumplimiento relacionados con IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        }
    },
    "Contextualisation": {
        "¿Existen recursos (financieros, humanos, técnicos) para explorar nuevas implementaciones de IoT en la organización?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Existe apoyo ejecutivo para las nuevas iniciativas relacionadas con la tecnología IoT en la organización?": {
            "Estático": "No hay apoyo ejecutivo para las iniciativas de IoT.",
            "Reactivo": "Apoyo ejecutivo limitado, con exploración ad hoc de posibles aplicaciones de IoT.",
            "Proactivo": "Fuerte apoyo ejecutivo, con un inventario documentado de posibles aplicaciones de IoT.",
            "Innovador": "Liderazgo ejecutivo comprometido, que impulsa activamente iniciativas de IoT y explora nuevas aplicaciones."
        },
        "¿Ha evaluado la organización el posible retorno de la inversión (ROI) de las implementaciones de IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Dispone la PYME de la infraestructura o las competencias informáticas necesarias para respaldar la IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Cuáles son los obstáculos o retos percibidos para la adopción de IoT?": {
            "Estático": "No se han identificado los obstáculos ni los retos.",
            "Reactivo": "Se identifican algunos obstáculos y retos, pero no se proponen soluciones.",
            "Proactivo": "Barreras y retos identificados y soluciones propuestas.",
            "Innovador": "Barreras y retos identificados proactivamente y soluciones implementadas"
        },
        "¿Cómo se implementa la contextualización para las tecnologías IoT?": {
            "Estático": "No se han implementado capacidades de contextualización o adaptación para las tecnologías IoT.",
            "Reactivo": "Implementación ad hoc de capacidades de contextualización o adaptación para algunas tecnologías IoT.",
            "Proactivo": "Implementación planificada de capacidades de contextualización o adaptativas a las tecnologías IoT.",
            "Innovador": "Implementación integral de capacidades de contextualización y adaptación en todas las tecnologías IoT de la organización."
        },
        "¿Existen iniciativas para explorar el análisis avanzado (IA/ML) de los datos de IoT?": {
            "Estático": "No hay iniciativas de IA/ML sobre datos de IoT.",
            "Reactivo": "Exploración inicial de iniciativas de IA/ML sobre datos de IoT.",
            "Proactivo": "Iniciativas de IA/ML sobre datos de IoT en curso.",
            "Innovador": "Las iniciativas de IA/ML sobre datos de IoT están totalmente implementadas."
        },
        "¿Cómo contribuyen los sistemas IoT a la ventaja competitiva?": {
            "Estático": "Los sistemas IoT no contribuyen a la ventaja competitiva.",
            "Reactivo": "Pruebas limitadas o anecdóticas de la contribución de los sistemas IoT a la ventaja competitiva.",
            "Proactivo": "Contribución documentada de los sistemas IoT a la ventaja competitiva, basada en los comentarios de los clientes.",
            "Innovador": "Aprovechamiento integral y estratégico de los sistemas IoT para impulsar la mejora continua y mantener una ventaja competitiva, con los comentarios de los clientes impulsando la innovación."
        },
        "¿Cuáles son las estrategias para ampliar las soluciones de IoT a medida que crece la organización?": {
            "Estático": "No existen estrategias para ampliar las soluciones IoT.",
            "Reactivo": "Estrategias ad hoc o limitadas para el escalado de soluciones IoT.",
            "Proactivo": "Estrategias documentadas para ampliar las soluciones de IoT a medida que crece la organización.",
            "Innovador": "Estrategias implementadas para ampliar continuamente las soluciones IoT con el fin de satisfacer las necesidades cambiantes de la organización."
        },
        "¿Existen recursos o equipos dedicados a la investigación y el desarrollo de IoT?": {
            "Estático": "No hay un equipo dedicado a la investigación y el desarrollo de IoT.",
            "Reactivo": "Una persona dedicada a la investigación y desarrollo de IoT.",
            "Proactivo": "Equipo de investigación y desarrollo de IoT de tamaño medio (2 a 4 personas).",
            "Innovador": "Equipo de investigación y desarrollo de IoT grande (5 personas o más)."
        },
        "¿Se comparten dentro de la organización las lecciones aprendidas y las mejores prácticas para el IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Existen iniciativas para colaborar con centros/instituciones de investigación, universidades o consorcios industriales sobre IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Personaliza la empresa sus soluciones IoT en función de las necesidades y el contexto específicos de cada vertical?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Conoce la empresa las limitaciones normativas específicas de su sector, los requisitos de la cadena de suministro y otros factores contextuales en relación con el IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Ha desarrollado la empresa sus propias plataformas para atender mejor a su clientela con soluciones de IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Existe un mecanismo de colaboración con el cliente para comprender sus retos específicos y crear soluciones conjuntas de IoT?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Conoce las soluciones específicas de IoT disponibles para su sector empresarial?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        },
        "¿Sus soluciones IoT en la organización responden a necesidades específicas del sector o son genéricas?": {
            "Estático": "No",
            "Reactivo": "",
            "Proactivo": "",
            "Innovador": "Sí"
        }
    }
};

const maturityLevels = ["Estático", "Reactivo", "Proactivo", "Innovador"];









































const profileTranslations = {
  manager: 'Gerente',
  engineer: 'Ingeniero',
  technician: 'Técnico'
};

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

  const targetTab = document.getElementById(tabName);
  if (targetTab) {
       targetTab.style.display = 'block';
  } else {
       console.error(`Tab content with ID '${tabName}' not found.`);
       document.getElementById('presentation').style.display = 'block'; // Fallback
       document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
       document.querySelector('.tabs button[onclick="openTab(\'presentation\')"]')?.classList.add('active');
       return;
  }

  const clickedButton = document.querySelector(`.tabs button[onclick="openTab('${tabName}')"]`);
  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));

  if (clickedButton) {
      clickedButton.classList.add('active');
  } else {
       // Fallback if button not directly found (e.g. model tab initially hidden)
       // For 'presentation', it should always be found.
       // If 'model' tab was hidden and is now shown by selecting a profile,
       // its button might need explicit activation if openTab is called indirectly.
       // However, selecting a profile already calls openTab('model'), which should handle it.
       const presentationButton = document.querySelector('.tabs button[onclick="openTab(\'presentation\')"]');
       if (tabName === 'presentation' && presentationButton) {
           presentationButton.classList.add('active');
       }
  }
}



// REEMPLAZA LA FUNCIÓN ANTIGUA CON ESTA VERSIÓN CORREGIDA

function loadCompanyProgress() {
    // Busca el input y los botones DENTRO del contenedor de login de la pestaña "model"
    // Esto evita conflictos si existen otros elementos con el mismo ID en otra parte.
    const loginContainer = document.getElementById('model-login-container');
    const companyIdInput = loginContainer.querySelector('#company-id');
    const progressDiv = loginContainer.querySelector('#company-progress');
    const profileButtonsDiv = loginContainer.querySelector('.profile-buttons');

    const companyId = companyIdInput.value.trim();

    // Limpia el progreso anterior y oculta los botones
    progressDiv.innerHTML = '';
    if (profileButtonsDiv) {
        profileButtonsDiv.style.display = 'none';
    }

    if (!companyId) {
        alert('Por favor, ingrese el ID de su empresa.');
        companyIdInput.focus();
        return;
    }

    // El resto de la lógica permanece igual
    if (companyProfiles[companyId]) {
        const progress = checkCompanyProgress(companyId);
        progressDiv.innerHTML = `
            <h3>Progreso de la empresa:</h3>
            <p>Gerente: ${progress.manager.toFixed(2)}%</p>
            <p>Ingeniero: ${progress.engineer.toFixed(2)}%</p>
            <p>Técnico: ${progress.technician.toFixed(2)}%</p>
        `;
        // ÉXITO: Muestra los botones de perfil
        if (profileButtonsDiv) {
            profileButtonsDiv.style.display = 'flex';
        }
    } else {
        alert(
            'ID de empresa no encontrado. Por favor, verifique el ID o registre una nueva empresa.'
        );
        // FALLO: Los botones permanecen ocultos
    }
}



function areAllThreeProfilesComplete(companyId) {
  if (!companyProfiles[companyId]) {
      console.log("areAllThreeProfilesComplete: No company profile data for ID", companyId);
      return false; // No data for this company yet
  }

  const requiredProfiles = ['manager', 'engineer', 'technician'];
  for (const profile of requiredProfiles) {
      // Check if this profile's questions are defined (should always be true with current setup)
      if (!questions[profile]) {
          console.warn(`areAllThreeProfilesComplete: Profile ${profile} not defined in questions object.`);
          return false;
      }

      const profileAnswers = companyProfiles[companyId][profile];
      // Check if answers exist for this profile
      if (!profileAnswers) {
          console.log(`areAllThreeProfilesComplete: No answers yet for profile ${profile} for company ${companyId}`);
          return false; // This profile hasn't started answering or has no saved answers
      }

      // Check if all questions for this profile are answered (value is not null or undefined)
      // questions[profile] is an array of question objects
      // profileAnswers is an object like {0: score1, 1: score2, ...}
      const totalQuestionsForProfile = questions[profile].length;
      let answeredQuestionsCount = 0;
      for(let i = 0; i < totalQuestionsForProfile; i++) {
          if (profileAnswers.hasOwnProperty(i) && profileAnswers[i] != null) {
              answeredQuestionsCount++;
          }
      }

      if (answeredQuestionsCount < totalQuestionsForProfile) {
          console.log(`areAllThreeProfilesComplete: Profile ${profile} for company ${companyId} has ${answeredQuestionsCount}/${totalQuestionsForProfile} questions answered.`);
          return false; // Not all questions answered for this profile
      }
      console.log(`areAllThreeProfilesComplete: Profile ${profile} for company ${companyId} is complete.`);
  }
  console.log(`areAllThreeProfilesComplete: All three profiles complete for company ${companyId}.`);
  return true; // All required profiles have answered all their questions
}



// CÓDIGO CORREGIDO
function populateDropdowns () {
  // 1. Llama a esta función, que ya se encarga de poblar la lista de países.
  toggleCountryList (); 

  // (El bloque que poblaba la lista por segunda vez se ha eliminado)

  // 2. Continúa poblando las otras listas desplegables como antes.
  const activitySelect = document.getElementById ('main-activity');
  industrialActivities.forEach (activity => {
    const option = document.createElement ('option');
    option.value = activity;
    option.text = activity;
    activitySelect.add (option);
  });

  const legalFigureSelect = document.getElementById ('legal-figure');
  legalFigures.forEach (figure => {
    const option = document.createElement ('option');
    option.value = figure;
    option.text = figure;
    legalFigureSelect.add (option);
  });
}

async function registerCompany() {
    const registerButton = document.querySelector('#registration-form button');
    if (registerButton) {
        registerButton.disabled = true;
        registerButton.textContent = 'Registrando...';
    }

    try {
        const companyName = document.getElementById('company-name').value;
        const country = document.getElementById('country').value;
        const mainActivity = document.getElementById('main-activity').value;
        const companySize = document.getElementById('company-size').value;
        const legalFigure = document.getElementById('legal-figure').value;
        const managerEmail = document.getElementById('manager-email').value;
        const engineerEmail = document.getElementById('engineer-email').value;
        const technicianEmail = document.getElementById('technician-email').value;
        
        let missingFields = [];
        if (!companyName) missingFields.push("Nombre de la empresa");
        if (!country) missingFields.push("País");
        if (!mainActivity) missingFields.push("Actividad principal");
        if (!companySize) missingFields.push("Tamaño de la empresa");
        if (!legalFigure) missingFields.push("Figura legal");
        if (!managerEmail && !engineerEmail && !technicianEmail) missingFields.push("Al menos un correo electrónico");

        if (missingFields.length > 0) {
            alert(`Por favor, complete los siguientes campos obligatorios:\n- ${missingFields.join('\n- ')}`);
            if (registerButton) {
                registerButton.disabled = false;
                registerButton.textContent = 'Registrar';
            }
            return;
        }

        const companyId = generateUniqueId();
        const companyData = {
            id: companyId, companyName, country, mainActivity, companySize, legalFigure, managerEmail, engineerEmail, technicianEmail,
            componentScores: {}, dimensionScores: {}, overallScore: null
        };

        const profilesToSave = JSON.parse(JSON.stringify(companyProfiles));
        if (!profilesToSave[companyId]) {
            profilesToSave[companyId] = { manager: {}, engineer: {}, technician: {} };
        }
        
        const allDataToSave = JSON.parse(JSON.stringify(allCompaniesData));
        allDataToSave.push(companyData);

        await Promise.all([
            saveInfo(profilesToSave, 1),
            saveInfo(allDataToSave, 2)
        ]);

        companyProfiles = profilesToSave;
        allCompaniesData = allDataToSave;

        sendRegistrationEmails(companyId, managerEmail, engineerEmail, technicianEmail);

        alert(`¡Empresa registrada con éxito! Su ID único es: ${companyId}\n\nSerá redirigido para comenzar a responder los cuestionarios.`);

        // --- LÓGICA DE NAVEGACIÓN CORREGIDA ---
        // 1. Cambiamos a la pestaña "Modelo de Madurez".
        openTab('model');

        // 2. Pre-rellenamos el campo de ID en esa pestaña.
        document.getElementById('company-id').value = companyId;
        
        // 3. Limpiamos el formulario de registro.
        document.getElementById('registration-form').reset();
        
        // 4. Cargamos el progreso, lo que mostrará los botones de perfil listos para usar.
        loadCompanyProgress();

    } catch (error) {
        console.error("Error durante el registro:", error);
        alert(`Error al registrar la empresa: ${error.message}. Intente de nuevo.`);
    } finally {
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

function selectProfile(profile) {
    const companyId = document.getElementById('company-id').value;
    if (!companyId || !companyProfiles[companyId]) {
        alert('Por favor, ingrese un ID de empresa válido.');
        return;
    }

    // Oculta el contenedor de login y muestra el contenedor del cuestionario.
    // Todo sucede dentro de la misma pestaña "Modelo de Madurez".
    document.getElementById('model-login-container').style.display = 'none';
    document.getElementById('model-content-container').style.display = 'block';

    // Carga las preguntas para el perfil seleccionado.
    loadQuestions(profile, companyId);
}



function loadQuestions(profile, companyId) {
  const questionsContainer = document.getElementById('questions-container');
  const profileInfoDiv = document.getElementById('profile-info');
  questionsContainer.innerHTML = ''; 

  const profileNameSpanish = profileTranslations[profile] || profile.charAt(0).toUpperCase() + profile.slice(1);
  profileInfoDiv.innerHTML = `<h2>Preguntas para el perfil de: <strong>${profileNameSpanish}</strong></h2>`;

  const currentAnswers = companyProfiles[companyId]?.[profile] || {};

  questions[profile].forEach((question, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question';

      const componentSpanish = componentTranslations[question.component] || question.component;
      const dimensionSpanish = dimensionTranslations[question.dimension] || question.dimension;

      const heading = document.createElement('h3');
      heading.textContent = question.text;
      questionDiv.appendChild(heading);

      const metaSpan = document.createElement('span');
      metaSpan.className = 'question-meta';
      metaSpan.innerHTML = `${componentSpanish} /<br>${dimensionSpanish}`;
      questionDiv.appendChild(metaSpan);

      const radioContainer = document.createElement('div');
      radioContainer.style.marginTop = '15px';

      // *** MODIFICACIÓN CLAVE AQUÍ ***
      question.answers.forEach(answer => {
          const answerValue = answer.score;
          const radioButtonId = `${profile}-q${index}-ans${answerValue}`;
          const radioButtonName = `${profile}-q${index}`;
          // Comparamos por 'score' para ver si está seleccionado
          const isChecked = currentAnswers[index]?.score == answerValue; 

          const radioLabel = document.createElement('label');
          radioLabel.htmlFor = radioButtonId;

          const radioButton = document.createElement('input');
          radioButton.type = 'radio';
          radioButton.name = radioButtonName;
          radioButton.id = radioButtonId;
          radioButton.value = answerValue;
          
          // Guardamos el nivel y el texto en atributos de datos para recuperarlos fácilmente
          radioButton.dataset.level = answer.level; 
          radioButton.dataset.text = answer.text;

          if (isChecked) {
              radioButton.checked = true;
          }

          radioLabel.appendChild(radioButton);
          radioLabel.appendChild(document.createTextNode(` ${answer.text}`));
          radioContainer.appendChild(radioLabel);
      });
      // *** FIN DE LA MODIFICACIÓN ***
      
      questionDiv.appendChild(radioContainer);
      questionsContainer.appendChild(questionDiv);
  });

  showSaveButton(profile, companyId);
  updateCalculateButton(companyId);
}



// En script.js, reemplaza la función saveAnswers

async function saveAnswers(profile, companyId) {
    let allAnsweredThisProfile = true;
    const saveButton = document.getElementById(`save-button-${profile}`);

    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = 'Guardando...';
    }

    try {
        const questionDivs = document.querySelectorAll('#questions-container .question');
        questionDivs.forEach((questionDiv, index) => {
            const radioButtonName = `${profile}-q${index}`;
            const selectedAnswer = questionDiv.querySelector(`input[name="${radioButtonName}"]:checked`);

            if (selectedAnswer) {
                if (!companyProfiles[companyId]) companyProfiles[companyId] = {};
                if (!companyProfiles[companyId][profile]) companyProfiles[companyId][profile] = {};
                
                // *** MODIFICACIÓN CLAVE: Guardar el objeto completo ***
                companyProfiles[companyId][profile][index] = {
                    score: parseInt(selectedAnswer.value),
                    level: selectedAnswer.dataset.level,
                    text: selectedAnswer.dataset.text
                };
                // *** FIN DE LA MODIFICACIÓN ***

            } else {
                allAnsweredThisProfile = false;
            }
        });

        if (allAnsweredThisProfile) {
            await saveInfo(companyProfiles, 1);
            alert(`Respuestas guardadas para ${profile} de la empresa ${companyId}!`);
            
            // Lógica de redirección (sin cambios)
            if (!areAllThreeProfilesComplete(companyId)) {
                alert("Volviendo a la página de presentación. Por favor, complete los cuestionarios de los perfiles restantes.");
                openTab('presentation');
            }
        } else {
            alert(`Por favor, responda todas las preguntas para el perfil de ${profileTranslations[profile] || profile} antes de guardar.`);
        }
        updateCalculateButton(companyId);

    } catch (error) {
        console.error(`Error saving answers for ${profile}:`, error);
        alert(`Error al guardar las respuestas para ${profile}. Por favor, intente de nuevo. Detalles: ${error.message}`);
    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = `Guardar respuestas de ${profileTranslations[profile] || profile.charAt(0).toUpperCase() + profile.slice(1)}`;
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



// En script.js, REEMPLAZA tu función calculateScore con esta versión optimizada.

async function calculateScore(companyId) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('show');

    // --- Verificaciones y mensaje de carga (sin cambios) ---
    if (!companyId) { /* ... */ return; }
    if (!allCompaniesData || !allCompaniesData.length || !companyProfiles || !Object.keys(companyProfiles).length) { /* ... */ return; }
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-feedback';
    loadingDiv.innerHTML = '<p style="text-align: center; padding: 30px; font-style: italic; color: var(--secondary-color);">Calculando puntuaciones y generando análisis completo. Esto puede tardar un momento...</p>';
    resultsDiv.appendChild(loadingDiv);
    resultsDiv.classList.add('show');

    const companyIndex = allCompaniesData.findIndex(c => c.id === companyId);
    if (companyIndex === -1) { /* ... */ return; }
    const companyInfo = allCompaniesData[companyIndex];

    try {
        // --- Cálculo de scores (sin cambios) ---
        const titleDiv = document.createElement('div');
        titleDiv.innerHTML = '<h2 class="results-main-title">Resultados obtenidos con FREEPORT</h2>';
        const componentScores = {};
        const dimensionScores = { technological: 0, human: 0, organizational: 0 };
        for (const component in componentWeights) componentScores[component] = 0;

        if (companyProfiles[companyId]) {
            for (const profile in companyProfiles[companyId]) {
                if (questions[profile]) {
                    questions[profile].forEach((question, index) => {
                        const answerData = companyProfiles[companyId][profile][index];
                        if (answerData?.score) {
                            const score = answerData.score;
                            const componentName = question.component;
                            const dimensionName = question.dimension;
                            if (componentName && componentWeights.hasOwnProperty(componentName)) {
                                const maxPointsForQuestion = 15;
                                let numQuestionsComponent = 0;
                                for (const prof in questions) {
                                    if (questions[prof]) {
                                        numQuestionsComponent += questions[prof].filter(q => q.component === componentName).length;
                                    }
                                }
                                if (numQuestionsComponent > 0) {
                                    componentScores[componentName] += (score / maxPointsForQuestion) * componentWeights[componentName] / numQuestionsComponent;
                                }
                            }
                            if (dimensionName) dimensionScores[dimensionName] += score;
                        }
                    });
                }
            }
        } else { throw new Error(`Datos del perfil para la empresa con ID ${companyId} no encontrados.`); }

        let overallScore = Object.values(componentScores).reduce((sum, score) => sum + score, 0);
        overallScore = Math.min(overallScore, 100);

        const updatedCompanyData = { ...companyInfo, componentScores, dimensionScores, overallScore };
        allCompaniesData[companyIndex] = updatedCompanyData;
        await saveInfo(allCompaniesData, 2);
        
        // --- LLAMADA ÚNICA A LA IA ---
        const scoresForFeedback = { overallScore, componentScores, dimensionScores };
        const fullAnalysisText = await generateComprehensiveAnalysis(scoresForFeedback, companyInfo, companyId);
        
        // --- PROCESAMIENTO Y RENDERIZADO DE LA RESPUESTA ÚNICA ---
        loadingDiv.remove();
        resultsDiv.appendChild(titleDiv);
        
        // Renderizado de Gráficos y Scores (sin cambios)
        const chartsDiv = document.createElement('div');
        chartsDiv.className = 'charts-container';
        chartsDiv.innerHTML = `<canvas id="chart0"></canvas><canvas id="chart1"></canvas><canvas id="chart2"></canvas>`;
        resultsDiv.appendChild(chartsDiv);
        ['chart0', 'chart1', 'chart2'].forEach(id => Chart.getChart(id)?.destroy());
        createComponentChart(componentScores);
        createDimensionChart(dimensionScores);
        createOverallScoreChart(overallScore);

        let scoresText = `<div class="results-section"><div class="scores-container"><h3>Puntuación por Componentes</h3><ul>`;
        for (const component in componentScores) scoresText += `<li><b>${component}:</b> ${componentScores[component]?.toFixed(2) ?? 'N/A'}</li>`;
        scoresText += `</ul></div></div><div class="results-section"><div class="scores-container"><h3>Puntuación por Dimensiones (Bruto)</h3><ul>`;
        for (const dimension in dimensionScores) scoresText += `<li><b>${dimension.charAt(0).toUpperCase() + dimension.slice(1)}:</b> ${dimensionScores[dimension]?.toFixed(2) ?? 'N/A'}</li>`;
        scoresText += `</ul></div></div><div class="results-section"><div class="scores-container"><h3>Puntuación General</h3><p><b>Puntuación total:</b> ${overallScore.toFixed(2)} / 100</p></div></div>`;
        const scoresDiv = document.createElement('div');
        scoresDiv.innerHTML = scoresText;
        resultsDiv.appendChild(scoresDiv);

        // Separar la respuesta de Gemini en las dos partes que pedimos
        const analysisParts = fullAnalysisText.split('## Próximos Pasos para Avanzar');
        const generalAnalysisHTML = analysisParts[0]
            .replace('## Análisis y Recomendaciones Generales', '')
            .replace(/\n\*\s/g, '<br>• ')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/###\s(.*?)(<br>|$)/g, '<h4>$1</h4>'); // Formatear subtítulos


            let nextStepsHTML = "";
if (analysisParts[1] && analysisParts[1].trim() !== "") {
    nextStepsHTML = analysisParts[1]
        // 1. Convierte los títulos ### a <h4> dentro de un div con estilo
        .replace(/###\s(.*?)\n/g, '</div><div class="recommendation-item"><h4>$1</h4>')
        // 2. Convierte los asteriscos (*) en elementos de lista. Esto es para el formato que pedimos.
        .replace(/\*\s(.*?)\n/g, '<li>$1</li>')
        // 3. Convierte las negritas de Markdown (**) a etiquetas <b>
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        // 4. Convierte los saltos de línea restantes en <br> para separar los puntos
        .replace(/\n/g, '<br>');

    // 5. Limpieza final:
    // - Elimina el `</div>` extra del principio.
    // - Envuelve todo en un `div` contenedor para asegurar que el estilo se aplique correctamente.
    // - Cierra el último `</div>` del `recommendation-item`.
    if (nextStepsHTML.startsWith('</div>')) {
        nextStepsHTML = nextStepsHTML.substring(6);
    }
    nextStepsHTML = `<div class="recommendations-wrapper">${nextStepsHTML}</div>`;

} else {
    nextStepsHTML = "<p>No se generaron próximos pasos específicos o ya se encuentra en el nivel máximo en todas las áreas.</p>";
}




        // Renderizar Parte 1: Análisis General
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'results-section ai-feedback-section';
        feedbackDiv.innerHTML = `
            <h3><i class="fas fa-lightbulb"></i> Análisis y Recomendaciones Generales</h3>
            <div class="ai-feedback-content">${generalAnalysisHTML}</div>`;
        resultsDiv.appendChild(feedbackDiv);
        
        // Renderizar Parte 2: Próximos Pasos
        const recommendationsContainer = document.createElement('div');
        recommendationsContainer.className = 'results-section recommendations-section';
        recommendationsContainer.innerHTML = `<h3><i class="fas fa-arrow-up"></i> Próximos Pasos para Avanzar</h3>${nextStepsHTML}`;
        resultsDiv.appendChild(recommendationsContainer);

        // --- Envío de Email (sin cambios, ahora enviará el análisis completo) ---
        await sendResultsEmailWithFeedback(companyId, companyInfo, scoresForFeedback, fullAnalysisText);

    } catch (generalError) {
        console.error("Un error inesperado ocurrió durante el cálculo de la puntuación:", generalError);
        resultsDiv.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">Ocurrió un error al calcular los resultados. Error: ${generalError.message}</p>`;
        resultsDiv.classList.add('show');
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

function returnToProfileSelection() {
    // Muestra la pantalla de login/selección de perfil
    document.getElementById('model-login-container').style.display = 'block';

    // Oculta la pantalla de preguntas/resultados
    document.getElementById('model-content-container').style.display = 'none';

    // Limpia el contenido dinámico para evitar que se muestre brevemente la próxima vez
    document.getElementById('questions-container').innerHTML = '';
    document.getElementById('buttons-container').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    document.getElementById('profile-info').innerHTML = '';
}


function showSaveButton(profile, companyId) {
  const buttonsContainer = document.getElementById('buttons-container');
  buttonsContainer.innerHTML = ''; // Clear previous buttons

  const saveButton = document.createElement('button');
  saveButton.id = `save-button-${profile}`; // Keep the existing ID

  const profileNameDisplay = profileTranslations[profile] || profile.charAt(0).toUpperCase() + profile.slice(1);
  saveButton.textContent = `Guardar respuestas de ${profileNameDisplay}`;

  saveButton.onclick = () => saveAnswers(profile, companyId);
  saveButton.classList.add('form-button'); // Add class for styling if needed
  buttonsContainer.appendChild(saveButton);

  const clearButton = document.createElement('button');
  clearButton.id = `clear-button-${profile}`;
  clearButton.textContent = `Limpiar mis respuestas`;
  clearButton.onclick = () => clearProfileAnswers(profile, companyId);
  clearButton.classList.add('form-button', 'secondary-button');
  buttonsContainer.appendChild(clearButton);

  const backButton = document.createElement('button');
  backButton.textContent = 'Volver';
  backButton.onclick = returnToProfileSelection; // Asigna la nueva función
  backButton.classList.add('form-button', 'secondary-button'); // Usa la clase de estilo
  buttonsContainer.appendChild(backButton);

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

// Reemplaza esta función completa
function updateCalculateButton(companyId) {
  let allProfilesRegisteredAndAnswered = true; // Assume true initially

  // Check if data for the companyId exists
  if (!companyProfiles[companyId]) {
    allProfilesRegisteredAndAnswered = false;
  } else {
    // Iterate through the standard profiles to see if they've all answered
    const standardProfiles = ['manager', 'engineer', 'technician'];
    for (const profile of standardProfiles) {
      // Check if question definitions exist for this profile (should always be true)
      if (!questions[profile]) {
        allProfilesRegisteredAndAnswered = false;
        break;
      }
      // Check if this company has this profile's answers
      if (!companyProfiles[companyId][profile]) {
        allProfilesRegisteredAndAnswered = false;
        break;
      }
      // Check if all questions for this profile are answered
      if (
        !questions[profile].every(
          (_, index) => companyProfiles[companyId][profile].hasOwnProperty(index) &&
                         companyProfiles[companyId][profile][index] != null
        )
      ) {
        allProfilesRegisteredAndAnswered = false;
        break;
      }
    }
  }

  // Se busca el botón por su clase única para mayor robustez
  const calculateButton = document.querySelector('.calculate-button');
  if (calculateButton) {
      calculateButton.disabled = !allProfilesRegisteredAndAnswered;
      
      // Asigna o remueve el evento onclick para asegurar que el companyId es el correcto
      if (!calculateButton.disabled) {
          calculateButton.onclick = () => calculateScore(companyId);
      } else {
          // Si está deshabilitado, quita el evento para evitar ejecuciones accidentales
          calculateButton.onclick = null; 
      }
  }
}

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
// In saveInfo, REMOVED fetchData call and added parallel processing capability
async function saveInfo(dataToSave, tipo) {
  const url = urlbase; // Apps script URL handles routing via doPost
  const jsonDataPayload = {
    json: JSON.stringify(dataToSave),
    tipo: tipo,
  };
  try {
    console.log(`Sending data (type ${tipo}) to Apps Script...`);
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
        // Avoid logging large HTML error pages if Apps Script returns one
        if (errorBody && !errorBody.trim().startsWith('<')) {
          errorText += ` - ${errorBody}`;
        }
      } catch (e) { /* Ignore if cannot read body */ }
      throw new Error(`Error saving data (type ${tipo}): ${response.status} - ${errorText}`);
    }
    const result = await response.json();
    console.log(`Apps Script Response for type ${tipo}:`, result);
    
    // Check if Apps Script explicitly signaled an error in its JSON response
    if (result && result.status === 'error') {
      throw new Error(`Apps Script reported error for type ${tipo}: ${result.message || 'Unknown error'}`);
    }
    return result; // Return the parsed response from Apps Script
  } catch (error) {
    console.error(`Error in saveInfo for type ${tipo}:`, error);
    throw error; // Re-throw the error to be caught by the calling function
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




// Añade estas nuevas funciones a tu script.js

/**
 * Llama a la API de Gemini para obtener una recomendación específica.
 * @param {string} question - La pregunta que evalúa el área de madurez.
 * @param {string} currentLevel - El nombre del nivel actual (ej. "Reactivo").
 * @param {string} currentDescription - La descripción del nivel actual.
 * @param {string} nextLevel - El nombre del siguiente nivel (ej. "Proactivo").
 * @param {string} nextDescription - La descripción del siguiente nivel.
 * @returns {Promise<string>} La recomendación generada por la IA.
 */



/**
 * Orquesta la generación de recomendaciones para las áreas de mejora.
 * @param {string} companyId - El ID de la empresa.
 * @returns {Promise<Array<object>>} Una lista de objetos con las recomendaciones.
 */

// En script.js, añade esta nueva función (reemplaza las 3 eliminadas)

/**
 * Genera un análisis completo (general y específico por área) con una sola llamada a la API de Gemini.
 * @param {object} scores - Objeto con las puntuaciones (overallScore, componentScores, dimensionScores).
 * @param {object} companyInfo - Información de la empresa.
 * @param {string} companyId - El ID de la empresa para buscar las respuestas específicas.
 * @returns {Promise<string>} El análisis completo en formato Markdown.
 */


// En script.js, REEMPLAZA tu función generateComprehensiveAnalysis con esta versión CORREGIDA.

async function generateComprehensiveAnalysis(scores, companyInfo, companyId) {
    console.log("Iniciando generación de análisis completo para:", companyInfo.companyName);

    // --- 1. Recopilar contextos ---
    let fullAnswersContext = "";
    let improvementAreasContext = "";
    const companyAnswers = companyProfiles[companyId];

    if (companyAnswers) {
        for (const profile in companyAnswers) {
            for (const qIndex in companyAnswers[profile]) {
                const answerData = companyAnswers[profile][qIndex];
                const questionData = questions[profile][qIndex];
                const currentLevel = answerData.level;
                const questionText = questionData.text;
                const component = questionData.component;

                if (currentLevel) { // Solo si hay una respuesta válida
                    const currentDescription = rubricData[component]?.[questionText]?.[currentLevel] || answerData.text;
                    
                    fullAnswersContext += `
- Pregunta: "${questionText}"
  - Nivel alcanzado: **${currentLevel}** ("${currentDescription}")
`;
                    
                    const currentLevelIndex = maturityLevels.indexOf(currentLevel);
                    if (currentLevelIndex < maturityLevels.length - 1) {
                        const nextLevel = maturityLevels[currentLevelIndex + 1];
                        const nextDescription = rubricData[component]?.[questionText]?.[nextLevel] || "N/A";
                        
                        improvementAreasContext += `
- Área de Mejora: "${questionText}"
  - Nivel Actual: ${currentLevel}
  - Objetivo para avanzar: Nivel **${nextLevel}** ("${nextDescription}")
`;
                    }
                }
            }
        }
    }
    
    if (improvementAreasContext === "") {
        improvementAreasContext = "La empresa ha alcanzado el nivel máximo en todas las áreas evaluadas. ¡Excelente trabajo!";
    }

    // --- 2. Construir el "Mega-Prompt" REFINADO ---
    // *** CORRECCIÓN CLAVE: El prompt ahora es una plantilla genérica. Los detalles específicos se insertarán en el bucle de la Parte 2 ***
    const prompt = `
Eres un consultor de élite, experto en el modelo de madurez IoT FREEPORT. Tu comunicación es directa, precisa y orientada a la acción.

**Contexto de la Empresa:**
- Nombre: "${companyInfo.companyName}"
- Actividad Principal: "${companyInfo.mainActivity}"
- Tamaño: "${companyInfo.companySize}"

**Resultados del Modelo de Madurez:**
- Puntuación General: ${scores.overallScore.toFixed(2)} / 100
- Puntuaciones por Componente:
    - Gestión de Dispositivos: ${scores.componentScores['Device Management']?.toFixed(2)}
    - Gestión de Conectividad: ${scores.componentScores['Connectivity Management']?.toFixed(2)}
    - Gestión de Nube/Borde: ${scores.componentScores['Cloud/Edge Management']?.toFixed(2)}
    - Integración Empresarial: ${scores.componentScores['Enterprise Integration']?.toFixed(2)}
    - Seguridad: ${scores.componentScores['Security']?.toFixed(2)}
    - Cumplimiento: ${scores.componentScores['Compliance']?.toFixed(2)}
    - Contextualización: ${scores.componentScores['Contextualization']?.toFixed(2)}

**Diagnóstico Detallado (Respuestas del Usuario):**
${fullAnswersContext}

**Áreas Específicas para Avanzar al Siguiente Nivel:**
${improvementAreasContext}

**--- TU TAREA ---**
Genera un informe en español con formato Markdown, dividido en DOS PARTES.

**PARTE 1: ANÁLISIS GENERAL**
Bajo el título "## Análisis y Recomendaciones Generales", proporciona:
1.  **Evaluación General:** Un párrafo conciso resumiendo el estado de madurez IoT.
2.  **Fortalezas Clave:** 2 o 3 puntos destacando las áreas de mayor madurez.
3.  **Áreas Críticas de Enfoque:** 2 o 3 puntos identificando las áreas más importantes a mejorar.

**PARTE 2: PRÓXIMOS PASOS PARA AVANZAR**
Bajo el título "## Próximos Pasos para Avanzar", para CADA UNA de las "Áreas de Mejora" que te he proporcionado en el contexto, genera una subsección que siga ESTRICTAMENTE este formato:

### [Componente]: [Pregunta]
*   **Nivel Actual:** [Nombre del Nivel Actual]
*   **Para avanzar al nivel [Nombre del Siguiente Nivel], la acción prioritaria es:** [Genera aquí UNA SOLA frase de acción. Debe ser la recomendación más impactante y directa para lograr la descripción del nivel objetivo. Sé prescriptivo y claro. Por ejemplo: "Implementar un sistema de inventario centralizado para todos los dispositivos IoT."]

Repite este formato para cada área de mejora. No añadas introducciones ni texto extra.
`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 }
    };

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Gemini API Error Response:', errorBody);
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            console.log("Análisis completo generado exitosamente.");
            return data.candidates[0].content.parts[0].text;
        } else {
            console.warn("Respuesta de Gemini sin contenido válido:", data);
            return "## Error\nNo se pudo generar el análisis.";
        }
    } catch (error) {
        console.error('Error llamando a la API de Gemini:', error);
        return `## Error\nError al contactar al servicio de IA: ${error.message}`;
    }
}

const componentTranslations = {
  'Device Management': 'Gestión Dispositivos',
  'Connectivity Management': 'Gestión Conectividad',
  'Cloud/Edge Management': 'Gestión Nube/Borde',
  'Enterprise Integration': 'Integración Empresarial',
  'Security': 'Seguridad',
  'Compliance': 'Cumplimiento',
  'Contextualization': 'Contextualización',
};

const dimensionTranslations = {
  'technological': 'Tecnológica',
  'human': 'Humana',
  'organizational': 'Organizacional',
};


window.addEventListener ('DOMContentLoaded', initializePage);
