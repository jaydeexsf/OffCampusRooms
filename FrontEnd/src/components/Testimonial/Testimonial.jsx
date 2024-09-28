import React from "react";
import Slider from "react-slick";

const testimonialData = [
  {
    id: 1,
    name: "Lerato",
    text: "StudentRooms has been a game-changer for me. I was able to find a great place near the University of Limpopo quickly and easily. The user-friendly interface and detailed listings made my search stress-free.",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Muhammed",
    text: "The booking process through StudentRooms was seamless. I appreciate the accurate information and responsive support team. It made securing accommodation near campus a breeze.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Katlego",
    text: "I highly recommend StudentRooms for any student looking for housing near the University of Limpopo. The variety of options and clear descriptions helped me find a perfect place for my needs.",
    img: "https://picsum.photos/103/103",
  },
];

const settings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 600,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  cssEase: "linear",
  pauseOnHover: true,
  pauseOnFocus: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Testimonial = () => {
  return (
    <div data-aos="fade-up" data-aos-duration="300" className="py-10 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Testimonial
          </p>
          <h1 className="text-3xl font-bold mb-2">What Our Users Say</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Hear from our satisfied users about their experiences with our platform.
          </p>
        </div>
        {/* Testimonial section */}
        <div data-aos="zoom-in" data-aos-duration="300" className="max-w-3xl mx-auto">
          <Slider {...settings}>
            {testimonialData.map(({ id, name, text, img }) => (
              <div key={id} className="px-4 ">
                <div className="flex h-[300px] flex-col items-center gap-4 text-center bg-primary dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <img src={img} alt={`${name}'s photo`} className="rounded-full w-24 h-24 object-cover" />
                  <h1 className="text-xl text-white font-semibold">{name}</h1>
                  <p className="text-gray-100/60 dark:text-gray-300 text-sm">{text.length > 210 ? text : text.slice(0, 210) + '..' }</p>
                  <p className="text-gray-400 text-6xl font-serif absolute top-0 right-0 opacity-20">
                    ,,
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
