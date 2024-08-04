import React, { useEffect, useState } from "react";

export default function useFloatingEffect() {
  const [style, setStyle] = useState({});
  useEffect(() => {
    let mounted = true;
    const amplitude = Math.random() * 10 + 5;
    const speed = Math.random() * 2000 + 1000;
    const angle = Math.random() * 2 * Math.PI;

    const updatePosition = () => {
      if (!mounted) return;
      const y = Math.sin(Date.now() / speed + angle) * amplitude;
      setStyle({
        transform: `translateY(${y}px)`
      });
    };

    const intervalId = setInterval(updatePosition, 40);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return style;
}
