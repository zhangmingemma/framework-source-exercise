/**
 * Vuex工作的必要条件即是：
 *      1. 已经执行安装函数进行装载
 *      2. 支持Promise语法
 * 判断store的构造函数，分析其是否支持上述条件，不支持则抛出错误
 */
constructor(options = {}) {
    assert(Vue, 'must call Vue.use(Vuex) before creating a store instance')
    assert(typeof Promise !== 'undefined','vuex requires a Promise polyfill in this browser')
}

function assert(condition,msg){
    if(!condition) throw new Error('[vuex] ${msg}')
}

/** 
 * 数据初始化 
 */
const {
    state = {},
    plugins = [],
    strict = false
} = options

this._committing = false //是否在进行提交状态标识
this._actions = Object.create(null) // actions操作对象
this._mutations = Object.create(null) // mutations操作对象
this._wrappedGetters = Object.create(null) // 封装后的getters集合对象
this._modules = new ModuleCollection(options) //  Vuex支持store分模块传入，存储分析后的modules
this._modulesNamespaceMap = Object.create(null) // 模块命名空间map
this._subscribes = [] // 订阅函数集合，vuex提供了subscribe的功能
this._watcherVM = new Vue() // Vue组件用于watch监视变化

constructor(rawRootModule){
    this.root = new Module(rawRootModule,false)
    if(rawRootModule.modules){
        forEachValue(rawRootModule.modules,(rawModule,key)=>{
            this.register([key],rawModule,false)
        })
    }
}