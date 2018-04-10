import { Component, OnInit, Injector } from '@angular/core';
import { NzNotificationService, NzModalService, NzMessageService } from 'ng-zorro-antd';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

import { MycloudplateService } from './mycloudplate.service';
import { toTreeData, dgTree } from 'app/utils/tree';

import { TokenService } from '../../../core/net/token.service';




export interface FileMoveSelectItem {
    title: string;
    key: string;
    children: any;
    [key: string]: any;
}



@Component({
    selector: 'app-mycloudplate',
    templateUrl: './mycloudplate.component.html',
    styleUrls: ['./mycloudplate.component.less']
})
export class MycloudplateComponent implements OnInit {

    constructor(
        public _MycloudplateService: MycloudplateService,
        public _Injector: Injector,
        private notification: NzNotificationService,
        private fb: FormBuilder,
        private modalService: NzModalService,
        private message: NzMessageService,
    ) { }

    view_data = {
        //   云资源类别
        resource_type:[],
        //   列表表单
        form: {
            'pageNum': '1',
            'pageSize': '20',
            'dirId': '',
            'resType': '',
            'fileType': '1',
            'source': ''
        },
        //   资源列表
        res:{
            total: 0,
            //  当前目录
            row: []
        },
        //   列表参数
        table:{
            //   table 是否全选
            allChecked: false,
            //  checkbox indeterminate 状态
            indeterminate: false,
            //   选中数量
            checkedNumber: 0,
        },
        //   父级目录ID
        item_pDirId: null,
        //   新建文件夹
        form_new_file: null,
        //   重命名文件/文件夹
        form_new_name: null,
        //   面包屑 层级缓存
        position:[],
        //   上传文件地址
        upfile_path:'',
        //   下载文件地址
        downfile_path:'',
        accessToken:'',
    }

    //   新建文件夹 弹窗
    modal_new_file = {
        isVisibleTop: false,
        isVisibleMiddle:false
    }


    //   上传文件 弹窗
    modal_upload = {
        isVisibleTop: false,
        isVisibleMiddle: false
    }

    //   重命名 弹窗
    modal_new_name = {
        isVisibleTop: false,
        isVisibleMiddle: false,
        item:{},
        //  文件名
        name:'',
        //   扩展名
        type:''
    }

    //   移动 弹窗
    modal_move = {
        isVisibleTop: false,
        isVisibleMiddle: false,
        item: null,
        tree:[]
    }




    refreshStatus(): void {
        const allChecked = this.view_data.res.row.every(value => value.checked === true);
        const allUnChecked = this.view_data.res.row.every(value => !value.checked);
        this.view_data.table.allChecked = allChecked;
        this.view_data.table.indeterminate = (!allChecked) && (!allUnChecked);
        this.view_data.table.checkedNumber = this.view_data.res.row.filter(value => value.checked).length;
    }

    checkAll(value: boolean): void {
        this.view_data.res.row.forEach(data => data.checked = value);
        this.refreshStatus();
    }



    //   查询云盘是否激活
    CheckRootIsActivit(){
        this._MycloudplateService.getCheckRootIsActivit().subscribe((res) => {
        	console.log(res)
            if (res.code === '0') {
                //  根目录ID
                this.view_data.item_pDirId = res.data;
                this.view_data.item_pDirId.name = this.view_data.item_pDirId.dirName;
                //   组织面包屑
                if (this.view_data.position.length < 1) {
                    this.view_data.position.push(this.view_data.item_pDirId);
                    
                }
            	//  查询
                this.List(this.view_data.item_pDirId);
            } else {
				//   激活云盘
				this.InitRootDir();
            }
        })
    }
    
    //   激活云盘
    InitRootDir(){
        this._MycloudplateService.getInitRootDir().subscribe((res) => {
        	console.log(res)
            if (res.code === '0') {
            	this.CheckRootIsActivit();
            } else {

            }
        })
    }
    
    //   获取目录和文件信息
    List(item:any){
        //
        this._MycloudplateService.getList(item.id).subscribe((res) => {
            if (res.code === '0') {
            	this.view_data.res.row = res.data;
            } else {
                this.view_data.res.row = [];
            }
        })
    }

