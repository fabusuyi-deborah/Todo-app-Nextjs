// src/components/layout/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto  py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Todo App. Built with ❤️ by Debbyiecodes.
      </div>
    </footer>
  );
};

export default Footer;