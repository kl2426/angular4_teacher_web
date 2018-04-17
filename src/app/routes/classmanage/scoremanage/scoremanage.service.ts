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
export class ScoremanageService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }


    //   下载上传课表 的 模板地址
    examsTemplateUrl = environment.SERVER_URL + 'v1/class/exams/export';



    /**
     * 获取成绩列表
     * 
     */
    getExamlist(form:any) {
        return this.http.get('v1/class/exams/getexamlist',form)
            .catch(this.handleError);
    }



    /**
     * 获取成绩详情
     * 
     */
    getScoredetail(id: any) {
        return this.http.get('v1/class/exams/scoredetail/' + id)
            .catch(this.handleError);
    }


    /**
     * 删除成绩
     * 
     */
    getDelete(id: any) {
        return this.http.get('v1/class/exams/delete/' + id)
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
