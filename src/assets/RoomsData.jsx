// Updated roomsData with categories and amenities
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
    },
  ];

export default roomsData;