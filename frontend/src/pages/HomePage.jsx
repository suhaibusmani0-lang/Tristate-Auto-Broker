import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES, HAPPY_CUSTOMER_IMG } from '../mock';
import { fetchVehicles, vehicleImageUrls } from '../lib/api';
import VehicleCard from '../components/VehicleCard';

const HomePage = () => {
  const [current, setCurrent] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles('year_desc').then(setVehicles).catch(() => setVehicles([]));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const perView = 4;
  const maxIdx = Math.max(0, vehicles.length - perView);
  const visibleVehicles = vehicles.slice(carouselIdx, carouselIdx + perView);

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative h-[380px] md:h-[520px] overflow-hidden bg-black">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
            <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center px-6">
              <h2 className="text-white text-3xl md:text-5xl font-bold tracking-wide drop-shadow-lg">{slide.title}</h2>
              <p className="text-white text-lg md:text-2xl mt-4 opacity-90">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-[#0055ff]' : 'bg-white/40'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="border-y-2 border-[#0055ff] bg-black">
        <h2 className="max-w-7xl mx-auto py-6 text-center text-white text-xl md:text-2xl font-semibold px-4">
          Save thousands over retail - Let us buy at auction for you!
        </h2>
      </section>

      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-white text-xl md:text-2xl font-semibold tracking-wide">SAVE THOUSANDS OVER RETAIL PRICES!</h3>
            <p className="text-gray-200 mt-4 max-w-3xl mx-auto">
              We buy at wholesale vehicle auctions for you. If we buy it cheap - then you get it cheap!
            </p>
            <p className="text-gray-200 max-w-3xl mx-auto">
              You pay only a $600 flat fee for our services, plus the cost of the vehicle and shipping.
            </p>
            <div className="w-16 h-[2px] bg-[#0055ff] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-8">
              {[
                { n: 1, title: 'Choose vehicle and budget', desc: 'Just let us know the year, make, model, color, engine, options, etc. that you are looking for. And the maximum price you are willing to pay.' },
                { n: 2, title: 'We locate your exact vehicle', desc: 'We search through physical and online wholesale (dealer only) vehicle auctions to locate your desired vehicle with your requested options.' },
                { n: 3, title: 'We acquire the vehicle for you', desc: 'You pay only a $600 flat fee for our services, plus the cost of the vehicle and shipping. We help many customers save thousands over retail prices. It is like having a friend in the family with a dealer\u2019s license!' },
              ].map((s) => (
                <div key={s.n} className="flex gap-5 items-start">
                  <div className="text-[#0055ff] text-6xl font-thin leading-none w-14 shrink-0 text-center">{s.n}</div>
                  <div>
                    <h4 className="text-white text-xl font-semibold mb-2">{s.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative rounded-sm overflow-hidden shadow-2xl">
              <img src={HAPPY_CUSTOMER_IMG} alt="Happy customer" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-white text-2xl md:text-3xl font-semibold text-center mb-10 tracking-wider">VEHICLES FOR SALE</h2>

          {vehicles.length === 0 ? (
            <div className="text-center text-gray-400 py-10">Loading vehicles\u2026</div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setCarouselIdx(Math.max(0, carouselIdx - 1))}
                disabled={carouselIdx === 0}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#0038a8] hover:bg-[#0055ff] text-white flex items-center justify-center rounded-full shadow-lg disabled:opacity-40 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={() => setCarouselIdx(Math.min(maxIdx, carouselIdx + 1))}
                disabled={carouselIdx >= maxIdx}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#0038a8] hover:bg-[#0055ff] text-white flex items-center justify-center rounded-full shadow-lg disabled:opacity-40 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={22} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {visibleVehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={{ ...v, images: vehicleImageUrls(v) }} />
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/inventory"
              className="inline-block bg-[#0038a8] hover:bg-[#0055ff] text-white font-semibold uppercase tracking-widest px-8 py-3 transition-colors"
            >
              View All Inventory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
