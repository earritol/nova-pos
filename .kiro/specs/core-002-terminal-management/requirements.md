# Requirements Document

## Introduction

This specification defines the functional requirements for the Terminal Management domain within Nova Platform. A Terminal represents a logical checkout station — a cash register position within a branch where commercial operations are performed. This epic covers the creation, configuration, lifecycle management, and device registration of terminals, the operational units required before any transactional feature (sales, cash register, payments) can function.

Terminal Management depends on CORE-001 Organization Management. Every terminal belongs to exactly one branch within one organization. The licensing model for Nova POS is calculated by the number of active terminals, not by the number of physical devices registered to operate them.

---

## Purpose

Establish the business rules and functional expectations for managing terminals and their associated device registrations within Nova Platform. This document serves as the contract between Product, Design, and Engineering for what the system must accomplish regarding terminals, their configuration, and the devices authorized to operate them.

---

## Scope

### In Scope

- Terminal creation with required identification information
- Viewing and updating terminal information
- Terminal lifecycle management (active, suspended, reactivated)
- Terminal configuration (currency, language, timezone, peripheral settings)
- Device registration to a terminal
- Viewing registered devices for a terminal
- Device revocation
- Device presence tracking (last seen)
- Restoring terminal configuration to defaults
- Tenant isolation at the organization level
- Offline availability of terminal and device data
- High-level auditability of terminal structure changes
- Reference to subscription as the mechanism governing terminal limits

### Out of Scope

- User authentication (separate specification)
- Employee sessions and shift management (separate specification)
- Sales operations (separate specification)
- Inventory management (separate specification)
- Cash register operations (separate specification)
- Payment processing (separate specification)
- Hardware driver integration (printing, scanners, cash drawers)
- Synchronization engine design (technical implementation)
- Conflict resolution strategies (technical implementation)
- Session concurrency management (separate specification)
- Terminal deletion (terminals are never physically deleted)
- Device-to-device communication
- Remote device management or MDM
- Hardware diagnostics or health monitoring

---

## Actors

- **Administrator**: A user with permissions to manage the terminal structure (terminals, device registrations, configuration).
- **System User**: Any authenticated user who interacts with terminal data in read-only capacity during daily operations (e.g., selecting a terminal to begin a shift).
- **Device**: A physical installation of Nova POS that registers itself to a terminal to perform commercial operations.

---

## Glossary

- **Terminal**: A logical checkout station (cash register) within a branch. Represents the operational unit where commercial transactions are performed. Examples: Caja 1, Caja 2, Autoservicio, Móvil.
- **Terminal Code**: A short, human-readable identifier for a terminal, unique within the organization. Examples: CAJA-01, CAJA-02, MOBILE-01.
- **Device Registration**: An authorized Nova POS installation associated with a terminal. A physical device (desktop, laptop, tablet, phone) that has been registered to operate a specific terminal.
- **Installation ID**: A globally unique, persistent identifier generated when Nova POS is installed on a device. Remains stable across application updates and organization changes. Used to identify a specific physical installation across the platform.
- **Device Presence**: The last known activity timestamp of a registered device. This module only persists the timestamp; interpretation of connectivity status belongs to application logic or future modules.
- **Terminal Configuration**: The set of operational settings (currency, language, timezone, peripheral preferences) that define how a terminal operates.
- **Suspension**: The process of temporarily disabling a terminal, preventing new commercial operations while preserving all historical data and device registrations.
- **Revocation**: The process of removing a device's authorization to operate a terminal, preserving the historical registration record.
- **Device Registration Status**: The lifecycle state of a device registration. A device registration may be in one of the following states: active (authorized to operate), revoked (authorization removed by an administrator), or inactive (registration deactivated by the system or device).

---

## Dependencies

This specification depends on:

- **CORE-001 Organization Management**: Provides the Organization and Branch entities. Every terminal belongs to a branch, which belongs to an organization. Organization and branch business rules (tenant isolation, lifecycle management, offline availability) apply transitively to terminals.

---

## Requirements

### Requirement 1: Create Terminal

**User Story:** As an administrator, I want to create terminals for a branch, so that I can define the checkout stations where my business performs commercial operations.

#### Acceptance Criteria

