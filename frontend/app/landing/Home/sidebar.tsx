"use client"; // Add this directive at the very top

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
    const [isCollapsedSidebar, setIsCollapsedSidebar] = useState<boolean>(false);

    const toggleSidebarCollapseHandler = () => {
        setIsCollapsedSidebar((prev) => !prev);
    };

    return (
        <div className="sidebar_wrapper">
            <button className="btn" onClick={toggleSidebarCollapseHandler}>
                <MdOutlineKeyboardArrowLeft />
            </button>
            <aside className="sidebar" data-collapse={isCollapsedSidebar}>
                <div className="sidebar_top">
                    <Image
                        src="/q.png"
                        width={80}
                        height={80}
                        className="sidebar_logo"
                        alt="logo"
                    />

                
                </div>
                <ul className="sidebar_list">
                    {sidebarItems.map(({ name, href, icon: Icon }) => (
                        <li className="sidebar_item" key={name}>
                            <Link href={href} className="sidebar_link">
                                <span className="sidebar_icon">
                                    <Icon />
                                </span>
                                <span className="sidebar_name">{name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
} 