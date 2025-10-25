import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

/**
 * Custom hook for handling appointment socket updates
 * @param {function} onUpdate - Callback fired when appointment is updated
 */
export default function useAppointmentSocket(onUpdate) {
  const socket = useSocket(); // use the global socket

  useEffect(() => {
    if (!socket) return;

    // Listen for appointment updates
    socket.on("appointment_updated", (data) => {
      if (onUpdate) onUpdate(data);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("appointment_updated");
    };
  }, [socket, onUpdate]);
}
