



"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
 import { validateInput, sanitizeInput } from "@/lib/sanitize";
import TeamLeadSelect from "@/components/project/TeamLeadSelect";
import ClientSelect from "@/components/project/ClientSelect";
import gsap from "gsap";
import { toast } from '@/components/ui/use-toast';
import {
  FiCalendar,
  FiUser,
  FiFileText,
  FiSave,
  FiUpload,
  FiX,
  FiFolder,
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiBook,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import {
  createProject,
  resetProjectCreation,
} from "@/store/features/projectonboardingSlice";

export default function ProjectOnboarding() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => ({
    loading: state.projectOnboarding.loading.projectCreation,
    error: state.projectOnboarding.error.projectCreation,
    successMessage: state.projectOnboarding.successMessage,
  }));

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const clientSelectRef = useRef(null);
  const teamLeadSelectRef = useRef(null);
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    clientId: "",
    teamLeadId: "teamlead100",
    startDate: "",
    endDate: "",
    category: "",
    attachments: [],
  });
  const [formErrors, setFormErrors] = useState({
    projectName: "",
    description: "",
    clientId: "",
    teamLeadId: "",
    startDate: "",
    endDate: "",
    category: "",
  });
  const [isClientSelectOpen, setIsClientSelectOpen] = useState(false);
  const [isTeamLeadSelectOpen, setIsTeamLeadSelectOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Toast notifications for success and error
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage || "Project created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      router.push("/projects");
    }
    if (error) {
      toast.error(error || "Failed to create project!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      gsap.to(formRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power4.out",
      });
    }
  }, [successMessage, error, router]);

  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
    );
    dispatch(resetProjectCreation());
  }, [dispatch]);

  // Click outside handler for select dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        clientSelectRef.current &&
        !clientSelectRef.current.contains(event.target)
      ) {
        setIsClientSelectOpen(false);
      }
      if (
        teamLeadSelectRef.current &&
        !teamLeadSelectRef.current.contains(event.target)
      ) {
        setIsTeamLeadSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
      const { name, value } = e.target;
      const validation = validateInput(value);
      
      if (!validation.isValid) {
        setFormErrors(prev => ({
          ...prev,
          [name]: validation.warning
        }));
        return;
      }
      
      // Clear error when valid input is provided
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
      
      const sanitizedValue = sanitizeInput(value);
      const updatedFormData = {
        ...formData,
        [name]: sanitizedValue,
      };
      
      // Date validation: Check if start date is after end date
      if (name === 'startDate' && updatedFormData.endDate && new Date(sanitizedValue) > new Date(updatedFormData.endDate)) {
        setFormErrors(prev => ({
          ...prev,
          startDate: "Start date cannot be after end date"
        }));
      } else if (name === 'endDate' && updatedFormData.startDate && new Date(updatedFormData.startDate) > new Date(sanitizedValue)) {
        setFormErrors(prev => ({
          ...prev,
          endDate: "End date cannot be before start date"
        }));
      }
      
      setFormData(updatedFormData);
    };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }));

    gsap.from(".file-item:last-child", {
      opacity: 0,
      x: -30,
      duration: 0.5,
      ease: "power4.out",
    });
  };

  const removeFile = (index) => {
    const fileElement = document.querySelector(
      `.file-item:nth-child(${index + 1})`
    );
    gsap.to(fileElement, {
      opacity: 0,
      x: 30,
      duration: 0.5,
      ease: "power4.in",
      onComplete: () => {
        setFormData((prev) => ({
          ...prev,
          attachments: prev.attachments.filter((_, i) => i !== index),
        }));
      },
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      // Validate all fields before submission
      let hasErrors = false;
      const newErrors = {...formErrors};
      
      for (const [key, value] of Object.entries(formData)) {
        // Skip attachments field
        if (key === 'attachments') continue;
        
        const validation = validateInput(value);
        if (!validation.isValid) {
          newErrors[key] = validation.warning;
          hasErrors = true;
        }
      }
      
      // Validate date relationships
      if (formData.startDate && formData.endDate) {
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
          newErrors.startDate = "Start date cannot be after end date";
          newErrors.endDate = "End date cannot be before start date";
          hasErrors = true;
        }
      }
      
      if (hasErrors) {
        setFormErrors(newErrors);
        return;
      }

      await gsap.to(formRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: "power4.in",
    });
    dispatch(createProject(formData));
  };

  // Function to determine file icon based on extension
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FiBook className="text-red-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FiImage className="text-green-500" />;
      case "mp4":
      case "mov":
      case "avi":
        return <FiVideo className="text-blue-500" />;
      case "mp3":
      case "wav":
        return <FiMusic className="text-purple-500" />;
      case "doc":
      case "docx":
      case "txt":
        return <FiFile className="text-indigo-500" />;
      default:
        return <FiFile className="text-gray-500" />;
    }
  };

  return (
    <div
      ref={formRef}
      className="container mx-auto px-4 py-6 bg-white rounded-lg shadow-sm transform transition-all duration-300 min-h-screen max-h-screen overflow-y-auto min-w-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="cursor-pointer inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-full font-medium text-sm transition-all hover:bg-blue-100"
        >
          <FiArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-800 text-center">
          Onboard New Project
        </h1>
      </div>

      <form
        id="project-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Left Column */}
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.projectName ? 'text-red-500' : 'text-gray-600'}`}>
              <FiFileText className="mr-2" />
              Project Name
              {formErrors.projectName && <span className="ml-2 text-xs font-normal">({formErrors.projectName})</span>}
            </label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              disabled={loading}
              className={`w-full p-2 border ${formErrors.projectName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.projectName ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
              placeholder="Enter project name"
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.category ? 'text-red-500' : 'text-gray-600'}`}>
              <FiFolder className="mr-2" />
              Category
              {formErrors.category && <span className="ml-2 text-xs font-normal">({formErrors.category})</span>}
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading}
              className={`w-full p-2 cursor-pointer border ${formErrors.category ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.category ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
            >
              <option value="">Select Category</option>
              <option value="client">Client</option>
              <option value="in house">In House</option>
            </select>
          </div>

          <div ref={clientSelectRef} className="p-4 border border-gray-200 rounded-lg">
            <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.clientId ? 'text-red-500' : 'text-gray-600'}`}>
              <FiUser className="mr-2" />
              Client
              {formErrors.clientId && <span className="ml-2 text-xs font-normal">({formErrors.clientId})</span>}
            </label>
            <ClientSelect
              value={formData.clientId}
              isOpen={isClientSelectOpen}
              onToggle={() => setIsClientSelectOpen(!isClientSelectOpen)}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, clientId: value }));
                setIsClientSelectOpen(false);
              }}
              disabled={loading}
            />
          </div>

          <div ref={teamLeadSelectRef} className="p-4 border border-gray-200 rounded-lg">
            <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.teamLeadId ? 'text-red-500' : 'text-gray-600'}`}>
              <FiUser className="mr-2" />
              Team Lead
              {formErrors.teamLeadId && <span className="ml-2 text-xs font-normal">({formErrors.teamLeadId})</span>}
            </label>
            <TeamLeadSelect
              value={formData.teamLeadId}
              isOpen={isTeamLeadSelectOpen}
              onToggle={() => setIsTeamLeadSelectOpen(!isTeamLeadSelectOpen)}
              onChange={({ teamLeadId, teamLeadName }) => {
                setFormData((prev) => ({
                  ...prev,
                  teamLeadId,
                  teamLeadName,
                }));
                setIsTeamLeadSelectOpen(false);
              }}
              disabled={loading}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.startDate ? 'text-red-500' : 'text-gray-600'}`}>
              <FiCalendar className="mr-2" />
              Start Date
              {formErrors.startDate && <span className="ml-2 text-xs font-normal">({formErrors.startDate})</span>}
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={loading}
              className={`w-full cursor-pointer p-2 border ${formErrors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.startDate ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.endDate ? 'text-red-500' : 'text-gray-600'}`}>
              <FiCalendar className="mr-2" />
              End Date
              {formErrors.endDate && <span className="ml-2 text-xs font-normal">({formErrors.endDate})</span>}
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              disabled={loading}
              className={`w-full cursor-pointer p-2 border ${formErrors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.endDate ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
            />
          </div>

          <div
            className={`p-4 border ${
              dragActive ? "border-gray-400 bg-gray-50" : "border-gray-200 bg-white"
            } rounded-lg transition-colors duration-200`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !loading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              disabled={loading}
            />
            <div className="text-center mb-2">
              <FiUpload className="mx-auto text-xl text-gray-500 mb-1" />
              <p className="text-gray-500 text-sm">
                Drag & drop files or click to upload
              </p>
            </div>
            {formData.attachments.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2">
                {formData.attachments.map((file, index) => {
                  const fileName = file.name;
                  const extension = fileName.split(".").pop().toLowerCase();
                  const truncatedName = fileName.substring(
                    0,
                    Math.min(8, fileName.length - extension.length - 1)
                  );
                  const displayName = `${truncatedName}...${extension}`;

                  return (
                    <div
                      key={index}
                      className="file-item relative group flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-400 p-1"
                          disabled={loading}
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-2xl">{getFileIcon(file.name)}</div>
                        <span
                          className="text-gray-600 text-xs text-center"
                          title={file.name}
                        >
                          {displayName}
                        </span>
                      </div>
                      <div className="absolute -top-1 -left-1 bg-green-500 text-white rounded-full p-1">
                        <FiCheck size={12} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg h-full">
            <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.description ? 'text-red-500' : 'text-gray-600'}`}>
              <FiFileText className="mr-2" />
              Description
              {formErrors.description && <span className="ml-2 text-xs font-normal">({formErrors.description})</span>}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              className={`w-full h-[calc(100%-32px)] resize-none p-2 border ${formErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.description ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
              placeholder="Describe your project..."
            />
          </div>
        </div>
      </form>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          form="project-form"
          disabled={loading}

          
          className={`flex items-center gap-2 rounded-full cursor-pointer py-2 px-4 text-white transition-colors duration-200 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                ></path>
              </svg>
              Creating...
            </>
          ) : (
            <>
              <FiSave />
              Create Project
            </>
          )}
        </button>
      </div>
    </div>
  );
}




