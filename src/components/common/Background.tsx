import { useOS } from "../../hooks/useOS";

export const Background = () => {
  const { currentUser } = useOS();

  return (
    <>
      {currentUser.background && (
        <img
          className="absolute -z-10 h-screen w-screen select-none"
          src={`../../src-tauri/data/images/${currentUser.background}`}
          alt="fondo"
        />
      )}
    </>
  );
};
