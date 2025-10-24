import { useState } from "react";
import {
  Check,
  Clock,
  Facebook,
  Loader2,
  Lock,
  MapPin,
  Phone,
} from "lucide-react";
import apiService from "../../../core/services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

export function ContactUs() {
  const userInfo = useSelector((state) => state.user?.userInfo);
  const [form, setForm] = useState({
    name: userInfo?.fullname || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone_number || "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚫 Stop if user not logged in
    if (!userInfo) {
      setStatus({
        type: "error",
        msg: "Please log in to send a message.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await apiService.post(dispatch, "contact", form);
      setSubmitted(true);
      setStatus({ type: "success", msg: "Your message has been sent!" });
      setForm({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      setStatus({
        type: "error",
        msg: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-8 sm:py-16 bg-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-3 sm:mb-4">
            Contact Us
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions? Get in touch with our doctors and care team.
          </p>
        </div>

        {/* Layout */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow h-[300px] sm:h-[400px] md:h-full">
            <iframe
              title="Bislig Premier Birthing Home Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d318.17132788757134!2d126.3567559!3d8.1858627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fdbbd313ae1bf5%3A0x24376b032f893a26!2sBISLIG%20PREMIER%20BIRTHING%20HOME!5e0!3m2!1sen!2sph!4v1726900000000!5m2!1sen!2sph"
              width="100%"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          {/* Form */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white shadow-md rounded-xl p-5 sm:p-6 border border-pink-100 transition-all hover:shadow-lg hover:border-pink-200">
              {/* Title */}
              <h3 className="text-lg sm:text-xl font-semibold text-pink-700 mb-2 flex items-center gap-2">
                Bislig Premier Birthing Home
              </h3>
              {/* Schedule & Contact */}
              <div className="mt-4 space-y-2 text-gray-700 text-sm sm:text-base">
                <div className="flex items-center gap-2 pl-1">
                  <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  <p>EGS Building, Espirito Street, Mangagoy, Bislig City</p>
                </div>
                <div className="flex items-center gap-2 pl-1">
                  <Clock className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  <p>Monday – Saturday, 9:00 AM – 5:00 PM</p>
                </div>
                <div className="flex items-center gap-2 pl-1">
                  <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  <p>0917 113 5187</p>
                </div>
                <div className="flex items-center gap-2 pl-1">
                  <Facebook className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  <a
                    href="https://www.facebook.com/profile.php?id=61552266903347"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700 hover:underline transition-colors"
                  >
                    Visit our Facebook Page
                  </a>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded-xl p-4 sm:p-6"
            >
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                disabled={!userInfo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm sm:text-base text-gray-700 bg-white outline-none focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 transition-all duration-150 disabled:bg-gray-100 disabled:text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                disabled={!userInfo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm sm:text-base text-gray-700 bg-white outline-none focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 transition-all duration-150 disabled:bg-gray-100 disabled:text-gray-400"
              />
              <input
                type="number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                disabled={!userInfo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm sm:text-base text-gray-700 bg-white outline-none focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 transition-all duration-150 disabled:bg-gray-100 disabled:text-gray-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                rows="5"
                required
                disabled={!userInfo}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm sm:text-base text-gray-700 bg-white outline-none focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 transition-all duration-150 disabled:bg-gray-100 disabled:text-gray-400"
              />

              {/* Animated Button */}
              <motion.button
                type="submit"
                disabled={loading || submitted || !userInfo}
                whileTap={{ scale: 0.97 }}
                className={`relative w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-white overflow-hidden shadow-md transition-all duration-300
                  ${
                    !userInfo
                      ? "bg-gray-400 cursor-not-allowed"
                      : submitted
                      ? "bg-green-600"
                      : "bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600"
                  }`}
              >
                <AnimatePresence mode="wait">
                  {!userInfo ? (
                    <motion.span
                      key="login"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Lock size={18} /> Please Log In
                    </motion.span>
                  ) : submitted ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={18} /> Message Sent
                    </motion.span>
                  ) : loading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      Send Message
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
