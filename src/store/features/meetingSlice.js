import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance3 from '@/lib/axiosInstance3'; // Adjust path as needed

// Async thunks for API calls
export const fetchMeetings = createAsyncThunk(
  'meetings/fetchMeetings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance3.get('/meetings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meetings');
    }
  }
);

export const createMeeting = createAsyncThunk(
  'meetings/createMeeting',
  async (meetingData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance3.post('/create-meeting', meetingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create meeting');
    }
  }
);

export const updateMeeting = createAsyncThunk(
  'meetings/updateMeeting',
  async ({ id, meetingData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance3.put(`/meetings/${id}`, meetingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update meeting');
    }
  }
);

export const deleteMeeting = createAsyncThunk(
  'meetings/deleteMeeting',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance3.delete(`/meetings/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete meeting');
    }
  }
);

export const getMeetingById = createAsyncThunk(
  'meetings/getMeetingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance3.get(`/meetings/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meeting');
    }
  }
);

const initialState = {
  meetings: [],
  selectedMeeting: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  modals: {
    isCreateOpen: false,
    isEditOpen: false,
    isViewOpen: false,
  },
};

const meetingSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedMeeting: (state, action) => {
      state.selectedMeeting = action.payload;
    },
    clearSelectedMeeting: (state) => {
      state.selectedMeeting = null;
    },
    setCreateModalOpen: (state, action) => {
      state.modals.isCreateOpen = action.payload;
    },
    setEditModalOpen: (state, action) => {
      state.modals.isEditOpen = action.payload;
    },
    setViewModalOpen: (state, action) => {
      state.modals.isViewOpen = action.payload;
    },
    closeAllModals: (state) => {
      state.modals.isCreateOpen = false;
      state.modals.isEditOpen = false;
      state.modals.isViewOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch meetings
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = action.payload;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create meeting
      .addCase(createMeeting.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.createLoading = false;
        state.meetings.push(action.payload);
        state.modals.isCreateOpen = false;
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Update meeting
      .addCase(updateMeeting.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateMeeting.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.meetings.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
        state.modals.isEditOpen = false;
      })
      .addCase(updateMeeting.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete meeting
      .addCase(deleteMeeting.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.meetings = state.meetings.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      // Get meeting by ID
      .addCase(getMeetingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMeetingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMeeting = action.payload;
      })
      .addCase(getMeetingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setSelectedMeeting,
  clearSelectedMeeting,
  setCreateModalOpen,
  setEditModalOpen,
  setViewModalOpen,
  closeAllModals,
} = meetingSlice.actions;

export default meetingSlice.reducer;