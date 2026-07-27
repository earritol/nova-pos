'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

interface FieldError {
  field: string;
  message: string;
}

export function CreateBranchForm() {
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
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
    };

    const validationErrors: FieldError[] = [];
    if (!input.name?.trim()) validationErrors.push({ field: 'name', message: 'Branch name is required' });
    if (!input.address?.trim()) validationErrors.push({ field: 'address', message: 'Address is required' });
    if (!input.phone?.trim()) validationErrors.push({ field: 'phone', message: 'Phone is required' });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // TODO: Call OrganizationApplicationService.createBranch() when wired
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name">Branch Name *</label>
        <input id="name" name="name" type="text" required aria-describedby="name-error" />
        {getFieldError('name') && <p id="name-error" role="alert">{getFieldError('name')}</p>}
      </div>

      <div>
        <label htmlFor="address">Address *</label>
        <textarea id="address" name="address" required aria-describedby="address-error" />
        {getFieldError('address') && <p id="address-error" role="alert">{getFieldError('address')}</p>}
      </div>

      <div>
        <label htmlFor="phone">Phone *</label>
        <input id="phone" name="phone" type="tel" required aria-describedby="phone-error" />
        {getFieldError('phone') && <p id="phone-error" role="alert">{getFieldError('phone')}</p>}
      </div>

      <button type="submit">Create Branch</button>
      {success && <p role="status">Branch created successfully</p>}
    </form>
  );
}
