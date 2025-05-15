
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: 'intern' | 'tutor' | 'hr' | 'finance' | 'admin';
  avatar_url?: string;
  department?: string;
  position?: string;
  phone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO extends LoginDTO {
  name: string;
  role: 'intern' | 'tutor';
}
