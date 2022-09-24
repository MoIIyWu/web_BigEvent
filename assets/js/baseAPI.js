$.ajaxPrefilter(function (options) {
    // console.log(options.url)   //  /api/login
    options.url = `http://www.liulongbin.top:3007${options.url}`
    console.log(options.url)
})