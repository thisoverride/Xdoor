export interface UserAttributes {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
  rebirth_id: string;
  password: string;
  email: string;
  profile_pic?: string;
  date_of_birth: Date; 
  banner?: string;
  citation?: string;
  is_confirmed?: boolean;
}
