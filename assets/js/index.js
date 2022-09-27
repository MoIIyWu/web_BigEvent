$(function () {
    const layer = layui.layer
    // 封装获取用户信息函数
    function getUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }
                // console.log(res)
                // 获取到用户信息以后开始渲染用户的头像
                getUserAvatar(res.data)
            },
            // complete(res){
            //     console.log(res)
            // }
        })
    }
    getUserInfo()

    // 渲染用户头像
    function getUserAvatar(data) {
        // 获取用户的昵称
        const name = data.nickname || data.username
        // 设置欢迎的文本
        $('#welcome').html(`欢迎${name}`)
        // 设置用户的头像，如果用户设置了头像就显示头像，如果没设置就显示昵称的第一个字母转大写
        if (data.user_pic !== null) {
            $('.layui-nav-img').attr('src', data.user_pic).show()
            $('.text-avatar').hide()
        }
        $('.layui-nav-img').hide()
        $('.text-avatar').html(name[0].toUpperCase()).show()
    }

    // 点击按钮退出
    $('#btnLoginOut').on('click', function () {
        // 点击后出现弹窗
        layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 点击确认以后情况本地存储的token，然后跳转到index.html
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index)
        })
    })
})