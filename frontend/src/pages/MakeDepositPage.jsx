import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import { submitDeposit } from '../lib/api';

const MakeDepositPage = () => {
  const [form, setForm] = useState({ amount: '', stock: '', name: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitDeposit(form);
      setSubmitted(true);
      setForm({ amount: '', stock: '', name: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-14">
      <PageTitle>Make a deposit to Tri State Auto Brokers, Inc.</PageTitle>
      <div className="space-y-4 text-gray-200 leading-relaxed max-w-5xl mx-auto text-center text-sm">
        <p>
          Vivamus convallis eros interdum lorem sodales, in aliquam nunc lobortis. Vivamus pellentesque libero sit amet elementum lobortis. Duis id nulla accumsan, vehicula elit non, pellentesque dolor. Aliquam in sapien sit amet massa facilisis mollis aliquam ac nisl. Morbi eget rutrum enim. In posuere pharetra imperdiet. Vestibulum dapibus, sem eget vestibulum malesuada, nunc sapien semper purus, sollicitudin facilisis sem lorem nec ligula.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 bg-[#1a1a1a] p-8 max-w-xl mx-auto">
        <h3 className="text-white text-lg font-semibold mb-2 text-center">Deposit Details</h3>
        <div className="w-14 h-[2px] bg-[#0055ff] mx-auto mb-6"></div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white mb-1"><span className="text-[#0055ff] mr-1">*</span>Amount (USD)</label>
            <input
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none"
              placeholder="$500"
            />
          </div>
          <div>
            <label className="block text-xs text-white mb-1">Vehicle Stock Number</label>
            <input
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white mb-1"><span className="text-[#0055ff] mr-1">*</span>Full Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#0038a8] hover:bg-[#0055ff] text-white font-semibold uppercase tracking-widest py-3 transition-colors"
          >
            Continue to Payment
          </button>
          {submitted && <p className="text-green-400 text-sm text-center">Thank you! We&apos;ll contact you to complete your deposit.</p>}
        </div>
      </form>
    </div>
  );
};

export default MakeDepositPage;
