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

import { ClassroomtestService } from '../classroomtest/classroomtest.service';
import { GroupmanageService } from '../groupmanage/groupmanage.service';

declare let Sortable;


@Component({
    selector: 'app-groupmanage',
    templateUrl: './groupmanage.component.html',
    styleUrls: ['../attendance/attendance.component.less']
})
export class GroupmanageComponent implements OnInit {

    constructor(
        public _ClassroomtestService: ClassroomtestService,
        public _GroupmanageService: GroupmanageService,
        private notification: NzNotificationService,
        private modalService: NzModalService,
        public _Injector: Injector,
        private fb: FormBuilder,
        private message: NzMessageService,
    ) { }

    //   分组管理 状态 列表  添加
    step = 'list';
    //   拖动
    data_sortable = null;

    view_data = {
        //   班级
        class: [],
        class_item: {},
        //
        class_val: '',
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
        //   班级学生列表
        org_list:[],
        org_list_all:false,
        //   添加分组名称
        add_title:'',
        //   微调分组
        res_group:{
            row:[],

        }
    }

    //   弹窗
    modal_group = {
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
                    this.view_data.class_item = this.view_data.class[0];
                }
                //
                if(this.view_data.class_val.length > 0){
                    this.List();
                }
            } else {
                this.view_data.class = [];
            }
        })
    }

    //   获取班级学生列表
    private StudentList() {
        this._GroupmanageService.getStudentList(this.view_data.class_val).subscribe((res) => {
            if (res.code === '0') {
                this.view_data.org_list = res.data;
            } else {
                this.view_data.org_list = [];
            }
        });
    }
    
    //   添加分组
    private addGroup(items_group:any) {
        //   整理小组数据
        let items = [];
        for(let item of items_group){
            items.push({
                'studentCode':item.studentCode,
                'studentName':item.studentName
            });
        }
        this._GroupmanageService.postGroups(this.view_data.add_title, this.view_data.class_val, items).subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '添加分组成功');
                //
                this.List();
                //
                this.step = 'list';
            } else {
                this.notification.create('error', '失败', res.message);
            }
        });
    }

    //   删除分组
    private delGroup(item: any) {

        this._GroupmanageService.getDelGroups(item.groupId).subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '删除分组成功');
                //
                this.List();
                //
                this.step = 'list';
            } else {
                this.notification.create('error', '失败', res.message);
            }
        });
    }

    //   取微调分组数据
    private Grouplist(item:any) {

        this._GroupmanageService.getGrouplist(this.view_data.class_val).subscribe((res) => {
            if (res.code === '0') {
                this.view_data.res_group.row = res.data;
                if (item && 'groupId' in item){
                    for (let i of this.view_data.res_group.row) {
                        if(i.groupId === item.groupId){
                            this.view_data.res_group.row = [i];
                            break;
                        }
                    }
                }
                setTimeout(() => {
                    this.edit_group();
                }, 50);
            } else {
                this.view_data.res_group.row = [];
                this.notification.create('error', '失败', res.message);
            }
        });
    }

    //   保存微调数据
    private addGroupList(items:any) {
        //  整理数据
        let temp_arr = [];
        for(let item of items){
            temp_arr.push({
                'groupId': item.groupId,
                'groupMembers':item.groupMembers
            });
        }
        //
        this._GroupmanageService.postAddgrouplist(this.view_data.class_val, temp_arr).subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '微调分组成功');
                this.modal_group.isVisibleMiddle = false;
                this.List();
            } else {
                this.notification.create('error', '失败', res.message);
            }
        });
    }


    //   查询列表
    List() {
        //
        this._GroupmanageService.getGroups(this.view_data.class_val).subscribe((res) => {
            console.log(res)
            if (res.code === '0') {
                this.view_data.res.row = res.data;
                //
                // this.StudentList();
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
        this.List();
    }


    refreshStatus(): void {
        const allChecked = this.view_data.res.row.every(value => value.checked === true);
        this.view_data.org_list_all = allChecked;
    }

    checkAll(value: boolean): void {
        this.view_data.org_list.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    //   点击添加小组按钮
    click_add(){
        this.view_data.add_title = '';
        this.StudentList();
        this.step = 'add';
    }

    //   添加新小组
    click_add_ok(){
        const select_org = this.view_data.org_list.filter(item => item.checked === true);
        if(select_org.length > 0){
            //
            this.addGroup(select_org);
        }else{
            this.message.create('warning', '未选择学生');
        }
    }

    //   确定删除吗？
    showDeleteConfirm(item: any): void {
        this.modalService.confirm({
            nzTitle: '删除',
            nzContent: '<b style="color: red;">你确定要删除分组吗？</b>',
            nzOkText: '确定',
            nzOkType: 'danger',
            nzOnOk: () => this.delGroup(item),
            nzCancelText: '取消',
            nzOnCancel: () => console.log('取消')
        });
    }


    //   整理数据


    //  弹窗加载事件 
    edit_group(){
        // Multi groups
        this.data_sortable = Sortable.create(document.getElementById('multi'), {
            animation: 150,
            draggable: '.tile',
            handle: '.tile__name'
        });

        [].forEach.call(document.getElementById('multi').getElementsByClassName('tile__list'), (el) => {
            Sortable.create(el, {
                group: 'photo',
                animation: 150,
                onEnd: (evt) => {
                    let studentcode = evt.item.dataset.studentcode;
                    let from_groupid = evt.from.dataset.groupid ? evt.from.dataset.groupid : null;
                    let new_index = evt.newIndex;
                    let old_index = evt.oldIndex;
                    let to_groupid = evt.item.parentNode.dataset.groupid ? evt.item.parentNode.dataset.groupid : null;
                    //   整理微调分组列表数据
                    let temp_group = {};
                    for(let item of this.view_data.res_group.row){
                        //   源 - 删除学生记录
                        if(item.groupId === from_groupid){
                            temp_group = item.groupMembers[old_index];
                            item.groupMembers.splice(old_index, 1);
                        }
                    }
                    //
                    if(Object.keys(temp_group).length < 1){
                        return false;
                    }
                    //
                    for(let item of this.view_data.res_group.row){
                        if(item.groupId === to_groupid){
                            item.groupMembers.splice(new_index,0,temp_group);
                        }
                    }
                }
            });
        });
    }

    //  点击打开弹窗
    //   item
    click_edit_group(item:any){
        this.view_data.res_group.row = [];
        this.Grouplist(item);
        this.modal_group.isVisibleMiddle = true;
    }

    //   点击微调确定
    edit_attendance(){
        this.addGroupList(this.view_data.res_group.row);
    }



    ngOnInit() {
        //   取班级
        this.getClass();

       

    }

}
