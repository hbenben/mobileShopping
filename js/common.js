$(function () {
  // zepto里面的拦截器
  //使用zepto里面的ajax中的beforeSend来实现路由的拼接
  // 定义一个前缀相同的路由
  var baseURL = 'http://157.122.54.189:9094/api/public/v1/';
  // 添加zepto里面的拦截器，让每一个ajax请求都经过这个函数处理加工
  $.ajaxSettings.beforeSend = function (xhr, obj) {
    //调用ajax.Settings里面 的beforeSend方法，里面有两个参数
    // 可以查看每个ajax中的url请求路径  ，实现url的拼接
    // console.log(obj);
    obj.url = baseURL + obj.url;
    // 在访问私有路径的时候，手动的将token值传递给服务器，要判断一下是否访问素有路径
    // 值如何传递：通过请求头的方式将token值传递给服务器
    if (obj.url.indexOf('/my/') != -1) {
      xhr.setRequestHeader('Authorization', sessionStorage.getItem('pyg_token'))
    }

  }

  //mui中的点击事件，不使用click而是自己封装tap
  // // 默认情况 下，mui不响应click单击事件，这是它的默认行为
  // 我们解决方式就是重新为所有A绑定tap
  mui('body').on('tap', 'a', function (e) {
    e.preventDefault()
    window.top.location.href = this.href;
  });
  // complete：请求完成时触发
  $.ajaxSettings.complete = function () {
    // 在这边我们想拼接url
    $('body').removeClass('loadding')
  }
  //先动态扩展zepto成员,在全局使用$.getParameter方法
  $.extend($,{
    getParameter:function(url){
      var obj = {}
      // location.search:url中?及?后面的内容
      url = url.substring(1) //cid=5&name=jack
      // 先按&拆分
      var arr = url.split('&') //['cid=5','name=jack']
      // 遍历进行第二次拆分
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i].split('=') //['cid',5]
        obj[temp[0]] = temp[1] // obj['cid'] = 5
      }
      return obj
    }
  })
})