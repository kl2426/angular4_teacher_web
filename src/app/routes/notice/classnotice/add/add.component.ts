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
import * as UEdit from 'wangeditor';

import { DecoratejobService } from '../../../jobs/decoratejob/decoratejob.service';
import { ClassroomtestService } from '../../../classmanage/classroomtest/classroomtest.service';
import { SchoolnoticeService } from '../../schoolnotice/schoolnotice.service';


declare let laydate;



@Component({
    selector: 'app-classnotice-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.less']
})
export class ClassnoticeAddComponent implements OnInit {

    constructor(
        public _DecoratejobService: DecoratejobService,
        public _ClassroomtestService: ClassroomtestService,
        public _SchoolnoticeService: SchoolnoticeService,
        private notification: NzNotificationService,
        public _Injector: Injector,
        private fb: FormBuilder,
        private message: NzMessageService,
    ) { }

    validateForm: FormGroup;
    //   步骤
    step = 'list';

    //   富文本框
    uedit = null;

    view_data = {
        //   班级
        class:[],
        class_item:{},
        //   发送类别
        pub_type:[],
        pub_type_item:{},
        //   发送方式
        send_way:[],
        send_way_item:{},
        //   公告类型(通知，公告)
        notice_type:[],
        notice_type_item:{},
        //
        busi_status:[],
        busi_status_item:{},
        //   表单
        form: {
            'noticeId': '',
            'noticeNo': '',
            'title': '',
            'pubType': 'pub_type',
            'pubDate': moment(new Date()).format('YYYY-MM-DD h:mm:ss'),
            'sendWay': '',
            'pubLevel': '2',
            'startDate': moment(new Date()).format('YYYY-MM-DD h:mm:ss'),
            'endDate': (moment(new Date()).subtract(7, 'days')).format('YYYY-MM-DD h:mm:ss'),
            'busiStatus':'1',
            'noticeType':'',
            'status':'1',
            'roleId':'',
            'orgName':'',
            'orgCode':'',
            'content':'',
        },







        // //   班级
        // class: [],
        // //   作业类型
        // type: [],
        // //   学科
        // subject: [],
        // //   作业详情
        // info: {},
        //   上传文件路径
        upfile_path: this._DecoratejobService.upfilePath,
        //   上传文件 文件对象
        // file_arr: [],
        
        // //   资源列表
        // res: {
        //     total: 0,
        //     //
        //     row: []
        // },
    }



    //   获取班级
    private getClass() {
        //
        this._ClassroomtestService.getClass('3').subscribe((res) => {
            if (res.code === '0') {
                this.view_data.class = res.data;
                //  设置默认值
            } else {
                this.view_data.class = [];
            }
        })
    }



    /**
     * 取发布类别
     */
    private Pub_type() {
        this._SchoolnoticeService.getPub_type().subscribe((res) => {
            if (res.code === '0') {
                this.view_data.pub_type = res.data;
                this.view_data.pub_type = [{ dictCode:'pub_type',dictName:'实时发送'}];
                //   默认值
                if(this.view_data.pub_type && this.view_data.pub_type.length > 0){
                    this.view_data.pub_type_item = this.view_data.pub_type[0];
                    this.view_data.form.pubType = this.view_data.pub_type[0].dictCode;
                    this.validateForm.get('pubType').setValue(this.view_data.form.pubType);
                    console.log(this.validateForm.get('pubType').value)
                }
            } else {
                this.view_data.pub_type = [];
            }
        })
    }


