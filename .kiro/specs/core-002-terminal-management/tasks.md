# Implementation Plan: Terminal Management

## Overview

This plan implements the Terminal Management domain — the logical checkout station module for Nova Platform. Tasks follow a vertical implementation order organized into Waves. Each Wave leaves the repository in a stable, compilable, and testable state. The implementation reuses all architectural patterns, shared abstractions, and infrastructure established in CORE-001.

## Tasks

- [ ] 1. Wave 0 — Project Scaffolding
  - [ ] 1.1 Create terminal domain module directory structure
    - Create the folder hierarchy for the terminal domain module:
      - `packages/shared/domains/terminal/domain/`
      - `packages/shared/domains/terminal/application/`
      - `packages/shared/domains/terminal/infrastructure/`
      - `packages/shared/domains/terminal/__tests__/`
      - `packages/shared/domains/terminal/__integration__/`
    - _Requirements: N/A (project scaffolding)_

  - [ ] 1.2 Extend shared database initialization
    - Update `packages/shared/domains/organization/infrastructure/local/database.ts` to include IndexedDB object stores for `terminals` and `device_registrations`
    - Add indexes: terminals by organization_id, branch_id, sync_status; device_registrations by terminal_id, installation_id, sync_status
    - _Requirements: 15.1_

- [ ] 2. Wave 1 — Domain Foundation
  - [ ] 2.1 Create Terminal Aggregate Root interface and status type
    - Create `packages/shared/domains/terminal/domain/terminal.ts`
    - Implement Terminal interface with all fields (id, organizationId, branchId, code, name, configuration, status, createdAt, createdBy, updatedAt, updatedBy)
    - Implement TerminalStatus type ('active' | 'suspended')
    - _Requirements: 1.1, 1.2, 1.3, 3.1, 4.1_

  - [ ] 2.2 Create TerminalConfiguration Value Object
    - Create `packages/shared/domains/terminal/domain/terminal-configuration.ts`
    - Implement TerminalConfiguration interface with currency, language, timezone, offlineEnabled, syncInterval, receiptPrinterEnabled, cashDrawerEnabled, barcodeScannerEnabled
    - Implement factory function to create default configuration from OrganizationConfiguration
    - _Requirements: 1.9, 11.1, 13.1_

  - [ ] 2.3 Create DeviceRegistration entity and status type
    - Create `packages/shared/domains/terminal/domain/device-registration.ts`
    - Implement DeviceRegistration interface with all fields (id, terminalId, installationId, deviceName, deviceType, platform, applicationVersion, registeredAt, lastSeenAt, status)
    - Implement DeviceRegistrationStatus type ('active' | 'revoked' | 'inactive')
    - _Requirements: 7.1, 7.2, 7.3_

- [ ] 3. Wave 2 — Validation
  - [ ] 3.1 Implement Terminal validation functions
    - Create `packages/shared/domains/terminal/domain/validation/terminal-validation.ts`
    - Implement validateCreateTerminal(data: CreateTerminalInput): ValidationResult
    - Implement validateUpdateTerminal(data: UpdateTerminalInput): ValidationResult
    - Validate: code (non-empty, max 50), name (non-empty, max 255)
    - Define CreateTerminalInput and UpdateTerminalInput types
    - _Requirements: 1.4, 1.6, 2.2, 2.5_

  - [ ] 3.2 Implement DeviceRegistration validation functions
    - Create `packages/shared/domains/terminal/domain/validation/device-registration-validation.ts`
    - Implement validateRegisterDevice(data: RegisterDeviceInput): ValidationResult
    - Validate: installationId (non-empty), deviceName (non-empty, max 255), deviceType (non-empty, max 50), platform (non-empty, max 50)
    - Define RegisterDeviceInput type
    - _Requirements: 7.2, 7.4_

  - [ ] 3.3 Implement Terminal lifecycle state transitions
    - Create `packages/shared/domains/terminal/domain/lifecycle/terminal-lifecycle.ts`
    - Implement suspendTerminal(terminal: Terminal, hasDependencies: boolean): Result<Terminal>
    - Implement reactivateTerminal(terminal: Terminal): Result<Terminal>
    - Return INVALID_STATE_TRANSITION for invalid transitions
    - Return TERMINAL_HAS_DEPENDENCIES when dependencies exist
    - _Requirements: 3.1, 3.4, 4.1, 4.3_

  - [ ] 3.4 Implement DeviceRegistration lifecycle state transitions
    - Create `packages/shared/domains/terminal/domain/lifecycle/device-registration-lifecycle.ts`
    - Implement revokeDevice(registration: DeviceRegistration): Result<DeviceRegistration>
    - Implement deactivateDevice(registration: DeviceRegistration): Result<DeviceRegistration>
    - Return INVALID_STATE_TRANSITION for non-active devices
    - _Requirements: 9.1, 9.2_

