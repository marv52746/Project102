import { useState, useMemo } from "react";
import { User, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import ThingsToKnow from "./components/ThingsToKnow";
import { ContactUs } from "./components/ContactUs";
import Team from "./components/Team";
import { Profile } from "./components/Profile";
import { useSelector } from "react-redux";

export default function Home() {
  const authState = useSelector((state) => state.user.authState);
  // console.log(authState);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    month: "",
    day: "",
    year: "",
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
              <div className="bg-white/90 shadow-xl rounded-xl p-8">
                <h2 className="text-3xl font-bold text-pink-700">
                  Fix an Appointment
                </h2>
                <p className="mt-2 text-gray-600">
                  Where Every Birth is Nurtured, Every Woman's Health,
                  Cherished.
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                  {submitted ? (
                    <p className="text-green-600 font-semibold text-center">
                      Appointment booked successfully!
                    </p>
                  ) : (
                    <>
                      <div className="mb-3 flex items-center border rounded px-2">
                        <User className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          className="flex-1 p-2 outline-none"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3 flex items-center border rounded px-2">
                        <Mail className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          className="flex-1 p-2 outline-none "
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3 flex items-center border rounded px-2">
                        <Phone className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone"
                          className="flex-1 p-2 outline-none"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <input
                          type="text"
                          name="month"
                          placeholder="MM"
                          className="border rounded p-2 text-center"
                          value={formData.month}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="day"
                          placeholder="DD"
                          className="border rounded p-2 text-center"
                          value={formData.day}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="year"
                          placeholder="YYYY"
                          className="border rounded p-2 text-center"
                          value={formData.year}
                          onChange={handleChange}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
                      >
                        Book Appointment
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>

            {/* Right side empty (background doctor shows here) */}
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
