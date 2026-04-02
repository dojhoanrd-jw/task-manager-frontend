# Task Manager Frontend

Frontend en Vue.js para la aplicacion Task Manager con gestion de tareas por proyectos, usuarios y roles.

## Arquitectura

```
Frontend (Vue.js :3000) → API Gateway (Node.js) → Task Service (Go) → Firestore
```

## Estructura del proyecto

```
src/
├── features/
│   ├── auth/                  # Autenticacion (login, register)
│   │   ├── components/
│   │   └── store/
│   ├── projects/              # Gestion de proyectos
│   │   ├── components/
│   │   └── store/
│   └── tasks/                 # Gestion de tareas
│       ├── components/
│       └── store/
├── shared/
│   ├── api/                   # HTTP client centralizado
│   ├── components/            # Componentes reutilizables
│   ├── errors/                # Manejo centralizado de errores
│   ├── router/                # Configuracion de rutas
│   └── styles/                # Estilos globales
├── views/                     # Vistas principales
├── App.vue
└── main.js
```

## Funcionalidades

- Login y registro de usuarios
- Gestion de proyectos (crear, seleccionar)
- Crear tareas con titulo y descripcion
- Marcar tareas como completadas (strikethrough)
- Eliminar tareas
- Virtual scroll con paginacion cursor-based
- Cada tarea muestra: ID, titulo, descripcion, fecha (dd-mmm-yy), hora (hh:mm)

## Configuracion local

```bash
# Clonar repositorio
git clone <url-del-repo>
cd task-manager-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

La app estara disponible en `http://localhost:3000`

## Variables de entorno

```
VITE_API_URL=https://api-gateway-540262747578.us-central1.run.app/api
```

## Build para produccion

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

## Deploy en Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Tecnologias

- **Vue.js 3** - Composition API
- **Vue Router 4** - Navegacion SPA
- **Pinia** - State management
- **Axios** - HTTP client
- **Vite** - Build tool
- **Firebase Hosting** - Deploy
