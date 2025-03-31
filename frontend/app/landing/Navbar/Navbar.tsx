import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import Signdialog from "./Signdialog";
import Registerdialog from "./Registerdialog";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "#home", current: true },
  { name: "About", href: "#about", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CustomLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }

    onClick();
  };

  return (
    <Link href={href} passHref>
      <span
        onClick={handleClick}
        className="px-3 py-4 text-lg font-normal cursor-pointer"
      >
        {children}
      </span>
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentLink, setCurrentLink] = useState("/");

  // Track scroll position to update active link
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      for (const item of navigation) {
        const targetId = item.href.replace("#", "");
        const element = document.getElementById(targetId);

        if (element) {
          const elementTop = element.offsetTop;
          const elementHeight = element.offsetHeight;

          if (
            scrollPosition >= elementTop - 100 &&
            scrollPosition < elementTop + elementHeight - 100
          ) {
            setCurrentLink(item.href);
            break;
          }
        }
      }
    };

    // Set initial active link
    handleScroll();

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setCurrentLink(href);
  };

  return (
    <Disclosure
      as="nav"
      className="navbar sticky top-0 bg-white/40 backdrop-blur-sm shadow-sm"
    >
      <>
        <div className="mx-auto max-w-7xl px-6 py-2 lg:px-8">
          <div className="relative flex h-8 md:h-12 items-center justify-between">
            <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">
              {/* LOGO */}

              <div className="flex flex-shrink-0 items-center">
                <img
                  className="block h-12 w-auto lg:hidden"
                  src={"/assets/logo/logo1.png"}
                  alt="dsign-logo"
                />
                <img
                  className="hidden h-12 w-auto lg:block"
                  src={"/assets/logo/logo1.png"}
                  alt="dsign-logo"
                />
              </div>

              {/* LINKS */}

              <div className="hidden lg:block m-auto">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <CustomLink
                      key={item.name}
                      href={item.href}
                      onClick={() => handleLinkClick(item.href)}
                    >
                      <span
                        className={classNames(
                          item.href === currentLink
                            ? "underline-links text-midnightblue"
                            : "text-slategray",
                          "px-3 py-4 text-lg font-normal opacity-75 hover:opacity-100 transition-all duration-200"
                        )}
                        aria-current={
                          item.href === currentLink ? "page" : undefined
                        }
                      >
                        {item.name}
                      </span>
                    </CustomLink>
                  ))}
                </div>
              </div>
            </div>

            {/* SIGNIN DIALOG */}

            <Signdialog />

            {/* REGISTER DIALOG */}

            <Registerdialog />

            {/* DRAWER FOR MOBILE VIEW */}

            {/* DRAWER ICON */}

            <div className="block lg:hidden">
              <Bars3Icon
                className="block h-6 w-6"
                aria-hidden="true"
                onClick={() => setIsOpen(true)}
              />
            </div>

            {/* DRAWER LINKS DATA */}

            <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
              <Drawerdata />
            </Drawer>
          </div>
        </div>
      </>
    </Disclosure>
  );
};

export default Navbar;
