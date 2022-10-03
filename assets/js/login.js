$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui里面获取form表单对象
    const form = layui.form
    const layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // 比较两次输入框的值
            const pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 注册表单，给表单添加提交事件
    $('#form-reg').on('submit', function (e) {
        e.preventDefault()
        // 发起ajax的请求,如果注册成功就跳转到登录页面
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: `${$('#form-reg [name = username]').val()}`,
                password: `${$('#form-reg [name = password]').val()}`,
            },
            success(res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('注册成功，请登录')    //Q123456 Q123456
                $('#link_login').click()
            }
        })
    })

    // 获取登录表单，发起请求，登录成功后本地保存token的值,然后跳转到主页
    $('#login-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success(res) {
                console.log(res)
                if (res.status !== 0) return layer.msg('登录失败')
                layer.msg('登录成功')
                localStorage.setItem('token', res.token)
                location.href = './index.html'
            },
            error(err){
                console.log(err)
            }
        })
    })
})