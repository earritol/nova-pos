# Implementation Plan: Organization Management

## Overview

This plan implements the Organization Management Platform Domain — the tenant boundary of Nova Platform. Implementation follows the approved design document and reuses every architectural pattern established by CORE-001 and CORE-002.

Work is organized into five implementation waves. Each wave produces a coherent milestone that leaves the repository in a stable, compilable, and testable state.

## Tasks

- [ ] 1. Wave 1 — Domain Foundation
  - [ ] 1.1 Create Organization module directory structure
    - **Description:** Create the folder hierarchy for the organization domain module following the platform structure convention.
    - **Dependencies:** None
    - **Acceptance Criteria:** Directories exist: `domain/`, `application/`, `infrastructure/`, `__tests__/`, `__integration__/`
    - **Deliverable:** Compilable empty module structure

  - [ ] 1.2 Implement Organization Aggregate Root
    - **Description:** Create the Organization interface with all fields defined in the design: id, legalName, commercialName, taxIdentifier, country, contactEmail, contactPhone, address, status, configuration, createdAt, createdBy, updatedAt, updatedBy. Implement OrganizationStatus enumeration.
    - **Dependencies:** 1.1
    - **Acceptance Criteria:** Organization type is exported and compiles with strict typing
    - **Deliverable:** `domain/organization.ts`

  - [ ] 1.3 Implement OrganizationConfiguration Value Object
    - **Description:** Create the OrganizationConfiguration interface (currency, timeZone, language, regionalPreferences) and RegionalPreferences interface. Implement country-based defaults factory function.
    - **Dependencies:** 1.1
    - **Acceptance Criteria:** Value Object is immutable. Factory produces correct defaults for MEX, USA, COL.
    - **Deliverable:** `domain/organization-configuration.ts`

  - [ ] 1.4 Implement Branch Entity
    - **Description:** Create the Branch interface with all fields: id, organizationId, name, code, address, phone, status, createdAt, createdBy, updatedAt, updatedBy. Implement BranchStatus enumeration.
    - **Dependencies:** 1.1
    - **Acceptance Criteria:** Branch type compiles. organizationId is documented as immutable.
    - **Deliverable:** `domain/branch.ts`

  - [ ] 1.5 Implement Organization validation functions
    - **Description:** Create validateCreateOrganization and validateUpdateOrganization. Validate: legalName, commercialName, taxIdentifier (non-empty, length), country (valid code), currency, timeZone, language, contactEmail (format if provided).
    - **Dependencies:** 1.2, 1.3
    - **Acceptance Criteria:** Validation returns ValidationResult with field-level errors. Pure functions with no side effects.
    - **Deliverable:** `domain/validation/organization-validation.ts`

  - [ ] 1.6 Implement Branch validation functions
    - **Description:** Create validateCreateBranch and validateUpdateBranch. Validate: name (non-empty, length), code (non-empty, max 50), address (non-empty), phone (non-empty).
    - **Dependencies:** 1.4
    - **Acceptance Criteria:** Validation returns ValidationResult. Pure functions.
    - **Deliverable:** `domain/validation/branch-validation.ts`

  - [ ] 1.7 Implement Organization lifecycle state transitions
    - **Description:** Create suspendOrganization and reactivateOrganization pure functions. Only active→suspended and suspended→active are valid. Return Result<Organization> using ok/fail helpers.
    - **Dependencies:** 1.2
    - **Acceptance Criteria:** Invalid transitions return INVALID_STATE_TRANSITION error.
    - **Deliverable:** `domain/lifecycle/organization-lifecycle.ts`

  - [ ] 1.8 Implement Branch lifecycle state transitions
    - **Description:** Create deactivateBranch(branch, hasDependencies) and reactivateBranch pure functions. Only active→inactive (when no dependencies) and inactive→active are valid.
    - **Dependencies:** 1.4
    - **Acceptance Criteria:** Returns BRANCH_HAS_DEPENDENCIES when blocked. Returns INVALID_STATE_TRANSITION for invalid transitions.
    - **Deliverable:** `domain/lifecycle/branch-lifecycle.ts`

  - [ ] 1.9 Write unit tests for validation functions
    - **Description:** Test all validation scenarios: valid inputs accepted, invalid inputs rejected with correct field errors, length boundaries, format validation.
    - **Dependencies:** 1.5, 1.6
    - **Acceptance Criteria:** All validation behaviors covered. Tests pass.
    - **Deliverable:** `__tests__/validation.unit.test.ts`

  - [ ] 1.10 Write unit tests for lifecycle functions
    - **Description:** Test all state transitions: valid transitions succeed, invalid transitions rejected, dependency guard works.
    - **Dependencies:** 1.7, 1.8
    - **Acceptance Criteria:** Every transition path tested. Tests pass.
    - **Deliverable:** `__tests__/lifecycle.unit.test.ts`

  - [ ] 1.11 Write property-based tests for domain invariants
    - **Description:** Implement Properties 1-7 and 9-13 from design.md using fast-check. Minimum 100 runs per property. Create arbitraries for Organization and Branch inputs.
    - **Dependencies:** 1.5, 1.6, 1.7, 1.8
    - **Acceptance Criteria:** All 13 correctness properties pass with numRuns: 100.
    - **Deliverable:** `__tests__/organization.properties.test.ts`, `__tests__/branch.properties.test.ts`, `__tests__/arbitraries.ts`

  - [ ] 1.12 Export domain module public API
    - **Description:** Create domain/index.ts exporting all types, validation functions, lifecycle functions, and configuration factory.
    - **Dependencies:** 1.2-1.8
    - **Acceptance Criteria:** All domain types accessible through single import. TypeScript compiles.
    - **Deliverable:** `domain/index.ts`

