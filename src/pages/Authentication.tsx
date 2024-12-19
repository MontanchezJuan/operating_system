import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SelectUser } from "../components/authentication/SelectUser";
import { minimumTextSize } from "../utils/utils";

import { useTranslation } from "react-i18next";
import { PAGES } from ".";
import { Background } from "../components/common/Background";
import { Loader } from "../components/common/Loader";
import { ProfilePhoto } from "../components/common/ProfilePhoto";
import { useOS } from "../hooks/useOS";
import useStore from "../store/useStore";
import { get_config, login } from "../utils/invoke";

export const Authentication = () => {
  const [password, setPassword] = useState<string>("");
  const [hasError, setHasError] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  const { i18n } = useTranslation();

  const { currentUser } = useOS();

  const setConfig = useStore((store) => store.setConfig);

  const navigate = useNavigate();

  const getConfig = async () => {
    const res = await get_config(currentUser.id);
    setConfig(res);
    i18n.changeLanguage(res.language);
  };

  useEffect(() => {
    setPassword("");
    setHasError(null);
    setIsPageLoading(false);
  }, [currentUser]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          setIsPageLoading(true);
          login(currentUser.username, password)
            .then(() => {
              getConfig();
              navigate(PAGES[1].path, { replace: true });
              setHasError(null);
            })
            .catch((e) => setHasError(e))
            .finally(() => {
              setPassword("");
              setIsPageLoading(false);
            });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentUser, password]);

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <Loader isLoading={isPageLoading} />

      <Background />

      <SelectUser />

      <ProfilePhoto />

      <h1 className="text-4xl font-semibold text-white">
        {minimumTextSize(currentUser.username)}
      </h1>

      <div className="flex flex-col justify-center gap-4">
        <input
          type="password"
          className="h-8 w-60 rounded-lg px-4 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {hasError && <p className="text-sm text-red-600">{hasError}</p>}
      </div>
    </main>
  );
};
