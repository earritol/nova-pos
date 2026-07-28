# Design Document: Organization Management

## Overview

This document defines the software design for the Organization Management Platform Domain.

Organization Management establishes the tenant boundary of Nova Platform. Every business record in the system belongs to exactly one Organization. This domain owns the Organization aggregate, the Branch entity, and the Organization Configuration value object.

This design translates the approved requirements into an architectural specification suitable for implementation. It reuses every pattern established by CORE-001 and CORE-002 without introducing new architectural mechanisms.

Organization Management is classified as a **Platform Domain** (ADR-008) — it owns business rules shared across all products. It is not a Platform Service.

---

## Architecture

### Architectural Style

Organization Management follows the **Modular Monolith** with **Lightweight DDD** and **Clean Architecture** established by the platform. It is classified as a **Platform Domain** (ADR-008) and exposes exactly one Application Service (ADR-007).

### Layered Architecture

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **UI** | Forms, lists, status display | `apps/pos/`, `apps/admin/` |
| **Application** | Use case orchestration | `packages/shared/domains/organization/application/` |
| **Domain** | Business rules, invariants, validation, lifecycle | `packages/shared/domains/organization/domain/` |
| **Infrastructure** | IndexedDB, Supabase, sync queue | `packages/shared/domains/organization/infrastructure/` |
| **Sync** | Reuses `packages/shared/sync/` | `packages/shared/sync/` |

---

## Architectural Decisions

The following approved ADRs directly influence this design:

| ADR | Influence |
|-----|-----------|
| ADR-001 Modular Monolith | Organization is an independent domain module with explicit boundaries |
| ADR-002 Offline First | All reads resolve from local store; writes persist locally first |
| ADR-003 Clean Architecture | Domain layer contains no infrastructure; dependencies point inward |
| ADR-004 Platform Services | Audit, Synchronization, Configuration are consumed as services |
| ADR-005 Property-Based Testing | Domain invariants are validated through property-based tests |
| ADR-006 Supabase Platform | Remote persistence uses Supabase with RLS for tenant isolation |
| ADR-007 Application Service Pattern | Exactly one Application Service exposes all use cases |
| ADR-008 Platform Domain vs Service | Organization is a Platform Domain, not a Platform Service |

No new architectural patterns are introduced.

---

## Domain Model

### Aggregate: Organization

