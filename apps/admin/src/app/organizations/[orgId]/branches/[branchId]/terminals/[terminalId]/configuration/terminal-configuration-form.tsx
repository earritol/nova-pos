'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

export function TerminalConfigurationForm() {
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);
    void new FormData(event.currentTarget);
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
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
        <label htmlFor="timezone">Timezone</label>
        <select id="timezone" name="timezone">
          <option value="America/Mexico_City">America/Mexico_City</option>
          <option value="America/New_York">America/New_York</option>
          <option value="America/Bogota">America/Bogota</option>
        </select>
      </div>
      <fieldset>
        <legend>Peripherals</legend>
        <label><input type="checkbox" name="receiptPrinterEnabled" /> Receipt Printer</label>
        <label><input type="checkbox" name="cashDrawerEnabled" /> Cash Drawer</label>
        <label><input type="checkbox" name="barcodeScannerEnabled" /> Barcode Scanner</label>
      </fieldset>
      <button type="submit">Save Configuration</button>
      <button type="button">Restore Defaults</button>
      {success && <p role="status">Configuration saved</p>}
    </form>
  );
}
