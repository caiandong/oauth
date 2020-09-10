const router = require('koa-router')();
const routers = router
    .get('/', async(ctx) => {
        const title = 'login home';
        await ctx.render('home', { //{}为传递的数据对象
            title
        })
    })

module.exports = router;