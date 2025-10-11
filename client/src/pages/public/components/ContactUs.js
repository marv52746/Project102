import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import apiService from "../../../core/services/apiService";
import { useDispatch, useSelector } from "react-redux";

/* Contact Us */
export function ContactUs() {
  const userInfo = useSelector((state) => state.user?.userInfo);
  const [form, setForm] = useState({
    name: userInfo?.fullname || "",
    email: userInfo?.email || "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await apiService.post(dispatch, "contact", form);
      setStatus({ type: "success", msg: "Your message has been sent!" });
      setForm({ name: "", email: "", phone: "", message: "" });
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

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Google Map with Address */}
          <div className="rounded-xl overflow-hidden shadow h-[300px] sm:h-[400px] md:h-full">
            <iframe
              title="Bislig Premier Birthing Home Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d318.17132788757134!2d126.3567559!3d8.1858627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fdbbd313ae1bf5%3A0x24376b032f893a26!2sBISLIG%20PREMIER%20BIRTHING%20HOME!5e0!3m2!1sen!2sph!4v1726900000000!5m2!1sen!2sph"
              width="100%"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Contact Form & Address */}
          <div className="space-y-4 sm:space-y-6">
            {/* Address Box */}
            <div className="bg-white shadow rounded-xl p-4 sm:p-6 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-pink-700 mb-1">
                Bislig Premier Birthing Home
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                EGS Building, Espirito Street, Mangagoy, Bislig City
              </p>
              <div className="mt-2 space-y-1 text-gray-700 text-sm sm:text-base">
                <p>Monday – Saturday, 9:00 AM – 5:00 PM</p>
                <p>0917 113 5187</p>
              </div>
            </div>

            {/* Contact Form */}
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm sm:text-base text-gray-700 bg-white outline-none focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 transition-all duration-150"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm sm:text-base text-gray-700 bg-white outline-none focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 transition-all duration-150"
              />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm sm:text-base text-gray-700 bg-white outline-none focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 transition-all duration-150"
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                rows="5"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm sm:text-base text-gray-700 bg-white outline-none focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 transition-all duration-150"
              />
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center gap-2 w-full bg-pink-600 text-white py-2 px-6 rounded-lg hover:bg-pink-700 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <div
                  className={`mt-4 flex items-center justify-center gap-2 text-sm p-2 rounded ${
                    status.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span>{status.msg}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
