export interface Payload {
    userId: number;
    fullname: string;
    isSuperuser: boolean;
    // TODO: tipar el permiso
    permissions: any[];
  }