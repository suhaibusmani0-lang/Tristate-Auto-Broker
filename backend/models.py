from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid


class VehicleImage(BaseModel):
    url: str
    public_id: Optional[str] = None


class VehicleBase(BaseModel):
    stock_number: str
    year: int
    make: str
    model: str
    trim: str = ""
    price: str = "Call for price!"
    down_payment: str = "$1000 Down"
    mileage: int = 0
    engine: str = ""
    transmission: str = ""
    drivetrain: str = ""
    vin: str = ""
    exterior_color: str = ""
    interior_color: str = ""
    fuel_type: str = "Gasoline"
    features: List[str] = []
    images: List[VehicleImage] = []


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    stock_number: Optional[str] = None
    year: Optional[int] = None
    make: Optional[str] = None
    model: Optional[str] = None
    trim: Optional[str] = None
    price: Optional[str] = None
    down_payment: Optional[str] = None
    mileage: Optional[int] = None
    engine: Optional[str] = None
    transmission: Optional[str] = None
    drivetrain: Optional[str] = None
    vin: Optional[str] = None
    exterior_color: Optional[str] = None
    interior_color: Optional[str] = None
    fuel_type: Optional[str] = None
    features: Optional[List[str]] = None
    images: Optional[List[VehicleImage]] = None


class Vehicle(VehicleBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ContactSubmission(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str = ""
    message: str = ""


class VehicleFinderSubmission(BaseModel):
    firstName: str
    lastName: str
    email: str
    dayPhone: str = ""
    eveningPhone: str = ""
    bestTime: str = ""
    year: str = ""
    make: str = ""
    model: str = ""
    engine: str = ""
    mileage: str = ""
    priceRange: str = ""
    notes: str = ""


class CreditApplication(BaseModel):
    firstName: str
    lastName: str
    email: str
    data: dict = Field(default_factory=dict)  # Full form data blob
    signature: str = ""


class Deposit(BaseModel):
    amount: str
    stock: str = ""
    name: str


class VehicleInquiry(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str = ""
    message: str = ""


class FormResponse(BaseModel):
    id: str
    success: bool = True
    message: str = "Received. Thank you!"


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    username: str


class SubmissionCounts(BaseModel):
    contact: int = 0
    vehicle_finder: int = 0
    credit_application: int = 0
    deposit: int = 0
    inquiry: int = 0
    vehicles: int = 0
