import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8000";

const appApi = axios.create({
  baseURL: `${URL}/applications`,
});

//todo:  Lógica para listar los apps existentes.
export const appList = createAsyncThunk(
  "appList",
  async ({ token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await appApi.get(`/app/`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    }
  }
);

//todo: Lógica para listar un solo apps.
export const appDetails = createAsyncThunk(
  "appDetails",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await appApi.get(`/app/${id}/`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    }
  }
);

//todo: Lógica  para actualizar un app.
export const appUpdate = createAsyncThunk(
  "appUpdate",
  async (
    { id, title, version, data, description, applicationclassification, token },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let request;
      if (data) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("applicationclassification", applicationclassification);
        formData.append("version", version);
        formData.append("data", data);
        config.headers["Content-Type"] = "multipart/form-data";
        request = await appApi.put(`/app/${id}/`, formData, config);
      } else {
        config.headers["Content-Type"] = "application/json";

        request = await appApi.put(
          `/app/${id}/`,
          { title, version, description, applicationclassification },
          config
        );
      }

      return request;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    }
  }
);
//todo: Lógica para eliminar un app.
export const appDelete = createAsyncThunk(
  "appDelete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await appApi.delete(`/app/${id}/`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    }
  }
);

//todo: Lógica para añadir un app.
export const appCreate = createAsyncThunk(
  "appCreate",
  async (
    { title, version, data, description, applicationclassification, token },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let request;
      if (data) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("applicationclassification", applicationclassification);
        formData.append("version", version);
        formData.append("data", data);
        config.headers["Content-Type"] = "multipart/form-data";
        request = await appApi.post(`/app/`, formData, config);
      } else {
        config.headers["Content-Type"] = "application/json";

        request = await appApi.post(
          `/app/`,
          { title, version, description, applicationclassification },
          config
        );
      }

      return request;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
      );
    }
  }
);

const appInfoStorage = localStorage.getItem("appInfo")
  ? JSON.parse(localStorage.getItem("appInfo"))
  : {};

const initialState = {
  appInfo: appInfoStorage,
  apps: [],
  loading: false,
  error: false,
  success: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(appDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(appDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.appInfo = action.payload;
      state.success = true;
    });
    builder.addCase(appDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(appList.pending, (state, action) => {
      state.loading = true;
      state.apps = [];
    });
    builder.addCase(appList.fulfilled, (state, action) => {
      state.loading = false;
      state.apps = action.payload;
      state.success = true;
    });
    builder.addCase(appList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(appUpdate.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(appUpdate.fulfilled, (state, action) => {
      state.loading = false;
      state.appInfo = action.payload;
      state.success = true;
    });
    builder.addCase(appUpdate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(appDelete.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(appDelete.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const { id } = action.payload;
      if (id) {
        state.apps = state.apps.filter((app) => app.id !== id);
      }
    });
    builder.addCase(appDelete.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(appCreate.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(appCreate.fulfilled, (state, action) => {
      state.loading = false;
      state.appInfo = action.payload;
      state.success = true;
    });
    builder.addCase(appCreate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// export const {

// } = appSlice.actions;
export default appSlice.reducer;
