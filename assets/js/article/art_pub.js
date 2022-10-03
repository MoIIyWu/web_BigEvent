$(function () {
    const layer = layui.layer
    const form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 获取文章分类
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) return layer.msg(res.message)
                // 渲染文章分类列表
                const str = template('tpl-cate', res)
                $('[name=cate_id]').html(str)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮添加绑定事件
    $('#btnchooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件，判断用户是否选择了文件
    $('#coverFile').on('change', function (e) {
        const files = e.target.files
        if (files.length) {
            var newImgURL = URL.createObjectURL(files[0])
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        }
    })

    let art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 监听表单的提交事件，创建FormData对象，获取到表单里面的值
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        const fd = new FormData($(this)[0])
        // 将art_state属性追加到fd里面去
        fd.append('state', art_state)

        // 遍历fd对象，查看是否有对应的值
        // fd.forEach((k, v) => console.log(k, v))

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到fd中
                fd.append('cover_img', blob)
                // 发起ajax请求
                pulisherArticle(fd)
            })
    })

    // 发布文章
    function pulisherArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是FormData格式的数据，必须添加下面两项
            contentType: false,
            processData: false,
            success(res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                // 发布文章成功以后跳转到文章列表的页面
                location.href = '/article/art_list.html'
            }
        })
    }
})