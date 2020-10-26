/*
 * @Description: 虚拟dom生成
 * @Author: Zale Ying
 * @Date: 2020-10-22 10:32:16
 * @LastEditTime: 2020-10-22 10:51:28
 * @LastEditors: Zale Ying
 */
class VNode {
    constructor(tag, data, value, type) {
        this.tag = tag && tag.toLowerCase();
        this.data = data;
        this.value = value;
        this.type = type;
        this.children = [];
    }

    appendChild (vnode) {
        this.children.push(vnode)
    }
}