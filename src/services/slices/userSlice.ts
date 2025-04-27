import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  type TLoginData,
  type TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { type TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type userState = {
  isUserCheckInProgress: boolean;
  user: TUser | null;
  error: string | null;
};

const initialUserState: userState = {
  isUserCheckInProgress: false,
  user: null,
  error: null
};

const handleAuthSuccess = (state: userState, payload: { 
  user: TUser; 
  accessToken: string; 
  refreshToken: string 
}) => {
  state.user = payload.user;
  setCookie('accessToken', payload.accessToken);
  localStorage.setItem('refreshToken', payload.refreshToken);
  state.isUserCheckInProgress = false;
  state.error = null;
};

const handleAuthFailure = (state: userState, error: string) => {
  state.isUserCheckInProgress = false;
  state.error = error;
};

export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchGetUser = createAsyncThunk(
  'user/get',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchLogoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchLoginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      return await loginUserApi(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUpdateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(user);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isUserCheckInProgress = true;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, { payload }) => {
        handleAuthSuccess(state, payload);
      })
      .addCase(fetchRegisterUser.rejected, (state, { payload }) => {
        handleAuthFailure(state, payload as string);
      })

      // Получение данных пользователя
      .addCase(fetchGetUser.pending, (state) => {
        state.isUserCheckInProgress = true;
      })
      .addCase(fetchGetUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isUserCheckInProgress = false;
        state.error = null;
      })
      .addCase(fetchGetUser.rejected, (state, { payload }) => {
        handleAuthFailure(state, payload as string);
      })

      // Выход
      .addCase(fetchLogoutUser.pending, (state) => {
        state.isUserCheckInProgress = true;
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.user = null;
        state.isUserCheckInProgress = false;
        state.error = null;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(fetchLogoutUser.rejected, (state, { payload }) => {
        handleAuthFailure(state, payload as string);
      })

      // Вход
      .addCase(fetchLoginUser.pending, (state) => {
        state.isUserCheckInProgress = true;
      })
      .addCase(fetchLoginUser.fulfilled, (state, { payload }) => {
        handleAuthSuccess(state, payload);
      })
      .addCase(fetchLoginUser.rejected, (state, { payload }) => {
        handleAuthFailure(state, payload as string);
      })

      // Обновление данных
      .addCase(fetchUpdateUser.pending, (state) => {
        state.isUserCheckInProgress = true;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isUserCheckInProgress = false;
        state.error = null;
      })
      .addCase(fetchUpdateUser.rejected, (state, { payload }) => {
        handleAuthFailure(state, payload as string);
      });
  }
});

export default userSlice.reducer;