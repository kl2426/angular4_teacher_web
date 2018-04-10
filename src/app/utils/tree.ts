/*
 * @Author: wu 308822989@qq.com 
 * @Date: 2018-03-30 17:07:41 
 * @Last Modified by: wu
 * @Last Modified time: 2018-03-30 18:04:25
 */

/**
 * 生成树入参
 */
export interface treeOption {
    id: any,
    parentId: any,
    rootId: any,
    [key:string]:any
}

/**
 * 生成树
 * @param data 数组 
 * @param attributes id 上级id 取级id 
 */
export function toTreeData(data:any, attributes:treeOption):any {
    let resData = data;
    let tree = [];

    //
    let run = function(chiArr) {
        if (resData.length !== 0) {
            for (let i = 0; i < chiArr.length; i++) {
                for (let j = 0; j < resData.length; j++) {
                    if (chiArr[i].tId === resData[j][attributes.parentId]) {
                        let obj = {
                            tId: resData[j][attributes.id],
                            value: resData[j].dirId,
                            label: resData[j].dirName,
                            children: []
                        };
                        obj = Object.assign({}, obj, resData[j]);
                        chiArr[i].children.push(obj);
                        resData.splice(j, 1);
                        j--;
                    }
                }
                run(chiArr[i].children);
            }
        }
    }

    for (let i = 0; i < resData.length; i++) {
        if (resData[i][attributes.id] === attributes.rootId) {
            let obj = {
                tId: resData[i][attributes.id],
                value: resData[i].dirId,
                label: resData[i].dirName,
                children: []
            };
            obj = Object.assign({}, obj, resData[i]);
            tree.push(obj);
            resData.splice(i, 1);
            i--;
        }
    }
    run(tree);
    
    return tree;

}


export function dgTree(tree: any, child: string, cb: any) {
    child = child ? child : 'children';
    for (var i = 0; i < tree.length; i++) {
        cb(tree[i]);
        //			console.log(tree[i],tree[i].children)
        if (tree[i][child] && tree[i][child].length > 0) {
            this.dgTree(tree[i][child],child, cb);
        }
    }
}


