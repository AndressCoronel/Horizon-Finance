# 🏦 Horizon Finance — Plan de Implementación

## Resumen del Proyecto

**Horizon Finance** es una plataforma Fintech de gestión de inversiones en criptomonedas, diseñada como proyecto de portfolio profesional. Permite a los usuarios gestionar un portfolio de cripto con trading simulado, visualización de mercado en tiempo real, y un asesor financiero inteligente basado en reglas.

---

## Stack Tecnológico Definitivo

| Tecnología        | Uso                                      |
| ----------------- | ---------------------------------------- |
| Next.js 15        | Framework (App Router + TypeScript)      |
| Tailwind CSS      | Estilos                                  |
| Shadcn/ui         | Componentes UI                           |
| Clerk             | Autenticación                            |
| Supabase          | Base de datos PostgreSQL                 |
| Prisma ORM        | Acceso a datos y migraciones             |
| TanStack Query    | Estado del servidor y polling            |
| Recharts          | Gráficos y visualizaciones              |
| CoinGecko API     | Precios de cripto (tier gratuito)        |
| DolarAPI           | Cotización ARS/USD (gratuita, sin key)   |
| Vercel            | Deploy                                   |

**Costo total: $0**

---

## Arquitectura de Base de Datos (Prisma Schema)

### Modelos

#### User
- `id` (String, cuid)
- `clerkId` (String, unique) — ID de Clerk
- `email` (String, unique)
- `firstName` (String?)
- `lastName` (String?)
- `preferredCurrency` (Enum: ARS | USD, default: USD)
- `cashBalanceUSD` (Decimal, default: 0) — Saldo en USD
- `cashBalanceARS` (Decimal, default: 0) — Saldo en ARS
- `createdAt`, `updatedAt`
- Relación: tiene un `Portfolio`

#### Portfolio
- `id` (String, cuid)
- `userId` (String, unique) — Relación 1:1 con User
- `name` (String, default: "Mi Portfolio")
- `createdAt`, `updatedAt`
- Relación: tiene muchas `Position`

#### Asset
- `id` (String, cuid)
- `coinGeckoId` (String, unique) — ID en CoinGecko (ej: "bitcoin")
- `symbol` (String) — Ej: "BTC"
- `name` (String) — Ej: "Bitcoin"
- `image` (String?) — URL del ícono
- `createdAt`, `updatedAt`
- Relación: tiene muchas `Position` y `Transaction`

#### Position
- `id` (String, cuid)
- `portfolioId` (String)
- `assetId` (String)
- `quantity` (Decimal) — Cantidad de cripto
- `averageBuyPrice` (Decimal) — Precio promedio de compra en USD
- `createdAt`, `updatedAt`
- Relación: pertenece a `Portfolio` y `Asset`
- Unique constraint: [portfolioId, assetId]

#### Transaction
- `id` (String, cuid)
- `userId` (String)
- `assetId` (String?) — Null para depósitos
- `type` (Enum: BUY | SELL | DEPOSIT_USD | DEPOSIT_ARS)
- `quantity` (Decimal?) — Cantidad de cripto (null para depósitos)
- `pricePerUnit` (Decimal?) — Precio del activo en USD al momento
- `totalAmount` (Decimal) — Monto total en la moneda correspondiente
- `currency` (Enum: ARS | USD)
- `createdAt`
- Relación: pertenece a `User` y `Asset`

---

## Módulos / Funcionalidades

### 1. 🏠 Landing Page (Pública)
- Hero section atractivo con branding "Horizon Finance"
- Features highlight
- CTA para registrarse
- Responsive y visualmente impactante

### 2. 📊 Dashboard Inteligente (`/dashboard`)
- **Patrimonio total** en USD y ARS (conversión vía DolarAPI)
- **Gráfico de torta** (Recharts) con distribución de activos
- **Top Gainers / Losers** basado en cambio % 24h de CoinGecko
- **Resumen rápido**: número de activos, ganancia/pérdida total, saldo disponible
- **Gráfico de evolución** del portfolio (histórico de transacciones)

### 3. 🌐 Market Explorer (`/market`)
- Lista de criptomonedas con precio actual, cambio 24h, market cap
- Datos de CoinGecko con polling cada 60 segundos (TanStack Query)
- Barra de búsqueda y filtros
- Click en una crypto → detalle con gráfico de precio histórico
- Botón directo "Comprar" desde el market

### 4. 💱 Sistema de Trading Simulado (`/trade`)
- Formulario de **Compra/Venta**
- Seleccionar cripto, cantidad, vista previa del costo
- **Validaciones**:
  - No comprar si no hay saldo suficiente
  - No vender más de lo que se posee
  - Cantidades positivas válidas
- Actualización automática de Position (cantidad + precio promedio)
- Registro de Transaction
- **Sistema de depósito** para agregar fondos (USD/ARS simulado)

### 5. 📁 Portfolio Detallado (`/portfolio`)
- Lista de todas las posiciones
- Por cada posición: cantidad, precio promedio de compra, precio actual, ganancia/pérdida ($ y %)
- Gráfico de torta con distribución
- Valor total del portfolio