- [ ] 2. Wave 2 — Application Layer
  - [ ] 2.1 Define OrganizationRepository contract
    - **Description:** Create the single aggregate repository interface per design: save, findById, findByTaxIdentifier, update (Organization), saveBranch, findBranchById, findBranchByCode, findAllBranches, updateBranch, hasActiveDependencies (Branch).
    - **Dependencies:** 1.12
    - **Acceptance Criteria:** Interface is technology-agnostic. No infrastructure imports.
    - **Deliverable:** `domain/repositories/organization-repository.ts`

  - [ ] 2.2 Implement CreateOrganization use case
    - **Description:** Orchestrate: validate → check tax ID uniqueness → build Organization with config defaults → persist → enqueue sync → audit. Accept CreateOrganizationInput and actorId, return Result<Organization>.
    - **Dependencies:** 2.1
    - **Acceptance Criteria:** Correctly rejects duplicates. Assigns active status. Creates default config.
    - **Deliverable:** `application/use-cases/create-organization.ts`

  - [ ] 2.3 Implement GetOrganization use case
    - **Description:** Read Organization from repository, enforce TenantContext. Return ORG_NOT_FOUND if absent.
    - **Dependencies:** 2.1
    - **Acceptance Criteria:** Returns Organization or error. Tenant isolation enforced.
    - **Deliverable:** `application/use-cases/get-organization.ts`

  - [ ] 2.4 Implement UpdateOrganization use case
    - **Description:** Validate → load → apply changes → persist → enqueue sync → audit. Record modification timestamp and actor.
    - **Dependencies:** 2.1
    - **Acceptance Criteria:** Preserves identity. Rejects invalid input. Records audit.
    - **Deliverable:** `application/use-cases/update-organization.ts`

  - [ ] 2.5 Implement SuspendOrganization use case
    - **Description:** Load → invoke lifecycle transition → persist → enqueue sync → audit.
    - **Dependencies:** 2.1, 1.7
    - **Acceptance Criteria:** Only active organizations can be suspended. Audit recorded.
    - **Deliverable:** `application/use-cases/suspend-organization.ts`

  - [ ] 2.6 Implement ReactivateOrganization use case
    - **Description:** Load → invoke lifecycle transition → persist → enqueue sync → audit.
    - **Dependencies:** 2.1, 1.7
    - **Acceptance Criteria:** Only suspended organizations can be reactivated. Audit recorded.
    - **Deliverable:** `application/use-cases/reactivate-organization.ts`

  - [ ] 2.7 Implement UpdateConfiguration use case
    - **Description:** Load → apply configuration changes through aggregate behavior → persist → enqueue sync → audit.
    - **Dependencies:** 2.1
    - **Acceptance Criteria:** Configuration modified. Audit recorded. Value Object immutability preserved.
    - **Deliverable:** `application/use-cases/update-configuration.ts`

  - [ ] 2.8 Implement CreateBranch use case
    - **Description:** Validate → check code uniqueness → build Branch → persist via aggregate repository → enqueue sync → audit.
    - **Dependencies:** 2.1
    - **Acceptance Criteria:** Rejects duplicate codes. Branch belongs to Organization. Status is active.
    - **Deliverable:** `application/use-cases/create-branch.ts`

  - [ ] 2.9 Implement GetBranch and ListBranches use cases
    - **Description:** Read Branch(es) from repository via aggregate repository. Enforce TenantContext.
    - **Dependencies:** 2.1
    - **Acceptance Criteria:** Tenant isolation enforced. Returns empty collection when no branches exist.
    - **Deliverable:** `application/use-cases/get-branch.ts`, `application/use-cases/list-branches.ts`

  - [ ] 2.10 Implement UpdateBranch use case
    - **Description:** Validate → check name uniqueness → load → apply → persist → enqueue sync → audit.
    - **Dependencies:** 2.1
    - **Acceptance Criteria:** Rejects duplicate names. Ownership immutable. Identity preserved.
    - **Deliverable:** `application/use-cases/update-branch.ts`

  - [ ] 2.11 Implement DeactivateBranch use case
    - **Description:** Load → check dependencies → invoke lifecycle → persist → enqueue sync → audit.
    - **Dependencies:** 2.1, 1.8
    - **Acceptance Criteria:** Rejects when dependencies exist. Audit recorded. Historical data preserved.
    - **Deliverable:** `application/use-cases/deactivate-branch.ts`

  - [ ] 2.12 Implement ReactivateBranch use case
    - **Description:** Load → invoke lifecycle → persist → enqueue sync → audit.
    - **Dependencies:** 2.1, 1.8
    - **Acceptance Criteria:** Only inactive branches reactivated. Already-active rejected.
    - **Deliverable:** `application/use-cases/reactivate-branch.ts`

  - [ ] 2.13 Implement OrganizationApplicationService facade
    - **Description:** Single public entry point (ADR-007). Wire all use cases. Constructor injection of OrganizationRepository, AuditService, SyncQueue.
    - **Dependencies:** 2.2-2.12
    - **Acceptance Criteria:** Exposes all 12 use cases. Thin orchestration only. No business logic.
    - **Deliverable:** `application/organization-application-service.ts`

  - [ ] 2.14 Write application layer tests
    - **Description:** Test all use cases with in-memory repository fakes. Verify orchestration, error propagation, audit recording, sync enqueueing.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** Every use case tested. Property tests for round-trips (Properties 1, 2, 8, 9, 10, 11).
    - **Deliverable:** `__tests__/use-case-roundtrip.properties.test.ts`, `__tests__/tenant-isolation.properties.test.ts`, `__tests__/audit.properties.test.ts`

