import { useEffect, useState, useContext } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [subjects, setSubjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subjectsRes, tasksRes] = await Promise.all([
                    api.get("/subjects"),
                    api.get("/tasks"),
                ]);

                setSubjects(subjectsRes.data);
                setTasks(tasksRes.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
            setLoading(false);
        };

        if (user) fetchData();
    }, [user]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    const pendingTasks = tasks.filter((task) => task.status === "pending");
    const completedTasks = tasks.filter((task) => task.status === "completed");

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome back, {user?.username}!
                    </h1>
                    <p className="text-gray-500 mt-1">Here's your study overview for today.</p>
                </div>
                <Link to="/tasks" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + New Task
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">
                        Pending Tasks
                    </h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">
                        {pendingTasks.length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">
                        Completed Tasks
                    </h3>
                    <p className="text-4xl font-bold text-green-600 mt-2">
                        {completedTasks.length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">
                        Active Subjects
                    </h3>
                    <p className="text-4xl font-bold text-purple-600 mt-2">
                        {subjects.length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">
                        Total Points
                    </h3>
                    <div className="flex items-end gap-2 mt-2">
                        <p className="text-4xl font-bold text-yellow-500">
                            {user?.points || 0}
                        </p>
                        <p className="text-sm text-gray-400 mb-1">
                            (Lvl {Math.floor((user?.points || 0) / 100) + 1})
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Tasks */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        Upcoming Deadlines
                    </h2>
                    {pendingTasks.length === 0 ? (
                        <p className="text-gray-500 text-sm">No pending tasks.</p>
                    ) : (
                        <ul className="space-y-3">
                            {pendingTasks.slice(0, 5).map((task) => (
                                <li
                                    key={task._id}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{task.title}</p>
                                        <p className="text-xs text-gray-500">
                                            Due: {new Date(task.deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${task.priority === "high"
                                            ? "bg-red-100 text-red-700"
                                            : task.priority === "medium"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                            } `}
                                    >
                                        {task.priority}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Link
                        to="/tasks"
                        className="block mt-4 text-center text-blue-600 text-sm hover:underline"
                    >
                        View all tasks
                    </Link>
                </div>

                {/* Subjects */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Your Context</h2>
                    {subjects.length === 0 ? (
                        <p className="text-gray-500 text-sm">No subjects added yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {subjects.slice(0, 4).map((sub) => (
                                <div
                                    key={sub._id}
                                    className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-3"
                                >
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: sub.color }}
                                    ></div>
                                    <span className="font-medium text-gray-700 truncate">
                                        {sub.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link
                        to="/subjects"
                        className="block mt-4 text-center text-blue-600 text-sm hover:underline"
                    >
                        Manage Subjects
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
