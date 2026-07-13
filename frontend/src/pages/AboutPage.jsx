import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import PageTitle from '../components/PageTitle';

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-14">
      <PageTitle>About Tri State Auto Brokers, Inc.</PageTitle>

      <div className="space-y-6 text-gray-200 leading-relaxed max-w-5xl mx-auto text-center">
        <p>
          Since 2010, we have helped hundreds of customers buy the vehicle they want for wholesale, dealer only prices. Before bidding on a vehicle at auction, we do all of the due diligence for you that we do for our own vehicle inventory, including mechanical inspection, reviewing vehicle history reports, title check, and more.
        </p>
        <p>
          Now you can avoid searching through vehicle classifieds full of dealers that charge full retail prices trying to find a deal. You can basically compete against the same dealers for your vehicle using the flat fee service from Tri State Auto Brokers.
        </p>
      </div>

      <div className="mt-14 bg-[#1a1a1a] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <Search size={28} className="text-[#0055ff]" />
          <div>
            <h3 className="text-[#0055ff] text-2xl font-semibold">Get Started</h3>
            <p className="text-gray-300 text-sm mt-1 max-w-2xl">
              Just fill out our easy Vehicle Finder form and we can likely find the exact make and model you are looking for at a wholesale vehicle auction. Get started today!
            </p>
          </div>
        </div>
        <Link
          to="/vehicle-finder"
          className="bg-[#0038a8] hover:bg-[#0055ff] text-white font-semibold uppercase tracking-widest px-6 py-4 whitespace-nowrap transition-colors"
        >
          Vehicle Finder Form
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
