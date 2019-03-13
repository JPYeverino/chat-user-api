import { Injectable, HttpService } from '@nestjs/common';
import { UserVm } from 'src/user/models/view-models/user-vm.model';
import { map } from 'rxjs/operators';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable()
export class NotiApiService {
    constructor(
        private readonly http: HttpService
    ) { }

    createNotiApiUser(user: any) {
        const { _id, username } = user;
        const notiApiUrl = ConfigurationService.noti_api_url;

        return this.http.post(notiApiUrl + '/noti-user/save-user', user)
            .pipe(
                map(response => response.data)
            );
    }
}
