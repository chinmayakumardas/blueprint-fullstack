
"use client";

import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksByDeadline } from "@/store/features/dashboardSlice";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";

export default function UpcomingTasks() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.dashboard.deadlineTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    dispatch(fetchTasksByDeadline());
  }, [dispatch]);

  // Function to determine priority badge styling
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <Badge className="bg-red-500 text-white">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500 text-white">Low</Badge>;
      default:
        return <Badge variant="outline">Medium</Badge>;
    }
  };

  // Function to determine status badge styling
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return <Badge className="bg-yellow-500 text-white">In Progress</Badge>;
      case "to do":
        return <Badge variant="outline">To Do</Badge>;
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      // case "overdue":
      //   return <Badge className="bg-red-500 text-white">Overdue</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  // Calculate days remaining for a task
  const calculateDaysRemaining = (deadline) => {
    return Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  };

  // Handle task card click to open modal
  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedTask(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border p-4 space-y-4"
    >
    

      {/* Task List */}
      {status === "loading" && <div>Loading tasks...</div>}
      {status === "failed" && <div className="text-red-500">{error || "Failed to load tasks"}</div>}
      {status === "succeeded" && data?.tasks?.length === 0 && <div>No tasks available</div>}

      <AnimatePresence>
        {status === "succeeded" && data.data?.map((task, index) => (
          
          <motion.div
            key={task._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border rounded-md p-3 space-y-2 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleCardClick(task)}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{task.title}</p>
              {getPriorityBadge(task.priority)}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{task.projectName}</span>
              {getStatusBadge(task.status)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <CalendarDays className="mr-1 h-4 w-4" />
              <span>{new Date(task.deadline).toLocaleDateString()}</span>
              <span className="ml-2">
                ({calculateDaysRemaining(task.deadline)} days remaining)
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Modal for Task Details */}
      <Dialog open={isOpen} onClose={handleCloseModal} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
                <Dialog.Title className="text-lg font-bold">Task Details</Dialog.Title>
                {selectedTask && (
                  <div className="mt-4 space-y-2">
                    <p><strong>Title:</strong> {selectedTask.title}</p>
                    <p><strong>Project:</strong> {selectedTask.projectName}</p>
                    <p><strong>Priority:</strong> {selectedTask.priority}</p>
                    <p><strong>Status:</strong> {selectedTask.status}</p>
                    <p><strong>Due Date:</strong> {new Date(selectedTask.deadline).toLocaleDateString()}</p>
                    <p><strong>Days Remaining:</strong> {calculateDaysRemaining(selectedTask.deadline)}</p>
                  </div>
                )}
                <button
                  onClick={handleCloseModal}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </motion.div>
  );
}