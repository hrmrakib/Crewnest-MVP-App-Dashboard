export interface CustomUser {
  id: string;
  full_name: string | null;
  email: string;
  work_email?: string | null;
  role?: string;
  language?: string | null;
  profession?: string | null;
  airline?: string | null;
  city?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
  profile_picture?: string | null;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
  total_booking?: number | string;
  upcoming_booking?: number | string;
  completed_booking?: number | string;
  total_earning?: number | string;
  current_balance?: number | string;
  rating?: number | string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access: string;
  refresh: string;
  user: CustomUser;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  data?: LoginResponseData;
  access?: string;
  refresh?: string;
  token?: string;
  tokens?: {
    access: string;
    refresh: string;
  };
  user?: CustomUser;
  id?: string;
  full_name?: string | null;
  email?: string;
  role?: string;
  profile_picture?: string | null;
  errors?: Record<string, string[] | string>;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | string>;
}

export interface VerifyForgotPasswordOTPRequest {
  email: string;
  otp_code: string;
}

export interface VerifyForgotPasswordOTPResponse {
  success: boolean;
  message: string;
  token?: string;
  access?: string;
  errors?: Record<string, string[] | string>;
}

export interface ResetPasswordRequest {
  new_password: string;
  confirm_password: string;
  email?: string;
  token?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | string>;
}

export interface LogoutRequest {
  refresh?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
}
