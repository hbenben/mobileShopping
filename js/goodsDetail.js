$(function () {



  //初始化滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条，默认为True
  });

  // var test = $.getParameter(location.search);
  // console.log(test);
  //需要传入后台的必须的数据
  var info = {
    cat_id: '',
    goods_id: '',
    goods_name: '',
    goods_number: '',
    goods_price: '',
    goods_small_logo: '',
    goods_weight: ''

  }

  // 发送ajax请求,要注意要从前端传入必须的数据商品的id
  $.ajax({
    type: 'get',
    url: 'goods/detail',
    dataType: 'json',
    data: $.getParameter(location.search), //调用自定义方法，实现从url获取商品列表页的id
    success: function (result) {
      // 为info赋值
      info.cat_id = result.data.cat_id
      info.goods_id = result.data.goods_id
      info.goods_name = result.data.goods_name
      info.goods_number = result.data.goods_number
      info.goods_price = result.data.goods_price
      info.goods_small_logo = result.data.goods_small_logo
      info.goods_weight = result.data.goods_weight
      // console.log(result);
      var html = template('goodsDetailTemp', result.data);
      $('.mui-scroll').html(html)

      //获得slider插件对象，自动轮播，注意要放在ajax请求成功之后，不然容易出现异步的问题，数据未加载成功，宽高度不正确
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
      });

    }
  })

  // 添加商品到购物车
  $('.pyg_cart').on('tap', function () {
    // 1.判断是否有token，如果没有，则重定向到登陆页面
    // 约定使用sessionStorage存储
    var mytoken = sessionStorage.getItem('pyg_token');
    console.log(mytoken);
    

    if (!mytoken) {
      // console.log(11111); 
      
      //将当前路径保存起来，后面登陆成功之后要进行跳转页面，从这里先拿到
      sessionStorage.setItem('redirectUrl', location.href);
      location.href='./login.html?directUrl'+location.href;
      // location.href = './login.html?redirectUrl=' + escape(location.href)
    }
    // 2.如果有token,那么就发送请求
    else {
      $.ajax({
        type: 'post',
        url: 'my/cart/add',
        data: $.getParameter(location.search),
        dataType: 'json',
        success: function (result) {
          // alert('请求')
          console.log(11111111)
          // console.log(location.href);
          
          // 3.接收返回结果，如果是token过期，则重新登陆--重定向到登陆页，401是服务器返回的状态码，就是过期的状态码
          if (result.meta.status === 401) {
            sessionStorage.setItem('redirectUrl', location.href)
            location.href='./login.html'

            // 通过url编码来实现href的传递
            // location.href = './login.html?redirectUrl=' + escape(location.href)
          }
          // 4.如果有效，那么就弹出提示：添加成功，是否查看购物车
          else {
            // 这里是登录成功之后，添加到购物车
            // console.log('ok')
            // 消息弹框
            mui.confirm('添加成功，是否查看购物车？', '温馨提示', ['跳转', '取消'], function (e) {
              // index代表当前按钮的索引，索引从0开始
              if (e.index == 0) {
                // 跳转到购物车页面
                location.href = 'cart.html'
              } else {

              }
            })
          }
        }
      })
    }
  })

})