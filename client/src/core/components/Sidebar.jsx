import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../services/slices/userSlice";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(true);
  const userInfo = useSelector((state) => state.user.userInfo);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown
  const moreVerticalRef = useRef(null); // Ref for the MoreVertical button

  const handleLogout = () => {
    dispatch(logoutUser());
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
      <nav className="h-full inline-flex flex-col bg-background border-r shadow-sm relative">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-side-active/50 hover:bg-side-active/30"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img src={userInfo.picture} alt="" className="w-10 h-10 rounded-md" />
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
              onClick={handleDropdownToggle}
              ref={moreVerticalRef}
              className="p-2 rounded-md hover:bg-side-active/30"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Dropdown Menu for Profile and Logout */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 bottom-[60px] w-40 bg-background shadow-lg rounded-lg mt-2 p-2 border border-color"
          >
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-side-active/30 rounded-md">
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-side-active/30 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
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
  );
}
