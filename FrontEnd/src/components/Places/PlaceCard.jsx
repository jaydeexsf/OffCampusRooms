import React from "react";
import { IoLocationSharp, IoWifi, IoWater, IoBed } from "react-icons/io5";
import { FaShower } from "react-icons/fa"; // Use FaShower from react-icons/fa

const amenitiesIcons = {
  wifi: <IoWifi className="text-sky-400" title="Free WiFi" />,
  shower: <FaShower className="text-green-400" title="Shower" />, // Replace IoShower with FaShower
  bathtub: <IoWater className="text-blue-400" title="Bathtub" />,
  table: <span className="text-yellow-400" title="Table">🪑</span>, // Use appropriate icon or text
  bed: <IoBed className="text-red-400" title="Bed" />,
  electricity: <span className="text-orange-400" title="Electricity">⚡</span>, // Use appropriate icon or text
};

const amenitiesLabels = {
  wifi: "Free WiFi",
  shower: "Shower",
  bathtub: "Bathtub",
  table: "Table & Chair",
  bed: "Bed",
  electricity: "Electricity",
};

const PlaceCard = ({
  images,
  title,
  description,
  price,
  minutesAway,
  handleOrderPopup,
  amenities
}) => {
  return (
    <div
      className="shadow-lg relative transition-all duration-500 hover:shadow-xl dark:bg-slate-950 dark:text-white cursor-pointer"
      onClick={handleOrderPopup}
    >
      <div className="overflow-hidden">
        <img
          src={images}
          alt="Room"
          className="mx-auto h-[270px] sm:h-[220px] w-full object-cover transition duration-700 hover:skew-x-2 hover:scale-110"
        />
      </div>

      <div className="space-y-2 p-3">
        <h1 className="line-clamp-1 font-bold text-xl">{title}</h1>
        <div className="flex flex-wrap gap-[10px] mt-2">
          {Object.keys(amenities).map((amenity) => 
            amenities[amenity] ? (
              <div key={amenity} className="flex items-center gap-1 text-sm">
                {amenitiesIcons[amenity]}
                <span>{amenitiesLabels[amenity]}</span>
              </div>
            ) : null
          )}
        </div>
        <div className="flex items-center text-[12px] justify-between border-t-2 pt-2 !mt-3">
          <div className="opacity-70">
            <p>{minutesAway} minutes away from UL campus</p>
          </div>
          <div className="rounded-md text-black flex flex-shrink-0 bg-sky-100 p-2">
              <p className="text-[12px] flex-shrink-0 font-bold">
                R {price.toLocaleString('en-US').replace(/,/g, ' ')} /month
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
