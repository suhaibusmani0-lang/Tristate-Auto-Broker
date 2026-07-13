import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import { COMPANY_INFO, STORE_HOURS } from '../mock';
import { submitContact } from '../lib/api';

const Field = ({ label, value, onChange, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={label}
    className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-4 py-3 outline-none placeholder:text-gray-500"
  />
);

const ContactPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContact(form);
      setSubmitted(true);
      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-14">
      <PageTitle>Contact Tri State Auto Brokers, Inc.</PageTitle>
      <p className="text-center text-gray-300 text-sm">To contact us, please fill out the contact form below or simply call our office anytime.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
        <div className="bg-[#1a1a1a]">
          {[
            { icon: MapPin, title: 'ADDRESS', content: <>{COMPANY_INFO.address}<br />{COMPANY_INFO.cityState}</> },
            { icon: Phone, title: 'PHONE', content: COMPANY_INFO.phone },
            { icon: Mail, title: 'EMAIL', content: COMPANY_INFO.email },
          ].map(({ icon: Icon, title, content }) => (
            <div key={title} className="grid grid-cols-[70px_1fr] items-center border-b border-white/5 min-h-[100px]">
              <div className="flex justify-center">
                <Icon size={26} className="text-[#0055ff]" />
              </div>
              <div className="pl-4">
                <div className="text-[#0055ff] font-bold tracking-widest text-sm">{title}</div>
                <div className="text-white text-sm mt-1">{content}</div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-[70px_1fr] items-start border-b border-white/5 min-h-[240px] py-4">
            <div className="flex justify-center pt-1">
              <Clock size={26} className="text-[#0055ff]" />
            </div>
            <div className="pl-4">
              <div className="text-[#0055ff] font-bold tracking-widest text-sm mb-3">STORE HOURS:</div>
              <ul className="text-sm space-y-1.5">
                {STORE_HOURS.map((h) => (
                  <li key={h.day} className="grid grid-cols-2 gap-2">
                    <span className="text-white">{h.day}</span>
                    <span className="text-[#0055ff]">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="First name:" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
          <Field label="Last name:" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
          <Field label="Email:" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Phone:" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <textarea
            placeholder="Message:"
            rows={7}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-4 py-3 outline-none placeholder:text-gray-500"
          />
          <button type="submit" className="bg-[#0038a8] hover:bg-[#0055ff] text-white font-semibold uppercase tracking-widest px-10 py-3 transition-colors">Submit</button>
          {submitted && <p className="text-green-400 text-sm">Thank you! We\u2019ll get back to you soon.</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