- [ ] 3. Wave 3 — Infrastructure
  - [ ] 3.1 Extend shared database with Organization stores
    - **Description:** Update database.ts to include `organizations` and `branches` object stores with appropriate indexes (by_org, by_code, by_sync_status). Increment DB_VERSION.
    - **Dependencies:** 2.1
    - **Acceptance Criteria:** Database opens without error. Indexes available.
    - **Deliverable:** Updated `infrastructure/local/database.ts`

  - [ ] 3.2 Implement IndexedDB OrganizationRepository (local)
    - **Description:** Implement the full OrganizationRepository contract using IndexedDB via shared getDatabase(). Include sync metadata management. Use indexes for efficient queries.
    - **Dependencies:** 3.1
    - **Acceptance Criteria:** All repository methods work offline. Sync metadata managed correctly.
    - **Deliverable:** `infrastructure/local/organization-local-store.ts`

  - [ ] 3.3 Implement Supabase OrganizationRepository (remote)
    - **Description:** Implement OrganizationRepository using injected SupabaseClient. Handle unique constraints. Map between domain types and database rows.
    - **Dependencies:** 2.1
    - **Acceptance Criteria:** CRUD operations work. Tenant isolation via RLS. Mapping encapsulated.
    - **Deliverable:** `infrastructure/remote/organization-remote-repository.ts`

  - [ ] 3.4 Integrate with Sync Queue
    - **Description:** Ensure all mutation use cases enqueue sync operations with entity types 'organization' and 'branch'. Verify compatibility with existing SyncEngine.
    - **Dependencies:** 3.2
    - **Acceptance Criteria:** Every mutation enqueues. Queue operations use correct entity types.
    - **Deliverable:** Updated use cases (sync enqueue calls)

  - [ ] 3.5 Integrate with Audit Service
    - **Description:** Ensure all mutation use cases record audit entries via shared AuditService. Verify entity types 'organization', 'branch', 'organization_configuration'.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** Every state-changing operation produces audit entry. Fire-and-forget pattern preserved.
    - **Deliverable:** Updated use cases (audit calls)

  - [ ] 3.6 Write infrastructure integration tests
    - **Description:** Test offline read/write, sync flow, tenant isolation at repository level.
    - **Dependencies:** 3.2, 3.3
    - **Acceptance Criteria:** Offline scenarios pass. Sync operations enqueue correctly. Tenant isolation enforced.
    - **Deliverable:** `__integration__/offline.integration.test.ts`, `__integration__/sync.integration.test.ts`, `__integration__/rls.integration.test.ts`

