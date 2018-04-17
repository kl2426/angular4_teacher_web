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
//  首页服务
export class ClassscheduleService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }


    //   下载上传课表 的 模板地址
    classTemplateUrl = environment.SERVER_URL + 'v1/class/courses/export';



    // /**
    //  * 获取班级
    //  * 
    //  */
    // getClass(level: any) {
    //     return this.http.get('v1/sys/orgs/getClass', {
    //         level: level,
    //     })
    //         .catch(this.handleError);
    // }


    /**
     * 获取课表
     * 
     */
    getCourseList(classCode: any, beginDate: any, endDate:any) {
        return this.http.get('v1/class/courses/getcourselist', {
            classCode: classCode,
            beginDate: beginDate,
            endDate: endDate,
        })
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
