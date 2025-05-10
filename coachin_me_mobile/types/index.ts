export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  dateNaissance: string;
  telephone: string;
  adresse: string;
  genre: 'homme' | 'femme' | 'autre';
  photo: string;
  statut: string;
  situation_familliale: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}