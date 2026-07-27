'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

interface FieldError {
  field: string;
  message: string;
}

export function CreateOrganizationForm() {
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [success, setSuccess] = useState(false);

  function getFieldError(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const input = {
      legalName: formData.get('legalName') as string,
      tradeName: formData.get('tradeName') as string,
      taxIdentifier: formData.get('taxIdentifier') as string,
      country: formData.get('country') as string,
      timeZone: formData.get('timeZone') as string,
      currency: formData.get('currency') as string,
      contactEmail: (formData.get('contactEmail') as string) || null,
      contactPhone: (formData.get('contactPhone') as string) || null,
      address: (formData.get('address') as string) || null,
    };

    // Client-side validation
    const validationErrors: FieldError[] = [];
    if (!input.legalName?.trim()) validationErrors.push({ field: 'legalName', message: 'Legal name is required' });
    if (!input.tradeName?.trim()) validationErrors.push({ field: 'tradeName', message: 'Trade name is required' });
    if (!input.taxIdentifier?.trim()) validationErrors.push({ field: 'taxIdentifier', message: 'Tax identifier is required' });
    if (!input.country) validationErrors.push({ field: 'country', message: 'Country is required' });
    if (!input.timeZone) validationErrors.push({ field: 'timeZone', message: 'Time zone is required' });
    if (!input.currency) validationErrors.push({ field: 'currency', message: 'Currency is required' });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // TODO: Call OrganizationApplicationService.createOrganization() when wired
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="legalName">Legal Name *</label>
        <input id="legalName" name="legalName" type="text" required aria-describedby="legalName-error" />
        {getFieldError('legalName') && <p id="legalName-error" role="alert">{getFieldError('legalName')}</p>}
      </div>

      <div>
        <label htmlFor="tradeName">Trade Name *</label>
        <input id="tradeName" name="tradeName" type="text" required aria-describedby="tradeName-error" />
        {getFieldError('tradeName') && <p id="tradeName-error" role="alert">{getFieldError('tradeName')}</p>}
      </div>

      <div>
        <label htmlFor="taxIdentifier">Tax Identifier *</label>
        <input id="taxIdentifier" name="taxIdentifier" type="text" required aria-describedby="taxIdentifier-error" />
        {getFieldError('taxIdentifier') && <p id="taxIdentifier-error" role="alert">{getFieldError('taxIdentifier')}</p>}
      </div>

      <div>
        <label htmlFor="country">Country *</label>
        <select id="country" name="country" required aria-describedby="country-error">
          <option value="">Select country</option>
          <option value="MEX">Mexico</option>
          <option value="USA">United States</option>
          <option value="COL">Colombia</option>
        </select>
        {getFieldError('country') && <p id="country-error" role="alert">{getFieldError('country')}</p>}
      </div>

      <div>
        <label htmlFor="timeZone">Time Zone *</label>
        <select id="timeZone" name="timeZone" required aria-describedby="timeZone-error">
          <option value="">Select time zone</option>
          <option value="America/Mexico_City">America/Mexico_City</option>
          <option value="America/New_York">America/New_York</option>
          <option value="America/Bogota">America/Bogota</option>
        </select>
        {getFieldError('timeZone') && <p id="timeZone-error" role="alert">{getFieldError('timeZone')}</p>}
      </div>

      <div>
        <label htmlFor="currency">Currency *</label>
        <select id="currency" name="currency" required aria-describedby="currency-error">
          <option value="">Select currency</option>
          <option value="MXN">MXN</option>
          <option value="USD">USD</option>
          <option value="COP">COP</option>
        </select>
        {getFieldError('currency') && <p id="currency-error" role="alert">{getFieldError('currency')}</p>}
      </div>

      <div>
        <label htmlFor="contactEmail">Contact Email</label>
        <input id="contactEmail" name="contactEmail" type="email" />
      </div>

      <div>
        <label htmlFor="contactPhone">Contact Phone</label>
        <input id="contactPhone" name="contactPhone" type="tel" />
      </div>

      <div>
        <label htmlFor="address">Address</label>
        <textarea id="address" name="address" />
      </div>

      <button type="submit">Create Organization</button>
      {success && <p role="status">Organization created successfully</p>}
    </form>
  );
}
