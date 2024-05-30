"use client";
import { formatText, TypewriterContainer } from "@/utils/formattedText";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

const Typewriter = ({ text, speed = 50, createdChatId }) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [formattedText, setFormattedText] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (currentIndex < text.length) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, speed);
    } else {
      clearInterval(interval);
      setFormattedText(formatText(text));

      const params = new URLSearchParams(searchParams);
      if (createdChatId) {
        params.set("chatId", createdChatId);
      } else {
        params.delete("chatId");
      }

      replace(`${pathname}?${params.toString()}`);
    }

    return () => clearInterval(interval);
  }, [
    createdChatId,
    currentIndex,
    pathname,
    replace,
    searchParams,
    speed,
    text,
  ]);

  if (formattedText.length > 0) {
    return <TypewriterContainer>{formattedText}</TypewriterContainer>;
  } else {
    return (
      <TypeAnimation
        sequence={text}
        wrapper="span"
        speed={50}
        cursor={false}
        style={{
          fontSize: "14px",
          display: "inline-block",
          padding: "1rem 0",
        }}
        repeat={1}
      />
    );
  }
};

export default Typewriter;

// \n  => line break
// **iPhone 15 Pro Max**\  bold text
// \u301027\u2020source\u3011
// -