1. WHEN an administrator submits valid terminal data, THE system SHALL create the terminal record associated with the specified branch within the current organization.
2. THE system SHALL require the following information to create a terminal: code and name.
3. WHEN a terminal is created, THE system SHALL assign a unique identifier and set the status to "active".
4. THE system SHALL validate that the terminal code is non-empty and within reasonable length.
5. THE system SHALL enforce that the terminal code is unique within the organization.
6. IF the submitted terminal data fails validation, THEN THE system SHALL return an error indicating which fields are invalid and the reason for each failure.
7. WHEN a terminal is created, THE system SHALL record the creation timestamp and the identity of the actor that performed the action.
8. THE system SHALL enforce that a terminal belongs to exactly one branch at any given time.
9. THE system SHALL assign default terminal configuration values inherited from the organization configuration when a terminal is created.

---

### Requirement 2: Update Terminal

**User Story:** As an administrator, I want to update terminal information, so that I can keep each checkout station's identification accurate.

#### Acceptance Criteria

1. WHEN an administrator submits valid updated terminal data, THE system SHALL persist the changes and record the modification timestamp and the identity of the actor that performed the update.
2. IF the updated terminal data fails validation, THEN THE system SHALL return an error response indicating each invalid field, without persisting any changes.
3. IF the updated terminal code already exists within the same organization, THEN THE system SHALL reject the update and return an error indicating the code uniqueness constraint violation.
4. THE system SHALL allow updating the following fields: code and name.
5. THE system SHALL validate that the terminal code and name are non-empty and within reasonable length.
6. WHEN terminal updates are performed without Internet connectivity, THE system SHALL retain the changes and synchronize them automatically when connectivity is restored.

---

### Requirement 3: Suspend Terminal

**User Story:** As an administrator, I want to suspend a terminal that is temporarily out of service, so that it cannot be used for commercial operations while preserving its configuration and history.

#### Acceptance Criteria

1. WHEN an administrator requests to suspend a terminal, THE system SHALL change the terminal status to "suspended".
2. WHEN a terminal is suspended, THE system SHALL prevent new commercial operations (sales, cash register operations) from being initiated on that terminal.
3. WHEN a terminal is suspended, THE system SHALL preserve all historical data, device registrations, and configuration associated with that terminal.
4. IF a suspension request targets a terminal that has active sessions or pending operations, THEN THE system SHALL reject the request and return an error indicating which conditions must be resolved before proceeding.
5. WHEN a terminal status changes, THE system SHALL record the modification timestamp and the identity of the actor that performed the action.

---

### Requirement 4: Reactivate Terminal

**User Story:** As an administrator, I want to reactivate a suspended terminal, so that it can resume normal commercial operations.

#### Acceptance Criteria

1. WHEN an administrator requests to reactivate a suspended terminal, THE system SHALL change the terminal status back to "active".
2. WHEN a terminal is reactivated, THE system SHALL allow new commercial operations to be initiated on that terminal.
3. IF a reactivation request targets a terminal that is already active, THEN THE system SHALL return an error indicating the terminal is already active.
4. WHEN a terminal status changes, THE system SHALL record the modification timestamp and the identity of the actor that performed the action.

---

### Requirement 5: List Terminals

**User Story:** As an administrator, I want to view the list of terminals for a branch, so that I can manage the checkout stations of my business.

#### Acceptance Criteria

1. WHEN an administrator requests the list of terminals, THE system SHALL return all terminals belonging to the specified branch, including code, name, status, and the count of registered devices.
2. THE system SHALL ensure that terminal information remains available for viewing even when the device has no Internet connectivity.

---

### Requirement 6: Get Terminal Details

**User Story:** As a system user, I want to view the details of a specific terminal, so that I can review its current status, configuration, and registered devices.

#### Acceptance Criteria

1. WHEN a user requests terminal details, THE system SHALL return the complete terminal profile including code, name, status, configuration, and the list of registered devices with their presence status.
2. THE system SHALL ensure that terminal details remain available for viewing even when the device has no Internet connectivity.

---

### Requirement 7: Register Device

**User Story:** As a device, I want to register myself to a terminal, so that I am authorized to perform commercial operations on behalf of that checkout station.

#### Acceptance Criteria

