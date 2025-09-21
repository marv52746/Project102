import { useState, useMemo } from "react";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import ThingsToKnow from "./components/ThingsToKnow";
import { ContactUs } from "./components/ContactUs";
import Team from "./components/Team";
import { Profile } from "./components/Profile";
import { useSelector } from "react-redux";

export default function Portal() {
  const authState = useSelector((state) => state.user.authState);
  // console.log(authState);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appointmentDate: "",
    appointmentTime: "", // ⏰ new field
  });
  const [submitted, setSubmitted] = useState(false);

  // ✅ Tabs config (memoized so it doesn’t re-render every time)
  const tabs = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "things", label: "Things to Know" },
      { id: "about", label: "About Us" },
      { id: "profile", label: "Profile" },
      { id: "login", label: "Login" },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState("home");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone) {
      setSubmitted(true);
    }
  };

  return (
    <div className="font-sans scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/50 backdrop-blur-md shadow z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          {/* Logo + Title clickable */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90">
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-pink-600 font-bold text-xl">
              Bislig Premier Birthing Home
            </h1>
          </Link>

          {/* Tabs */}
          <div className="flex space-x-6 items-center">
            {tabs.map((tab) => {
              // Hide login if already authenticated
              if (tab.id === "login" && authState) return null;

              // Hide profile if not authenticated
              if (tab.id === "profile" && !authState) return null;

              // Special case: Login as a Link instead of a button
              if (tab.id === "login") {
                return (
                  <Link
                    className="pb-2 px-2 "
                    key={tab.id}
                    to={all_routes.login}
                  >
                    {tab.label}
                  </Link>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 px-2 border-b-2 transition ${
                    activeTab === tab.id
                      ? "border-pink-600 text-pink-600 font-semibold"
                      : "border-transparent hover:border-pink-400 hover:text-pink-600"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Sections */}
      {activeTab === "home" && (
        <section className="relative min-h-screen flex items-center pt-24">
          {/* Background doctor image */}
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/hero.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "10% -50%",
              backgroundColor: "#fff",
            }}
          >
            <div className="absolute inset-0"></div>
          </div>

          {/* Main content aligned with navbar */}
          <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row px-6 md:px-8">
            {/* Appointment Form on Left */}
            <div className="w-full md:w-1/2">
              <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-pink-700">
                  Book Your Appointment
                </h2>
                <p className="mt-2 text-gray-600">
                  Where women’s wellness and motherhood are nurtured with care.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {submitted ? (
                    <p className="text-green-600 font-semibold text-center">
                      ✅ Your appointment has been scheduled! Our staff will
                      reach out to confirm the details.
                    </p>
                  ) : (
                    <>
                      {/* Full Name */}
                      <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-400">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          className="flex-1 outline-none text-sm"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-400">
                        <Mail className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          className="flex-1 outline-none text-sm"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-400">
                        <Phone className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          className="flex-1 outline-none text-sm"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Date Picker */}
                      <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-400">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                          type="date"
                          name="appointmentDate"
                          className="flex-1 outline-none text-sm text-gray-700"
                          value={formData.appointmentDate}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Time Picker */}
                      <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-pink-400">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                          type="time"
                          name="appointmentTime"
                          className="flex-1 outline-none text-sm text-gray-700"
                          value={formData.appointmentTime}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white py-3 rounded-lg shadow-md hover:shadow-lg hover:from-pink-700 hover:to-pink-600 transition-all duration-300 font-semibold"
                      >
                        Confirm Appointment
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>

            {/* Right side empty (doctor background image) */}
            <div className="hidden md:block md:w-1/2"></div>
          </div>
        </section>
      )}

      {activeTab === "things" && <ThingsToKnow />}
      {activeTab === "about" && <Team />}
      {activeTab === "contact" && <ContactUs />}
      {activeTab === "profile" && authState && <Profile />}
    </div>
  );
}
