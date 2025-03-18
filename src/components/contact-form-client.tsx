"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Send, Loader2, CheckCircle } from "lucide-react";

export function ContactFormClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const form = document.getElementById("contact-form") as HTMLFormElement;
    if (!form) return;

    const handleSubmit = async (e: Event) => {
      e.preventDefault();

      const formData = new FormData(form);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const subject = formData.get("subject") as string;
      const message = formData.get("message") as string;

      // Validate form
      if (!name || !email || !subject || !message) {
        setError("Palun täida kõik väljad");
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Sõnumi saatmine ebaõnnestus");
        }

        // Success
        setIsSuccess(true);
        form.reset();

        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      } catch (err) {
        console.error("Error submitting contact form:", err);
        setError(
          err instanceof Error ? err.message : "Sõnumi saatmine ebaõnnestus",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    // Replace the submit button with our custom one
    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) {
      const newBtn = document.createElement("button");
      newBtn.type = "button";
      newBtn.className = submitBtn.className;
      newBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2"><line x1="22" x2="11" y1="2" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>Saada sõnum`;
      newBtn.addEventListener("click", handleSubmit);
      submitBtn.parentNode?.replaceChild(newBtn, submitBtn);
    }

    // Add event listener to form
    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, []);

  useEffect(() => {
    // Add status message container if it doesn't exist
    let statusContainer = document.getElementById("contact-form-status");
    if (!statusContainer) {
      statusContainer = document.createElement("div");
      statusContainer.id = "contact-form-status";
      statusContainer.className = "mt-4";
      const form = document.getElementById("contact-form");
      form?.parentNode?.insertBefore(statusContainer, form.nextSibling);
    }

    // Update status message
    if (error) {
      statusContainer.innerHTML = `<div class="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm border border-red-200 dark:border-red-800">${error}</div>`;
    } else if (isSuccess) {
      statusContainer.innerHTML = `<div class="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-sm border border-green-200 dark:border-green-800 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>Sõnum edukalt saadetud! Täname teiega ühendust võtmast.</div>`;
    } else {
      statusContainer.innerHTML = "";
    }
  }, [error, isSuccess]);

  return null;
}
