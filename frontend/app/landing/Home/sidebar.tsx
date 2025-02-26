"use client";

import Image from "next/image";
import Link from "next/link";
import { AiOutlineAim, AiOutlineHome } from "react-icons/ai";
import { TiContacts } from "react-icons/ti";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useState } from "react";

const sidebarItems = [
  {
    name: "Home",
    href: "/",
    icon: AiOutlineHome,
  },
  {
    name: "About",
    href: "/about",
    icon: TiContacts,
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        className="absolute -right-3 top-18 w-8 h-8 bg-gold rounded-full flex items-center justify-center cursor-pointer border border-grey500 hover:rotate-180 transition-transform duration-300"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <MdOutlineKeyboardArrowLeft />
      </button>

      <aside
        className={`${
          isCollapsed ? "w-24" : "w-64"
        } h-full bg-midnightblue p-6 transition-all duration-300 rounded-xl`}
      >
        <div className="w-fit flex items-center gap-4 pb-8 mb-4 border-b border-gunmetalgray">
          <Image
            src="/q.png"
            width={isCollapsed ? 48 : 80}
            height={isCollapsed ? 48 : 80}
            className="object-cover rounded-2xl border-2 border-gold"
            alt="logo"
          />
        </div>

        <ul className="pt-4">
          {sidebarItems.map(({ name, href, icon: Icon }) => (
            <li key={name} className="mb-4">
              <Link
                href={href}
                className="flex items-center text-lg text-white p-3 bg-opacity-20 bg-darkgray rounded-lg hover:bg-charcoal hover:scale-105 transition-all duration-300"
              >
                <span className="text-xl">
                  <Icon />
                </span>
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
