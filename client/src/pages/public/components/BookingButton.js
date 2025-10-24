import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function BookingButton({ loading, submitted }) {
  return (
    <div className="col-span-1 sm:col-span-2">
      <motion.button
        type="submit"
        disabled={loading || submitted}
        whileTap={{ scale: 0.97 }}
        whileHover={{
          scale: submitted ? 1 : 1.02,
          boxShadow: submitted
            ? "0 0 0 rgba(0,0,0,0)"
            : "0 8px 15px rgba(236, 72, 153, 0.3)",
        }}
        className={`relative w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 overflow-hidden transition-all duration-300
          ${
            submitted
              ? "bg-green-600 text-white"
              : "bg-gradient-to-r from-pink-600 to-pink-500 text-white"
          }`}
      >
        {/* Background shine effect */}
        {!submitted && (
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "linear",
            }}
          />
        )}

        <AnimatePresence mode="wait" initial={false}>
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 z-10"
            >
              <Check size={18} /> Appointment Booked
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 z-10"
            >
              <Loader2 className="w-5 h-5 animate-spin" /> Booking...
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 z-10"
            >
              Confirm Appointment
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export default BookingButton;
