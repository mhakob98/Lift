// Angular Core Modules
import { NgModule } from '@angular/core';
import { DirectRoutingModule } from './direct.routing.module';
import { CommonModule } from '@angular/common';
import { AppModule } from '../../../../../../app.module';
import { environment } from '../../../../../../../environments/environment';

// 3rd part libraries
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../../core/services/auth.service';
import { MessagingService } from './messaging.service';


const config: SocketIoConfig = {
    url: environment.socketUrl, options: {
        query: `accessToken=${AppModule.injector.get(CookieService).get('accessToken')}&loginId=74`
    }
};
@NgModule({
    declarations: [
        DirectRoutingModule.components,
    ],
    imports: [
        DirectRoutingModule,
        CommonModule,
        SocketIoModule.forRoot(config)
    ],
    providers: [
        MessagingService
    ],
})
export class DirectModule { }