# Implementation Plan: Organization Management

## Overview

This plan implements the Organization Management domain — the foundational Platform Service of Nova Platform. Tasks follow a vertical implementation order (Foundation → Domain → Infrastructure → Application → Synchronization → UI → Testing) with dependencies flowing downward. Each task represents a small, focused implementation unit aligned with the approved architecture.

## Tasks

- [ ] 1. Foundation — Project structure and shared primitives
  - [ ] 1.1 Create domain module directory structure
    - Create the folder hierarchy for the organization domain module:
      - `packages/shared/domains/organization/domain/`
      - `packages/shared/domains/organization/application/`
      - `packages/shared/domains/organization/infrastructure/`
      - `packages/shared/domains/organization/__tests__/`
      - `packages/shared/domains/organization/__integration__/`
      - `packages/shared/sync/`
    - _Requirements: N/A (project scaffolding)_

  - [ ] 1.2 Define Result<T> type and AppError interface
    - Create `packages/shared/domains/organization/domain/types/result.ts`
    - Implement `Result<T>` discriminated union type (`{ success: true; data: T } | { success: false; error: AppError }`)
    - Implement `AppError` interface with `code`, `message`, and optional `fields` array of `FieldError`
    - Implement `FieldError` interface with `field` and `message`
    - _Requirements: 1.5, 3.2, 4.6, 6.2_

  - [ ] 1.3 Define TenantContext interface
    - Create `packages/shared/domains/organization/domain/types/tenant-context.ts`
    - Implement `TenantContext` interface with `organizationId` and `userId` fields
    - _Requirements: 11.1_

  - [ ] 1.4 Define ValidationResult and validation types
    - Create `packages/shared/domains/organization/domain/types/validation.ts`
    - Implement `ValidationResult` interface with `valid` boolean and `errors` array of `FieldError`
    - _Requirements: 1.4, 1.5, 4.6_

