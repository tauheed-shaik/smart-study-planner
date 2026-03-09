import { useState, useEffect } from "react";
import api from "../api";
import { Sparkles, Loader2, Download } from "lucide-react";
import StudyCalendar from "../components/StudyCalendar";
import jsPDF from "jspdf";
import "jspdf-autotable";

const StudyPlan = () => {
    const [subjects, setSubjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [hoursPerDay, setHoursPerDay] = useState(4);
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subRes, taskRes] = await Promise.all([
                    api.get("/subjects"),
                    api.get("/tasks"),
                ]);
                setSubjects(subRes.data.map((s) => s.name));
                setTasks(taskRes.data.filter((t) => t.status === "pending"));
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const generatePlan = async () => {
        setLoading(true);
        try {
            const res = await api.post("/ai/generate-plan", {
                subjects,
                tasks,
                hoursPerDay,
            });
            setGeneratedPlan(res.data);
        } catch (error) {
            console.error(error);
            alert("Failed to generate plan. Please try again.");
        }
        setLoading(false);
    };

    const exportToPDF = () => {
        if (!generatedPlan) return;

        const doc = new jsPDF();
        doc.text("My Study Plan", 14, 15);

        const tableData = generatedPlan.schedule.map((day) => [
            day.date || day.day,
            day.day,
            day.activities.join("\n"),
        ]);

        doc.autoTable({
            head: [["Date", "Day", "Activities"]],
            body: tableData,
            startY: 20,
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: { 2: { cellWidth: 100 } }, // Wrap text in activities column
        });

        doc.save("study-plan.pdf");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                    AI Study Planner
                </h1>
                <p className="text-blue-100 text-lg mb-8">
                    Let our AI analyze your workload and create the perfect schedule for you.
                </p>

                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                    <div className="flex items-center gap-4 mb-4">
                        <label className="text-white font-medium whitespace-nowrap">
                            Study Hours per Day:
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={hoursPerDay}
                            onChange={(e) => setHoursPerDay(e.target.value)}
                            className="w-20 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                    </div>
                    <button
                        onClick={generatePlan}
                        disabled={loading}
                        className="w-full bg-white text-blue-700 font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Generating Plan...
                            </>
                        ) : (
                            "Generate My Schedule"
                        )}
                    </button>
                </div>
            </div>

            {generatedPlan && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Your Personalized Plan</h2>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Download className="w-4 h-4" /> Export PDF
                        </button>
                    </div>

                    <StudyCalendar schedule={generatedPlan.schedule} />

                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                        <div className="space-y-6">
                            {generatedPlan.schedule?.map((day, idx) => (
                                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                                    <h3 className="font-bold text-lg text-gray-800">
                                        {day.day} <span className="text-sm font-normal text-gray-500">({day.date})</span>
                                    </h3>
                                    <ul className="mt-2 space-y-2">
                                        {day.activities.map((activity, i) => (
                                            <li key={i} className="text-gray-600 bg-gray-50 px-3 py-2 rounded-lg text-sm">
                                                {activity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyPlan;
