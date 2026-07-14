import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, List, ChevronDown, RotateCcw, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import { fetchVehicles, vehicleImageUrls, vehicleTitle } from '../lib/api';

const CATEGORIES = ['All Categories', 'Cars', 'SUVs', 'Trucks', 'Coupes', 'Sedans'];
const MILES_BUCKETS = ['Miles', 'Under 25,000', '25,000 - 50,000', '50,000 - 75,000', 'Over 75,000'];
const PRICE_BUCKETS = ['Price', 'Under $20,000', '$20,000 - $40,000', '$40,000 - $60,000', 'Over $60,000'];

const inCategory = (v, key) => {
  if (key === 'All Categories') return true;
  const combined = `${(v.model || '').toLowerCase()} ${(v.trim || '').toLowerCase()}`;
  if (key === 'SUVs') return /gla|glc|gle|range rover|velar|glk|gls|q5|q7|x3|x5/.test(combined);
  if (key === 'Trucks') return /truck|f-150|silverado|tacoma|tundra|ram/.test(combined);
  if (key === 'Coupes') return /coupe/.test(combined);
  if (key === 'Sedans') return /sedan/.test(combined) || (/c-class|e-class|s-class|c300|c43|e300|s550/.test(combined) && !/coupe/.test(combined));
  if (key === 'Cars') return !/gla|glc|gle|range rover|velar|glk|gls|truck|f-150|silverado/.test(combined);
  return true;
};

const inMiles = (v, key) => {
  if (key === 'Miles') return true;
  const m = v.mileage || 0;
  if (key === 'Under 25,000') return m < 25000;
  if (key === '25,000 - 50,000') return m >= 25000 && m <= 50000;
  if (key === '50,000 - 75,000') return m > 50000 && m <= 75000;
  if (key === 'Over 75,000') return m > 75000;
  return true;
};

