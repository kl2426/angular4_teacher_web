import { Component, EventEmitter, Input, Output, OnInit, Injector } from '@angular/core';
import { VoteService } from '../vote.service';
import { tree } from 'app/utils/tree';


import { TokenService } from '../../../core/net/token.service';


@Component({
    selector: 'app-leftnav',
    templateUrl: './leftnav.component.html',
    styleUrls: ['./leftnav.component.less']
})
export class LeftnavComponent implements OnInit {

    constructor(
        public _VoteService: VoteService,
        public _Injector: Injector,
    ) { }


    @Input() name: string;
    @Output() onVoted = new EventEmitter<any>();

    _tree = new tree();

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
            'pageSize': '16',
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
                    if(item.level === 5){
                        //   添加叶子属性
                        item.isLeaf = true;
                    }
                    if(item.level < 6){
                        temp_arr.push(item);
                    }
                }
                //   生成树
                this.view_data.resource_tree = this._tree.toTreeData(tree, {
                    id: 'dirId',
                    parentId: 'pDirId',
                    rootId: '0'
                });
                //   生成年级树
                this.view_data.resource_grade = this._tree.toTreeData(temp_arr, {
                    id: 'dirId',
                    parentId: 'pDirId',
                    rootId: '0'
                })[0].children;

                console.log(this.view_data.resource_grade);
                
            }else{

            }
        })
    }



    //   树选择发生变化
    change_left_nav(e:any){
        //   取章节
        let temp_chapter = {
            children:[]
        };
        console.log('=============99', this._tree.dgTree)
        //   
        this._tree.dgTree(this.view_data.resource_tree,null, (item) => {
            if (item.dirId === e[4]) {
                temp_chapter = item;
            }
        });
        console.log('=============106', this._tree.dgTree)
        //  整理章节
        if ('children' in temp_chapter && temp_chapter.children.length > 0){
            this.view_data.resource_chapter = temp_chapter.children[0].children;
        }else{
            this.view_data.resource_chapter = [];
        }
        

    }


    //    树点击
    click_nav(item:any){
        console.log(item)
        //  dirId
        this.view_data.form.dirId = item.dirId;
        //  输出给父级
        this.onVoted.emit(this.view_data.form.dirId);

        //   存点击
        let isopen_arr = [];
        //  
        if(item.children.length === 0){
            //   是指定L5叶子节点
            //   查找打开的干节点
            console.log('=============131', this._tree.dgTree)
            this._tree.dgTree(this.view_data.resource_chapter,null, (item) => {
                if (item.isopen){
                    isopen_arr.push(item);
                }
                item.isLeaf_open = false;
            });
            item.isLeaf_open = true;
            //
            //   保存缓存 
            this._Injector.get(TokenService).resourceTree = {
                tree: this.view_data.resource_tree,
                grade: this.view_data.resource_grade,
                class: this.view_data.resource_class,
                chapter: JSON.parse(JSON.stringify(this.view_data.resource_chapter)),
                item:item
            }
        }
    }







    ngOnInit() {
        //  载入资源目录
        const temp_obj = this._Injector.get(TokenService).resourceTree;
        if (Object.keys(temp_obj).length > 0){
            this.view_data.resource_tree = temp_obj.tree;
            this.view_data.resource_grade = temp_obj.grade;
            this.view_data.resource_class = temp_obj.class;
            this.view_data.resource_chapter = temp_obj.chapter;
            //
            //   选中项
            this.view_data.form.dirId = temp_obj.item ? temp_obj.item.dirId : '';
            if (!(this.view_data.form.dirId && this.view_data.form.dirId.length > 0)){
                return false;
            }
            //  active
            console.log('=============172', this._tree.dgTree)
            this._tree.dgTree(this.view_data.resource_chapter,null, (item) => {
                if (item.dirId === this.view_data.form.dirId) {
                    item.isLeaf_open = true;
                }
            });
            console.log('=============179', this._tree.dgTree)
            //  输出给父级
            this.onVoted.emit(this.view_data.form.dirId);
        }else{
            //  资源目录
            this.getResource();
        }

        
    }

}
