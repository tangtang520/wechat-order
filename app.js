//var express = require('express');
//var http = require('http');
//var path = require('path');
//var request = require('request');
//var crypto = require('crypto');
//var later = require('later');
//var favicon = require('static-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//var routes = require('./routes');
//var users = require('./routes/user');
//var adminRoutes = require('./routes/adminRoutes');
//var interface = require('./routes/interface');
//var app = express();
//var log4js = require('log4js');
////引用获取图片
//var GetImage = require('./bin/login/getImage');
//app.set('port', process.env.PORT || 3000);
//app.use(express.cookieParser());
//app.use(express.session({secret: '1ebe1425ffd78fa360b1d26314670d34', cookie: { httpOnly: true,maxAge: 100 * 100 * 100000 }}));
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
//app.use(cookieParser());
//app.use('/public',express.static(path.join(__dirname, 'public')));
//app.use('/output',express.static(path.join(__dirname, 'output')));
//app.use('/haveFile',express.static(path.join(__dirname, 'haveFile')));
//app.all('/',adminRoutes.index);
//app.all('/page', adminRoutes.action);
//app.all('/interface',interface.action);
//app.all('/getImage',GetImage.getImage);
//module.exports = app;
//http.createServer(app).listen(app.get('port'), function(){
//    console.log('Express server listening on port ' + app.get('port'));
//});
//
//
var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var crypto = require('crypto');
var later = require('later');
var wechat = require('wechat');
var API = require('wechat-api');
var api = new API('wx2a3767e2a57da7cb', '1ebe1425ffd78fa360b1d26314670d34');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/user');
var adminRoutes = require('./routes/adminRoutes');
var interface = require('./routes/interface');
var ProcessDBProvider = require('./modules/DataProvider').PasspoadDBProvider;
var txtMenuProvider = new ProcessDBProvider('txtMenu');
var imgMenuProvider = new ProcessDBProvider('imgMenu');
var callFoodPerProvider = new ProcessDBProvider('callFoodPer');
var infoProvider = new ProcessDBProvider('info');
var writeMenuProvider = new ProcessDBProvider('writeMenu');
var app = express();
var log4js = require('log4js');
//引用获取图片
var GetImage = require('./bin/login/getImage');
//var mongoose = require('mongoose');   //1
app.set('port', process.env.PORT || 12333);
app.use(express.cookieParser());
app.use(express.session({secret: '1ebe1425ffd78fa360b1d26314670d34', cookie: { httpOnly: true,maxAge: 100 * 100 * 100000 }}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/output',express.static(path.join(__dirname, 'output')));
app.use('/haveFile',express.static(path.join(__dirname, 'haveFile')));
var j;
var i=0;
var k = 0;
var a = 0;
var ll;
//就是轮流从头设置为点餐人（这块逻辑最后优化），单独给这个人发消息，请他设置菜单和同意点餐
function choosePer(){
    console.log("到时间了看看进来了么");
    txtMenuProvider.find({},{},function(err,resultKu){
        if(err){

        }else{
            imgMenuProvider.find({},{},function(err,resultImg){
                if(err){

                }else{
                    if((resultImg=="")&&(resultKu=="")){
                        console.log("查找数据库进来");
                        //i++;
                        infoProvider.find({},{},function(err,resultGuan){
                            if(err){
                                console.log("err--->>",err);
                            }else{
                                if(resultGuan==""){

                                }else{
                                    console.log("发送！！！！！！");
                                    console.log("length--->>>",resultGuan.length);
                                    if(k==(resultGuan.length)){
                                        k=0;
                                    }
                                    console.log("kkkk01--->>>",k);
                                    //function ss(){
                                    //    var data = new Date();
                                    //    var hour = data.getHours();
                                    //    var minute = data.getMinutes();
                                    //    var second = data.getSeconds();
                                    //}
                                    //tt = setInterval(ss,1*1000);
                                    if(k<resultGuan.length){
                                        console.log("第"+(k+1)+"次"+"给"+resultGuan[k].name+"发信息,他的验证码为"+resultGuan[k].code);
                                        api.sendText(resultGuan[k].code, '可以设置菜单了，你可以点击设置-上传菜单，来设置菜单', function(err,resultqq){
                                        });
                                    }
                                    k++;
                                    console.log("kkkk02--->>>",k);
                                }
                                //console.log("id--->>>",id);
                                //var data01 = new Date();
                                //var hour01 = data01.getHours();
                                //var minute01 = data01.getMinutes();
                                //if(minute01==0||minute01==30){
                                //    api.sendText(resultGuan[k].code, 'Hello world', function(err,resultqq){
                                //    });
                                //}
                                //if(i % 3 ==0){
                                //    k++;
                                //}


                            }
                        });
                    }else{
                        console.log("aaaaaa");
                        clearInterval(j);
                        console.log("bbbbbbb");
                        infoProvider.find({},{},function(err,resultsendAll){
                            if(err||resultsendAll==""){
                                console.log("ccccccccc");
                            }else{
                                ll = setInterval(zzz, 5*1000);
                                function zzz(){
                                    if(a<resultsendAll.length){
                                        api.sendText(resultsendAll[a].code, '现在可以点餐了，请大家尽快点餐', function(err,resultAllInfo){
                                        });
                                        a++;
                                    }else{
                                        a = 0;
                                        clearInterval(ll);
                                        console.log("qxqxqxqxq");
                                    }

                                }
                            }
                        })
                    }
                }
            })
        }
    })

}
//到一定时间开始轮流设置点餐人
function c(){
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var we = date.getDay();
    //console.log("date-->>>",date);
    //console.log("hour-->>>",hour);
    //console.log("minute--->>>",minute);
    if((hour==10&&minute==15&&second==4)&&(we!=6&&we!=0)){
        console.log("到了");
        j = setInterval(choosePer, 1200*1000);
        //zz.clear();
    }
    if((hour==17&&minute==29&&second==4)&&(we!=6&&we!=0)){
        clearInterval(j);
    }
}
later.date.localTime();
var sched = later.parse.recur().every(1).second(),
    zz = later.setInterval(c, sched);

var config = {
    token: 'wechat',
    appid: 'wx2a3767e2a57da7cb',
    encodingAESKey: 'ihIKEsTfLjByQ0JYxWNdYMOMWJyda0UPt8DEg95hDoZ'
};
//点餐时间到，请给点餐人发消息，点餐已经结束，并且自动把进入的点餐记录发给此人，请此人电话订餐
var ff;
var temp = [];
function allTime(){
    var dateAll = new Date();
    var hourAll = dateAll.getHours();
    var minuteAll = dateAll.getMinutes();
    var secondAll = dateAll.getSeconds();
    var we = dateAll.getDay();
    //console.log("data--->>>",dateAll);
    //console.log("hourAll--->>>",hourAll);
    //console.log("minuteAll--->>>",minuteAll);
    if((hourAll==18&&minuteAll==1)&&(we!=6&&we!=0)){
        writeMenuProvider.find({},{},function(err,resultShowMenu){
            if(err||resultShowMenu==""){
                //console.log("11111111");
                callFoodPerProvider.find({},{sort: [['_id', -1]]},function(err,resultrr){
                    if(err||resultrr==""){
                        //console.log("err------>>>");
                    }else{
                        //console.log("code-->>>",resultrr[0].userId);
                        api.sendText(resultrr[0].userId,'目前没有人点餐',function(err,resultqsq){
                        })
                    }
                })
            }else{
                callFoodPerProvider.find({},{sort: [['_id', -1]]},function(err,resultShowPer){
                    if(err||resultShowPer==""){
                        //console.log("222222222");
                    }else{
                        //console.log("333333333");
                        for(var i=0;i<resultShowMenu.length;i++){
                            allContent = resultShowMenu[i].name+":"+resultShowMenu[i].txt+"\n";
                            temp.push(allContent);
                            //console.log("temp--->>>",temp.length);
                            //console.log("allContent--->>>",temp);
                            var stringTeam = "今日已点菜单信息:"+"\n"+temp.join("")
                            //console.log("stringTeam--->>>",stringTeam);
                        }
                        //console.log("444444444");
                        api.sendText(resultShowPer[0].userId,stringTeam,function(err,resultqqqq){
                            console.log("ccccccccccc");
                        })
                    }
                })
            }
        })
    }
}

ff = setInterval(allTime,60*1000);
var allContent;
////离点餐结束30分钟和10分钟分别在给没有点餐的同学发点餐提醒，如果同学回复今日不点餐，则下次提醒不用给此人发通知了
var jt;
var ee;
var bb = 0;
function odd(){
    var date001 = new Date();
    var hour001 = date001.getHours();
    var minute001 = date001.getMinutes();
    var second001 = date001.getSeconds();
    var we = date001.getDay();
    //console.log("date001--->>>",date001);
    //console.log("hour001--->>>",hour001);
    //console.log("minute001--->>>",minute001);
    if((hour001==3&&(minute001==1))){
        var httpArry = ['http://wechat.getter.top/interface?command=endMenu',
            'http://wechat.getter.top/interface?command=weixinDel',
            'http://wechat.getter.top/interface?command=weixinImgMenuDel',
            'http://wechat.getter.top/interface?command=senMenuPer',
            'http://wechat.getter.top/interface?command=noDoMenu'
        ]
        for(var i=0;i<httpArry.length;i++){
            request(httpArry[i], function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body) // Print the google web page.
                }
            })
        }
    }
    if(((hour001==17&&minute001==30)||(hour001==17&&minute001==50))&&(we!=6&&we!=0)){
        infoProvider.find({isOrder:0},{},function(err,result001){
            if(err||result001==""){
                //console.log("11");
            }else{
                //console.log("12112");
                ee = setInterval(hhh, 10*1000);
                function hhh(){
                    if(bb<result001.length){
                        //console.log("bbb__..",bb);
                        api.sendText(result001[bb].code, '你还没有点餐,请尽快点餐,六点之后将不再提供点餐服务(你的点餐内容不会发送给点餐人)', function(err,resultAllInfo){
                        });
                        bb++;
                        //console.log("bbb01__..",bb);
                    }else{
                        bb=0;
                        clearInterval(ee);
                        //console.log("qxqxqxqxq");
                    }
                }
            }
        })
    }
}
jt = setInterval(odd,60*1000);

