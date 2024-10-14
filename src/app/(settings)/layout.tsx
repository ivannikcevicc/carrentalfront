import Navbar from "@/components/navbar";
import SettingsNav from "@/components/SettingsNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/auth";
import { AvatarImage } from "@radix-ui/react-avatar";
import { redirect } from "next/navigation";
import React from "react";
import AvatarBlank from "./../../../public/avatar.webp";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserInfo();

  return (
    <>
      {user ? (
        <Navbar />
      ) : (
        <Button onClick={() => redirect("/login")}>Login</Button>
      )}

      <div className="lg:py-10 sm:py-7 py-5 pr-0 xl:pl-[6rem] pl-4">
        {/* User info for small screens */}
        <div className="md:hidden flex items-center mb-4 pt-3 pl-7">
          <Avatar className="flex w-[55px] h-[55px] mr-3">
            <AvatarImage
              src={user?.avatar || AvatarBlank.src}
              alt={user?.name}
            />
            <AvatarFallback>image</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-[23px] font-semibold">{user?.name}</h3>
            <p className="text-[15px] font-semibold text-gray-500">
              Jan 20, 2024
            </p>
          </div>
        </div>

        {/* Title for larger screens */}
        <h3 className="font-semibold sm:text-[35px] text-[30px] md:text-[35px] md:block hidden">
          Account Dashboard
        </h3>

        <div className="flex flex-col md:flex-row p-3 py-10">
          {/* Sidebar for larger screens */}
          <aside className="hidden md:block">
            <div className="flex items-center mb-4">
              <Avatar className="flex lg:h-[70px] lg:w-[70px] w-[55px] h-[55px] lg:mx-3 mx-2 lg:mr-4 mr-3">
                <AvatarImage
                  src={user?.avatar || AvatarBlank.src}
                  alt={user?.name}
                />
                <AvatarFallback>{user?.name}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="lg:text-[28px] text-[23px] font-semibold">
                  {user?.name}
                </h3>
                <p className="lg:text-[20px] text-[15px] font-semibold text-gray-500">
                  Jan 20, 2024
                </p>
              </div>
            </div>
            <div className="flex lg:my-[4.25rem] lg:mx-[3.75rem] my-[3.25rem] mx-[2.5rem]">
              <SettingsNav />
            </div>
          </aside>

          {/* Main content */}
          <main className="mx-auto lg:mx-0 w-full md:w-auto">{children}</main>
        </div>
      </div>
    </>
  );
};

export default layout;
