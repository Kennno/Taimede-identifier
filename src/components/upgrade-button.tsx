"use client";

import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import CheckoutPopup from "./checkout-popup";

interface UpgradeButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
  userId: string;
}

export default function UpgradeButton({
  children,
  className,
  userId,
  ...props
}: UpgradeButtonProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsPopupOpen(true)}
        className={className}
        {...props}
      >
        {children}
      </Button>

      <CheckoutPopup
        user={{ id: userId }}
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
      />
    </>
  );
}
