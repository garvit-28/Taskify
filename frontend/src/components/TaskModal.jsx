import { useState } from "react";
import api from "../api/api";

export default function TaskModal({ task, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "Low",
    completed: task?.completed || false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (task) {
        res = await api.put(`/tasks/${task._id}/gp`, form);
      } else {
        res = await api.post("/tasks/gp", form);
      }
      onSaved(res.data.task);
    } catch (err) {
      setError(err.response?.data?.message || "Error saving task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">{task ? "Edit Task" : "Add Task"}</h2>
        {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</p>}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
            />
            Completed
          </label>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded hover:from-blue-500 hover:to-blue-400 transition"
            >
              {task ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
