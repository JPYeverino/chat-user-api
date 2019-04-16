import { Injectable, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { BaseService } from '../shared/base.service';
import { RegisterVm } from './models/view-models/register-vm.model';
import { genSalt, hash, compare } from 'bcryptjs';
import { AuthService } from '../shared/auth/auth.service';
import { LoginVm } from './models/view-models/login-vm.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { JwtPayload } from '../shared/auth/jwt-payload';
import { UserVm } from './models/view-models/user-vm.model';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
        private readonly _mapperService: MapperService,
        @Inject(forwardRef(() => AuthService)) readonly _authService: AuthService
    ) {
        super();
        this._model = _userModel;
        this._mapper = _mapperService.mapper;
    }

    async register(registerVm: RegisterVm) {
        const AVATAR_URL = 'https://api.adorable.io/avatars/125';
        const { username, password, firstName, lastName } = registerVm;

        const newUser = new this._model();
        newUser.username = username;
        newUser.avatarUrl = `${AVATAR_URL}/${newUser.id}`;
        newUser.language = `en`;

        const salt = await genSalt(10);
        newUser.password = await hash(password, salt);
        try {
            const result = await this.create(newUser);
            return result.toJSON() as User;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(loginVm: LoginVm): Promise<LoginResponseVm> {
        const { username, password } = loginVm;

        const user = await this.findOne({ username });
        if(!user) {
            throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
        }

        const isMatch = await compare(password, user.password);

        if(!isMatch) {
            throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
        }

        const payload: JwtPayload = {
            id: user.id
        };
        const token = await this._authService.signPayload(payload);
        const userVm: UserVm = await this.map<UserVm>(user.toJSON());

        return {
            token,
            user: userVm
        }
    }

    async getResFromCookie(cookie: string) {
        return this._authService.legit(cookie);
    }

    async getUser(cookie: string) {

        const decoded = await this._authService.legit(cookie);
        
        try {
            const result = await this.findById(decoded['id']);
            return result;
            
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUsersList(searchInput: string) {
        
        try {
            
            const search = searchInput['search'].toString();
            const result = await this.findAll({username: new RegExp(search, "gi")});
            
            return result;
            
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

