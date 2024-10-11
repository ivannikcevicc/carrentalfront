import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import LogoutButton from "./logoutButton";
import { getUserInfo } from "@/lib/auth";

const Navbar = async () => {
  const user = await getUserInfo();
  return (
    <div className="flex p-[30px] justify-between border-b bg-white">
      <span className="text-[38px] font-bold text-primary">
        <Link href="/">Rev</Link>
      </span>
      <div className="flex gap-2 sm:gap-4 items-center">
        <Menubar className="border-b-2 border-b-transparent hover:border-b-primary transition-300 transition-all">
          <MenubarMenu>
            <MenubarTrigger>
              {" "}
              <Image
                src="/icons/heart.svg"
                alt="icon1"
                width={30}
                height={30}
                className="sm:w-[30px] sm:h-[30px] w-[25px] h-[25px]g"
              />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Menubar className="border-b-2 border-b-transparent hover:border-b-primary transition-300 transition-all">
          <MenubarMenu>
            <MenubarTrigger>
              {" "}
              <Image
                src="/icons/notification.svg"
                alt="icon2"
                width={30}
                height={30}
                className="sm:w-[30px] sm:h-[30px] w-[25px] h-[25px]"
              />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Menubar className="border-b-2 border-b-transparent hover:border-b-primary transition-300 transition-all">
          <MenubarMenu>
            <MenubarTrigger>
              {" "}
              <Image
                src="/icons/setting.svg"
                alt="icon3"
                width={30}
                height={30}
                className="sm:w-[30px] sm:h-[30px] w-[25px] h-[25px]"
              />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Menubar className="hover:scale-105 transition-300 transition-all ">
          <MenubarMenu>
            <MenubarTrigger>
              {" "}
              <Avatar className=" flex sm:h-[55px] sm:w-[55px] w-[40px] h-[40px]">
                {/* @ts-expect-error shadcn issue */}
                <AvatarImage src={user?.avatar} alt={"image"} />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <LogoutButton />
              </MenubarItem>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};

export default Navbar;
