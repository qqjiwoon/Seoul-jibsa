export interface User {
  accessToken: string;
  userName: string;
  userRole: string;
}

export interface RecoverIdRequest {
  email: string;
}

export interface RecoverIdResponse {
  loginId: string;
  message?: string;
}

export interface ApiErrorResponse {
  code?: string;
  message?: string;
}

export interface RecoverPasswordEmailRequest {
  loginId: string;
  email: string;
}

export interface RecoverPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
