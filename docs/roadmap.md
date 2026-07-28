# Nova Platform Roadmap
Version: 1.0
Status: Living Document

---

# Purpose

This roadmap defines the planned evolution of Nova Platform through incremental CORE modules.

Each CORE introduces a cohesive business capability while preserving the architectural principles established by the platform.

The roadmap provides visibility into platform priorities, dependencies, and long-term direction.

---

# Roadmap Principles

The platform evolves incrementally.

Each CORE should:

- Deliver a complete business capability.
- Reuse existing Platform Domains and Platform Services.
- Avoid architectural redesign.
- Preserve backward compatibility whenever possible.
- Leave the platform in a deployable state.

A CORE should never implement unrelated functionality.

---

# Platform Progress

| CORE | Name | Status |
|-------|------|--------|
| CORE-001 | Foundation | ✅ Completed |
| CORE-002 | Terminal Management | ✅ Completed |
| CORE-003 | Organization Management | 📋 Planned |
| CORE-004 | Authentication | 📋 Planned |
| CORE-005 | Product Catalog | 📋 Planned |
| CORE-006 | Inventory | 📋 Planned |
| CORE-007 | Pricing | 📋 Planned |
| CORE-008 | Sales | 📋 Planned |
| CORE-009 | Cash Sessions | 📋 Planned |
| CORE-010 | Customers | 📋 Planned |
| CORE-011 | Reporting | 📋 Planned |
| CORE-012 | Notifications | 📋 Planned |

---

# CORE-001 Foundation

Status

Completed

Purpose

Establish the architectural foundation of Nova Platform.

Capabilities delivered

- Clean Architecture
- Modular Monolith
- Offline First
- Result<T>
- Sync Engine
- Audit
- IndexedDB
- Repository Pattern
- Testing Infrastructure

Dependencies

None

---

# CORE-002 Terminal Management

Status

Completed

Purpose

Manage POS terminals and authorized devices.

Capabilities delivered

- Terminal lifecycle
- Device registration
- Configuration
- Offline persistence
- Synchronization
- Audit integration

Dependencies

- CORE-001

---

# CORE-003 Organization Management

Status

Planned

Purpose

Manage organizations and branches.

Expected capabilities

- Organization
- Branch
- Organization configuration
- Tenant hierarchy

Depends on

- CORE-001

Enables

- Product Catalog
- Inventory
- Sales
- Customers
- Reporting

---

# CORE-004 Authentication

Status

Planned

Purpose

Provide authentication mechanisms for platform products.

Nova POS

- Local authentication

Nova GanaMás

- Email OTP

Future

- RBAC
- Roles
- Permissions

Depends on

- CORE-003

---

# CORE-005 Product Catalog

Purpose

Manage products and product definitions.

Expected capabilities

- Categories
- Products
- Units
- Tax configuration
- Active/inactive products

Depends on

- Organization
- Authentication

---

# CORE-006 Inventory

Purpose

Inventory management.

Expected capabilities

- Stock
- Inventory adjustments
- Movements
- Availability

Depends on

- Product Catalog

---

# CORE-007 Pricing

Purpose

Pricing engine.

Expected capabilities

- Price lists
- Promotions
- Taxes
- Discounts

Depends on

- Product Catalog

---

# CORE-008 Sales

Purpose

Sales workflow.

Expected capabilities

- Cart
- Sale lifecycle
- Totals
- Taxes
- Receipts

Depends on

- Inventory
- Pricing
- Terminal

---

# CORE-009 Cash Sessions

Purpose

Cash register management.

Expected capabilities

- Open shift
- Close shift
- Cash movements
- Cash balance

Depends on

- Sales
- Terminal

---

# CORE-010 Customers

Purpose

Customer management.

Expected capabilities

- Customer profile
- Contact information
- Customer history

Depends on

- Organization

---

# CORE-011 Reporting

Purpose

Operational reporting.

Expected capabilities

- Sales reports
- Inventory reports
- Cash reports

Depends on

All operational modules.

---

# CORE-012 Notifications

Purpose

Platform notifications.

Expected capabilities

- Push notifications
- Email
- Internal notifications

Depends on

Platform Services

---

# Future Evolution

The roadmap is expected to evolve.

New CORE modules may be introduced when:

- A new business capability is identified.
- Existing modules would become overloaded.
- A reusable platform capability emerges.

Completed COREs should remain stable.

Major architectural changes require an approved ADR.

---

# Current Focus

Current platform priority:

➡ CORE-003 Organization Management

No implementation should begin until:

- Requirements are approved.
- Design is approved.
- Tasks are approved.
- Architecture review is complete.

---

# References

- Platform Architecture
- Context Map
- Platform Services
- Approved ADRs
- Project Steering