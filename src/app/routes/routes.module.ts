import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { UserLockComponent } from './passport/lock/lock.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';

//   Cloudresource
import { CloudresourceComponent } from './resourcecenter/cloudresource/cloudresource.component';
import { SchoolresourceComponent } from './resourcecenter/schoolresource/schoolresource.component';
import { MycollectionComponent } from './resourcecenter/mycollection/mycollection.component';
import { MycloudplateComponent } from './resourcecenter/mycloudplate/mycloudplate.component';

//   server
import { CloudresourceService } from './resourcecenter/cloudresource/cloudresource.service';
import { MycollectionService } from './resourcecenter/mycollection/mycollection.service';
import { MycloudplateService } from './resourcecenter/mycloudplate/mycloudplate.service';

//   module
import { VoteModule } from './vote/vote.module';
import { JobsModule } from './jobs/jobs.module';
import { ClassmanageModule } from './classmanage/classmanage.module';
import { PersoncenterModule } from './personcenter/personcenter.module';
import { NoticeModule } from './notice/notice.module';

@NgModule({
    imports: [SharedModule, RouteRoutingModule, VoteModule, JobsModule, ClassmanageModule, PersoncenterModule, NoticeModule],
    declarations: [
        // passport pages
        UserLoginComponent,
        UserRegisterComponent,
        UserRegisterResultComponent,
        // single pages
        UserLockComponent,
        Exception403Component,
        Exception404Component,
        Exception500Component,
        
        // index
        CloudresourceComponent,
        SchoolresourceComponent,
        MycollectionComponent,
        MycloudplateComponent,
    ],
    providers: [
        CloudresourceService,
        MycollectionService,
        MycloudplateService,
    ]
})

export class RoutesModule {}
