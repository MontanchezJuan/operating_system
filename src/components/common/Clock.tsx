import { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex min-h-full w-[100px] flex-col items-center justify-center">
      <span className="text-sm">{time.toLocaleTimeString()}</span>
      <span className="text-sm">{time.toLocaleDateString()}</span>
    </div>
  );
};

export default Clock;
