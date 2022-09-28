$(function () {
    const layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传图片的按钮
    $('#btnCloseImage').on('click', function () {
        $('#file').click()
    })

    // 为文件选择绑定change事件
    $('#file').on('change', function (e) {
        // console.log(e)  //e.target  ->  files : FileList {0: File, length: 1}
        const fileList = e.target.files
        if (fileList.length === 0) {
            return layer.msg('请选择要上传的图片')
        }
        //  用户选择了图片以后，更换裁剪的图片
        const file = e.target.files[0]
        const newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 给确定按钮绑定事件，用户点击确定按钮后调用获取剪裁后的图片的方法，然后发起请求上传头像
    $('#btnUpLaod').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })
    })
})