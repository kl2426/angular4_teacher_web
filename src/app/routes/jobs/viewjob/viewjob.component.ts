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

import { ViewjobService } from './viewjob.service';

import { ClassroomtestService } from '../../classmanage/classroomtest/classroomtest.service';


declare let laydate;



@Component({
    selector: 'app-viewjob',
    templateUrl: './viewjob.component.html',
    styleUrls: ['./viewjob.component.less']
})
export class ViewjobComponent implements OnInit {

    constructor(
        public _ViewjobService: ViewjobService,
        public _ClassroomtestService: ClassroomtestService,
        private notification: NzNotificationService,
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
        //   作业类型
        type:[],
        //   作业详情
        info:{
            jobName: '',
            jobContent: '',
            jobAttachs:[],
        },
        //   列表表单
        form: {
            'pageNum': '1',
            'pageSize': '10',
            //
            'orgCode': '',
            'jobType': '',
            'jobName': '',
            'isAttach': '',
            'beginDate': (moment(new Date()).subtract(7, 'days')).format('YYYY-MM-DD'),
            'endDate': moment(new Date()).format('YYYY-MM-DD'),
            'date':''
        },
        //   资源列表
        res:{
            total: 0,
            //
            row: []
        },
    }


    //   获取班级
    private getClass() {
        //
        this._ClassroomtestService.getClass('3').subscribe((res) => {
            if (res.code === '0') {
                this.view_data.class = res.data;
            } else {
                this.view_data.class = [];
            }
        })
    }


    //   获取作业类型
    private getType() {
        //
        this._ViewjobService.getType().subscribe((res) => {
            if (res.code === '0') {
                this.view_data.type = res.data;
            } else {
                this.view_data.type = [];
            }
        })
    }

    //   查询列表
    List(){
        console.log(this.view_data)
        this.view_data.form = Object.assign({},this.view_data.form,this.validateForm.value);
        //  设置日期
        const date_len: HTMLInputElement = document.querySelector('#viewjob_date');
        if(date_len.value.length > 0){
            let temp_arr = date_len.value.split(' ');
            this.view_data.form.beginDate = temp_arr[0];
            this.view_data.form.endDate = temp_arr[2];
        }else{
            this.view_data.form.beginDate = '';
            this.view_data.form.endDate = '';
        }
        delete this.view_data.form.date;
        //
        this._ViewjobService.getList(this.view_data.form).subscribe((res) => {
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


    //   删除课程
    del_confirm(item:any){
        this._ViewjobService.delJobs(item.jobId).subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '删除成功');
                this.List();
            } else {
                this.notification.create('error', '失败', res.message);
            }
        });
    }

    


    //   取详情
    Info(id:any){
        this._ViewjobService.getInfo(id).subscribe((res) => {
            console.log(res)
            if (res.code === '0') {
                this.view_data.info = res.data;
                //   打开详情页
                this.step = 'info';
            } else {
                this.view_data.info = {
                    jobName: '',
                    jobContent: '',
                    jobAttachs: [],
                };
                this.message.create('warning', res.message);
            }
        })
    }

    //  返回
    click_back(){
        this.step = 'list';
        this.view_data.info = {
            jobName: '',
            jobContent: '',
            jobAttachs: [],
        };
    }










    ngOnInit() {
        //日期范围
        laydate.render({
            elem: '#viewjob_date', 
            range: true
        });
        //   取班级
        this.getClass();
        //   取作业类型
        this.getType();
        //
        this.validateForm = this.fb.group({
            orgCode: [''],
            jobType: [''],
            jobName: [''],
            isAttach: [''],
            date:[[this.view_data.form.beginDate,'-',this.view_data.form.endDate].join(' ')]
        });

        
    }

}
