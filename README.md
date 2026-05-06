# Task Manager - Aplicación de Gestión de Tareas

Una Single Page Application (SPA) moderna para la gestión de tareas con autenticación segura, persistencia en la nube y notificaciones por email.

## 🎯 Características

- ✅ **Autenticación segura** con Firebase Authentication
- ✅ **CRUD completo** de tareas con sincronización en tiempo real
- ✅ **Persistencia en Firestore** con filtrado por usuario
- ✅ **Envío de emails** con resumen de tareas mediante AWS SES
- ✅ **Rutas protegidas** para contenido privado
- ✅ **Interfaz responsive** con diseño mobile-first
- ✅ **TypeScript** para tipado seguro
- ✅ **Tests unitarios** con Vitest
- ✅ **Deploy en Vercel** con serverless functions

## 🏗️ Arquitectura

### Estructura de carpetas

```
task-manager/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── features/            # Lógica por dominio (AuthContext)
│   ├── hooks/               # Custom hooks (useTasks)
│   ├── pages/               # Vistas principales (Login, Register, Tasks)
│   ├── routes/              # Configuración de rutas (ProtectedRoute)
│   ├── services/            # Integraciones externas (firebase, emailService)
│   ├── styles/              # Estilos CSS organizados
│   ├── types/               # Interfaces TypeScript
│   ├── __tests__/           # Tests unitarios
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── api/
│   └── sendEmail.ts         # Función serverless para emails
├── .env                     # NO subir a git
├── .env.example             # Plantilla
├── package.json
└── README.md
```

## 🚀 Instalación rápida

### 1. Clonar y instalar

```bash
git clone <tu-repo>
cd task-manager
npm install
```

### 2. Configurar .env

```bash
cp .env.example .env
```

Completa con tus credenciales:

```env
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value

AWS_ACCESS_KEY_ID=your_value
AWS_SECRET_ACCESS_KEY=your_value
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@tu-dominio.com
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

### 4. Configurar Firestore

Copia estas reglas en Firestore Security Rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 📡 Flujo de emails

1. Usuario hace click en "Enviar Resumen"
2. Frontend calcula estadísticas de tareas
3. POST a `/api/sendEmail`
4. Serverless function llama AWS SES
5. Email formateado llega a usuario

## 🌐 Deploy en Vercel

1. Push a GitHub
2. Conecta en [Vercel Dashboard](https://vercel.com)
3. Añade variables en Settings → Environment Variables
4. Deploy automático ✨

## 🧪 Testing

```bash
npm run test
```

## 🤖 Decisiones de arquitectura

- **Context API**: Gestión de autenticación sin Redux
- **Custom Hooks**: `useTasks` encapsula Firestore
- **Serverless**: AWS SES solo en backend (seguridad)
- **TypeScript**: Tipado completo del proyecto

## 🔐 Seguridad

- ✅ Credenciales en variables de entorno
- ✅ `.env` en `.gitignore`
- ✅ Reglas Firestore protegen datos
- ✅ AWS SES solo en servidor
- ✅ Validación de inputs

## 📝 Scripts

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run test         # Tests
npm run lint         # Linter
```

## ⚠️ Troubleshooting

| Problema | Solución |
|----------|----------|
| Login rechazado | Usuario no existe en Firebase |
| Emails no se envían | Verifica email en AWS SES |
| Tareas no se sincronizan | Chequea reglas Firestore |
| Variables no se cargan | Reinicia con `npm run dev` |

## 📚 Recursos

- [Firebase Docs](https://firebase.google.com/docs)
- [AWS SES Docs](https://docs.aws.amazon.com/ses/)
- [React Router](https://reactrouter.com)
- [TypeScript](https://www.typescriptlang.org)

## Enlaces importantes

- Repositorio: https://github.com/HDMacias/ProyectoM4-HernanMacias.git
- Despliegue: https://task-manager-hdmacias.vercel.app

## 📄 Licencia

Proyecto Integrador 4 - Soy Henry

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },



