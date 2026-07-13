import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { fetchVehicle, submitInquiry, vehicleImageUrls, vehicleTitle } from '../lib/api';

const FormField = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-gray-300 mb-1">{label}:</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none"
    />
  </div>
);

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchVehicle(id)
      .then(setVehicle)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-white">
        <p>Vehicle not found.</p>
        <Link to="/inventory" className="text-[#0055ff] underline mt-4 inline-block">Back to Inventory</Link>
      </div>
    );
  }

  if (!vehicle) {
    return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-gray-400">Loading\u2026</div>;
  }

  const images = vehicleImageUrls(vehicle);
  const primaryImg = images[imgIdx] || 'https://placehold.co/1200x750/111/999?text=No+Image';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitInquiry(vehicle.id, form);
      setSubmitted(true);
      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 3500);
    } catch {
      // ignore
    }
  };

  const features = vehicle.features || [];
  const half = Math.ceil(features.length / 2);
  const colA = features.slice(0, half);
  const colB = features.slice(half);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-14">
      <div className="py-4">
        <Link to="/inventory" className="text-[#0055ff] text-sm hover:underline">&lt; Back to Inventory</Link>
      </div>

      <h1 className="text-white text-2xl md:text-3xl font-semibold">{vehicleTitle(vehicle)}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
        <div id="photos">
          <div className="relative bg-[#111] aspect-[16/10] overflow-hidden">
            <img src={primaryImg} alt={vehicleTitle(vehicle)} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-[#0038a8] text-white flex items-center justify-center transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-[#0038a8] text-white flex items-center justify-center transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-6 gap-2 mt-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-[4/3] overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-[#0055ff]' : 'border-transparent'}`}
                >
                  <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="bg-[#0038a8] text-white p-6 text-center">
            <div className="text-3xl font-bold">{vehicle.down_payment}</div>
            <div className="text-sm mt-2 opacity-90">{vehicle.price}</div>
          </div>
          <div className="bg-[#1a1a1a] mt-2 divide-y divide-white/5 text-sm">
            {[
              ['Stock', vehicle.stock_number],
              ['Engine', vehicle.engine],
              ['Trans', vehicle.transmission],
              ['Drivetrain', vehicle.drivetrain],
              ['VIN', vehicle.vin],
              ['Mileage', (vehicle.mileage || 0).toLocaleString()],
              ['Ext Color', vehicle.exterior_color],
              ['Int Color', vehicle.interior_color],
              ['Fuel', vehicle.fuel_type],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between px-4 py-2.5">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-medium text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-[#1a1a1a]">
        <div className="bg-[#0038a8] text-white font-semibold px-5 py-3">Comments</div>
        <div className="p-5 text-gray-200 text-sm">PLEASE CALL US FOR FURTHER INFORMATION.</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-6">
        <div className="bg-[#1a1a1a]">
          <div className="bg-[#0038a8] text-white font-semibold px-5 py-3">Features</div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-200">
            {[colA, colB].map((col, i) => (
              <ul key={i} className="space-y-2">
                {col.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check size={14} className="text-[#0055ff] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1a1a]">
          <div className="bg-[#0038a8] text-white font-semibold px-5 py-3">Inquire about this vehicle</div>
          <form onSubmit={handleSubmit} className="p-5 space-y-3 text-sm">
            <p className="text-gray-300">Vehicle interested in: <span className="text-white font-semibold">{vehicleTitle(vehicle)}</span></p>
            <p className="text-gray-400 text-xs">If you have questions about this vehicle, please enter them below.</p>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
              <FormField label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
            </div>
            <FormField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <FormField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <div>
              <label className="block text-gray-300 mb-1">Message:</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-[#0038a8] hover:bg-[#0055ff] text-white font-semibold uppercase tracking-widest py-3 transition-colors">Submit</button>
            {submitted && <p className="text-green-400 text-sm">Thank you! We\u2019ll be in touch shortly.</p>}
          </form>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 leading-relaxed mt-8 border-t border-white/5 pt-6">
        Disclaimer: All advertised prices exclude government fees and taxes, any finance charges, any dealer document preparation charge, and any emission testing charge. Vehicle availability is not guaranteed and subject to prior sale. All vehicle details advertised are true to our best knowledge, but not guaranteed. It is the customer\u2019s sole responsibility to verify the existence and condition of any equipment listed. The dealership is not responsible for misprints on prices or equipment.
      </p>
    </div>
  );
};

export default VehicleDetailPage;
