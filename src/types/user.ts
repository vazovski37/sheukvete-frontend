export interface UserLogin {
    username: string;
    password: string;
  }
  
  export interface User {
    role: string;
    token: string;
  }
  
export interface UserS {
  id: number;
  username: string;
  role: string; // Add other roles as needed
  active: boolean;
}
