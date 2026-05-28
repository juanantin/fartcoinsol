import { useEffect, useState } from "react";

interface Props {
  text: string;
  speed?: number;
  onDone?: () => void;
  className?: string;
}

export function Typewriter({ text, speed = 18, onDone, className }: Props) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone]);

  return <span className={className}>{shown}</span>;
}