const Dropdown = ({ label, value, options, onChange, width = 'flex-1' }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${width}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full flex items-center justify-between bg-[#111] hover:bg-[#181818] border border-white/10 hover:border-[#0055ff]/40 text-white px-4 py-3 text-sm transition-colors"
      >
        <span className={value === options[0] ? 'text-gray-300' : 'text-white font-medium'}>{value}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 shadow-2xl z-30 max-h-64 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                opt === value ? 'bg-[#0038a8] text-white' : 'text-gray-200 hover:bg-[#222]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const InventoryPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState('All Categories');
  const [year, setYear] = useState('All Years');
  const [make, setMake] = useState('All Makes');
  const [model, setModel] = useState('All Models');
  const [miles, setMiles] = useState('Miles');
  const [price, setPrice] = useState('Price');
  const [stock, setStock] = useState('All Stocks');

  const [sortBy, setSortBy] = useState('Most Relevant');
  const [view, setView] = useState('list');
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchVehicles()
      .then((data) => setVehicles(data))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  const yearOptions = useMemo(
    () => ['All Years', ...Array.from(new Set(vehicles.map((v) => String(v.year)))).sort((a, b) => Number(b) - Number(a))],
    [vehicles]
  );
  const makeOptions = useMemo(
    () => ['All Makes', ...Array.from(new Set(vehicles.map((v) => v.make))).sort()],
    [vehicles]
  );
  const modelOptions = useMemo(() => {
    const relevant = make === 'All Makes' ? vehicles : vehicles.filter((v) => v.make === make);
    return ['All Models', ...Array.from(new Set(relevant.map((v) => v.model))).sort()];
  }, [vehicles, make]);
  const stockOptions = useMemo(
    () => ['All Stocks', ...vehicles.map((v) => v.stock_number).filter(Boolean)],
    [vehicles]
  );

  const resetFilters = () => {
    setCategory('All Categories');
    setYear('All Years');
    setMake('All Makes');
    setModel('All Models');
    setMiles('Miles');
    setPrice('Price');
    setStock('All Stocks');
  };

  const filtered = useMemo(() => {
    let arr = vehicles.filter((v) => inCategory(v, category));
    if (year !== 'All Years') arr = arr.filter((v) => String(v.year) === year);
    if (make !== 'All Makes') arr = arr.filter((v) => v.make === make);
    if (model !== 'All Models') arr = arr.filter((v) => v.model === model);
    arr = arr.filter((v) => inMiles(v, miles));
    if (stock !== 'All Stocks') arr = arr.filter((v) => v.stock_number === stock);
    // Price filtering is left as UI-only since prices are "Call for price!" in seed data
    return arr;
  }, [vehicles, category, year, make, model, miles, stock]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'Year: Newest') return arr.sort((a, b) => b.year - a.year);
    if (sortBy === 'Year: Oldest') return arr.sort((a, b) => a.year - b.year);
    if (sortBy === 'Mileage: Low to High') return arr.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
    if (sortBy === 'Mileage: High to Low') return arr.sort((a, b) => (b.mileage || 0) - (a.mileage || 0));
    return arr;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [category, year, make, model, miles, price, stock, pageSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-14">
      <PageTitle>Vehicles for Sale</PageTitle>

      {/* Filter Bar */}
      <div className="bg-[#1f1f1f] p-4 mb-6 rounded-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <Dropdown label="All Categories" value={category} options={CATEGORIES} onChange={setCategory} />
          <Dropdown label="All Years" value={year} options={yearOptions} onChange={setYear} />
          <Dropdown label="All Makes" value={make} options={makeOptions} onChange={(v) => { setMake(v); setModel('All Models'); }} />
          <Dropdown label="All Models" value={model} options={modelOptions} onChange={setModel} />
          <Dropdown label="Miles" value={miles} options={MILES_BUCKETS} onChange={setMiles} />
          <Dropdown label="Price" value={price} options={PRICE_BUCKETS} onChange={setPrice} />
          <Dropdown label="All Stocks" value={stock} options={stockOptions} onChange={setStock} />
          <button
            onClick={resetFilters}
            aria-label="Reset filters"
            className="bg-[#0055ff] hover:bg-[#0038a8] text-white flex items-center justify-center transition-colors"
            title="Reset filters"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span><span className="text-[#0055ff] font-bold text-base">{sorted.length}</span> <span className="text-gray-300">Results</span></span>
          <div className="flex items-center gap-2 text-gray-300">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-[#111] text-white text-sm border border-white/10 px-3 py-1.5 focus:outline-none focus:border-[#0055ff]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center bg-[#111] hover:bg-[#222] border border-white/10 text-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center bg-[#111] hover:bg-[#222] border border-white/10 text-white disabled:opacity-40 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <span className="text-gray-300 text-sm">Page {page} of {totalPages}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-300 text-sm">Sort by</span>
          <Dropdown
            label="Most Relevant"
            value={sortBy}
            options={['Most Relevant', 'Year: Newest', 'Year: Oldest', 'Mileage: Low to High', 'Mileage: High to Low']}
            onChange={setSortBy}
            width="w-48"
          />
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
              view === 'list' ? 'bg-[#0055ff] text-white' : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#222]'
            }`}
          >
            <List size={16} />
            List View
          </button>
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
              view === 'grid' ? 'bg-[#0055ff] text-white' : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#222]'
            }`}
          >
            <ChevronsRight size={16} />
            Grid View
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-16">Loading inventory…</div>
      ) : sorted.length === 0 ? (
        <div className="text-center text-gray-400 py-16">No vehicles match your filters.</div>
      ) : view === 'list' ? (
        <div className="space-y-6">
          {paged.map((v) => {
            const imgs = vehicleImageUrls(v);
            const primary = imgs[0] || 'https://placehold.co/600x450/111/999?text=No+Image';
            const rows = [
              [
                { label: 'Engine', value: v.engine },
                { label: 'Mileage:', value: (v.mileage || 0).toLocaleString() },
              ],
              [
                { label: 'Transmission:', value: v.transmission },
                { label: 'Exterior:', value: v.exterior_color },
              ],
              [
                { label: 'Drive:', value: v.drivetrain },
                { label: 'Interior:', value: v.interior_color },
              ],
              [
                { label: 'VIN:', value: v.vin },
                { label: 'Stock NO:', value: v.stock_number },
              ],
            ];
            return (
              <div key={v.id} className="bg-transparent">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-5">
                  {/* Left: Image + Photo Viewer button */}
                  <div className="space-y-3">
                    <Link to={`/inventory/${v.id}`} className="block overflow-hidden bg-[#111] aspect-[4/3] group">
                      <img
                        src={primary}
                        alt={`${v.year} ${v.make}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <Link
                      to={`/inventory/${v.id}#photos`}
                      className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#222] border border-white/5 px-4 py-3 transition-colors"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-black/60">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="5" width="18" height="14" rx="1" stroke="#0055ff" strokeWidth="2" />
                          <circle cx="9" cy="10" r="1.5" fill="#0055ff" />
                          <path d="M3 17 L9 11 L14 15 L21 9" stroke="#0055ff" strokeWidth="2" fill="none" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[#0055ff] font-bold text-sm uppercase tracking-wide">Photo Viewer</div>
                        <div className="text-gray-400 text-xs">{imgs.length} image{imgs.length !== 1 ? 's' : ''}</div>
                      </div>
                    </Link>
                  </div>

                  {/* Middle: Title + Specs table */}
                  <div>
                    <Link to={`/inventory/${v.id}`}>
                      <h3 className="text-white text-xl md:text-2xl font-bold leading-tight hover:text-[#0055ff] transition-colors pb-4 border-b border-white/10">
                        {vehicleTitle(v)}
                      </h3>
                    </Link>
                    <div className="mt-1">
                      {rows.map((pair, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-2 ${idx % 2 === 1 ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}
                        >
                          {pair.map((cell, j) => (
                            <div
                              key={j}
                              className={`flex items-start justify-between gap-3 px-4 py-3 text-sm ${j === 0 ? 'border-r border-white/5' : ''}`}
                            >
                              <span className="text-white font-semibold whitespace-nowrap">{cell.label}</span>
                              <span className="text-gray-300 text-right">{cell.value || '—'}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Price + View Details */}
                  <div className="space-y-3">
                    <div className="bg-[#1a1a1a] border border-white/5 py-8 text-center">
                      <div className="text-white text-3xl font-extrabold tracking-tight">{v.down_payment}</div>
                      <div className="text-gray-300 text-sm mt-2">{v.price}</div>
                    </div>
                    <Link
                      to={`/inventory/${v.id}`}
                      className="block w-full bg-[#0055ff] hover:bg-[#0038a8] text-white text-sm font-bold uppercase tracking-widest py-3.5 text-center transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paged.map((v) => {
            const imgs = vehicleImageUrls(v);
            const primary = imgs[0] || 'https://placehold.co/600x450/111/999?text=No+Image';
            return (
              <div
                key={v.id}
                className="bg-[#1a1a1a] border border-white/5 hover:border-[#0055ff]/40 transition-all overflow-hidden flex flex-col"
              >
                <Link to={`/inventory/${v.id}`} className="block relative aspect-[4/3] overflow-hidden group bg-[#111]">
                  <img
                    src={primary}
                    alt={vehicleTitle(v)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="px-4 pt-4">
                  <Link to={`/inventory/${v.id}`}>
                    <h3 className="text-white text-lg font-bold leading-tight hover:text-[#0055ff] transition-colors min-h-[56px]">
                      {vehicleTitle(v)}
                    </h3>
                  </Link>
                </div>

                <div className="px-4 py-3 mx-4 mt-3 bg-[#0f0f0f] border border-white/5 flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-medium">Mileage</span>
                  <span className="text-white font-semibold">{(v.mileage || 0).toLocaleString()}</span>
                </div>

                <div className="mx-4 mt-3 bg-[#0f0f0f] border border-white/5 py-5 text-center">
                  <div className="text-white text-3xl font-extrabold tracking-tight">{v.down_payment}</div>
                  <div className="text-gray-300 text-sm mt-1">{v.price}</div>
                </div>

                <div className="p-4 pt-3">
                  <Link
                    to={`/inventory/${v.id}`}
                    className="block w-full bg-[#0055ff] hover:bg-[#0038a8] text-white text-sm font-bold uppercase tracking-widest py-3 text-center transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;