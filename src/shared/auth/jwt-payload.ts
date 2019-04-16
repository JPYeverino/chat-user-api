import { UserRole } from "../../user/models/user-role.enum";

export interface JwtPayload {
    id: string;
    iat?: Date;
}