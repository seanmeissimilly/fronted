import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8000";

const multimediaApi = axios.create({
  baseURL: `${URL}/multimedia`,
});

//todo:  Lógica para listar los multimedias existentes.
export const multimediaList = createAsyncThunk(
  "multimediaList",
  async ({ token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await multimediaApi.get(`/`, config);
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

//todo: Lógica para listar un solo multimedias.
export const multimediaDetails = createAsyncThunk(
  "multimediaDetails",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await multimediaApi.get(`/${id}/`, config);
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

//todo: Lógica  para actualizar un multimedia.
export const multimediaUpdate = createAsyncThunk(
  "multimediaUpdate",
  async (
    { id, title, data, description, multimediaclassification, token },
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
        formData.multimediaend("title", title);
        formData.multimediaend("description", description);
        formData.multimediaend(
          "multimediaclassification",
          multimediaclassification
        );

        formData.multimediaend("data", data);
        config.headers["Content-Type"] = "multipart/form-data";
        request = await multimediaApi.put(`/${id}/`, formData, config);
      } else {
        config.headers["Content-Type"] = "application/json";

        request = await multimediaApi.put(
          `/${id}/`,
          { title, description, multimediaclassification },
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
//todo: Lógica para eliminar un multimedia.
export const multimediaDelete = createAsyncThunk(
  "multimediaDelete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await multimediaApi.delete(`/${id}/`, config);
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

//todo: Lógica para añadir un multimedia.
export const multimediaCreate = createAsyncThunk(
  "multimediaCreate",
  async (
    { title, data, description, multimediaclassification, token },
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
        formData.multimediaend("title", title);
        formData.multimediaend("description", description);
        formData.multimediaend(
          "multimediaclassification",
          multimediaclassification
        );

        formData.multimediaend("data", data);
        config.headers["Content-Type"] = "multipart/form-data";
        request = await multimediaApi.post(`/`, formData, config);
      } else {
        config.headers["Content-Type"] = "application/json";

        request = await multimediaApi.post(
          `/`,
          { title, description, multimediaclassification },
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

const multimediaInfoStorage = localStorage.getItem("multimediaInfo")
  ? JSON.parse(localStorage.getItem("multimediaInfo"))
  : {};

const initialState = {
  multimediaInfo: multimediaInfoStorage,
  multimedias: [],
  loading: false,
  error: false,
  success: false,
};

export const multimediaSlice = createSlice({
  name: "multimedia",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(multimediaDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(multimediaDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.multimediaInfo = action.payload;
      state.success = true;
    });
    builder.addCase(multimediaDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(multimediaList.pending, (state, action) => {
      state.loading = true;
      state.multimedias = [];
    });
    builder.addCase(multimediaList.fulfilled, (state, action) => {
      state.loading = false;
      state.multimedias = action.payload;
      state.success = true;
    });
    builder.addCase(multimediaList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(multimediaUpdate.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(multimediaUpdate.fulfilled, (state, action) => {
      state.loading = false;
      state.multimediaInfo = action.payload;
      state.success = true;
    });
    builder.addCase(multimediaUpdate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(multimediaDelete.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(multimediaDelete.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const { id } = action.payload;
      if (id) {
        state.multimedias = state.multimedias.filter(
          (multimedia) => multimedia.id !== id
        );
      }
    });
    builder.addCase(multimediaDelete.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(multimediaCreate.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(multimediaCreate.fulfilled, (state, action) => {
      state.loading = false;
      state.multimediaInfo = action.payload;
      state.success = true;
    });
    builder.addCase(multimediaCreate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// export const {

// } = multimediaSlice.actions;
export default multimediaSlice.reducer;
