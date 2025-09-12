import { useState } from "react";

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  function toast({ title, description }) {
    const id = genId();
    setToasts((prev) => [...prev, { id, title, description }]);

    // auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);

    return { id };
  }

  return {
    toast,
    toasts,
  };
}
