import { useState, useEffect } from "react";
import api from "../api";
import { Plus, Trash2 } from "lucide-react";

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState("");
    const [newColor, setNewColor] = useState("#3b82f6");

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await api.get("/subjects");
            setSubjects(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addSubject = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(
                "/subjects",
                { name: newSubject, color: newColor }
            );
            setSubjects([...subjects, res.data]);
            setNewSubject("");
        } catch (error) {
            console.error(error);
        }
    };

    const deleteSubject = async (id) => {
        try {
            await api.delete(`/subjects/${id}`);
            setSubjects(subjects.filter((sub) => sub._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <form onSubmit={addSubject} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Mathematics"
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color Marker
                            </label>
                            <input
                                type="color"
                                className="h-10 w-full rounded-lg cursor-pointer border px-2 py-1"
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" /> Add Subject
                        </button>
                    </form>
                </div>

                <div>
                    {subjects.length === 0 ? (
                        <p className="text-gray-500 italic">No subjects added yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {subjects.map((sub) => (
                                <li
                                    key={sub._id}
                                    className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-6 h-6 rounded-full shadow-sm"
                                            style={{ backgroundColor: sub.color }}
                                        ></div>
                                        <span className="font-medium text-gray-800">
                                            {sub.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteSubject(sub._id)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Subjects;
