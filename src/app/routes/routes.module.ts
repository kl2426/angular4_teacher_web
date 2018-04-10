import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { UserLockComponent } from './passport/lock/lock.component';
import { CallbackComponent } from './callback/callback.component';
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

@NgModule({
    imports: [SharedModule, RouteRoutingModule, VoteModule, JobsModule],
    declarations: [
        DashboardV1Component,
        DashboardAnalysisComponent,
        DashboardMonitorComponent,
        DashboardWorkplaceComponent,
        // passport pages
        UserLoginComponent,
        UserRegisterComponent,
        UserRegisterResultComponent,
        // single pages
        UserLockComponent,
        CallbackComponent,
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
