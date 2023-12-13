export interface UserDTO {
    dni: string;
    email: string;
    firstName: string;
    lastName: string;
    isSuperuser: boolean;
    permissions: number[];
    rols: number[];
  }