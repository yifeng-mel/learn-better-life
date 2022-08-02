import React, { useEffect } from "react";
import NoSleep from "nosleep.js";

export default function App() {
  // useEffect(() => {
  //   let isEnableNoSleep = false;
  //   const noSleep = new NoSleep();
  //   try {
  //     noSleep.enable();
  //     isEnableNoSleep = true;
  //     alert(`enable`);
  //   } catch (error) {
  //     console.error(`error`, error);
  //   }
  //   return () => {
  //     if (isEnableNoSleep) {
  //       noSleep.disable();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    let isEnableNoSleep = false;
    const noSleep = new NoSleep();
    document.addEventListener(
      `click`,
      function enableNoSleep() {
        document.removeEventListener(`click`, enableNoSleep, false);
        noSleep.enable();
        isEnableNoSleep = true;
        alert(`click and enable noSleep`);
      },
      false
    );
    return () => {
      if (isEnableNoSleep) {
        noSleep.disable();
      }
    };
  }, []);

  return (
    <div className="App">
      <h1>test no sleep</h1>
    </div>
  );
}
