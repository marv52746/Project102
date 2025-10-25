// hooks/useSocket.js
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function useSocket(eventHandlers = {}) {
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity,
    });

    // socket.on("connect", () => {
    //   console.log("🟢 Connected:", socket.id);
    // });

    // socket.on("disconnect", (reason) => {
    //   console.log("🔴 Disconnected:", reason);
    // });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    // Register all events from eventHandlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.keys(eventHandlers).forEach((event) => socket.off(event));
      socket.disconnect();
    };
  }, [eventHandlers]);
}
