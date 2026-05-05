# ✅ Checklist de Verificación - Proyecto Completo

## Antes de empezar

- [ ] Has clonado el repositorio
- [ ] Has ejecutado `npm install`
- [ ] Tienes Node.js 18+ instalado

## Configuración de Variables de Entorno

### Firebase
- [ ] Obtuviste credenciales de [Firebase Console](https://console.firebase.google.com)
- [ ] Copiaste `.env.example` a `.env`
- [ ] Completaste `VITE_FIREBASE_API_KEY`
- [ ] Completaste `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] Completaste `VITE_FIREBASE_PROJECT_ID`
- [ ] Completaste `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] Completaste `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Completaste `VITE_FIREBASE_APP_ID`

### AWS SES
- [ ] Obtuviste credenciales de [AWS IAM Console](https://console.aws.amazon.com/iam/)
- [ ] Completaste `AWS_ACCESS_KEY_ID`
- [ ] Completaste `AWS_SECRET_ACCESS_KEY`
- [ ] Configuraste `AWS_SES_REGION` (ej: us-east-1)
- [ ] Completaste `AWS_SES_FROM_EMAIL` con email verificado en SES

## Verificación de Firebase

### Authentication
- [ ] Firebase Authentication está habilitado
- [ ] Email/Password está como método de login
- [ ] Creas 1-2 usuarios de prueba

### Firestore
- [ ] Base de datos Firestore está creada
- [ ] Colección `tasks` existe
- [ ] Copias y activas estas reglas de seguridad:
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

## Verificación de AWS SES

- [ ] AWS SES está habilitado en región `us-east-1`
- [ ] Tu email está verificado en SES
- [ ] Tienes credenciales IAM con permisos SES:SendEmail

## Desarrollo Local

### Iniciar aplicación
- [ ] Ejecutas `npm run dev`
- [ ] Ves mensaje "Local: http://localhost:5173"
- [ ] Abres URL en navegador

### Funcionalidad de Registro
- [ ] Puedes navegar a `/register`
- [ ] Rellenas email y contraseña (6+ caracteres)
- [ ] Haces click "Registrarse"
- [ ] Redirige a `/tasks`

### Funcionalidad de Login
- [ ] Navegas a `/login`
- [ ] Ingresas email registrado
- [ ] Ingresas contraseña correcta
- [ ] Redirige a `/tasks`
- [ ] Recarga página → Sesión persiste

### Funcionalidad de Tareas
- [ ] Rellenas título de tarea
- [ ] Rellenas descripción (opcional)
- [ ] Seleccionas prioridad
- [ ] Haces click "Crear Tarea"
- [ ] Tarea aparece en lista
- [ ] Puedes marcar como completada (checkbox)
- [ ] Puedes editar (click "Editar")
- [ ] Puedes eliminar (click "Eliminar")
- [ ] Confirmas eliminación

### Filtros de Tareas
- [ ] Botón "Todas" muestra todas las tareas
- [ ] Botón "Pendientes" muestra solo incompletas
- [ ] Botón "Completadas" muestra solo completadas
- [ ] Los contadores se actualizan correctamente

### Funcionalidad de Email
- [ ] Ves botón "📧 Enviar Resumen por Email"
- [ ] Haces click en botón
- [ ] Ves mensaje "Enviando..."
- [ ] Ves mensaje de éxito o error
- [ ] Verificas que recibiste email (revisa Spam si no)

### Logout
- [ ] Haces click "Cerrar Sesión"
- [ ] Redirige a `/login`
- [ ] No puedes acceder a `/tasks` sin login

## Testing

- [ ] Ejecutas `npm run test`
- [ ] Tests pasan sin errores
- [ ] Ves output con tests completados
- [ ] Coverage es razonable

## Build para Producción

- [ ] Ejecutas `npm run build`
- [ ] No hay errores en compilación
- [ ] Se crea carpeta `dist/`
- [ ] Ejecutas `npm run preview`
- [ ] Ves aplicación funcionando

## Verificación de Seguridad

### Código
- [ ] No hay credenciales en archivos `.ts` o `.tsx`
- [ ] `.env` está en `.gitignore`
- [ ] No hay `console.log()` con datos sensibles
- [ ] AWS SES solo se llama desde `/api/sendEmail.ts`

### Git
- [ ] `git status` NO muestra `.env`
- [ ] Commits son semánticos y descriptivos
- [ ] Branch está limpio sin cambios pendientes

## Deploy en Vercel (Opcional)

### Antes de Deploy
- [ ] Hiciste commit de todos los cambios
- [ ] Subiste cambios a GitHub (`git push`)
- [ ] Repository está público en GitHub

### Setup en Vercel
- [ ] Abriste [Vercel Dashboard](https://vercel.com)
- [ ] Importaste tu repositorio
- [ ] Seleccionaste framework "Vite"
- [ ] Configuraste variables de entorno:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] (todas las demás variables)
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `AWS_SES_REGION`
  - [ ] `AWS_SES_FROM_EMAIL`
- [ ] Hiciste Deploy

### Verificación de Deploy
- [ ] Tienes URL pública de Vercel
- [ ] Accedes a URL sin errores
- [ ] Puedes registrarte
- [ ] Puedes login
- [ ] Puedes crear tareas
- [ ] Puedes enviar emails
- [ ] Puedes logout

## Documentación

- [ ] Leíste [README.md](./README.md)
- [ ] Leíste [QUICKSTART.md](./QUICKSTART.md)
- [ ] Leíste [ARQUITECTURA.md](./ARQUITECTURA.md)
- [ ] Leíste [RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md)
- [ ] Leíste [CLAUDE.md](./CLAUDE.md)

## Troubleshooting Rápido

### Problema: Variables de entorno no cargadas
- [ ] Copiaste `.env.example` → `.env`
- [ ] Reiniciaste servidor (`npm run dev`)
- [ ] Verificas que `.env` esté en raíz del proyecto

### Problema: Firebase rechaza login
- [ ] Verificas que usuario exista en Firebase Console
- [ ] Verificas que contraseña sea correcta
- [ ] Verificas que `VITE_FIREBASE_*` variables sean correctas

### Problema: Emails no se envían
- [ ] Verificas que email esté en Sandbox de SES
- [ ] Verificas que email verificado en SES
- [ ] Verificas que credenciales AWS sean correctas
- [ ] Revisa email en carpeta Spam

### Problema: Tareas no se sincronizan
- [ ] Verificas que Firestore rules estén activas
- [ ] Verificas que userId coincida
- [ ] Abre Firebase Console → Firestore
- [ ] Verifica que `tasks` colección tenga documentos

## Checklist Final

- [ ] Código completo ✅
- [ ] Variables configuradas ✅
- [ ] Tests pasan ✅
- [ ] Desarrollo local funciona ✅
- [ ] Build sin errores ✅
- [ ] Deploy en Vercel funciona ✅
- [ ] Documentación leída ✅
- [ ] Seguridad verificada ✅

---

## 🎉 Estado: LISTO PARA USAR

Una vez hayas marcado todos estos checks, tu aplicación está:
- ✅ Funcionando localmente
- ✅ Desplegada en producción
- ✅ Segura y documentada
- ✅ Lista para presentar

**¡Felicidades por completar el Proyecto Integrador 4!**

---

**Contacto para dudas:**
- Documentación: README.md
- Soporte rápido: QUICKSTART.md
- Arquitectura: ARQUITECTURA.md
