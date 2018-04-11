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

import { DecoratejobService } from './decoratejob.service';
import { toTreeData, dgTree } from 'app/utils/tree';


import { TokenService } from '../../../core/net/token.service';
import { ElementData } from '@angular/core/src/view';


declare let laydate;



@Component({
    selector: 'app-decoratejob',
    templateUrl: './decoratejob.component.html',
    styleUrls: ['./decoratejob.component.less']
})
export class DecoratejobComponent implements OnInit {

    constructor(
        public _DecoratejobService: DecoratejobService,
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
        //   作业类型
        type:[],
        //   学科
        subject:[],
        //   作业详情
        info:{},
        //   上传文件路径
        upfile_path: this._DecoratejobService.upfilePath,
        //   上传文件 文件对象
        file_arr: [],
        //   列表表单
        form: {
            'finishDate': moment(new Date()).format('YYYY-MM-DD h:mm:ss'),
            'jobAttachList':[],
            'jobContent':'',
            'jobName':'',
            'jobType':'',
            'orgCodeArr':'',
            'sendDate': moment(new Date()).format('YYYY-MM-DD h:mm:ss'),
            'sendType':'1',
            'subject':'',
        },
        //   资源列表
        res:{
            total: 0,
            //
            row: []
        },
    }

    //   上传文件 弹窗
    modal_upload = {
        isVisibleTop: false,
        isVisibleMiddle: false
    }


