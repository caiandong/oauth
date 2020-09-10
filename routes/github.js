// oAuth 是一个关于授权的开放的网络标准，目前的版本2.0
// 腾讯收购discuz 康盛php 论坛
// 注册一个新网站代价是很大的  QQ登录
// GitHub, qq, 微信, 微博
// 在客户端与服务提供商之间设置了一个授权层
// 客户端将会获取一个accesstoken 令牌
// 拿了令牌就可以去服务提供商取用户数据

// A 客户端将用户导向认证服务器
// B 用户决定是否给予客户端授权
// C 如果用户授权，认证服务器将用户导向客户端指定的重定向URI,并在URI的hash部分给出code
// D 浏览器向资源服务器发出请求，申请令牌
// E 得到令牌 拿着令牌做操作
// access_token
// client_id
// scope 授权范围
// state 当前客户端的状态
// expires_in 超过一段时间，令牌环失效  失效之后再更新令牌环

const router = require('koa-router')()
const config = require('../config')
const fetch = require('node-fetch')
const routes = router
    .get('/login', async (ctx) => {
        // 去到github授权页
        const dataStr = (new Date()).valueOf();
        var path = 
        'https://github.com/login/oauth/authorize';
        path += '?client_id=' + config.client_id;
        path += '&scope=' + config.scope;
        path += '&state=' + dataStr;
        console.log(path)
        // authorize 授权 (注册/申请)一下我们的应用
        ctx.redirect(path)  // 送到授权的中间页
    })
    .get('/oauth/callback', async (ctx) => {
        const code = ctx.query.code
        let path = 
        'https://github.com/login/oauth/access_token';
        const params = {
            client_id: config.client_id,
            client_secret: config.client_secret,
            code: code
        }
        await fetch(path, {  // 没有fetch,需要装node-fetch
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(res => {
            // console.log(res)
            return res.text()  // 获得到的是一个二进制流，转换成文本
        })
        .then(body => {
            const args = body.split('&');
            let arg = args[0].split('=');
            const access_token = arg[1];
            console.log(access_token);
            return access_token;
        })
        .then(async(token) => {
            const url = 
            'https://api.github.com/user?access_token=' + token // token就是oauth令牌环
            console.log(url)
            await fetch(url)
                .then(res => {
                    return res.json()
                })
                .then(res => {
                    console.log(res)
                    ctx.body = res
                })
        })
        // console.log(code)
        // token
    })

module.exports = routes;
