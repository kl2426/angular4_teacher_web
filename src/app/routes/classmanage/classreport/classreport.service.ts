import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { _HttpClient } from '@delon/theme';


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
export class ClassreportService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }




    /**
     * 获取成绩列表
     * 
     */
    getClassReport(form:any) {
        return this.http.get('v1/class/assessments/classReport',form)
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
