# 🗺️ Memoria Colectiva

Una aplicación web progresiva para descubrir y compartir historias geolocalizadas de tu comunidad. Construida con Next.js 14 y diseñada para crear conexiones locales a través de experiencias compartidas.

![Memoria Colectiva Screenshot](public/screenshot.png)

## 🌟 Características

### ✅ **MVP Actual**
- 📍 **Geolocalización automática** - Detecta tu ubicación para mostrar memorias cercanas
- 🗂️ **Categorías inteligentes** - Recomendaciones, advertencias, historia y curiosidades
- 📝 **Crear memorias** - Comparte experiencias con texto e imágenes
- 🏷️ **Sistema de filtros** - Filtra memorias por categoría
- 📱 **Diseño responsive** - Optimizado para móvil y desktop
- ⚡ **Carga rápida** - Optimizaciones de performance integradas
- 🎨 **UI moderna** - Interfaz limpia con Tailwind CSS

### 🚧 **En Desarrollo**
- 🗺️ **Mapa interactivo** - Vista de mapa con pins de memorias
- 👤 **Perfiles de usuario** - Sistema de cuentas y personalización
- 💬 **Sistema de comentarios** - Interacción entre usuarios
- ❤️ **Likes y reacciones** - Sistema de valoración
- 🔔 **Notificaciones push** - Alertas de memorias cercanas
- 📊 **Analytics básicos** - Estadísticas de uso

## 🚀 Instalación Rápida

### Prerequisitos
- Node.js 18+ 
- npm o yarn

### 1. Clonar e instalar
```bash
git clone https://github.com/tu-usuario/memoria-colectiva.git
cd memoria-colectiva
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Edita `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
memoria-colectiva/
├── 📱 app/                    # App Router (Next.js 14)
│   ├── layout.js             # Layout global
│   ├── page.js               # Homepage
│   ├── globals.css           # Estilos globales
│   ├── memories/[id]/        # Páginas de detalle
│   ├── map/                  # Vista de mapa
│   └── api/                  # API Routes
│       ├── memories/         # CRUD de memorias
│       ├── upload/           # Subida de archivos
│       └── comments/         # Sistema de comentarios
├── 🧩 components/            # Componentes reutilizables
│   ├── Header.js            # Navegación principal
│   ├── MemoryCard.js        # Card de memoria
│   ├── CreateMemoryModal.js # Modal crear memoria
│   └── Map.js               # Componente de mapa
├── 📚 lib/                   # Utilidades y helpers
│   ├── utils.js             # Funciones utilitarias
│   ├── constants.js         # Constantes globales
│   └── geolocation.js       # Helpers de geolocalización
├── 🎨 public/                # Archivos estáticos
│   ├── icons/               # Iconos PWA
│   ├── manifest.json        # Configuración PWA
│   └── uploads/             # Archivos subidos
└── 📝 prisma/                # Base de datos (futuro)
    └── schema.prisma        # Esquema de BD
```

## 🛠️ Stack Tecnológico

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Fechas**: date-fns
- **Tipografía**: Inter (Google Fonts)

### **Backend**
- **API**: Next.js API Routes
- **Base de datos**: PostgreSQL + Prisma (próximamente)
- **Autenticación**: NextAuth.js (próximamente)
- **Archivos**: Local storage / Cloudinary (próximamente)

### **Herramientas**
- **Desarrollo**: ESLint, Prettier
- **Deployment**: Vercel
- **Mapas**: Mapbox GL JS (próximamente)
- **PWA**: next-pwa

## 🌐 API Endpoints

### Memorias
```
GET    /api/memories              # Obtener todas las memorias
POST   /api/memories              # Crear nueva memoria
GET    /api/memories/nearby       # Memorias cercanas
GET    /api/memories/[id]         # Obtener memoria específica
PUT    /api/memories/[id]         # Actualizar memoria
DELETE /api/memories/[id]         # Eliminar memoria
```

### Interacciones
```
POST   /api/memories/[id]/like    # Dar/quitar like
GET    /api/memories/[id]/comments # Obtener comentarios
POST   /api/memories/[id]/comments # Crear comentario
```

### Archivos
```
POST   /api/upload               # Subir imágenes
GET    /api/upload?file=name     # Info de archivo
DELETE /api/upload?file=name     # Eliminar archivo
```

## 🎨 Guía de Diseño

### **Colores Principales**
- **Primario**: Purple-500 (#8b5cf6)
- **Secundario**: Blue-500 (#3b82f6)
- **Fondo**: Gradiente purple-50 a blue-50

### **Categorías**
- 🌟 **Recomendaciones**: Amarillo
- ⚠️ **Advertencias**: Rojo
- 📚 **Historia**: Azul
- 🔍 **Curiosidades**: Púrpura

### **Componentes**
- **Cards**: Rounded-xl con sombra sutil
- **Botones**: Gradientes con hover effects
- **Modales**: Backdrop con blur
- **Animaciones**: fadeIn, slideUp, transitions

## 📱 PWA (Progressive Web App)

La aplicación incluye funcionalidades PWA:

- ✅ **Instalable** - Se puede instalar como app nativa
- ✅ **Offline ready** - Funciona sin conexión (básico)
- ✅ **Responsive** - Adaptable a cualquier pantalla
- ✅ **Fast loading** - Optimizada para performance
- 🚧 **Push notifications** - Próximamente
- 🚧 **Background sync** - Próximamente

## 🔐 Configuración de Seguridad

### Variables de Entorno
```env
# Desarrollo
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Producción
NEXT_PUBLIC_APP_URL=https://memoria-colectiva.vercel.app
NEXT_PUBLIC_MAPBOX_TOKEN=pk.ey...

# Base de datos (próximamente)
DATABASE_URL=postgresql://...

# Servicios externos (próximamente)
CLOUDINARY_CLOUD_NAME=...
NEXTAUTH_SECRET=...
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📈 Roadmap

### **v1.0 (MVP Actual)**
- [x] Crear y mostrar memorias
- [x] Geolocalización básica
- [x] Filtros por categoría
- [x] UI responsive
- [x] API REST básica

### **v1.1 (Próxima)**
- [ ] Mapa interactivo con Mapbox
- [ ] Sistema de comentarios
- [ ] Likes y reacciones
- [ ] Perfiles básicos de usuario
- [ ] Subida de imágenes mejorada

### **v1.2 (Futuro)**
- [ ] Autenticación completa
- [ ] Notificaciones push
- [ ] Modo offline avanzado
- [ ] Analytics y métricas
- [ ] Sistema de moderación

### **v2.0 (Largo plazo)**
- [ ] Chat en tiempo real
- [ ] Eventos y meetups
- [ ] Integración con redes sociales