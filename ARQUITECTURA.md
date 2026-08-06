# GLOBAPP — Plan Arquitectónico Maestro

**Documento de Referencia: Transformación de Prototipo Avanzado a Plataforma SaaS Profesional**

**Versión:** 1.0  
**Fecha:** Agosto 2026  
**Estado:** Fase 1 — Análisis y Planificación

---

## 📋 Tabla de Contenidos

1. [Visión del Producto](#visión-del-producto)
2. [Análisis de Estado Actual](#análisis-de-estado-actual)
3. [Arquitectura Objetivo](#arquitectura-objetivo)
4. [Plan de Migración](#plan-de-migración)
5. [Especificaciones Técnicas](#especificaciones-técnicas)
6. [Roadmap Detallado](#roadmap-detallado)

---

## 🎯 Visión del Producto

### Identidad

**GLOBAPP** = Centro Mundial de Inteligencia Territorial Multiagente

### Propuesta de Valor

Plataforma SaaS profesional que integra 19 agentes especializados de inteligencia artificial para:

- **Análisis territorial** en tiempo real
- **Consultas científicas** avanzadas
- **Visualización GIS** profesional
- **Generación de reportes** multiformato
- **Monitoreo de riesgos** (sísmico, climático, incendios)
- **Simulaciones** predictivas
- **Trabajo colaborativo** en proyectos

### Usuarios Objetivo

**Usuario Final (Público):**
- Ingenieros civiles
- Científicos ambientales
- Planificadores urbanos
- Autoridades de protección civil
- Investigadores académicos
- Consultores de riesgos

**Administrador:**
- Operadores de sistema
- DevOps
- Monitores de actividad
- Técnicos de soporte

---

## 🔍 Análisis de Estado Actual

### Código Existente Funcional

| Componente | Archivo | Estado | Conservar |
|-----------|---------|--------|----------|
| Dashboard Principal | `index.html` (42 KB) | ✅ Funcional | ✅ Sí |
| Mapa Leaflet | `index.html` | ✅ Funcional | ✅ Sí |
| Gráficos Chart.js | `index.html` | ✅ Funcional | ✅ Sí |
| Datos USGS | `index.html` | ✅ Funcional | ✅ Sí |
| Datos Open-Meteo | `index.html` | ✅ Funcional | ✅ Sí |
| Datos NASA FIRMS | `index.html` | ✅ Funcional | ✅ Sí |
| Tema visual | `index.html` | ✅ Excelente | ✅ Sí |
| Consola Agentes | `agents/index.html` | ✅ Funcional | ✅ Integrar |
| Conexión n8n | `agents/app.js` | ✅ Funcional | ✅ Abstraer |

### Problemas Arquitectónicos

| Problema | Severidad | Solución |
|----------|-----------|----------|
| Monolito HTML (1000+ líneas) | 🔴 Crítica | Modularizar en componentes |
| CSS incrustado en HTML | 🔴 Crítica | Extraer a `assets/css/` |
| JS incrustado en HTML | 🔴 Crítica | Extraer a `js/components/` |
| Dos aplicaciones separadas | 🔴 Crítica | Integrar en navegación única |
| Sin navegación dinámica | 🔴 Crítica | Crear `js/router.js` |
| N8N visible al usuario | 🟡 Media | Crear `services/api.js` opaca |
| Sin gestión de estado | 🟡 Media | Crear `js/store.js` |
| Sin separación roles | 🟡 Media | Crear `/admin` privado |
| Código duplicado | 🟡 Media | Normalizar estilos |

### Fortalezas a Preservar

✅ **Identidad Visual Coherente**
- Tema oscuro profesional
- Colores: Cyan (#00d4ff), Orange (#ff6b35), Green (#00e676)
- Tipografía: Inter 400-800
- Espaciado consistente

✅ **Integración de Datos Reales**
- USGS Earthquake API
- Open-Meteo Weather API
- NASA FIRMS Fire data
- OpenStreetMap

✅ **Componentes Funcionales**
- Leaflet + capas
- Chart.js gráficos
- Validación y manejo de errores
- Accesibilidad básica

✅ **Conceptualización de 19 Agentes**
- Estructura clara
- Responsabilidades definidas
- Integración n8n establecida

---

## 🏗️ Arquitectura Objetivo

### Filosofía Arquitectónica

**Arquitectura SaaS modular con navegación dinámica tipo SPA, manteniendo compatibilidad con HTML/CSS/JavaScript actual.**

Este enfoque permite:
- ✅ Evolución gradual sin rupturas
- ✅ Reutilización de código probado
- ✅ Migración futura a frameworks (React, Vue) sin reingeniería
- ✅ Independencia de herramientas de build
- ✅ Control total sobre el stack

### Estructura de Directorios

```
globalapp/
│
├── index.html                 # HTML mínimo, punto de entrada dinámico
│
├── assets/                    # Recursos estáticos
│   ├── css/                   # Estilos modularizados
│   │   ├── base.css           # Variables, reset, tipografía
│   │   ├── theme.css          # Tema oscuro/claro
│   │   ├── layout.css         # Header, sidebar, footer
│   │   ├── components.css     # Botones, cards, inputs
│   │   ├── pages.css          # Estilos por página
│   │   └── responsive.css     # Media queries
│   │
│   └── icons/                 # SVG e iconos
│       ├── agents.svg
│       ├── analysis.svg
│       └── ... (iconos personalizados)
│
├── js/                        # JavaScript modular
│   │
│   ├── app.js                 # Inicialización principal
│   ├── router.js              # Sistema de navegación dinámica
│   ├── store.js               # Gestión de estado global
│   ├── config.js              # Configuración (N8N abstraído)
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   ├── Footer.js
│   │   ├── MetricCard.js
│   │   ├── MapViewer.js
│   │   ├── ChartBox.js
│   │   ├── AlertPanel.js
│   │   └── QueryConsole.js
│   │
│   ├── pages/                 # Páginas SaaS
│   │   ├── Dashboard.js       # Panel principal
│   │   ├── GeoSpatial.js      # Centro Geoespacial
│   │   ├── Seismic.js         # Ingeniería Sísmica
│   │   ├── Meteorology.js     # Meteorología
│   │   ├── Fires.js           # Incendios
│   │   ├── Environment.js     # Medio Ambiente
│   │   ├── Prediction.js      # Predicción
│   │   ├── MultiHazard.js     # Multi Amenaza
│   │   ├── DataAnalysis.js    # Análisis de Datos
│   │   ├── Reports.js         # Reportes
│   │   ├── Laboratory.js      # Laboratorio de Simulación
│   │   ├── Library.js         # Biblioteca Científica
│   │   ├── Projects.js        # Mis Proyectos
│   │   │
│   │   └── Admin/             # Sección privada /admin
│   │       ├── Dashboard.js
│   │       ├── AgentStatus.js
│   │       ├── WorkflowLogs.js
│   │       ├── Performance.js
│   │       └── SystemHealth.js
│   │
│   ├── services/              # Servicios y APIs
│   │   ├── api.js             # Abstracción N8N (SIN WEBHOOKS VISIBLES)
│   │   ├── auth.js            # Gestión de roles (desarrollo)
│   │   ├── agents.js          # Gestión de 19 agentes
│   │   ├── mapService.js      # Leaflet + capas
│   │   ├── dataFetch.js       # USGS, NASA, Open-Meteo
│   │   ├── chartService.js    # Chart.js helpers
│   │   ├── queryEngine.js     # Procesamiento de consultas
│   │   ├── reportService.js   # PDF, Excel, CSV, GeoJSON, KML
│   │   └── storage.js         # localStorage/sessionStorage
│   │
│   └── utils/                 # Utilidades
│       ├── helpers.js         # Funciones comunes
│       ├── validators.js      # Validación de entrada
│       ├── formatters.js      # Formatos de salida
│       ├── constants.js       # Constantes globales
│       └── logger.js          # Logging
│
├── config/                    # Archivos de configuración
│   ├── agents.json            # Definición de 19 agentes
│   ├── api-endpoints.json     # Endpoints (N8N abstraído)
│   └── ui-config.json         # Configuración visual
│
├── docs/                      # Documentación
│   ├── ARQUITECTURA.md        # Este archivo
│   ├── API.md                 # Especificación de servicios
│   ├── COMPONENTES.md         # Catálogo de componentes
│   ├── USUARIOS.md            # Guía de usuarios
│   └── ADMIN.md               # Manual administrador
│
├── old-backup/                # Código actual preservado
│   ├── index.html.v0.2
│   ├── agents/
│   └── README-ORIGINAL.md
│
├── .gitignore
├── package.json               # Metadatos (si usa build tools)
└── README.md                  # Documentación principal
```

### Separación de Experiencias

#### 🎯 MODO USUARIO

**Acceso Público**

El usuario **JAMÁS VE:**
- n8n
- Workflows
- Webhooks
- Puertos (5681)
- Logs técnicos
- Arquitectura interna
- Variables de entorno
- Configuración del sistema

**El usuario VE:**

```
╔════════════════════════════════════════════════════╗
║                                                    ║
║  GLOBAPP — Centro de Inteligencia Territorial     ║
║                                                    ║
║  🏠 Dashboard                                     ║
║  🌎 Centro Geoespacial                            ║
║  🌋 Ingeniería Sísmica                            ║
║  🌦 Meteorología                                  ║
║  🔥 Incendios                                     ║
║  🌱 Medio Ambiente                                ║
║  ⚠ Multi Amenaza                                  ║
║  🔮 Predicción                                    ║
║  📊 Análisis de Datos                             ║
║  📄 Informes                                      ║
║  🧪 Laboratorio                                   ║
║  📚 Biblioteca                                    ║
║  📂 Mis Proyectos                                 ║
║                                                    ║
║  [Mapa Interactivo]         [Consulta Científica] ║
║  [Gráficos]                 [Resultados]          ║
║  [Alertas]                  [Exportar Informe]    ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

---

#### 👨‍💼 MODO ADMINISTRADOR

**Acceso Restringido: `/admin`**

Solo administrador ve:

```
╔════════════════════════════════════════════════════╗
║                                                    ║
║  GLOBAPP — Panel de Administración                ║
║                                                    ║
║  📊 Estado del Sistema                            ║
║  ├─ 19 Agentes IA                                 ║
║  │  ├─ Orquestador: ✅ Online                    ║
║  │  ├─ Sísmico: ✅ Online                        ║
║  │  └─ ...                                        ║
║  ├─ Workflows n8n: 47 activos                     ║
║  ├─ CPU: 35% | RAM: 62% | Disk: 44%              ║
║  └─ Uptime: 99.94%                                ║
║                                                    ║
║  📋 Actividad                                      ║
║  ├─ Últimas consultas: 342 hoy                    ║
║  ├─ Errores: 3 últimas 24h                        ║
║  └─ Usuarios activos: 12                          ║
║                                                    ║
║  🔍 Logs y Monitoreo                              ║
║  ├─ Ver logs en tiempo real                       ║
║  ├─ Filtrar por agente                            ║
║  ├─ Ver errores                                   ║
║  └─ Descargar reportes técnicos                   ║
║                                                    ║
║  ⚙ Configuración                                  ║
║  ├─ Credenciales API                              ║
║  ├─ Usuarios                                      ║
║  └─ Parámetros del sistema                        ║
║                                                    ║
║  ⚠️  N8N permanece abstraído                      ║
║      (accesible solo via capa API segura)         ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

**Importante:** El administrador accede a datos de monitoreo a través de la capa API segura. n8n permanece completamente abstraído incluso en la interfaz administrativa. No hay exposición de webhooks, workflows internos ni configuración técnica de n8n.

---

## 🔄 Plan de Migración

### Estrategia: Evolución Sin Ruptura

**Principio:** El código antiguo y nuevo coexisten durante toda la migración.

### Fase 1: Preparación (SIN CAMBIOS EN PRODUCCIÓN)

**Objetivo:** Crear arquitectura modular en paralelo sin tocar código actual.

**Duración:** 3-4 commits

**Tareas:**

1. ✅ Crear rama `develop-saas`
2. ✅ Crear estructura de directorios
3. ✅ Modularizar CSS actual → `assets/css/`
4. ✅ Crear `config.js` con endpoints (N8N abstraído)
5. ✅ Crear `store.js` con estado global
6. ✅ Crear `router.js` con navegación dinámica
7. ✅ Crear `js/app.js` como punto de entrada
8. ✅ Crear `index.html` mínimo (punto entrada)
9. ✅ Documentar en `ARQUITECTURA.md`

**Resultado:**
- ✅ Estructura lista
- ✅ Aplicación actual sigue funcionando (`old-backup/`)
- ✅ Cero cambios visuales
- ✅ Código antiguo preservado y documentado

---

### Fase 2: Dashboard + Navegación (PRIMERA PÁGINA MIGRADA)

**Objetivo:** Primera página SaaS totalmente funcional.

**Duración:** 2-3 commits

**Tareas:**

1. ✅ Crear `js/components/Header.js`
2. ✅ Crear `js/components/Sidebar.js`
3. ✅ Crear `js/components/Footer.js`
4. ✅ Refactorizar `js/pages/Dashboard.js` desde `index.html`
5. ✅ Integrar con router dinámica
6. ✅ Conectar navegación con menú principal
7. ✅ Probar en navegador

**Resultado:**
- ✅ Dashboard funcional con navegación
- ✅ Menú lateral con 14 opciones
- ✅ Routing interno sin recargas
- ✅ Estilo preservado

---

### Fase 3: Centro de Solicitudes (INTERACCIÓN PRINCIPAL)

**Objetivo:** Consola científica integrada.

**Duración:** 2-3 commits

**Tareas:**

1. ✅ Crear `js/pages/QueryConsole.js`
2. ✅ Diseñar UI: campo + ubicación + tipo análisis + profundidad
3. ✅ Integrar con `services/queryEngine.js`
4. ✅ Conectar con `services/api.js`
5. ✅ Mostrar resultados en panel
6. ✅ Implementar estados: Loading, Success, Error, Empty

**Resultado:**
- ✅ Consola funcional
- ✅ Integrada en navegación
- ✅ Conectada con backend

---

### Fase 4: Mapa Inteligente (GIS AVANZADO)

**Objetivo:** Visor profesional con capas.

**Duración:** 2-3 commits

**Tareas:**

1. ✅ Crear `js/components/MapViewer.js`
2. ✅ Refactorizar Leaflet de `index.html`
3. ✅ Implementar capas: satélite, calles, relieve, científicas
4. ✅ Integrar con `services/mapService.js`
5. ✅ Crear marcadores inteligentes
6. ✅ Agregar controles de capas

**Resultado:**
- ✅ Mapa reutilizable
- ✅ Capas funcionales
- ✅ Integrado en todas las páginas

---

### Fase 5: Páginas Especializadas (MÓDULOS CIENTÍFICOS)

**Objetivo:** Crear 9 páginas especializadas.

**Duración:** 4-5 commits

**Módulos:**

- `js/pages/Seismic.js` — Sismología
- `js/pages/Meteorology.js` — Meteorología
- `js/pages/Fires.js` — Incendios
- `js/pages/GeoSpatial.js` — Geoespacial
- `js/pages/Environment.js` — Ambiental
- `js/pages/Prediction.js` — Predicción
- `js/pages/MultiHazard.js` — Multi Amenaza
- `js/pages/DataAnalysis.js` — Análisis
- `js/pages/Reports.js` — Reportes

**Cada página incluye:**
- Descripción del agente
- Mapa especializado
- Formulario contextual
- Resultados visuales
- Exportación

**Resultado:**
- ✅ 9 módulos funcionales
- ✅ Navegación completa
- ✅ Plataforma SaaS visible

---

### Fase 6: Servicios API (ABSTRACCIÓN N8N)

**Objetivo:** Backend intercambiable, N8N invisible.

**Duración:** 2 commits

**Tareas:**

1. ✅ Crear `services/api.js` (capa principal)
2. ✅ Métodos públicos (sin webhooks):
   ```javascript
   - sendRequest(query, context)
   - getAgentStatus(agentId)
   - getMapData(zone, layer)
   - getAnalysisResult(analysisId)
   - getReports(filter)
   - getSystemLogs()
   - exportData(format)
   ```
3. ✅ Manejo de errores, timeouts, reintentos
4. ✅ Mock data para desarrollo
5. ✅ Documentación en `docs/API.md`

**Resultado:**
- ✅ API limpia
- ✅ N8N completamente abstraído
- ✅ Intercambiable con cualquier backend

---

### Fase 7: Panel Administrador (MONITOREO INTERNO)

**Objetivo:** Sección privada solo administrador con monitoreo seguro.

**Duración:** 3 commits

**Tareas:**

1. ✅ Crear `services/auth.js` (gestión de roles para desarrollo)
2. ✅ Crear `js/pages/Admin/Dashboard.js`
3. ✅ Crear `js/pages/Admin/AgentStatus.js`
4. ✅ Crear `js/pages/Admin/WorkflowLogs.js`
5. ✅ Crear `js/pages/Admin/Performance.js`
6. ✅ Proteger ruta `/admin`
7. ✅ Mostrar estado de 19 agentes (vía capa API)
8. ✅ Logs en tiempo real (sin exponer n8n)
9. ✅ Métricas del sistema

**Resultado:**
- ✅ Panel privado seguro
- ✅ Monitoreo interno mediante capa API
- ✅ N8N permanece abstraído
- ✅ Escalable a autenticación profesional

---

## 📋 Especificaciones Técnicas

### Stack Tecnológico

**Frontend:**
- HTML5 (sin frameworks pesados)
- CSS3 (modular, variables CSS)
- JavaScript Vanilla (modular, ES6+)
- Librerías existentes:
  - **Leaflet** 1.9.4 (mapas)
  - **Chart.js** 4.4.1 (gráficos)
  - **Font Awesome** 6.5.1 (iconos)

**Backend (Abstracción):**
- n8n (no visible al usuario)
- API abstracta en `services/api.js`
- Webhooks ocultos tras capa middleware

**Estado:**
- Almacenamiento local: `store.js`
- sessionStorage para temporal (desarrollo)
- localStorage para persistencia
- **Nota:** Preparado para migración futura a autenticación profesional

**Autenticación (Desarrollo):**
- Sistema de roles: `user` vs `admin`
- Estructura preparada en `services/auth.js`
- Protección de rutas en `router.js`
- **Nota:** Implementación inicial para desarrollo. Arquitectura lista para integrar OAuth2, JWT o sistemas profesionales sin cambios en la estructura frontend

---

### Componentes Reutilizables

```javascript
// js/components/

Header.js
├─ Logo GLOBAPP
├─ Breadcrumbs
├─ Usuario/Logout
└─ Tema toggle

Sidebar.js
├─ Menú navegación (14 items)
├─ Estado de agentes (mini)
└─ Indicador status sistema

Footer.js
├─ Copyright
├─ Versión
├─ Links

MetricCard.js
├─ Valor
├─ Cambio (up/down)
├─ Icono
└─ Estado

MapViewer.js
├─ Leaflet map
├─ Layer selector
├─ Controles
└─ Popups

ChartBox.js
├─ Chart.js canvas
├─ Leyenda
└─ Toolbar

AlertPanel.js
├─ Lista alertas
├─ Filtros
└─ Timeline

QueryConsole.js
├─ Textarea input
├─ Ubicación selector
├─ Tipo análisis dropdown
├─ Profundidad slider
└─ Botón ejecutar
```

---

### Gestión de Estado Global

```javascript
// store.js

{
  user: {
    role: 'user' | 'admin',
    name: string,
    authenticated: boolean
  },
  
  system: {
    agents: [19 agentes],
    workflows: number,
    status: 'online' | 'degraded' | 'offline'
  },
  
  currentPage: string,
  
  queries: {
    recent: [],
    saved: []
  },
  
  ui: {
    theme: 'dark' | 'light',
    sidebarOpen: boolean,
    mapZoom: number
  }
}
```

---

### Flujo de Datos

```
Usuario Input
    ↓
QueryConsole.js (captura)
    ↓
queryEngine.js (procesa)
    ↓
api.js (abstrae n8n)
    ↓
n8n webhook (oculto)
    ↓
19 Agentes IA
    ↓
n8n response (oculto)
    ↓
api.js (transforma)
    ↓
pages/components (renderiza)
    ↓
MapViewer + Charts + Cards
    ↓
Usuario VE RESULTADOS (sin ver n8n)
```

---

## 🎯 Roadmap Detallado

### Sprint 1: Arquitectura Base (Semana 1)

| Día | Tarea | Estado |
|-----|-------|--------|
| Lun | Crear rama, estructura directorios | 🔄 |
| Mar | Modularizar CSS | 🔄 |
| Mié | Crear router, store, config | 🔄 |
| Jue | Crear componentes base (Header, Sidebar, Footer) | 🔄 |
| Vie | Testing, merge a develop | 🔄 |

---

### Sprint 2: Dashboard (Semana 2)

| Día | Tarea | Estado |
|-----|-------|--------|
| Lun | Refactorizar index.html → Dashboard.js | 🔄 |
| Mar | Integrar navegación completa | 🔄 |
| Mié | Adaptaciones visuales, responsive | 🔄 |
| Jue | Gráficos, datos reales | 🔄 |
| Vie | Testing, merge | 🔄 |

---

### Sprint 3: Centro de Solicitudes (Semana 3)

| Día | Tarea | Estado |
|-----|-------|--------|
| Lun | Diseñar UI consola | 🔄 |
| Mar | Implementar QueryConsole.js | 🔄 |
| Mié | queryEngine.js, validación | 🔄 |
| Jue | Integración api.js | 🔄 |
| Vie | Testing, resultados visuales | 🔄 |

---

### Sprint 4-5: Páginas Especializadas (Semanas 4-5)

Crear 9 módulos científicos en paralelo.

---

### Sprint 6: Servicios API (Semana 6)

Abstracción completa de n8n.

---

### Sprint 7: Panel Admin (Semana 7)

Sección privada con monitoreo seguro.

---

## ✅ Métricas de Éxito

- ✅ **Cero regresiones:** Todo código original funciona
- ✅ **N8N invisible:** Usuario no ve webhooks, puertos, workflows
- ✅ **Navegación fluida:** Transiciones dinámicas sin recargas
- ✅ **14 páginas funcionales:** Todas con datos reales
- ✅ **Panel admin separado:** Acceso restringido, monitoreo seguro
- ✅ **Exportación multiformato:** PDF, CSV, Excel, GeoJSON, KML
- ✅ **19 agentes integrados:** Visibles conceptualmente
- ✅ **Responsiva:** Funciona en mobile, tablet, desktop
- ✅ **Performance:** < 2s carga inicial
- ✅ **Escalabilidad:** Arquitectura lista para nuevas funciones y autenticación profesional

---

## 📚 Documentación Complementaria

Ver:
- `docs/API.md` — Especificación de servicios
- `docs/COMPONENTES.md` — Catálogo de componentes
- `docs/USUARIOS.md` — Guía para usuarios finales
- `docs/ADMIN.md` — Manual de administrador

---

**Fin del Documento**

**Siguiente paso:** Confirmación para iniciar Fase 1 implementación.
