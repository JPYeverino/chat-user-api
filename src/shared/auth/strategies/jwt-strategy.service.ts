import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { ConfigurationService } from '../../../shared/configuration/configuration.service';
import { Configuration } from '../../configuration/configuration.enum';
import { JwtPayload } from '../jwt-payload';



@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
    constructor(
        private readonly _authService: AuthService,
        private readonly _configurationService: ConfigurationService
    ) { 
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: _configurationService.get(Configuration.JWT_KEY)
        });
    }

    async validate(payload: JwtPayload, done: VerifiedCallback) {
        const user = await this._authService.validatePayload(payload);
        if(!user) {
            return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
        }

        return done(null, user, payload.iat);
    }
}

let cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies['SESSIONID'];
    }
    return token;
};
