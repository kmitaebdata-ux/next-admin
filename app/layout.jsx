import "./globals.css";

export const metadata = {
  title: "KMIT Marks Portal",
  description: "Admin / Faculty Login",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
