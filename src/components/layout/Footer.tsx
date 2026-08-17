import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="gradient-navy-teal text-white mt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo amkClassName="h-8" subtitleClassName="h-3.5" gap="gap-1 mb-3" />
          <p className="text-sm text-white/60 leading-relaxed">
            CQC registered private medical clinic rooms. Manchester.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-white/50 mb-3">Book</p>
          <ul className="flex flex-col gap-2 text-sm text-white/75">
            <li><Link to="/rooms" className="hover:text-white">Browse rooms</Link></li>
            <li><Link to="/sign-in" className="hover:text-white">Sign in</Link></li>
            <li><Link to="/sign-up" className="hover:text-white">Create an account</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-white/50 mb-3">Practice</p>
          <ul className="flex flex-col gap-2 text-sm text-white/75">
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact &amp; directions</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-white/50 mb-3">Get in touch</p>
          <address className="text-sm text-white/75 leading-relaxed not-italic">
            1 Brickworks
            <br />
            Adlington, Manchester
            <br />
            SK10 4NL
            <br />
            <a href="tel:+447415893038" className="hover:text-white">
              07415 893038
            </a>
            <br />
            <a href="mailto:info@amkconsultinghub.co.uk" className="hover:text-white">
              info@amkconsultinghub.co.uk
            </a>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 lg:px-10 py-5 text-xs text-white/45">
        &copy; {new Date().getFullYear()} AMK Consulting Hub. Built by Monedela Software.
      </div>
    </footer>
  );
}
