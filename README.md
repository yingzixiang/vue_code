<!--
 * @Description: Readme
 * @Author: Zale Ying
 * @Date: 2020-09-24 19:39:50
 * @LastEditTime: 2020-10-22 10:13:38
 * @LastEditors: Zale Ying
-->
# vue_code
vue源码解读

# Vue 与 模板
使用步骤：

1. 编写页面模板
    （1）直接在HTML标签中些标签
    （2）使用temaplate
    （3）使用单文件（<tempalte>)

2. 创建Vue实例
    （1）在vue的构造函数中提供：data, methods, computed, watcher, props, .../

3. 将Vue挂载到页面上

# 数据驱动模型

Vue 的执行流程

1. 获得模板：模板中有坑
2. 利用数据进行填坑
3. 将标签替换页面中原来有坑的标签

Vue 利用 我们提供的数据和页面模板生成了一个新的HTML标签（node元素）替换到了页面中放置模板的位置

# 简单的模板引擎渲染


# 虚拟dom

目标：
1. 怎么将真正的DOM转换为虚拟dom
2. 怎么将虚拟dom转换为真正的dom 

# 函数科里化

1. 科里化： 一个函数原本有多个参数，修改为传入一个参数，生成一个新的函数，由新函数来接收剩下的参数来运行得到结构
2. 偏函数：一个函数原本多个函数， 修改为传入一部分参数，生成一个新函数，由新函数接收剩下的函数来运行得到结构
3. 高阶函数： 一个函数参数是一个函数，该函数对参数这个函数进行加工，得到一个函数，这个加工用的函数就是高阶函数

为什么要使用科里化？ 为了提升性能，使用科里化可以缓存一部分能力

Vue本质上是使用HTML的字符串作为模板，将字符串的模板转化为AST（抽象语法树），再转换成VNode，最后由VNode生成DOM

- 模板 -> AST （性能开销最大)
- AST -> VNode
- VNode -> DOM

例子： '1 + 2 * （3+4)'
我们一般会将这个表达式转换成“波兰式”表达式，然后使用栈结构来运算

需要一个函数，判读一个标签名是否为内置的标签
function isHtmlTag(tagname) {
    tagName = tagName.toLowerCase();
    if (tags.indexof(tagname) > -1) return true;
    return false;
}

indexOf 内部也是通过循环实现
如果内置标签🈶6个，而模板中有是个10个标签，就需要执行60次循环

2. 虚拟dom的render方法
vue 项目*模板转换为抽象语法树需要执行几次？

- 页面一开始加载需要渲染
- 每一个属性（响应式）数据在发生变化的时候要渲染
- watch, computed 等等

# 响应式原理
- vue赋值属性获得属性都是直接使用的Vue实例
- 页面的数据更新

... js
Object.defineProperty(obj, '属性名', {
    writeable,  // 可写
    configable, // 可配置
    enumberable,// 可枚举
    set,
    get
})
...

对多级对象的响应式处理 => 递归函数

对数组处理响应式化
- push
- pop
- shift
- unshfit
- reverse
- sort
- splice

1. 改变数组数据的时候要发出通知
    1. vue2 中的缺陷，数组发生变化设置length没法通知（vue3中使用Proxy语法解决了这个问题）
    2. 加入的元素应该变成响应式的

扩展 push 和 pop 怎么处理？

- 修改要进行响应式画的数组原型
- 代理方法，就是将app._data中的成员给映射到app上

由于需要在更新数据的时候更新页面的内容
所以app._data 访问的成员与app访问的成员应该是同一个成员

由于app._data已经是响应式的对象了，所以只需要让app访问的成员去访问app._data的对应成员就可以了

例如：
```js
app.name 转换成app._data.name
```js

引入了proxy（target, src, prop), 将target的操作映射到src.prop上

```

# 发布订阅模式

代理方法， 就是将app._data 中的成员给映射到app上

由于需要在更新数据的时候，更新页面的内容

所以app._data访问的成员与app访问的成员应该是同一个成员

引入一个函数 proxy（target, src, prop), 将target的操作映射到src.prop上 注意：（这里是当时没有Proxy语法）

实际上就是事件模型

1. 有一个event对象
2. on，off，emit 方法

实现事件模型，怎么用？

1. event是一个全局对象
2. event.on('事件名', 处理函数) 订阅事件
    1. 事件可以连续订阅
    2. 可以一处： event.off()
        1. 移除所有
        2. 移除某一个类型事件
        3. 移除某一个类型的某一个处理函数

Vue模型
页面中的变更（diff)是以组建为单位

- 如果页面中只有一个组件（vue实例），不会有性能损失
- 如果页面中有多个组件（多watcher的情况），第一次多个组件的watcher存入到全局watcher中
    - 如果修改了局部的数据（例如其中一个组件的数据）
    - 表示只会对该组件进行diff算法，也就是说只会重新生成该组件的抽象语法书
    - 只会访问该组件的watcher
    - 也就表示在次往全局存储的只有该组件的watcher
    - 页面刷新的时候只更新了部分数据
1. 读取，将watcher存入全局容器时，被称为依赖收集
2. 修改时，将全局容器中的watcher去取出执行，被称为派发更新

## 解释 proxy
```js
app._data.name
// vue 设计，不希望访问下划线的属性中
// _ 开头的数据是私有数据
// $ 开头的是只读数据
app.name
// 将对 app.xxx 的访问交给 app._data.xxx
Object.defineProperty(app, 'name', {
    get() {
        return app._data.name
    },
    set(newVal) {
        app._data.name = newVal
    }
})
```

# 发布订阅模式

目标：解耦，让各个模块之间没有紧密联系

现在的处理办法是属性在更新的时候调用 mountComponent 方法

在vue中，整个的更新是按照组件为单位进行判断，以节点为单位进行更新

- 如果代码中没有自定义组件，那么在比较算法的时候，我们会将全部的模版对应的虚拟dom进行比较

- 如果代码中含有自定义组件，那么在比较算法中，就会判断更新的是哪一些组件中的属性，只会判断更新数据的组件，其他不会更新。

复杂的页面是有很多的组件构成，每一个属性要更新的都要调用更新的办法。

# 实现事件模型

1. 有一个event对象，event是一个全局对象
2. on, off, emit 方法
3. event.on('事件名'，处理函数)，订阅事件

Vue 模型

页面中的变更（diff）是以组件为单位

- 如果页面中只有一个组件（Vue实例），不会有性能损失
- 但是如果页面中有多个组件（多 watcher 的一种情况），第一次会有多个组件的watcher存入到全局watcher中。

    - 如果修改了局部的数据（例如其中一个组件的数据）
    - 表示只会对该组件进行diff算法，也就是说只会重新生成该组件的抽象语法树
    - 只会访问该组件的watcher
    - 也就表示再次往全局存储的只有该组件的watcher
    - 页面更新的时候也就只需要更新一部份

# 引入watcher
问题： 
    - 模型（图）
    - 关于this的问题

实现： 
    1. 只考虑修改后刷新（响应式）
    2. 再考虑依赖收集（优化）

在Vue中提供一个构造函数 Watcher
Watcher 会有一些方法：
    - get() 用来进行** 计算 ** 或** 执行 ** 处理函数
    - update() 公共的外部方法，该方法会触发内部的run方法
    - run() 运行，用来判断内部是使用异步运行还是同步运行等，这个方法最终会调用内部的get方法
    - cleanupDep() 简单理解为清除队列

