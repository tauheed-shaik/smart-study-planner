import { useState, useEffect, useContext } from "react";
import api from "../api";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";
import AuthContext from "../context/AuthContext";

const Tasks = () => {
    const { refreshUser } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        subject: "",
        deadline: "",
        priority: "medium",
    });

    useEffect(() => {
        fetchTasks();
        fetchSubjects();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/tasks");
            setTasks(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const res = await api.get("/subjects");
            setSubjects(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/tasks", newTask);
            setTasks([...tasks, res.data]);
            setNewTask({ title: "", subject: "", deadline: "", priority: "medium" });
        } catch (error) {
            console.error(error);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "pending" ? "completed" : "pending";
        try {
            await api.put(`/tasks/${id}`, { status: newStatus });
            setTasks(
                tasks.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
            );
            if (newStatus === "completed") {
                refreshUser();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter((t) => t._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Study Tasks</h2>

            {/* Add Task Form */}
            <form onSubmit={addTask} className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-gray-50 p-4 rounded-lg">
                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                        Task Title
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Do homework..."
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                        Subject
                    </label>
                    <select
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={newTask.subject}
                        onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                        Deadline
                    </label>
                    <input
                        type="date"
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors h-[42px]"
                >
                    <Plus className="w-5 h-5" /> Add
                </button>
            </form>

            {/* Task List */}
            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-8">No tasks found. Add one above!</p>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task._id}
                            className={`flex items-center justify-between p-4 border rounded-lg transition-all ${task.status === "completed" ? "bg-gray-50 opacity-75" : "bg-white hover:shadow-md"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleStatus(task._id, task.status)}
                                    className={`transition-colors ${task.status === "completed" ? "text-green-500" : "text-gray-300 hover:text-green-500"
                                        }`}
                                >
                                    {task.status === "completed" ? (
                                        <CheckCircle className="w-6 h-6 " />
                                    ) : (
                                        <Circle className="w-6 h-6" />
                                    )}
                                </button>
                                <div>
                                    <h3
                                        className={`font-semibold text-lg ${task.status === "completed"
                                            ? "text-gray-500 line-through"
                                            : "text-gray-800"
                                            }`}
                                    >
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        {task.subject && (
                                            <span
                                                className="px-2 py-0.5 rounded text-white font-medium"
                                                style={{ backgroundColor: task.subject.color || "#9ca3af" }}
                                            >
                                                {task.subject.name}
                                            </span>
                                        )}
                                        <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                        <span
                                            className={`capitalize font-medium ${task.priority === "high"
                                                ? "text-red-500"
                                                : task.priority === "medium"
                                                    ? "text-yellow-600"
                                                    : "text-green-600"
                                                }`}
                                        >
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteTask(task._id)}
                                className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tasks;
