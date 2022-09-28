$(function () {
    const form = layui.form

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新密码和原密码不能相同
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一致'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    // 重置密码提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        // console.log('ok')
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg('密码更新失败')
                }
                layui.layer.msg('密码更新成功')
                $('.layui-form')[0].reset()
            },
            error(err) {
                console.log(err)
            }
        })
    })
})