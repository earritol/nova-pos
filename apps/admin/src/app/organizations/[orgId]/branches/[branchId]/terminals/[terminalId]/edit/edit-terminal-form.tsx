'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

interface FieldError { field: string; message: string; }

export function EditTerminalForm() {
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
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;

    const validationErrors: FieldError[] = [];
    if (!code?.trim()) validationErrors.push({ field: 'code', message: 'Terminal code cannot be empty' });
    if (!name?.trim()) validationErrors.push({ field: 'name', message: 'Terminal name cannot be empty' });

    if (validationErrors.length > 0) { setErrors(validationErrors); return; }

    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="code">Terminal Code *</label>
        <input id="code" name="code" type="text" required aria-describedby="code-error" />
        {getFieldError('code') && <p id="code-error" role="alert">{getFieldError('code')}</p>}
      </div>
      <div>
        <label htmlFor="name">Terminal Name *</label>
        <input id="name" name="name" type="text" required aria-describedby="name-error" />
        {getFieldError('name') && <p id="name-error" role="alert">{getFieldError('name')}</p>}
      </div>
      <button type="submit">Save Changes</button>
      {success && <p role="status">Terminal updated successfully</p>}
    </form>
  );
}
