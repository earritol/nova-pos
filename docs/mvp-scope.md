# Alcance del MVP

**Versión:** 2.0  
**Estado:** Draft  
**Última actualización:** Julio 2026

---

# Objetivo

Este documento define el alcance funcional de la primera versión pública (MVP) de Nova POS.

El propósito del MVP es validar el producto con clientes reales mediante una solución completamente funcional para pequeños y medianos comercios, priorizando las capacidades esenciales para la operación diaria y evitando funcionalidades que incrementen innecesariamente la complejidad del producto.

El MVP deberá ser suficientemente completo para operar un negocio real.

---

# Filosofía del MVP

El MVP de Nova POS no representa una versión "recortada" del producto.

Representa la mínima versión completa capaz de resolver exitosamente la operación diaria de un comercio.

Cada funcionalidad incluida debe aportar valor directo al usuario.

Todo aquello que no sea indispensable para operar un negocio deberá programarse para versiones posteriores.

---

# Objetivos

Al finalizar el MVP un negocio deberá poder:

- Configurar su empresa.
- Configurar sucursales.
- Configurar terminales POS.
- Registrar productos.
- Administrar inventario.
- Registrar compras.
- Realizar ventas.
- Cobrar.
- Imprimir tickets.
- Controlar caja.
- Consultar reportes.
- Operar sin conexión a Internet.

Si un negocio puede operar durante un día completo utilizando únicamente Nova POS, el MVP habrá cumplido su objetivo.

---

# Público Objetivo

El MVP está dirigido principalmente a:

- Papelerías
- Abarrotes
- Mini súper
- Boutiques
- Ferreterías
- Refaccionarias
- Veterinarias
- Tiendas especializadas
- Tiendas de conveniencia independientes

---

# Organización del MVP

El desarrollo del MVP se organiza mediante **épicas**.

Cada épica representa una capacidad completa del negocio y contará con su propia especificación funcional y técnica.

Posteriormente cada épica tendrá una carpeta independiente dentro de:

```

specs/

```

donde se almacenarán:

- requirements.md
- design.md
- tasks.md

---

# Resumen de Épicas

| Código | Épica | Prioridad | Estado |
|---------|-------|-----------|--------|
| CORE-001 | Onboarding | Alta | MVP |
| CORE-002 | Authentication & Security | Alta | MVP |
| CORE-003 | Organization | Alta | MVP |
| CAT-001 | Product Catalog | Alta | MVP |
| INV-001 | Inventory | Alta | MVP |
| PUR-001 | Purchases | Alta | MVP |
| SAL-001 | Sales | Crítica | MVP |
| CASH-001 | Cash Register | Alta | MVP |
| CUS-001 | Customers | Media | MVP |
| RPT-001 | Dashboard & Reporting | Media | MVP |
| CFG-001 | Configuration | Media | MVP |
| SYNC-001 | Offline & Synchronization | Crítica | MVP |

---

# Épicas del MVP

---

# CORE-001 — Onboarding

## Objetivo

Permitir que un nuevo cliente configure Nova POS desde cero.

## Incluye

- Registro de organización.
- Wizard de bienvenida.
- Configuración inicial.
- Zona horaria.
- Moneda.
- Datos fiscales básicos.
- Configuración inicial del sistema.

## No incluye

- Importaciones masivas.
- Configuración avanzada.
- Automatizaciones.

---

# CORE-002 — Authentication & Security

## Objetivo

Gestionar el acceso seguro a la plataforma.

## Incluye

- Inicio de sesión.
- Cierre de sesión.
- Recuperación de contraseña.
- Gestión de sesiones.
- Invitación de usuarios.
- Roles.
- Permisos.

## No incluye

- MFA.
- SSO.
- OAuth empresarial.
- Active Directory.

---

# CORE-003 — Organization

## Objetivo

Administrar la estructura organizacional del negocio.

## Incluye

- Organización.
- Sucursales.
- Terminales POS.
- Información del negocio.

## No incluye

- Franquicias.
- Multiempresa.
- Holdings.

---

# CAT-001 — Product Catalog

## Objetivo

Administrar el catálogo comercial.

## Incluye

- Productos.
- Categorías.
- Marcas.
- SKU.
- Código de barras.
- Costos.
- Precios.
- Impuestos.
- Productos activos/inactivos.

## No incluye

- Productos compuestos.
- Kits.
- Series.
- Lotes.
- Caducidades.

---

# INV-001 — Inventory

## Objetivo

Controlar las existencias por sucursal.

## Incluye

- Existencias.
- Movimientos.
- Kardex.
- Ajustes.
- Stock mínimo.

## No incluye

- Costeo avanzado.
- Fabricación.
- Producción.
- Inventarios cíclicos.

---

# PUR-001 — Purchases

## Objetivo

Registrar el abastecimiento del negocio.

## Incluye

- Proveedores.
- Compras.
- Recepción.
- Incremento automático del inventario.

## No incluye

- Flujos de autorización.
- Compras internacionales.
- Múltiples recepciones.

---

# SAL-001 — Sales

## Objetivo

Permitir la operación diaria del Punto de Venta.

## Incluye

