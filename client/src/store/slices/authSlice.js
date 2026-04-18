// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/api';

// // ─── Async thunks ─────────────────────────────────────────────────────────────
// export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
//   try {
//     const { data } = await api.post('/auth/login', credentials);
//     sessionStorage.setItem('accessToken', data.accessToken);
//     return data.user;
//   } catch (err) {
//     return rejectWithValue(err.response?.data?.message || 'Login failed');
//   }
// });

// export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
//   try {
//     const { data } = await api.post('/auth/register', userData);
//     return data;
//   } catch (err) {
//     return rejectWithValue(err.response?.data?.message || 'Registration failed');
//   }
// });

// export const logoutUser = createAsyncThunk('auth/logout', async () => {
//   await api.post('/auth/logout');
//   sessionStorage.removeItem('accessToken');
// });

// // ─── Slice ────────────────────────────────────────────────────────────────────
// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     isAuthenticated: false,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = !!action.payload;
//     },
//     clearError: (state) => { state.error = null; },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Logout
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//       });
//   },
// });

// export const { setUser, clearError } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
const storedUser = sessionStorage.getItem('authUser');
const initialUser = storedUser ? JSON.parse(storedUser) : null;
const storedToken = localStorage.getItem('token');

const persistAuthUser = (user) => {
  if (user) {
    sessionStorage.setItem('authUser', JSON.stringify(user));
    return;
  }

  sessionStorage.removeItem('authUser');
};

// ─── Async thunks ─────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token || data.accessToken);
    persistAuthUser(data.user);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});
// Add this thunk
export const googleLogin = createAsyncThunk('auth/google', async (token, { rejectWithValue }) => {
  try {
    localStorage.setItem('token', token);
    return { token };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('token');
  persistAuthUser(null);
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    isAuthenticated: !!storedToken && !!initialUser,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      persistAuthUser(action.payload);
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
