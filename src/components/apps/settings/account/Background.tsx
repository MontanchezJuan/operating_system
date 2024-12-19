import { globalColors } from "../../../../data/data";
import useStore from "../../../../store/useStore";

interface BackgroundProps {
  bg: string;
}

export const Background = ({ bg }: BackgroundProps) => {
  const color = useStore((store) => store.config.color);

  if (bg.search(".jpg") === -1) {
    return (
      <>
        {bg !== "no_background" ? (
          <img
            className="h-[200px] w-[400px] select-none"
            src={bg}
            alt="fondo"
          />
        ) : (
          <div
            className={`h-[200px] w-[400px] ${globalColors.bg[color].base}`}
          />
        )}
      </>
    );
  }

  return (
    <img
      className="h-[200px] w-[400px] select-none"
      src={`../../src-tauri/data/images/${bg}`}
      alt="fondo"
    />
  );
};
