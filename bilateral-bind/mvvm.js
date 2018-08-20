/**
 * MVVM: 数据绑定的入口，整合Observer、Compile和Watcher三者
 *      Observer来监听自己的model数据变化
 *      Compile来解析编译模板指令
 *      Watcher搭起Observer和Compile之间的通信桥梁
 *      数据变化 -> 视图更新
 *      视图交互变化(input) -> 数据model变更的双向绑定效果
 * @param {*} options 
 */
function MVVM(options){
    this.$options = options;
    // 每次更新数据，都需要vm._data.name = 'dmg'
    // 因此需要设置代理，使得vm.name = 'dmg'
    this.data = this.$options.data;
    var data = this.data,me = this;
    Object.keys(data).forEach(function(key){
        me._proxy(key);
    })
    observe(data);
    this.$compile = new Compile(options.el || document.body,this);
}

MVVM.prototype = {
    _proxy:function(key){
        var me = this;
        Object.defineProperty(me,key,{
            configurable: false,
            enumerable: true,
            get: function(){
                return me.data[key]
            },
            set: function(newVal){
                me.data[key] = newVal;
            }
        })
    }
}