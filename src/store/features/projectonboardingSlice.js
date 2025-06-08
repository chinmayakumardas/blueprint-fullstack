

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

// Async thunk for fetching clients
export const fetchClients = createAsyncThunk(
  'projectOnboarding/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/client/getAllClients');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch clients');
    }
  }
);

// Async thunk for fetching team leads
export const fetchTeamLeads = createAsyncThunk(
  'projectOnboarding/fetchTeamLeads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/hrms/employees');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch team leads');
    }
  }
);

// Async thunk for creating a new project
export const createProject = createAsyncThunk(
  'projectOnboarding/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append project data
      Object.keys(projectData).forEach((key) => {
        if (key !== 'attachments') {
          formData.append(key, projectData[key]);
        }
      });

      // Append attachments
      if (projectData.attachments) {
        projectData.attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const response = await axiosInstance.post('/projects/onboard', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create project');
    }
  }
);

// Async thunk for changing project status
export const changeProjectStatus = createAsyncThunk(
  'projectOnboarding/changeProjectStatus',
  async ({ projectId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/projects/status/${projectId}`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to change project status');
    }
  }
);

const initialState = {
  clients: [],
  teamLeads: [],
  loading: {
    clients: false,
    teamLeads: false,
    projectCreation: false,
    statusChange: false,
  },
  error: {
    clients: null,
    teamLeads: null,
    projectCreation: null,
    statusChange: null,
  },
  successMessage: null,
};

const projectOnboardingSlice = createSlice({
  name: 'projectOnboarding',
  initialState,
  reducers: {
    resetProjectCreation: (state) => {
      state.loading.projectCreation = false;
      state.error.projectCreation = null;
      state.successMessage = null;
    },
    clearErrors: (state) => {
      state.error = {
        clients: null,
        teamLeads: null,
        projectCreation: null,
        statusChange: null,
      };
    },
    resetSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Clients
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading.clients = true;
        state.error.clients = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading.clients = false;
        state.clients = action.payload.clients || [];
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading.clients = false;
        state.error.clients = action.payload;
      });

    // Fetch Team Leads
    builder
      .addCase(fetchTeamLeads.pending, (state) => {
        state.loading.teamLeads = true;
        state.error.teamLeads = null;
      })
      .addCase(fetchTeamLeads.fulfilled, (state, action) => {
        state.loading.teamLeads = false;
        state.teamLeads = action.payload;
      })
      .addCase(fetchTeamLeads.rejected, (state, action) => {
        state.loading.teamLeads = false;
        state.error.teamLeads = action.payload;
      });

    // Create Project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading.projectCreation = true;
        state.error.projectCreation = null;
        state.successMessage = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading.projectCreation = false;
        state.successMessage = 'Project created successfully';
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading.projectCreation = false;
        state.error.projectCreation = action.payload;
      });

    // Change Project Status
    builder
      .addCase(changeProjectStatus.pending, (state) => {
        state.loading.statusChange = true;
        state.error.statusChange = null;
        state.successMessage = null;
      })
      .addCase(changeProjectStatus.fulfilled, (state, action) => {
        state.loading.statusChange = false;
        state.successMessage = 'Project status updated successfully';
      })
      .addCase(changeProjectStatus.rejected, (state, action) => {
        state.loading.statusChange = false;
        state.error.statusChange = action.payload;
      });
  },
});

export const {
  resetProjectCreation,
  clearErrors,
  resetSuccessMessage,
} = projectOnboardingSlice.actions;

export default projectOnboardingSlice.reducer;
