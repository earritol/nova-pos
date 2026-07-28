# Nova Platform - Product Steering

## Overview

Nova Platform is an ecosystem of business applications designed for small and medium-sized businesses.

Instead of building a single monolithic ERP, Nova Platform consists of independent products that solve specific business problems while sharing a common platform.

Current products:

- Nova POS
- Nova GanaMás

Future products:

- Nova Restaurant
- Nova Analytics
- Marketplace
- Public APIs

---

## Product Philosophy

Nova products should be:

- Modern
- Simple
- Fast
- Offline-capable when required
- Easy to learn
- Easy to maintain
- Modular
- Scalable

Complexity should never be exposed to end users.

---

## Core Principles

Business value comes first.

User experience is more important than feature count.

Every feature should solve a real business problem.

Avoid unnecessary configuration.

Prefer convention over configuration.

Build products that can evolve incrementally.

---

## Platform Evolution

Nova Platform evolves incrementally through independent CORE modules.

Each CORE should:

- Extend existing platform capabilities.
- Reuse shared Platform Services whenever possible.
- Preserve previously approved architectural decisions.
- Avoid introducing new architectural patterns unless justified by an ADR.
- Favor incremental evolution over architectural redesign.

Every completed CORE should strengthen the platform rather than create isolated implementations.

---

## Nova POS

Nova POS is the flagship product of Nova Platform.

Purpose:

Provide a modern Point of Sale system for SMB businesses.

Characteristics:

- Offline First
- Multi-Tenant
- Local authentication
- Inventory
- Sales
- Cash Register
- Reporting

Nova POS must continue operating without Internet connectivity.

---

## Nova GanaMás

Nova GanaMás is a customer loyalty platform.

Characteristics:

- Online First
- Email OTP Authentication
- Consumer-oriented
- Rewards
- Visits
- Campaigns

---

## Platform Services

Nova Platform provides shared platform capabilities that can be consumed by multiple products.

Examples include:

- Organization Management
- Synchronization
- Audit
- Configuration
- Notifications (future)

Platform Services contain reusable platform capabilities.

They must not contain product-specific business rules.

---

## Product Boundaries

Nova POS is not an ERP.

Nova POS should remain focused on retail operations.

Features that belong to accounting, payroll, manufacturing, CRM, or ERP systems should not be added unless they directly support the POS experience.

---

## Multi-Tenant

Organizations are tenants.

Every business entity belongs to exactly one organization.

Tenant isolation is mandatory.

No cross-tenant data access is allowed.

---

## Shared Platform Principles

Products may share infrastructure.

Products must not share business logic.

Business rules belong either to:

- the owning Product
- or the Platform Domain

Never duplicate business rules across products.

---

## Architecture Principles

Products remain independent.

Infrastructure is shared.

Business logic belongs to products or platform domains.

Shared capabilities belong to the platform.

Dependencies should always point toward abstractions.

---

## Development Guidelines

When generating requirements:

- Keep solutions simple.
- Prefer modular designs.
- Avoid unnecessary abstractions.
- Design for future evolution.
- Respect Offline First.
- Respect Multi-Tenant.
- Respect product boundaries.
- Keep business logic inside the correct domain.
- Favor consistency over cleverness.

Every specification should align with these principles.

Generated specifications should prioritize consistency with existing platform capabilities over introducing new abstractions.

When existing Platform Services satisfy a requirement, they should be reused instead o