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
//  云盘
export class MycloudplateService {

    //   上传文件地址
    upfilePath = environment.SERVER_URL + 'v1/sys/cdfiles/upload';
    //   下载文件地址
    downFilePath = environment.SERVER_URL + 'v1/sys/cdfiles/download';


    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }

    /**
     * 查询云盘是否激活
     */
    getCheckRootIsActivit() {
        return this.http.get('v1/sys/cddirs/checkRootIsActivit')
            .catch(this.handleError);
    }
    
    
    /**
     * 激活云盘
     */
    getInitRootDir() {
        return this.http.get('v1/sys/cddirs/initRootDir')
            .catch(this.handleError);
    }
    
    
    /**
     * 激活云盘
     */
    getList(dirId:any) {
        return this.http.get('v1/sys/cddirs/list',{
        	dirId:dirId
        })
            .catch(this.handleError);
    }


    /**
     * 云盘新建文件夹
     */
    postCddirs(dirName: any, pDirId:any) {
        return this.http.post('v1/sys/cddirs/', {
            dirName: dirName,
            pDirId: pDirId,
        })
            .catch(this.handleError);
    }

    /**
     * 云盘删除文件/文件夹
     */
    postDelete(idList: any) {
        return this.http.post('v1/sys/cdfiles/delete', {
            idList: idList
        })
            .catch(this.handleError);
    }


    /**
     * 云盘重命名文件/文件夹
     */
    postRename(id: any, type:any, name:any, pId:any) {
        return this.http.get('v1/sys/cdfiles/rename', {
            id: id,
            type: type,
            name: name,
            pId: pId,
        })
            .catch(this.handleError);
    }


    /**
     * 下载文件
     */
    getFile(id_arr:any) {
        return this.http.get('v1/sys/cdfiles/download', {
            fileIds: id_arr.join(',')
        })
            .catch(this.handleError);
    }


    /**
     * 移动文件
     */
    getMove(id_arr: any,dirId:any) {
        return this.http.get('v1/sys/cdfiles/move', {
            fileIds: id_arr.join(','),
            dirId: dirId
        })
            .catch(this.handleError);
    }


    /**
     * 云盘目录树
     */
    getTree() {
        return this.http.get('v1/sys/cddirs/dirTree')
            .catch(this.handleError);
    }









    /**
     * 上传文件
     */
    postupload(dirName: any, pDirId: any) {
        return this.http.post('v1/sys/cddirs/upload', {
            dirName: dirName,
            pDirId: pDirId,
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
