/**
 * Watcher: 
 */
function Watcher(vm,exp,cb){
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get();
}

/** 
 * get  this.value = data[key] 中即刻调用Object.defineProperty的get方法，从而可以将Dep.target，即监听的数据对象添加入订阅者列表
 *      @param key [description] data中的键值
 * update 在observe中节点属性变化时，通知update方法         
*/
Watcher.prototype = {
    get: function(){
        Dep.target = this;
        var value = this.vm.data[this.exp];
        // console.log('watcher---------->',value);
        Dep.target = null;
        return value;
    },
    update:function(){
        var value = this.get(),
            oldValue = this.value;
        if(value != oldValue){
            this.value = value;
            this.cb.call(this.vm,value,oldValue);
        }
    }
}