    /**
     * 发送方式(app,短信)
     */
    private Send_way() {
        this._SchoolnoticeService.getSend_way().subscribe((res) => {
            if (res.code === '0') {
                this.view_data.send_way = res.data;
                //   默认值
                if (this.view_data.send_way && this.view_data.send_way.length > 0) {
                    this.view_data.send_way_item = this.view_data.send_way[0];
                    this.view_data.form.sendWay = this.view_data.send_way[0].dictCode;
                    this.validateForm.get('sendWay').setValue(this.view_data.form.sendWay);
                }
            } else {
                this.view_data.send_way = [];
                this.view_data.send_way_item = {};
                this.view_data.form.sendWay = '';
            }
        })
    }

    
    /**
     * 公告类型(通知，公告)
     */
    private Notice_type() {
        this._SchoolnoticeService.getNotice_type().subscribe((res) => {
            if (res.code === '0') {
                this.view_data.notice_type = res.data;
                //   默认值
                if (this.view_data.notice_type && this.view_data.notice_type.length > 0) {
                    this.view_data.notice_type_item = this.view_data.notice_type[0];
                    this.view_data.form.noticeType = this.view_data.notice_type[0].dictCode;
                    this.validateForm.get('noticeType').setValue(this.view_data.form.noticeType);
                }
            } else {
                this.view_data.notice_type = [];
            }
        })
    }


    /**
     * 业务状态(编辑中)
     */
    private Busi_status() {
        this._SchoolnoticeService.getBusi_status().subscribe((res) => {
            if (res.code === '0') {
                this.view_data.busi_status = res.data;
                //   默认值
                if (this.view_data.busi_status && this.view_data.busi_status.length > 0) {
                    this.view_data.busi_status_item = this.view_data.busi_status[0];
                }
            } else {
                this.view_data.busi_status = [];
            }
        })
    }



    //    班级change
    change_class(orgCode:string):void{
        const item = this.view_data.class.filter(val => val.orgCode === orgCode)[0];
        this.view_data.class_item = item;
        this.view_data.form.orgCode = item.orgCode;
        this.view_data.form.orgName = item.orgName;
    }


    //   提交发送通知
    send(){
        //   添加内容
        const body_html = this.uedit.txt.html();
        this.validateForm.get('content').setValue(body_html === '<p><br></p>' ? '' : body_html);
        //
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
        //
        if(this.validateForm.valid){
            let temp_obj = Object.assign({}, this.view_data.form, this.validateForm.value);
            this._SchoolnoticeService.postNotices(temp_obj).subscribe((res) => {
                if (res.code === '0') {
                    this.notification.create('success', '成功', '提交通知成功');
                } else {
                    this.notification.create('error', '失败', res.message);
                }
            });
        }
    }










    ngOnInit() {
        //
        this.validateForm = this.fb.group({
            title: ['', [Validators.required]],
            pubType: [this.view_data.form.pubType, [Validators.required]],
            pubDate: [this.view_data.form.pubDate],
            sendWay: ['', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            noticeType: ['', [Validators.required]],
            orgCode: ['', [Validators.required]],
            content: ['', [Validators.required]],
        });

        //   取班级
        this.getClass();
        //
        this.Pub_type();
        //
        this.Send_way();
        this.Notice_type();
        this.Busi_status();


        //日期范围
        laydate.render({
            elem: '#viewjob_date_startDate',
            type: 'datetime',
            done: (value, date, endDate) => {
                this.view_data.form.startDate = value;
                this.validateForm.get('startDate').setValue(value);
            }
        });
        //日期范围
        laydate.render({
            elem: '#viewjob_date_endDate',
            type: 'datetime',
            done: (value, date, endDate) => {
                this.view_data.form.endDate = value;
                this.validateForm.get('endDate').setValue(value);
            }
        });
        //   富文本框
        this.uedit = new UEdit('#edit-edit');
        this.uedit.customConfig.uploadImgServer = this._DecoratejobService.ueditUpfilePath;
        this.uedit.customConfig.uploadFileName = 'fileName';
        this.uedit.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
        this.uedit.customConfig.uploadImgMaxLength = 3;
        this.uedit.customConfig.uploadImgHooks = {
            customInsert: function (insertImg, result, editor) {
                console.log(result);
                insertImg(result.data[0]);
            }
        }

        this.uedit.create();
        


    }

}
