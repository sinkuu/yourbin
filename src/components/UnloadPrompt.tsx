import { useEffect } from "react";
import React from "react";

function UnloadPrompt(props: { when: boolean }) {
  function handleBeforeUnload(e: any) {
    e.preventDefault();
  }

  useEffect(() => {
    if (props.when) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  });

  return <React.Fragment></React.Fragment>;
}

export default UnloadPrompt;
