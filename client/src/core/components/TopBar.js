import { Bell, ChevronDown } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b">
      <div className="h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="md:hidden h-3 w-3 rounded-full bg-green-500 inline-block" />
          <span className="md:hidden font-semibold">connected clinic</span>
          <span className="hidden md:block text-sm text-gray-500">
            Kansas City Family Medical Care
          </span>
          <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              1
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="text-sm leading-tight">
              <div className="font-semibold">Margaret Lim</div>
              <div className="text-xs text-gray-500">Cardiologist</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