```
┌──────────────────────────────────────────────────────────────┐
│                  Organization Aggregate                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Organization (Aggregate Root)                         │  │
│  │                                                       │  │
│  │  - id: globally unique identifier                     │  │
│  │  - legalName                                          │  │
│  │  - commercialName                                     │  │
│  │  - taxIdentifier                                      │  │
│  │  - country                                            │  │
│  │  - contactEmail                                       │  │
│  │  - contactPhone                                       │  │
│  │  - address                                            │  │
│  │  - status: Active | Suspended                         │  │
│  │  - configuration: OrganizationConfiguration           │  │
│  │  - createdAt, createdBy, updatedAt, updatedBy         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Branch (Entity)                                       │  │
│  │                                                       │  │
│  │  - id: globally unique identifier                     │  │
│  │  - organizationId: immutable                          │  │
│  │  - name                                               │  │
│  │  - code: unique within Organization                   │  │
│  │  - address                                            │  │
│  │  - phone                                              │  │
│  │  - status: Active | Inactive                          │  │
│  │  - createdAt, createdBy, updatedAt, updatedBy         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Entities

**Organization** — The Aggregate Root. Represents one legal business and one tenant.

**Branch** — A physical operating location. Belongs to exactly one Organization. Owns inventory, sales, cash sessions, and terminals.

### Value Objects

**OrganizationConfiguration** — Groups operational settings (currency, timezone, language, regional preferences). Has no independent identity. Exists only as part of an Organization. Modified exclusively through Organization aggregate behavior (`changeConfiguration`). It is never persisted as an independent object.

**RegionalPreferences** — Nested value object within OrganizationConfiguration containing date format, number format, and tax label.

### Enumerations

**OrganizationStatus** — `active` | `suspended`

**BranchStatus** — `active` | `inactive`

### Relationships

- Organization (1) → Branch (0..*)
- Organization (1) → OrganizationConfiguration (1)
- Branch (1) → Terminal (0..*) — consumed by CORE-002
- Organization (1) → Products (0..*) — consumed by future domains
- Branch (1) → Inventory, Sales, CashSessions — consumed by future domains

### Ownership Boundaries

Organization is the **tenant boundary**. Every record in the platform traces ownership to exactly one Organization. Branch subdivides the Organization for operational isolation of inventory, sales, and terminals.

---

## Aggregate Design

### Why Organization is the Aggregate Root

Organization is the Aggregate Root because:

1. It defines the tenant boundary — every data operation is scoped to one Organization.
2. Branch cannot exist without an Organization.
3. Branch Code uniqueness depends on the parent Organization's scope.
4. Organization Configuration exists only within the Organization's lifecycle.
5. Organization status affects the operational capability of all its Branches.

### Aggregate Behavior

The Organization aggregate exposes behavior rather than raw data access. All mutations to the aggregate and its contained entities occur through explicit aggregate operations:

**Organization-level behavior:**
- `suspend()` — transitions the Organization to Suspended state, blocking transactional operations
- `reactivate()` — transitions the Organization back to Active state, restoring operations
- `changeConfiguration(input)` — modifies the Organization Configuration value object

**Branch-level behavior (coordinated through the Aggregate Root):**
- `createBranch(input)` — creates a new Branch within the Organization, enforcing code uniqueness
- `updateBranch(branchId, input)` — modifies Branch information, enforcing name/code uniqueness
- `deactivateBranch(branchId)` — transitions a Branch to Inactive, guarding against dependencies
- `reactivateBranch(branchId)` — transitions a Branch back to Active

Branch mutations flow through the Organization aggregate because Branch invariants (code uniqueness, lifecycle guards) depend on the Organization's state and scope.

### Aggregate Invariants

1. A Branch cannot exist without an Organization.
2. Branch ownership (organizationId) is immutable after creation.
3. Branch Codes are unique within the Organization.
4. Tax Identifiers are unique within the same country across the platform.
5. Organization identifiers never change.
6. Branch identifiers never change.
7. A Branch cannot be deactivated while it has unresolved operational dependencies.
8. A suspended Organization prevents new transactional operations across all Branches.
9. Organization Configuration belongs exclusively to one Organization and is modified only through aggregate behavior.

### Transaction Boundaries

The aggregate defines the consistency boundary. All invariants must be satisfied before a state change is committed.

Branch is part of the Organization aggregate because its invariants (code uniqueness, lifecycle rules) depend on the parent Organization's state.

Repository implementations may optimize loading strategies (lazy loading, separate queries) while preserving aggregate consistency at the persistence boundary.

### Repository Philosophy

Repositories exist only for Aggregate Roots. Entities contained within an aggregate do not own independent repositories.

Branch does not have its own repository. All Branch persistence is coordinated through the OrganizationRepository. This preserves aggregate invariants because:

1. Branch Code uniqueness requires knowledge of all Branches within the Organization — the aggregate owns this knowledge.
2. Branch lifecycle transitions may depend on Organization status — only the aggregate can validate this.
3. Persisting a Branch independently could violate aggregate consistency if the Organization is concurrently modified.

The OrganizationRepository is responsible for the complete persistence lifecycle of the aggregate, including all Branch entities within it.

---

## Domain Services

No Domain Services are required for this module.

All business rules are expressed as:

- Pure validation functions (input validation)
- Pure lifecycle transition functions (state machine enforcement)
- Aggregate invariant checks (uniqueness, ownership)

These do not require coordination between multiple aggregates and therefore do not justify a Domain Service.

---

## Components and Interfaces

### Domain Types

**Organization (Aggregate Root):**
- id — string (UUID, globally unique)
- legalName — string
- commercialName — string
- taxIdentifier — string
- country — string (ISO 3166-1 alpha-3)
- contactEmail — string | null
- contactPhone — string | null
- address — string | null
- status — OrganizationStatus
- configuration — OrganizationConfiguration
- createdAt — string (ISO 8601)
- createdBy — string (UUID)
- updatedAt — string (ISO 8601)
- updatedBy — string (UUID)

**Branch (Entity):**
- id — string (UUID, globally unique)
- organizationId — string (UUID, immutable)
- name — string
- code — string (unique within Organization)
- address — string
- phone — string
- status — BranchStatus
- createdAt — string (ISO 8601)
- createdBy — string (UUID)
- updatedAt — string (ISO 8601)
- updatedBy — string (UUID)

**OrganizationConfiguration (Value Object):**
- currency — string (ISO 4217)
- timeZone — string (IANA)
- language — string (BCP 47)
- regionalPreferences — RegionalPreferences

**RegionalPreferences (Value Object):**
- dateFormat — string
- numberFormat — string
- taxLabel — string

---

## Application Services

### OrganizationApplicationService

The single public entry point for the Organization domain (ADR-007).

**Responsibilities:**
- Orchestrate all use cases
- Coordinate Repository, AuditService, and SyncQueue
- Enforce TenantContext on every operation
- Return Result<T> for all operations
- Remain thin — no business logic

**Use Cases:**

| Use Case | Input | Output | Requirement |
|----------|-------|--------|-------------|
| createOrganization | CreateOrganizationInput, actorId | Result<Organization> | R1 |
| getOrganization | TenantContext | Result<Organization> | R2 |
| updateOrganization | TenantContext, UpdateOrganizationInput | Result<Organization> | R3 |
| suspendOrganization | TenantContext | Result<Organization> | R9 |
| reactivateOrganization | TenantContext | Result<Organization> | R9 |
| updateConfiguration | TenantContext, ConfigurationInput | Result<Organization> | R10 |
| createBranch | TenantContext, CreateBranchInput | Result<Branch> | R4 |
| getBranch | TenantContext, branchId | Result<Branch> | R5 |
| listBranches | TenantContext | Result<Branch[]> | R5 |
| updateBranch | TenantContext, branchId, UpdateBranchInput | Result<Branch> | R6 |
| deactivateBranch | TenantContext, branchId | Result<Branch> | R7 |
| reactivateBranch | TenantContext, branchId | Result<Branch> | R8 |

**Dependency Injection:**

The Application Service receives all dependencies through constructor injection:

- OrganizationRepository (single aggregate repository)
- AuditService (Platform Service)
- SyncQueue (Platform Service)

---

## Repository Interfaces

### OrganizationRepository (Aggregate Repository)

The OrganizationRepository is the single repository for the Organization aggregate. It is responsible for persisting the entire aggregate, including Branch entities. Branch persistence never bypasses the Aggregate Root.

**Organization operations:**
- `save(org)` — persist a new Organization (including default configuration)
- `findById(orgId)` — retrieve Organization by globally unique ID
- `findByTaxIdentifier(taxId, country)` — for tax identifier uniqueness validation
- `update(org)` — persist Organization changes (including configuration)

**Branch operations (coordinated through the aggregate):**
- `saveBranch(orgId, branch)` — persist a new Branch within the Organization
- `findBranchById(orgId, branchId)` — retrieve a Branch within Organization scope
- `findBranchByCode(orgId, code)` — for code uniqueness validation
- `findAllBranches(orgId)` — list all Branches for an Organization
- `updateBranch(orgId, branch)` — persist Branch changes
- `hasActiveDependencies(orgId, branchId)` — check for operational blockers

**Design rationale:**

All Branch operations receive the `orgId` parameter to enforce that Branch access always occurs within the context of its parent Organization. This guarantees that:

- Tenant isolation is structurally enforced.
- Branch Code uniqueness can be validated within the aggregate scope.
- Branch lifecycle transitions can consider Organization status.

**Persistence expectations:**

- The Domain layer defines only the repository contract.
- The Application layer depends exclusively on this contract.
- The Infrastructure layer owns persistence implementation.
- Repository implementations decide how aggregate persistence is physically performed (single store, multiple stores, optimized queries).
- Domain remains persistence-agnostic.

---

## Domain Events

The following are **conceptual Business Domain Events** that represent meaningful state transitions within the Organization aggregate. They describe what happened in business terms.

The current implementation does not publish asynchronous events. All operations execute synchronously within a single request lifecycle.

When event publication infrastructure is introduced to the platform, future Platform Domains may subscribe to these events for reactive integration (e.g., provisioning workflows, notification triggers, analytics).

| Event | Business Meaning |
|-------|-----------------|
| OrganizationCreated | A new tenant has been established |
| OrganizationUpdated | Organization business information has changed |
| OrganizationSuspended | Organization operations have been temporarily restricted |
| OrganizationReactivated | Organization operations have been restored |
| OrganizationConfigurationUpdated | Operational settings have been modified |
| BranchCreated | A new physical operating location has been registered |
| BranchUpdated | Branch operational information has changed |
| BranchDeactivated | A Branch has been removed from active operations |
| BranchReactivated | A Branch has been restored to active operations |

These events are not infrastructure events. They represent business facts that have occurred within the aggregate.

---

## Validation Strategy

### Application Validation

Performed before invoking domain logic:

- Input field presence and format (non-empty, length constraints)
- Field type validation (valid country code, valid timezone, valid currency)
- Email format validation

Returns `ValidationResult` with field-level errors.

### Domain Validation

Enforced by pure domain functions:

- Tax Identifier uniqueness (via Repository lookup)
- Branch Code uniqueness within Organization (via Repository lookup)
- Lifecycle state transition validity (via state machine functions)
- Ownership immutability (Branch cannot change Organization)
- Operational dependency checks (Branch deactivation guards)

### Separation

Application validation catches malformed input early. Domain validation enforces business invariants that require persistence state. Both return structured errors through `Result<T>`.

---

## Data Models

The domain types are fully defined in the Domain Model and Components and Interfaces sections above. No additional data models are introduced.

---

## Persistence Model

### Responsibilities

**Domain Layer** — defines the OrganizationRepository contract. Has no knowledge of persistence technology, storage format, or sync metadata.

**Application Layer** — depends exclusively on the repository contract. Never accesses persistence directly. Does not know whether data is stored locally, remotely, or both.

**Infrastructure Layer** — owns all persistence implementation. Decides how the aggregate is physically stored, how queries are optimized, how mapping between domain types and storage formats is performed.

**Repository implementations** decide:
- How the Organization aggregate (including Branches) is stored physically.
- Whether to use single or multiple object stores/tables.
- How to manage sync metadata without exposing it to the domain.
- How to enforce uniqueness constraints at the storage level.
- How to map between domain types and persistence representations.

### Offline First

- All reads resolve from the local store.
- All writes persist locally first, then enqueue for remote synchronization.
- Sync metadata (`_syncStatus`, `_localVersion`, `_remoteVersion`, `_lastSyncedAt`) is an infrastructure concern and never appears in domain types.

### Mapping

Infrastructure performs all mapping between domain types and persistence representations. Domain types never contain persistence metadata. Mapping is encapsulated within repository implementations.

---

## Integration with Platform Services

### Audit (Platform Service)

Every state-changing operation produces an audit entry through the shared AuditService interface. Audit entries include entity type, entity ID, action, actor identity, timestamp, and changes. Audit is fire-and-forget — failures do not roll back domain operations.

### Configuration (Platform Service)

Organization Configuration defaults are derived from country-based defaults when an Organization is created. The Configuration Platform Service provides the defaults; the Organization domain owns the configuration instance.

### Synchronization (Platform Service)

After every local write, a sync operation is enqueued through the shared SyncQueue. The Sync Engine processes the queue asynchronously when connectivity is available. Entity types `'organization'` and `'branch'` participate in the existing sync flow.

---

## Public Contracts

The domain exposes use cases exclusively through the OrganizationApplicationService:

- Create, read, update Organization
- Suspend and reactivate Organization
- Update Organization Configuration
- Create, read, update, list Branches
- Deactivate and reactivate Branches

All operations accept a TenantContext and return Result<T>. No REST endpoints or controller implementations are defined at this level.

---

## Error Handling

### Error Strategy

All business failures are represented as `Result<T>` values using `ok()` and `fail()` helpers.

| Error Code | Meaning |
|------------|---------|
| VALIDATION_ERROR | Input fails field-level validation |
| DUPLICATE_TAX_ID | Tax Identifier already registered for country |
| DUPLICATE_BRANCH_CODE | Branch Code already exists in Organization |
| ORG_NOT_FOUND | Organization does not exist |
| BRANCH_NOT_FOUND | Branch does not exist |
| INVALID_STATE_TRANSITION | Lifecycle operation not valid for current status |
| BRANCH_HAS_DEPENDENCIES | Branch cannot be deactivated due to active dependencies |
| ORG_SUSPENDED | Organization is suspended — writes blocked |
| TENANT_VIOLATION | Cross-Organization access attempt |

Exceptions are never thrown for expected business scenarios.

---

## Correctness Properties

### Property 1: Organization creation round-trip

*For any* valid CreateOrganizationInput, creating an Organization and retrieving it SHALL return an Organization with a valid UUID, status `'active'`, all input fields preserved, default configuration, and createdBy matching the actor.

**Validates: Requirements 1.1, 1.3, 1.7, 1.8**

### Property 2: Branch creation round-trip

*For any* valid CreateBranchInput and existing Organization, creating a Branch SHALL return a Branch with a valid UUID, organizationId matching the parent, status `'active'`, and all input fields preserved.

**Validates: Requirements 4.1, 4.3, 4.5**

### Property 3: Validation rejects invalid input without side effects

*For any* Organization or Branch creation input where required fields are empty or invalid, the system SHALL reject without persisting data.

**Validates: Requirements 1.4, 1.5, 4.6**

### Property 4: Tax Identifier uniqueness per country

*For any* two Organizations with the same taxIdentifier and country, the second creation SHALL be rejected.

**Validates: Requirements 1.6**

### Property 5: Branch Code uniqueness per Organization

*For any* two Branches with the same code within one Organization, the second SHALL be rejected.

**Validates: Requirements 4.4**

### Property 6: Organization lifecycle state transitions

*For any* active Organization, suspension SHALL succeed. *For any* suspended Organization, reactivation SHALL succeed. Invalid transitions SHALL be rejected.

**Validates: Requirements 9.1, 9.5**

### Property 7: Branch lifecycle state transitions

*For any* active Branch without dependencies, deactivation SHALL succeed. *For any* inactive Branch, reactivation SHALL succeed. Invalid transitions SHALL be rejected.

**Validates: Requirements 7.1, 8.1, 8.3**

### Property 8: Tenant isolation enforcement

*For any* operation with TenantContext A, data belonging to Organization B (A ≠ B) SHALL NOT be accessible.

**Validates: Requirements 11.1, 11.2, 11.5**

### Property 9: Organization update preserves identity

*For any* Organization update, the id and organizationId SHALL remain unchanged.

**Validates: Requirements 3.5, 3.6**

### Property 10: Branch ownership immutability

*For any* Branch, the organizationId SHALL never change after creation.

**Validates: Requirements 6.3, 6.4**

### Property 11: Audit trail completeness

*For any* mutation operation, an audit entry SHALL be produced.

**Validates: Requirements 13.1**

### Property 12: Data preservation across status changes

*For any* suspended Organization or inactive Branch, all data SHALL remain accessible for read-only queries.

**Validates: Requirements 7.3, 9.4, 9.6**

### Property 13: Configuration country-based defaults

*For any* valid country code during creation, default configuration SHALL be assigned.

**Validates: Requirements 10.3**

---

## Testing Strategy

### Unit Tests

- Validation functions (field presence, length, format)
- Lifecycle state transitions (valid/invalid)
- Configuration defaults factory
- Error code verification

### Property-Based Tests

| Property | Validates |
|----------|-----------|
| Organization creation round-trip | R1 |
| Branch creation round-trip | R4 |
| Validation rejects invalid input | R1, R4 |
| Tax ID uniqueness per country | R1.6 |
| Branch Code uniqueness per Organization | R4.4 |
| Organization update preserves identity | R3.5, R3.6 |
| Branch update preserves ownership | R6.3, R6.4 |
| Lifecycle transitions follow state machine | R7, R8, R9 |
| Tenant isolation enforcement | R11 |
| Audit completeness | R13 |
| Data preservation across status changes | R7, R9 |
| Configuration defaults from country | R10.3 |
| Sync queue retry on failure | R12 |

### Integration Tests

- Offline read/write (IndexedDB)
- Sync flow (enqueue → process → confirm)
- Tenant isolation (RLS enforcement)
- Branch deactivation with dependencies

---

## Sequence Diagrams

### Create Organization

```mermaid
sequenceDiagram
    participant Actor
    participant UI
    participant AppService as OrganizationApplicationService
    participant Validation
    participant Repo as OrganizationRepository
    participant Queue as SyncQueue
    participant Audit as AuditService

    Actor->>UI: Submit organization data
    UI->>AppService: createOrganization(input, actorId)
    AppService->>Validation: validateCreateOrganization(input)
    Validation-->>AppService: ValidationResult
    AppService->>Repo: findByTaxIdentifier(taxId, country)
    Repo-->>AppService: null (no duplicate)
    AppService->>AppService: Build Organization with defaults
    AppService->>Repo: save(organization)
    AppService->>Queue: enqueue(create, organization)
    AppService->>Audit: record(created)
    AppService-->>UI: ok(organization)
