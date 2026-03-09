import Sidebar from "./Sidebar";
import ChatBot from "./ChatBot";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </div>
            <ChatBot />
        </div>
    );
};

export default Layout;
