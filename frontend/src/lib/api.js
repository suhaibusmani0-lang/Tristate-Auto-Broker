import axios from 'axios';

const BACKEND_URL = "https://tristate-auto-broker.onrender.com";
const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

// Vehicles
export const fetchVehicles = (sort) =>
  api.get('/vehicles', { params: sort ? { sort } : {} }).then((r) => r.data);

export const fetchVehicle = (id) => api.get(`/vehicles/${id}`).then((r) => r.data);

// Forms
export const submitContact = (payload) => api.post('/contact', payload).then((r) => r.data);
export const submitVehicleFinder = (payload) => api.post('/vehicle-finder', payload).then((r) => r.data);
export const submitCreditApplication = (payload) => api.post('/credit-application', payload).then((r) => r.data);
export const submitDeposit = (payload) => api.post('/deposit', payload).then((r) => r.data);
export const submitInquiry = (vehicleId, payload) => api.post(`/vehicles/${vehicleId}/inquire`, payload).then((r) => r.data);

// Helpers
export const vehicleTitle = (v) => `${v.year} ${v.make} ${v.model}${v.trim ? ' ' + v.trim : ''}`;

export const vehicleImageUrls = (v) => 
  (v.images || []).map((i) => {
    const url = i.url || i;
    // Fix for broken local images
    if (url.startsWith('/uploads')) {
      return `${BACKEND_URL}${url}`;
    }
    return url;
  });