```

### Create Branch

```mermaid
sequenceDiagram
    participant Actor
    participant AppService as OrganizationApplicationService
    participant Validation
    participant Repo as OrganizationRepository
    participant Queue as SyncQueue
    participant Audit as AuditService

    Actor->>AppService: createBranch(tenantCtx, input)
    AppService->>Validation: validateCreateBranch(input)
    Validation-->>AppService: ValidationResult
    AppService->>Repo: findBranchByCode(orgId, code)
    Repo-->>AppService: null (no duplicate)
    AppService->>AppService: Build Branch
    AppService->>Repo: saveBranch(orgId, branch)
    AppService->>Queue: enqueue(create, branch)
    AppService->>Audit: record(created)
    AppService-->>Actor: ok(branch)
```

### Suspend Organization

```mermaid
sequenceDiagram
    participant Actor
    participant AppService as OrganizationApplicationService
    participant Lifecycle
    participant Repo as OrganizationRepository
    participant Queue as SyncQueue
    participant Audit as AuditService

    Actor->>AppService: suspendOrganization(tenantCtx)
    AppService->>Repo: findById(orgId)
    Repo-->>AppService: organization
    AppService->>Lifecycle: suspendOrganization(org)
    Lifecycle-->>AppService: ok(suspended org)
    AppService->>Repo: update(suspended org)
    AppService->>Queue: enqueue(update, org)
    AppService->>Audit: record(suspended)
    AppService-->>Actor: ok(suspended org)
