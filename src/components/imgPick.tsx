"use client";

import React from "react";
import CarImg from "./../../public/porscheLarge.png";
import CarImg2 from "./../../public/porscheLarge - Copy.png";
import CarImg3 from "./../../public/porscheLarge - Copy (2).png";
import { Car } from "@/lib/types";

const ImgPick = ({ car }: { car: Car }) => {
  const [selectedCarUrl, setSelectedCarUrl] = React.useState(CarImg.src);
  return (
    <div className="w-full ">
      <img src={selectedCarUrl} alt="img" className="w-full rounded-3xl" />
      <div className="grid grid-cols-3 gap-4 mt-4 w-full ">
        {[CarImg, CarImg2, CarImg3].map((img) => (
          <button key={img.src} onClick={() => setSelectedCarUrl(img.src)}>
            <img
              src={img.src}
              alt="img"
              className={`rounded-3xl border-4 transition-all ${
                img.src === selectedCarUrl
                  ? " border-primary"
                  : "border-transparent"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImgPick;
