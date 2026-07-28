import type { Terminal } from '../domain/terminal';
import type { TerminalConfiguration } from '../domain/terminal-configuration';
import type { DeviceRegistration } from '../domain/device-registration';
import type { TerminalRepository } from '../domain/repositories/terminal-repository';
import type { DeviceRegistrationRepository } from '../domain/repositories/device-registration-repository';
import type { AuditService } from '../../organization/domain/audit';
import type { TenantContext } from '../../organization/domain/tenant-context';
import type { OrganizationConfiguration } from '../../organization/domain/organization-configuration';
import type { Result } from '../../organization/domain/result';
import type { SyncQueue } from '../../../sync/types';
import type { CreateTerminalInput, UpdateTerminalInput } from '../domain/validation/terminal-validation';
import type { RegisterDeviceInput } from '../domain/validation/device-registration-validation';
import type { ConfigurationInput } from './use-cases/update-configuration';
import { createTerminal } from './use-cases/create-terminal';
import { updateTerminal } from './use-cases/update-terminal';
import { suspendTerminalUseCase } from './use-cases/suspend-terminal';
import { reactivateTerminalUseCase } from './use-cases/reactivate-terminal';
import { listTerminals } from './use-cases/list-terminals';
import { getTerminalDetails } from './use-cases/get-terminal-details';
import { registerDevice } from './use-cases/register-device';
import { listRegisteredDevices } from './use-cases/list-registered-devices';
import { revokeDeviceUseCase } from './use-cases/revoke-device';
import { updateDevicePresence } from './use-cases/update-device-presence';
import { updateTerminalConfiguration } from './use-cases/update-configuration';
import { getTerminalConfiguration } from './use-cases/get-configuration';
import { restoreDefaultConfiguration } from './use-cases/restore-default-configuration';

export interface TerminalApplicationServiceDeps {
  terminalRepository: TerminalRepository;
  deviceRegistrationRepository: DeviceRegistrationRepository;
  auditService: AuditService;
  syncQueue: SyncQueue;
}

export class TerminalApplicationService {
  private readonly terminalRepo: TerminalRepository;
  private readonly deviceRepo: DeviceRegistrationRepository;
  private readonly auditService: AuditService;
  private readonly syncQueue: SyncQueue;

  constructor(deps: TerminalApplicationServiceDeps) {
    this.terminalRepo = deps.terminalRepository;
    this.deviceRepo = deps.deviceRegistrationRepository;
    this.auditService = deps.auditService;
    this.syncQueue = deps.syncQueue;
  }

  async createTerminal(orgId: string, branchId: string, input: CreateTerminalInput, actorId: string, orgConfig: OrganizationConfiguration): Promise<Result<Terminal>> {
    return createTerminal(orgId, branchId, input, actorId, orgConfig, { terminalRepository: this.terminalRepo, auditService: this.auditService, syncQueue: this.syncQueue });
  }

  async updateTerminal(tenantContext: TenantContext, terminalId: string, input: UpdateTerminalInput): Promise<Result<Terminal>> {
    return updateTerminal(tenantContext, terminalId, input, { terminalRepository: this.terminalRepo, auditService: this.auditService, syncQueue: this.syncQueue });
  }

  async suspendTerminal(tenantContext: TenantContext, terminalId: string): Promise<Result<Terminal>> {
    return suspendTerminalUseCase(tenantContext, terminalId, { terminalRepository: this.terminalRepo, auditService: this.auditService, syncQueue: this.syncQueue });
  }

  async reactivateTerminal(tenantContext: TenantContext, terminalId: string): Promise<Result<Terminal>> {
    return reactivateTerminalUseCase(tenantContext, terminalId, { terminalRepository: this.terminalRepo, auditService: this.auditService, syncQueue: this.syncQueue });
  }

  async listTerminals(tenantContext: TenantContext, branchId: string): Promise<Result<Terminal[]>> {
    return listTerminals(tenantContext, branchId, { terminalRepository: this.terminalRepo });
  }

  async getTerminalDetails(tenantContext: TenantContext, terminalId: string): Promise<Result<Terminal>> {
    return getTerminalDetails(tenantContext, terminalId, { terminalRepository: this.terminalRepo });
  }

  async registerDevice(orgId: string, terminalId: string, input: RegisterDeviceInput, actorId: string): Promise<Result<DeviceRegistration>> {
    return registerDevice(orgId, terminalId, input, actorId, { deviceRegistrationRepository: this.deviceRepo, auditService: this.auditService, syncQueue: this.syncQueue });
  }

  async listRegisteredDevices(terminalId: string): Promise<Result<DeviceRegistration[]>> {
    return listRegisteredDevices(terminalId, { deviceRegistrationRepository: this.deviceRepo });
  }

  async revokeDevice(tenantContext: TenantContext, terminalId: string, registrationId: string): Promise<Result<DeviceRegistration>> {
    return revokeDeviceUseCase(tenantContext, terminalId, registrationId, { deviceRegistrationRepository: this.deviceRepo, auditService: this.auditService, syncQueue: this.syncQueue });
  }

  async updateDevicePresence(terminalId: string, registrationId: string): Promise<Result<DeviceRegistration>> {
    return updateDevicePresence(terminalId, registrationId, { deviceRegistrationRepository: this.deviceRepo, syncQueue: this.syncQueue });
  }

  async updateConfiguration(tenantContext: TenantContext, terminalId: string, input: ConfigurationInput): Promise<Result<Terminal>> {
    return updateTerminalConfiguration(tenantContext, terminalId, input, { terminalRepository: this.terminalRepo, auditService: this.auditService, syncQueue: this.syncQueue });
  }

  async getConfiguration(tenantContext: TenantContext, terminalId: string): Promise<Result<TerminalConfiguration>> {
    return getTerminalConfiguration(tenantContext, terminalId, { terminalRepository: this.terminalRepo });
  }

  async restoreDefaultConfiguration(tenantContext: TenantContext, terminalId: string, orgConfig: OrganizationConfiguration): Promise<Result<Terminal>> {
    return restoreDefaultConfiguration(tenantContext, terminalId, orgConfig, { terminalRepository: this.terminalRepo, auditService: this.auditService, syncQueue: this.syncQueue });
  }
}
