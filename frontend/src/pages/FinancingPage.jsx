import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import { submitCreditApplication } from '../lib/api';

const Field = ({ label, required, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-xs text-white mb-1">
      {required && <span className="text-[#0055ff] mr-1">*</span>}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none text-sm"
    />
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-white font-semibold border-b border-[#0055ff] pb-2 mb-4">{title}</h3>
    {children}
  </div>
);

const FinancingPage = () => {
  const [form, setForm] = useState({});
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showCoApplicant, setShowCoApplicant] = useState(false);

  const set = (k) => (v) => setForm({ ...form, [k]: v });
  const g = (k) => form[k] || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    try {
      await submitCreditApplication({
        firstName: form.firstName || '',
        lastName: form.lastName || '',
        email: form.email || '',
        signature,
        data: form,
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <PageTitle>Secure Credit Application</PageTitle>
      <p className="text-center text-gray-300 text-sm max-w-4xl mx-auto">
        We offer many sources of financing for our vehicles, including through credit unions. We are able to help arrange financing for most people. Please fill out form completely in order to qualify.
      </p>

      <form onSubmit={handleSubmit} className="mt-10">
        {!showCoApplicant && (
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setShowCoApplicant(true)}
              className="inline-flex items-stretch bg-[#1a1a1a] border border-white/10 hover:border-[#0055ff]/60 overflow-hidden transition-colors group"
            >
              <span className="flex items-center justify-center bg-[#0055ff] group-hover:bg-[#0038a8] w-12 transition-colors">
                <Plus size={20} className="text-white" strokeWidth={3} />
              </span>
              <span className="px-6 py-3 text-white text-sm font-semibold">Add Co-Applicant</span>
            </button>
          </div>
        )}

        <Section title="Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="First Name" required value={g('firstName')} onChange={set('firstName')} />
            <Field label="Day Phone" required value={g('dayPhone')} onChange={set('dayPhone')} />
            <Field label="Email" required type="email" value={g('email')} onChange={set('email')} />
            <Field label="Middle Initial" value={g('middleInit')} onChange={set('middleInit')} />
            <Field label="Evening Phone" value={g('eveningPhone')} onChange={set('eveningPhone')} />
            <Field label="Social Security Number" required value={g('ssn')} onChange={set('ssn')} />
            <Field label="Last Name" required value={g('lastName')} onChange={set('lastName')} />
            <Field label="Best time to call?" required value={g('bestTime')} onChange={set('bestTime')} />
            <Field label="Date of Birth" required type="date" value={g('dob')} onChange={set('dob')} />
          </div>
        </Section>

        <Section title="Address Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Street" required value={g('street')} onChange={set('street')} />
            <Field label="Do you rent or own?" required value={g('rentOwn')} onChange={set('rentOwn')} />
            <Field label="Previous Rent or Own (if less than two years)" value={g('prevRentOwn')} onChange={set('prevRentOwn')} />
            <Field label="Apt. No." value={g('apt')} onChange={set('apt')} />
            <Field label="Landlord / Mortgage Company" value={g('landlord')} onChange={set('landlord')} />
            <Field label="Previous Street" value={g('prevStreet')} onChange={set('prevStreet')} />
            <Field label="City" required value={g('city')} onChange={set('city')} />
            <Field label="Rent / Mortgage Payment" value={g('rentPayment')} onChange={set('rentPayment')} />
            <Field label="Previous Apt. No." value={g('prevApt')} onChange={set('prevApt')} />
            <Field label="State" required value={g('state')} onChange={set('state')} />
            <Field label="Years" value={g('years')} onChange={set('years')} />
            <Field label="Previous City" value={g('prevCity')} onChange={set('prevCity')} />
            <Field label="Zip" required value={g('zip')} onChange={set('zip')} />
            <Field label="Months" value={g('months')} onChange={set('months')} />
            <Field label="Previous State" value={g('prevState')} onChange={set('prevState')} />
          </div>
        </Section>

        <Section title="Employment Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Employment Status" required value={g('empStatus')} onChange={set('empStatus')} />
            <Field label="Years" value={g('empYears')} onChange={set('empYears')} />
            <Field label="Previous Employer (if less than two years)" value={g('prevEmp')} onChange={set('prevEmp')} />
            <Field label="Company Name" value={g('company')} onChange={set('company')} />
            <Field label="Months" value={g('empMonths')} onChange={set('empMonths')} />
            <Field label="Previous Occupation" value={g('prevOccupation')} onChange={set('prevOccupation')} />
            <Field label="Occupation" value={g('occupation')} onChange={set('occupation')} />
            <Field label="Net Income" value={g('netIncome')} onChange={set('netIncome')} />
            <Field label="Previous City" value={g('prevEmpCity')} onChange={set('prevEmpCity')} />
            <Field label="Business Phone" value={g('businessPhone')} onChange={set('businessPhone')} />
            <Field label="Additional Monthly Income" value={g('addlIncome')} onChange={set('addlIncome')} />
            <Field label="Previous State" value={g('prevEmpState')} onChange={set('prevEmpState')} />
          </div>
        </Section>

        {showCoApplicant && (
          <>
            <Section title="Co-Applicant Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="First Name" required value={g('co_firstName')} onChange={set('co_firstName')} />
                <Field label="Day Phone" required value={g('co_dayPhone')} onChange={set('co_dayPhone')} />
                <Field label="Email" required type="email" value={g('co_email')} onChange={set('co_email')} />
                <Field label="Middle Initial" value={g('co_middleInit')} onChange={set('co_middleInit')} />
                <Field label="Evening Phone" value={g('co_eveningPhone')} onChange={set('co_eveningPhone')} />
                <Field label="Social Security Number" required value={g('co_ssn')} onChange={set('co_ssn')} />
                <Field label="Last Name" required value={g('co_lastName')} onChange={set('co_lastName')} />
                <Field label="Best time to call?" required value={g('co_bestTime')} onChange={set('co_bestTime')} />
                <Field label="Date of Birth" required type="date" value={g('co_dob')} onChange={set('co_dob')} />
              </div>
            </Section>

            <Section title="Co-Applicant Address Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Street" required value={g('co_street')} onChange={set('co_street')} />
                <Field label="Do you rent or own?" required value={g('co_rentOwn')} onChange={set('co_rentOwn')} />
                <Field label="Previous Rent or Own (if less than two years)" value={g('co_prevRentOwn')} onChange={set('co_prevRentOwn')} />
                <Field label="Apt. No." value={g('co_apt')} onChange={set('co_apt')} />
                <Field label="Landlord / Mortgage Company" value={g('co_landlord')} onChange={set('co_landlord')} />
                <Field label="Previous Street" value={g('co_prevStreet')} onChange={set('co_prevStreet')} />
                <Field label="City" required value={g('co_city')} onChange={set('co_city')} />
                <Field label="Rent / Mortgage Payment" value={g('co_rentPayment')} onChange={set('co_rentPayment')} />
                <Field label="Previous Apt. No." value={g('co_prevApt')} onChange={set('co_prevApt')} />
                <Field label="State" required value={g('co_state')} onChange={set('co_state')} />
                <Field label="Years" value={g('co_years')} onChange={set('co_years')} />
                <Field label="Previous City" value={g('co_prevCity')} onChange={set('co_prevCity')} />
                <Field label="Zip" required value={g('co_zip')} onChange={set('co_zip')} />
                <Field label="Months" value={g('co_months')} onChange={set('co_months')} />
                <Field label="Previous State" value={g('co_prevState')} onChange={set('co_prevState')} />
              </div>
            </Section>

            <Section title="Co-Applicant Employment Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Employment Status" required value={g('co_empStatus')} onChange={set('co_empStatus')} />
                <Field label="Years" value={g('co_empYears')} onChange={set('co_empYears')} />
                <Field label="Previous Employer (if less than two years)" value={g('co_prevEmp')} onChange={set('co_prevEmp')} />
                <Field label="Company Name" value={g('co_company')} onChange={set('co_company')} />
                <Field label="Months" value={g('co_empMonths')} onChange={set('co_empMonths')} />
                <Field label="Previous Occupation" value={g('co_prevOccupation')} onChange={set('co_prevOccupation')} />
                <Field label="Occupation" value={g('co_occupation')} onChange={set('co_occupation')} />
                <Field label="Net Income" value={g('co_netIncome')} onChange={set('co_netIncome')} />
                <Field label="Previous City" value={g('co_prevEmpCity')} onChange={set('co_prevEmpCity')} />
                <Field label="Business Phone" value={g('co_businessPhone')} onChange={set('co_businessPhone')} />
                <Field label="Additional Monthly Income" value={g('co_addlIncome')} onChange={set('co_addlIncome')} />
                <Field label="Previous State" value={g('co_prevEmpState')} onChange={set('co_prevEmpState')} />
              </div>
            </Section>
          </>
        )}

        <Section title="Vehicle Interested In">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Year" value={g('vYear')} onChange={set('vYear')} />
            <Field label="Stock Number" value={g('stock')} onChange={set('stock')} />
            <Field label="Down Payment Amount" value={g('down')} onChange={set('down')} />
            <Field label="Make" value={g('vMake')} onChange={set('vMake')} />
            <Field label="Purchase Time Frame" value={g('timeframe')} onChange={set('timeframe')} />
            <Field label="Desired Payments" value={g('payments')} onChange={set('payments')} />
            <Field label="Model" value={g('vModel')} onChange={set('vModel')} />
            <Field label="Sales Person's Name" value={g('salesPerson')} onChange={set('salesPerson')} />
          </div>
        </Section>

        <Section title="Comments">
          <label className="block text-xs text-white mb-1">How did you hear about us?</label>
          <input
            value={g('hearAbout')}
            onChange={(e) => setForm({ ...form, hearAbout: e.target.value })}
            className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none text-sm mb-4"
          />
          <label className="block text-xs text-white mb-1">Please let us know if there is any additional information that we should consider</label>
          <textarea
            rows={4}
            value={g('comments')}
            onChange={(e) => setForm({ ...form, comments: e.target.value })}
            className="w-full bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none text-sm"
          />
        </Section>

        <div className="bg-[#1a1a1a] p-5 text-xs text-gray-300 leading-relaxed">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-[#0055ff]"
            />
            <span>
              By checking the item to the left, signing, and submitting this credit application, I am authorizing the dealer and any potential lender or financial institution to investigate my credit and any personal information submitted on this form. I certify that I am the person named, and have provided true and accurate information. I have also read and agree to the terms of the Privacy Policy and understand that you will only share my personal information with third-party partners or vendors in connection with the delivery or administration of your services.
            </span>
          </label>

          <div className="mt-4">
            <label className="block text-xs mb-1">Type Signature</label>
            <input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-64 bg-[#111] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none italic font-bold"
              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={!agreed}
            className="bg-[#0038a8] hover:bg-[#0055ff] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-widest px-10 py-3 transition-colors"
          >
            Submit
          </button>
          {submitted && <p className="text-green-400 text-sm mt-4">Thank you! Your application has been received.</p>}
        </div>

        <p className="text-[10px] text-gray-500 leading-relaxed mt-8 border-t border-white/5 pt-4">
          Security: We take precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline. Wherever we collect sensitive information (such as credit card data), that information is encrypted and transmitted to us in a secure way. You can verify this by looking for the closed lock icon at the bottom of your web browser, or looking for \u201chttps\u201d at the beginning of the address of the web page. While we use encryption to protect sensitive information transmitted online, we also protect your information offline.
        </p>
      </form>
    </div>
  );
};

export default FinancingPage;
