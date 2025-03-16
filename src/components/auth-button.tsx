"use client";

import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { AuthModal } from "./auth-modal";

interface AuthButtonProps extends ButtonProps {
  mode: "sign-in" | "sign-up";
  children: React.ReactNode;
  className?: string;
}

export default function AuthButton({
  mode,
  children,
  className,
  ...props
}: AuthButtonProps) {
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

      <AuthModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultTab={mode}
      />
    </>
  );
}