- [ ] 2. Domain — Aggregate Root, Entity, Value Object, validation, and lifecycle
  - [ ] 2.1 Create Organization Aggregate Root interface and status type
    - Create `packages/shared/domains/organization/domain/organization.ts`
    - Implement `Organization` interface with all fields (id, legalName, tradeName, taxIdentifier, country, configuration, contactEmail, contactPhone, address, status, createdAt, createdBy, updatedAt, updatedBy)
    - Implement `OrganizationStatus` type (`'active' | 'suspended'`)
    - _Requirements: 1.1, 1.2, 1.3, 9.1_

  - [ ] 2.2 Create OrganizationConfiguration Value Object
    - Create `packages/shared/domains/organization/domain/organization-configuration.ts`
    - Implement `OrganizationConfiguration` interface with `timeZone`, `currency`, `language`, `regionalPreferences`
    - Implement `RegionalPreferences` interface with `dateFormat`, `numberFormat`, `taxLabel`
    - Implement country-based default configuration factory function for MEX, USA, COL
    - _Requirements: 10.1, 10.2_

  - [ ] 2.3 Create Branch Entity interface and status type
    - Create `packages/shared/domains/organization/domain/branch.ts`
    - Implement `Branch` interface with all fields (id, organizationId, name, address, phone, status, createdAt, createdBy, updatedAt, updatedBy)
    - Implement `BranchStatus` type (`'active' | 'inactive'`)
    - _Requirements: 4.1, 4.3, 4.8_

  - [ ] 2.4 Define OrganizationRepository interface
    - Create `packages/shared/domains/organization/domain/repositories/organization-repository.ts`
    - Implement `OrganizationRepository` interface with `save()`, `findById()`, `findByTaxIdentifier()`, `update()` methods
    - _Requirements: 1.1, 2.1, 3.1_

  - [ ] 2.5 Define BranchRepository interface
    - Create `packages/shared/domains/organization/domain/repositories/branch-repository.ts`
    - Implement `BranchRepository` interface with `save()`, `findById()`, `findByName()`, `findAllByOrganization()`, `update()`, `hasActiveDependencies()` methods
    - _Requirements: 4.1, 5.1, 6.1, 7.4_

  - [ ] 2.6 Define AuditEntry and AuditService interfaces
    - Create `packages/shared/domains/organization/domain/types/audit.ts`
    - Implement `AuditEntry` interface with `id`, `organizationId`, `entityType`, `entityId`, `action`, `performedBy`, `performedAt`, and `changes` record
    - Implement `AuditAction` type (`'created' | 'updated' | 'deactivated' | 'reactivated' | 'suspended'`)
    - Implement `AuditService` interface with `record()` and `getHistory()` methods
    - _Requirements: 13.1, 13.2_

  - [ ] 2.7 Implement Organization validation functions
    - Create `packages/shared/domains/organization/domain/validation/organization-validation.ts`
    - Implement `validateCreateOrganization(data: CreateOrganizationInput): ValidationResult`
    - Implement `validateUpdateOrganization(data: UpdateOrganizationInput): ValidationResult`
    - Validate: legalName (non-empty, max 255), tradeName (non-empty, max 255), taxIdentifier (non-empty, max 100), country (valid ISO 3166-1 alpha-3), timeZone (valid IANA), currency (valid ISO 4217), contactEmail (valid email if provided), contactPhone (max 50 if provided), address (max 500 if provided)
    - _Requirements: 1.3, 1.4, 1.5, 3.4, 3.5_

  - [ ] 2.8 Implement Branch validation functions
    - Create `packages/shared/domains/organization/domain/validation/branch-validation.ts`
    - Implement `validateCreateBranch(data: CreateBranchInput): ValidationResult`
    - Implement `validateUpdateBranch(data: UpdateBranchInput): ValidationResult`
    - Validate: name (non-empty, max 255), address (non-empty, max 500), phone (non-empty, max 50)
    - _Requirements: 4.2, 4.4, 4.6, 6.4_

  - [ ] 2.9 Implement Organization lifecycle state transitions
    - Create `packages/shared/domains/organization/domain/lifecycle/organization-lifecycle.ts`
    - Implement `suspendOrganization(org: Organization): Result<Organization>` — only active → suspended
    - Implement `reactivateOrganization(org: Organization): Result<Organization>` — only suspended → active
    - Return `INVALID_STATE_TRANSITION` error for invalid transitions
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 2.10 Implement Branch lifecycle state transitions
    - Create `packages/shared/domains/organization/domain/lifecycle/branch-lifecycle.ts`
    - Implement `deactivateBranch(branch: Branch, hasDependencies: boolean): Result<Branch>` — only active with no dependencies → inactive
    - Implement `reactivateBranch(branch: Branch): Result<Branch>` — only inactive → active
    - Return `INVALID_STATE_TRANSITION` for already-active reactivation
    - Return `BRANCH_HAS_DEPENDENCIES` when dependencies exist
    - _Requirements: 7.1, 7.4, 8.1, 8.3_

  - [ ] 2.11 Write property-based tests for Organization validation (Properties 3, 5)
    - Create `packages/shared/domains/organization/__tests__/organization.properties.test.ts`
    - **Property 3: Organization validation rejects invalid input without side effects**
    - **Property 5: Tax identifier uniqueness per country**
    - Create arbitraries for `CreateOrganizationInput` in `packages/shared/domains/organization/__tests__/arbitraries.ts`
    - Use fast-check with `numRuns: 100`
    - _Requirements: 1.3, 1.4, 1.5, 1.7_

  - [ ] 2.12 Write property-based tests for Branch validation (Properties 4, 6)
    - Create `packages/shared/domains/organization/__tests__/branch.properties.test.ts`
    - **Property 4: Branch validation rejects invalid input without side effects**
    - **Property 6: Branch name uniqueness per organization**
    - Create arbitraries for `CreateBranchInput` and `UpdateBranchInput`
    - Use fast-check with `numRuns: 100`
    - _Requirements: 4.2, 4.4, 4.5, 4.6, 6.3_

  - [ ] 2.13 Write property-based tests for lifecycle state transitions (Properties 9, 10, 11)
    - Create `packages/shared/domains/organization/__tests__/lifecycle.properties.test.ts`
    - **Property 9: Branch lifecycle state transitions**
    - **Property 10: Organization lifecycle state transitions**
    - **Property 11: Invalid state transitions are rejected**
    - Use fast-check with `numRuns: 100`
    - _Requirements: 7.1, 7.4, 7.5, 8.1, 8.3, 8.4, 9.3, 9.4, 9.5_

- [ ] 3. Checkpoint — Foundation and Domain validation
  - Ensure all domain tests pass before proceeding to Infrastructure.