- [ ] 4. Wave 4 — Presentation
  - [ ] 4.1 Implement Organization creation form (Admin)
    - **Description:** Client component with form fields for all required Organization data. Client-side validation. Calls OrganizationApplicationService.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** Form validates input. Displays field errors. Submits to Application Service.
    - **Deliverable:** Admin page and form component

  - [ ] 4.2 Implement Organization view screen (Admin/POS)
    - **Description:** Display complete Organization profile including configuration. Show sync status indicator. Works offline.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** All Organization fields displayed. Offline accessible.
    - **Deliverable:** Organization view component

  - [ ] 4.3 Implement Organization edit form (Admin)
    - **Description:** Edit form for updatable Organization fields. Client-side validation. Display errors.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** Validates input. Displays uniqueness errors. Submits update.
    - **Deliverable:** Organization edit form component

  - [ ] 4.4 Implement Organization Configuration form (Admin)
    - **Description:** Form for currency, timezone, language, regional preferences. Include restore defaults button.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** Configuration editable. Restore defaults works.
    - **Deliverable:** Configuration form component

  - [ ] 4.5 Implement Organization lifecycle actions (Admin)
    - **Description:** Suspend/reactivate with confirmation dialogs. Display current status prominently.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** Confirmation required. Status updates reflected.
    - **Deliverable:** Lifecycle actions component

  - [ ] 4.6 Implement Branch list view (Admin/POS)
    - **Description:** Table showing all branches with name, code, address, phone, status. Works offline.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** Lists all branches. Offline accessible.
    - **Deliverable:** Branch list component

  - [ ] 4.7 Implement Branch creation form (Admin)
    - **Description:** Form with name, code, address, phone. Client-side validation. Display code uniqueness errors.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** Validates input. Rejects duplicate codes.
    - **Deliverable:** Branch creation form component

  - [ ] 4.8 Implement Branch edit form (Admin)
    - **Description:** Edit form for name, address, phone. Validate name uniqueness.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** Validates input. Displays errors.
    - **Deliverable:** Branch edit form component

  - [ ] 4.9 Implement Branch lifecycle actions (Admin)
    - **Description:** Deactivate/reactivate with confirmation. Display dependency errors when deactivation blocked.
    - **Dependencies:** 2.13
    - **Acceptance Criteria:** Confirmation dialog. Dependency errors shown.
    - **Deliverable:** Branch lifecycle actions component

