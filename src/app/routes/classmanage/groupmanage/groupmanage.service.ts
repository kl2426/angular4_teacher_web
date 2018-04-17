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
export class GroupmanageService {

    constructor(
        private http: _HttpClient,
        // private injector: Injector
    ) {
        // 
    }



    /**
     * 获取分组列表
     * 
     */
    getGroups(orgCode: any) {
        return this.http.get('v1/class/groups/', {
            orgCode: orgCode,
        })
            .catch(this.handleError);
    }


    /**
     * 获取分组学生列表
     * 
     */
    getStudentList(orgCode: any) {
        return this.http.get('v1/class/groups/studentList', {
            orgCode: orgCode,
        })
            .catch(this.handleError);
    }


    /**
     * 添加新小组
     * 
     */
    postGroups(groupName: any, orgCode:any, groupMembers:any) {
        return this.http.post('v1/class/groups/', {
            groupName: groupName,
            orgCode: orgCode,
            groupMembers: groupMembers
        })
            .catch(this.handleError);
    }


    /**
     * 解散分组
     * 
     */
    getDelGroups(groupId: any) {
        return this.http.get('v1/class/groups/delete/' + groupId)
            .catch(this.handleError);
    }


    /**
     * 取微调分组数据
     * 
     */
    getGrouplist(orgCode: any) {
        return this.http.get('v1/class/groups/grouplist', {
            orgCode: orgCode,
        })
            .catch(this.handleError);
    }


    /**
     * 保存微调分组
     * 
     */
    postAddgrouplist(orgCode: any, groupList:any) {
        return this.http.post('v1/class/groups/addgrouplist', {
            orgCode: orgCode,
            groupList: groupList,
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
