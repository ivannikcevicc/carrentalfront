import React from "react";
import topWave from "./../../public/Top BG Wave.svg";
import bottomWave from "./../../public/Bottom BG Wave.svg";
import TestimonialsSlider from "./testimonialsSlider";

const Testimonials = () => {
  const testimonialsData = [
    {
      imgSrc: "https://randomuser.me/api/portraits/men/3.jpg",
      name: "Marko Vuković",
      location: "Budva, Montenegro",
      quote:
        "Excellent service! The car was in perfect condition, and the pickup process was quick and hassle-free. I'll definitely use this app again on my next visit to Montenegro.",
    },
    {
      imgSrc: "https://randomuser.me/api/portraits/women/76.jpg",
      name: "Ana Perović",
      location: "Kotor, Montenegro",
      quote:
        "I'm impressed with the variety of cars available. Found exactly what I needed for my family trip. The staff was friendly and professional. Highly recommend!",
    },
    {
      imgSrc: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Stefan Đurović",
      location: "Herceg Novi, Montenegro",
      quote:
        "The app is user-friendly and made booking a car so easy. Great prices too! The car was clean and well-maintained. Will definitely use this service again.",
    },
    {
      imgSrc: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Milica Radović",
      location: "Tivat, Montenegro",
      quote:
        "Outstanding customer service! When I had a flat tire, their support team responded quickly and sent help. They turned a stressful situation into a positive experience.",
    },
    {
      imgSrc: "https://randomuser.me/api/portraits/men/46.jpg",
      name: "Luka Popović",
      location: "Bar, Montenegro",
      quote:
        "As a frequent traveler to Montenegro, I've tried several car rental services. This app stands out for its reliability and quality of vehicles. It's now my go-to choice.",
    },
  ];

  return (
    <div className="mt-[2rem]">
      <img src={topWave.src} alt="topWave" className="w-full" />
      <div className="min-h-[80vh] bg-[#E0EAF6] flex flex-col items-center justify-center gap-4 py-12">
        <span className="uppercase text-primary font-semibold py-3 px-7 rounded-lg bg-[#1571d313]">
          Testimonials
        </span>
        <h2 className="font-bold text-[38px] text-[#333333] text-center">
          What people say about us?
        </h2>
        <div className="w-full mt-8">
          <TestimonialsSlider data={testimonialsData} />
        </div>
      </div>
      <img src={bottomWave.src} alt="bottomWave" className="w-full" />
    </div>
  );
};

export default Testimonials;