- [ ] 4. Wave 3 — Repository Contracts
  - [ ] 4.1 Define TerminalRepository interface
    - Create `packages/shared/domains/terminal/domain/repositories/terminal-repository.ts`
    - Implement TerminalRepository interface with save(), findById(), findByCode(), findAllByBranch(), update(), hasActiveDependencies()
    - _Requirements: 1.1, 1.5, 2.3, 5.1, 5.2_

  - [ ] 4.2 Define DeviceRegistrationRepository interface
    - Create `packages/shared/domains/terminal/domain/repositories/device-registration-repository.ts`
    - Implement DeviceRegistrationRepository interface with save(), findById(), findByInstallationId(), findAllByTerminal(), update()
    - _Requirements: 7.1, 7.4, 7.5, 7.6, 8.1_

- [ ] 5. Wave 4 — Application Layer
  - [ ] 5.1 Implement CreateTerminal use case
    - Create `packages/shared/domains/terminal/application/use-cases/create-terminal.ts`
    - Orchestrate: validate → check code uniqueness → resolve config defaults from organization → persist → enqueue sync → audit
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

  - [ ] 5.2 Implement UpdateTerminal use case
    - Create `packages/shared/domains/terminal/application/use-cases/update-terminal.ts`
    - Orchestrate: validate → check code uniqueness → load → apply → persist → enqueue sync → audit
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 5.3 Implement SuspendTerminal use case
    - Create `packages/shared/domains/terminal/application/use-cases/suspend-terminal.ts`
    - Orchestrate: load → check dependencies → lifecycle transition → persist → enqueue sync → audit
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 5.4 Implement ReactivateTerminal use case
    - Create `packages/shared/domains/terminal/application/use-cases/reactivate-terminal.ts`
    - Orchestrate: load → lifecycle transition → persist → enqueue sync → audit
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 5.5 Implement ListTerminals and GetTerminalDetails use cases
    - Create `packages/shared/domains/terminal/application/use-cases/list-terminals.ts`
    - Create `packages/shared/domains/terminal/application/use-cases/get-terminal-details.ts`
    - Read from local store, scoped to branch and organization
    - _Requirements: 5.1, 5.2, 6.1, 6.2_

  - [ ] 5.6 Implement RegisterDevice use case
    - Create `packages/shared/domains/terminal/application/use-cases/register-device.ts`
    - Orchestrate: validate → check installationId global uniqueness → handle re-registration → persist → enqueue sync → audit
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ] 5.7 Implement ListRegisteredDevices use case
    - Create `packages/shared/domains/terminal/application/use-cases/list-registered-devices.ts`
    - Read from local store, scoped to terminal
    - _Requirements: 8.1, 8.2_

  - [ ] 5.8 Implement RevokeDevice use case
    - Create `packages/shared/domains/terminal/application/use-cases/revoke-device.ts`
    - Orchestrate: load → lifecycle transition → persist → enqueue sync → audit
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 5.9 Implement UpdateDevicePresence use case
    - Create `packages/shared/domains/terminal/application/use-cases/update-device-presence.ts`
    - Validate active status → update lastSeenAt only → persist → enqueue sync
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 5.10 Implement UpdateConfiguration and GetConfiguration use cases
    - Create `packages/shared/domains/terminal/application/use-cases/update-configuration.ts`
    - Create `packages/shared/domains/terminal/application/use-cases/get-configuration.ts`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 12.1, 12.2_

  - [ ] 5.11 Implement RestoreDefaultConfiguration use case
    - Create `packages/shared/domains/terminal/application/use-cases/restore-default-configuration.ts`
    - Load terminal → resolve organization defaults → replace configuration → persist → enqueue sync → audit
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ] 5.12 Implement TerminalApplicationService facade
    - Create `packages/shared/domains/terminal/application/terminal-application-service.ts`
    - Wire all use cases into a single service class
    - Inject repositories, audit service, sync queue, and tenant context
    - _Requirements: All (coordination layer)_

