// server/socket.js
let ioInstance = null;

module.exports = {
  /**
   * Initialize Socket.IO instance once (from server.js)
   * @param {Server} io - Socket.IO server instance
   */
  init: (io) => {
    ioInstance = io;
    console.log("✅ Socket.IO initialized");
  },

  /**
   * Retrieve the Socket.IO instance anywhere (controllers, services, etc.)
   * @returns {Server|null}
   */
  getIO: () => {
    if (!ioInstance) {
      console.warn("⚠️ No socket.io instance found for broadcast");
    }
    return ioInstance;
  },
};