```

### Update Organization Configuration

```mermaid
sequenceDiagram
    participant Actor
    participant AppService as OrganizationApplicationService
    participant Repo as OrganizationRepository
    participant Queue as SyncQueue
    participant Audit as AuditService

    Actor->>AppService: updateConfiguration(tenantCtx, input)
    AppService->>Repo: findById(orgId)
    Repo-->>AppService: organization
    AppService->>AppService: Apply configuration changes
    AppService->>Repo: update(updated org)
    AppService->>Queue: enqueue(update, org)
    AppService->>Audit: record(configuration updated)
    AppService-->>Actor: ok(updated org)
```

### Deactivate Branch with Active Dependencies

```mermaid
sequenceDiagram
    participant Actor
    participant AppService as OrganizationApplicationService
    participant Repo as OrganizationRepository
    participant Lifecycle

    Actor->>AppService: deactivateBranch(tenantCtx, branchId)
    AppService->>Repo: findBranchById(orgId, branchId)
    Repo-->>AppService: branch (active)
    AppService->>Repo: hasActiveDependencies(orgId, branchId)
    Repo-->>AppService: true (dependencies exist)
    AppService->>Lifecycle: deactivateBranch(branch, hasDependencies=true)
    Lifecycle-->>AppService: fail(BRANCH_HAS_DEPENDENCIES)
    AppService-->>Actor: Result.fail(BRANCH_HAS_DEPENDENCIES)