    /**
     * 新建文件夹
     * @param dirName 文件名
     * @param pDirId 目录ID
     */
    Cddirs(dirName: any, pDirId: any) {
        this._MycloudplateService.postCddirs(dirName, pDirId).subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '新建文件夹成功');
                //   刷新
                //  查询
                this.List(this.view_data.position[this.view_data.position.length - 1]);
                //  清空
                this.view_data.form_new_file.controls.dirName.setValue('');
            } else {
                this.notification.create('error', '失败', res.message);
            }
            //   关闭弹窗
            this.modal_new_file.isVisibleMiddle = false;
        })
    }


    /**
     * 删除文件夹/文件
     * @param items 文件/夹
     */
    fileDelete(items: any) {
        //   整理数据
        let temp_items = [];
        for(let item of items){
            temp_items.push({
                id:item.id,
                type:item.type
            });
        }
        //
        this._MycloudplateService.postDelete(temp_items).subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '删除成功');
                //   刷新
                //  查询
                this.List(this.view_data.position[this.view_data.position.length - 1]);
            } else {
                this.notification.create('error', '失败', res.message);
            }
        })
    }


    /**
     * 重命名文件夹/文件
     * @param item 文件/夹
     */
    fileRename(item:any) {
        //
        let pid = this.view_data.position[this.view_data.position.length - 1].id;
        let name = this.view_data.form_new_name.value.dirName;
        if(this.modal_new_name.type.length > 0){
            name = name + '.' + this.modal_new_name.type;
        }
        this._MycloudplateService.postRename(item.id, item.type, name, pid).subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '重命名成功');
                //   刷新
                //  查询
                this.List(this.view_data.position[this.view_data.position.length - 1]);
            } else {
                this.notification.create('error', '失败', res.message);
            }
            //   关闭弹窗
            this.modal_new_name.isVisibleMiddle = false;
        })
    }


    /**
     * 移动文件夹/文件
     * @param items 文件/夹
     * @param dirId 移动到目录
     */
    fileMove(items: any, dirId: any) {
        //   整理数据
        let temp_arr = [];
        for (let item of items) {
            temp_arr.push(item.id);
        }
        this._MycloudplateService.getMove(temp_arr,dirId).subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '移动成功');
                //   刷新
                //  查询
                this.List(this.view_data.position[this.view_data.position.length - 1]);
            } else {
                this.notification.create('error', '失败', res.message);
            }
            //   关闭弹窗
            this.modal_move.isVisibleMiddle = false;
        })
    }


    /**
     * 取目录树
     */
    dirsTree() {
        //
        let pid = this.view_data.position[this.view_data.position.length - 1].id;
        this._MycloudplateService.getTree().subscribe((res) => {
            if (res.code === '0') {
                //   修改属性
                this.modal_move.tree = res.data;
                dgTree(this.modal_move.tree, 'child', (item) => {
                    item.children = item.child;
                    item.title = item.name;
                    item.key = item.id;
                    if (item.child && item.child.length > 0){
                        //   有子节点
                        item.isLeaf = false;
                    }else{
                        item.isLeaf = true;
                    }
                });
                console.log(this.modal_move.tree)
            } else {
                this.modal_move.tree = [];
                this.message.create('warning', res.message);
            }
        })
    }


    /**
     * 下载文件
     * @param items 文件数组
     */
    fileDown(items: any) {
        //   整理数据
        let temp_arr = [];
        for(let item of items){
            temp_arr.push(item.id);
        }
        //
        this._MycloudplateService.getFile(temp_arr).subscribe((res) => {
            if (res && res.code === '0') {
                //
            } else {
                this.notification.create('error', '失败', res.message);
            }
        })
    }


    //   新建文件夹
    newFileForm(): void {
        for (const i in this.view_data.form_new_file.controls) {
            this.view_data.form_new_file.controls[i].markAsDirty();
            this.view_data.form_new_file.controls[i].updateValueAndValidity();
        }
        //  
        if (this.view_data.form_new_file.valid){
            //   新建文件夹
            this.Cddirs(this.view_data.form_new_file.value.dirName, this.view_data.item_pDirId.id);
        }
    }

    //   重命名文件/夹
    newNameForm(): void {
        for (const i in this.view_data.form_new_name.controls) {
            this.view_data.form_new_name.controls[i].markAsDirty();
            this.view_data.form_new_name.controls[i].updateValueAndValidity();
        }
        //  
        if (this.view_data.form_new_name.valid) {
            //   
            this.fileRename(this.modal_new_name.item);
        }
    }


    //   文件夹/文件点击
    click_name(item:any):void {
        if (item.type === '2'){
            //   设置当前目录ID
            this.view_data.item_pDirId = item;
            //   组织面包屑
            this.view_data.position.push(item);
            //   类型为文件夹
            this.List(item);
        }
    }

    //   返回目录
    click_back(item:any){
        //   过虑最后一级的点击
        if (this.view_data.position.length > 0 && this.view_data.position[this.view_data.position.length - 1].id === item.id){
            //   是最后一条/级
            return false;
        }
        const temp_p = [];
        for(let i of this.view_data.position){
            temp_p.push(i);
            if(i.id === item.id){
                break;
            }
        }
        this.view_data.position = temp_p;
        //   设置当前目录ID
        this.view_data.item_pDirId = item;
        this.List(this.view_data.position[this.view_data.position.length - 1]);
    }


    //   上传文件添加数据
    upfileForm = (file:any) => {
        file.dirId = this.view_data.position[this.view_data.position.length - 1].id;
        return file;
    }

    //   上传文件状态
    upfileHandleChange(file:any){
        const allDone = file.fileList.every(value => value.status === 'done');
        if(allDone){
            //  全部完成
            //  刷新列表
            this.List(this.view_data.position[this.view_data.position.length - 1]);
            //   关闭弹窗
            this.modal_upload.isVisibleMiddle = false;
        }
    }

    //   确定删除吗？
    showDeleteConfirm(item:any): void {
        this.modalService.confirm({
            nzTitle: '删除',
            nzContent: '<b style="color: red;">你确定要删除' + (item.type === '2' ? '文件夹' : '文件') + '吗？</b>',
            nzOkText: '确定',
            nzOkType: 'danger',
            nzOnOk: () => this.fileDelete([item]),
            nzCancelText: '取消',
            nzOnCancel: () => console.log('取消')
        });
    }


    //   打开重命名弹窗
    openNewName(item:any){
        this.modal_new_name.name = '';
        this.modal_new_name.type = '';
        //   扩展名处理
        let fileType = item.fileType;
        if (new RegExp('[\\s\\S]*\\.' + fileType + '$', 'i').test(item.name)){
            //  带扩展名文件名
            this.modal_new_name.name = item.name.substr(0, item.name.lastIndexOf('.'));
            this.modal_new_name.type = item.name.substr(item.name.lastIndexOf('.') + 1, item.name.length);
            this.view_data.form_new_name.controls.dirName.setValue(this.modal_new_name.name);
        }else{
            this.view_data.form_new_name.controls.dirName.setValue(item.name);
        }
        this.modal_new_name.isVisibleMiddle = true;
        this.modal_new_name.item = item;
    }

    //   打开移动弹窗
    openModalMove(){
        //   清空选中项
        this.modal_move.item = {};
        //  选中数量
        const select_number = this.view_data.res.row.filter(value => value.checked).length;
        if(select_number > 0){
            //   取目录树
            this.dirsTree();
            //   
            this.modal_move.isVisibleMiddle = true;
        }else{
            this.message.create('warning', '请选择需要移动的文件或文件夹');
        }
    }



    //   点击目录
    click_modal_move_tree(name: string, e: any): void {
        console.log(e)
        this.modal_move.item = e.selectedKeys.length === 1 ? e.selectedKeys[0] : null;
    }

    //   移动弹窗确定
    click_modal_move_ok(){
        if (this.modal_move.item && Object.keys(this.modal_move.item).length > 0){
            this.modal_move.isVisibleMiddle = false;
            //  
            this.fileMove(this.view_data.res.row.filter(value => value.checked), this.modal_move.item.key);
        }else{
            this.message.create('warning', '未选中目录');
        }
    }




    //   批量删除
    click_many_del(){
        const items = this.view_data.res.row.filter(value => value.checked);
        if(items.length > 0){
            this.modalService.confirm({
                nzTitle: '删除',
                nzContent: '<b style="color: red;">你确定要删除吗？</b>',
                nzOkText: '确定',
                nzOkType: 'danger',
                nzOnOk: () => this.fileDelete(items),
                nzCancelText: '取消',
                nzOnCancel: () => console.log('取消')
            });
        }else{
            this.message.create('warning', '未选中目录');
        }
    }

    











    expandKeys = [ '1001', '10001' ];
  nodes = [
    {
      title   : 'root1',
      key     : '1001',
      children: [
        {
          title   : 'child1',
          key     : '10001',
          children: [
            {
              title   : 'child1.1',
              key     : '100011',
              children: []
            },
            {
              title   : 'child1.2',
              key     : '100012',
              children: [
                {
                  title   : 'grandchild1.2.1',
                  key     : '1000121',
                  isLeaf  : true,
                  disabled: true
                },
                {
                  title : 'grandchild1.2.2',
                  key   : '1000122',
                  isLeaf: true
                }
              ]
            }
          ]
        },
        {
          title: 'child2',
          key  : '10002'
        }
      ]
    },
    {
      title   : 'root2',
      key     : '1002',
      children: [
        {
          title          : 'child2.1',
          key            : '10021',
          children       : [],
          disableCheckbox: true
        },
        {
          title   : 'child2.2',
          key     : '10022',
          children: [
            {
              title: 'grandchild2.2.1',
              key  : '100221'
            }
          ]
        }
      ]
    },
    { title: 'root3', key: '1003' }
  ];

  mouseAction(name: string, e: any): void {
    console.log(name, e);
  }





    


    ngOnInit() {
        //  查询云盘是否激活
        this.CheckRootIsActivit();
        //  
        this.view_data.form_new_file = this.fb.group({
            dirName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
        });
        this.view_data.form_new_name = this.fb.group({
            dirName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
        });
        //
        this.view_data.upfile_path = this._MycloudplateService.upfilePath;
        this.view_data.downfile_path = this._MycloudplateService.downFilePath;
        //  token
        this.view_data.accessToken = this._Injector.get(TokenService).accessToken;

        
    }

}
