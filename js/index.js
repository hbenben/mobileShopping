$(function(){
  // console.log(111);
  banner()
})
function banner(){
  $.ajax({
    type:'get',
    url: 'http://157.122.54.189:9094/api/public/v1/home/swiperdata',
    dataType:'json',
    success:function(result){
      console.log(result);
      //动态生成轮播图片
      var bannerHTML = template('bannerTemp',result);
      $('.shopping-banner').html(bannerHTML);
      // 动态生成点标记
      var indicatorHTML=template('indicatorTemp',result);
      $('.shopping-banner-indi').html(indicatorHTML);
      // 初始化轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 2000//自动轮播周期，若为0则不自动播放，默认为0；
      });

    }

  })  
}