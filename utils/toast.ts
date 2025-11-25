import toast from "react-hot-toast";

// Success toast (green)
export const toastSuccess = (msg: string) =>
  toast.success(msg, {
    icon: "✅",
  });

// Error toast (red)
export const toastError = (msg: string) =>
  toast.error(msg, {
    icon: "❌",
  });

// Info toast (blue)
export const toastInfo = (msg: string) =>
  toast(msg, {
    icon: "ℹ️",
    style: { background: "#2563eb", color: "#fff" },
  });

// Warning toast (yellow)
export const toastWarning = (msg: string) =>
  toast(msg, {
    icon: "⚠️",
    style: { background: "#facc15", color: "#000" },
  });

// Special eCommerce toast (item added)
export const toastCartAdd = (itemName: string, qty: number) =>
  toast.success(`🛒 Added ${qty} × ${itemName}`, {
    duration: 2500,
  });

// Special toast for Fast Order results
export const toastFastOrder = (msg: string) =>
  toast(`⚡ ${msg}`, {
    style: {
      background: "#0f172a",
      color: "#38bdf8",
    },
  });
