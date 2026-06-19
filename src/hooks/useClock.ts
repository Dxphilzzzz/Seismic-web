"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export function useClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(format(now, "HH:mm:ss"));
      setDate(format(now, "EEEE, MMMM dd, yyyy"));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return { time, date };
}
