import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Facebook, Instagram } from 'lucide-react';
import { COMPANY_INFO, OPENING_HOURS } from '../mock';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-lg font-bold tracking-widest mb-3">ABOUT US</h3>
          <div className="w-16 h-[2px] bg-[#0055ff] mb-5"></div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Since {COMPANY_INFO.since}, we have helped hundreds of customers buy the vehicle they want for wholesale, dealer only prices. Before bidding on a vehicle at auction, we do all of the due diligence for you that we do for our own vehicle inventory, including mechanical inspection, reviewing vehicle history reports, title check, and more.
          </p>
          <Link to="/about" className="inline-block mt-5 text-sm font-bold tracking-widest hover:text-[#0055ff] transition-colors">
            READ MORE &gt;
          </Link>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-lg font-bold tracking-widest mb-3">OPENING HOURS</h3>
          <div className="w-16 h-[2px] bg-[#0055ff] mb-5"></div>
          <ul className="text-sm space-y-2">
            {OPENING_HOURS.map((h) => (
              <li key={h.day} className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-300">{h.day}</span>
                <span className="text-white">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold tracking-widest mb-3">CONTACT</h3>
          <div className="w-16 h-[2px] bg-[#0055ff] mb-5"></div>
          <a href={`tel:${COMPANY_INFO.phone}`} className="flex items-center gap-3 text-sm hover:text-[#0055ff] transition-colors mb-6">
            <Phone size={16} className="text-gray-400" />
            <span>{COMPANY_INFO.phone}</span>
          </a>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook" className="w-10 h-10 flex items-center justify-center bg-white text-[#0038a8] hover:bg-[#0055ff] hover:text-white transition-colors">
              <Facebook size={20} fill="currentColor" strokeWidth={0} />
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 flex items-center justify-center bg-white text-[#0038a8] hover:bg-[#0055ff] hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#0038a8] text-white text-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col items-center gap-3 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <span>&copy; {new Date().getFullYear()} DealerWebsites.com</span>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:underline">Terms of use</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span className="hidden sm:inline">|</span>
            <Link to="/admin/login" className="hover:underline opacity-70 hover:opacity-100">Admin Login</Link>
          </div>
          
          {/* Zarnetic Branding */}
          <div className="mt-1 text-xs text-gray-300">
            Developed by{' '}
            <a 
              href="https://www.zarnetic.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-white hover:text-[#0055ff] hover:underline transition-colors"
            >
              Zarnetic
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;