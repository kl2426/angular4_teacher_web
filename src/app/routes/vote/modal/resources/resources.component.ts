import { Component, EventEmitter, Input, Output, OnInit, Injector } from '@angular/core';
import { NzNotificationService, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { VoteService } from '../../vote.service';
import { toTreeData, dgTree } from 'app/utils/tree';

import { TokenService } from '../../../../core/net/token.service';

import { CloudresourceService } from '../../../resourcecenter/cloudresource/cloudresource.service';
import { MycloudplateService } from '../../../resourcecenter/mycloudplate/mycloudplate.service';
import { DecoratejobService } from '../../../jobs/decoratejob/decoratejob.service';

@Component({
    selector: 'app-modal-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.less']
})

//  --云资源选择弹窗   


export class ModalResourcesComponent implements OnInit {

    constructor(
        public _VoteService: VoteService,
        public _Injector: Injector,
        public _CloudresourceService: CloudresourceService,
        private message: NzMessageService,
        public _MycloudplateService: MycloudplateService,
        public _DecoratejobService: DecoratejobService,
    ) { }


    @Input() name: string;
    @Output() onVoted = new EventEmitter<any>();

    isVisible = false;
    btn_title = '云资源导入';

    view_data = {
        //  资源树
        resource_tree:[],
        //  资源年级选择
        resource_grade:[],
        //  当前选择班级
        resource_class:null,
        //   章节树
        resource_chapter:[],
        //   云资源类别
        resource_type:[],
        //   列表表单
        form: {
            'pageNum': '1',
            'pageSize': '10000',
            'dirId': '',
            'resType': '',
            'fileType': '1',
            'source': ''
        },
        //   资源列表
        res:{
            total: 0,
            //
            row: []
        }
    }

    //   资源目录
    private getResource() {
        //
        this._VoteService.getResource('', '', '').subscribe((res) => {
            if(res.code === '0'){
                let tree = res.data;
                let temp_arr = [];
                for(let item of res.data){
                    if(item.level < 6){
                        temp_arr.push(item);
                    }
                }
                //   生成树
                this.view_data.resource_tree = toTreeData(tree, {
                    id: 'dirId',
                    parentId: 'pDirId',
                    rootId: '0'
                });
                // //   生成年级树
                // this.view_data.resource_grade = toTreeData(tree, {
                //     id: 'dirId',
                //     parentId: 'pDirId',
                //     rootId: '0'
                // })[0].children;
                //   生成年级树
                
                //   添加叶子属性
                dgTree(this.view_data.resource_tree,null, (item)=>{
                    item.title = item.dirName;
                    item.key = item.dirId;
                    if (!(item.children && item.children.length > 0)){
                        item.isLeaf = true;
                    }
                });
                this.view_data.resource_grade = this.view_data.resource_tree[0].children;
                

                console.log(this.view_data.resource_grade)
            }else{

            }
        })
    }


    //   取资源列表
    private getList() {
        this._CloudresourceService.getResourceCloudfiles(this.view_data.form).subscribe((res) => {
            if (res.code === '0') {
                this.view_data.res.row = res.data.list;
                this.view_data.res.total = res.data.total;
                this.view_data.form.pageNum = res.data.pageNum;
                this.view_data.form.pageSize = res.data.pageSize;
            } else {
                this.view_data.res.row = [];
                this.view_data.res.total = 0;
                this.view_data.form.pageNum = '1';
            }
        })

    }


    //   获云盘数据列表
    private getDiskList(id: any) {
        //
        this._MycloudplateService.getList(id).subscribe((res) => {
            if (res.code === '0') {
                this.view_data.res.row = res.data.filter(value => value.type === '1');
            } else {
                this.view_data.res.row = [];
            }
        })
    }


    //   获取试卷列表
    private getPapers(dirId:any) {
        //
        this._DecoratejobService.getPapers(this.view_data.form.pageNum, this.view_data.form.pageSize,dirId,'2').subscribe((res) => {
            if (res.code === '0') {
                this.view_data.res.row = res.data.list;
            } else {
                this.view_data.res.row = [];
            }
        })
    }

    



