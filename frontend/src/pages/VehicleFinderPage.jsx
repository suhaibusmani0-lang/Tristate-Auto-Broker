import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import { submitVehicleFinder } from '../lib/api';

const Field = ({ label, required, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-sm text-white mb-1">
      {required && <span className="text-[#0055ff] mr-1">*</span>}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none"
    />
  </div>
);

const VehicleFinderPage = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    dayPhone: '', eveningPhone: '', bestTime: '',
    year: '', make: '', model: '',
    engine: '', mileage: '', priceRange: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (k) => (v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitVehicleFinder(form);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      <PageTitle>Vehicle Finder Form by Tri State Auto Brokers, Inc.</PageTitle>

      <div className="space-y-4 text-center text-gray-300 max-w-4xl mx-auto text-sm leading-relaxed">
        <p>If you don\u2019t see the exact vehicle you are searching for in our inventory, we can likely find the vehicle for you through our many sources.</p>
        <p>Simply fill out and submit this short form and we will begin our no-obligation, Advanced Vehicle Search right away. Don\u2019t delay. We have found vehicles for hundreds of satisfied customers who have utilized this service.</p>
        <p>Simply fill out this one form and we will get back with you asap!</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <div>
          <h3 className="text-white font-semibold border-b border-[#0055ff] pb-2 mb-4">Vehicle Finder - Please fill out all of the required fields</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="First Name" required value={form.firstName} onChange={update('firstName')} />
            <Field label="Last Name" required value={form.lastName} onChange={update('lastName')} />
            <Field label="Email" required type="email" value={form.email} onChange={update('email')} />
            <Field label="Day Phone" required value={form.dayPhone} onChange={update('dayPhone')} />
            <Field label="Evening Phone" required value={form.eveningPhone} onChange={update('eveningPhone')} />
            <Field label="Best time to call" required value={form.bestTime} onChange={update('bestTime')} />
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold border-b border-[#0055ff] pb-2 mb-4">Vehicle Desired - Please add as much information as possible</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Year ( or year range )" value={form.year} onChange={update('year')} />
            <Field label="Make" value={form.make} onChange={update('make')} />
            <Field label="Model" value={form.model} onChange={update('model')} />
            <Field label="Engine" value={form.engine} onChange={update('engine')} />
            <Field label="Mileage (maximum)" value={form.mileage} onChange={update('mileage')} />
            <Field label="Price (maximum or range)" value={form.priceRange} onChange={update('priceRange')} />
          </div>
          <div className="mt-4">
            <label className="block text-sm text-white mb-1">Please add as many features that you are looking for here, color choices, etc.</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={5}
              className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none"
            />
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="bg-[#0038a8] hover:bg-[#0055ff] text-white font-semibold uppercase tracking-widest px-16 py-4 transition-colors">Submit</button>
          {submitted && <p className="text-green-400 text-sm mt-4">Thanks! We\u2019ll begin your Advanced Vehicle Search shortly.</p>}
        </div>
      </form>
    </div>
  );
};

export default VehicleFinderPage;
