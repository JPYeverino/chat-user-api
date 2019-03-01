import { BaseModelVm } from "src/shared/base.model";
import { UserRole } from "../user-role.enum";
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { EnumToArray } from "src/shared/utilities/enum-to-array";

export class UserVm extends BaseModelVm {
    @ApiModelProperty() username: string;
    @ApiModelPropertyOptional() avatarUrl: string;
    @ApiModelPropertyOptional() language: string;
    
} 