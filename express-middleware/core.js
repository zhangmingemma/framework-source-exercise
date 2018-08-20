/**
 * Express的中间件使用案例
 */
// let express = require('express')
// let app = express()
// app.use(bodyParser.json())
// app.use(cookieParser())
// app.get('/hello',function(req,res){res.send('Hello World');}) 


/** 
 * 模拟中间件机制并且模拟实现解析request的中间件
 */
function App(){
    if(!(this instanceof App)){
        return new App();
    }
    this.init();
}
App.prototype = {
    constructor: App,
    /** 
     * init: 初始化
     */
    init: function(){
        this.request = {
            requestLine: 'POST /iven_ HTTP/1.1',//请求行
            headers: 'Host:www.baidu.com\r\nCookie:BAIDUID=E063E9B2690116090FE24E01ACDDF4AD:FG=1;BD_HOME=0',//请求体
            requestBody: 'key1=value1&key2=value2&key3=value3',//请求体
        };
        this.response = {}; //模拟response
        this.chain = []; //存储中间件
        this.index = 0; //当前执行的中间件在chain中的位置
    },
    /** 
     * use: 将中间件添加至中间件列表
     */
    use: function(hanler){
        this.chain.push(hanler); // 默认handler是函数，这里不做判断
    },
    /** 
     * next: 执行当前中间件，索引增加
     */
    next: function(){ // 调用next执行index所指向的中间件
        if(this.index >= this.chain.length){
            return;
        }
        let middleware = this.chain[this.index];
        this.index++;
        middleware(this.request,this.response,this.next.bind(this));
    }
}

/**
 * LineParser: 请求行解析
 *
 * @param {*} req  请求
 * @param {*} next next执行
 */
function lineParser(req,res,next){
    let items = req.requestLine.split(' ');
    req.method = items[0];
    req.url = items[1];
    req.version = items[2];
    next();
}

/**
 * headerParser: 请求头解析
 *
 * @param {*} req
 * @param {*} next
 */
function headerParser(req,res,next){
    let items = req.headers.split('\r\n');
    let header = {};
    for(let i in items){
        let item = items[i].split(':');
        let key = item[0];
        let value = item[1];
        header[key] = value;
    }
    req.header = header;
    next();
}

/**
 * bodyParser: 请求体解析
 *
 * @param {*} req
 * @param {*} next
 */
function bodyParser(req,res,next){
    let items = req.requestBody.split('&');
    let body = {};
    for (let i in items) {
        let item = items[i].split('=');
        let key = item[0];
        let value = item[1];
        body[key] = value;
    }
    req.body = body;
    next();
}

/**
 * middleware: 输出
 *
 * @param {*} req
 * @param {*} next
 */
function middleware(req,res,next){
    console.log('url: '+req.url);
    console.log('methond: '+req.methond);
    console.log('version: '+req.version);
    console.log('header: ',req.header);
    console.log('body: ',req.body);
    next();
}

