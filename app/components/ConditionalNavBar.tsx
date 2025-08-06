"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function ConditionalNavBar() {
  const pathname = usePathname();
  
  // Hide navbar on signin and signup pages
  const hideNavBar = pathname === '/signin' || pathname === '/signup';
  
  if (hideNavBar) {
    return null;
  }
  
  return <NavBar />;
}
