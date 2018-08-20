/**
 * Observe：观察data列表中每个值的变化
 */
function observe(data){
    if(!data || typeof data != 'object'){
        return;
    }
    Object.keys(data).forEach(function(key){
        defineReactive(data,key,data[key]);
    })
}

/**
 * 1. 观察者依赖Object.defineProperty来监听数据的变化
 *      enumerable: 可枚举
 *      configurable: 不可再次定义
 *      get: 获取值的时候调用，获取到值
 *      set: 改变值的时候调用 
 * 2. 维护一个订阅者数组，其中装入所有的订阅者，数据变动触发notify，再调用订阅者的update方法
 *      dep.addSub: 添加订阅者（订阅者在全局暂存）
 */
function defineReactive(data,key,val){
    var dep  = new Dep();
    // observe(val); //监听子元素
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get:function(){
            Dep.target && dep.addSub(Dep.target);
            // console.log('Observer: 监听到值',val);
            return val;
        },
        set:function(newval){
            // console.log('Observer: 监听到值',val,'----->',newval);
            if (newval === val) {
                return;
            }
            val = newval;
            dep.notify();
        }
    })
}

/**
 * 维护订阅者列表
 * addSub  添加订阅者
 *      @param sub [description] 新的订阅者
 * notify  通知订阅者更新
 */

function Dep(){
    this.subs = [];
}

Dep.prototype = {
    addSub: function(sub){
        // console.log('Dep: 添加订阅者',sub);
        this.subs.push(sub);
    },
    notify: function(){
        this.subs.forEach(function(sub){
            // console.log('update: ',sub);
            sub.update();
        })
    }
}

Dep.target = null;