"use client";

import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import CheckoutModal from "./checkout-modal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className={className}
        {...props}
      >
        {children}
      </Button>

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
      />
    </>
  );
}
