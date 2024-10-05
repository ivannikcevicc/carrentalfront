"use client";

import React, { useState, useEffect } from "react";
import StarIcon from "./../../public/star.svg";
import ReservationsIcon from "./../../public/reservations.svg";
import ProfileIcon from "./../../public/user.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SettingsNavItems = [
  {
    imgSrc: ProfileIcon.src,
    label: "Profile",
    href: "/editProfile",
  },
  {
    imgSrc: ReservationsIcon.src,
    label: "Reservations",
    href: "/reservations",
  },
  {
    imgSrc: StarIcon.src,
    label: "Reviews",
    href: "/reviews",
  },
];

const SettingsNav = () => {
  const pathname = usePathname();
  const [activeUrl, setActiveUrl] = useState(pathname);

  useEffect(() => {
    setActiveUrl(pathname);
  }, [pathname]);

  return (
    <div className="flex flex-col gap-10 text-[22px] lg:text-[26px]">
      {SettingsNavItems.map((item) => {
        const activeColor = "#3563E9";
        const inactiveColor = "#1A202C";
        const textColor = activeUrl === item.href ? activeColor : inactiveColor;

        const imgFilter =
          activeUrl === item.href
            ? "invert(28%) sepia(97%) saturate(2724%) hue-rotate(220deg) brightness(97%) contrast(88%)"
            : "none";

        return (
          <Link
            className={`flex gap-2 items-center  `}
            key={item.label}
            href={item.href}
            style={{ color: textColor }}
            onClick={() => setActiveUrl(item.href)}
          >
            <img
              src={item.imgSrc}
              alt={`${item.label} icon`}
              className="w-8 h-8 mr-2"
              style={{ filter: imgFilter }}
            />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default SettingsNav;
