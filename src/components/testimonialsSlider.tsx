// import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Testimonial } from "@/lib/types";

// const TestimonialsSlider = ({ data }: { data: Testimonial[] }) => {
//   return (
//     <div className="grid grid-cols-3 gap-4 mx-6">
//       {data.map((testimonial) => (
//         <div
//           className="bg-white flex flex-col gap-4 rounded-xl px-6 py-8"
//           key={testimonial.name}
//         >
//           <div className="flex gap-4 items-center">
//             <Avatar className=" flex sm:h-[55px] sm:w-[55px] w-[40px] h-[40px] ml-3">
//               <AvatarImage src={testimonial.imgSrc} />
//               <AvatarFallback>Avatar</AvatarFallback>
//             </Avatar>
//             <div className="gap-1 flex flex-col">
//               <span className="text-[25px] font-semibold">
//                 {testimonial.name}
//               </span>
//               <span className="text-[17.5px] font-semibold text-gray-500">
//                 {testimonial.location}
//               </span>
//             </div>
//           </div>
//           <p className="text-[22px]">“{testimonial.quote}”</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TestimonialsSlider;

"use client";

import React from "react";
import Slider from "react-slick";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "@/lib/types";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialsSlider = ({ data }: { data: Testimonial[] }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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

  return (
    <div className="w-full mx-auto px-4">
      <Slider {...settings}>
        {data.map((testimonial, index) => (
          <div key={index} className="px-2">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className=" flex sm:h-[55px] sm:w-[55px] w-[40px] h-[40px] mx-3">
                    <AvatarImage
                      src={testimonial.imgSrc}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-[25px] font-semibold">
                      {testimonial.name}
                    </h3>
                    <p className="text-[17.5px] font-semibold text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="text-[22px]">&quot;{testimonial.quote}&quot;</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialsSlider;
