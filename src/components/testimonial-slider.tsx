"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  date: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Marta",
    date: "15.05.2024",
    text: "RoheAI on täiesti muutnud minu suhet taimedega. Nüüd saan kiiresti tuvastada iga taime oma aias ja saan täpselt teada, kuidas nende eest hoolitseda.",
  },
  {
    id: 2,
    name: "Jaan",
    date: "03.07.2024",
    text: "Olen alati armastanud taimi, kuid mul polnud aimugi, kuidas nende eest õigesti hoolitseda. RoheAI on olnud suurepärane abimees ja nüüd õitsevad kõik minu taimed!",
  },
  {
    id: 3,
    name: "Liisa",
    date: "22.09.2024",
    text: "Suurepärane rakendus! Aitab mul tuvastada taimi jalutuskäikudel ja annab kasulikke näpunäiteid minu koduaias kasvavate taimede kohta.",
  },
  {
    id: 4,
    name: "Andres",
    date: "10.11.2024",
    text: "Olen kasutanud mitmeid taimede tuvastamise rakendusi, kuid RoheAI on kaugelt parim. Täpne, kiire ja eestikeelne - just seda ma vajasin!",
  },
  {
    id: 5,
    name: "Kati",
    date: "05.01.2025",
    text: "Minu toataimed on tänu RoheAI-le terved ja õnnelikud. Saan alati kiiresti abi, kui märkan mõnda probleemi oma taimedel.",
  },
  {
    id: 6,
    name: "Tõnu",
    date: "18.03.2025",
    text: "Premium tellimus on seda väärt! AI abiline on aidanud mind kõigi minu taimeküsimustega ja ma olen õppinud nii palju uut.",
  },
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 dark:text-white">
        Mida meie kasutajad ütlevad
      </h2>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 h-full bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <Quote className="h-8 w-8 text-green-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      {testimonial.text}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.date}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={prevTestimonial}
          className="rounded-full border-gray-300 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </Button>
        <div className="flex gap-1 items-center">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-green-600 w-4" : "bg-gray-300 dark:bg-gray-700"}`}
              onClick={() => {
                setCurrentIndex(index);
                setAutoplay(false);
                setTimeout(() => setAutoplay(true), 10000);
              }}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={nextTestimonial}
          className="rounded-full border-gray-300 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </Button>
      </div>
    </div>
  );
}
