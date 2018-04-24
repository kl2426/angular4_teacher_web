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
export class ChangepasswordService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }



    /**
     * 获取修改密码验证码
     * 
     */
    getPasswordsms() {
        return this.http.get('v1/sys/teachers/passwordsms')
            .catch(this.handleError);
    }


    /**
     * 修改密码
     * 
     */
    postPassword(oldPassword: any, password: any, verifyCode:any) {
        return this.http.post('v1/sys/teachers/password',{
            oldPassword: oldPassword,
            password: password,
            verifyCode: verifyCode,
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
