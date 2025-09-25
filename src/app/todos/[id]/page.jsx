"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTodo } from "@/hooks/useTodo";
import { todoApi } from "@/lib/todoApi";
import { ArrowLeft, Edit3, Check, X, Trash2, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TodoDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { todo, setTodo, error } = useTodo(id);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const isLocalTodo = Number(todo?.id) > 200;

  const handleToggleStatus = async () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    if (!isLocalTodo) {
      try {
        const updated = await todoApi.updateTodo(todo.id, updatedTodo);
        setTodo(updated);
      } catch {
        alert("Failed to update todo");
      }
    } else {
      updateLocalTodo(updatedTodo);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      if (!isLocalTodo) {
        try {
          await todoApi.deleteTodo(todo.id);
          router.push("/todos");
        } catch {
          alert("Failed to delete todo");
        }
      } else {
        const stored = JSON.parse(localStorage.getItem("todos")) || [];
        const updatedList = stored.filter((t) => t.id !== todo.id);
        localStorage.setItem("todos", JSON.stringify(updatedList));
        router.push("/todos");
      }
    }
  };

  const handleEditTitle = async () => {
    const updatedTodo = { ...todo, title: editTitle };
    if (!isLocalTodo) {
      try {
        const updated = await todoApi.updateTodo(todo.id, updatedTodo);
        setTodo(updated);
        setIsEditing(false);
      } catch {
        alert("Failed to update title");
      }
    } else {
      updateLocalTodo(updatedTodo);
      setIsEditing(false);
    }
  };

  const handleEditDescription = () => {
    const updatedTodo = { ...todo, description: editDescription };
    updateLocalTodo(updatedTodo);
    setIsEditingDesc(false);
  };

  const updateLocalTodo = (updatedTodo) => {
    const stored = JSON.parse(localStorage.getItem("todos")) || [];
    const updatedList = stored.map((t) => (t.id === todo.id ? updatedTodo : t));
    localStorage.setItem("todos", JSON.stringify(updatedList));
    setTodo(updatedTodo);
  };

  if (error) return <p className="text-center">Todo not found</p>;
  if (!todo) return <p className="text-center">Loading...</p>;

  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            aria-label="back"
            className="flex items-center text-slate-600 hover:text-slate-900 ml-2 px-2 py-1 rounded transition-colors"
            onClick={() => router.push("/todos")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </button>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-lg shadow-lg border-0">
          <div className="p-4 sm:p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">{todo.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`flex items-end px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        todo.completed
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-orange-100 text-orange-800 border-orange-200"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-6">
            {/* Title Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Title</label>
                {!isEditing && (
                  <button
                    aria-label="Edit"
                    onClick={() => {
                      setEditTitle(todo.title);
                      setIsEditing(true);
                    }}
                    className="flex items-center text-slate-500 hover:text-slate-700 px-2 py-1 rounded transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    aria-label="input task"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full sm:w-full"
                    placeholder="Enter task title..."
                    autoFocus
                  />

                  <div className="flex space-x-2">
                    <button
                      aria-label="save"
                      onClick={handleEditTitle}
                      className="flex items-center px-3 py-1.5 text-white bg-green-700 rounded-md transition-colors"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button
                      aria-label="close"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className={`text-lg ${todo.completed ? "line-through text-slate-500" : "text-slate-900"}`}>
                  {todo.title}
                </p>
              )}
            </div>

            <hr className="border-slate-200" />

            {/* Description Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                {!isEditingDesc && (
                  <button
                    onClick={() => {
                      setEditDescription(todo.description || "");
                      setIsEditingDesc(true);
                    }}
                    className="flex items-center text-slate-500 hover:text-slate-700 px-2 py-1 rounded transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    {todo.description ? "Edit" : "Add"}
                  </button>
                )}
              </div>

              {isEditingDesc ? (
                <div className="space-y-3">
                  <Textarea
                    aria-label="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Add a description for this task..."
                    className="w-full min-h-[100px] resize-vertical"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      aria-label="save"
                      onClick={handleEditDescription}
                      className="flex items-center px-3 py-1.5 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button
                      aria-label="close"
                      onClick={() => setIsEditingDesc(false)}
                      className="flex items-center px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[60px] flex items-center">
                  {todo.description ? (
                    <p className="text-slate-700 whitespace-pre-wrap">{todo.description}</p>
                  ) : (
                    <p className="text-slate-400 italic">No description added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                aria-label="complete"
                onClick={handleToggleStatus}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  todo.completed ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {todo.completed ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </>
                )}
              </button>

              <button
                aria-label="delete"
                onClick={handleDelete}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white border border-red-600 text-red-600 rounded-md font-medium transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodoDetail;
