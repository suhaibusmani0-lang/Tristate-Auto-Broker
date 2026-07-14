import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, Mail, Search, CreditCard, DollarSign, MessageSquare,
  LogOut, Plus, Trash2, Edit, X, Upload, Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';

const StatCard = ({ icon: Icon, label, value, color = '#0055ff' }) => (
  <div className="bg-[#1a1a1a] border border-white/5 p-5 flex items-center gap-4">
    <div className="w-12 h-12 flex items-center justify-center" style={{ background: `${color}20`, color }}>
      <Icon size={22} />
    </div>
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="text-center py-16 text-gray-400 bg-[#1a1a1a] border border-white/5">
    {text}
  </div>
);

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'inventory', label: 'Inventory', icon: Car },
  { key: 'contact', label: 'Contact', icon: Mail },
  { key: 'vehicle-finder', label: 'Vehicle Finder', icon: Search },
  { key: 'credit-applications', label: 'Credit Apps', icon: CreditCard },
  { key: 'deposits', label: 'Deposits', icon: DollarSign },
  { key: 'inquiries', label: 'Inquiries', icon: MessageSquare },
];

// YAHAN FIX KIYA HAI: process.env hata kar direct URL daal diya
const BACKEND_URL = "https://tristate-auto-broker.onrender.com";

const imgSrc = (url) => (url && url.startsWith('/uploads') ? `${BACKEND_URL}${url}` : url);

