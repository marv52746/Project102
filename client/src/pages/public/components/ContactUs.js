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
  const [status, setStatus] = useState(null); // { type: "success" | "error", msg: "" }
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await apiService.post(dispatch, "contact", {
        name: form.name,
        email: form.email,
        message: form.message,
        phone: form.phone,
      });

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
    <section id="contact" className="py-16 bg-pink-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-pink-700 mb-3">Contact Us</h2>
          <p className="text-gray-600">
            Have questions? Get in touch with our doctors and care team.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Google Map with Address */}
          <div>
            <div className="rounded-xl overflow-hidden shadow">
              <iframe
                title="Bislig Premier Birthing Home Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d318.17132788757134!2d126.3567559!3d8.1858627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fdbbd313ae1bf5%3A0x24376b032f893a26!2sBISLIG%20PREMIER%20BIRTHING%20HOME!5e0!3m2!1sen!2sph!4v1726900000000!5m2!1sen!2sph"
                width="100%"
                height="480"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            {/* Address Text */}
            <div className="bg-white shadow rounded-xl p-4 py-1">
              <h3 className="text-lg font-semibold text-pink-700">
                Bislig Premier Birthing Home
              </h3>
              <p className="text-gray-600 leading-relaxed">
                EGS Building, Espirito Street, Mangagoy, Bislig City
              </p>

              <div className="flex items-center space-x-2 text-gray-700">
                <span>Monday – Saturday, 9:00 AM – 5:00 PM</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-700">
                <span>0917 113 5187</span>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded-xl p-6"
            >
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full border rounded p-2 mb-3"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full border rounded p-2 mb-3"
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                rows="5"
                required
                className="w-full border rounded p-2 mb-3"
              />
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center gap-2 w-full bg-pink-600 text-white py-2 px-6 rounded hover:bg-pink-700 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {/* Status Message */}
              {status && (
                <div
                  className={`mt-4 flex items-center gap-2 text-sm p-2 rounded ${
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
