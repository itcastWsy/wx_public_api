var express = require('express');
var router = express.Router();
var jsSHA = require('jssha');

// 你的token值
var token = "6d05aedab138be6bbbf40b41d65a45ec";
router.get('/', function (req, res, next) {
  //自定移动token，要与微信公众号里设置的一致
  //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
  var signature = req.query.signature,//微信加密签名
    timestamp = req.query.timestamp,//时间戳
    nonce = req.query.nonce,//随机数
    echostr = req.query.echostr;//随机字符串
  //2.将token、timestamp、nonce三个参数进行字典序排序
  var array = [token, timestamp, nonce];
  array.sort();
  //3.将三个参数字符串拼接成一个字符串进行sha1加密
  var tempStr = array.join('');
  var shaObj = new jsSHA('SHA-1', 'TEXT');
  shaObj.update(tempStr);
  var scyptoString = shaObj.getHash('HEX');
  //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (signature === scyptoString) {
    console.log('验证成功')
    res.send(echostr);
  } else {
    console.log('验证失败')
    res.send('验证失败');
  }
});
router.post('/', function (req, res, next) {
  console.log(req.body.xml);
  let { tousername } = req.body.xml;
  let { fromusername } = req.body.xml;
  let { createtime } = req.body.xml;
  let { msgtype } = req.body.xml;
  let { content } = req.body.xml;
  let { msgid } = req.body.xml;
  let time = (new Date()).toLocaleString();
  // 返回类型是 xml
  res.writeHeader(200, {
    'Content-Type': 'text/xml;charset=utf-8'
  })
  // 返回内容
  res.end(
    `
    <xml>
    <ToUserName><![CDATA[${fromusername}]]></ToUserName>
    <FromUserName><![CDATA[${tousername}]]></FromUserName>
    <CreateTime>1557223367</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${time}]]></Content>
  </xml>
    `

  );
});


module.exports = router;
