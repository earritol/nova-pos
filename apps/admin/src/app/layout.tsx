import type { ReactNode } from 'react';

export const metadata = {
  title: 'Nova POS Admin',
  description: 'Organization Management',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
