export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    tenantId: string;
    token: string;
    role: string;
  }
  