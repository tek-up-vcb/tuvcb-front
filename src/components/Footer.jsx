import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div className="flex items-start gap-3">
            <div>
              <p className="font-semibold">TEK-UP Digital Credentials</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Secure, verifiable certifications • Tunisia</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/login" className="hover:underline">Login</Link></li>
              <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
          <p>© {year} TEK-UP University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
