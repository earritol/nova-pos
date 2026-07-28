# CORE-003 — Organization Management
# Domain Discovery

Version: 1.0

Status: Draft

---

# Purpose

This document explores the Organization Management domain before formal requirements are written.

Its purpose is to establish a shared understanding of the business concepts, ownership boundaries, responsibilities, and relationships that define organizations within Nova Platform.

This document is exploratory.

It is not an implementation specification.

No implementation should begin based solely on this document.

---

# Why Organization Management?

Organization Management is a foundational Platform Domain.

Almost every business capability within Nova Platform depends on organizations and their branch structure.

Current and future consumers include:

- Authentication
- Product Catalog
- Inventory
- Pricing
- Sales
- Cash Sessions
- Customers
- Reporting
- Loyalty

Building this domain first establishes a consistent tenant model across the entire platform.

---

# Business Goal

Provide a reusable Platform Domain capable of managing organizations and their branch hierarchy while remaining independent from product-specific business rules.

The Organization domain should become the authoritative source of organizational ownership across Nova Platform.

---

# Platform Position

Organization Management is a Platform Domain.

It owns shared business rules.

It is not a Platform Service.

```
Nova Platform

├── Platform Domains
│
│   └── Organization Management
│
├── Platform Services
│
│   ├── Synchronization
│   ├── Audit
│   └── Configuration
│
└── Products
    ├── Nova POS
    └── Nova GanaMás
```

---

# Domain Vision

Organizations define tenant ownership.

Branches define operational locations.

Products consume organizational information but never own it.

The Organization domain should remain stable as new products are added to the platform.

---

# Organizational Model

The expected organizational hierarchy is:

```
Organization

├── Branch

│     ├── Terminal
│     ├── Inventory
│     ├── Cash Sessions
│     └── Sales

└── Organization Settings
```

Organization owns branches.

Branches become the operational context for business activities.

Products belong to Organizations.

Operational processes belong to Branches.

---

# Candidate Domain Entities

## Organization

Represents a legal business entity.

Potential responsibilities:

- Identity
- Legal information
- Tenant ownership
- Lifecycle
- Branch ownership
- Default settings

---

## Branch

Represents a physical or logical operating location.

Potential responsibilities:

- Operational identity
- Address
- Contact information
- Operational status
- Local configuration

---

## Organization Settings

Represents organization-wide defaults.

Examples include:

- Currency
- Locale
- Time zone
- Date format
- Fiscal defaults

Settings affect products without containing product-specific configuration.

---

# Candidate Value Objects

Potential Value Objects include:

- OrganizationName
- CommercialName
- TaxIdentifier
- Address
- EmailAddress
- PhoneNumber
- Currency
- Locale
- TimeZone

Final selection belongs to the Design phase.

---

# Ownership Matrix

| Entity | Owned By |
|----------|----------|
| Organization | Organization Domain |
| Branch | Organization Domain |
| Organization Settings | Organization Domain |
| Terminal | Branch |
| Product | Organization |
| Inventory | Branch |
| Customer | Organization |
| Sale | Branch |
| Cash Session | Branch |

This matrix defines business ownership only.

Implementation details belong to future CORE modules.

---

# Identity Model

## Organization

Candidate attributes:

- Id
- Legal Name
- Commercial Name
- Tax Identifier
- Status

---

## Branch

Candidate attributes:

- Id
- Organization Id
- Branch Code
- Name
- Status

Additional information will be defined during Requirements.

---

# Candidate Relationships

```
Organization

    owns

        │

        ▼

Branch

Organization

    owns

        │

        ▼

Organization Settings
```

Organizations own Branches.

Organizations own Organization Settings.

Branches never exist independently.

---

# Inheritance Rules

Organization defines platform defaults.

Possible inherited configuration includes:

- Currency
- Locale
- Time Zone
- Fiscal configuration

Branches may override only explicitly supported settings.

Products consume configuration through organizational context.

---

# Lifecycle Hypotheses

These states are hypotheses and require validation during Requirements.

## Organization

```
ACTIVE

↓

SUSPENDED

↓

ARCHIVED
```

