$(function(){
  // zepto里面的拦截器
  //使用zepto里面的ajax中的beforeSend来实现路由的拼接
  // 定义一个前缀相同的路由
  var baseURL = 'http://157.122.54.189:9094/api/public/v1/';
  // 添加zepto里面的拦截器，让每一个ajax请求都经过这个函数处理加工
  $.ajaxSettings.beforeSend=function(xhr,obj){
    //调用ajax.Settings里面 的beforeSend方法，里面有两个参数
  // 可以查看每个ajax中的url请求路径  ，实现url的拼接
    // console.log(obj);
    obj.url=baseURL+obj.url;
    
  }

  //mui中的点击事件，不使用click而是自己封装tap
  mui('body').on('tap', 'a', function (e) {
    e.preventDefault()
    window.top.location.href = this.href;
  });
})