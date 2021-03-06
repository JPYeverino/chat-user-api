import 'automapper-ts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MapperService {

    mapper: AutoMapperJs.AutoMapper;

    constructor() {
        this.mapper = automapper;
        this.initializeMapper();
    }

    private initializeMapper(): void {
        this.mapper.initialize(MapperService.configure);
    }

    private static configure(config: AutoMapperJs.IConfiguration): void {
        config
            .createMap('User', 'UserVm')
            .forSourceMember('password', opts => opts.ignore());
        
        config
            .createMap('User[]', 'UserVm[]')
            .forSourceMember('password', opts => opts.ignore());

        // config
        //     .createMap('Todo', 'TodoVm')
        //     .forSourceMember('_id', opts => opts.ignore());
        // config
        //     .createMap('Todo[]', 'TodoVm[]')
        //     .forSourceMember('_id', opts => opts.ignore());
    }
}