import { Injectable } from '@angular/core';
import { TokenData } from './token.type';
import { CookieService } from 'ngx-cookie-service';

/** 存储键 */
const ATOKEN = '_accessToken';
const USER_INFO = '_user_info';
/**
 * 基于Token认证，在前后端分离非常普通，本身只提供一个接口的形式展示如果优雅处理HTTP请求
 */


 
/**
* 树缓存结构
*/
export interface inResourceTree {
    //   完整树
    tree: any;
    //   到班级树
    grade: any;
    //   选中班级
    class: any;
    //   nav
    chapter:any;
    //   nav 选中
    item:any;
    [key: string]: any;
}


/**
* 用户信息
*/
export interface interfaceUserInfo {
    //   姓名
    name: string;
    //   手机
    mobile: string;
    [key: string]: any;
}



@Injectable()
export class TokenService {

    constructor(private cookieService: CookieService) { }



    /**
     * 保存
     */
    set accessToken(accessToken: string) {
        this.cookieService.set('accessToken', accessToken, 30 );
    }

    /**
     * 获取
     */
    get accessToken(): string {
        return this.cookieService.get('accessToken') as string;
    }

    /**
     * 保存
     */
    set refreshToken(refreshToken: string) {
        this.cookieService.set('refreshToken', refreshToken, 30);
    }

    /**
     * 获取
     */
    get refreshToken(): string {
        return this.cookieService.get('refreshToken') as string;
    }

    logout() {
        this.cookieService.delete('accessToken');
        this.cookieService.delete('refreshToken');
        //
        localStorage.removeItem(ATOKEN);
        localStorage.removeItem('menus');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('_resourceTree');
        console.log('logout');
        window.location.href = '/index.html';

    }








    /**
     * 设置资源树缓存
     */
    set resourceTree(resourceTree: inResourceTree) {
        let cache = [];
        localStorage.setItem('_resourceTree', JSON.stringify(resourceTree, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }));
    }
    /**
     * 获取资源树缓存
     */
    get resourceTree(): inResourceTree {
        return (JSON.parse(localStorage.getItem('_resourceTree') || '{}') || {}) as inResourceTree;
    }



    /**
     * 设置
     */
    set userInfo(obj: interfaceUserInfo) {
        localStorage.setItem('userInfo', JSON.stringify(obj));
    }

    /**
     * 获取
     */
    get userInfo(): interfaceUserInfo {
        return (JSON.parse(localStorage.getItem('userInfo') || '{}') || {}) as interfaceUserInfo;
    }









    /**
     * 保存用户账号信息用于重新登录
     */
    set user(obj: any) {
        localStorage.setItem(USER_INFO, JSON.stringify(obj));
    }
    /**
     * 获取用户账号信息用于重新登录
     */
    get user(): any {
        return (JSON.parse(localStorage.getItem(USER_INFO) || '{}') || {}) as any;
    }
}
