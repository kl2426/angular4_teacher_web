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
export class ClassroomtestService {

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
     * 获取学生列表
     * 
     */
    getAssessments(orgCode: any, assesDate: any, courseId:any) {
        return this.http.get('v1/class/assessments/', {
            orgCode: orgCode,
            assesDate: assesDate,
            courseId: courseId
        })
            .catch(this.handleError);
    }


    /**
     * 获取缘由
     * 
     */
    getScore_reason() {
        return this.http.get('v1/sys/dicts/type/score_reason')
            .catch(this.handleError);
    }


    /**
     * 获取加减分
     * 
     */
    getAdd_min_socre() {
        return this.http.get('v1/sys/dicts/type/add_min_socre')
            .catch(this.handleError);
    }



    /**
     * 打分
     * 
     */
    postAssessments(form:any) {
        return this.http.post('v1/class/assessments/', form)
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
