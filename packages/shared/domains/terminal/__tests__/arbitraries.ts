import * as fc from 'fast-check';
import type { CreateTerminalInput } from '../domain/validation/terminal-validation';
import type { RegisterDeviceInput } from '../domain/validation/device-registration-validation';

const nonEmptyStr = (max: number) => fc.string({ minLength: 1, maxLength: max }).filter((s) => s.trim().length > 0);

export const validCreateTerminalInput: fc.Arbitrary<CreateTerminalInput> = fc.record({
  code: nonEmptyStr(50),
  name: nonEmptyStr(255),
});

export const invalidCreateTerminalInput: fc.Arbitrary<CreateTerminalInput> = fc.oneof(
  fc.record({ code: fc.constant(''), name: nonEmptyStr(255) }),
  fc.record({ code: nonEmptyStr(50), name: fc.constant('   ') }),
);

export const validRegisterDeviceInput: fc.Arbitrary<RegisterDeviceInput> = fc.record({
  installationId: nonEmptyStr(100),
  deviceName: nonEmptyStr(255),
  deviceType: nonEmptyStr(50),
  platform: nonEmptyStr(50),
  applicationVersion: nonEmptyStr(20),
});

export const invalidRegisterDeviceInput: fc.Arbitrary<RegisterDeviceInput> = fc.oneof(
  fc.record({ installationId: fc.constant(''), deviceName: nonEmptyStr(255), deviceType: nonEmptyStr(50), platform: nonEmptyStr(50), applicationVersion: nonEmptyStr(20) }),
  fc.record({ installationId: nonEmptyStr(100), deviceName: fc.constant(''), deviceType: nonEmptyStr(50), platform: nonEmptyStr(50), applicationVersion: nonEmptyStr(20) }),
);
