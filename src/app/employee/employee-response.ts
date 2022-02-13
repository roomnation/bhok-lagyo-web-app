import { AuthResponse } from "../auth/auth-response";

export interface EmployeeResponse {
    count?: number,
    values?: AuthResponse[]
}