1. WHEN a device submits a valid registration request with a terminal identifier and installation ID, THE system SHALL create the device registration record associated with the specified terminal.
2. THE system SHALL require the following information to register a device: terminal identifier, installation ID, device name, device type, and platform.
3. WHEN a device is registered, THE system SHALL assign a unique identifier, set the status to "active", and record the registration timestamp.
4. THE system SHALL validate that the installation ID is non-empty and globally unique across all device registrations on the platform.
5. IF a device with the same installation ID is already registered to the same terminal, THEN THE system SHALL update the existing registration rather than creating a duplicate.
6. IF a device with the same installation ID is registered to a different terminal, THEN THE system SHALL reject the registration and return an error indicating the device is already registered to another terminal, regardless of organization.
7. THE system SHALL record the application version at the time of registration.

---

### Requirement 8: List Registered Devices

**User Story:** As an administrator, I want to view all devices registered to a terminal, so that I can monitor which installations are authorized to operate it.

#### Acceptance Criteria

1. WHEN an administrator requests the list of registered devices for a terminal, THE system SHALL return all device registrations including device name, device type, platform, application version, registration date, last seen timestamp, and status.
2. THE system SHALL ensure that device registration information remains available for viewing even when the device has no Internet connectivity.

---

### Requirement 9: Revoke Device

**User Story:** As an administrator, I want to revoke a device's registration, so that it is no longer authorized to perform commercial operations on the terminal.

#### Acceptance Criteria

1. WHEN an administrator requests to revoke a device registration, THE system SHALL change the device registration status to "revoked".
2. WHEN a device is revoked, THE system SHALL prevent the device from initiating new commercial operations on the terminal.
3. WHEN a device is revoked, THE system SHALL preserve the historical registration record for audit and reporting purposes.
4. WHEN a device registration status changes, THE system SHALL record the modification timestamp and the identity of the actor that performed the action.

---

### Requirement 10: Update Device Presence

**User Story:** As a device, I want to report my presence periodically, so that administrators can monitor which devices are actively communicating with the platform.

#### Acceptance Criteria

1. WHEN a registered device reports its presence, THE system SHALL update the last seen timestamp for that device registration.
2. THE system SHALL accept presence updates only from devices with an active registration status.
3. THE system SHALL accept presence updates even when the device has limited connectivity, queuing them for synchronization.
4. THE system SHALL only persist the last seen timestamp. Determining whether a device is online or offline is outside the scope of this module.

---

### Requirement 11: Update Terminal Configuration

**User Story:** As an administrator, I want to configure a terminal's operational settings, so that its behavior aligns with the specific needs of that checkout station.

#### Acceptance Criteria

1. THE system SHALL allow a terminal to define and maintain configuration settings including: currency, language, timezone, offline enabled, sync interval, receipt printer enabled, cash drawer enabled, and barcode scanner enabled.
2. WHEN an administrator updates terminal configuration, THE system SHALL persist the changes and record the modification timestamp and the identity of the actor that performed the action.
3. THE system SHALL ensure that terminal configuration remains available offline.
4. WHEN configuration changes are performed without Internet connectivity, THE system SHALL retain the changes and synchronize them automatically when connectivity is restored.

---

### Requirement 12: Get Terminal Configuration

**User Story:** As a system user, I want to retrieve the current configuration for a terminal, so that the application can apply the correct operational settings.

#### Acceptance Criteria

1. WHEN a user requests terminal configuration, THE system SHALL return the complete configuration including all operational settings.
2. THE system SHALL ensure that terminal configuration remains available for retrieval even when the device has no Internet connectivity.

---

### Requirement 13: Restore Default Configuration

**User Story:** As an administrator, I want to restore a terminal's configuration to defaults, so that I can reset any customizations back to the organization-level settings.

#### Acceptance Criteria

1. WHEN an administrator requests to restore default configuration for a terminal, THE system SHALL replace the terminal's configuration with the default values inherited from the organization configuration.
2. WHEN configuration is restored to defaults, THE system SHALL record the modification timestamp and the identity of the actor that performed the action.
3. THE system SHALL treat the restoration as a configuration update for audit purposes.

---

### Requirement 14: Tenant Isolation

**User Story:** As a business owner, I want my terminal and device data to be completely isolated from other organizations, so that my operational information remains private and secure.

#### Acceptance Criteria

1. THE system SHALL enforce that every terminal and device operation is scoped to the requesting user's organization.
2. THE system SHALL prevent any operation from accessing, modifying, or listing terminal or device data belonging to a different organization.
3. IF a request attempts to access terminal or device data from a different organization, THEN THE system SHALL reject the request and log the unauthorized access attempt.
4. THE system SHALL enforce that every terminal and device registration belongs to exactly one organization.

