import * as fc from 'fast-check';
import type { CreateOrganizationInput } from '../domain/validation/organization-validation';
import type { CreateBranchInput, UpdateBranchInput } from '../domain/validation/branch-validation';
import { COUNTRY_DEFAULTS } from '../domain/organization-configuration';

const supportedCountries = Object.keys(COUNTRY_DEFAULTS);
const supportedCurrencies = Object.values(COUNTRY_DEFAULTS).map((d) => d.currency);
const supportedTimeZones = Object.values(COUNTRY_DEFAULTS).map((d) => d.timeZone);

export const validCountry = fc.constantFrom(...supportedCountries);
export const validCurrency = fc.constantFrom(...supportedCurrencies);
export const validTimeZone = fc.constantFrom(...supportedTimeZones);

export const nonEmptyString = (maxLength: number) =>
  fc.string({ minLength: 1, maxLength }).filter((s) => s.trim().length > 0);

export const validEmail = fc.tuple(
  fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[^\s@]+$/.test(s)),
  fc.string({ minLength: 1, maxLength: 10 }).filter((s) => /^[^\s@]+$/.test(s)),
  fc.constantFrom('com', 'org', 'net', 'mx'),
).map(([user, domain, tld]) => `${user}@${domain}.${tld}`);

export const validCreateOrganizationInput: fc.Arbitrary<CreateOrganizationInput> = fc.record({
  legalName: nonEmptyString(255),
  commercialName: nonEmptyString(255),
  taxIdentifier: nonEmptyString(100),
  country: validCountry,
  timeZone: validTimeZone,
  currency: validCurrency,
  contactEmail: fc.option(validEmail, { nil: null }),
  contactPhone: fc.option(nonEmptyString(50), { nil: null }),
  address: fc.option(nonEmptyString(500), { nil: null }),
});

export const invalidCreateOrganizationInput: fc.Arbitrary<CreateOrganizationInput> = fc.oneof(
  fc.record({
    legalName: fc.constant(''),
    commercialName: nonEmptyString(255),
    taxIdentifier: nonEmptyString(100),
    country: validCountry,
    timeZone: validTimeZone,
    currency: validCurrency,
  }),
  fc.record({
    legalName: nonEmptyString(255),
    commercialName: fc.constant('   '),
    taxIdentifier: nonEmptyString(100),
    country: validCountry,
    timeZone: validTimeZone,
    currency: validCurrency,
  }),
  fc.record({
    legalName: nonEmptyString(255),
    commercialName: nonEmptyString(255),
    taxIdentifier: fc.constant(''),
    country: validCountry,
    timeZone: validTimeZone,
    currency: validCurrency,
  }),
  fc.record({
    legalName: nonEmptyString(255),
    commercialName: nonEmptyString(255),
    taxIdentifier: nonEmptyString(100),
    country: fc.constant('INVALID'),
    timeZone: validTimeZone,
    currency: validCurrency,
  }),
  fc.record({
    legalName: nonEmptyString(255),
    commercialName: nonEmptyString(255),
    taxIdentifier: nonEmptyString(100),
    country: validCountry,
    timeZone: fc.constant('Invalid/Zone'),
    currency: validCurrency,
  }),
  fc.record({
    legalName: nonEmptyString(255),
    commercialName: nonEmptyString(255),
    taxIdentifier: nonEmptyString(100),
    country: validCountry,
    timeZone: validTimeZone,
    currency: fc.constant('ZZZ'),
  }),
);

export const validCreateBranchInput: fc.Arbitrary<CreateBranchInput> = fc.record({
  name: nonEmptyString(255),
  code: nonEmptyString(50),
  address: nonEmptyString(500),
  phone: nonEmptyString(50),
});

export const invalidCreateBranchInput: fc.Arbitrary<CreateBranchInput> = fc.oneof(
  fc.record({
    name: fc.constant(''),
    code: nonEmptyString(50),
    address: nonEmptyString(500),
    phone: nonEmptyString(50),
  }),
  fc.record({
    name: nonEmptyString(255),
    code: fc.constant(''),
    address: nonEmptyString(500),
    phone: nonEmptyString(50),
  }),
  fc.record({
    name: nonEmptyString(255),
    code: nonEmptyString(50),
    address: fc.constant(''),
    phone: nonEmptyString(50),
  }),
  fc.record({
    name: nonEmptyString(255),
    code: nonEmptyString(50),
    address: nonEmptyString(500),
    phone: fc.constant('   '),
  }),
);

export const validUpdateBranchInput: fc.Arbitrary<UpdateBranchInput> = fc.record({
  name: fc.option(nonEmptyString(255), { nil: undefined }),
  address: fc.option(nonEmptyString(500), { nil: undefined }),
  phone: fc.option(nonEmptyString(50), { nil: undefined }),
});
