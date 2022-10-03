$(function () {
    const layer = layui.layer
    const form = layui.form
    // 先声明一个查询的对象
    const q = {
        pagenum: 1,   //当前页码数
        pagesize: 2,  //当前页需要的数据条数
        cate_id: '',  //文章分类id
        state: ''    //文章状态(可选值"已发布"或"草稿")
    }
    getArticleList()
    getArticleCate()
    // 获取文章列表
    function getArticleList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.status !== 0) return layer.msg(res.message)
                // 渲染文章列表
                const str = template('tpl-AticleList', res)
                $('tbody').html(str)
                renderPage()
            }
        })
    }

    // 时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const nowTime = new Date(date)
        const year = nowTime.getFullYear()
        const month = (nowTime.getMonth() + 1 + '').padStart(2, '0')
        const day = (nowTime.getDate() + '').padStart(2, '0')
        const hh = (nowTime.getHours() + '').padStart(2, '0')
        const mm = (nowTime.getMinutes() + '').padStart(2, '0')
        const ss = (nowTime.getSeconds() + '').padStart(2, '0')

        return `${year}-${month}-${day}  ${hh}:${mm}:${ss}`
    }

    // 获取文章分类
    function getArticleCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) return layer.msg(res.message)
                // 渲染文章分类
                // console.log(res)
                const str = template('tpl-AticleCase', res)
                // console.log(str)
                $('[name=cate_id]').html(str)
                form.render()
            }
        })
    }

    // 为表单添加提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单的值
        const cate_id = $('[name=cate_id]').val()
        const state = $('[name=state]').val()
        // 把获取到的值赋值给查询的对象
        q.cate_id = cate_id
        q.state = state
        // 根据筛选的条件重新渲染列表
        getArticleList()
    })

    // 渲染分页
    function renderPage(total) {

    }





    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len)
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    getArticleList()
                }
            })

            layer.close(index)
        })
    })
})