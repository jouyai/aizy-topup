"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Word = {
  text: string;
  className?: string;
};

type Props = {
  words: Word[];
  delay?: number; // ms per karakter
  pause?: number; // ms antara kata
  loop?: boolean;
  className?: string;
};

export const TypewriterEffect: React.FC<Props> = ({
  words,
  delay = 50,
  pause = 1500,
  loop = true,
  className,
}) => {
  const [displayed, setDisplayed] = useState("");
  const [currentWord, setCurrentWord] = useState(0);
  const [typing, setTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (typing) {
      if (charIndex < words[currentWord].text.length) {
        timer = setTimeout(() => {
          setDisplayed((prev) => prev + words[currentWord].text[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, delay);
      } else {
        setTyping(false);
        timer = setTimeout(() => {
          setTyping(false);
        }, pause);
      }
    } else {
      timer = setTimeout(() => {
        setDisplayed("");
        setCharIndex(0);
        setCurrentWord((prev) => (prev + 1) % words.length);
        setTyping(true);
      }, pause);
    }

    return () => clearTimeout(timer);
  }, [charIndex, typing, currentWord, words, delay, pause]);

  return (
    <span className={cn("whitespace-nowrap", className)}>
      <span className={cn(words[currentWord]?.className)}>{displayed}</span>
      <span className="animate-pulse">|</span>
    </span>
  );
};