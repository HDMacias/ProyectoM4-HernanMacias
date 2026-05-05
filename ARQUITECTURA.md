# 🏗️ Arquitectura del Proyecto Task Manager

## Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                       APP (React + Vite)                        │
│                      (src/App.tsx)                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                    ┌───────┴────────┐
                    │ BrowserRouter  │
                    │ AuthProvider   │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼──┐         ┌─────▼──────┐      ┌────▼────┐
    │LOGIN │         │  REGISTER  │      │  TASKS  │
    └───┬──┘         └─────┬──────┘      └────┬────┘
        │                  │                   │
        └──────────────────┼───────────────────┘
                           │
                 ┌─────────▼─────────┐
                 │  ProtectedRoute   │ (solo /tasks)
                 │  (verifica user)  │
                 └─────────┬─────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐      ┌────▼──────┐    ┌─────▼──────┐
   │TaskForm  │      │TaskList   │    │EmailSummary│
   └────┬─────┘      └────┬──────┘    └─────┬──────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                ┌─────────▼──────────┐
                │   useTasks Hook    │
                │ (CRUD + Real-time) │
                └─────────┬──────────┘
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
   ┌────▼──────┐  ┌───────▼────────┐  ┌────▼────────────┐
   │  Firebase │  │ emailService   │  │ AuthContext    │
   │  (CRUD)   │  │ (sendEmail)    │  │ (login/logout) │
   └────┬──────┘  └───────┬────────┘  └────┬───────────┘
        │                 │                 │
   ┌────▼──────────┐  ┌───▼─────┐     ┌────▼──────────┐
   │   Firestore   │  │Vercel   │     │ Firebase Auth │
   │   (Database)  │  │Function │     │  (Web SDK)    │
   └───────────────┘  │(Serverless)   └───────────────┘
                      └───┬─────┐
                          │     └─────────────────┐
                      ┌───▼──────┐           ┌────▼────┐
                      │  AWS SES │           │  Email  │
                      │(SendEmail)│          │  User   │
                      └──────────┘           └─────────┘
```

---

## Estructura de Carpetas Detallada

```
task-manager/
│
├── src/
│   │
│   ├── App.tsx                           # Componente raíz (Routing)
│   ├── main.tsx                          # Punto de entrada
│   ├── index.css                         # Estilos globales
│   │
│   ├── components/                       # Componentes reutilizables
│   │   ├── TaskForm.tsx                  # Formulario para crear tareas
│   │   ├── TaskList.tsx                  # Contenedor de lista
│   │   ├── TaskItem.tsx                  # Item individual (edit/delete)
│   │   └── EmailSummaryButton.tsx        # Botón enviar resumen
│   │
│   ├── features/                         # Lógica de dominio
│   │   └── AuthContext.tsx               # Contexto + Hook useAuth
│   │
│   ├── hooks/                            # Custom Hooks
│   │   └── useTasks.ts                   # Hook para CRUD + Real-time
│   │
│   ├── pages/                            # Componentes de página
│   │   ├── Login.tsx                     # Página de login
│   │   ├── Register.tsx                  # Página de registro
│   │   └── Tasks.tsx                     # Página principal
│   │
│   ├── routes/                           # Configuración de rutas
│   │   └── ProtectedRoute.tsx            # Wrapper para rutas privadas
│   │
│   ├── services/                         # Integraciones externas
│   │   ├── firebase.ts                   # Inicialización Firebase
│   │   └── emailService.ts               # Servicio de emails
│   │
│   ├── styles/                           # Archivos CSS modular
│   │   ├── auth.css                      # Login/Register
│   │   ├── tasks.css                     # Página tasks
│   │   └── components.css                # Componentes
│   │
│   ├── types/                            # TypeScript interfaces
│   │   ├── auth.ts                       # Tipos autenticación
│   │   └── task.ts                       # Tipos de tareas
│   │
│   └── __tests__/                        # Tests unitarios
│       ├── emailService.test.ts
│       └── protectedRoute.test.ts
│
├── api/                                  # Funciones serverless
│   └── sendEmail.ts                      # AWS SES Vercel Function
│
├── public/                               # Assets estáticos
│
├── Configuración
│   ├── package.json                      # Dependencias + scripts
│   ├── tsconfig.json                     # Configuración TypeScript
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts                    # Vite + Vitest config
│   ├── eslint.config.js                  # Linter config
│   ├── index.html                        # HTML template
│   └── vercel.json                       # Deploy Vercel config
│
├── Documentación
│   ├── README.md                         # Documentación técnica
│   ├── QUICKSTART.md                     # Guía de inicio rápido
│   ├── RESUMEN_EJECUTIVO.md              # Resumen proyecto
│   └── CLAUDE.md                         # Uso de IA
│
├── Seguridad
│   ├── .env                              # Variables (NO subir)
│   ├── .env.example                      # Plantilla variables
│   └── .gitignore                        # Excluir .env
│
└── Control de versiones
    └── .git/                             # Repository
```

---

## Flujo de Datos

### 1. Autenticación

```
Usuario escribe email/password
            ↓
        (Login.tsx)
            ↓
    useAuth().login(email, pass)
            ↓
    (AuthContext.tsx)
            ↓
signInWithEmailAndPassword (Firebase Auth)
            ↓
