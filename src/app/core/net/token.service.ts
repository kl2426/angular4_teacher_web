import { Injectable } from '@angular/core';
import { TokenData } from './token.type';

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




@Injectable()
export class TokenService {

    /**
     * 设置cookie
     */
    private setCookie(cname: string, cvalue: string, seconds: number) {
        var d = new Date();
        d.setTime(d.getTime() + (seconds * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    /**
     * 获取cookie
     */
    private getCookie(cname:string) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }

    /**
     * 清除cookie
     */
    private clearCookie(name: string) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
    }




    /**
     * 保存
     */
    set accessToken(accessToken: string) {
        this.setCookie('accessToken', accessToken, 60 * 30);
    }

    /**
     * 获取
     */
    get accessToken(): string {
        return this.getCookie('accessToken') as string;
    }

    /**
     * 保存
     */
    set refreshToken(refreshToken: string) {
        this.setCookie('refreshToken', refreshToken, 60 * 30);
    }

    /**
     * 获取
     */
    get refreshToken(): string {
        return this.getCookie('refreshToken') as string;
    }

    logout() {
        this.clearCookie('accessToken');
        this.clearCookie('refreshToken');
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
