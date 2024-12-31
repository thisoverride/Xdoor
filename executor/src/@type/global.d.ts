export interface UserRegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  rebirth_id: string;
  password: string;
  date_of_birth: string; // Format de date : 'DD/MM/YYYY'
}
