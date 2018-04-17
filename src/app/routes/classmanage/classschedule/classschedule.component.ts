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

import { ClassscheduleService } from './classschedule.service';
import { ClassroomtestService } from '../classroomtest/classroomtest.service';


declare let laydate;



@Component({
    selector: 'app-classschedule',
    templateUrl: './classschedule.component.html',
    styleUrls: ['./classschedule.component.less']
})
export class ClassscheduleComponent implements OnInit {

    constructor(
        public _ClassscheduleService: ClassscheduleService,
        public _ClassroomtestService: ClassroomtestService,
        private notification: NzNotificationService,
        public _Injector: Injector,
        private fb: FormBuilder,
        private message: NzMessageService,
    ) { }

    //   课表上传 模板  地址
    classTemplateUrl = this._ClassscheduleService.classTemplateUrl;


    view_data = {
        //   班级
        class:[],
        //
        class_val:'',
        //   资源列表
        res:{
            total: 0,
            //
            row: []
        },
        //   一周开始日期，结束日期
        week:[],
        //
        week_val:'',
        //
        week_arr:[],
        // 课程表
        class_schedule:[]
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
                this.List();
            } else {
                this.view_data.class = [];
            }
        })
    }


    //   取指定日期的周的开始日期再结束日期
    private getDateWeek(day:any) {
        let weekOfday = moment(day).format('E');//计算今天是这周第几天  
        let last_monday = moment(day).subtract(+weekOfday - 1, 'days').format('YYYY-MM-DD');//周一日期 
        let last_sunday = moment(day).subtract(+weekOfday - 7, 'days').format('YYYY-MM-DD');//周日日期  
        return [last_monday, last_sunday];
    }



    //   查询列表
    List(){
        //
        this._ClassscheduleService.getCourseList(this.view_data.class_val, this.view_data.week[0], this.view_data.week[1]).subscribe((res) => {
            console.log(res)
            if (res.code === '0') {
                this.view_data.class_schedule = res.data;
                //   合并上午下午
                let temp_obj = {};
                for(let item of this.view_data.class_schedule){
                    let period_number = 0;
                    if(item[0].period in temp_obj){
                        temp_obj[item[0].period].push(item);
                    }else{
                        temp_obj[item[0].period] = [item];
                    }
                }
                for(let i in temp_obj){
                    for(let item of this.view_data.class_schedule){
                        if (i === item[0].period){
                            item[0].period_number = temp_obj[i].length;
                            break;
                        }
                    }
                }
                //
                console.log(this.view_data.class_schedule)
            } else {
                this.notification.create('error', '失败', res.message);
            }
        })
    }

    //   上一周 ， 下一周
    switch_week(str:any){
        switch (str) {
            case 'prev':
                //   上一周
                this.view_data.week = this.getDateWeek(moment(this.view_data.week[0]).subtract(1, 'days'));
                break;
            case 'next':
                //   下一周
                this.view_data.week = this.getDateWeek(moment(this.view_data.week[0]).subtract(-7, 'days'));
                break;
        }
        //
        this.view_data.week_arr = [{
            val: this.view_data.week.join('-'),
            name: this.view_data.week.join('-')
        }];
        this.view_data.week_val = this.view_data.week_arr[0].val;
        
        console.log(this.view_data);
        //   查询数据
        this.List();

    }


    //  班级选择
    classChange(e:any){
        console.log(e)
        this.List();
    }



    










    ngOnInit() {
        //日期范围
        laydate.render({
            elem: '#viewjob_date', 
            range: true
        });
        //   取班级
        this.getClass();
        //
        this.view_data.week = this.getDateWeek(new Date());
        this.view_data.week_arr = [{
            val: this.view_data.week.join('-'),
            name: this.view_data.week.join('-')
        }];
        this.view_data.week_val = this.view_data.week_arr[0].val;
        //
        console.log(this.view_data);

        
    }

}
