$(function () {
  // renderMainData();
  // 右侧栏点击搜索触发搜索效果
  //这个是将数据用ajax传给后台的数据
  //①getParameter()获取的是客户端设置的数据。 
  // getAttribute() 获取的是服务器设置的数据。② getParameter() 永远返回字符串
  // getAttribute() 返回值是任意类型
  var data = {
    cid: getParameter(location.search).cid,
    pagenum: 1,
    pagesize: 10
  }
  //  获取数据
  function renderMainData(callback, obj) {
    $.ajax({
      type: 'get',
      url: 'goods/search',
      //jQuery.extend() 函数用于将一个或多个对象的内容合并到目标对象。
      // 2. 如果多个对象具有相同的属性， 则后者会覆盖前者的属性值。
      data: $.extend(data, obj),
      dataType: 'json',
      success: function (result) {
        callback(result);

      }
    })
  }
  // 下拉刷新和上拉加载
  mui.init({
    swipeBack: false,
    pullRefresh: {
      container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      // down:说明这是下拉的初始化
      down: {
        height: 50, //可选,默认50.触发下拉刷新拖动距离,
        auto: true, //可选,默认false.首次加载自动下拉刷新一次
        contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        // 下面这个回调函数在下拉松开手指之后会触发
        callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          data.pagenum = 1
          renderMainData(function (result) {
            var html = template('goodslistTemp', result.data)
            $('.goods_wrap').html(html)
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            // 为了防止切换分类的时候，无法再上拉，所以在每次刷新的时候将上拉加载重新启用
            mui('#refreshContainer').pullRefresh().refresh(true)
          })
        }
      },
      // 上拉加载更多数据
      up: {
        height: 50, //可选.默认50.触发上拉加载拖动距离
        auto: false, //可选,默认false.自动上拉加载一次
        contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
        callback: function () {
          data.pagenum++
          renderMainData(function (result) {
            if (result.data.goods.length > 0) {
              var html = template('goodslistTemp', result.data)
              $('.goods_wrap').append(html)
              mui('#refreshContainer').pullRefresh().endPullupToRefresh();
            } else {
              mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
            }
          })
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      }
    }
  });

  function getParameter(url) {
    var obj = {};
    //获取location.search.url中？后面的内容
    //substring() 方法用于提取字符串中介于两个指定下标之间的字符。
    url = url.substring(1);
    //然后使用&进行拆分，
    var arr = url.split('&');
    // 遍历第二次进行拆分for
    for (var i = 0; i < arr.length; i++) {
      var temp = arr[i].split('=');
      obj[temp[0]] = temp[1];
    }
    return obj;
  }

  //搜索功能的展示
  $('.query_btn').on('tap', function () {

    //展开运算符+对象解构
    var obj = {};
    obj.query = $('.query_txt').val();

    renderMainData(function (result) {
      console.log(result);

      var html = template('searchListTemp', result.data)
      $('.search_list').html(html)
    }, obj)
  })

})