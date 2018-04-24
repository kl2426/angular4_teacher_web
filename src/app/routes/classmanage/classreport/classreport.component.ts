import { Component, OnInit, Injector } from '@angular/core';
import { NzNotificationService, NzModalService, NzMessageService } from 'ng-zorro-antd';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import * as moment from 'moment';

import { ClassreportService } from './classreport.service';

import { ClassroomtestService } from '../../classmanage/classroomtest/classroomtest.service';


declare let laydate;



@Component({
    selector: 'app-classreport',
    templateUrl: './classreport.component.html',
    styleUrls: ['./classreport.component.less']
})
export class ClassreportComponent implements OnInit {

    constructor(
        public _ClassreportService: ClassreportService,
        public _ClassroomtestService: ClassroomtestService,
        public _Injector: Injector,
        private fb: FormBuilder,
        private message: NzMessageService,
    ) { }

    validateForm: FormGroup;
    //   步骤
    step = 'list';

    view_data = {
        //   班级
        class:[],
        //
        class_val:'',
        //   考试名称
        examName:'',
        //   列表表单
        form: {
            'pageNum': '1',
            'pageSize': '100',
            //
            'orgCode': '',
            'assesDate': moment(new Date()).format('YYYY-MM-DD'),
        },
        //   资源列表
        res:{
            total: 0,
            //
            row: []
        },
        table:{
            allChecked:false,
            indeterminate:false
        }
    }


    //   获取班级
    private getClass() {
        //
        this._ClassroomtestService.getClass('3').subscribe((res) => {
            if (res.code === '0') {
                this.view_data.class = res.data;
                //  设置默认值
                this.view_data.form.orgCode = this.view_data.class.length > 0 ? this.view_data.class[0].orgCode : '';
                //
                this.List();
            } else {
                this.view_data.class = [];
            }
        })
    }



    //   查询列表
    List(){
        //
        this._ClassreportService.getClassReport(this.view_data.form).subscribe((res) => {
            if (res.code === '0') {
                this.view_data.res.row = res.data;
            } else {
                this.view_data.res.row = [];
                this.message.create('warning', res.message);
            }
        })
    }



    //
    classChange(e:any){
        this.view_data.form.orgCode = e;
        this.List();
    }



    

    //   取详情
    Info(id: any) {
        // this._ViewjobService.getInfo(id).subscribe((res) => {
        //     console.log(res)
        //     if (res.code === '0') {
        //         this.view_data.info = res.data;
        //         //   打开详情页
                this.step = 'info';
        //     } else {
        //         this.view_data.info = {
        //             jobName: '',
        //             jobContent: '',
        //             jobAttachs: [],
        //         };
        //         this.message.create('warning', res.message);
        //     }
        // })
    }

    //  返回
    click_back() {
        this.step = 'list';
    }










    ngOnInit() {
        //日期范围
        laydate.render({
            elem: '#viewjob_date', 
            done: (value, date, endDate) => {
                this.view_data.form.assesDate = value;
                this.List();
            }
        });
        //   取班级
        this.getClass();
        
    }

}
