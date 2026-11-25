import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import SpaceIntro from "./SpaceIntro.jsx";

function IntroMount() {
  const [showIntro, setShowIntro] = useState(() => {
    try { return !sessionStorage.getItem("introSeen"); } catch { return true; }
  });
  const enter = () => {
    try { sessionStorage.setItem("introSeen", "1"); } catch {}
    setShowIntro(false);
    document.body.classList.add("intro-complete");
  };
  return showIntro ? <SpaceIntro onEnter={enter} /> : null;
}

const mount = document.getElementById("react-space-intro");
if (mount) createRoot(mount).render(<IntroMount />);
