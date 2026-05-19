export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    xp: number;
    level: number;
    streak: number;
  };
}

export interface RefreshTokenDto {
  refreshToken: string;
}