- [ ] 6. Wave 5 — Infrastructure Local
  - [ ] 6.1 Implement IndexedDB local store for Terminal
    - Create `packages/shared/domains/terminal/infrastructure/local/terminal-local-store.ts`
    - Implement TerminalRepository interface using IndexedDB via shared getDatabase()
    - Add sync metadata fields
    - _Requirements: 5.2, 6.2, 15.1_

  - [ ] 6.2 Implement IndexedDB local store for DeviceRegistration
    - Create `packages/shared/domains/terminal/infrastructure/local/device-registration-local-store.ts`
    - Implement DeviceRegistrationRepository interface using IndexedDB via shared getDatabase()
    - Add sync metadata fields
    - _Requirements: 8.2, 15.1_

- [ ] 7. Wave 6 — Infrastructure Remote
  - [ ] 7.1 Implement Supabase remote repository for Terminal
    - Create `packages/shared/domains/terminal/infrastructure/remote/terminal-remote-repository.ts`
    - Implement remote CRUD operations against Supabase
    - Handle unique constraint on (organization_id, code)
    - Receive typed Supabase client via dependency injection
    - _Requirements: 1.5, 2.3, 14.1, 14.2_

  - [ ] 7.2 Implement Supabase remote repository for DeviceRegistration
    - Create `packages/shared/domains/terminal/infrastructure/remote/device-registration-remote-repository.ts`
    - Implement remote CRUD operations against Supabase
    - Handle global unique constraint on installation_id
    - _Requirements: 7.4, 7.6, 14.1, 14.2_

- [ ] 8. Wave 7 — Synchronization Integration
  - [ ] 8.1 Register terminal entity types with Sync Queue
    - Extend sync queue entity types to include 'terminal' and 'device_registration'
    - Ensure terminal and device operations enqueue correctly
    - _Requirements: 15.2, 15.3_

- [ ] 9. Wave 8 — Audit Integration
  - [ ] 9.1 Extend AuditService entity types for terminal domain
    - Ensure AuditService accepts 'terminal', 'device_registration', and 'terminal_configuration' as entity types
    - Verify audit recording works for all terminal use cases
    - _Requirements: 16.1, 16.2_

- [ ] 10. Wave 9 — UI (Admin)
  - [ ] 10.1 Implement Terminal List page (Admin)
    - Table with code, name, status, device count per branch
    - Works offline (reads from local store)
    - _Requirements: 5.1, 5.2_

  - [ ] 10.2 Implement Create Terminal form (Admin)
    - Form fields: code, name
    - Client-side validation
    - Display field-level errors
    - _Requirements: 1.1, 1.4, 1.6_

  - [ ] 10.3 Implement Terminal Details page (Admin)
    - Show code, name, status, configuration, registered devices with presence
    - Render sync status indicator
    - _Requirements: 6.1, 6.2_

  - [ ] 10.4 Implement Edit Terminal form (Admin)
    - Allow editing code and name
    - Client-side validation, display uniqueness errors
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 10.5 Implement Terminal Configuration form (Admin)
    - Form for all operational settings (currency, language, timezone, peripherals)
    - Include restore defaults button
    - _Requirements: 11.1, 11.2, 13.1_

  - [ ] 10.6 Implement Terminal Lifecycle actions (Admin)
    - Suspend/reactivate with confirmation dialog
    - Display dependency errors if suspension is blocked
    - _Requirements: 3.1, 3.4, 4.1, 4.3_

  - [ ] 10.7 Implement Device List view (Admin)
    - Table with device name, type, platform, version, status, last seen
    - _Requirements: 8.1, 8.2_

  - [ ] 10.8 Implement Device Revocation action (Admin)
    - Confirmation dialog before revocation
    - Display current device information
    - _Requirements: 9.1, 9.3_

