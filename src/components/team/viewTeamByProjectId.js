


"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  FiUsers,
  FiFolder,
  FiUser,
  FiX,
  FiLoader,
  FiEdit,
  FiFlag,
  FiCalendar,
  FiInfo,
  FiEye,
} from "react-icons/fi";
import { fetchTeamByProjectId } from "@/store/features/viewTeamByProjectIdSlice";
import { fetchTeamMembers } from "@/store/features/teamMembersSlice";
import { createTask } from "@/store/features/TaskSlice";
import { toast } from '@/components/ui/use-toast';
import EditTeam from "./EditTeam";

const ViewTeamByProjectId = ({ projectId }) => {
  const dispatch = useDispatch();
  const { teams: allTeams, status, error } = useSelector((state) => state.projectTeam);
  const { members, status: membersStatus } = useSelector((state) => state.teamMembers);
  const taskStatus = useSelector((state) => state.task?.status);

  const teams = allTeams.filter((team) => team.projectId === projectId);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    assignedBy: "",
    priority: "",
    deadline: "",
    projectId: projectId || "",
    projectName: "",
    teamId: "",
    memberId: "",
  });

  // Update assignedBy when selectedTeam changes
  useEffect(() => {
    if (selectedTeam) {
      setFormData((prev) => ({
        ...prev,
        assignedBy: selectedTeam.teamLeadName || "",
        projectId: selectedTeam.projectId || projectId,
        projectName: selectedTeam.projectName || "",
        teamId: selectedTeam._id || "",
      }));
    }
  }, [selectedTeam, projectId]);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTeamByProjectId(projectId));
    }
    if (membersStatus === "idle") {
      dispatch(fetchTeamMembers());
    }
  }, [dispatch, projectId, membersStatus]);

  useEffect(() => {
    if (showTeamDetails || showEditTeam || showCreateTask) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showTeamDetails, showEditTeam, showCreateTask]);

  // Create team member options for assignedTo dropdown
  const teamMemberOptions = useMemo(() => {
    if (!selectedTeam?.teamMembers || !Array.isArray(selectedTeam.teamMembers)) {
      return [
        {
          value: selectedTeam?.teamLeadId,
          label: selectedTeam?.teamLeadName,
          memberId: selectedTeam?.teamLeadId,
        },
      ].filter(Boolean);
    }
    return [
      {
        value: selectedTeam.teamLeadId,
        label: selectedTeam.teamLeadName,
        memberId: selectedTeam.teamLeadId,
      },
      ...selectedTeam.teamMembers.map((member) => ({
        value: member.memberId,
        label: member.memberName,
        memberId: member.memberId,
      })),
    ].filter(Boolean);
  }, [selectedTeam]);

  const customSelectStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    }),
    control: (base) => ({
      ...base,
      borderColor: "#e5e7eb",
      paddingLeft: "2.25rem",
      borderRadius: "0.5rem",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "&:hover": { borderColor: "#2563eb" },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    input: (base) => ({
      ...base,
      color: "#1f2937",
    }),
    option: (base, state) => ({
      ...base,
      color: "#1f2937",
      backgroundColor: state.isSelected ? "#dbeafe" : "#ffffff",
      "&:hover": {
        backgroundColor: "#eff6ff",
      },
    }),
  };

  const handleViewClick = (teamId) => {
    const team = teams.find((team) => team._id === teamId);
    setSelectedTeam(team);
    setShowTeamDetails(true);
    setShowEditTeam(false);
  };

  const handleEditClick = (teamId) => {
    const team = teams.find((team) => team._id === teamId);
    setSelectedTeam(team);
    setShowEditTeam(true);
    setShowTeamDetails(false);
  };

  const closeTeamDetails = () => {
    setShowTeamDetails(false);
    setShowEditTeam(false);
    setShowCreateTask(false);
    setSelectedTeam(null);
    setSelectedMember(null);
    setFormData({
      title: "",
      description: "",
      assignedTo: "",
      assignedBy: "",
      priority: "",
      deadline: "",
      projectId: projectId || "",
      projectName: "",
      teamId: "",
      memberId: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name) => (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption?.value || "",
      memberId: selectedOption?.memberId || "",
    }));
    setSelectedMember(
      selectedOption
        ? { memberId: selectedOption.memberId, memberName: selectedOption.label }
        : null
    );
  };

  const validateForm = () => {
    const requiredFields = ["title", "assignedTo", "assignedBy", "projectId"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const taskData = {
        ...formData,
        projectId: selectedTeam.projectId,
        projectName: selectedTeam.projectName,
        teamId: selectedTeam._id,
        memberId: formData.memberId || selectedTeam.teamLeadId,
      };

      const result = await dispatch(createTask(taskData)).unwrap();
      if (result) {
        toast.success("Task assigned successfully!");
        closeTeamDetails();
      }
    } catch (err) {
      toast.error(`Failed to assign task: ${err.message || "Unknown error"}`);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <FiLoader className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-4 sm:p-6 bg-red-50 rounded-lg max-w-4xl mx-auto">
        <p className="text-red-600 text-center text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  if (!teams?.length) {
    return (
      <div className="text-center py-8 sm:py-10 text-gray-500 text-sm sm:text-base">
        No teams found for this project
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 max-w-7xl">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {(teams || []).map((team) => (
          <div
            key={team._id}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 hover:border-gray-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-3 sm:p-4 lg:p-5 border-b border-gray-50">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 truncate leading-tight">
                    {team.projectName}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">
                    ID: {team.projectId}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleViewClick(team._id)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-blue-50 transition-colors duration-200 group"
                    title="View Team"
                  >
                    <FiEye className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-500 group-hover:text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleEditClick(team._id)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-blue-50 transition-colors duration-200 group"
                    title="Edit Team"
                  >
                    <FiEdit className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-500 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4">
              {/* Team Lead */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg flex-shrink-0">
                  <FiUser className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 truncate">
                    {team.teamLeadName}
                  </p>
                  <p className="text-xs text-gray-500">Team Lead</p>
                </div>
              </div>

              {/* Team Members Count */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg flex-shrink-0">
                  <FiUsers className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800">
                    {team.teamMembers?.length || 0} Members
                  </p>
                  <p className="text-xs text-gray-500">Team Size</p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5">
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-50">
                <span className="text-xs sm:text-sm text-gray-400 font-medium">
                  Project Team
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Details Modal */}
      {showTeamDetails && selectedTeam && !showEditTeam && (
        <>
          {/* Task Creation Modal */}
          {showCreateTask && (
            <div style={{ zIndex: 60 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-500 flex items-center justify-center p-3 sm:p-4">
              <div className="bg-white rounded-xl sm:rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
                      Assign Task
                    </h3>
                    <button onClick={() => setShowCreateTask(false)}>
                      <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                </div>
                <form className="p-4 sm:p-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1.5">
                        Task Title
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter task title"
                          className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                          required
                        />
                        <FiEdit className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1.5">
                        Assigned By
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.assignedBy}
                          className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 border border-gray-200 rounded-lg bg-gray-50 text-sm sm:text-base"
                          readOnly
                          required
                        />
                        <FiUser className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1.5">
                        Assigned To
                      </label>
                      <div className="relative">
                        <Select
                          name="assignedTo"
                          options={teamMemberOptions}
                          value={teamMemberOptions.find(
                            (option) => option.value === formData.assignedTo
                          ) || null}
                          onChange={handleSelectChange("assignedTo")}
                          placeholder="Select team member..."
                          className="text-sm sm:text-base"
                          styles={customSelectStyles}
                          isClearable
                          isDisabled={!teamMemberOptions.length}
                          required
                        />
                        <FiUser className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-blue-500 z-10" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1.5">
                        Priority
                      </label>
                      <div className="relative">
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                        >
                          <option value="">Select priority</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                        <FiFlag className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1.5">
                        Deadline
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleChange}
                          className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                          min={new Date().toISOString().split("T")[0]}
                        />
                        <FiCalendar className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1.5">
                        Description
                      </label>
                      <div className="relative">
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Task description"
                          rows={4}
                          className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base resize-none"
                        />
                        <FiInfo className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateTask(false)}
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={taskStatus === "loading"}
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center"
                    >
                      {taskStatus === "loading" ? (
                        <>
                          <FiLoader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                          Assigning...
                        </>
                      ) : (
                        "Assign Task"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Team Details Modal */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={closeTeamDetails}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4">
            <div
              className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
                      {selectedTeam.projectName}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Project ID: {selectedTeam.projectId}
                    </p>
                  </div>
                  <button onClick={closeTeamDetails}>
                    <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Team Lead Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FiUser className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Team Lead
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm sm:text-lg font-semibold text-blue-600">
                        {selectedTeam.teamLeadName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-800">
                        {selectedTeam.teamLeadName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        ID: {selectedTeam.teamLeadId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Members Section */}
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FiUsers className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Team Members ({selectedTeam.teamMembers?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedTeam.teamMembers?.map((member) => (
                      <div
                        key={member._id}
                        className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm sm:text-lg font-semibold text-blue-600">
                              {member.memberName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-gray-800">
                              {member.memberName}
                            </p>
                            <p className="text-xs sm:text-sm text-blue-600">
                              {member.role}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setFormData((prev) => ({
                              ...prev,
                              assignedTo: member.memberId,
                              memberId: member.memberId,
                            }));
                            setShowCreateTask(true);
                          }}
                          className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                        >
                          Assign Task
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Team Modal */}
      {showEditTeam && selectedTeam && !showTeamDetails && (
        <EditTeam
          selectedTeam={selectedTeam}
          setShowEditTeam={setShowEditTeam}
          setShowTeamDetails={setShowTeamDetails}
          setSelectedTeam={setSelectedTeam}
          members={members}
          membersStatus={membersStatus}
        />
      )}
    </div>
  );
};

export default ViewTeamByProjectId;

