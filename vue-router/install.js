import View from './components/view'
import Link from './components/link'

export let _Vue

export function install (Vue) {
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  //混入beforecreate钩子
  Vue.mixin({
    beforeCreate () {
      /** 
       * 在创建vue实例的时候，我们会传入router对象，new Vue({router})
       * 此时router会被挂载在Vue的跟组件this.$options选项中，在options上存在router则代表是根组件
       * 如果存在this.$options.router则对其进行赋值
       */
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        //执行_router实例的init方法
        this._router.init(this)
        //为vue实例定义数据劫持
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        //非跟组件则直接从父组件中取
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      //渲染router-view组件
      //引用自components/view/
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
  //设置代理，当访问this.$router和this.$route的时候,返回this._routerRoot._router/_route
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
  //注册router-view和router-link组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)
  //定义混入钩子的合并策略
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
