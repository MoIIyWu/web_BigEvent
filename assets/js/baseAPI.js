$.ajaxPrefilter(function (options) {
    // const format2Json = (sourse) => {
    //     let target = {}
    //     // console.log(sourse.split('&'))    //按照&分隔成数组 ['username=1111', 'password=111111', 'repassword=111111']
    //     sourse.split('&').forEach(el => {
    //         // console.log(el)   //username=1111
    //         // 再将每个el按照 = 分隔
    //         // console.log(el.split('='))   //['username', '111']
    //         let kv = el.split('=')
    //         target[kv[0]] = kv[1]
    //         // console.log(target)   //{username: '111', password: '111111', repassword: '111111'}
    //     })
    //     return JSON.stringify(target)
    // }


    // console.log(options.url)   //  /api/login
    options.url = `http://big-event-api-t.itheima.net${options.url}`
    // console.log(options.url)
    // options.contentType = 'application/json',
    //     options.data = options.data && format2Json(options.data)

    // 判断接口中是否有/my，有的话就是有权限的接口，设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 判断用户有没有登录，没有登录的话没有主页的访问权限
    options.complete = function (res) {
        // console.log(res)
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制返回到登录页面,并且强制删除本地的token值
            location.href = '/login.html'
            localStorage.removeItem('token')
        }
    }
})