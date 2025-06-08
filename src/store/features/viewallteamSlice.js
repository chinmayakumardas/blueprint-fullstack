import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "@/lib/axiosInstance";

// Async thunk for fetching all teams
export const fetchAllTeams = createAsyncThunk(
  'viewAllTeam/fetchAllTeams',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint
      const response = await axiosInstance.get('/teams');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teams');
    }
  }
);

// Async thunk for fetching team details
export const fetchTeamDetails = createAsyncThunk(
  'viewAllTeam/fetchTeamDetails',
  async (teamId, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint
      const response = await axiosInstance.get(`/teams/${teamId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team details');
    }
  }
);

const viewAllTeamSlice = createSlice({
  name: 'viewAllTeam',
  initialState: {
    teams: [],
    selectedTeam: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAllTeams
      .addCase(fetchAllTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchAllTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchTeamDetails
      .addCase(fetchTeamDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeam = action.payload;
      })
      .addCase(fetchTeamDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedTeam } = viewAllTeamSlice.actions;
export default viewAllTeamSlice.reducer;