import {
  MoreVertical,
  ChevronLast,
  ChevronFirst,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useContext, createContext, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../services/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(true);
  const userInfo = useSelector((state) => state.user.userInfo);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown
  const moreVerticalRef = useRef(null); // Ref for the MoreVertical button

  // Check if the screen width is small and set the state accordingly
  useEffect(() => {
    const updateExpandedState = () => {
      if (window.innerWidth <= 950) {
        // You can adjust this value for your needs
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    // Update on initial load and resize events
    updateExpandedState();
    window.addEventListener("resize", updateExpandedState);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", updateExpandedState);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev); // Toggle the dropdown visibility
  };
  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        moreVerticalRef.current &&
        !moreVerticalRef.current.contains(event.target)
      ) {
        setShowDropdown(false); // Close dropdown if click is outside
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <aside className="h-screen">
      <nav className="h-full inline-flex flex-col bg-background border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={process.env.PUBLIC_URL + "/assets/images/logo.svg"}
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          <button
            aria-label="sidebarBtn"
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-side-active/50 hover:bg-side-active/30"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3 relative">
          <img
            src={userInfo?.picture}
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{userInfo.name}</h4>
              <span className="text-xs text-text-primary">
                {userInfo.email}
              </span>
            </div>
            <button
              aria-label="profileMoreBtn"
              onClick={handleDropdownToggle}
              ref={moreVerticalRef}
              className="p-2 rounded-md hover:bg-side-active/30"
            >
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Dropdown Menu for Profile and Logout */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="dropdown-menu absolute right-1 bottom-[60px] w-64 bg-background shadow-md mt-2 rounded-md border"
            >
              <button className="w-full dropdown-item flex items-center px-4 py-2 hover:bg-side-active/30">
                <Settings size={20} className="mr-2" /> Settings
              </button>
              <button className="w-full dropdown-item flex items-center px-4 py-2 hover:bg-side-active/30">
                <HelpCircle size={20} className="mr-2" /> Help
              </button>
              <button
                onClick={handleLogout}
                className="w-full dropdown-item flex items-center px-4 py-2 hover:bg-side-active/30"
              >
                <LogOut size={20} className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, to }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <Link to={to} className="flex items-center w-full">
      <li
        className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-side-active text-sidetext-active"
            : "hover:bg-side-active/30 text-text-primary"
        }
    `}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>

        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}

        {!expanded && (
          <div
            className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}