    //
    handleOk(){
        const checked_arr = this.view_data.res.row.filter(value => value.checked);
        if (checked_arr.length > 0){
            switch (this.name) {
                //   
                case 'resources':
                    for(let item of checked_arr){
                        item.attachSrc = '1';
                        item.paperId = item.resId;
                    }
                    break;
                case 'disk':
                    for (let item of checked_arr) {
                        item.attachSrc = '2';
                        item.paperId = item.id;
                    }
                    break;
                case 'paper':
                    for (let item of checked_arr) {
                        item.attachSrc = '4';
                        item.paperId = item.id;
                    }
                    break;
            }
            this.onVoted.emit(checked_arr);
            this.isVisible = false;
        }else{
            this.message.create('warning', '请选择资源');
        }
    }


    //
    tree_change(e:any){
        switch (this.name) {
            //   
            case 'resources':
                if (e.selectedKeys.length > 0) {
                    this.view_data.form.dirId = e.selectedKeys[0].key;
                    //  查询
                    this.getList();
                }
                break;
            case 'disk':
                if (e.selectedKeys.length > 0) {
                    this.getDiskList(e.selectedKeys[0].key);
                }
                break;
            case 'paper':
                if (e.selectedKeys.length > 0) {
                    //  查询
                    this.getPapers(e.selectedKeys[0].key);
                }
                break;

            default:
                //  资源目录
                this.getResource();
                break;
        }

        
    }





    /**
     * 取目录树
     */
    dirsTree() {
        //
        this._MycloudplateService.getTree().subscribe((res) => {
            console.log(res)
            if (res.code === '0') {
                let tree = res.data;
                //   添加叶子属性
                dgTree(tree, 'child', (item) => {
                    item.title = item.name;
                    item.key = item.id;
                    item.children = item.child;
                    if (!(item.children && item.children.length > 0)) {
                        item.isLeaf = true;
                    }
                });
                this.view_data.resource_grade = tree;
            } else {
                
            }
        })
    }




    // //   树选择发生变化
    // change_left_nav(e:any){
    //     //   取章节
    //     let temp_chapter = {
    //         'children':[]
    //     }
    //     //   
    //     dgTree(this.view_data.resource_tree,null, (item) => {
    //         if (e.length === 5 && item.dirId === e[4]) {
    //             temp_chapter = item;
    //         }
    //     });
    //     //  整理章节
    //     this.view_data.resource_chapter = temp_chapter.children[0].children;

    // }


    // //    树点击
    // click_nav(item:any){
    //     //  dirId
    //     this.view_data.form.dirId = item.dirId;
    //     //  输出给父级
    //     this.onVoted.emit(this.view_data.form.dirId);

    //     //   存点击
    //     let isopen_arr = [];
    //     //  
    //     if(item.children.length === 0){
    //         //   是指定L5叶子节点
    //         //   查找打开的干节点
    //         dgTree(this.view_data.resource_chapter,null, (item) => {
    //             if (item.isopen){
    //                 isopen_arr.push(item);
    //             }
    //             item.isLeaf_open = false;
    //         });
    //         item.isLeaf_open = true;
    //         //
    //         //   保存缓存 
    //         this._Injector.get(TokenService).resourceTree = {
    //             tree: this.view_data.resource_tree,
    //             grade: this.view_data.resource_grade,
    //             class: this.view_data.resource_class,
    //             chapter: JSON.parse(JSON.stringify(this.view_data.resource_chapter)),
    //             item:item
    //         }
    //     }
    // }





    ngOnInit() {
        switch (this.name) {
            //   
            case 'resources':
                //  资源目录
                this.btn_title = '云资源导入';
                this.getResource();
                break;
            case 'disk':
                //  资源目录
                this.btn_title = '云盘导入';
                this.dirsTree();
                break;
            case 'paper':
                //  资源目录
                this.btn_title = '组卷导入';
                this.getResource();
                break;
        
            default:
                //  资源目录
                this.getResource();
                break;
        }
        

        console.log(this.name)

        
    }

}
