"use client";

import { Button } from "./ui/button";

interface SubscriptionButtonProps {
  isSubscribed: boolean;
  className?: string;
}

export default function SubscriptionButton({
  isSubscribed,
  className = "",
}: SubscriptionButtonProps) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("openCheckoutPopup"));
  };

  return (
    <Button className={className} onClick={handleClick}>
      {isSubscribed ? "Manage Subscription" : "Upgrade to Premium"}
    </Button>
  );
}
