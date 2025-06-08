import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

// Thunk: Fetch teams by project ID
export const fetchTeamByProjectId = createAsyncThunk(
  'team/fetchTeamByProjectId',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/team/getallteamsbyprojectid/${projectId}`);
      console.log('Fetch teams by project ID API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching teams by project ID:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch team details'
      );
    }
  }
);

// Thunk: Fetch all teams
export const fetchAllTeams = createAsyncThunk(
  'team/fetchAllTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/teams');
      console.log('Fetch all teams API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all teams:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch teams'
      );
    }
  }
);

// Thunk: Fetch team details
export const fetchTeamDetails = createAsyncThunk(
  'team/fetchTeamDetails',
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/teams/${teamId}`);
      console.log('Fetch team details API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching team details:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch team details'
      );
    }
  }
);

// Thunk: Fetch all team members (employees)
export const fetchTeamMembers = createAsyncThunk(
  'team/fetchTeamMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/hrms/employees');
      console.log('Fetch all team members API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch all team members error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch team members'
      );
    }
  }
);

// Thunk: Create a new team
export const createTeam = createAsyncThunk(
  'team/createTeam',
  async (teamData, { rejectWithValue }) => {
    try {
      console.log('Creating team with data:', teamData);
      const response = await axiosInstance.post('/team/createteam', {
        projectId: teamData.projectId,
        projectName: teamData.projectName,
        teamLeadId: teamData.teamLeadId,
        teamLeadName: teamData.teamLeadName,
        teamMembers: teamData.teamMembers.map((member) => ({
          memberId: member.memberId,
          memberName: member.memberName,
          role: member.role,
          email: member.email,
        })),
      });
      if (response.data) {
        console.log('Create team API response:', response.data);
        return response.data;
      } else {
        return rejectWithValue('No data received from server');
      }
    } catch (error) {
      console.error('Team creation error:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create team'
      );
    }
  }
);

// Thunk: Fetch team members by team ID
export const fetchTeamMembersByTeamId = createAsyncThunk(
  'team/fetchTeamMembersByTeamId',
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/team/teammembers/${teamId}`);
      console.log(`Fetch team members for team ${teamId} API response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Fetch team members for team ${teamId} error:`, error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch team members by team ID'
      );
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    teamsByProject: [], // Teams for a specific project
    allTeams: [], // All teams
    selectedTeam: null, // Details of a specific team
    allMembers: [], // All employees
    teamMembersByTeamId: [], // Members of a specific team
    status: 'idle', // Unified status for fetch operations
    createTeamStatus: 'idle', // Status for team creation
    error: null, // Unified error
  },
  reducers: {
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teams by project ID
      .addCase(fetchTeamByProjectId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTeamByProjectId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teamsByProject = Array.isArray(action.payload.data)
          ? action.payload.data
          : action.payload.data
            ? [action.payload.data]
            : [];
        console.log('Processed teams by project:', state.teamsByProject);
      })
      .addCase(fetchTeamByProjectId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.teamsByProject = [];
      })

      // Fetch all teams
      .addCase(fetchAllTeams.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllTeams.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allTeams = Array.isArray(action.payload) ? action.payload : [];
        console.log('Processed all teams:', state.allTeams);
      })
      .addCase(fetchAllTeams.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.allTeams = [];
      })

      // Fetch team details
      .addCase(fetchTeamDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTeamDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedTeam = action.payload;
        console.log('Processed team details:', state.selectedTeam);
      })
      .addCase(fetchTeamDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch all team members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const responseData = action.payload?.data || action.payload;
        if (Array.isArray(responseData)) {
          state.allMembers = responseData.map((member) => ({
            employeeID: member.employeeID || member.id,
            firstName: member.firstName || member.name?.split(' ')[0] || '',
            lastName: member.lastName || member.name?.split(' ')[1] || '',
            email: member.email || '',
          }));
        } else {
          state.allMembers = [];
        }
        console.log('Processed all team members:', state.allMembers);
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.allMembers = [];
      })

      // Create team
      .addCase(createTeam.pending, (state) => {
        state.createTeamStatus = 'loading';
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state) => {
        state.createTeamStatus = 'succeeded';
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.createTeamStatus = 'failed';
        state.error = action.payload;
      })

      // Fetch team members by team ID
      .addCase(fetchTeamMembersByTeamId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTeamMembersByTeamId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const responseData = action.payload?.data || action.payload;
        if (Array.isArray(responseData)) {
          state.teamMembersByTeamId = responseData.map((member) => ({
            memberId: member.memberId,
            memberName: member.memberName,
            role: member.role,
            email: member.email,
          }));
        } else {
          state.teamMembersByTeamId = [];
        }
        console.log('Processed team members by team ID:', state.teamMembersByTeamId);
      })
      .addCase(fetchTeamMembersByTeamId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.teamMembersByTeamId = [];
      });
  },
});

export const { clearSelectedTeam } = teamSlice.actions;
export default teamSlice.reducer;