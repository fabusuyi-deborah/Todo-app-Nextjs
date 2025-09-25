// src/app/layout.jsx
import "@/app/globals.css"; // your global CSS
import NavBar from "@/components/layouts/navBar";
import Footer from "@/components/layouts/footer";

export const metadata = {
  title: "Task Buddy",
  description: "Manage your tasks like a buddy would!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#f5f5f7]">
        <NavBar />
        <main className="flex-grow flex items-center justify-center px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