- [ ] 4. Infrastructure — Local persistence, remote API, and audit
  - [ ] 4.1 Implement IndexedDB local store for Organization
    - Create `packages/shared/domains/organization/infrastructure/local/organization-local-store.ts`
    - Implement `OrganizationRepository` interface using IndexedDB
    - Add sync metadata fields (`_syncStatus`, `_lastSyncedAt`, `_localVersion`, `_remoteVersion`)
    - Index by organization ID
    - _Requirements: 2.2, 12.1_

  - [ ] 4.2 Implement IndexedDB local store for Branch
    - Create `packages/shared/domains/organization/infrastructure/local/branch-local-store.ts`
    - Implement `BranchRepository` interface using IndexedDB
    - Add sync metadata fields (`_syncStatus`, `_lastSyncedAt`, `_localVersion`, `_remoteVersion`)
    - Index by organization ID and sync status
    - _Requirements: 5.2, 12.1_

  - [ ] 4.3 Implement Supabase remote repository for Organization
    - Create `packages/shared/domains/organization/infrastructure/remote/organization-remote-repository.ts`
    - Implement remote CRUD operations against Supabase PostgreSQL
    - Rely on Row Level Security (RLS) for tenant isolation at database level
    - Handle unique constraint on `(tax_identifier, country)`
    - _Requirements: 1.1, 1.7, 11.1, 11.2_

  - [ ] 4.4 Implement Supabase remote repository for Branch
    - Create `packages/shared/domains/organization/infrastructure/remote/branch-remote-repository.ts`
    - Implement remote CRUD operations against Supabase PostgreSQL
    - Handle unique constraint on `(organization_id, name)`
    - _Requirements: 4.1, 4.5, 11.1, 11.2_

  - [ ] 4.5 Implement AuditService infrastructure
    - Create `packages/shared/domains/organization/infrastructure/audit/audit-service-impl.ts`
    - Implement `AuditService` interface
    - Persist audit entries to local store (IndexedDB) with sync queue
    - Store changes as JSON diff (from/to values)
    - _Requirements: 13.1, 13.2_

  - [ ] 4.6 Write unit tests for local stores
    - Create `packages/shared/domains/organization/__tests__/organization-local-store.unit.test.ts`
    - Create `packages/shared/domains/organization/__tests__/branch-local-store.unit.test.ts`
    - Test CRUD operations, sync metadata updates, index queries
    - _Requirements: 2.2, 5.2, 12.1_

