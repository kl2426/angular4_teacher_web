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
export class ViewjobService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }

    /**
     * 获取班级
     * 
     */
    getClass(level: any) {
        return this.http.get('/v1/sys/orgs/getClass', {
            level: level,
        })
            .catch(this.handleError);
    }


    /**
     * 获取作业类型
     * 
     */
    getType() {
        return this.http.get('/v1/sys/dicts/type/job_type')
            .catch(this.handleError);
    }


    /**
     * 获取作业列表
     * 
     */
    getList(form:any) {
        return this.http.get('/v1/jobs/getJobList',form)
            .catch(this.handleError);
    }


    /**
     * 获取作业详情
     * 
     */
    getInfo(jobId: any) {
        return this.http.get('/v1/jobs/' + jobId)
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
