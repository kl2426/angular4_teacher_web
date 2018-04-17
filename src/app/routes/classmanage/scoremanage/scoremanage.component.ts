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

import { ScoremanageService } from './scoremanage.service';

import { ClassroomtestService } from '../../classmanage/classroomtest/classroomtest.service';


declare let laydate;



@Component({
    selector: 'app-scoremanage',
    templateUrl: './scoremanage.component.html',
    styleUrls: ['./scoremanage.component.less']
})
export class ScoremanageComponent implements OnInit {

    constructor(
        public _ScoremanageService: ScoremanageService,
        public _ClassroomtestService: ClassroomtestService,
        private notification: NzNotificationService,
        public _Injector: Injector,
        private fb: FormBuilder,
        private message: NzMessageService,
    ) { }

    validateForm: FormGroup;

    //   成绩导入 模板  地址
    examsTemplateUrl = this._ScoremanageService.examsTemplateUrl;
    //   步骤
    step = 'list';

    view_data = {
        //   班级
        class:[],
        //   考试名称
        examName:'',
        //   列表表单
        form: {
            'pageNum': '1',
            'pageSize': '10',
            //
            'classCode': '',
            'examName': '',
            'beginDate': (moment(new Date()).subtract(7, 'days')).format('YYYY-MM-DD'),
            'endDate': moment(new Date()).format('YYYY-MM-DD'),
            'date': ''
        },
        //   资源列表
        res:{
            total: 0,
            //
            row: []
        },
        //   详情
        info:[],
        info_title:'',
        //
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
                this.view_data.form.classCode = this.view_data.class.length > 0 ? this.view_data.class[0].orgCode : '';
                console.log(this.view_data.form)
                //
                this.List();
            } else {
                this.view_data.class = [];
            }
        })
    }



    //   查询列表
    List(){
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
        //
        this._ScoremanageService.getExamlist(this.view_data.form).subscribe((res) => {
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


    refreshStatus(): void {
        const allChecked = this.view_data.res.row.filter(value => !value.disabled).every(value => value.checked === true);
        const allUnChecked = this.view_data.res.row.filter(value => !value.disabled).every(value => !value.checked);
        this.view_data.table.allChecked = allChecked;
        this.view_data.table.indeterminate = (!allChecked) && (!allUnChecked);
    }

    checkAll(value: boolean): void {
        this.view_data.res.row.forEach(data => {
            if (!data.disabled) {
                data.checked = value;
            }
        });
        this.refreshStatus();
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


    //  删除
    del_score(item:any){
        console.log(item)
        this._ScoremanageService.getDelete(item.examId).subscribe((res) => {
            if (res.code === '0') {
                this.List();
                this.notification.create('success', '成功', '打分成功');
            } else {
                this.notification.create('error', '失败', res.message);
            }
        });
    }

    

    //   取详情
    Info(item: any) {
        this.view_data.info_title = item.examName;
        this._ScoremanageService.getScoredetail(item.examId).subscribe((res) => {
            if (res.code === '0') {
                this.view_data.info = res.data;
                //   打开详情页
                this.step = 'info';
            } else {
                this.view_data.info = [];
                this.message.create('warning', res.message);
            }
        })
    }

    //  返回
    click_back() {
        this.step = 'list';
    }








    ngOnInit() {
        //日期范围
        laydate.render({
            elem: '#viewjob_date', 
            range: true
        });
        //   取班级
        this.getClass();
        this.view_data.form.date = this.view_data.form.beginDate + ' - ' + this.view_data.form.endDate;
        
    }

}
