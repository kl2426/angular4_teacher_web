import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { _HttpClient } from '@delon/theme';



@Injectable()
//  考勤
export class BaseinfoService {

    constructor(
        private http: _HttpClient,
    ) {
        // 
    }





    /**
     * 手机号码查重
     * 
     */
    getMobiledUp(mobile:any) {
        return this.http.get('v1/sys/teachers/mobiledup',{
            mobile:mobile
        })
            .catch(this.handleError);
    }


    /**
     * 发送原手机号验证码
     * 
     */
    getMobilesms(mobile: any) {
        return this.http.get('v1/sys/teachers/mobilesms', {
            mobile: mobile
        })
            .catch(this.handleError);
    }



    /**
     * 修改手机号码
     * 
     */
    postMobile(mobile: any, verifyCode:any) {
        return this.http.post('v1/sys/teachers/mobile1', {
            mobile: mobile,
            verifyCode: verifyCode
        })
            .catch(this.handleError);
    }
















    /**
     * 上传头像
     * 
     */
    postUserHeader(form_data: any) {
        return this.http.post('v1/sys/teachers/profilephoto', form_data)
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
