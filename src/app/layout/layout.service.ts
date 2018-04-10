import { Injectable, Inject, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';


export interface resData {
    code: string;
    data: any;
}



@Injectable()


//  公共部请求类
export class LayoutService {

    constructor(
        private http: _HttpClient, 
        // private injector: Injector
    ) {
        // 
    }

    /**
     * 取头登录信息
     */
    getUserInfo() {
        return new Observable((observer) => {
            const res:resData = {
                'code': '0',
                'data': JSON.parse(localStorage.getItem('userInfo'))
            }
            observer.next(res);
            observer.complete();
        });
    }

    /**
     * 取头部菜单
     */
    getMenu(){
        return new Observable((observer) => {
            const res = {
                'code': '0',
                'data': JSON.parse(localStorage.getItem('menus'))
            }
            observer.next(res);
            observer.complete();
        });
    }

    /**
     * 取版权信息
     */
    getCopyright() {
        return new Observable((observer) => {
            const res = {
                'code': '0',
                'data': '新云网科技有限公司'
            }
            observer.next(res);
            observer.complete();
        });
    }




    // /**
    //  * 取卡列表
    //  */
    // getCardList(obj: any) {
    //     // fix laster version
    //     // const temp_obj = {'id': obj.Id};
    //     return this.http.post('/tm/usercardlist', obj)
    //         .catch(this.handleError);
    // }

    // /**
    //  * 删除卡用户
    //  */
    // CardDel( Id = '', Cardcode = '') {
    //     let temp_obj = {};
    //     if (Cardcode.toString().length > 0) {
    //         temp_obj = { 'Cardcode': Cardcode };
    //     }
    //     if (Id.toString().length > 0) {
    //         temp_obj = {'Id': Id};
    //     }

    //     return this.http.post('/tm/usercarddel', temp_obj)
    //         .catch(this.handleError);
    // }

    // /**
    //  * 添加用户
    //  * @param Cardcode {string} - 用户卡号
    //  * @param Username {string} - 用户姓名
    //  */
    // CardAdd(Cardcode, Username) {
    //     return this.http.post('/tm/usercarding', {'Cardcode': Cardcode, 'Username': Username})
    //         .catch(this.handleError);
    // }
    
    // /**
    //  * 读取卡号
    //  */
    // getDeviceCardId() {
    //     return this.http.get('/assets/json/devicecardid.json')
    //         .catch(this.handleError);
    // }


    // /**
    //  * 充值
    //  */
    // checking(obj) {
    //     if ('Paycheckmoney' in obj) {
    //         obj.Paycheckmoney = +((+obj.Paycheckmoney).toFixed(2));
    //         obj.Surplusmoney = +((+obj.Surplusmoney).toFixed(2));
    //     }
    //     return this.http.post('/tm/paychecking', { 'Id': obj.Id, Cardcode: obj.Cardcode, Paycheckmoney: obj.Paycheckmoney, Surplusmoney: obj.Surplusmoney, Code: '0100' })
    //         .catch(this.handleError);
    // }

    

    // /**
    //  * 充值记录查询
    //  */
    // paychecklist(obj: any) {
    //     if ('Id' in obj) {
    //         obj.Id = undefined;
    //     }
    //     return this.http.post('/tm/paychecklist', obj)
    //         .catch(this.handleError);
    // }



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