- [ ] 5. Application — Use case orchestration
  - [ ] 5.1 Implement CreateOrganization use case
    - Create `packages/shared/domains/organization/application/use-cases/create-organization.ts`
    - Orchestrate: validate input → check tax ID uniqueness → assign country defaults → persist locally → enqueue sync → record audit
    - Accept `CreateOrganizationInput` and `userId`, return `Result<Organization>`
    - Generate UUID, set status to `'active'`, set timestamps
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 10.2_

  - [ ] 5.2 Implement GetOrganization use case
    - Create `packages/shared/domains/organization/application/use-cases/get-organization.ts`
    - Read from local store (offline-first), return `Result<Organization>`
    - Enforce Tenant Context scoping
    - _Requirements: 2.1, 2.2, 11.1_

  - [ ] 5.3 Implement UpdateOrganization use case
    - Create `packages/shared/domains/organization/application/use-cases/update-organization.ts`
    - Orchestrate: validate input → load existing → apply changes → persist locally → enqueue sync → record audit
    - Update `updatedAt` and `updatedBy`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 5.4 Implement UpdateConfiguration use case
    - Create `packages/shared/domains/organization/application/use-cases/update-configuration.ts`
    - Orchestrate: load organization → update OrganizationConfiguration Value Object → persist locally → enqueue sync → record audit
    - _Requirements: 10.1, 10.3, 10.4, 10.5_

  - [ ] 5.5 Implement SuspendOrganization use case
    - Create `packages/shared/domains/organization/application/use-cases/suspend-organization.ts`
    - Orchestrate: load organization → invoke lifecycle transition → persist → enqueue sync → record audit
    - _Requirements: 9.3, 9.4, 9.5_

  - [ ] 5.6 Implement ReactivateOrganization use case
    - Create `packages/shared/domains/organization/application/use-cases/reactivate-organization.ts`
    - Orchestrate: load organization → invoke lifecycle transition → persist → enqueue sync → record audit
    - _Requirements: 9.4, 9.5_

  - [ ] 5.7 Implement CreateBranch use case
    - Create `packages/shared/domains/organization/application/use-cases/create-branch.ts`
    - Orchestrate: validate input → check name uniqueness → persist locally → enqueue sync → record audit
    - Generate UUID, set status to `'active'`, set timestamps, enforce `organizationId` immutability
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [ ] 5.8 Implement GetBranch and ListBranches use cases
    - Create `packages/shared/domains/organization/application/use-cases/get-branch.ts`
    - Create `packages/shared/domains/organization/application/use-cases/list-branches.ts`
    - Read from local store, enforce Tenant Context
    - _Requirements: 5.1, 5.2, 11.1_

  - [ ] 5.9 Implement UpdateBranch use case
    - Create `packages/shared/domains/organization/application/use-cases/update-branch.ts`
    - Orchestrate: validate input → check name uniqueness → load existing → apply changes → persist locally → enqueue sync → record audit
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 5.10 Implement DeactivateBranch use case
    - Create `packages/shared/domains/organization/application/use-cases/deactivate-branch.ts`
    - Orchestrate: load branch → check active dependencies → invoke lifecycle transition → persist → enqueue sync → record audit
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 5.11 Implement ReactivateBranch use case
    - Create `packages/shared/domains/organization/application/use-cases/reactivate-branch.ts`
    - Orchestrate: load branch → invoke lifecycle transition → persist → enqueue sync → record audit
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 5.12 Implement OrganizationApplicationService facade
    - Create `packages/shared/domains/organization/application/organization-application-service.ts`
    - Wire all use cases into a single service class implementing the `OrganizationApplicationService` interface
    - Inject Repository interfaces, AuditService, SyncQueue, and Tenant Context
    - _Requirements: All (coordination layer)_

  - [ ] 5.13 Write property-based tests for use case round-trips (Properties 1, 2, 7, 8)
    - Add to `packages/shared/domains/organization/__tests__/organization.properties.test.ts`
    - **Property 1: Organization creation round-trip**
    - **Property 2: Branch creation round-trip**
    - **Property 7: Organization update persists changes correctly**
    - **Property 8: Branch update persists changes correctly**
    - Use in-memory Repository fakes for isolation
    - _Requirements: 1.1, 1.2, 1.6, 2.1, 3.1, 3.2, 3.4, 3.5, 4.1, 4.3, 4.7, 6.1, 6.2, 6.4_

  - [ ] 5.14 Write property-based tests for tenant isolation (Property 12)
    - Create `packages/shared/domains/organization/__tests__/tenant-isolation.properties.test.ts`
    - **Property 12: Tenant isolation enforcement**
    - Generate random Tenant Context pairs and verify cross-tenant access is rejected
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ] 5.15 Write property-based tests for audit trail (Properties 13, 14)
    - Create `packages/shared/domains/organization/__tests__/audit.properties.test.ts`
    - **Property 13: Audit trail completeness**
    - **Property 14: Audit history ordering**
    - Verify every mutation produces audit entry, verify descending order
    - _Requirements: 13.1, 13.2, 7.5, 8.4, 9.5_

  - [ ] 5.16 Write property-based tests for data preservation and configuration (Properties 15, 17, 18)
    - Add to `packages/shared/domains/organization/__tests__/organization.properties.test.ts`
    - **Property 15: Data preservation across status changes**
    - **Property 17: Configuration country-based defaults**
    - **Property 18: Branch organization immutability**
    - _Requirements: 4.8, 7.3, 9.6, 10.1, 10.2_

- [ ] 6. Checkpoint — Application Layer validation
  - Ensure all Application Layer and property-based tests pass before proceeding to Synchronization.

