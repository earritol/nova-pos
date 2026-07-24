# Nova Platform - Product Steering

## Overview

Nova Platform is an ecosystem of business applications designed for small and medium-sized businesses.

Rather than building a single monolithic ERP, Nova Platform consists of independent products that solve specific business problems while sharing a common platform.

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

---

## Nova POS

Nova POS is the flagship product of Nova Platform.

Purpose:

Provide a modern Point of Sale system for SMB businesses.

Characteristics:

- Offline First
- Multi-tenant
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
- Consumer oriented
- Rewards
- Visits
- Campaigns

---

## Product Boundaries

Nova POS is not an ERP.

Nova POS should remain focused on retail operations.

Features that belong to accounting, payroll, manufacturing, CRM or ERP systems should not be added unless they directly support the POS experience.

---

## Multi-Tenant

Organizations are tenants.

Every business entity belongs to one organization.

Tenant isolation is mandatory.

---

## Architecture

Products remain independent.

Infrastructure is shared.

Business logic belongs to products.

Shared capabilities belong to the platform.

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

Every specification should align with these principles.