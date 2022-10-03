$(function () {
    const layer = layui.layer
    const form = layui.form
    let indexAdd = null
    let indexEdit = null
    // 封装渲染列表函数
    function getArticleList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success(res) {
                // console.log(res)
                // 获取到数据以后调用template模板渲染页面
                const str = template('tpl-articleCates', res)
                $('tbody').html(str)
            }
        })
    }
    getArticleList()

    // 点击添加类别对列表进行修改
    $('#addCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dislog-add').html()
        })
    })

    // 表单添加点击事件，用事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // 获取请求
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                getArticleList()
                // 添加完以后弹出层消失
                layer.close(indexAdd)
            },
            error(err) {
                console.log(err)
            }
        })
    })

    // 点击编辑按钮修改文字分类
    $('tbody').on('click', '.btnEdit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dislog-edit').html()
        })

        // 拿到每个编辑按钮对应的id
        const id = $(this).attr('data-id')
        $.ajax({
            type: 'GET',
            url: `/my/article/cates/${id}`,
            success(res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 给编辑的表单添加提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                // 关闭弹窗并且重新渲染列表
                layer.close(indexEdit)
                getArticleList()
            }
        })
    })

    // 删除文章列表
    $('tbody').on('click', '.btnDel', function () {
        const id = $(this).attr('data-id')
        layer.confirm('确认删除文章列表吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: `/my/article/deletecate/${id}`,
                success(res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                    getArticleList()
                    layer.close(index)
                }
            })
        })
    })
})