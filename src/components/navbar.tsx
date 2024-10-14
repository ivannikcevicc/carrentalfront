"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import { getUserInfo } from "@/lib/auth";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { LoggedUserData } from "@/lib/types";
import LogoutButton from "./logoutButton";
import { usePathname } from "next/navigation";
import AvatarBlank from "./../../public/avatar.webp";

const Navbar = () => {
  const [user, setUser] = useState<LoggedUserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    {
      name: "Edit Profile",
      link: "/editProfile",
      icon: "/icons/editProfile.svg",
    },
    {
      name: "Reservations",
      link: "/reservations",
      icon: "/icons/rent.svg",
    },
    { name: "Favorites", link: "/favorites", icon: "/icons/heartBlack.svg" },
  ];

  return (
    <div className="flex p-[30px] justify-between border-b bg-white animate-fadeIn">
      <span className="text-[28px] sm:text-[38px] font-bold text-primary hover:scale-105 transition-transform duration-300">
        <Link href="/">EasyRide</Link>
      </span>
      <div className="hidden sm:flex gap-4 items-center">
        {user ? (
          <>
            {menuItems.map((item, index) => (
              <div key={index} className="hover-up">
                <div
                  className={`flex border-b-2 mr-4 ${
                    pathname === item.link
                      ? "border-b-primary"
                      : "border-b-transparent"
                  }  hover:border-b-primary transition-300 transition-all`}
                >
                  <Link href={item.link}>
                    {" "}
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={30}
                      height={30}
                    />
                  </Link>
                </div>
              </div>
            ))}
            <div className="hover-scale">
              <Menubar className="hover:scale-105 transition-300 transition-all">
                <MenubarMenu>
                  <MenubarTrigger>
                    <Avatar className="h-[55px] w-[55px]">
                      <AvatarImage
                        src={user?.avatar || AvatarBlank.src}
                        alt={user?.name}
                      />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  </MenubarTrigger>
                  <MenubarContent>
                    <span className="font-semibold p-3">{user.name}</span>
                    <MenubarItem>
                      <LogoutButton />
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </>
        ) : (
          <div className="hover-scale">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        )}
      </div>
      <div className="sm:hidden">
        {user ? (
          <div className="hover-scale">
            <Button onClick={toggleMenu}>
              <Menu />
            </Button>
          </div>
        ) : (
          <div className="hover-scale">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        )}
      </div>
      {isMenuOpen && user && (
        <div
          className={`fixed inset-0 bg-white z-50 p-4 ${
            isMenuOpen ? "animate-slideIn" : "animate-slideOut"
          }`}
        >
          <div className="flex justify-between items-center mb-4 p-[.8rem]">
            <span className="text-[28px] font-bold text-primary">
              <Link href="/" onClick={closeMenu}>
                EasyRide
              </Link>
            </span>
            <div className="hover-scale">
              <Button onClick={toggleMenu}>
                <X />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="hover-right flex items-center p-5 gap-2">
              <Avatar className="h-[40px] w-[40px] mr-2">
                <AvatarImage
                  src={user?.avatar || AvatarBlank.src}
                  alt={user?.name}
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{user.name}</span>
            </div>
            {menuItems.map((item, index) => (
              <div key={index} className="hover-right">
                <Link href={item.link} onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    className={`justify-start w-full pb-5 ${
                      pathname === item.link
                        ? "border-b-primary"
                        : "border-b-transparent"
                    }  hover:border-b-primary border-b-2  transition-300 transition-all`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={25}
                      height={25}
                      className="mr-2"
                    />
                    {item.name}
                  </Button>
                </Link>
              </div>
            ))}
            <div className="hover-right">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-slideOut {
          animation: slideOut 0.3s ease-in;
        }
        .hover-up {
          transition: transform 0.3s ease;
        }
        .hover-up:hover {
          transform: translateY(-2px);
        }
        .hover-scale {
          transition: transform 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
        .hover-right {
          transition: transform 0.3s ease;
        }
        .hover-right:hover {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
};

export default Navbar;
