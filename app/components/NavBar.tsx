"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  UserRound,
  Stethoscope,
  ClipboardList,
  Home,
  Menu,
} from "lucide-react";
import { ModeToggle } from "@/components/themetoggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession, signOut } from "next-auth/react";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  submenu?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    title: "Patient Module",
    href: "/patients",
    icon: <UserRound className="mr-2 h-4 w-4" />,
    submenu: [
      {
        title: "All Patients",
        href: "/patient",
        icon: <Users className="mr-2 h-4 w-4" />,
      },
      {
        title: "Add Patient",
        href: "/patient/addpatient",
        icon: <UserRound className="mr-2 h-4 w-4" />,
      },
    ],
  },
  {
    title: "Doctor Module",
    href: "/doctor",
    icon: <Stethoscope className="mr-2 h-4 w-4" />,
    submenu: [
      {
        title: "Doctor Appointments",
        href: "/doctor/timelines",
        icon: <Users className="mr-2 h-4 w-4" />,
      },
      {
        title: "Doctor Consultation",
        href: "/doctor/2/consult",
        icon: <Users className="mr-2 h-4 w-4" />,
      },
    ],
  },

  {
    title: "Admin Module",
    href: "/admin",
    icon: <ClipboardList className="mr-2 h-4 w-4" />,
    submenu: [
      {
        title: "Add User/ Sign up",
        href: "/signup",
        icon: <UserRound className="mr-2 h-4 w-4" />,
      },
      {
        title: "Add Doctor",
        href: "/doctor/add",
        icon: <Stethoscope className="mr-2 h-4 w-4" />,
      },
      {
        title: "All Doctors",
        href: "/doctor",
        icon: <Users className="mr-2 h-4 w-4" />,
      },
      {
        title: "Doctors Profile",
        href: "/doctor/profile",
        icon: <Users className="mr-2 h-4 w-4" />,
      },
    ],
  },
];

function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        {/* Logo and Brand */}
        <div className="ml-4 mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="CareBridge Logo"
              width={28}
              height={28}
            />
            <span className="hidden text-xl font-bold md:inline-block">
              CareBridge
            </span>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="mt-8 flex flex-col gap-4">
              {navItems.map((item, index) => (
                <div key={index} className="space-y-3">
                  {item.submenu ? (
                    <>
                      <div className="flex items-center px-2 py-1 font-medium">
                        {item.icon}
                        {item.title}
                      </div>
                      <div className="space-y-2 border-l pl-4">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center rounded-md px-2 py-1 text-sm hover:bg-muted",
                              pathname === subItem.href
                                ? "bg-muted font-medium"
                                : "text-muted-foreground",
                            )}
                          >
                            {subItem.icon}
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center rounded-md px-2 py-1 hover:bg-muted",
                        pathname === item.href
                          ? "bg-muted font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {navItems.map((item, index) => (
            <div key={index} className="group relative">
              {item.submenu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center gap-1 rounded-md px-3 py-2 hover:bg-muted",
                        pathname.startsWith(item.href)
                          ? "bg-muted font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.submenu.map((subItem, subIndex) => (
                      <DropdownMenuItem key={subIndex} asChild>
                        <Link
                          href={subItem.href}
                          className={cn(
                            "flex w-full items-center",
                            pathname === subItem.href ? "font-medium" : "",
                          )}
                        >
                          {subItem.icon}
                          {subItem.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 hover:bg-muted",
                    pathname === item.href
                      ? "bg-muted font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Right side items */}
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          {session ? (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="font-medium">{session.user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  {session.user?.role}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => <Link href={"/signup"}></Link>}>
              Sign Up
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
