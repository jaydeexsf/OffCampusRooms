import React from "react";
import Location from "../components/Location/Location";

const About = () => {
  return (
    <>
      <div className="container pt-4 gradient-dark" >
        <div className="py-10">
          <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
            About Us
          </h1>
          <p>
            Welcome to UL Campus Pathways! Our mission is to assist students
            at the University of Limpopo in navigating the campus more
            efficiently. We understand that finding classrooms and other
            facilities can be a challenge, especially for new students. Our
            app provides users with easy access to the nearest classes and
            buildings, ensuring that they never miss a lecture.
          </p>
          <br />
          <p>
            With features like automatic location detection and clear
            directions, we aim to enhance the overall campus experience. We
            believe that every student deserves to feel at home and supported
            as they pursue their education. Our app is designed to empower
            students with the information they need to succeed.
          </p>
        </div>
      </div>
      <Location />
    </>
  );
};

export default About;
