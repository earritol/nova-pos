# Modelo de Dominio

**Versión:** 1.0  
**Estado:** Draft  
**Última actualización:** Julio 2026

---

# Objetivo

Este documento define el lenguaje de negocio utilizado en Nova POS.

Su propósito es establecer un vocabulario común para desarrolladores, diseñadores, analistas, soporte y clientes, asegurando que todos los involucrados interpreten los conceptos del sistema de la misma manera.

Este documento no describe la implementación técnica ni el modelo de base de datos.

---

# Principios

Todo concepto del dominio debe cumplir:

- Tener un significado único.
- Ser comprensible para usuarios no técnicos.
- Representar una entidad real del negocio.
- Evitar ambigüedades.
- Mantener estabilidad a largo plazo.

---

# Organización

La Organización representa el negocio que utiliza Nova POS.

Es la unidad principal de la plataforma.

Ejemplos:

- Papelería Lupita
- Ferretería El Martillo
- Veterinaria San José

Cada organización posee su propia información y opera de forma completamente aislada de las demás.

Una organización puede tener:

- Una suscripción
- Varias sucursales
- Varios usuarios
- Varios clientes
- Varios proveedores
- Miles de productos
- Miles de ventas

---

# Suscripción

La Suscripción representa el contrato comercial entre una organización y Nova Platform.

Define los recursos contratados por el negocio.

Ejemplos:

- Fecha de inicio
- Fecha de renovación
- Estado
- Terminales contratadas
- Servicios adicionales

La suscripción nunca controla funcionalidades.

Todas las organizaciones utilizan el mismo producto.

---

# Sucursal

Una Sucursal representa una ubicación física donde opera la organización.

Ejemplos:

- Matriz
- Centro
- Plaza Norte

Cada sucursal administra:

- Inventario
- Terminales POS
- Personal
- Ventas
- Caja

Una organización puede tener una o múltiples sucursales.

---

# Terminal POS

Una Terminal POS representa un dispositivo autorizado para realizar operaciones comerciales.

No depende del sistema operativo.

Puede ser:

- Windows
- macOS
- Linux
- Android
- iPadOS
- Navegador Web

Una terminal pertenece a una única sucursal.

---

# Usuario

Un Usuario representa a una persona autorizada para utilizar Nova POS.

Ejemplos:

- Propietario
- Cajero
- Administrador
- Supervisor

Un usuario puede operar desde distintas terminales dependiendo de sus permisos.

---

# Rol

Un Rol define el conjunto de permisos asignados a un usuario.

Ejemplos:

- Administrador
- Cajero
- Supervisor
- Inventarios

Los permisos siempre se asignan mediante roles.

---

# Cliente

Un Cliente representa a una persona o empresa que compra productos o servicios.

Un cliente puede existir aunque nunca haya realizado una compra.

Puede utilizarse para:

- Historial de compras
- Facturación
- Programas de lealtad
- Créditos (versiones futuras)

---

# Proveedor

Un Proveedor representa la empresa o persona que abastece mercancía.

Se utiliza para:

- Compras
- Recepción de mercancía
- Historial
- Costos

---

# Producto

Un Producto representa cualquier artículo disponible para su comercialización.

Ejemplos:

- Refacción
- Cuaderno
- Alimento para mascotas
- Pintura
- Tornillo

Un producto pertenece al catálogo de una organización.

---

# Categoría

Una Categoría agrupa productos con características similares.

Ejemplos:

- Papelería
- Herramientas
- Refacciones
- Medicamentos
- Accesorios

---

# Inventario

El Inventario representa las existencias disponibles de productos dentro de una sucursal.

Cada sucursal mantiene su propio inventario.

El inventario cambia mediante movimientos.

---

# Movimiento de Inventario

Un Movimiento registra cualquier cambio en las existencias.

Ejemplos:

- Compra
- Venta
- Ajuste
- Traspaso
- Devolución

Todo cambio debe ser trazable.

Nunca se modifica directamente una existencia sin registrar su movimiento.

---

# Compra

Una Compra representa la adquisición de mercancía a un proveedor.

Las compras incrementan el inventario.

---

# Venta

Una Venta representa una transacción comercial realizada por una terminal POS.

Incluye:

- Productos vendidos
- Cliente (opcional)
- Cajero
- Fecha
- Forma de pago
- Totales

Una venta genera movimientos de inventario.

---

# Ticket

El Ticket representa el comprobante entregado al cliente.

Puede imprimirse o enviarse digitalmente.

El ticket es el resultado visible de una venta.

---

# Caja

La Caja representa la operación financiera de una terminal durante un periodo determinado.

Incluye:

- Apertura
- Cierre
- Movimientos
- Retiros
- Ingresos

---

# Corte de Caja

El Corte de Caja resume todas las operaciones realizadas durante un turno.

Permite validar:

- Ventas
- Efectivo esperado
- Diferencias
- Movimientos

---

# Forma de Pago

Representa el medio utilizado para liquidar una venta.

Ejemplos:

- Efectivo
- Tarjeta
- Transferencia
- Mixto
- Vale
- Crédito (futuro)

---

# Reporte

Un Reporte representa información consolidada para apoyar la toma de decisiones.

Ejemplos:

- Ventas
- Inventario
- Utilidades
- Productos más vendidos
- Compras

---

# Dashboard

El Dashboard representa la vista ejecutiva del negocio.

Su objetivo es responder rápidamente:

- ¿Cómo voy hoy?
- ¿Qué estoy vendiendo?
- ¿Qué debo comprar?
- ¿Qué sucursal vende más?

---

# Sincronización

La Sincronización es el proceso mediante el cual los datos generados en modo offline son enviados a la nube cuando existe conectividad.

Debe ser:

- Automática
- Transparente
- Segura
- Confiable

---

# Nova Platform

Nova Platform representa el ecosistema completo de productos.

Nova POS es uno de esos productos.

Otros productos compartirán:

- Autenticación
- Organizaciones
- Suscripciones
- Usuarios
- Facturación
- Servicios comunes

---

# Relaciones Conceptuales

```
Nova Platform
│
├── Organización
│   │
│   ├── Suscripción
│   ├── Usuarios
│   ├── Clientes
│   ├── Proveedores
│   ├── Productos
│   │
│   └── Sucursales
│       │
│       ├── Terminales POS
│       ├── Inventario
│       ├── Compras
│       ├── Ventas
│       └── Caja
```

---

# Reglas del Dominio

- Toda organización posee exactamente una suscripción activa.
- Una sucursal pertenece únicamente a una organización.
- Una terminal pertenece únicamente a una sucursal.
- Un usuario pertenece únicamente a una organización.
- Un producto pertenece únicamente a una organización.
- El inventario siempre pertenece a una sucursal.
- Toda venta genera movimientos de inventario.
- Toda venta pertenece a una única sucursal.
- Toda compra pertenece a una única sucursal.
- Ningún dato puede compartirse entre organizaciones.

---

# Conceptos Pendientes

Los siguientes conceptos podrán incorporarse en futuras versiones:

- Facturación electrónica
- Apartados
- Créditos
- Cuentas por cobrar
- Programas de lealtad (Nova GanaMás)
- Transferencias entre sucursales
- Series y lotes
- Kits de productos
- Fabricación ligera

---

# Historial de Cambios

| Versión | Fecha | Descripción |
|----------|--------|-------------|
| 1.0 | Julio 2026 | Primera versión del Modelo de Dominio. |