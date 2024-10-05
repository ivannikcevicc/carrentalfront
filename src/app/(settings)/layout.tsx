import Navbar from "@/components/navbar";
import SettingsNav from "@/components/SettingsNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="lg:p-10 sm:p-7 p-5">
        <h3 className="font-semibold sm:text-[35px] text-[30px] md:text-[40px]">
          Account Dashboard
        </h3>
        <div className="flex p-3 py-10">
          <aside className="lg:pr-[15%]">
            <div className="flex items-center mb-4 ">
              <Avatar className=" flex lg:h-[85px] lg:w-[85px] w-[65px] h-[65px] lg:mx-3 mx-2 lg:mr-4 mr-3">
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  alt={"image"}
                />
                <AvatarFallback>image</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="lg:text-[32px] text-[26px] font-semibold">
                  Nikola Nikolic
                </h3>
                <p className="lg:text-[22.5px] text-[17.5px] font-semibold text-gray-500">
                  Jan 20, 2024
                </p>
              </div>
            </div>
            <div className="flex my-[4.25rem] mx-[3.75rem]">
              <SettingsNav />
            </div>
          </aside>
          <main> {children}</main>
        </div>
      </div>
    </>
  );
};

export default layout;
