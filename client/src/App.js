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
  return (
    <div className="App">
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
