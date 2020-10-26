/*
 * @Description: Watcher实例
 * @Author: Zale Ying
 * @Date: 2020-10-23 15:14:38
 * @LastEditTime: 2020-10-24 10:59:21
 * @LastEditors: Zale Ying
 */
/** Watcher 观察者，用于发射更新的行为 */
class Watcher {

    /**
     * 
     * @param {object} vm JGVue 实例
     * @param {String | Function} expOrfn 如果是渲染watcher，传入的就是渲染函数，如果是计算 watcher 传入的就是路径表达式， 暂时只考虑 ex
     */
    constructor(vm, expOrfn) {
        this.vm = vm;
        this.getter = expOrfn;

        this.deps = []; // 依赖项
        this.depIds = {}; // 是一个 Set 类型， 用于保证 依赖项的唯一项 （简化的代码暂时不实现这一块）

        // 一开始需要渲染：真实 vue 中： this.lazy ? undefined : this.get()
        this.getter();
    }

    /** 计算，触发 getter */
    get() {
        this.getter.call(this.vm, this.vm); // 上下文的问题解决
    }
}