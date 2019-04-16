import { Injectable } from '@nestjs/common';
import { Configuration } from './configuration.enum';
import { get } from 'config';

@Injectable()
export class ConfigurationService {
    
    private environmentHosting: string = process.env.NODE_ENV || 'development';
    static noti_api_url: string = get(Configuration.NOTI_API);

    get(name: string): string {
        console.log(name, get(name));
        return process.env[name] || get(name)
    }

    get isDevelopment(): boolean {
        return this.environmentHosting === 'development';
    }
}
