"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, MapPin, Users, Pencil, Eye, Trash2, Plus } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // Adjust path to your UI folder

import {
  fetchMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  setSelectedMeeting,
  clearSelectedMeeting,
  setCreateModalOpen,
  setEditModalOpen,
  setViewModalOpen,
  closeAllModals,
  clearError,
} from "@/store/features/meetingSlice";

// Utility function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Form component for creating/editing meetings
function MeetingForm({ meeting = {}, onSave, onCancel, isEditing = false, loading = false }) {
  const [formData, setFormData] = React.useState({
    title: meeting.title || "",
    date: meeting.date || "",
    time: meeting.time || "",
    location: meeting.location || "",
    attendees: Array.isArray(meeting.attendees) ? meeting.attendees.join(", ") : "",
    description: meeting.description || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      attendees: formData.attendees
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name),
    });
  };
console.log("meeting list",meeting)
  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-green-800 font-medium">
            Meeting Title
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-green-800 font-medium">
              Date
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="border-green-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <Label htmlFor="time" className="text-green-800 font-medium">
              Time
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="border-green-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="location" className="text-green-800 font-medium">
            Location
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <Label htmlFor="attendees" className="text-green-800 font-medium">
            Attendees (comma-separated)
          </Label>
          <Input
            id="attendees"
            name="attendees"
            value={formData.attendees}
            onChange={handleChange}
            placeholder="John Doe, Jane Smith, ..."
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <Label htmlFor="description" className="text-green-800 font-medium">
            Description
          </Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md p-2"
            rows={4}
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-green-300 text-green-700 hover:bg-green-50"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white"
          >
            {loading ? "Saving..." : isEditing ? "Update Meeting" : "Create Meeting"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// View meeting details component
function MeetingDetails({ meeting, onClose }) {
  return (
    <div className="bg-green-50 p-6 rounded-lg space-y-4">
      <h3 className="text-xl font-semibold text-green-800">{meeting.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 text-green-700">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">{formatDate(meeting.date)}</span>
        </div>
        <div className="flex items-center space-x-3 text-green-700">
          <Clock className="h-5 w-5" />
          <span className="font-medium">{meeting.time}</span>
        </div>
        <div className="flex items-center space-x-3 text-green-700">
          <MapPin className="h-5 w-5" />
          <span className="font-medium">{meeting.location}</span>
        </div>
        <div className="flex items-center space-x-3 text-green-700">
          <Users className="h-5 w-5" />
          <span className="font-medium">
            {Array.isArray(meeting.attendees) ? meeting.attendees.join(", ") : meeting.attendees}
          </span>
        </div>
      </div>
      {meeting.description && (
        <div className="mt-4 p-4 bg-white rounded border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Description</h4>
          <p className="text-green-700">{meeting.description}</p>
        </div>
      )}
      <div className="flex justify-end pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default function Meeting() {
  const dispatch = useDispatch();
  const meetingsState = useSelector((state) => state.meetings || {});
  const {
    meetings = [],
    selectedMeeting = null,
    loading = false,
    error = null,
    modals = { isCreateOpen: false, isEditOpen: false, isViewOpen: false },
    createLoading = false,
    updateLoading = false,
    deleteLoading = false,
  } = meetingsState;

  // Fetch meetings on component mount
  useEffect(() => {
    dispatch(fetchMeetings());
  }, [dispatch]);

  const handleCreate = async (newMeeting) => {
    await dispatch(createMeeting(newMeeting));
    dispatch(clearSelectedMeeting());
  };

  const handleEdit = async (updatedMeeting) => {
    await dispatch(updateMeeting({ id: selectedMeeting.id, meetingData: updatedMeeting }));
    dispatch(clearSelectedMeeting());
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      await dispatch(deleteMeeting(id));
    }
  };

  const openEditModal = (meeting) => {
    dispatch(setSelectedMeeting(meeting));
    dispatch(setEditModalOpen(true));
  };

  const openViewModal = (meeting) => {
    dispatch(setSelectedMeeting(meeting));
    dispatch(setViewModalOpen(true));
  };

  const handleCloseModals = () => {
    dispatch(closeAllModals());
    dispatch(clearSelectedMeeting());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

console.log()
  return (
    <div className="min-h-screen">
      <Card className="mx-auto border-green-200 shadow-lg">
        <CardHeader className="bg-green-100 border-b border-green-200">
          <CardTitle className="flex justify-between items-center text-green-800">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6" />
              <span className="text-2xl font-bold">All Meetings</span>
            </div>
            <Dialog
              open={modals.isCreateOpen}
              onOpenChange={(open) => dispatch(setCreateModalOpen(open))}
            >
              <DialogTrigger asChild>
                <Button className="bg-green-700 hover:bg-green-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-green-800">Create New Meeting</DialogTitle>
                </DialogHeader>
                <MeetingForm
                  onSave={handleCreate}
                  onCancel={handleCloseModals}
                  loading={createLoading}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert className="mb-4 border-red-300 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearError}
                  className="ml-2 text-red-700 hover:text-red-800"
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-green-700">Loading meetings...</div>
            </div>
          ) : meetings.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-green-700">No meetings found.</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-green-50">
                    <TableHead className="text-green-800 font-semibold">Title</TableHead>
                    <TableHead className="text-green-800 font-semibold">Date</TableHead>
                    <TableHead className="text-green-800 font-semibold">Time</TableHead>
                    <TableHead className="text-green-800 font-semibold">Location</TableHead>
                    <TableHead className="text-green-800 font-semibold">Attendees</TableHead>
                    <TableHead className="text-green-800 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.id} className="hover:bg-green-50">
                      <TableCell className="font-medium text-green-800">{meeting.title}</TableCell>
                      <TableCell className="text-green-700">{formatDate(meeting.date)}</TableCell>
                      <TableCell className="text-green-700">{meeting.time}</TableCell>
                      <TableCell className="text-green-700">{meeting.location}</TableCell>
                      <TableCell className="text-green-700">
                        {Array.isArray(meeting.attendees)
                          ? meeting.attendees.join(", ")
                          : meeting.attendees}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewModal(meeting)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-100"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(meeting)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(meeting.id)}
                            disabled={deleteLoading}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Edit Meeting Modal */}
          <Dialog
            open={modals.isEditOpen}
            onOpenChange={(open) => dispatch(setEditModalOpen(open))}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-green-800">Edit Meeting</DialogTitle>
              </DialogHeader>
              {selectedMeeting && (
                <MeetingForm
                  meeting={selectedMeeting}
                  onSave={handleEdit}
                  onCancel={handleCloseModals}
                  isEditing={true}
                  loading={updateLoading}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* View Meeting Modal */}
          <Dialog
            open={modals.isViewOpen}
            onOpenChange={(open) => dispatch(setViewModalOpen(open))}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-green-800">Meeting Details</DialogTitle>
              </DialogHeader>
              {selectedMeeting && (
                <MeetingDetails meeting={selectedMeeting} onClose={handleCloseModals} />
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}