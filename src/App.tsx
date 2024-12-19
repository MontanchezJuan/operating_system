import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { PAGES } from "./pages";
import { OSProvider } from "./providers/OSProvider";
import useStore from "./store/useStore";

function App() {
  const isDarkMode = useStore((store) => store.config.is_dark_mode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <OSProvider>
      <BrowserRouter>
        <Routes>
          {PAGES &&
            PAGES.map((page) => (
              <Route
                key={page.path}
                path={page.path}
                element={page.component}
              />
            ))}
        </Routes>
      </BrowserRouter>
    </OSProvider>
  );
}

export default App;
