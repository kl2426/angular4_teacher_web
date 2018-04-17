import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
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
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';

//   Cloudresource  资源中心
import { CloudresourceComponent } from './resourcecenter/cloudresource/cloudresource.component';
import { SchoolresourceComponent } from './resourcecenter/schoolresource/schoolresource.component';
import { MycollectionComponent } from './resourcecenter/mycollection/mycollection.component';
import { MycloudplateComponent } from './resourcecenter/mycloudplate/mycloudplate.component';

//   jobs  作业 
import { ViewjobComponent } from './jobs/viewjob/viewjob.component';
import { DecoratejobComponent } from './jobs/decoratejob/decoratejob.component';

//  classmanage  班级管理
import { ClassroomtestComponent } from './classmanage/classroomtest/classroomtest.component';
import { ClassscheduleComponent } from './classmanage/classschedule/classschedule.component';
import { AttendanceComponent } from './classmanage/attendance/attendance.component';
import { GroupmanageComponent } from './classmanage/groupmanage/groupmanage.component';
import { ScoremanageComponent } from './classmanage/scoremanage/scoremanage.component';
import { ClassreportComponent } from './classmanage/classreport/classreport.component';


const routes: Routes = [
    {
        path: 'resourcecenter',
        component: LayoutDefaultComponent,
        children: [
            { path: '', redirectTo: 'cloudresource', pathMatch: 'full' },
            { path: 'cloudresource', component: CloudresourceComponent, data: { title: '云资源'}  },
            { path: 'schoolresource', component: SchoolresourceComponent, data: { title: '校本资源' } },
            { path: 'mycloudplate', component: MycloudplateComponent, data: { title: '我的云盘' } },
            { path: 'mycollection', component: MycollectionComponent, data: { title: '我的收藏' } },
            // { path: 'dashboard', redirectTo: 'dashboard/v1', pathMatch: 'full' },
            { path: 'dashboard/v1', component: DashboardV1Component },
            { path: 'dashboard/analysis', component: DashboardAnalysisComponent },
            { path: 'dashboard/monitor', component: DashboardMonitorComponent },
            { path: 'dashboard/workplace', component: DashboardWorkplaceComponent },
            { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' },
            { path: 'style', loadChildren: './style/style.module#StyleModule' },
            { path: 'delon', loadChildren: './delon/delon.module#DelonModule' },
            { path: 'extras', loadChildren: './extras/extras.module#ExtrasModule' },
            { path: 'pro', loadChildren: './pro/pro.module#ProModule' }
        ]
    },
    // 作业
    {
        path: 'jobs',
        component: LayoutDefaultComponent,
        children: [
            { path: '', redirectTo: 'viewjob', pathMatch: 'full' },
            { path: 'viewjob', component: ViewjobComponent, data: { title: '作业查看' } },
            { path: 'decoratejob', component: DecoratejobComponent, data: { title: '布置作业' } },
        ]
    },
    // 班级管理
    {
        path: 'classmanage',
        component: LayoutDefaultComponent,
        children: [
            { path: '', redirectTo: 'classschedule', pathMatch: 'full' },
            { path: 'classschedule', component: ClassscheduleComponent, data: { title: '课程表' } },
            { path: 'classroomtest', component: ClassroomtestComponent, data: { title: '课堂考评' } },
            { path: 'attendance', component: AttendanceComponent, data: { title: '考勤' } },
            { path: 'groupmanage', component: GroupmanageComponent, data: { title: '分组管理' } },
            { path: 'scoremanage', component: ScoremanageComponent, data: { title: '成绩管理' } },
            { path: 'classreport', component: ClassreportComponent, data: { title: '班级报表' } },
        ]
    },





    // // 全屏布局
    // {
    //     path: 'data-v',
    //     component: LayoutFullScreenComponent,
    //     children: [
    //         { path: '', loadChildren: './data-v/data-v.module#DataVModule' }
    //     ]
    // },
    // // passport
    // {
    //     path: 'passport',
    //     component: LayoutPassportComponent,
    //     children: [
    //         { path: 'login', component: UserLoginComponent },
    //         { path: 'register', component: UserRegisterComponent },
    //         { path: 'register-result', component: UserRegisterResultComponent }
    //     ]
    // },
    // 单页不包裹Layout
    { path: 'callback/:type', component: CallbackComponent },
    { path: 'lock', component: UserLockComponent, data: { title: '锁屏', titleI18n: 'lock' } },
    { path: '403', component: Exception403Component },
    { path: '404', component: Exception404Component },
    { path: '500', component: Exception500Component },
    { path: '**', redirectTo: 'resourcecenter' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
    exports: [RouterModule]
  })
export class RouteRoutingModule { }