//菜单列表
//var menu = {
//    "button":[
//        {
//            "name":"今日菜单",
//            "sub_button":[
//                {
//                    "type":"click",
//                    "name":"今日点餐人",
//                    "key":"今日点餐人"
//                },
//                {
//                    "type":"view",
//                    "name":"今日菜单",
//                    "url":"http://ch.dev.selcome.com/page?command=allMenu"
//                },
//                {
//                    "type":"view",
//                    "name":"图片菜单",
//                    "url":"http://ch.dev.selcome.com/page?command=imgMenu"
//                },
//                {
//                    "type":"view",
//                    "name":"文字菜单",
//                    "url":"http://ch.dev.selcome.com/page?command=txtMenu"
//                },
//                {
//                    "type":"click",
//                    "name":"时间",
//                    "key":"时间"
//                }
//            ]
//        },
//        {
//            "name":"已点菜单",
//            "sub_button":[
//                {
//                    "type":"click",
//                    "name":"今日点餐人",
//                    "key":"今日点餐人"
//                },
//                {
//                    "type":"view",
//                    "name":"已点菜单",
//                    "url":"http://ch.dev.selcome.com/page?command=showAllMenu"
//                },
//                {
//                    "type":"click",
//                    "name":"时间",
//                    "key":"时间"
//                }
//            ]
//        },
//        {
//            "name":"设置",
//            "sub_button":[
//                {
//                    "type":"view",
//                    "name":"本微信后台说明",
//                    "url":"ch.dev.selcome.com/page?command=sayInfo"
//                },
//                {
//                    "type":"view",
//                    "name":"注册信息",
//                    "url":"http://ch.dev.selcome.com/page?command=newPerMessage"
//                },
//                {
//                    "type":"view",
//                    "name":"上传菜单",
//                    "url":"http://ch.dev.selcome.com/page?command=doMenu"
//                },
//                {
//                    "type":"view",
//                    "name":"通讯录",
//                    "url":"http://ch.dev.selcome.com/page?command=doBook"
//                },
//                {
//                    "type":"view",
//                    "name":"点餐",
//                    "url":"http://ch.dev.selcome.com/page?command=doAllFood"
//                }
//            ]
//        }
//    ]
//}
var menu = {
    "button":[
        {
            "type":"click",
            "name":"今日歌曲",
            "key":"V1001_TODAY_MUSIC"
        },
        {
            "name":"菜单",
            "sub_button":[
                {
                    "type":"view",
                    "name":"搜索",
                    "url":"http://www.soso.com/"
                },
                {
                    "type":"click",
                    "name":"赞一下我们",
                    "key":"V1001_GOOD"
                }]
        }]
}

