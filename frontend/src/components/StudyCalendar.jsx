import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

const StudyCalendar = ({ schedule }) => {
    const [date, setDate] = useState(new Date());

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Function to get activities for a specific date
    const getTileContent = ({ date, view }) => {
        if (view === "month" && schedule) {
            const dateString = formatDate(date);
            const dayPlan = schedule.find((d) => d.date === dateString);

            if (dayPlan) {
                return (
                    <div className="text-xs text-blue-600 mt-1">
                        {dayPlan.activities.length} tasks
                    </div>
                );
            }
        }
        return null;
    };

    const selectedDayPlan = schedule?.find(
        (d) => d.date === formatDate(date)
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Study Calendar</h2>
                <Calendar
                    onChange={setDate}
                    value={date}
                    tileContent={getTileContent}
                    className="rounded-lg border-none shadow-sm w-full"
                />
            </div>

            <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Plan for {date.toDateString()}
                </h3>
                {selectedDayPlan ? (
                    <ul className="space-y-3">
                        {selectedDayPlan.activities.map((activity, idx) => (
                            <li
                                key={idx}
                                className="p-3 bg-blue-50 text-blue-900 rounded-lg text-sm border border-blue-100"
                            >
                                {activity}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">No study plan for this day.</p>
                )}
            </div>
        </div>
    );
};

export default StudyCalendar;
