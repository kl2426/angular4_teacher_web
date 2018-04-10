import { Component, OnInit, Injector } from '@angular/core';
import { CloudresourceService } from '../cloudresource/cloudresource.service';
import { toTreeData, dgTree } from 'app/utils/tree';


import { TokenService } from '../../../core/net/token.service';





@Component({
    selector: 'app-schoolresource',
    templateUrl: '../cloudresource/cloudresource.component.html',
    styleUrls: ['../cloudresource/cloudresource.component.less']
})
export class SchoolresourceComponent implements OnInit {

    constructor(
        public _CloudresourceService: CloudresourceService,
        public _Injector: Injector,
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



    //   获取云资源类别
    private getResourceType() {
        //
        this._CloudresourceService.getResourceType('res_type').subscribe((res) => {
            if (res.code === '0') {
                this.view_data.resource_type = res.data;
            } else {

            }
        })
    }


    //   取资源列表
    private getList() {
        this._CloudresourceService.getResourceCloudfiles(this.view_data.form).subscribe((res) => {
            if (res.code === '0') {
                this.view_data.res.row = res.data.list;
                this.view_data.res.total = res.data.total;
                this.view_data.form.pageNum = res.data.pageNum;
                this.view_data.form.pageSize = res.data.pageSize;
            } else {
                this.view_data.res.row = [];
                this.view_data.res.total = 0;
                this.view_data.form.pageNum = '1';
            }
        })

    }






    //    树点击
    click_nav(dirId:any){
        console.log(dirId)
        //  dirId
        this.view_data.form.dirId = dirId;
        //   查询列表
        this.getList();
    }

    //   table change
    click_table(e:any){
        if(e.index === 0){
            this.view_data.form.resType = '';
        }else{
            this.view_data.form.resType = this.view_data.resource_type[e.index - 1].id;
        }
        //  查询
        this.getList();
    }

    //  
    click_page(e: any){
        this.view_data.form.pageNum = e;
        this.getList();
    }


    






    ngOnInit() {
        //  获取云资源类别
        this.getResourceType();
        //  

        
    }

}
