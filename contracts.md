# Tri State Auto Brokers - API Contracts

## Overview
Backend for a car dealership website with vehicle inventory managed in MongoDB and images stored in Cloudinary.

## MongoDB Collections

### vehicles
```
{
  id: str (uuid),
  stock_number: str,
  year: int, make: str, model: str, trim: str,
  price: str, down_payment: str,
  mileage: int, engine: str, transmission: str, drivetrain: str,
  vin: str, exterior_color: str, interior_color: str, fuel_type: str,
  features: [str],
  images: [{ url: str, public_id: str }],
  created_at: datetime, updated_at: datetime
}
```

### contact_submissions, vehicle_finder_submissions, credit_applications, deposits, vehicle_inquiries
Submitted forms.

## API Endpoints (all prefixed with `/api`)

### Vehicles
- GET `/vehicles` -> list (supports ?sort=year_desc|year_asc|mileage_asc|mileage_desc)
- GET `/vehicles/{id}` -> detail
- POST `/vehicles` -> create
- PUT `/vehicles/{id}` -> update
- DELETE `/vehicles/{id}` -> delete
- POST `/vehicles/{id}/images` -> multipart file upload -> Cloudinary
- DELETE `/vehicles/{id}/images/{public_id}` -> remove image
- POST `/seed` -> seed initial 15 vehicles (dev)

### Forms
- POST `/contact` { firstName, lastName, email, phone, message }
- POST `/vehicle-finder` { firstName, lastName, email, dayPhone, eveningPhone, bestTime, year, make, model, engine, mileage, priceRange, notes }
- POST `/credit-application` { ...full form }
- POST `/deposit` { amount, stock, name }
- POST `/vehicles/{id}/inquire` { firstName, lastName, email, phone, message }

## Cloudinary Integration
- ENV: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Folder: `tristate_auto_brokers/vehicles/<vehicle_id>`
- Upload accepts image/* MIME types.

## Frontend Integration Changes
- `mock.js` VEHICLES array will be replaced with fetch to `GET /api/vehicles`.
- Vehicle detail fetches `GET /api/vehicles/:id`.
- All forms POST to their endpoints, show toast on success.
- Images from vehicles come from Cloudinary secure_url.
