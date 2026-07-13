import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import { COMPANY_INFO, STORE_HOURS } from '../mock';

const DirectionsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-14">
      <PageTitle>Directions</PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <div className="bg-[#1a1a1a] p-6">
          <h3 className="text-[#0055ff] font-bold tracking-widest mb-4">STORE ADDRESS</h3>
          <div className="space-y-4 text-sm text-white">
            <div className="flex gap-3">
              <MapPin size={18} className="text-[#0055ff] mt-0.5 shrink-0" />
              <div>
                {COMPANY_INFO.address}<br />
                {COMPANY_INFO.cityState}
              </div>
            </div>
            <div className="flex gap-3">
              <Phone size={18} className="text-[#0055ff] shrink-0" />
              <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-[#0055ff]">{COMPANY_INFO.phone}</a>
            </div>
            <div className="flex gap-3 break-all">
              <Mail size={18} className="text-[#0055ff] shrink-0" />
              <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-[#0055ff]">{COMPANY_INFO.email}</a>
            </div>
          </div>

          <h3 className="text-[#0055ff] font-bold tracking-widest mt-8 mb-4 flex items-center gap-2"><Clock size={16} /> STORE HOURS</h3>
          <ul className="text-sm space-y-1.5">
            {STORE_HOURS.map((h) => (
              <li key={h.day} className="flex justify-between">
                <span className="text-white">{h.day}</span>
                <span className="text-[#0055ff]">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#111] min-h-[520px]">
          <iframe
            title="Store Location"
            src="https://www.google.com/maps?q=9905+Davidson+Parkway,+Stockbridge,+GA+30281&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 520 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default DirectionsPage;
