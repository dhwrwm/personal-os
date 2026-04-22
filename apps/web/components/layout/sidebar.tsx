"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/jobs", label: "Jobs" },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[220px] bg-gray-100 p-6 h-[93dvh]">
      <ul>
        {navItems.map((item) => (
          <li key={`${item.href}-${item.label}`} className="mb-2">
            <Link
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-gray-700 hover:bg-white hover:text-gray-900",
                pathname === item.href && "bg-white font-medium text-gray-900",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
