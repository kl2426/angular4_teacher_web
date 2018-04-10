import { Component, OnInit, Injector } from '@angular/core';
import { LayoutService } from '../../layout.service';
import { Router } from '@angular/router';


import { TokenService } from './../../../core/net/token.service';


export interface resData {
    code: string;
    data: any;
}




@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']

})



export class HeaderComponent implements OnInit {
    //
    constructor(
        public _LayoutService: LayoutService,
        private router: Router,
        private injector: Injector,

    ) { }

    view_data = {
        menu:null,
    }

    //  取菜单 
    getMenu(){
        this._LayoutService.getMenu().subscribe((res:resData) => {
            console.log(res);
            if(res.code === '0'){
                this.view_data.menu = res.data;
                this.view_data.menu[0].active = true;
                this.view_data.menu[0].children[0].active = true;
            }
        })
    }


    //  点击菜单切换
    click_menu(item:any){
        //   清除
        for(let i of this.view_data.menu){
            i.active = false;
        }
        item.active = true;
    }

    //   点击菜单
    // click_nav(item:any){
    //     //   选中
    //     // for(let i of this.view_data.menu){
    //     //     if(i.active === true){
    //     //         for(let ii of i.children){
    //     //             if (item.id === ii.id){
    //     //                 ii.active = true;
    //     //             }else{
    //     //                 ii.active = false;
    //     //             }
    //     //         }
    //     //     }
    //     // }
    //     //
    //     if (item.link && item.link.length > 0){
    //         this.router.navigate([item.link]);
    //     }
    // }

    loginout(){
        this.injector.get(TokenService).logout();
    }

    
    ngOnInit() {
        //   查询列表
        this.getMenu();

    }


}
