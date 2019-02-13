import { Controller, Post, HttpStatus, Body, HttpException, Get, Response, UseGuards, Req, Res } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { UserVm } from './models/view-models/user-vm.model';
import { apiException } from 'src/shared/api-exception.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
import { RegisterVm } from './models/view-models/register-vm.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@ApiUseTags(User.modelName)
export class UserController {
    constructor(private readonly _userService: UserService) { }

    @Post('register')
    @ApiResponse({ status: HttpStatus.CREATED, type: UserVm})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException})
    @ApiOperation(GetOperationId(User.modelName, 'register'))
    async register(@Body() registerVm: RegisterVm): Promise<UserVm> {
        const {username, password} = registerVm;

        if(!username) {
            throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
        }

        if(!password) {
            throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
        }

        let exist;
        try {
            exist = await this._userService.findOne({username});
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if(exist) {
            throw new HttpException(`${username} exists`, HttpStatus.BAD_REQUEST);
        }

        const newUser = await this._userService.register(registerVm);
        return this._userService.map<UserVm>(newUser);
    }

    @Post('login')
    @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseVm})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException})
    @ApiOperation(GetOperationId(User.modelName, 'login'))
    async login(@Body() loginVm: LoginVm, @Res() resp): Promise<any> {
        const fields = Object.keys(loginVm);
        fields.forEach(field => {
            if(!loginVm[field]) {
                throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
            }
        });
        
        const loginResponseVm: LoginResponseVm =  await this._userService.login(loginVm);
        resp.cookie("SESSIONID", loginResponseVm.token, {httpOnly: true}).end();
            
        // return this._userService.login(loginVm);
    }

    @Get('auth') // Get a user ID at a response from another service.
    @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: HttpStatus.OK, type: LoginResponseVm})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException})
    @ApiOperation(GetOperationId(User.modelName, 'auth'))
    async auth(@Req() req) {
        return this._userService.getResFromCookie(req.cookies['SESSIONID']);
    }

    @Get('/profile')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: UserVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException})
    @ApiOperation(GetOperationId(User.modelName, 'getUser'))
    async getUser(@Req() req) {
        const jwt = req.cookies['SESSIONID'];

        try {
            const actualUser = await this._userService.getUser(jwt);
            return this._userService.map<UserVm>(actualUser.toJSON());
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);            
        }
    }


}
