import { ApiModelPropertyOptional } from "@nestjs/swagger";

export class apiException {
    @ApiModelPropertyOptional() statusCode?:number;
    @ApiModelPropertyOptional() message?:string;
    @ApiModelPropertyOptional() status?:string;
    @ApiModelPropertyOptional() error?:string;
    @ApiModelPropertyOptional() timestamp?:string;
    @ApiModelPropertyOptional() path?:string;
}