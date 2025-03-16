"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";

interface LanguageSwitcherProps {
  currentLanguage: string;
}

export function LanguageSwitcher({ currentLanguage }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant={currentLanguage === "en" ? "default" : "outline"}
        size="sm"
        className={`text-sm px-3 py-2 h-auto ${currentLanguage === "en" ? "bg-green-600 hover:bg-green-700" : ""}`}
        asChild
      >
        <Link
          href={`${pathname}?language=en`}
          prefetch={false}
          className="flex items-center gap-2"
        >
          <Image
            src="https://flagcdn.com/w20/gb.png"
            alt="UK Flag"
            width={20}
            height={15}
            className="rounded-sm"
          />
          <span>English</span>
        </Link>
      </Button>
      <Button
        variant={currentLanguage === "et" ? "default" : "outline"}
        size="sm"
        className={`text-sm px-3 py-2 h-auto ${currentLanguage === "et" ? "bg-green-600 hover:bg-green-700" : ""}`}
        asChild
      >
        <Link
          href={`${pathname}?language=et`}
          prefetch={false}
          className="flex items-center gap-2"
        >
          <Image
            src="https://flagcdn.com/w20/ee.png"
            alt="Estonia Flag"
            width={20}
            height={15}
            className="rounded-sm"
          />
          <span>Eesti</span>
        </Link>
      </Button>
    </div>
  );
}