---

## Branch

```
ACTIVE

↓

INACTIVE

↓

ARCHIVED
```

Deletion policies remain undefined.

---

# Domain Ownership

Organization Management owns:

- Organizations
- Branches
- Organization Settings
- Organizational hierarchy
- Organizational lifecycle

Organization Management does NOT own:

- Users
- Authentication
- Roles
- Permissions
- Products
- Inventory
- Pricing
- Sales
- Customers
- Loyalty
- Reporting

Those belong to their respective domains.

---

# Expected Consumers

Future CORE modules expected to consume this domain:

- Authentication
- Product Catalog
- Inventory
- Pricing
- Sales
- Cash Sessions
- Customers
- Reporting
- Loyalty

The Organization Domain should expose stable contracts for these consumers.

---

# Initial Business Assumptions

The following assumptions should be validated during Requirements.

1.

Every Organization represents exactly one tenant.

---

2.

Every Branch belongs to exactly one Organization.

---

3.

A Branch cannot belong to multiple Organizations.

---

4.

Organizations may own multiple Branches.

---

5.

Products consume Organizations.

Products never own Organizations.

---

6.

Platform Services may reference Organizations.

Platform Services never manage Organizations.

---

# Candidate Domain Invariants

The following invariants are expected to remain true.

- Every Organization has a unique identifier.
- Every Branch belongs to exactly one Organization.
- Branches cannot exist without an Organization.
- Organization Settings belong to exactly one Organization.
- Organization is the tenant boundary.
- Branch ownership cannot be ambiguous.
- Product Domains must never redefine organizational ownership.

These invariants should later become Correctness Properties.

---

# Ubiquitous Language

## Organization

The legal business entity that owns business data.

---

## Branch

An operational business location belonging to an Organization.

---

## Tenant

An Organization acting as the ownership boundary for all business information.

---

## Organization Settings

Global defaults shared across products.

---

## Platform Domain

A reusable business capability shared across multiple products.

---

## Platform Service

Reusable technical infrastructure that contains no business rules.

---

# Out of Scope

The following capabilities are intentionally excluded.

- Authentication
- Authorization
- Users
- Roles
- Permissions
- Product Catalog
- Inventory
- Pricing
- Sales
- Customers
- Loyalty
- Reporting
- Notifications

These capabilities belong to future CORE modules.

---

# Architectural Considerations

Organization Management should:

- Preserve Modular Monolith.
- Preserve Lightweight DDD.
- Preserve Clean Architecture.
- Preserve Offline First.
- Preserve Multi-Tenant.
- Reuse existing Platform Services.
- Avoid product-specific business rules.
- Expose stable contracts for future CORE modules.

---

# Open Questions

The following questions must be answered before Requirements are finalized.

## Organization

- Which attributes are mandatory?
- Can Organizations be archived?
- Can Organizations be restored?
- Are Organizations ever physically deleted?

---

## Branch

- Is a primary Branch required?
- Can Branches be archived?
- Can Branches change Organization?
- Can Branch codes be reused?

---

## Configuration

- Which settings belong to Organization?
- Which settings belong to Branch?
- Which settings belong to Products?

---

## Localization

- Is currency defined at Organization level?
- Can Branches override currency?
- Is timezone inherited?
- Which locale is inherited?

---

## Fiscal Information

- Is tax information organization-wide?
- Can Branches override fiscal information?

---

## Future Integration

- Which APIs should this domain expose?
- Which future modules require direct integration?
- Which invariants should become Property-Based Tests?

---

# Success Criteria

Discovery is complete when:

- Domain ownership is unambiguous.
- Organizational boundaries are understood.
- Product boundaries are understood.
- Consumers are identified.
- Candidate invariants are documented.
- Open questions are resolved.
- The domain is ready for Requirements.

---

# Next Step

After Discovery Review approval:

1. Requirements
2. Architecture Review
3. Design
4. Architecture Review
5. Tasks
6. Architecture Review
7. Incremental Implementation

No implementation should begin until Discovery has been reviewed and approved.