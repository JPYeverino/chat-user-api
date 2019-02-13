import { BaseModelVm } from "src/shared/base.model";
import { UserRole } from "../user-role.enum";
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { EnumToArray } from "src/shared/utilities/enum-to-array";

export class UserVm extends BaseModelVm {
    @ApiModelProperty() username: string;
    @ApiModelPropertyOptional() firstName?: string;
    @ApiModelPropertyOptional() lastName?: string;
    @ApiModelPropertyOptional() fullName?: string;
    @ApiModelPropertyOptional() avatarUrl?: string;
    @ApiModelPropertyOptional({enum: EnumToArray(UserRole)})role?: UserRole;
}