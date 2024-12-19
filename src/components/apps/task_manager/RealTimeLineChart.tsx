import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { initialRealTime } from "../../../data/data";
import { Color } from "../../../interfaces/context/Config.interface";
import useStore from "../../../store/useStore";

const RealTimeLineChart = () => {
  const windowState = useStore((store) =>
    Object.values(store.apps)
      .flat()
      .find((app) => app.app.name === "TaskManager"),
  );

  if (!windowState) return;

  const [data, setData] =
    useState<{ time: number; value: number }[]>(initialRealTime);

  const memory = useStore((store) => store.memory);
  const color = useStore((store) => store.config.color);

  const colors: Record<Color, string> = {
    blue: "#60a5fa",
    cyan: "#22D3EE",
    green: "#4ADE80",
    orange: "#FB923C",
    pink: "#F472B6",
    purple: "#C084FC",
    red: "#F87171",
    yellow: "#FACC15",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => [
        ...prevData.slice(-9),
        { time: prevData[prevData.length - 1].time + 1, value: memory },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [windowState.width, memory, color]);

  return (
    <ResponsiveContainer
      width={windowState.isFullWindow ? "90%" : windowState.width * 0.8}
      height={300}
    >
      <AreaChart data={data}>
        <XAxis dataKey="time" />
        <YAxis domain={[0, 100]} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={`${colors[color]}`}
          fill={`${colors[color]}`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RealTimeLineChart;
