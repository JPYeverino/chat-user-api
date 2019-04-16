import { Injectable, HttpService } from '@nestjs/common';
import { UserVm } from '../../user/models/view-models/user-vm.model';
import { map, tap } from 'rxjs/operators';
import { ConfigurationService } from '../configuration/configuration.service';
import { RegisterVm } from 'user/models/view-models/register-vm.model';

@Injectable()
export class NotiApiService {
    constructor(
        private readonly http: HttpService
    ) { }

    createNotiApiUser(user) {

        const notiApiUrl = ConfigurationService.noti_api_url;
        console.log(user);
        // return this.http.get(notiApiUrl).pipe(
        //     tap(response => console.log(response)),
        //     map(response => response.data)
        // ).toPromise();

        return this.http.post(notiApiUrl + '/noti-user/save-user', user)
            .pipe(
                map(response => response.data)
            )
            .toPromise();
    }
}
