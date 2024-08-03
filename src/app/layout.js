import './globals.css';
import ThemeRegistry from './ThemeRegistry';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({ children }) {
  return (
    <ThemeRegistry options={{ key: 'mui' }}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThemeRegistry>
  );
}