- Punto de venta.
- Escáner.
- Búsqueda rápida.
- Carrito.
- Descuentos básicos.
- Cobro.
- Ticket.
- Cancelación antes del cobro.
- Devoluciones simples.

## Formas de pago

- Efectivo.
- Tarjeta.
- Transferencia.
- Pago mixto.

## No incluye

- Apartados.
- Cotizaciones.
- Pedidos.
- Promociones.
- Gift Cards.
- Crédito.

---

# CASH-001 — Cash Register

## Objetivo

Controlar la operación financiera de la caja.

## Incluye

- Apertura.
- Cierre.
- Corte.
- Retiros.
- Ingresos.
- Arqueo.

## No incluye

- Múltiples cajas por terminal.
- Conciliaciones bancarias.

---

# CUS-001 — Customers

## Objetivo

Administrar clientes del negocio.

## Incluye

- Alta.
- Edición.
- Eliminación lógica.
- Historial básico.
- Búsqueda.

## No incluye

- Créditos.
- Estados de cuenta.
- Cuentas por cobrar.
- Programas de lealtad.

---

# RPT-001 — Dashboard & Reporting

## Objetivo

Proporcionar información para la toma de decisiones.

## Dashboard

- Ventas del día.
- Productos más vendidos.
- Indicadores principales.
- Inventario bajo.

## Reportes

- Ventas.
- Compras.
- Inventario.
- Caja.
- Productos.

## No incluye

- BI.
- IA.
- Pronósticos.
- KPIs avanzados.

---

# CFG-001 — Configuration

## Objetivo

Permitir configurar el comportamiento general del sistema.

## Incluye

- Datos del negocio.
- Monedas.
- Impuestos.
- Numeración.
- Tickets.
- Preferencias generales.

## No incluye

- Configuración avanzada.
- Personalizaciones por cliente.

---

# SYNC-001 — Offline & Synchronization

## Objetivo

Garantizar la continuidad operativa cuando no exista conexión a Internet.

## Incluye

- Operación Offline.
- Persistencia local.
- Cola de sincronización.
- Sincronización automática.
- Reintentos.
- Estado de sincronización.
- Resolución básica de conflictos.

## No incluye

- Replicación distribuida.
- Sincronización entre organizaciones.

---

# Dependencias

Las épicas deberán desarrollarse respetando el siguiente orden:

```

CORE-001 Onboarding
↓
CORE-002 Authentication
↓
CORE-003 Organization
↓
CAT-001 Product Catalog
↓
INV-001 Inventory
↓
PUR-001 Purchases
↓
SAL-001 Sales
↓
CASH-001 Cash Register
↓
CUS-001 Customers
↓
RPT-001 Dashboard & Reporting

CFG-001 Configuration
↳ Transversal

SYNC-001 Offline & Synchronization
↳ Depende funcionalmente de todas las anteriores

```

---

# Funcionalidades Fuera del MVP

Las siguientes capacidades quedan expresamente fuera del alcance de esta versión:

## Administración

- Multiempresa.
- Franquicias.

## Ventas

- Apartados.
- Cotizaciones.
- Pedidos.
- Promociones.
- Gift Cards.

## Clientes

- Créditos.
- Cuentas por cobrar.
- Estados de cuenta.

## Inventario

- Series.
- Lotes.
- Caducidades.
- Fabricación.
- Ensambles.
- Producción.

## Fiscal

- Facturación SAT.
- CFDI.
- Complementos fiscales.

## Integraciones

- Shopify.
- Mercado Libre.
- WooCommerce.
- Amazon.
- API pública.

## Inteligencia Artificial

- Pronósticos.
- Automatizaciones.
- Asistentes.
- Recomendaciones.

## Ecosistema Nova

- Nova GanaMás.
- Nova Restaurant.
- Nova Insights.
- Nova API.

---

# Requisitos No Funcionales

El MVP deberá cumplir con:

- Arquitectura Multi-Tenant.
- Offline First.
- Sincronización automática.
- Alta disponibilidad.
- Seguridad.
- Escalabilidad.
- Diseño responsivo.
- Alta velocidad de respuesta.
- Arquitectura modular.
- Auditoría básica.

---

# Definición de MVP Completo

El MVP se considerará terminado cuando las siguientes épicas hayan sido implementadas y liberadas:

- ✅ CORE-001
- ✅ CORE-002
- ✅ CORE-003
- ✅ CAT-001
- ✅ INV-001
- ✅ PUR-001
- ✅ SAL-001
- ✅ CASH-001
- ✅ CUS-001
- ✅ RPT-001
- ✅ CFG-001
- ✅ SYNC-001

y un comercio pueda operar su negocio diariamente utilizando exclusivamente Nova POS.

---

# Criterios para Incorporar Nuevas Funcionalidades

Una funcionalidad podrá agregarse al MVP únicamente si:

- Es indispensable para operar un comercio.
- Es requerida por la mayoría del mercado objetivo.
- Reduce significativamente el trabajo diario del usuario.
- Su ausencia impide vender Nova POS.

En cualquier otro caso, deberá programarse para una versión posterior.

---

# Historial de Cambios

| Versión | Fecha | Descripción |
|----------|--------|-------------|
| 2.0 | Julio 2026 | Reestructuración completa del MVP utilizando una organización basada en épicas. |