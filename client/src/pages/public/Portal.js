import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import ThingsToKnow from "./components/ThingsToKnow";
import { ContactUs } from "./components/ContactUs";
import Team from "./components/Team";
import { Profile } from "./components/Profile";
import { useDispatch, useSelector } from "react-redux";
import apiService from "../../core/services/apiService";
import BookAppointmentForm from "./components/BookAppointmentForm";
import { Menu, X } from "lucide-react";

export default function Portal() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const authState = useSelector((state) => state.user.authState);
  const dispatch = useDispatch();

  // console.log(userInfo);
  const [user, setUser] = useState({});

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
  const [doctors, setDoctors] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (userInfo.id) {
          const currentUser = await apiService.get(
            dispatch,
            `users/${userInfo?.id}`
          );
          setUser(currentUser);
        }

        const res = await apiService.get(dispatch, "users", { role: "doctor" });
        setDoctors(res);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchUsers();
  }, [dispatch, userInfo]);

  return (
    <div className="font-sans scroll-smooth w-full h-full relative">
      {/* Navbar */}
      {/* <nav className="fixed top-0 w-full bg-white/50 backdrop-blur-md shadow z-40"> */}
      <nav className="sticky top-0 w-full bg-white/50 backdrop-blur-md shadow z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          {/* Logo + Title */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90">
            <img
              src="/assets/images/Logo.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-pink-600 font-bold text-xl">
              Bislig Premier Birthing Home
            </h1>
          </Link>

          {/* Desktop Tabs */}
          <div className="hidden md:flex space-x-6 items-center">
            {tabs.map((tab) => {
              if (tab.id === "login" && authState) return null;
              if (tab.id === "profile" && !authState) return null;

              if (tab.id === "login") {
                return (
                  <Link
                    className="pb-2 px-2"
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

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t shadow">
            <div className="flex flex-col p-4 space-y-3">
              {tabs.map((tab) => {
                if (tab.id === "login" && authState) return null;
                if (tab.id === "profile" && !authState) return null;

                if (tab.id === "login") {
                  return (
                    <Link
                      key={tab.id}
                      to={all_routes.login}
                      onClick={() => setMobileOpen(false)}
                      className="text-gray-700 hover:text-pink-600"
                    >
                      {tab.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileOpen(false);
                    }}
                    className={`text-left ${
                      activeTab === tab.id
                        ? "text-pink-600 font-semibold"
                        : "text-gray-700 hover:text-pink-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Sections */}
      {activeTab === "home" && (
        <section className="relative min-h-screen flex items-center">
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
            <div className="w-full md:w-2/3 lg:w-3/5">
              <BookAppointmentForm
                userInfo={userInfo}
                dispatch={dispatch}
                title="Book Your Appointment"
                description="Where women’s wellness and motherhood are nurtured with care."
              />
            </div>

            {/* Right side empty (doctor background image) */}
            <div className="hidden md:block md:w-1/2"></div>
          </div>
        </section>
      )}

      {activeTab === "things" && <ThingsToKnow />}
      {activeTab === "about" && <Team doctors={doctors} />}
      {activeTab === "contact" && <ContactUs />}
      {activeTab === "profile" && authState && <Profile user={user} />}
    </div>
  );
}
