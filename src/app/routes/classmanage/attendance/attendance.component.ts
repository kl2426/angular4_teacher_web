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

import { AttendanceService } from './attendance.service';
import { ClassroomtestService } from '../classroomtest/classroomtest.service';

declare let laydate;


@Component({
    selector: 'app-attendance',
    templateUrl: './attendance.component.html',
    styleUrls: ['./attendance.component.less']
})
export class  AttendanceComponent implements OnInit {

    constructor(
        public _AttendanceService: AttendanceService,
        public _ClassroomtestService: ClassroomtestService,
        private notification: NzNotificationService,
        public _Injector: Injector,
        private fb: FormBuilder,
        private message: NzMessageService,
    ) { }


    view_data = {
        //   班级
        class:[],
        class_item:{
            'orgName':''
        },
        //
        class_val:'',
        //   考勤状态
        type:[],
        //  form
        form:{
            tsId:'',
            tsDate: moment(new Date()).format('YYYY-MM-DD'),
            studentCode:'',
            studentName:'',
            tsType:'',
        },
        //   资源列表
        res:{
            total: 0,
            //
            row: []
        },
    }

    //  状态颜色
    color_arr = {
        '缺勤': '#ff4c6a',
        '迟到': '#ffd513',
        '早退': '#ca1bea',
        '请假': '#00b7ee',
        '出勤': '#80c269'
    }
    


    //   考勤弹窗
    modal_attendance = {
        isVisibleTop: false,
        isVisibleMiddle: false
    }


    //   获取班级
    private getClass() {
        //
        this._ClassroomtestService.getClass('3').subscribe((res) => {
            if (res.code === '0') {
                this.view_data.class = res.data;
                //   默认班级
                if(res.data.length > 0){
                    this.view_data.class_val = this.view_data.class[0].orgCode;
                }
                //
                this.getType();
            } else {
                this.view_data.class = [];
            }
        })
    }


    //   获取考勤状态
    private getType() {
        //
        this._AttendanceService.getTs_type().subscribe((res) => {
            if (res.code === '0') {
                this.view_data.type = res.data;
                for(let item of this.view_data.type){
                    for(let item2 in this.color_arr){
                        if (item.dictName === item2){
                            item.color = this.color_arr[item2];
                        }
                    }
                }
                // 默认值
                this.view_data.form.tsType = this.view_data.type.length > 0 ? this.view_data.type[0].dictCode : '';
                //  list
                this.List();
            } else {
                this.view_data.type = [];
                this.notification.create('error', '失败', res.message);
            }
        })
    }




    //   查询列表
    List(){
        //
        this._AttendanceService.getTslist(this.view_data.class_val, this.view_data.form.tsDate).subscribe((res) => {
            console.log(res)
            if (res.code === '0') {
                this.view_data.res.row = res.data;
            } else {
                this.view_data.res.row = [];
                this.notification.create('error', '失败', res.message);
            }
        })
    }


    //  班级选择
    classChange(e:any){
        this.view_data.class_val = e;
        const items = this.view_data.class.filter(item => item.orgCode === e);
        if(items.length > 0){
            this.view_data.class_item = items[0];
        }
        this.List();
    }

    //   学生点击
    click_pro(item:any){
        this.view_data.form.tsId = item.tsId;
        this.view_data.form.studentName = item.studentName;
        this.view_data.form.studentCode = item.studentCode;
        //
        this.modal_attendance.isVisibleMiddle = true;
    }


    //   修改考勤
    edit_attendance(){
        this._AttendanceService.postCourses(this.view_data.form).subscribe((res) => {
            console.log(res)
            if (res.code === '0') {
                this.modal_attendance.isVisibleMiddle = false;
                //
                this.view_data.res.row.forEach( item => {
                    if (item.studentCode === res.data.studentCode){
                        item.tsType = res.data.tsType;
                    }
                });
                //this.List();
            } else {
                this.notification.create('error', '失败', res.message);
            }
        });
    }



    ngOnInit() {
        //日期范围
        laydate.render({
            elem: '#viewjob_date', 
            done: (value, date, endDate) => {
                this.view_data.form.tsDate = value;
                //  查询
                this.List();
            }

        });
        //   取班级
        this.getClass();
        
        
    }

}
