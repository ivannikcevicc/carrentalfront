import React from "react";
import topWave from "./../../public/Top BG Wave.svg";
import bottomWave from "./../../public/Bottom BG Wave.svg";
import TestimonialsSlider from "./testimonialsSlider";

const Testimonials = () => {
  const testimonialsData = [
    {
      imgSrc: "https://github.com/shadcn.png",
      name: "Nikola Nikolic",
      location: "Podgorica, Montenegro",
      quote:
        "I feel very secure when using caretall's services. Your customer care team is very enthusiastic and the driver is always on time.",
    },
    {
      imgSrc: "https://github.com/shadcn.png",
      name: "Nikola Nikolic",
      location: "Podgorica, Montenegro",
      quote:
        "I feel very secure when using caretall's services. Your customer care team is very enthusiastic and the driver is always on time.",
    },
    {
      imgSrc: "https://github.com/shadcn.png",
      name: "Nikola Nikolic",
      location: "Podgorica, Montenegro",
      quote:
        "I feel very secure when using caretall's services. Your customer care team is very enthusiastic and the driver is always on time.",
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