- [ ] 7. Synchronization — Offline sync engine integration
  - [ ] 7.1 Define SyncOperation and SyncQueue interfaces
    - Create `packages/shared/sync/types.ts`
    - Implement `SyncOperation` interface with all fields (`id`, `entityType`, `entityId`, `operationType`, `payload`, `status`, `createdAt`, `attempts`, `lastAttemptAt`, `error`)
    - Implement `SyncStatus` type (`'pending' | 'in_progress' | 'completed' | 'failed'`)
    - Implement `SyncQueue` interface with `enqueue()`, `dequeue()`, `markCompleted()`, `markFailed()`, `getPendingCount()` methods
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 7.2 Implement SyncQueue with IndexedDB persistence
    - Create `packages/shared/sync/sync-queue-store.ts`
    - Implement `SyncQueue` interface using IndexedDB
    - Order operations by `createdAt` for FIFO processing
    - Index by status for efficient dequeue
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 7.3 Implement Sync Engine for Organization domain
    - Create `packages/shared/sync/sync-engine.ts`
    - Implement queue processing loop: dequeue → send to remote → mark completed/failed
    - Implement connectivity detection
    - Implement exponential backoff retry for failed operations
    - _Requirements: 12.2, 12.3_

  - [ ] 7.4 Implement conflict detection and resolution flagging
    - Create `packages/shared/sync/conflict-detection.ts`
    - Compare `_localVersion` vs `_remoteVersion` to detect conflicts
    - Flag conflicting records with `_syncStatus: 'conflict'` in local store
    - Do not auto-resolve — store for user resolution
    - _Requirements: 12.2, 12.3_

  - [ ] 7.5 Implement sync status tracking for UI indicators
    - Create `packages/shared/sync/sync-status-tracker.ts`
    - Expose pending operation count
    - Expose per-record sync status (`synced`, `pending`, `conflict`)
    - Notify when changes are pending synchronization
    - _Requirements: 12.4_

  - [ ] 7.6 Write property-based tests for sync queue retry (Property 16)
    - Create `packages/shared/domains/organization/__tests__/sync-queue.properties.test.ts`
    - **Property 16: Sync queue retry on failure**
    - Verify failed operations remain in queue with incremented attempts
    - _Requirements: 12.3_

  - [ ] 7.7 Write unit tests for Sync Engine
    - Create `packages/shared/sync/__tests__/sync-engine.unit.test.ts`
    - Test queue processing, backoff logic, conflict detection
    - _Requirements: 12.2, 12.3, 12.4_

- [ ] 8. Checkpoint — Synchronization Layer validation
  - Ensure all Synchronization Layer tests pass before proceeding to UI.

- [ ] 9. UI — Admin and POS interfaces
  - [ ] 9.1 Implement Create Organization form (Admin)
    - Create `apps/admin/` component for organization creation
    - Form fields: legal name, trade name, tax identifier, country, time zone, currency, contact email, contact phone, address
    - Client-side validation using domain validation functions
    - Display field-level errors from `ValidationResult`
    - Call `OrganizationApplicationService.createOrganization()`
    - _Requirements: 1.1, 1.3, 1.4, 1.5_

  - [ ] 9.2 Implement View Organization screen (Admin/POS)
    - Create shared component for displaying organization profile
    - Show all organization fields including OrganizationConfiguration
    - Render sync status indicator (synced/pending/conflict)
    - Works offline (reads from local store)
    - _Requirements: 2.1, 2.2, 12.4_

  - [ ] 9.3 Implement Update Organization form (Admin)
    - Create `apps/admin/` component for editing organization fields
    - Allow editing: trade name, legal name, tax identifier, contact email, contact phone, address
    - Client-side validation, display errors
    - Call `OrganizationApplicationService.updateOrganization()`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 9.4 Implement Organization Configuration form (Admin)
    - Create `apps/admin/` component for editing OrganizationConfiguration
    - Fields: time zone, currency, language, regional preferences (date format, number format, tax label)
    - Call `OrganizationApplicationService.updateConfiguration()`
    - _Requirements: 10.1, 10.3_

  - [ ] 9.5 Implement Create Branch form (Admin)
    - Create `apps/admin/` component for branch creation
    - Form fields: name, address, phone
    - Client-side validation, display uniqueness errors
    - Call `OrganizationApplicationService.createBranch()`
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.6_

  - [ ] 9.6 Implement Branch List view (Admin/POS)
    - Create shared component for listing branches
    - Show name, address, phone, status for each branch
    - Works offline
    - _Requirements: 5.1, 5.2_

  - [ ] 9.7 Implement Update Branch form (Admin)
    - Create `apps/admin/` component for editing branch
    - Allow editing: name, address, phone
    - Validate name uniqueness, display errors
    - Call `OrganizationApplicationService.updateBranch()`
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 9.8 Implement Branch deactivation/reactivation UI (Admin)
    - Create `apps/admin/` component with deactivation/reactivation actions
    - Show confirmation dialog before deactivation
    - Display dependency errors if deactivation is blocked
    - Call respective use cases
    - _Requirements: 7.1, 7.4, 8.1, 8.3_

  - [ ] 9.9 Implement Organization suspend/reactivate UI (Admin)
    - Create `apps/admin/` component for organization lifecycle actions
    - Show confirmation dialog before suspension
    - Display current status prominently
    - Call respective use cases
    - _Requirements: 9.3, 9.4_

  - [ ] 9.10 Implement Audit History view (Admin)
    - Create `apps/admin/` component for displaying audit trail
    - Show action, user, timestamp, and changes per entry
    - Sort by most recent first
    - _Requirements: 13.1, 13.2_