- [ ] 11. Wave 10 — Property-Based Tests
  - [ ] 11.1 Write property tests for terminal creation and code uniqueness (Properties 1, 2, 3)
    - Create `packages/shared/domains/terminal/__tests__/terminal.properties.test.ts`
    - Create `packages/shared/domains/terminal/__tests__/arbitraries.ts`
    - Use fast-check with numRuns: 100
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 1.7, 1.9_

  - [ ] 11.2 Write property tests for terminal lifecycle (Property 4)
    - Create `packages/shared/domains/terminal/__tests__/terminal-lifecycle.properties.test.ts`
    - _Requirements: 3.1, 3.4, 4.1, 4.3_

  - [ ] 11.3 Write property tests for device registration (Properties 5, 6, 7, 8, 9)
    - Create `packages/shared/domains/terminal/__tests__/device-registration.properties.test.ts`
    - _Requirements: 7.1, 7.3, 7.4, 7.5, 7.6, 9.1, 9.3_

  - [ ] 11.4 Write property tests for configuration and presence (Properties 10, 11)
    - Add to `packages/shared/domains/terminal/__tests__/terminal.properties.test.ts`
    - _Requirements: 10.1, 10.4, 13.1_

  - [ ] 11.5 Write property tests for tenant isolation (Property 12)
    - Create `packages/shared/domains/terminal/__tests__/tenant-isolation.properties.test.ts`
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [ ] 11.6 Write property tests for audit trail (Property 13)
    - Create `packages/shared/domains/terminal/__tests__/audit.properties.test.ts`
    - _Requirements: 16.1_

- [ ] 12. Wave 11 — Unit Tests
  - [ ] 12.1 Write unit tests for Terminal validation
    - Create `packages/shared/domains/terminal/__tests__/terminal.unit.test.ts`
    - Test specific validation scenarios, error messages, edge cases
    - _Requirements: 1.4, 1.6, 2.2, 2.5_

  - [ ] 12.2 Write unit tests for DeviceRegistration validation and lifecycle
    - Create `packages/shared/domains/terminal/__tests__/device-registration.unit.test.ts`
    - Test registration validation, re-registration logic, revocation, presence updates
    - _Requirements: 7.2, 7.4, 7.5, 9.1, 10.1, 10.2_

  - [ ] 12.3 Write unit tests for TerminalConfiguration defaults
    - Test default configuration resolution from OrganizationConfiguration
    - Test restore default configuration behavior
    - _Requirements: 1.9, 13.1_

- [ ] 13. Wave 12 — Integration Tests
  - [ ] 13.1 Write integration tests for offline read/write
    - Create `packages/shared/domains/terminal/__integration__/offline.integration.test.ts`
    - Test: create terminal offline → read from local → verify data
    - Test: register device offline → list devices → verify
    - _Requirements: 5.2, 6.2, 8.2, 15.1_

  - [ ] 13.2 Write integration tests for sync flow
    - Create `packages/shared/domains/terminal/__integration__/sync.integration.test.ts`
    - Test: offline change → connectivity → sync completes → status updated
    - Test: sync failure → retry → eventual success
    - _Requirements: 2.6, 11.4, 15.2, 15.3_

  - [ ] 13.3 Write integration tests for tenant isolation
    - Create `packages/shared/domains/terminal/__integration__/rls.integration.test.ts`
    - Test: cross-organization access rejected for terminals and devices
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [ ] 14. Wave 13 — Documentation and Cleanup
  - [ ] 14.1 Review exports and module boundaries
    - Verify domain index exports all public types
    - Verify application index exports service and use cases
    - Remove any dead code or unused imports
    - _Requirements: N/A (quality)_

  - [ ] 14.2 Verify dependency direction
    - Confirm Domain has no infrastructure imports
    - Confirm Application only imports Domain and shared abstractions
    - Confirm Infrastructure only imports Domain interfaces
    - _Requirements: N/A (architecture compliance)_

## Notes

