import { Component, OnInit } from '@angular/core';
import { NzNotificationService, NzMessageService } from 'ng-zorro-antd';

import { SchoolnoticeService } from './schoolnotice.service';


@Component({
    selector: 'app-schoolnotice',
    templateUrl: './schoolnotice.component.html',
    styleUrls: ['./schoolnotice.component.less']
})
export class SchoolnoticeComponent implements OnInit {

    constructor(
        public _SchoolnoticeService: SchoolnoticeService,
        private message: NzMessageService,
    ) { }


    //   步骤
    step = 'list';

    view_data = {
        //   列表表单
        form: {
            'pageNum': '1',
            'pageSize': '10',
            //
            'seachTitle': '',
            'pubLevel': '1'
        },
        //   资源列表
        res:{
            total: 0,
            //
            row: []
        },
        //   详情
        info:{
            'title':'',
            'startDate':'',
            'content':'',
        },
    }




    //   查询列表
    List(){
        //
        this._SchoolnoticeService.getNoticesList(this.view_data.form).subscribe((res) => {
            if (res.code === '0') {
                this.view_data.res.row = res.data.list;
                this.view_data.res.total = res.data.total;
                this.view_data.form.pageNum = res.data.pageNum;
                this.view_data.form.pageSize = res.data.pageSize;
            } else {
                this.view_data.res.row = [];
                this.view_data.res.total = 0;
                this.view_data.form.pageNum = '1';
                this.message.create('warning', res.message);
            }
        })
    }


    //   分页
    page_change(e:any){
        this.view_data.form.pageNum = e;
        this.List();
    }

    //   分页
    size_change(e: any) {
        this.view_data.form.pageSize = e;
        this.List();
    }


    

    //   取详情
    Info(item: any) {
        this.view_data.info = item;
        //   打开详情页
        this.step = 'info';
    }

    //  返回
    click_back() {
        this.step = 'list';
    }








    ngOnInit() {
        //
        this.List();
    }

}
