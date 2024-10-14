import React from "react";
import Slider from "react-slick";
import myimage from '../../assets/myimage.png'
import myimage2 from '../../assets/myimage2.png'


// Team data
const teamData = [
  {
    id: 1,
    name: "Johannes Ibrahim Moloantoa",
    profession: "Founder, CEO and Lead Software Engineer",
    img: myimage,
  },
  {
    id: 2,
    name: "Muhammed Ali",
    profession: "Environmentalist",
    img: "https://picsum.photos/201/201",
  },
  {
    id: 3,
    name: "Ayyub",
    profession: "Marketing Specialist",
    img: "https://picsum.photos/203/203",
  },
  {
    id: 4,
    name: "Abdull Malik",
    profession: "Legal Represantative",
    img: "https://picsum.photos/203/204",
  },
  {
    id: 5,
    name: "Manqoba",
    profession: "Legal Advicer",
    img: "https://picsum.photos/203/205",
  },
  {
    id: 6,
    name: "Osama bin Laka",
    profession: "Backend Developer",
    img: myimage2,
  },
  {
    id: 7,
    name: "Karabo Salim",
    profession: "Graphic Designer, Mentor and Consultant",
    img: "https://picsum.photos/203/206",
  },
  
];

const settings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
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

const OurTeam = () => {
  return (
    <div className="py-10 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Meet Our Team</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Learn more about the professionals behind our success.
          </p>
        </div>

        {/* Team Members Section */}
        <div className="max-w-5xl mx-auto">
          <Slider {...settings}>
            {teamData.map(({ id, name, profession, img }) => (
              <div key={id} className="px-4">
                <div className="flex flex-col items-center gap-2 text-center bg-primary dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="relative w-[170px] h-[170px] rounded-full overflow-hidden border-4 border-secondary">
                    <img src={img} alt={`${name + ' ' + profession + ' of OffCampusRooms' } photo`} className="w-full h-full object-cover" />
                  </div>
                  <h1 className="text-md text-white font-semibold">{name}</h1>
                  <p className="text-xs text-gray-100">{profession}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
