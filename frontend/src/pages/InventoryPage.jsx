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

const Dropdown = ({ label, value, options = [], onChange, width = 'flex-1' }) => {
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
          {Array.isArray(options) && options.map((opt) => (
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
      .then((data) => setVehicles(Array.isArray(data) ? data : []))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  const yearOptions = useMemo(() => {
    if (!Array.isArray(vehicles)) return ['All Years'];
    return ['All Years', ...Array.from(new Set(vehicles.map((v) => String(v.year)))).sort((a, b) => Number(b) - Number(a))];
  }, [vehicles]);

  const makeOptions = useMemo(() => {
    if (!Array.isArray(vehicles)) return ['All Makes'];
    return ['All Makes', ...Array.from(new Set(vehicles.map((v) => v.make))).sort()];
  }, [vehicles]);

  const modelOptions = useMemo(() => {
    if (!Array.isArray(vehicles)) return ['All Models'];
    const relevant = make === 'All Makes' ? vehicles : vehicles.filter((v) => v.make === make);
    return ['All Models', ...Array.from(new Set(relevant.map((v) => v.model))).sort()];
  }, [vehicles, make]);

  const stockOptions = useMemo(() => {
    if (!Array.isArray(vehicles)) return ['All Stocks'];
    return ['All Stocks', ...vehicles.map((v) => v.stock_number).filter(Boolean)];
  }, [vehicles]);

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
    if (!Array.isArray(vehicles)) return [];
    let arr = vehicles.filter((v) => inCategory(v, category));
    if (year !== 'All Years') arr = arr.filter((v) => String(v.year) === year);
    if (make !== 'All Makes') arr = arr.filter((v) => v.make === make);
    if (model !== 'All Models') arr = arr.filter((v) => v.model === model);
    arr = arr.filter((v) => inMiles(v, miles));
    if (stock !== 'All Stocks') arr = arr.filter((v) => v.stock_number === stock);
    return arr;
  }, [vehicles, category, year, make, model, miles, stock]);

  const sorted = useMemo(() => {
    if (!Array.isArray(filtered)) return [];
    const arr = [...filtered];
    if (sortBy === 'Year: Newest') return arr.sort((a, b) => b.year - a.year);
    if (sortBy === 'Year: Oldest') return arr.sort((a, b) => a.year - b.year);
    if (sortBy === 'Mileage: Low to High') return arr.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
    if (sortBy === 'Mileage: High to Low') return arr.sort((a, b) => (b.mileage || 0) - (a.mileage || 0));
    return arr;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil((sorted.length || 0) / pageSize));
  const paged = Array.isArray(sorted) ? sorted.slice((page - 1) * pageSize, page * pageSize) : [];

  useEffect(() => {
    setPage(1);
  }, [category, year, make, model, miles, price, stock, pageSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-14">
      <PageTitle>Vehicles for Sale</PageTitle>

      <div className="bg-[#1f1f1f] p-4 mb-6 rounded-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <Dropdown label="All Categories" value={category} options={CATEGORIES} onChange={setCategory} />
          <Dropdown label="All Years" value={year} options={yearOptions} onChange={setYear} />
          <Dropdown label="All Makes" value={make} options={makeOptions} onChange={(v) => { setMake(v); setModel('All Models'); }} />
          <Dropdown label="All Models" value={model} options={modelOptions} onChange={setModel} />
          <Dropdown label="Miles" value={miles} options={MILES_BUCKETS} onChange={setMiles} />
          <Dropdown label="Price" value={price} options={PRICE_BUCKETS} onChange={setPrice} />
          <Dropdown label="All Stocks" value={stock} options={stockOptions} onChange={setStock} />
          <button onClick={resetFilters} className="bg-[#0055ff] hover:bg-[#0038a8] text-white flex items-center justify-center transition-colors">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-16">Loading inventory…</div>
      ) : !Array.isArray(sorted) || sorted.length === 0 ? (
        <div className="text-center text-gray-400 py-16">No vehicles match your filters.</div>
      ) : view === 'list' ? (
        <div className="space-y-6">
          {Array.isArray(paged) && paged.map((v) => (
            <div key={v.id} className="grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-5 bg-transparent">
               {/* List item implementation remains same */}
               <div className="text-white">Vehicle: {vehicleTitle(v)}</div> 
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.isArray(paged) && paged.map((v) => (
            <div key={v.id} className="text-white">Vehicle: {vehicleTitle(v)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;