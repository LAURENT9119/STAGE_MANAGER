
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: 'stagiaire' | 'tuteur' | 'RH' | 'finance' | 'administrateur';
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
  role: 'stagiaire' | 'tuteur';
}
