# ADR-006: Shared Supabase Platform Architecture

- **Status:** Accepted
- **Date:** 2026-07-24
- **Deciders:** Nova Platform Architecture Team

---

# Context

Nova Platform includes multiple products that share infrastructure while maintaining independent business domains.

Products include:

- Nova POS
- Nova GanaMás
- Future platform applications

The platform requires:

- Multi-tenancy
- Centralized identity
- Shared infrastructure
- Independent schemas
- Low operational overhead

---

# Decision

Nova Platform will use a single Supabase project containing multiple PostgreSQL schemas.

Each major product or platform capability owns its own schema.

Examples:

- platform
- pos
- ganamas
- restaurant

Row Level Security (RLS) will enforce tenant isolation where applicable.

Authentication strategies may differ by product.

For example:

- Nova GanaMás uses Supabase Auth.
- Nova POS implements local authentication with offline support.

---

# Consequences

## Positive

- Centralized infrastructure.
- Simplified operations.
- Lower cost.
- Shared monitoring.
- Independent business schemas.
- Consistent security model.

## Negative

- Requires schema governance.
- Shared infrastructure failures may affect multiple products.
- Database migrations require coordination.

---

# Alternatives Considered

## One Supabase project per product

Rejected because:

- Higher operational overhead.
- Duplicate configuration.
- Increased cost.

## Shared schema for every product

Rejected because:

- Poor domain isolation.
- Higher coupling.
- Difficult long-term evolution.

---

# Rationale

A shared Supabase project with isolated schemas provides the best balance between operational simplicity and architectural separation.

The approach supports future platform growth while preserving clear ownership boundaries.

---

# Implementation Notes

Each schema owns:

- Tables
- Views
- Functions
- Policies
- Migrations

Cross-schema access should occur only through explicit interfaces.

Authentication remains a product-level decision.

---

# Related Documents

- product.md
- tech.md
- ADR-001 Modular Monolith
- ADR-004 Platform Services