### 6. 📜 Historial de Transacciones (`/transactions`)
- Tabla con todas las transacciones
- Filtros: tipo (compra/venta/depósito), fecha, activo
- Paginación
- Detalle de cada transacción

### 7. 🤖 IA Financial Advisor (`/advisor`)
**Sistema Rule-Based** que analiza el portfolio y genera un informe:

#### Reglas de análisis:
1. **Score de Diversificación** (0-100)
   - < 3 activos → Bajo
   - 3-7 activos → Medio
   - > 7 activos → Alto
   - Penalización si un activo > 50% del portfolio

2. **Análisis de Concentración**
   - Alerta si un solo activo > 40% del portfolio
   - Alerta si top 2 activos > 70% del portfolio

3. **Evaluación de Riesgo por Volatilidad**
   - Usa `price_change_percentage_24h` y `price_change_percentage_7d` de CoinGecko
   - Clasifica cada activo: Bajo riesgo (< 5%), Medio (5-15%), Alto (> 15%)
   - Score de riesgo ponderado del portfolio

4. **Rendimiento**
   - Ganancia/pérdida por posición vs. precio promedio de compra
   - Rendimiento total del portfolio en %

5. **Recomendaciones generadas**:
   - "Considerá diversificar: el 80% de tu portfolio está en BTC"
   - "Tenés alta exposición a activos volátiles (ETH +12% en 24h)"
   - "Tu portfolio muestra buen rendimiento: +25% desde la compra"
   - "Podrías considerar tomar ganancias en SOL (+45%)"

#### Output del informe:
- **Score de Salud** general (0-100) con gráfico circular
- **Badges**: Diversificado / Concentrado / Conservador / Agresivo
- **Lista de alertas** con severidad (info/warning/danger)
- **Recomendaciones** accionables

---

## Usuario Demo

### Datos pre-cargados:
- **Email**: demo@horizonfinance.com
- **Saldo**: $10,000 USD / $5,000,000 ARS
- **Posiciones**:
  - 0.5 BTC (comprado a $42,000 promedio)
  - 3.2 ETH (comprado a $2,200 promedio)
  - 150 SOL (comprado a $95 promedio)
  - 5,000 ADA (comprado a $0.45 promedio)
  - 2 BNB (comprado a $310 promedio)
- **Transacciones**: ~15 transacciones históricas variadas (depósitos + compras + ventas)
- **Acceso**: Botón "Ver Demo" en la landing que ingresa como usuario demo sin necesidad de registro

---

## APIs Externas

### CoinGecko (Gratuita)
- **Endpoint principal**: `GET /api/v3/coins/markets`
- **Rate limit**: ~30 calls/min (sin API key)
- **Datos**: precio, cambio 24h/7d, market cap, volumen, imagen
- **Polling**: cada 60 segundos vía TanStack Query

### DolarAPI (Gratuita)
- **Endpoint**: `GET https://dolarapi.com/v1/dolares/blue`
- **Sin API key** necesaria
- **Datos**: compra, venta, fecha actualización
- **Uso**: Conversión USD ↔ ARS en toda la app

---

## Fases de Desarrollo

### Fase 1: Setup y Fundación
1. Inicializar Next.js 15 con TypeScript
2. Configurar Tailwind CSS + Shadcn/ui
3. Configurar Prisma con Supabase
4. Crear schema de base de datos y migraciones
5. Integrar Clerk para autenticación
6. Estructura de carpetas y configuración base

### Fase 2: Core — Backend y Servicios
1. Crear servicios de negocio (portfolio, trading, market)
2. API routes para CRUD de portfolio y trading
3. Integración con CoinGecko API
4. Integración con DolarAPI
5. Lógica de trading: compra/venta con validaciones
6. Seed del usuario demo

### Fase 3: UI — Dashboard y Market
1. Layout principal con sidebar/navbar
2. Dashboard con widgets y gráficos (Recharts)
3. Market Explorer con lista y detalle
4. Sistema de Skeletons para loading states

### Fase 4: UI — Trading y Portfolio
1. Formulario de trading con validaciones
2. Sistema de depósitos
3. Vista de portfolio detallada
4. Historial de transacciones con filtros

### Fase 5: IA Advisor y Polish
1. Motor de reglas del advisor
2. UI del informe financiero
3. Landing page pública
4. Usuario demo funcional (botón "Ver Demo")
5. Dark/Light mode
6. Responsive final
7. Optimizaciones de performance

### Fase 6: Deploy
1. Configurar variables de entorno en Vercel
2. Conectar Supabase
3. Deploy a producción
4. Testing final

---

## Principios de Código

- **Server Components** por defecto para fetch de datos
- **Client Components** solo para interactividad (formularios, gráficos, polling)
- **Servicios separados** en `/services` para lógica de negocio
- **Validación** con Zod en API routes y formularios
- **Loading states** con Skeletons de Shadcn/ui
- **Error handling** consistente con error boundaries
- **TypeScript estricto** en todo el proyecto
- **Principios SOLID** aplicados
