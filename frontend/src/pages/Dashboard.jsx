import { useState, useEffect } from "react";
import api from "../api/api";
import { Plus, Edit2, Trash2, Zap, Search } from "lucide-react";

// Navbar component
function Navbar({ user, onLogout, searchQuery, setSearchQuery }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const initial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Zap className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Taskify
        </h1>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 mx-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Right: User Avatar */}
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold cursor-pointer hover:shadow-lg transition"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {initial}
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
            <div className="px-4 py-2 text-gray-500 text-sm">
              Signed in as {user.name}
            </div>
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold hover:from-red-500 hover:to-red-400 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

// Dashboard component
export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: "", description: "", priority: "Low" });
  const [searchQuery, setSearchQuery] = useState("");

  // Example user
  const user = { name: "Garvit" };

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.log("Error fetching tasks", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Save task
  const handleSaveTask = async () => {
    if (!currentTask.title || !currentTask.description) {
      alert("Please fill all fields!");
      return;
    }
    try {
      if (currentTask._id) {
        await api.put(`/tasks/${currentTask._id}`, currentTask);
      } else {
        await api.post("/tasks", currentTask);
      }
      setShowForm(false);
      setCurrentTask({ title: "", description: "", priority: "Low" });
      fetchTasks();
    } catch (err) {
      console.error("Error saving task", err.response?.data || err.message);
      alert("Failed to save task");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log("Error deleting task", err.response?.data || err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Filter tasks based on search
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Tasks Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Your Tasks
          </h2>
          <button
            onClick={() => {
              setShowForm(true);
              setCurrentTask({ title: "", description: "", priority: "Low" });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded hover:from-blue-500 hover:to-blue-400 transition"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <p>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p>No matching tasks found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition relative"
              >
                <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  {task.title}
                </h3>
                <p className="text-gray-600">{task.description}</p>
                <p
                  className={`mt-2 font-medium ${
                    task.priority === "High"
                      ? "text-red-500"
                      : task.priority === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {task.priority}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setCurrentTask(task);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Task Form */}
      {showForm && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              {currentTask._id ? "Edit Task" : "Add Task"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={currentTask.title}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Description"
                value={currentTask.description}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
              <select
                value={currentTask.priority}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, priority: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded hover:from-blue-500 hover:to-blue-400 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