Auth State Change
            ↓
Redirect a /tasks
```

### 2. Crear Tarea

```
Usuario escribe tarea
            ↓
        (TaskForm.tsx)
            ↓
    useTasks().createTask()
            ↓
        (useTasks.ts)
            ↓
      addDoc(Firestore)
            ↓
onSnapshot dispara
            ↓
    tasks state actualiza
            ↓
        UI re-render
```

### 3. Enviar Email

```
Usuario click "Enviar Resumen"
            ↓
(EmailSummaryButton.tsx)
            ↓
sendTaskSummaryEmail()
            ↓
    POST /api/sendEmail
            ↓
(Vercel Function: sendEmail.ts)
            ↓
    AWS SES Client
            ↓
        SendEmailCommand
            ↓
        Email User
```

---

## Stack Tecnológico

```
FRONTEND
├── React 19.2.5              # UI Library
├── TypeScript 6.0            # Type Safety
├── Vite 8.0                  # Build Tool
├── React Router 7.14         # Routing
├── Firebase SDK 12.12        # Auth + Firestore
├── CSS Modules              # Styling
└── Vitest 4.1               # Testing

BACKEND
├── Vercel Functions          # Serverless
├── AWS SDK (SES)             # Email Service
└── Node.js 18+              # Runtime

DATABASES
├── Firebase Auth             # User authentication
└── Cloud Firestore          # NoSQL Database

DEPLOYMENT
├── Vercel                    # Hosting + Functions
├── GitHub                    # Version Control
└── AWS SES                   # Email Service
```

---

## Flujo de Desarrollo

```
1. Usuario registra                2. Autenticación
   email/password                    persistente
        ↓                                ↓
   Firebase Auth       ←────────→   onAuthStateChanged
        ↓
3. Ingresa a /tasks               4. TaskForm crea tarea
        ↓                               ↓
   ProtectedRoute verifica    Task guardada Firestore
        ↓                               ↓
   Muestra Tasks               onSnapshot actualiza UI
        ↓
5. Edita/Elimina/Completa      6. Click "Enviar Email"
        ↓                          ↓
   updateDoc/deleteDoc        sendTaskSummaryEmail()
        ↓                          ↓
   Firestore actualiza      POST /api/sendEmail
        ↓                          ↓
   onSnapshot actualiza UI   AWS SES envía email
        ↓
   Usuario recibe email
```

---

## Estados de la Aplicación

### Global (AuthContext)
```typescript
{
  user: User | null          // Usuario autenticado
  loading: boolean           // Verificando auth
  login: (email, pass) => Promise<void>
  register: (email, pass) => Promise<void>
  logout: () => Promise<void>
}
```

### Tareas (useTasks)
```typescript
{
  tasks: Task[]              // Lista sincronizada
  loading: boolean           // Cargando inicial
  error: string | null       // Errores
  createTask: (input) => Promise<string>
  updateTask: (id, updates) => Promise<void>
  deleteTask: (id) => Promise<void>
}
```

### Componentes
```typescript
// Login/Register
{ email, password, error, loading }

// Tasks
{ filter: 'all' | 'completed' | 'pending' }

// TaskItem
{ isEditing, title, description, priority, loading }
```

---

## Ciclo de Vida

### App.tsx
```
App (BrowserRouter)
  ↓
AuthProvider (onAuthStateChanged)
  ↓
Routes (/ → /tasks, /login, /register)
  ↓
ProtectedRoute (verifica user)
  ↓
Pages (Login, Register, Tasks)
```

### Tasks.tsx
```
Tasks monta
  ↓
useTasks() suscribe a Firestore
  ↓
onSnapshot actualiza tasks
  ↓
UI re-render con tasks nuevas
  ↓
Usuario interactúa
  ↓
createTask/updateTask/deleteTask
  ↓
Firestore actualiza
  ↓
onSnapshot dispara
  ↓
UI sincroniza (Real-time)
  ↓
Tasks desmonta
  ↓
Unsubscribe (cleanup)
```

---

## Puntos Clave

✅ **Context API** para estado global
✅ **Hooks personalizados** para lógica reutilizable
✅ **Firestore onSnapshot** para sincronización real-time
✅ **Serverless Functions** para seguridad backend
✅ **TypeScript strict** para type-safety
✅ **CSS Modular** para estilos organizados
✅ **Responsive Design** mobile-first
✅ **Error Handling** en todos los niveles
✅ **Cleanup en useEffect** para evitar memory leaks
✅ **Validación en cliente y servidor**

---

## Próximas Mejoras (Escalabilidad)

```
└── Fase 1 (Actual)
    ├── ✅ Autenticación
    ├── ✅ CRUD básico
    ├── ✅ Emails
    └── ✅ Deploy

└── Fase 2 (Mejoras)
    ├── Drag & Drop
    ├── Categorías/Etiquetas
    ├── Búsqueda/Filtros avanzados
    ├── Dark mode
    └── Notificaciones push

└── Fase 3 (Escalado)
    ├── Compartir tareas
    ├── Equipos/Proyectos
    ├── Análisis/Reportes
    ├── Integraciones (Slack, etc)
    └── Mobile App (React Native)
```

---

**Diagrama completado**
**Arquitectura lista para producción**