- [ ] 10. Checkpoint — UI integration validation
  - Ensure all UI components render correctly and integrate with Application Service.

- [ ] 11. Testing — Integration tests
  - [ ] 11.1 Write integration tests for offline read/write
    - Create `packages/shared/domains/organization/__integration__/offline.integration.test.ts`
    - Test: create organization offline → read from local store → verify data integrity
    - Test: create branch offline → list branches → verify correct results
    - _Requirements: 2.2, 5.2, 12.1_

  - [ ] 11.2 Write integration tests for sync flow
    - Create `packages/shared/domains/organization/__integration__/sync.integration.test.ts`
    - Test: offline change → connectivity restored → sync completes → local status updated
    - Test: sync failure → retry with incremented attempts → eventual success
    - _Requirements: 3.6, 6.5, 10.5, 12.2, 12.3_

  - [ ] 11.3 Write integration tests for RLS tenant isolation
    - Create `packages/shared/domains/organization/__integration__/rls.integration.test.ts`
    - Test: attempt cross-tenant access via Supabase → verify rejection
    - Test: verify RLS policy enforces organization scoping on all tables
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 12. Final Checkpoint — Full integration validation
  - Ensure all tests pass across all layers: Domain, Infrastructure, Application, Synchronization, and Integration.

## Notes

- All tasks are mandatory. There are no optional tasks in this implementation plan.
- Property-Based Tests are required because they validate the Correctness Properties defined in design.md. They are not optional quality improvements — they are the formal verification mechanism for domain correctness.
- Unit Tests validate specific examples, edge cases, and infrastructure behavior.
- Integration Tests validate cross-layer behavior (offline persistence, synchronization flow, RLS tenant isolation).
- Each task references specific requirements for traceability.
- Checkpoints ensure incremental validation at each architectural layer boundary.
- All code uses TypeScript with strict typing.
- fast-check is used for property-based tests with `numRuns: 100` and seed-based reproducibility.
- Dependencies flow downward: Foundation → Domain → Infrastructure → Application → Synchronization → UI → Testing.
- Foundation contains only shared primitives (Result, TenantContext, ValidationResult) — infrastructure-specific interfaces (Audit, Sync) are defined in their corresponding phases.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 3, "tasks": ["2.4", "2.5", "2.6", "2.7", "2.8"] },
    { "id": 4, "tasks": ["2.9", "2.10"] },
    { "id": 5, "tasks": ["2.11", "2.12", "2.13"] },
    { "id": 6, "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5"] },
    { "id": 7, "tasks": ["4.6"] },
    { "id": 8, "tasks": ["5.1", "5.2", "5.7", "5.8"] },
    { "id": 9, "tasks": ["5.3", "5.4", "5.5", "5.6", "5.9", "5.10", "5.11"] },
    { "id": 10, "tasks": ["5.12"] },
    { "id": 11, "tasks": ["5.13", "5.14", "5.15", "5.16"] },
    { "id": 12, "tasks": ["7.1"] },
    { "id": 13, "tasks": ["7.2", "7.3", "7.4", "7.5"] },
    { "id": 14, "tasks": ["7.6", "7.7"] },
    { "id": 15, "tasks": ["9.1", "9.2", "9.5", "9.6"] },
    { "id": 16, "tasks": ["9.3", "9.4", "9.7", "9.8", "9.9", "9.10"] },
    { "id": 17, "tasks": ["11.1", "11.2", "11.3"] }
  ]
}
```
