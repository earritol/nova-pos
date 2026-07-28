# Nova Platform Context Map
Version: 1.0
Status: Approved

---

# 1. Purpose

This document defines the high-level domain boundaries of Nova Platform.

It identifies ownership of business capabilities, relationships between domains, and the allowed interactions between Platform Services and Products.

The Context Map is the authoritative reference for deciding where new functionality belongs.

---

# 2. Domain Classification

Nova Platform is organized into three categories of domains.

```
Nova Platform

├── Platform Domains
├── Product Domains
└── Future Domains
```

---

# 3. Platform Domains

Platform Domains provide reusable capabilities shared by multiple products.

They own technical or cross-product business capabilities.

Platform Domains never implement product-specific business rules.

Current Platform Domains:

- Organization
- Synchronization
- Audit
- Configuration

Future Platform Domains:

- Notifications
- Feature Flags
- Licensing
- Observability

---

# 4. Product Domains

Each product owns its own business rules.

Products may reuse Platform Services but never share product business logic.

```
Nova POS

├── Terminal Management
├── Product Catalog
├── Inventory
├── Sales
├── Pricing
├── Cash Sessions
├── Customers
├── Reporting
└── Authentication
```

```
Nova GanaMás

├── Rewards
├── Visits
├── Campaigns
├── Customer Rewards
└── Authentication
```

Future products own their own domains.

---

# 5. Domain Ownership

Every business capability has exactly one owner.

Ownership determines:

- Business rules
- Validation
- Lifecycle
- State transitions
- Repository contracts

Other domains may consume published interfaces but never modify another domain's business rules.

---

# 6. Context Relationships

Current relationships:

```
                 Platform

      Organization
             │
             │
      Synchronization
             │
             │
           Audit
             │
             │
      Configuration
             │
─────────────┼──────────────────
             │
      Nova POS
             │
 ┌───────────┼──────────────┐
 │           │              │
Terminal   Inventory      Sales
 │           │              │
 │           └──────┐       │
 │                  │       │
 └──────────────► Customers │
                    │        │
                    └────────┘

             │

      Nova GanaMás
             │
      Rewards
      Campaigns
      Visits
```

Platform Domains may be consumed by any product.

Products should not directly depend on each other.

---

# 7. Dependency Rules

Allowed:

Platform Domain
→ Product Domain

Product Domain
→ Platform Domain

Presentation
→ Application

Application
→ Domain

Infrastructure
→ Domain

Forbidden:

Product Domain
→ Another Product Domain implementation

Platform Domain
→ Product Domain

Domain
→ Infrastructure

Domain
→ UI

Application
→ UI

---

# 8. Shared Platform Services

The following capabilities are considered platform-wide.

## Organization

Responsible for:

- Organizations
- Branches
- Tenant boundaries

Does not contain POS business rules.

---

## Synchronization

Responsible for:

- Queue processing
- Retry
- Recovery
- Conflict detection

Does not contain business logic.

---

## Audit

Responsible for:

- Change history
- Actor tracking
- Entity tracking

Audit never validates business rules.

---

## Configuration

Responsible for:

- Shared configuration
- Feature toggles
- Platform defaults

Configuration never owns business workflows.

---

# 9. Product Independence

Products remain deployable independently.

Products may share:

- Infrastructure
- Platform Services
- Libraries
- UI Components

Products must not share:

- Business rules
- Aggregates
- Domain Services
- Product-specific repositories

---

# 10. Integration Strategy

Cross-domain communication should occur through:

- Repository contracts
- Published interfaces
- Application Services
- Domain events (future)

Direct access to another domain's persistence is prohibited.

---

# 11. Future Evolution

New Platform Domains should only be created when:

- Multiple products require the capability.
- The capability is not product-specific.
- The capability has long-term reuse potential.

Otherwise, functionality belongs to the owning Product Domain.

---

# 12. Current Platform Status

Platform Domains

✅ Organization
✅ Synchronization
✅ Audit
✅ Configuration

Nova POS

✅ Terminal Management
🚧 Product Catalog
🚧 Inventory
🚧 Sales
🚧 Pricing
🚧 Cash Sessions
🚧 Customers
🚧 Reporting

Nova GanaMás

🚧 Rewards
🚧 Campaigns
🚧 Visits

---

# 13. Decision Guidelines

When introducing new functionality, ask the following questions:

1. Which domain owns the business rules?

2. Can an existing domain own this capability?

3. Is the functionality reusable across products?

4. Is a new Platform Domain justified?

5. Is a new Product Domain required?

6. Does the proposal preserve architectural boundaries?

If ownership is unclear, implementation should stop until the domain boundary is clarified.

---

# 14. References

Platform Architecture

Steering

Approved ADRs

Current CORE Specifications

This Context Map should remain synchronized with the Platform Architecture document and all approved Architecture Decision Records.