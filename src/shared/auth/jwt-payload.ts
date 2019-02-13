import { UserRole } from "src/user/models/user-role.enum";

export interface JwtPayload {
    id: string;
    iat?: Date;
}