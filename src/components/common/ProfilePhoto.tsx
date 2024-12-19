import { LiaUser } from "react-icons/lia";
import { useOS } from "../../hooks/useOS";

interface Props {
  photo?: string;
  mini?: boolean;
}

export const ProfilePhoto = ({ photo, mini }: Props) => {
  const { currentUser } = useOS();

  if (photo) {
    if (photo.search(".jpg") === -1) {
      return (
        <div
          className={`flex items-center justify-center overflow-hidden rounded-full border-4 border-white ${
            mini ? "h-[20vh] w-[20vh]" : "h-[25vh] w-[25vh]"
          }`}
        >
          {photo !== "no_photo" ? (
            <img className="h-full w-full" src={photo} alt="foto" />
          ) : (
            <LiaUser className="text-[80px]" />
          )}
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-full border-4 border-white ${
          mini ? "h-[20vh] w-[20vh]" : "h-[25vh] w-[25vh]"
        }`}
      >
        <img
          className="h-full w-full"
          src={`../../src-tauri/data/images/${photo}`}
          alt="foto"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-full border-4 border-white ${
        mini ? "h-[20vh] w-[20vh]" : "h-[25vh] w-[25vh]"
      }`}
    >
      {currentUser.photo !== "no_photo" ? (
        <img
          className="h-full w-full"
          src={`../../src-tauri/data/images/${currentUser.photo}`}
          alt="foto"
        />
      ) : (
        <LiaUser className="text-[80px]" />
      )}
    </div>
  );
};