const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [counts, setCounts] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadCounts = useCallback(async () => {
    const { data } = await api.get('/admin/counts');
    setCounts(data);
  }, []);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubmissions = useCallback(async (kind) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/submissions/${kind}`);
      setSubmissions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCounts();
    if (tab === 'inventory') loadVehicles();
    else if (tab !== 'overview') loadSubmissions(tab);
  }, [tab, loadCounts, loadVehicles, loadSubmissions]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle? This will also delete its images.')) return;
    await api.delete(`/vehicles/${id}`);
    await loadVehicles();
    await loadCounts();
  };

  const deleteSubmission = async (sid) => {
    if (!window.confirm('Delete this submission?')) return;
    await api.delete(`/admin/submissions/${tab}/${sid}`);
    await loadSubmissions(tab);
    await loadCounts();
  };

  return (
    <div className="min-h-screen bg-black text-white flex" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 min-h-screen flex flex-col">
        <div className="p-5 border-b border-white/5">
          <Link to="/" className="flex justify-center">
            <img src="/logo.webp" alt="Logo" className="h-12" />
          </Link>
        </div>
        <div className="p-4 border-b border-white/5">
          <div className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</div>
          <div className="text-white font-semibold">{user?.username}</div>
        </div>
        <nav className="flex-1 py-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  active
                    ? 'bg-[#0055ff]/10 text-[#0055ff] border-l-2 border-[#0055ff]'
                    : 'text-gray-300 hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <Icon size={16} />
                <span>{t.label}</span>
                {counts && t.key !== 'overview' && t.key !== 'inventory' && (
                  <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded">
                    {counts[t.key.replace('-', '_')] || 0}
                  </span>
                )}
                {counts && t.key === 'inventory' && (
                  <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded">
                    {counts.vehicles || 0}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link to="/" className="text-xs text-gray-400 hover:text-white block mb-3">← View public site</Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] text-white text-sm py-2 border border-white/5 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-auto">
        <div className="p-8 max-w-[1400px] mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">{TABS.find((t) => t.key === tab)?.label}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {tab === 'overview' && 'Site metrics and quick access'}
              {tab === 'inventory' && 'Manage vehicles — add, edit, delete cars and upload photos'}
              {tab !== 'overview' && tab !== 'inventory' && 'View and manage form submissions'}
            </p>
          </header>

          {tab === 'overview' && counts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon={Car} label="Vehicles in inventory" value={counts.vehicles} color="#0055ff" />
              <StatCard icon={Mail} label="Contact submissions" value={counts.contact} color="#22c55e" />
              <StatCard icon={Search} label="Vehicle finder requests" value={counts.vehicle_finder} color="#eab308" />
              <StatCard icon={CreditCard} label="Credit applications" value={counts.credit_application} color="#a855f7" />
              <StatCard icon={DollarSign} label="Deposits" value={counts.deposit} color="#ef4444" />
              <StatCard icon={MessageSquare} label="Vehicle inquiries" value={counts.inquiry} color="#06b6d4" />
            </div>
          )}

          {tab === 'inventory' && (
            <InventoryManager
              vehicles={vehicles}
              loading={loading}
              onCreate={() => { setEditVehicle(null); setShowForm(true); }}
              onEdit={(v) => { setEditVehicle(v); setShowForm(true); }}
              onDelete={deleteVehicle}
              onReload={async () => { await loadVehicles(); await loadCounts(); }}
            />
          )}

          {tab === 'contact' && (
            <SubmissionList
              items={submissions}
              loading={loading}
              fields={['firstName', 'lastName', 'email', 'phone', 'message']}
              onDelete={deleteSubmission}
            />
          )}

          {tab === 'vehicle-finder' && (
            <SubmissionList
              items={submissions}
              loading={loading}
              fields={['firstName', 'lastName', 'email', 'dayPhone', 'year', 'make', 'model', 'priceRange', 'notes']}
              onDelete={deleteSubmission}
            />
          )}

          {tab === 'credit-applications' && (
            <SubmissionList
              items={submissions}
              loading={loading}
              fields={['firstName', 'lastName', 'email', 'signature']}
              extra={(row) => (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-[#0055ff]">Full form data</summary>
                  <pre className="text-xs text-gray-300 bg-[#0a0a0a] p-3 mt-2 overflow-x-auto max-h-64 overflow-y-auto">
                    {JSON.stringify(row.data || {}, null, 2)}
                  </pre>
                </details>
              )}
              onDelete={deleteSubmission}
            />
          )}

          {tab === 'deposits' && (
            <SubmissionList
              items={submissions}
              loading={loading}
              fields={['name', 'amount', 'stock']}
              onDelete={deleteSubmission}
            />
          )}

          {tab === 'inquiries' && (
            <SubmissionList
              items={submissions}
              loading={loading}
              fields={['vehicle_title', 'firstName', 'lastName', 'email', 'phone', 'message']}
              onDelete={deleteSubmission}
            />
          )}
        </div>
      </main>

      {showForm && (
        <VehicleFormModal
          vehicle={editVehicle}
          onClose={() => { setShowForm(false); setEditVehicle(null); }}
          onSaved={async () => { setShowForm(false); setEditVehicle(null); await loadVehicles(); await loadCounts(); }}
        />
      )}
    </div>
  );
};

// ---------------- Inventory Manager ----------------
const InventoryManager = ({ vehicles, loading, onCreate, onEdit, onDelete }) => {
  if (loading) return <div className="text-center py-16 text-gray-400">Loading vehicles…</div>;
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-400">Total: <span className="text-white font-semibold">{vehicles.length}</span></p>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 bg-[#0055ff] hover:bg-[#0038a8] text-white text-sm font-semibold px-4 py-2.5 transition-colors"
        >
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState text="No vehicles yet. Click 'Add Vehicle' to create one." />
      ) : (
        <div className="bg-[#1a1a1a] border border-white/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0a0a0a] border-b border-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">Image</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">Stock</th>
                <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-gray-400 font-semibold">Mileage</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">Down</th>
                <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(vehicles) && vehicles.map((v) => (
                <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    {v.images?.[0]?.url ? (
                      <img src={imgSrc(v.images[0].url)} alt="" className="w-16 h-12 object-cover" />
                    ) : (
                      <div className="w-16 h-12 bg-[#0a0a0a] flex items-center justify-center text-gray-600">
                        <ImageIcon size={14} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{v.year} {v.make} {v.model}</div>
                    <div className="text-gray-400 text-xs">{v.trim}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{v.stock_number}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{(v.mileage || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[#0055ff] font-semibold">{v.down_payment}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(v)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-white transition-colors"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(v.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ---------------- Submission List ----------------
const SubmissionList = ({ items, loading, fields, onDelete, extra }) => {
  if (loading) return <div className="text-center py-16 text-gray-400">Loading…</div>;
  if (items.length === 0) return <EmptyState text="No submissions yet." />;

  return (
    <div className="space-y-3">
      {items.map((row) => (
        <div key={row.id} className="bg-[#1a1a1a] border border-white/5 p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="text-xs text-gray-500">
              {row.created_at && new Date(row.created_at).toLocaleString()} • ID: {row.id?.slice(0, 8)}
            </div>
            <button
              onClick={() => onDelete(row.id)}
              className="text-red-400 hover:text-red-300 p-1"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {fields.map((f) => (
              <div key={f} className="flex flex-col">
                <span className="text-xs text-gray-500 capitalize">{f.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-white break-all">{row[f] || '—'}</span>
              </div>
            ))}
          </div>
          {extra && extra(row)}
        </div>
      ))}
    </div>
  );
};

// ---------------- Vehicle Form Modal ----------------
const emptyVehicle = {
  stock_number: '',
  year: new Date().getFullYear(),
  make: '',
  model: '',
  trim: '',
  price: 'Call for price!',
  down_payment: '$1000 Down',
  mileage: 0,
  engine: '',
  transmission: '',
  drivetrain: '',
  vin: '',
  exterior_color: '',
  interior_color: '',
  fuel_type: 'Gasoline',
  features: [],
  images: [],
};

const Input = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-xs text-gray-400 mb-1">{label}</label>
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none text-sm"
    />
  </div>
);

const VehicleFormModal = ({ vehicle, onClose, onSaved }) => {
  const [form, setForm] = useState(vehicle ? { ...vehicle } : { ...emptyVehicle });
  const [busy, setBusy] = useState(false);
  const [featuresText, setFeaturesText] = useState((vehicle?.features || []).join('\n'));
  const [uploading, setUploading] = useState(false);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleSave = async () => {
    setBusy(true);
    try {
      const payload = {
        ...form,
        features: featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
      };
      if (vehicle?.id) {
        await api.put(`/vehicles/${vehicle.id}`, payload);
      } else {
        const { data } = await api.post('/vehicles', payload);
        // Load created vehicle so we can accept image uploads
        setForm(data);
      }
      onSaved();
    } catch (e) {
      alert(e?.response?.data?.detail || 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const uploadFile = async (file) => {
    if (!form.id) {
      alert('Save the vehicle first, then upload images.');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post(`/vehicles/${form.id}/images`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(data);
    } catch (e) {
      alert(e?.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (public_id) => {
    if (!form.id || !public_id) return;
    await api.delete(`/vehicles/${form.id}/images`, { params: { public_id } });
    const { data } = await api.get(`/vehicles/${form.id}`);
    setForm(data);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-[#111] border border-white/10 w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-xl font-bold">{vehicle?.id ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Stock Number" value={form.stock_number} onChange={(v) => update('stock_number', v)} />
            <Input label="Year" type="number" value={form.year} onChange={(v) => update('year', v)} />
            <Input label="Mileage" type="number" value={form.mileage} onChange={(v) => update('mileage', v)} />
            <Input label="Make" value={form.make} onChange={(v) => update('make', v)} />
            <Input label="Model" value={form.model} onChange={(v) => update('model', v)} />
            <Input label="Trim" value={form.trim} onChange={(v) => update('trim', v)} />
            <Input label="Engine" value={form.engine} onChange={(v) => update('engine', v)} />
            <Input label="Transmission" value={form.transmission} onChange={(v) => update('transmission', v)} />
            <Input label="Drivetrain" value={form.drivetrain} onChange={(v) => update('drivetrain', v)} />
            <Input label="VIN" value={form.vin} onChange={(v) => update('vin', v)} />
            <Input label="Exterior Color" value={form.exterior_color} onChange={(v) => update('exterior_color', v)} />
            <Input label="Interior Color" value={form.interior_color} onChange={(v) => update('interior_color', v)} />
            <Input label="Fuel Type" value={form.fuel_type} onChange={(v) => update('fuel_type', v)} />
            <Input label="Price Label" value={form.price} onChange={(v) => update('price', v)} />
            <Input label="Down Payment Label" value={form.down_payment} onChange={(v) => update('down_payment', v)} />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Features (one per line)</label>
            <textarea
              rows={5}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 focus:border-[#0055ff] text-white px-3 py-2 outline-none text-sm"
              placeholder={'Leather Seats\nBluetooth\nBackup Camera'}
            />
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Photos</label>
              {form.id && (
                <label className="inline-flex items-center gap-2 bg-[#0055ff] hover:bg-[#0038a8] text-white text-xs font-semibold px-3 py-2 cursor-pointer transition-colors">
                  <Upload size={14} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
                  />
                </label>
              )}
            </div>
            {!form.id && (
              <p className="text-xs text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 px-3 py-2">
                Save the vehicle first to enable photo uploads.
              </p>
            )}
            {form.images?.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={imgSrc(img.url)} alt="" className="w-full aspect-[4/3] object-cover" />
                    {img.public_id && (
                      <button
                        onClick={() => removeImage(img.public_id)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-white/10 bg-[#0a0a0a]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={busy}
            className="bg-[#0055ff] hover:bg-[#0038a8] disabled:opacity-50 text-white font-semibold text-sm px-6 py-2.5 transition-colors"
          >
            {busy ? 'Saving...' : (vehicle?.id ? 'Save Changes' : 'Create Vehicle')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;