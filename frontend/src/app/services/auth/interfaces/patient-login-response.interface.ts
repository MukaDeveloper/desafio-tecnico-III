export interface IPatientLoginResponse {
  accessToken: string;
  expiresIn: number;
  expiresAt: string;
  userSystemId: string;
  userSystemName: string;
  userSystemEmail: string;
}
