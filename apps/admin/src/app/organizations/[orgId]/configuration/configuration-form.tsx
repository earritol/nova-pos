'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

export function ConfigurationForm() {
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    void formData; // Configuration values will be used when wired to Application Service

    // TODO: Call OrganizationApplicationService.updateConfiguration()
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="timeZone">Time Zone</label>
        <select id="timeZone" name="timeZone">
          <option value="America/Mexico_City">America/Mexico_City</option>
          <option value="America/New_York">America/New_York</option>
          <option value="America/Bogota">America/Bogota</option>
        </select>
      </div>
      <div>
        <label htmlFor="currency">Currency</label>
        <select id="currency" name="currency">
          <option value="MXN">MXN</option>
          <option value="USD">USD</option>
          <option value="COP">COP</option>
        </select>
      </div>
      <div>
        <label htmlFor="language">Language</label>
        <select id="language" name="language">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>
      <div>
        <label htmlFor="dateFormat">Date Format</label>
        <input id="dateFormat" name="dateFormat" type="text" defaultValue="DD/MM/YYYY" />
      </div>
      <div>
        <label htmlFor="numberFormat">Number Format</label>
        <input id="numberFormat" name="numberFormat" type="text" defaultValue="1,234.56" />
      </div>
      <div>
        <label htmlFor="taxLabel">Tax Label</label>
        <input id="taxLabel" name="taxLabel" type="text" defaultValue="RFC" />
      </div>
      <button type="submit">Save Configuration</button>
      {success && <p role="status">Configuration updated successfully</p>}
    </form>
  );
}
