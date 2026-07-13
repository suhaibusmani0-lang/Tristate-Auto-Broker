import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Menu, X } from 'lucide-react';
import { COMPANY_INFO } from '../mock';

const navItems = [
  { to: '/', label: 'HOME' },
  { to: '/about', label: 'ABOUT' },
  { to: '/inventory', label: 'CARS FOR SALE' },
  { to: '/vehicle-finder', label: 'VEHICLE FINDER' },
  { to: '/financing', label: 'FINANCING' },
  { to: '/make-a-deposit', label: 'MAKE A DEPOSIT' },
  { to: '/directions', label: 'DIRECTIONS' },
  { to: '/contact', label: 'CONTACT US' },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-black text-white sticky top-0 z-50 shadow-lg site-header">
      {/* Top blue bar */}
      <div className="bg-[#0038a8] text-white text-xs uppercase tracking-wider">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">
          <span className="font-semibold">SAVE THOUSANDS OVER RETAIL!</span>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
              <Facebook size={16} fill="white" strokeWidth={0} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Logo + Contact strip */}
      <div
        className="bg-[#111] border-b border-[#0038a8]/60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center px-4 py-4 gap-3">
          {/* Left: Phone */}
          <div className="hidden md:block text-white text-sm space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-semibold w-14">Phone</span>
              <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-[#0055ff] transition-colors">
                {COMPANY_INFO.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold w-14">Text us</span>
              <a href={`sms:${COMPANY_INFO.textUs}`} className="hover:text-[#0055ff] transition-colors">
                {COMPANY_INFO.textUs}
              </a>
            </div>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="flex items-center justify-center group">
            <img
              src="/logo.png"
              alt="Tri State Auto Brokers"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </Link>

          {/* Right: Address */}
          <div className="hidden md:flex items-start justify-end gap-2 text-white text-sm">
            <MapPin size={18} className="text-[#0055ff] mt-0.5" />
            <div className="font-semibold leading-tight">
              <div>{COMPANY_INFO.address}</div>
              <div>{COMPANY_INFO.cityState}</div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden absolute right-4 top-16 text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="bg-[#111] border-b-2 border-[#0055ff]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <ul className={`${open ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:justify-between items-stretch md:items-center`}>
            {navItems.map((item) => (
              <li key={item.to} className="flex-1 text-center">
                <NavLink
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-4 text-[13px] font-semibold tracking-wider uppercase transition-colors duration-200 ${
                      isActive
                        ? 'text-[#0055ff]'
                        : 'text-white hover:text-[#0055ff]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
