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

import { AttendanceService } from '../attendance/attendance.service';
import { ClassroomtestService } from '../classroomtest/classroomtest.service';
import { ClassscheduleService } from '../classschedule/classschedule.service';

declare let laydate;


@Component({
    selector: 'app-classroomtest',
    templateUrl: './classroomtest.component.html',
    styleUrls: ['../attendance/attendance.component.less']
})
export class ClassroomtestComponent implements OnInit {

    constructor(
        public _AttendanceService: AttendanceService,
        public _ClassroomtestService: ClassroomtestService,
        public _ClassscheduleService: ClassscheduleService,
        private notification: NzNotificationService,
        public _Injector: Injector,
        private fb: FormBuilder,
        private message: NzMessageService,
    ) { }

    listOfOption = [];
    listOfTagOptions = [];


    view_data = {
        //   班级
        class: [],
        class_item: {},
        //
        class_val: '',
        //   今日课程
        schedule:[],
        schedule_val:'',
        //  form
        form: {
            assesDate: moment(new Date()).format('YYYY-MM-DD'),
            courses:{
                courseId:''
            },
            reason:'',
            score:0,
            studentList:[],
        },
        //   资源列表
        res: {
            total: 0,
            //
            row: []
        },
        res_row:{
            //   table 是否全选
            allChecked: false,
            //  checkbox indeterminate 状态
            indeterminate: false,
            //   选中数量
            checkedNumber: 0,
        },
        //   打分缘由
        score_reason: [],
        score_reason_select:[],

        //   打分加减分
        add_min_socre: [],
        add_min_socre_select:[]
    }

    //   弹窗
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
                if (res.data.length > 0) {
                    this.view_data.class_val = this.view_data.class[0].orgCode;
                }
                //
                this.CourseList();
            } else {
                this.view_data.class = [];
                this.view_data.schedule = [];
            }
        })
    }
    



    //  缘由
    private getScore() {
        this._ClassroomtestService.getScore_reason().subscribe((res) => {
            if (res.code === '0') {
                this.view_data.score_reason = res.data;
            } else {
                this.view_data.score_reason = [];
                // this.notification.create('error', '失败', res.message);
            }
        });
    }

    //  加减分
    private getAdd_min_socre() {
        this._ClassroomtestService.getAdd_min_socre().subscribe((res) => {
            if (res.code === '0') {
                this.view_data.add_min_socre = res.data;
            } else {
                this.view_data.add_min_socre = [];
                // this.notification.create('error', '失败', res.message);
            }
        });
    }



    //   获取今日课程
    private CourseList() {
        //
        this._ClassscheduleService.getCourseList(this.view_data.class_val, this.view_data.form.assesDate, this.view_data.form.assesDate).subscribe((res) => {
            console.log(res)
            if (res.code === '0') {
                this.view_data.schedule = [];
                this.view_data.schedule_val = '';
                for(let i of res.data){
                    for(let ii = 0; ii < i.length; ii++){
                        if (ii === 0 && i[ii].id && i[ii].id.length > 0){
                            this.view_data.schedule.push(i[ii]);
                        }
                    }
                }
                console.log(this.view_data.schedule)
                //   默认课程
                this.view_data.schedule_val = this.view_data.schedule.length > 0 ? this.view_data.schedule[0].id : '';
                //
                this.view_data.form.courses.courseId = this.view_data.schedule_val;
                //
                if(this.view_data.schedule_val.length > 0){
                	this.List();
                }else{
                	this.message.create('warning', '查无课程数据');
                }
            } else {
                this.view_data.schedule = [];
            }
        })
    }



    //   查询列表
    List() {
        //
        this._ClassroomtestService.getAssessments(this.view_data.class_val, this.view_data.form.assesDate, this.view_data.schedule_val).subscribe((res) => {
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
    classChange(e: any) {
        this.view_data.class_val = e;
        const items = this.view_data.class.filter(item => item.orgCode === e);
        if (items.length > 0) {
            this.view_data.class_item = items[0];
        }
        // this.List();
        this.CourseList();
    }

    //  课程选择
    scheduleChange(e:any){
        this.view_data.schedule_val = e;
        //
        this.view_data.form.courses.courseId = this.view_data.schedule_val;
        this.List();
        // this.CourseList();
    }


    refreshStatus(): void {
        const allChecked = this.view_data.res.row.every(value => value.checked === true);
        const allUnChecked = this.view_data.res.row.every(value => !value.checked);
        this.view_data.res_row.allChecked = allChecked;
        this.view_data.res_row.indeterminate = (!allChecked) && (!allUnChecked);
        this.view_data.res_row.checkedNumber = this.view_data.res.row.filter(value => value.checked).length;
    }

    checkAll(value: boolean): void {
        this.view_data.res.row.forEach(data => data.checked = value);
        this.refreshStatus();
    }


    //  打开弹窗
    click_classroomtest(){
        this.refreshStatus();
        if(!(this.view_data.res_row.checkedNumber > 0)){
            this.message.create('warning', '请选择');
            return false;
        }
        //
        this.modal_attendance.isVisibleMiddle = true;
    }


    //   打分
    edit_attendance(){
        let temp_score_arr = [];
        //   缘由选中项
        for(let val of this.view_data.score_reason_select){
            for(let item of this.view_data.score_reason){
                if (val === item.dictCode){
                    temp_score_arr.push(item.dictName);
                }
            }
        }
        //
        this.view_data.form.reason = temp_score_arr.join(',');
        //  选中学生
        const temp_list = this.view_data.res.row.filter(value => value.checked);
        this.view_data.form.studentList = [];
        for(let item of temp_list){
            this.view_data.form.studentList.push({
                studentCode: item.studentCode,
                studentName: item.studentName
            });
        }
        //
        this._ClassroomtestService.postAssessments(this.view_data.form).subscribe((res) => {
            if (res.code === '0') {
                this.List();
                this.notification.create('success', '成功', '打分成功');
                this.modal_attendance.isVisibleMiddle = false;
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
                this.view_data.form.assesDate = value;
                //  查询
                //  this.List();
                this.CourseList();
            }

        });
        //   取班级
        this.getClass();
        //
        this.getScore();
        this.getAdd_min_socre();
        

    }

}
