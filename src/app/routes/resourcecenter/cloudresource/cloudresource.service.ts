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
export class CloudresourceService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }

    /**
     * 获取资源目录
     * 
     */
    getResource(dirCode: string, level: string, pDirId: string) {
        return this.http.get('/v1/resource/dirs', {
            dirCode: dirCode,
            level: level,
            pDirId: pDirId,
        })
            .catch(this.handleError);
    }


    /**
     * 获取云资源类别
     * 
     */
    getResourceType(dictType: string) {
        return this.http.get('/v1/sys/dicts/type/' + dictType)
            .catch(this.handleError);
    }


    /**
     * 获取资源列表
     * 
     */
    getResourceCloudfiles(obj: ResourceCloudfiles) {
        return this.http.get('/v1/resource/cloudfiles', obj)
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