```

---

## Future Extension Points

| Future Domain | Integration Point |
|---------------|-------------------|
| Authentication | Consumes Organization as tenant context for login |
| User Management | Users belong to Organization; roles scoped per Organization |
| Subscription Management | Subscription attached to Organization; governs operational limits |
| Product Catalog | Products belong to Organization |
| Inventory | Inventory belongs to Branch |
| Sales | Sales belong to Branch |
| Cash Register | Cash Sessions belong to Branch |
| Pricing | Pricing rules belong to Organization |
| Customer Management | Customers belong to Organization |
| Loyalty | Programs scoped to Organization |
| Reporting | Reports scoped to Organization and Branch |

All future domains consume Organization and Branch through their IDs. They never redefine ownership rules.

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Incorrect tenant isolation | Data leakage between organizations | RLS at database level + application-level TenantContext enforcement |
| Offline sync conflicts on Branch Code | Duplicate codes detected at sync time | Optimistic local creation; conflict flagged during sync |
| Future domains duplicating ownership rules | Inconsistent business logic | Ownership rules centralized in this domain; consumed via IDs only |
| Configuration drift during offline | Multiple devices change config simultaneously | Last-write-wins with version comparison; conflict flagged for resolution |
| Branch deactivation with hidden dependencies | Operational data loss | hasActiveDependencies check before deactivation; extensible guard mechanism |
