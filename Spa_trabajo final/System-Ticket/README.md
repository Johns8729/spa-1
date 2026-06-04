# System-Ticket/

├── data/ <-- Aquí van las "Bases de Datos" JSON
│ ├── auth-db.json
│ └── data-db.json
├── src/ <-- Aquí va todo el código fuente de la app
│ ├── css/
│ │ └── styles.css <-- (Opcional, si agregan estilos propios)
│ ├── js/
│ │ ├── auth.js <-- Lógica de Login y Logout
│ │ ├── dashboard.js <-- Lógica del Workspace y filtrado de tickets
│ │ └── tickets.js <-- Lógica de crear, asignar y cerrar tickets
│ └── main.js <-- El cerebro que arranca la app e inicializa las vistas
├── index.html <-- El archivo principal en la raíz
├── package.json <-- Configuración de dependencias de Node
└── README.md <-- Documentación del proyecto en inglés
