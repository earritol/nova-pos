'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

interface FieldError {
  field: string;
  message: string;
}

export function UpdateOrganizationForm() {
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
      commercialName: formData.get('commercialName') as string,
      taxIdentifier: formData.get('taxIdentifier') as string,
      contactEmail: (formData.get('contactEmail') as string) || null,
      contactPhone: (formData.get('contactPhone') as string) || null,
      address: (formData.get('address') as string) || null,
    };

    const validationErrors: FieldError[] = [];
    if (!input.legalName?.trim()) validationErrors.push({ field: 'legalName', message: 'Legal name cannot be empty' });
    if (!input.commercialName?.trim()) validationErrors.push({ field: 'commercialName', message: 'Commercial Name cannot be empty' });
    if (!input.taxIdentifier?.trim()) validationErrors.push({ field: 'taxIdentifier', message: 'Tax identifier cannot be empty' });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // TODO: Call OrganizationApplicationService.updateOrganization()
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="commercialName">Commercial Name *</label>
        <input id="commercialName" name="commercialName" type="text" required aria-describedby="commercialName-error" />
        {getFieldError('commercialName') && <p id="commercialName-error" role="alert">{getFieldError('commercialName')}</p>}
      </div>
      <div>
        <label htmlFor="legalName">Legal Name *</label>
        <input id="legalName" name="legalName" type="text" required aria-describedby="legalName-error" />
        {getFieldError('legalName') && <p id="legalName-error" role="alert">{getFieldError('legalName')}</p>}
      </div>
      <div>
        <label htmlFor="taxIdentifier">Tax Identifier *</label>
        <input id="taxIdentifier" name="taxIdentifier" type="text" required aria-describedby="taxIdentifier-error" />
        {getFieldError('taxIdentifier') && <p id="taxIdentifier-error" role="alert">{getFieldError('taxIdentifier')}</p>}
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
      <button type="submit">Save Changes</button>
      {success && <p role="status">Organization updated successfully</p>}
    </form>
  );
}