    //   获取班级
    private getClass() {
        //
        this._DecoratejobService.getClass('3').subscribe((res) => {
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
        this._DecoratejobService.getType().subscribe((res) => {
            if (res.code === '0') {
                this.view_data.type = res.data;
            } else {
                this.view_data.type = [];
            }
        })
    }




    //   获取学科
    private getSubject() {
        //
        this._DecoratejobService.getSubject().subscribe((res) => {
            if (res.code === '0') {
                this.view_data.subject = res.data;
            } else {
                this.view_data.subject = [];
            }
        })
    }


    //   发送作业
    private postSendJobs(form:any) {
        //
        this._DecoratejobService.postJobs(form).subscribe((res) => {
            console.log(res)
            if (res.code === '0') {
                // this.view_data.subject = res.data;
            } else {
                // this.view_data.subject = [];
            }
        })
    }


    click_modal(e:any){
        this.view_data.file_arr = this.view_data.file_arr.concat(e);
        console.log(this.view_data)
    }


    //   上传文件添加数据
    upfileForm = (file: any) => {
        // file.dirId = this.view_data.position[this.view_data.position.length - 1].id;
        return file;
    }

    //   上传文件状态
    upfileHandleChange(file: any) {
        const allDone = file.fileList.every(value => value.status === 'done');
        for (let item of file.fileList){
            if (item.status === 'done' && item.response.code === '0'){
                //   上传完成
                let temp_bol = true;
                for(let item2 of this.view_data.file_arr){
                    if(item2.id && item.response.data[0].id === item2.id){
                        temp_bol = false;
                    }
                }
                //
                item.response.data[0].attachSrc = '3';
                item.response.data[0].paperId = item.response.data[0].id;
                temp_bol && this.view_data.file_arr.push(item.response.data[0]);
            }
        }
        if (allDone) {
            //   关闭弹窗
            this.modal_upload.isVisibleMiddle = false;
        }
    }





    //  发布作业
    sendJobs(){
        //   截止时间
        const date_dom: HTMLInputElement = document.querySelector('#viewjob_date');
        this.validateForm.controls.finishDate.setValue(date_dom.value);
        //   内容正文
        const body_html = this.uedit.txt.html();
        this.validateForm.controls.jobContent.setValue(body_html === '<p><br></p>' ? '' : body_html);
        //   作业发送
        if (this.validateForm.value.sendType === '2'){
            let date_two_dom: HTMLInputElement = document.querySelector('#viewjob_date_two');
            this.validateForm.controls.sendDate.setValue(date_two_dom.value);
        }else{
            this.validateForm.controls.sendDate.setValue(moment(new Date()).format('YYYY-MM-DD h:mm:ss'));
        }
        //   整理附件
        let temp_arr = [];
        for(let item of this.view_data.file_arr){
            temp_arr.push({
                attachSrc: item.attachSrc,
                paperId: item.paperId
            });
        }
        this.view_data.form.jobAttachList = temp_arr;
        //
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
        //  
        if (this.validateForm.valid) {
            //   新建文件夹
            // this.Cddirs(this.view_data.form_new_file.value.dirName, this.view_data.item_pDirId.id);
            this.view_data.form = Object.assign({}, this.view_data.form, this.validateForm.value);
            this.postSendJobs(this.view_data.form);
            console.log(this.validateForm);
        }

        console.log(this.view_data);
    }


    //   选择班级
    click_select_class(item:any){
        item.checked = !item.checked;
        //
        const temp_arr = this.view_data.class.filter(value => value.checked);
        const temp_arr2 = [];
        for(let i of temp_arr){
            temp_arr2.push(i.orgCode);
        }
        this.validateForm.controls.orgCodeArr.setValue(temp_arr2.join(','));
    }


    // //   查询列表
    // List(){
    //     console.log(this.view_data)
    //     this.view_data.form = Object.assign({},this.view_data.form,this.validateForm.value);
    //     //  设置日期
    //     const date_len: HTMLInputElement = document.querySelector('#viewjob_date');
    //     if(date_len.value.length > 0){
    //         let temp_arr = date_len.value.split(' ');
    //         this.view_data.form.beginDate = temp_arr[0];
    //         this.view_data.form.endDate = temp_arr[2];
    //     }else{
    //         this.view_data.form.beginDate = '';
    //         this.view_data.form.endDate = '';
    //     }
    //     delete this.view_data.form.date;
    //     //
    //     this._DecoratejobService.getList(this.view_data.form).subscribe((res) => {
    //         if (res.code === '0') {
    //             this.view_data.res.row = res.data;
    //             this.view_data.res.total = res.data.length;
    //             // this.view_data.form.pageNum = res.data.pageNum;
    //             // this.view_data.form.pageSize = res.data.pageSize;
    //         } else {
    //             this.view_data.res.row = [];
    //             this.view_data.res.total = 0;
    //             this.view_data.form.pageNum = '1';
    //             this.message.create('warning', res.message);
    //         }
    //     })
    // }

    // //   分页
    // page_change(e:any){
    //     this.view_data.form.pageNum = e;
    //     this.List();
    // }

    // //   分页
    // size_change(e: any) {
    //     this.view_data.form.pageSize = e;
    //     this.List();
    // }

    


    // //   取详情
    // Info(id:any){
    //     this._DecoratejobService.getInfo(id).subscribe((res) => {
    //         console.log(res)
    //         if (res.code === '0') {
    //             this.view_data.info = res.data;
    //             //   打开详情页
    //             this.step = 'info';
    //         } else {
    //             this.view_data.info = {};
    //             this.message.create('warning', res.message);
    //         }
    //     })
    // }

    //  返回
    // click_back(){
    //     this.step = 'list';
    //     this.view_data.info = {};
    // }






    // checkOptionsOne = [
    //     { label: 'Apple', value: 'Apple', checked: true },
    //     { label: 'Pear', value: 'Pear' },
    //     { label: 'Orange', value: 'Orange' }
    // ];




    ngOnInit() {
        //日期范围
        laydate.render({
            elem: '#viewjob_date', 
            type: 'datetime'
        });
        //日期范围
        laydate.render({
            elem: '#viewjob_date_two',
            type: 'datetime'
        });
        //   富文本框
        this.uedit = new UEdit('#edit-edit');
        this.uedit.create();
        //   取班级
        this.getClass();
        //   取作业类型
        this.getType();
        //   取学科
        this.getSubject();
        //
        this.validateForm = this.fb.group({
            orgCodeArr: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            jobType: ['', [Validators.required]],
            jobName: ['', [Validators.required]],
            finishDate: [this.view_data.form.finishDate],
            jobContent: ['', [Validators.required]],
            sendType: [this.view_data.form.sendType, [Validators.required]],
            sendDate: [this.view_data.form.sendDate, [Validators.required]],
        });

        
    }

}
