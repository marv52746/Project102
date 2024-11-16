import { useEffect } from "react";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import {
  LifeBuoy,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  LayoutDashboard,
  Settings,
} from "lucide-react";

function App() {
  useEffect(() => {
    // NOTE: This should be set based on some kind of toggle or theme selector.
    // I've added this here for demonstration purposes
    localStorage.setItem("theme", "light");

    // If the user has selected a theme, use that
    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);

      // Else if the users OS preferences prefers dark mode
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");

      // Else use light mode
    } else {
      document.body.classList.add("light");
    }
  }, []);

  return (
    <div className="App flex light">
      <Sidebar className="w-10">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          alert
        />
        <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" active />
        <SidebarItem icon={<UserCircle size={20} />} text="Users" />
        <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
        <SidebarItem icon={<Package size={20} />} text="Orders" alert />
        <SidebarItem icon={<Receipt size={20} />} text="Billings" alert />
        <hr className="my-3" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" alert />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" alert />
      </Sidebar>
    </div>
  );
}

export default App;
