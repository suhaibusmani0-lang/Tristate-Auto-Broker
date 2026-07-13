import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  return (
    <Link
      to={`/inventory/${vehicle.id}`}
      className="group block bg-white text-black relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-[#0038a8] text-white text-xs font-semibold py-2 px-3 flex items-center justify-between">
          <span>Click for Details</span>
          <ChevronRight size={14} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm leading-tight mb-1">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-xs text-gray-600">{vehicle.mileage.toLocaleString()} miles</p>
      </div>
    </Link>
  );
};

export default VehicleCard;
