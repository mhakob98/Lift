// Angular Core Modules
import { NgModule } from '@angular/core';
import { DirectRoutingModule } from './direct.routing.module';
import { CommonModule } from '@angular/common';
import { AppModule } from '../../../../../../app.module';
import { environment } from '../../../../../../../environments/environment';
import { MessageItemComponent } from './components';
// 3rd part libraries
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../../core/services/auth.service';
import { MessagingService } from './messaging.service';
import { SharedModule } from '../../../shared/shared.module';


const config: SocketIoConfig = {
    url: environment.socketUrl, options: {
        query: `accessToken=${AppModule.injector.get(CookieService).get('accessToken')}&loginId=103`
    }
};
@NgModule({
    declarations: [
        DirectRoutingModule.components,
        MessageItemComponent,
    ],
    imports: [
        DirectRoutingModule,
        CommonModule,
        SocketIoModule.forRoot(config),
        SharedModule
    ],
    providers: [
        MessagingService
    ],
})
export class DirectModule { }