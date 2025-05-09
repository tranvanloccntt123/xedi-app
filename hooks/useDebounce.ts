import React from "react";
const useDebounce = <CallBackReturn = void>(options: { time: number }) => {
  const timer = React.useRef(null);
  return (callback: () => CallBackReturn) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(callback, options.time ?? 500);
  };
};

export default useDebounce;