- [ ] 5. Wave 5 — Quality and Documentation
  - [ ] 5.1 Write remaining property-based tests
    - **Description:** Ensure all 13 correctness properties from design.md have corresponding tests. Verify tenant isolation, audit completeness, data preservation properties.
    - **Dependencies:** 3.6
    - **Acceptance Criteria:** All properties pass with numRuns: 100.
    - **Deliverable:** Complete property test suite

  - [ ] 5.2 Write edge case unit tests
    - **Description:** Test boundary conditions: maximum field lengths, empty optional fields, concurrent status transitions, configuration with all defaults.
    - **Dependencies:** 2.14
    - **Acceptance Criteria:** Edge cases covered. No unexpected failures.
    - **Deliverable:** Additional unit tests

  - [ ] 5.3 Review and update module exports
    - **Description:** Verify domain/index.ts, application/index.ts, infrastructure/index.ts export all public types. Remove dead code.
    - **Dependencies:** 4.9
    - **Acceptance Criteria:** All public APIs accessible. No unused exports.
    - **Deliverable:** Updated index files

  - [ ] 5.4 Verify architectural compliance
    - **Description:** Confirm Domain has zero infrastructure imports. Application depends only on Domain. Infrastructure implements Domain contracts. No circular dependencies.
    - **Dependencies:** 5.3
    - **Acceptance Criteria:** Dependency direction verified. No violations.
    - **Deliverable:** Architecture verification report

  - [ ] 5.5 Final validation checkpoint
    - **Description:** Run complete test suite. Verify TypeScript compiles. Verify all CORE-001 and CORE-002 tests remain green.
    - **Dependencies:** 5.1-5.4
    - **Acceptance Criteria:** Zero test failures. Zero compilation errors. Zero architectural violations.
    - **Deliverable:** Green test suite

## Notes

- All tasks are mandatory.
- Property-Based Tests validate the Correctness Properties defined in design.md.
- Unit Tests validate specific examples and edge cases.
- Integration Tests validate cross-layer behavior.
- The OrganizationRepository is the single aggregate repository — Branch does not have an independent repository.
- All code uses TypeScript with strict typing.
- fast-check is used for property-based tests with numRuns: 100.
- This module reuses Result<T>, ok(), fail(), TenantContext, ValidationResult, AuditService, SyncQueue, and SyncEngine from the shared platform.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 1, "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "1.10", "1.11", "1.12"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "2.10", "2.11", "2.12", "2.13", "2.14"] },
    { "id": 3, "tasks": ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"] },
    { "id": 4, "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9"] },
    { "id": 5, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5"] }
  ]
}
```

---

## Dependency Graph

```
Wave 1 (Domain Foundation)
    │
    ▼
Wave 2 (Application Layer)
    │
    ▼
Wave 3 (Infrastructure)
    │
    ▼
Wave 4 (Presentation)
    │
    ▼
Wave 5 (Quality)
```

Each wave depends on the previous wave being complete. No wave may begin until its predecessor passes all validation criteria.

---

## Parallelization Opportunities

**Within Wave 1:**
- Tasks 1.2, 1.3, 1.4 can be developed in parallel (independent entity definitions)
- Tasks 1.5, 1.6 can be developed in parallel (independent validation)
- Tasks 1.7, 1.8 can be developed in parallel (independent lifecycle)
- Tasks 1.9, 1.10, 1.11 can be developed in parallel (independent test suites)

**Within Wave 2:**
- Tasks 2.2-2.12 can be partially parallelized (each use case is independent once 2.1 is complete)

**Within Wave 3:**
- Tasks 3.2, 3.3 can be developed in parallel (local and remote implementations are independent)

**Within Wave 4:**
- All UI tasks (4.1-4.9) can be developed in parallel once the Application Service (2.13) exists

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Single aggregate repository may be complex to implement | Higher implementation effort | Follow the same patterns as CORE-001/002; optimize loading strategies |
| Branch code uniqueness conflicts during offline sync | Duplicate codes detected only at sync time | Optimistic creation locally; conflict flagged during sync |
| Existing CORE-001 implementation uses separate BranchRepository | Inconsistency with new design | CORE-003 supersedes CORE-001's organization module; migration path defined during implementation |
| UI components may duplicate validation logic | Business logic leakage | UI validates only for UX; domain validates for correctness |
| Configuration drift during multi-device offline usage | Inconsistent config across devices | Last-write-wins with version comparison |

---

## Definition of Done

CORE-003 Organization Management is considered complete when:

- All 5 waves are implemented.
- All 13 correctness properties pass.
- All unit tests pass.
- All integration tests pass.
- TypeScript compiles in strict mode.
- Existing CORE-001 and CORE-002 tests remain green.
- Domain layer has zero infrastructure imports.
- Application layer depends only on domain contracts.
- Infrastructure implements domain contracts.
- Single aggregate repository pattern enforced.
- OrganizationApplicationService is the sole public entry point.
- Offline First behavior preserved.
- Sync Queue integration complete.
- Audit integration complete.
- Tenant isolation enforced at every layer.
- No TODO comments remain.
- No dead code remains.
- Architecture review passed.
