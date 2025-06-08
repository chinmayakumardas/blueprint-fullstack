import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

export const fetchProjectById = createAsyncThunk(
  'project/fetchById',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/projects/getProjectById/${projectId}`);
      if (!response.data) {
        throw new Error('No data found for the given project ID');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
  }
);
export const updateProject  = createAsyncThunk(
  'project/editById',
  async ({ projectId, updatedData }, { rejectWithValue }) => {
    try {
      // const response = await axiosInstance.put(`/projects/updateProject/Project-001`, updatedData);
      const response = await axiosInstance.put(`/projects/updateProject/${projectId}`, updatedData);
      console.log("hii2")
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to edit project');
    }
  }
);

const viewProjectsByIdSlice = createSlice({
  name: 'projectView',
  initialState: {
    project: null,
    status: 'idle',
    error: null
  },
  reducers: {},


  extraReducers: (builder) => {
  builder
    .addCase(fetchProjectById.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(fetchProjectById.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.project = action.payload;
    })
    .addCase(fetchProjectById.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    })
    // handle edit project actions
    .addCase(updateProject.pending, (state) => {
      state.status = 'updating';
      state.error = null;
    })
    .addCase(updateProject.fulfilled, (state, action) => {
      state.status = 'updated';
      state.project = action.payload; // update the project with the new data
    })
    .addCase(updateProject.rejected, (state, action) => {
      state.status = 'update_failed';
      state.error = action.payload;
    });
}

});

export default viewProjectsByIdSlice.reducer;
