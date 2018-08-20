/**
 * Compile：将真实的DOM节点转换为文档碎片，解析完成后，将其添加回真实的节点
 * @param {*} el 真实的DOM节点
 * @param {*} vm 整个MVVM实例，即MVVM.js中的options,data都包含
 */
function Compile(el,vm){
    // console.log('真实的dom节点',el);
    this.vm = vm;
    this.$el = document.querySelector(el);
    if(this.$el){
        this.$fragment = this.node2Fragment(this.$el);
        // console.log('虚拟文档节点------>',this.$fragment);
        this.compileElement(this.$fragment);
        this.$el.appendChild(this.$fragment);
    }else{
        console.log('DOM不存在')
    }
}

Compile.prototype = {
    /**
     * node2Fragment  将真实的DOM转换为虚拟的文档碎片
     *      @param {*} el  真实的DOM节点
     *      createDocumentFragment 创建虚拟的DOM节点
     */
    node2Fragment:function(el){
        var fragment = document.createDocumentFragment(),
            child = el.firstChild;
        // console.log('第一个节点的虚拟节点----->',fragment);
        while(child){
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    },
    /**
     * compileElement 解析虚拟的文档碎片
     * isElementNode  元素节点，则compile解析，元素中绑定数据，如v-text,v-model等
     * isTextNode     文字节点，则compiletext解析，如，绑定数据的节点{{}}
     * childNodes     子节点，则递归解析compileElement解析 
     */
    compileElement:function(el){
        //childNodes 属性返回节点的子节点集合
        //      <input type="text" v-model="word"><p>{{word}}</p><button v-on:click="sayHi">change data</button> 
        //      childNodes为[text, input, text, p, text, button, text]
        var childNodes = el.childNodes,
            me = this;
        [].slice.call(childNodes).forEach(function(node){
            // \{\{(.+?)\}\} 花括号{}是正则里的限定符.
            // \ 将下一个字符标记为或特殊字符、或原义字符、或向后引用、或八进制转义符
            // 标记限定符表达式的开始。要匹配 {，请使用 \{
            // "."表示任意字符，"*"匹配前面的子表达式零次或多次
            // 该正则表达式表示匹配 {{任意字符}} 
            var reg = /\{\{(.*)\}\}/;
            var text = node.textContent;
            if(node.nodeType == 1){
                // console.log('节点解析----->',node);
                me.compile(node);
            }else if(node.nodeType == 3 && reg.test(text)){
                // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
                // console.log('文字节点解析----->',node);
                me.compiletext(node,RegExp.$1);
            }
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        })
    },
    /**
     * compile 解析元素节点
     * eg. 指令以 v-xxx 命名，<span v-text = "content"></span>中指令为v-text
     */
    compile:function(node){
        var nodeAttrs = node.attributes,
            me = this;
        [].slice.call(nodeAttrs).forEach(function(attr){
            var attrName = attr.name; //v-text
            if(attrName.indexOf('v-') == 0){//是否v-绑定数据
                var exp = attr.value; //content
                var dir = attrName.substring(2); //text
                if (dir.indexOf('on:') == 0) {//是否绑定事件
                    // console.log('eventHandler的参数--------->',node,me.vm,exp,dir);
                    me.eventHandler(node,me.vm,exp,dir);
                }else if(dir.indexOf('model') == 0){//是否绑定model
                    me.modelHandler(node,me.vm,exp);
                }
            }
        })
    },
    /**
     * compiletext: 解析文本节点{{}}绑定数据的那种
     */
    compiletext: function(node,exp){
        var me = this,
            initText = this.vm[exp];
        this.updatetext(node,initText);
        new Watcher(this.vm,exp,function(val){
            me.updatetext(node,val);
        })
    },  
    updatetext:function(node,val){
        node.textContent = typeof val == 'undefined' ? '':val;
    },
    /**
     * eventHandler: 监听事件
     */
    eventHandler: function(node,vm,exp,dir){
        var eventType = dir.split(':')[1];
        // console.log(vm,'其中的mthods----->',vm.mthods);
        var cb = vm.$options && vm.$options.methods && vm.$options.methods[exp];
        if (eventType && cb) {
            node.addEventListener(eventType,cb.bind(vm),false);
        }
    },
    /**
     * modelHandler: 将绑定v-model的元素添加入订阅者列表，同时添加input事件
     * 其实这里，真实的vue还应该绑定有选择等事件，对应下拉菜单的选择等
     */
    modelHandler: function(node,vm,exp,dir){
        var me = this,
            val = this.vm[exp];
        this.modelUpdater(node,val);
        new Watcher(me.vm,exp,function(value){
            me.modelUpdater(node,value);
        });
        node.addEventListener('input',function(e){
            var newValue = e.target.value;
            if(val === newValue){return;}
            me.vm[exp] = newValue;
            val = newValue;
        })
    },
    /**
     * modelUpdater: 更新节点的值
     */
    modelUpdater: function(node,val){
        node.value = typeof val == 'undefined' ? '':val;
    },
}