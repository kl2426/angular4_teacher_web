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
//  收藏 接口
export class MycollectionService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }

    /**
     * 获取学生收藏夹
     */
    getFavors(studentId: string, favorId:string) {
        return this.http.get('v1/sys/parents/child/' + studentId + '/favors',{
            favorId: favorId
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
