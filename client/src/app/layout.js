import Footer from "@/components/Footer";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

export const metadata = {
  title: "Call Me Maybe",
  description: "Hey I just met you, and this is crazy, but here's my number, so call me maybe."
};

export default function RootLayout({ children }) {
  return (
    <ThemeRegistry options={{ key: "mui" }}>
      <html lang="en">
        <body style={{ backgroundColor: "#FAFAFA" }}>
          {children}
          <Footer />
        </body>
      </html>
    </ThemeRegistry>
  );
}
