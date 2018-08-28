/**
 * index.js 判断是否存在局部Vue，是否安装过Vuex，否则安装，并注入store对象
 * Vue.use(Vuex)方法执行的是install方法
 * 它实现了Vue实例对象的init方法封装和注入，使得传入的store对象被设置到Vue上下文环境的$store中
 * Vue component任意地方都能够通过this.$store访问到该store
 */

let Vue;

//浏览器环境下若加载过Vue，则执行install方法
if (typeof window != 'undefined' && window.Vue) {
    install(window.Vue);
}

/**
 * install: 将Vuex装载到Vue对象上
 */
function install(_Vue){
    if(Vue){
        console.error(
            '[vuex] already installed. Vue.use(Vuex) should be called only once.'
        );
        return;
    }
    Vue = _Vue;
    const version = Number(Vue.version.split('.')[0]);
    if(version >= 2){
        const usesInit = Vue.config._lifecycleHooks.indexOf('init')>-1
        Vue.mixin(usesInit?{init:vuexInit}:{beforeCreate:vuexInit})
    }else{
        const _init = Vue.prototype._init;
        Vue.prototype._init = function(options={}){
            options.init = options.init?[vuexInit].concat(options.init):vuexInit
            _init.call(this,options) 
        }
    }
}

/**
 * 将初始化Vue根组件时传入的store设置到this对象的$store属性上,子组件从其父组件引用$store属性，层层嵌套进行设置。
 * 在任意组件中执行 this.$store 都能找到装载的那个store对象
 */
function vuexInit(){
    const options = this.$options; //vue实例的所有配置，包括data,methods等
    if(options.store){//options中引入了store
        this.$store = options.store
    }else if(options.parent && options.parent.$store){
        this.$store = options.parent.$store
    }
}