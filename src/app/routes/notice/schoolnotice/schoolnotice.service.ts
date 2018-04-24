import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { _HttpClient } from '@delon/theme';




@Injectable()
//  首页服务
export class  SchoolnoticeService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }


    /**
     * 获取通知列表
     * 
     */
    getNoticesList(form:any) {
        return this.http.get('v1/sys/notices/', form)
            .catch(this.handleError);
    }




    //====================  add ====================

    /**
     * 发布类别(实时，定时)
     */
    getPub_type() {
        return this.http.get('v1/sys/dicts/type/pub_type')
            .catch(this.handleError);
    }


    /**
     * 发送方式(app,短信)
     */
    getSend_way() {
        return this.http.get('v1/sys/dicts/type/send_way')
            .catch(this.handleError);
    }

    /**
     * 公告类型(通知，公告)
     */
    getNotice_type() {
        return this.http.get('v1/sys/dicts/type/notice_type')
            .catch(this.handleError);
    }

    /**
     * 业务状态(编辑中)
     */
    getBusi_status() {
        return this.http.get('v1/sys/dicts/type/busi_status')
            .catch(this.handleError);
    }


    /**
     * 添加
     */
    postNotices(form:any) {
        return this.http.post('v1/sys/notices/',form)
            .catch(this.handleError);
    }





    //================== /add =======================






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
