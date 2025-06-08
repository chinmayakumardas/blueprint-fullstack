



"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchTasks,
  fetchTasksByProjectId,
  deleteTask,
  selectTasksByProjectId,
  selectTaskStatus,
  selectTaskError,
} from "@/store/features/TaskSlice";
import { ArrowLeft, Eye, Edit, Trash2, X } from "lucide-react";
import { toast } from '@/components/ui/use-toast';const AllTaskList = ({ projectId }) => {
  console.log("Project ID:", projectId);
  const dispatch = useDispatch();
  const router = useRouter();
  const tasks = useSelector((state) =>
    projectId
      ? selectTasksByProjectId(state, projectId)
      : state.task.tasks || []
  );
  const status = useSelector(selectTaskStatus);
  const error = useSelector(selectTaskError);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasksByProjectId(projectId));
    } else {
      dispatch(fetchTasks());
    }
  }, [dispatch, projectId]);

  const handleViewTask = (task_id) => {
    router.push(`/tasks/${task_id}`);
  };

  const handleEditTask = (task_id) => {
    router.push(`/tasks/edit/${task_id}`);
  };

  const handleDeleteTask = async () => {
    try {
      await dispatch(deleteTask(taskIdToDelete)).unwrap();
            toast.error("Task deleted!.");

      setShowDeleteModal(false);
      setTaskIdToDelete(null);
    } catch (err) {
      setShowDeleteModal(false);
      setTaskIdToDelete(null);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const openDeleteModal = (task_id) => {
    setTaskIdToDelete(task_id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTaskIdToDelete(null);
  };

  if (status === "loading") {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeDeleteModal}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
            <div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Confirm Deletion
                </h3>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Task Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                SL. No
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                Task ID
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {task.task_id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{task.title}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {task.assignedTo}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${
                        task.priority === "Low"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {new Date(task.deadline)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      .replace(/\//g, "-")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${
                        task.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-green-100 text-green-700 border-green-200"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewTask(task.task_id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        title="View Task"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditTask(task.task_id)}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(task.task_id)}
                        className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTaskList;
