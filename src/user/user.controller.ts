import { Controller, Post, HttpStatus, Body, HttpException, Get, Response, UseGuards, Req, Res, Query } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiImplicitQuery, ApiBadRequestResponse } from '@nestjs/swagger';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { UserVm } from './models/view-models/user-vm.model';
import { apiException } from 'src/shared/api-exception.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
import { RegisterVm } from './models/view-models/register-vm.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { AuthGuard } from '@nestjs/passport';
import { NotiApiService } from 'src/shared/noti-api/noti-api.service';
import { map } from 'rxjs/operators';

@Controller()
@ApiUseTags(User.modelName)
export class UserController {
    constructor(
        private readonly _userService: UserService,
        private readonly _notiService: NotiApiService
    ) { }

    @Post('register')
    @ApiResponse({ status: HttpStatus.CREATED, type: UserVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'register'))
    async register(@Body() registerVm: RegisterVm): Promise<any> {
        const { username, password } = registerVm;

        if (!username) {
            throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
        }

        if (!password) {
            throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
        }

        let exist;
        try {
            exist = await this._userService.findOne({ username });
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (exist) {
            throw new HttpException(`${username} exists`, HttpStatus.BAD_REQUEST);
        }

        const newUser = await this._userService.register(registerVm);
        const newUserVm = await this._userService.map<UserVm>(newUser);
        return await this._notiService.createNotiApiUser(newUserVm);
    }

    @Post('login')
    @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'login'))
    async login(@Body() loginVm: LoginVm, @Res() resp): Promise<any> {
        const fields = Object.keys(loginVm);
        fields.forEach(field => {
            if (!loginVm[field]) {
                throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
            }
        });

        const loginResponseVm: LoginResponseVm = await this._userService.login(loginVm);
        return resp.cookie("SESSIONID", loginResponseVm.token, { httpOnly: true }).end();
    }

    @Get('auth') // Get a user ID at a response from another service.
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: HttpStatus.OK, type: LoginResponseVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'auth'))
    async auth(@Req() req) {
        try {
            return this._userService.getResFromCookie(req.cookies['SESSIONID']);
        } catch (e) {
            throw new HttpException('unauthorized', HttpStatus.BAD_REQUEST);
        }

    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: UserVm })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException })
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

    @Get('users-list')
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({ type: UserVm, isArray: true })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'usersList'))
    @ApiImplicitQuery({ name: 'search', type: String, required: false, })
    async getFilteredUsers(@Req() req, @Query() searchInput: string) {
        try {
            const usersList = await this._userService.getUsersList(searchInput);
            return await this._userService.map<UserVm[]>(usersList.map(user => user.toJSON()));
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('contacts')
    @ApiOkResponse({ type: UserVm })
    @ApiBadRequestResponse({ type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'user'))
    async contact(@Body() contactId: string[]) {
        try {
            const contactsList = await this._userService.findAll({ _id: { $in: contactId } });
            return await this._userService.map<UserVm[]>(contactsList.map(contact => contact.toJSON()));
            // return await this._userService.map<UserVm>(user.map(user => user.toJSON()));
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
