/*
 * @Description: 数据响应式
 * @Author: Zale Ying
 * @Date: 2020-10-22 13:44:21
 * @LastEditTime: 2020-10-23 15:13:36
 * @LastEditors: Zale Ying
 */
let ARRAY_METHOD = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
];

let array_methods = Object.create(Array.prototype);

ARRAY_METHOD.forEach(method => {
    array_methods[method] = function() {
        // 调用原来的方法
        console.log(`调用的是拦截的 ${method} 方法`);

        // 将数据进行响应式化
        for (let i = 0; i < arguments.length; i++) {
            
        }
    }
})

/** 将对象 o 变成响应式，vm 就是 vue 实例， 为了在调用时处理上下文 */
function observer(obj) {
    // 之前没有对obj 本身进行操作，这一次就直接对obj进行判断
    if (Array.isArray(obj)) {
        // 对数组的方法进行重构
        obj.__proto__ = array_methods;
        for (let i = 0; i < obj.length; i++) {
            observer(obj[i]); // 递归处理每一个数组元素
        }
    } else {
        // 对其成员进行处理
        let keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            let prop = keys[i];
            defineReactive( obj, prop, obj[ prop ], true );
        }
    }
}

function defineReactive(target, key, value, enumerable) {

    // 函数内部就是一个局部作用域， 这个value 就只在函数内使用的变量（闭包）

    if (typeof value === 'object' && value != null) {
        observer(value); // 递归
    }

    let dep = new Dep();

    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: !!enumerable,

        get() {
            console.log(`读取 ${key} 属性`);
            return value;
        },
        set(newVal) {
            if (value === newVal) return

            // 将重新赋值的数据变成响应式的，因此如果传入的对象类型，那么就需要使用 observe 将其转换为响应式
            if (typeof newVal === 'object' && newVal != null) {
                observer(newVal);
            }

            value = newVal;

            // 派发更新
        }
    })
}

/** 将 某一个对象的属性访问映射到对象的某一个属性成员上 */
function proxy(target, prop, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get() {
            return target[prop][key];
        },
        set(newVal) {
            target[prop][key] = newVal;
        }
    })
}

JGVue.prototype.initData = function () {
    // 遍历 this.data 的成员， 将属性转换为响应式，将直接属性代理到实例上
    let keys = Object.keys(this._data);

    // 响应式化
    observer(this._data);
    
    // 代理
    for(let i = 0; i < keys.length; i++) {
        proxy(this, '_data', keys[i]);
    }
}