- All tasks are mandatory. There are no optional tasks in this implementation plan.
- Property-Based Tests are required because they validate the Correctness Properties defined in design.md.
- Unit Tests validate specific examples, edge cases, and infrastructure behavior.
- Integration Tests validate cross-layer behavior (offline persistence, synchronization flow, tenant isolation).
- Each task references specific requirements for traceability.
- All code uses TypeScript with strict typing.
- fast-check is used for property-based tests with numRuns: 100 and seed-based reproducibility.
- Dependencies flow downward: Foundation → Domain → Validation → Repositories → Application → Infrastructure → Sync → Audit → UI → Tests.
- This module reuses Result<T>, ok(), fail(), TenantContext, ValidationResult, AuditService, SyncQueue, and SyncEngine from CORE-001.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3", "3.4"] },
    { "id": 3, "tasks": ["4.1", "4.2"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10", "5.11", "5.12"] },
    { "id": 5, "tasks": ["6.1", "6.2"] },
    { "id": 6, "tasks": ["7.1", "7.2"] },
    { "id": 7, "tasks": ["8.1"] },
    { "id": 8, "tasks": ["9.1"] },
    { "id": 9, "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5", "10.6", "10.7", "10.8"] },
    { "id": 10, "tasks": ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6"] },
    { "id": 11, "tasks": ["12.1", "12.2", "12.3"] },
    { "id": 12, "tasks": ["13.1", "13.2", "13.3"] },
    { "id": 13, "tasks": ["14.1", "14.2"] }
  ]
}
```

---

## Implementation Order

1. **Wave 0**: Scaffolding — directory structure and database schema extension
2. **Wave 1**: Domain types — Terminal, TerminalConfiguration, DeviceRegistration
3. **Wave 2**: Validation and lifecycle — pure domain logic
4. **Wave 3**: Repository contracts — interfaces only, no implementation
5. **Wave 4**: Application layer — all use cases and service facade
6. **Wave 5**: Local infrastructure — IndexedDB stores
7. **Wave 6**: Remote infrastructure — Supabase repositories
8. **Wave 7**: Sync integration — entity type registration
9. **Wave 8**: Audit integration — entity type extension
10. **Wave 9**: UI — admin forms, lists, lifecycle actions
11. **Wave 10**: Property-based tests — all 13 correctness properties
12. **Wave 11**: Unit tests — validation, lifecycle, configuration
13. **Wave 12**: Integration tests — offline, sync, tenant isolation
14. **Wave 13**: Cleanup — exports, dependencies, dead code

---

## Architecture Checkpoints

| After Wave | Verify |
|-----------|--------|
| Wave 0 | Repository compiles, no runtime errors |
| Wave 2 | All domain logic compiles, validation functions testable in isolation |
| Wave 4 | Application layer compiles, use cases can be tested with in-memory fakes |
| Wave 6 | Full infrastructure compiles, repositories implement domain contracts |
| Wave 9 | UI compiles, components render without runtime errors |
| Wave 12 | All tests pass, full coverage of correctness properties |
| Wave 13 | No dead code, dependency direction verified, architecture boundaries intact |

---

## Expected Review Points

1. **After Wave 2** — Domain model review (types, validation, lifecycle)
2. **After Wave 4** — Application layer review (use case orchestration, DI wiring)
3. **After Wave 9** — Full feature review (UI integration)
4. **After Wave 12** — Quality review (test coverage, correctness properties)

---

## Estimated Wave Dependencies

| Wave | Depends On |
|------|-----------|
| Wave 1 | Wave 0 |
| Wave 2 | Wave 1 |
| Wave 3 | Wave 1 |
| Wave 4 | Waves 2, 3 |
| Wave 5 | Waves 3, 4 |
| Wave 6 | Waves 3, 4 |
| Wave 7 | Wave 5 |
| Wave 8 | Wave 4 |
| Wave 9 | Waves 4, 5 |
| Wave 10 | Waves 4, 5 |
| Wave 11 | Waves 2, 4 |
| Wave 12 | Waves 5, 6, 7 |
| Wave 13 | All previous |

---

## Critical Risks

| Risk | Mitigation |
|------|-----------|
| Installation ID global uniqueness enforcement | Validated at remote DB level; optimistic local creation with conflict detection during sync |
| Shared IndexedDB database schema migration | Extend existing database.ts upgrade function; increment DB_VERSION carefully |
| Organization Configuration dependency | Use CORE-001's getDefaultConfiguration(); do not duplicate logic |
| Terminal suspension with active dependencies | hasActiveDependencies() returns false until Session Management (future module) is implemented |
| Cross-module import paths | Reuse the same relative import strategy established in CORE-001 tests |
