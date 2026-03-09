import { useState } from "react";
import api from "../api";
import { MessageSquare, Send, X } from "lucide-react";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! How can I help with your studies today?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await api.post("/ai/chat", { message: input });
            setMessages([...newMessages, { role: "assistant", content: res.data.reply }]);
        } catch (error) {
            setMessages([
                ...newMessages,
                { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
            ]);
        }
        setLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
                >
                    <MessageSquare className="w-6 h-6" />
                </button>
            )}

            {isOpen && (
                <div className="bg-white w-80 h-96 rounded-xl shadow-2xl flex flex-col border border-gray-200">
                    <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
                        <h3 className="font-semibold">AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg text-sm max-w-[80%] ${msg.role === "user"
                                    ? "bg-blue-100 text-blue-900 ml-auto"
                                    : "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {loading && <div className="text-xs text-gray-500 italic">Thinking...</div>}
                    </div>

                    <div className="p-3 border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ask a question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
