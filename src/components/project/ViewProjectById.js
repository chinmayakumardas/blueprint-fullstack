
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById } from '@/store/features/viewProjectsByIdSlice';
import { changeProjectStatus } from '@/store/features/projectonboardingSlice';
import {
  FiArrowLeft,
  FiDownload,
  FiX,
  FiPlus,
  FiUsers,
  FiList,
  FiFileText,
  FiInfo,
  FiCalendar,
  FiUser,
  FiEdit,
  FiPaperclip,
} from 'react-icons/fi';
import { Briefcase, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ViewTeamByProjectId from '../team/viewTeamByProjectId';
import CreateTeamForm from '../team/createTeam';
import AllTaskList from '../task/AllTaskListById';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function ViewProjectById({ projectId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { project, status, error } = useSelector((state) => state.projectView);
  const { loading, error: onboardingError, successMessage } = useSelector(
    (state) => state.projectOnboarding
  );
console.log(project, 'project');
  const [activeTab, setActiveTab] = useState('details');
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (successMessage) {
      setStatusUpdateMessage(successMessage);
      dispatch(fetchProjectById(projectId));
      setNewStatus('');
      setTimeout(() => setStatusUpdateMessage(''), 3000);
    }
    if (onboardingError.statusChange) {
      setStatusUpdateMessage(onboardingError.statusChange);
      setTimeout(() => setStatusUpdateMessage(''), 3000);
    }
  }, [successMessage, onboardingError.statusChange, dispatch, projectId]);

  const handleDownload = (url, filename) => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const handleStatusSubmit = () => {
    if (newStatus) {
      setIsStatusModalOpen(false);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmStatusChange = () => {
    if (newStatus && projectId) {
      dispatch(changeProjectStatus({ projectId, status: newStatus }));
      setIsConfirmModalOpen(false);
      toast.success('Status Updated!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const statusOptions = ['In Progress', 'Completed', 'Cancelled', 'Planned'];

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-3 border-t-3 border-teal-600 mx-auto mb-6"></div>
          <p className="text-green-700 font-medium text-lg">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container mx-auto ">
        <Card className=" border border-red-200 shadow-lg mx-auto max-w-2xl">
          <CardContent className="p-6">
            <p className="font-semibold text-lg text-red-700 mb-2">
              Unable to load project
            </p>
            <p className="text-red-600 text-sm mb-4">
              {error || 'An error occurred while loading the project.'}
            </p>
            <Button
              onClick={() => dispatch(fetchProjectById(projectId))}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="container mx-auto  min-h-screen ">
      {/* Header Section */}
      <Card className=" shadow-xl mb-4 ">
        <CardHeader className=" border-b border-green-100">
         <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="border-green-500 text-green-700 hover:bg-green-600 hover:text-white font-semibold"
              >
                <FiArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <CardTitle className="text-2xl font-bold text-green-700">
                {project.data.projectName}
              </CardTitle>
            </div>
        </CardHeader>
      </Card>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="bg-white rounded-lg shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Update Project Status
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Status
            </label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="border-gray-200 focus:ring-teal-500 focus:border-teal-500 bg-white">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions
                  .filter((status) => status !== project.data.status)
                  .map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
              className="text-gray-600 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusSubmit}
              disabled={!newStatus}
              className="bg-teal-600 text-white hover:bg-teal-700"
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="bg-white rounded-lg shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Confirm Status Change
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to change the project status to{' '}
            <span className="font-semibold text-teal-600">{newStatus}</span>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              className="text-gray-600 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              className="bg-teal-600 text-white hover:bg-teal-700"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8 sticky "
      >
        <TabsList className=" p-1 rounded-full flex flex-wrap justify-center sm:justify-start gap-2">
          {[
            { id: 'details', label: 'Details', icon: <FiInfo className="h-5 w-5" /> },
            { id: 'tasks', label: 'Tasks', icon: <FiList className="h-5 w-5" /> },
         
            { id: 'team', label: 'Team', icon: <FiUsers className="h-5 w-5" /> },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`flex items-center gap-2 rounded-full py-2 px-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content Section */}
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details and Timeline */}
            <Card className="border border-gray-200 shadow-lg bg-white">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiInfo className="h-5 w-5 text-teal-600" />
                    Project Details
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/projects/edit/${projectId}`)}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <FiEdit className="h-5 w-5 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Project ID:</span>
                  <span>{project.data.projectId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPaperclip className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Category:</span>
                  <span>{project.data.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiUser className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Client ID:</span>
                  <span>{project.data.clientId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Status:</span>
                  <Badge
                    onClick={() => setIsStatusModalOpen(true)}
                    className={`cursor-pointer px-3 py-1 text-sm font-medium ${
                      project.data.status === 'Completed'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : project.data.status === 'In Progress'
                        ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                        : project.data.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {project.data.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <FiUser className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Team Lead:</span>
                  <span>
                    {project.data.teamLeadName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Created At:</span>
                  <span>{new Date(project.data.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
              {(project.data.startDate || project.data.endDate || project.data.attachments?.length > 0) && (
                <CardContent className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiCalendar className="h-5 w-5 text-indigo-600" />
                    Timeline & Attachments
                  </h3>
                  <div className="space-y-4 text-sm text-gray-600">
                    {project.data.startDate && (
                      <div className="flex items-center gap-3">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                        <span className="font-bold text-gray-700 w-28">Start Date:</span>
                        <span>{new Date(project.data.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {project.data.endDate && (
                      <div className="flex items-center gap-3">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                        <span className="font-bold text-gray-700 w-28">End Date:</span>
                        <span>{new Date(project.data.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {project.data.attachments?.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-700">Attachments:</h4>
                        {project.data.attachments.map((attachment, index) => (
                          <Button
                            key={index}
                            onClick={() => handleDownload(attachment.url, attachment.filename)}
                            disabled={isDownloading}
                            variant="outline"
                            className="flex items-center gap-2 w-full justify-start text-left bg-white border-gray-200 hover:bg-gray-50"
                          >
                            <FiDownload className="h-5 w-5 text-indigo-600" />
                            <span className="text-gray-700 truncate">{attachment.filename}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Description */}
            <Card className="border border-gray-200 shadow-lg bg-white">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiFileText className="h-5 w-5 text-teal-600" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {project.data.description ? (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {project.data.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No description available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiList className="h-5 w-5 text-teal-600" />
                All Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <AllTaskList projectId={project.data.projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        

        <TabsContent value="team" className="mt-6">
          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiUsers className="h-5 w-5 text-teal-600" />
                  Team
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowTeamForm(true)}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <FiPlus className="h-5 w-5 mr-2" />
                  Create Team
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {showTeamForm ? (
                project && project.data && (
                  <CreateTeamForm
                    projectDetails={{
                      id: project.data.projectId,
                      name: project.data.projectName,
                      teamLead: {
                        id: project.data.teamLeadId,
                        name: project.data.teamLeadName,
                      },
                      teamMembers: [],
                    }}
                    onSuccess={() => setShowTeamForm(false)}
                  />
                )
              ) : (
                <ViewTeamByProjectId projectId={projectId} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}