//创建菜单
    api.createMenu(menu, function(err,result){
    console.log('创建菜单进来了么');
    console.log(result);
    console.log('创建菜单');
});
//新成员加入每隔多长时间发送的内容
var articles = [
    {
        "title":"亲！你注册个人信息了么",
        "picurl":"http://tangtangjingjing.qiniudn.com/question.jpg"
    },
    {
        "title":"我已注册，回复数字0不在发送本条信息",
        "picurl":"http://tangtangjingjing.qiniudn.com/2399581_144428003_2.jpg"
    },
    {
        "title":"我还没注册，点击这里即可注册",
        "url":"http://ch.dev.selcome.com/page?command=newPerMessage",
        "picurl":"http://tangtangjingjing.qiniudn.com/20111006205037_5PLcK.thumb.700_0.jpg"
    }];

app.use(express.query());
var t;
console.log('11111');
app.use('/weixin', wechat(config, function (req, res, next) {
//
//    // 微信输入信息都在req.weixin上

    var message = req.weixin;
    var username = message.FromUserName;
    var content = message.Content;
    console.log("message--->>>",message);
    if(message.Event == "subscribe"){
        //推送欢迎语
        res.reply(articles);
    }
//    //设置关注微信号的提示语
    if(message.Content=='注册码'){
        res.reply(message.FromUserName);
    }
//    //点击时间回复时间
    if(message.EventKey=='时间'){
        var timestamp=new Date().getTime();
        var date = new Date(timestamp);
        Y = date.getFullYear();
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        D = date.getDate();
        h = date.getHours();
        m = date.getMinutes();
        s = date.getSeconds();
        var getTime = "现在时间为:"+Y+"年"+M+"月"+D+"日"+h+"时"+m+"分"+s+"秒";
        console.log("all-->>>",getTime);
        res.reply(getTime);
        //res.reply([
        //    {
        //        title: '内心独白',
        //        description: '只想安静的望着窗外飘过的每一朵雪花，感受它落在心底时的甘甜与清爽，就这样，这样，直到天昏，在泛黄路灯照耀下的雪花发出刺眼的光芒，猛地意识到，冬天来了！',
        //        picurl: 'http://tangtangjingjing.qiniudn.com/weixin.jpg',
        //        url: 'http://tangtang.gitcafe.io/media/card.html'
        //    }
        //]);
    }
//    //点击今日订餐人，发送给用户今日订餐人
    if((message.EventKey=='今日点餐人')&&(message.MsgType=='event')&&(message.Event=='CLICK')){
        callFoodPerProvider.find({},{sort: [['_id', -1]]},function(err,resultTT){
            if(err){
                console.log(err);
            }else{
                if(resultTT==""){
                    var nullInfo = "今日还没人设置菜单";
                    //api.sendText(message.FromUserName,nullInfo,function(err,resultatt){
                    //
                    //})
                    res.reply(nullInfo);
                }else{
                    var lastInfo = "今日点餐人为:"+resultTT[0].name;
                    //api.sendText(message.FromUserName,lastInfo,function(err,resultyya){
                    //})
                    res.reply(lastInfo);
                }
            }

        })
    }

}));
console.log('2222');
app.use(app.router);


console.log('33333');
////////////////////////////
////app.get('/', adminRoutes.index);
app.all('/',adminRoutes.index);
app.all('/page', adminRoutes.action);
app.all('/interface',interface.action);
app.all('/getImage',GetImage.getImage);
//console.log('44444');
//app.all('/weixin',function(req,res,next){
//    if(checkSignature(req.query.signature,req.query.timestamp,
//    req.query.nonce,
//        req.query.echostr
//    )){
//        res.send(req.query.echostr);
//    }else{
//        res.send({'echostr':0});
//    }
//})
//function checkSignature(signature,timestamp,nonce,echostr){
//    var arr = [];
//    arr[0] = 'abc';
//    arr[1] = nonce;
//    arr[2] = timestamp;
//    arr.sort();
//    var shasum = crypto.createHash('sha1');
//    shasum.update(arr.join(''));
//    if(shasum.digest('hex') == signature){
//        return true;
//    }else{
//        return false;
//    }
//}
//console.log('555555');




module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
