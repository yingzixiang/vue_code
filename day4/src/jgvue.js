/*
 * @Description: JGVue构造函数
 * @Author: Zale Ying
 * @Date: 2020-10-22 10:22:20
 * @LastEditTime: 2020-10-22 10:27:05
 * @LastEditors: Zale Ying
 */
class JGVue {
    constructor(options) {
        this._data = options.data;
        let elm = document.querySelector(options.el);
        this._template = elm;
        this._parent = elm._parentNode;
    }
    initData(); // 将data进行响应式转化，进行代理

    mount(); // 挂载
}