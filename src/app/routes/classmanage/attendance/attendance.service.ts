import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { _HttpClient } from '@delon/theme';

import { environment } from '@env/environment';


export interface ResourceCloudfiles {
    pageNum: string;
    pageSize: string;
    dirId: string;
    resType: string;
    fileType: string;
    source: string;
    [key:string]: any;
}



@Injectable()
//  考勤
export class AttendanceService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }



    /**
     * 获取学生列表
     * 
     */
    getTslist(orgCode: any, tsDate) {
        return this.http.get('v1/class/timesheets/gettslist',{
            orgCode:orgCode,
            tsDate:tsDate
        })
            .catch(this.handleError);
    }


    /**
     * 获取考勤状态
     * 
     */
    getTs_type() {
        return this.http.get('v1/sys/dicts/type/ts_type')
            .catch(this.handleError);
    }

    /**
     * 修改学生考勤
     * 
     */
    postCourses(form:any) {
        return this.http.post('v1/class/timesheets/updatets',form)
            .catch(this.handleError);
    }








    /**
     * 
     * @param error 
     */
    handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }




}
