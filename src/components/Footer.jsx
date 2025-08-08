import React from "react";
import { Mail, Instagram, Twitter, Twitch } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        {/* About */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">About</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Our Story
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Team
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Partners
              </a>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Products
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Cookie Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Legal Notice
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:contact@example.com"
                className="flex items-center gap-2 hover:underline"
              >
                <Mail className="h-5 w-5" />
                Email Us
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-4 text-xl">
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-gray-200"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-gray-200"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-gray-200"
            >
              <Twitch className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
