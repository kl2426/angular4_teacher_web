import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ClassroomtestComponent } from './classroomtest/classroomtest.component';
import { ClassscheduleComponent } from './classschedule/classschedule.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { GroupmanageComponent } from './groupmanage/groupmanage.component';
import { ScoremanageComponent } from './scoremanage/scoremanage.component';
import { ClassreportComponent } from './classreport/classreport.component';

//   server
import { ClassroomtestService } from './classroomtest/classroomtest.service';
import { ClassscheduleService } from './classschedule/classschedule.service';
import { AttendanceService } from './attendance/attendance.service';
import { GroupmanageService } from './groupmanage/groupmanage.service';
import { ScoremanageService } from './scoremanage/scoremanage.service';
import { ClassreportService } from './classreport/classreport.service';

//   module
import { VoteModule } from '../vote/vote.module';

const COMPONENTS = [
    ClassroomtestComponent,
    ClassscheduleComponent,
    AttendanceComponent,
    GroupmanageComponent,
    ScoremanageComponent,
    ClassreportComponent,
];



@NgModule({
    imports: [SharedModule, VoteModule],
    providers: [
        ClassroomtestService,
        ClassscheduleService,
        AttendanceService,
        GroupmanageService,
        ScoremanageService,
        ClassreportService,
    ],
    declarations: [
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
    ]
})
export class ClassmanageModule { }
