$(function () {
  //获得slider插件对象，自动轮播
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
  });

  //初始化滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });

  var test=$.getParameter(location.search);
  console.log(test);
  
  // 发送ajax请求,要注意要从前端传入必须的数据商品的id
  $.ajax({
    type:'get',
    url: 'goods/detail',
    dataType:'json',
    data: $.getParameter(location.search),  //调用自定义方法，实现从url获取商品列表页的id
    success:function(result){
      // console.log(result);
      
    }
  })

})