---

### Requirement 15: Offline Availability

**User Story:** As a user operating in an environment with unreliable connectivity, I want terminal and device information available on my device, so that the system can continue functioning without Internet.

#### Acceptance Criteria

1. THE system SHALL ensure that terminal, device registration, and terminal configuration information remains available for use even when the device has no Internet connectivity.
2. WHEN changes to terminal or device information are performed offline, THE system SHALL synchronize those changes automatically when connectivity is restored.
3. IF synchronization of a change fails, THE system SHALL retain the change and reattempt synchronization automatically on subsequent connectivity restoration.
4. THE system SHALL notify the user when changes are pending synchronization.

---

### Requirement 16: Terminal Audit

**User Story:** As an administrator, I want all changes to the terminal structure to be recorded, so that I can review who made what changes and when.

#### Acceptance Criteria

1. WHEN any terminal, device registration, or terminal configuration record is created, updated, suspended, reactivated, revoked, or restored, THE system SHALL record an audit entry containing the action performed, the entity affected, the actor that performed the action, and the timestamp.
2. WHEN an administrator requests the audit history for a terminal entity, THE system SHALL return the list of recorded changes for that entity in reverse chronological order.

---

## Business Rules

1. A terminal belongs to exactly one branch within one organization at any given time.
2. A terminal code must be unique within the organization.
3. A terminal is never physically deleted; it can only be suspended or remain active.
4. Multiple devices may be registered to the same terminal simultaneously. This module does not establish a maximum number of registered devices; device limits or licensing constraints are outside the scope of this module.
5. A device registration belongs to exactly one terminal and cannot be transferred to another terminal.
6. A device's installation ID is globally unique across the platform; a single physical installation cannot be registered to multiple terminals regardless of organization.
7. Revoking a device preserves all historical registration data for audit and reporting purposes.
8. Terminal licensing is calculated by the number of active terminals, not by the number of registered devices.
9. Devices do not consume licenses; only terminals do.
10. Each Nova POS installation generates a globally unique, persistent installation ID that remains stable across application updates and organization changes.
11. A suspended terminal preserves all data (configuration, device registrations, history) and can be reactivated to restore full operations.
12. A terminal cannot be suspended while it has active sessions or pending operations.
13. Terminal, device registration, and configuration information must be available offline to support business continuity.
14. Every terminal data record belongs to exactly one organization; cross-organization access is prohibited.
15. A terminal may exist without any registered devices. Creating a terminal does not require registering a device. Revoking the last registered device does not delete or invalidate the terminal.
16. A device registration has a lifecycle represented by the following statuses: active, revoked, inactive.
17. This module only persists device presence timestamps. Interpretation of device connectivity status belongs to application logic or future modules.

---

## Domain Events

The following domain events are anticipated for future integration with other modules. They are documented here for architectural awareness and are not part of the current implementation scope.

- **TerminalCreated**: Emitted when a new terminal is created.
- **TerminalUpdated**: Emitted when terminal information is modified.
- **TerminalSuspended**: Emitted when a terminal is suspended.
- **TerminalReactivated**: Emitted when a suspended terminal is reactivated.
- **DeviceRegistered**: Emitted when a device is registered to a terminal.
- **DeviceRevoked**: Emitted when a device registration is revoked.
- **TerminalConfigurationUpdated**: Emitted when terminal configuration is changed.
- **TerminalConfigurationRestored**: Emitted when terminal configuration is reset to defaults.
- **DeviceHeartbeatReceived**: Emitted when a device reports its presence.

---

## Future Integrations

This module is expected to integrate with the following future specifications:

- **User Management**: Terminals will be associated with user sessions for shift management.
- **Session Management**: Opening a session on a terminal will require an active terminal with a registered device.
- **Sales**: Every sale transaction will be associated with a specific terminal.
- **Cash Register**: Cash register operations (open, close, movements) will be scoped to a terminal.
- **Inventory**: Stock movements initiated from a terminal will reference the terminal.
- **Reporting**: Terminal activity reports will aggregate data per terminal.
- **Audit**: Terminal changes integrate with the platform audit service.
- **Licensing**: The number of active terminals determines the subscription tier.
- **Synchronization Engine**: Terminal and device data participate in the offline synchronization flow.

