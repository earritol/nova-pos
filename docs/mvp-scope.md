# Alcance del MVP

**Versión:** 1.0  
**Estado:** Draft  
**Última actualización:** Julio 2026

---

# Objetivo

Este documento define el alcance funcional de la primera versión pública de Nova POS (MVP).

El objetivo del MVP es validar el producto con clientes reales lo antes posible, ofreciendo una solución completa para la operación diaria de pequeños y medianos comercios, evitando funcionalidades que incrementen significativamente la complejidad del desarrollo sin aportar valor inmediato.

El MVP deberá ser completamente utilizable en un negocio real.

---

# Objetivos del MVP

El MVP debe permitir que un comercio pueda:

- Configurar su negocio.
- Registrar productos.
- Administrar inventario.
- Comprar mercancía.
- Vender productos.
- Cobrar al cliente.
- Imprimir tickets.
- Consultar reportes básicos.
- Operar múltiples sucursales.
- Operar múltiples terminales POS.
- Funcionar sin conexión a Internet.

Si un negocio puede operar durante un día completo utilizando únicamente Nova POS, el MVP habrá cumplido su objetivo.

---

# Público Objetivo

El MVP está dirigido a:

- Papelerías
- Abarrotes
- Mini súper
- Ferreterías
- Refaccionarias
- Boutiques
- Veterinarias
- Tiendas especializadas

No busca cubrir industrias altamente especializadas.

---

# Funcionalidades Incluidas

## Plataforma

- Registro de organizaciones.
- Administración de sucursales.
- Administración de terminales POS.
- Administración de usuarios.
- Roles y permisos.
- Configuración del negocio.

---

## Autenticación

- Inicio de sesión.
- Recuperación de acceso.
- Gestión de sesiones.
- Cambio de contraseña.
- Invitación de usuarios.

---

## Catálogo de Productos

- Alta de productos.
- Edición.
- Eliminación lógica.
- Categorías.
- Códigos de barras.
- SKU.
- Costos.
- Precios.
- Impuestos.
- Estado del producto.

---

## Inventario

- Existencias por sucursal.
- Movimientos.
- Ajustes.
- Kardex.
- Entradas.
- Salidas.

---

## Compras

- Proveedores.
- Registro de compras.
- Recepción de mercancía.
- Actualización automática del inventario.

---

## Clientes

- Alta.
- Edición.
- Historial básico.
- Búsqueda rápida.

El cliente será opcional durante la venta.

---

## Ventas

- Punto de venta.
- Búsqueda rápida.
- Escaneo de código de barras.
- Carrito.
- Descuentos.
- Cancelación antes del cobro.
- Cobro.
- Ticket.
- Venta rápida.

---

## Formas de Pago

- Efectivo.
- Tarjeta.
- Transferencia.
- Pago mixto.

---

## Caja

- Apertura.
- Cierre.
- Cortes.
- Movimientos.
- Retiros.
- Ingresos.

---

## Reportes

- Ventas del día.
- Ventas por periodo.
- Productos más vendidos.
- Inventario actual.
- Compras.
- Cortes de caja.

---

## Dashboard

- Ventas del día.
- Productos más vendidos.
- Inventario bajo.
- Indicadores principales.

---

## Offline First

El MVP deberá operar sin Internet.

Las operaciones deberán sincronizarse automáticamente al recuperar la conectividad.

Esta funcionalidad es obligatoria.

---

## Sincronización

- Automática.
- Transparente.
- Con resolución básica de conflictos.
- Sin intervención del usuario.

---

# Funcionalidades NO Incluidas

Las siguientes funcionalidades quedan fuera del MVP.

## Administración

- Multiempresa dentro de una misma organización.
- Franquicias.
- Jerarquías empresariales.

---

## Ventas

- Apartados.
- Cotizaciones.
- Preventas.
- Pedidos.
- Comisiones.
- Promociones avanzadas.
- Combos.
- Gift Cards.

---

## Clientes

- Créditos.
- Cuentas por cobrar.
- Estados de cuenta.
- Límites de crédito.

---

## Inventario

- Series.
- Lotes.
- Caducidades.
- Fabricación.
- Ensambles.
- Producción.
- Costeo avanzado.

---

## Compras

- Órdenes de compra con flujo de autorización.
- Múltiples recepciones.
- Importaciones.

---

## Contabilidad

- Contabilidad.
- Pólizas.
- Conciliaciones.

---

## Fiscal

- Facturación SAT.
- CFDI.
- Complementos fiscales.

---

## Integraciones

- Shopify.
- Mercado Libre.
- Amazon.
- WooCommerce.
- APIs públicas.

---

## Inteligencia Artificial

- Pronóstico de ventas.
- Recomendaciones.
- Automatizaciones.
- Asistentes.

---

## Ecosistema Nova

- Nova GanaMás.
- Nova Restaurant.
- Nova Insights.
- Nova API.

---

# Requisitos No Funcionales

El MVP deberá cumplir con:

- Alta disponibilidad.
- Respuesta rápida.
- Operación Offline.
- Sincronización automática.
- Seguridad.
- Multi-tenant.
- Escalabilidad.
- Arquitectura modular.
- Diseño responsivo.

---

# Criterios de Éxito

El MVP será considerado exitoso cuando:

- Un negocio pueda operar diariamente utilizando únicamente Nova POS.
- Un usuario pueda aprender el sistema en menos de una hora.
- El sistema pueda funcionar sin conexión a Internet.
- La sincronización ocurra sin intervención del usuario.
- Los primeros clientes puedan utilizar el sistema en producción.

---

# Criterios para Agregar Funcionalidades

Una funcionalidad sólo podrá incorporarse al MVP si cumple al menos uno de los siguientes criterios:

- Es indispensable para operar un negocio.
- Es requerida por la mayoría de los clientes objetivo.
- Reduce significativamente el trabajo diario del usuario.
- Su ausencia impide vender el producto.

Si una funcionalidad no cumple estos criterios, deberá planificarse para una versión posterior.

---

# Definición de MVP Completo

El MVP estará terminado cuando un negocio pueda:

1. Configurar su empresa.
2. Registrar productos.
3. Comprar mercancía.
4. Controlar inventario.
5. Abrir caja.
6. Realizar ventas.
7. Cobrar.
8. Imprimir tickets.
9. Cerrar caja.
10. Consultar reportes.

Sin depender de herramientas externas.

---

# Fuera del Alcance

No forman parte del MVP:

- Personalizaciones por cliente.
- Desarrollo a medida.
- Módulos exclusivos.
- Integraciones especiales.
- Procesos específicos de una industria.

Nova POS priorizará resolver necesidades comunes del mercado antes que casos particulares.

---

# Historial de Cambios

| Versión | Fecha | Descripción |
|----------|--------|-------------|
| 1.0 | Julio 2026 | Primera versión del alcance del MVP. |