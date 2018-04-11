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
export class DecoratejobService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }


    //   上传文件地址
    upfilePath = environment.SERVER_URL + 'v1/jobattachs/uploadAttachment';



    /**
     * 获取班级
     * 
     */
    getClass(level: any) {
        return this.http.get('v1/sys/orgs/getClass', {
            level: level,
        })
            .catch(this.handleError);
    }


    /**
     * 获取作业类型
     * 
     */
    getType() {
        return this.http.get('v1/sys/dicts/type/job_type')
            .catch(this.handleError);
    }


    /**
     * 获取学科
     * 
     */
    getSubject() {
        return this.http.get('v1/sys/dicts/type/subject')
            .catch(this.handleError);
    }



    /**
     * 获取试卷列表
     * 
     */
    getPapers(pageNum:any, pageSize:any, dirId:any, paperType:any) {
        return this.http.get('v1/resource/papers/',{
            pageNum: pageNum,
            pageSize: pageSize,
            dirId: dirId,
            paperType: paperType,
        })
            .catch(this.handleError);
    }


    

    /**
     * 发布作业
     * 
     */
    postJobs(obj:any) {
        return this.http.post('v1/jobs/', obj)
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
