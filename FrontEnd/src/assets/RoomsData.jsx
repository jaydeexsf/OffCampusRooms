import Img1 from "./places/boat.jpg";
import Img2 from "./places/tajmahal.jpg";
import Img3 from "./places/water.jpg";
import Img4 from "./places/place4.jpg";
import Img5 from "./places/place5.jpg";
import Img6 from "./places/place6.jpg";

const roomsData = [
  {
    img: Img1,
    title: "Gate 1 Hostel",
    description: "A comfortable and secure hostel located near Gate 1 of the University of Limpopo.",
    price: 3000,
    minutesAway: 5,
    location: "Gate 1",
    amenities: {
      wifi: true,
      shower: true,
      bathtub: false,
      table: true,
      bed: true,
      electricity: true,
    },
    contact: {
      phone: "012-345-6789",
      whatsapp: "+27 71 234 5678",
      email: "contact@gate1hostel.com",
    },
    images: [Img1, Img2, Img3],
    availableRooms: 3,
  },
  {
    img: Img2,
    title: "Gate 2 Lodge",
    description: "A cozy lodge situated close to Gate 2, offering great amenities for students.",
    price: 3500,
    minutesAway: 8,
    location: "Gate 2",
    amenities: {
      wifi: true,
      shower: true,
      bathtub: false,
      table: true,
      bed: true,
      electricity: true,
    },
    contact: {
      phone: "011-234-5678",
      whatsapp: "+27 73 987 6543",
      email: "contact@gate2lodge.com",
    },
    images: [Img4, Img5, Img6],
    availableRooms: 0, 
  },
  {
    img: Img3,
    title: "Gate 3 Apartments",
    description: "Modern apartments located near Gate 3, ideal for student living.",
    price: 4000,
    minutesAway: 10,
    location: "Gate 3",
    amenities: {
      wifi: true,
      shower: false,
      bathtub: true,
      table: true,
      bed: true,
      electricity: true,
    },
    contact: {
      phone: "010-876-5432",
      whatsapp: "+27 79 123 4567",
      email: "contact@gate3apartments.com",
    },
    images: [Img1, Img2, Img3],
    availableRooms: 2, // Added available rooms
  },
  {
    img: Img4,
    title: "Motintane Residence",
    description: "Spacious residence near Motintane with easy access to the university.",
    price: 3200,
    minutesAway: 7,
    location: "Motintane",
    amenities: {
      wifi: false,
      shower: true,
      bathtub: false,
      table: true,
      bed: true,
      electricity: true,
    },
    contact: {
      phone: "013-765-4321",
      whatsapp: "+27 82 987 6543",
      email: "contact@motintaneresidence.com",
    },
    images: [Img2, Img4, Img5],
    availableRooms: 1, // Added available rooms
  },
  {
    img: Img5,
    title: "Nearby Flats",
    description: "Affordable flats near the university campus, perfect for students.",
    price: 2800,
    minutesAway: 6,
    location: "Nearby",
    amenities: {
      wifi: true,
      shower: false,
      bathtub: false,
      table: true,
      bed: true,
      electricity: true,
    },
    contact: {
      phone: "015-678-1234",
      whatsapp: "+27 84 567 8901",
      email: "contact@nearbyflats.com",
    },
    images: [Img3, Img4, Img6],
    availableRooms: 5, // Added available rooms
  },
  {
    img: Img6,
    title: "Hostel Accommodation",
    description: "Well-maintained hostel accommodation close to the university campus.",
    price: 3100,
    minutesAway: 9,
    location: "Hostel",
    amenities: {
      wifi: true,
      shower: true,
      bathtub: false,
      table: false,
      bed: true,
      electricity: true,
    },
    contact: {
      phone: "012-987-6543",
      whatsapp: "+27 85 678 4321",
      email: "contact@hostelaccommodation.com",
    },
    images: [Img1, Img2, Img6],
    availableRooms: 4, // Added available rooms
  }
];

export default roomsData;
