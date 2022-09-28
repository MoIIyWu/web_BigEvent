$.ajaxPrefilter(function (options) {
    // console.log(options.url)   //  /api/login
    options.url = `http://big-event-api-t.itheima.net${options.url}`
    // console.log(options.url)

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