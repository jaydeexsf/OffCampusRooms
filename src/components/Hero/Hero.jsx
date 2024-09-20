import React from "react";

const Hero = () => {
  const [priceValue, setPriceValue] = React.useState(2000);

  return (
    <div className=" bg-black/20 pt-16 flex justify-center h-full">
      <div className="h-full flex justify-center items-center p-4">
        <div className="container grid grid-cols-1 gap-4">
          <div className="text-white">
            <p data-aos="fade-up" className="text-sm">
              {/* Our Packages */}
            </p>
            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="font-bold text-2xl"
            >
              Search Rooms Around University Of Limpopo
            </p>
          </div>
          <div
            data-aos="fade-up"
            data-aos-delay="600"
            className="space-y-4 w-full bg-white rounded-md p-4 relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
              <div>
                <label htmlFor="section" className="opacity-70">
                  Sort By Location
                </label>
                <select name="section" className="w-full mt-3 bg-gray-100 my-2 range accent-primary focus:outline-primary focus:outline outline-1 py-[10px] rounded-[40px] px-2" id="">
                  <option value="All">All</option>
                  <option value="gate 1">Gate 1</option>
                  <option value="gate 2">Gate 2</option>
                  <option value="gate 3">Gate 3</option>
                  <option value="Ga-motintane">Ga-motintane</option>
                </select>
              </div>
              <div>
                <label htmlFor="destination" className="opacity-70 block">
                  <div className="w-full flex justify-between items-center">
                    <p>Max Price</p>
                    <p className="font-bold text-xl">R {priceValue}</p>
                  </div>
                </label>
                <div className=" bg-gray-100 rounded-full p-2 flex items-center justify-center ">
                  <input
                    type="range"
                    name="destination"
                    id="destination"
                    className="appearance-none w-full bg-gradient-to-r from-primary to-secondary h-2 rounded-full my-2"
                    min="600"
                    max="5000"
                    value={priceValue}
                    step="10"
                    onChange={(e) => setPriceValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button className="bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 px-4 py-2 rounded-full duration-200 absolute -bottom-5 left-1/2 -translate-x-1/2">
              Search Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
