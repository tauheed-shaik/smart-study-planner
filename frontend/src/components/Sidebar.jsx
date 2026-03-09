import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
    Sidebar as SidebarIcon,
    Home,
    BookOpen,
    CalendarDays,
    ListTodo,
    Settings,
} from "lucide-react";

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", icon: Home, path: "/" },
        { name: "Subjects", icon: BookOpen, path: "/subjects" },
        { name: "Tasks", icon: ListTodo, path: "/tasks" },
        { name: "Plan", icon: CalendarDays, path: "/study-plan" },
    ];

    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 shadow-lg sticky top-0">
            <div className="flex items-center gap-2 mb-8">
                <SidebarIcon className="w-8 h-8 text-blue-500" />
                <h1 className="text-xl font-bold">Study Planner</h1>
            </div>
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname === item.path
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
            <div className="border-t border-gray-800 pt-4 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold uppercase text-lg">
                        {user?.username?.[0] || "U"}
                    </div>
                    <div className="text-sm overflow-hidden">
                        <p className="font-medium text-white truncate">{user?.username || "Student"}</p>
                        <p className="text-gray-500 text-xs truncate">{user?.email || "user@example.com"}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                >
                    <Settings className="w-5 h-5 rotate-90" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
