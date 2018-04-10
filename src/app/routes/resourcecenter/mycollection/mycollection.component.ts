import { Component, OnInit, Injector } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';

import { MycollectionService } from './mycollection.service';
import { toTreeData, dgTree } from 'app/utils/tree';






@Component({
    selector: 'app-mycollection',
    templateUrl: './mycollection.component.html',
    styleUrls: ['./mycollection.component.less']
})
export class MycollectionComponent implements OnInit {

    constructor(
        public _MycollectionService: MycollectionService,
        public _Injector: Injector,
        private notification: NzNotificationService,
    ) { }

    view_data = {
        //   云资源类别
        resource_type:[],
        //   列表表单
        form: {
            'pageNum': '1',
            'pageSize': '16',
            'dirId': '',
            'resType': '',
            'fileType': '1',
            'source': ''
        },
        //   资源列表
        res:{
            total: 0,
            //
            row: []
        }
    }


    //   取收藏夹
    getFavors(){
        this._MycollectionService.getFavors('420967025452650498', '').subscribe((res) => {
            if (res.code === '0') {
                
            } else if (res.code === '50009'){
                this.notification.create('warning', '警告','找不到学生信息');
            } else {

            }
        })
    }



    allChecked = false;
    indeterminate = false;
    displayData = [];
    data = [
        {
            name: '小学语文阅读理解解题技巧.doc',
            age: 32,
            address: 'New York No. 1 Lake Park',
            checked: false,
            disabled: false
        },
        {
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            checked: false,
            disabled: false
        },
        {
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            checked: false,
            disabled: false
        },
        {
            name: 'Disabled User',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            checked: false,
            disabled: true
        }
    ];

    currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
        this.displayData = $event;
        this.refreshStatus();
    }

    refreshStatus(): void {
        const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
        const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }

    checkAll(value: boolean): void {
        this.displayData.forEach(data => {
            if (!data.disabled) {
                data.checked = value;
            }
        });
        this.refreshStatus();
    }
    

    click_nav(e:any){}




    ngOnInit() {
        //  获取收藏夹
        this.getFavors();
        //  

        
    }

}
