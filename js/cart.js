$(function () {
  // 初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });

  // 封装成一个函数，后面需要调用
  //动态获取购物车的数据
  function init() {
    $.ajax({
      type: 'get',
      url: 'my/cart/all',
      dataType: 'json',
      success: function (result) {
        if (result.meta.status == 401) {
          location.href = '../index.html'
        } else {
          // console.log(result);
          //获取成功之后，解析商品信息,因为商品信息为json字符串，变为对象
          var data = JSON.parse(result.data.cart_info);
          // console.log(data);
          //渲染数据
          var html = template('cartListTemp', {
            list: data
          });
          $('.order_list ul').html(html);
          // 重新对number-box进行初始化，否则不能使用
          mui('.pyg_userNum').numbox()
          calcTotalPrice();
        }
      }
    })
  }
  init();

  //单击编辑变化样式
  $('.cart_adit_btn').on('tap', function () {
    $('body').toggleClass('eleToggle');
    if ($(this).text() == '编辑') {
      $(this).text('完成')
    } else {
      $(this).text('编辑')
      //用户点击完成之后，变成编辑字样，同时，要更新数据
      syncCart($('.order_list_wrapper'))
    }

  })
  //计算总价
  var total
  function calcTotalPrice() {
    // 注意这个方法必须要放在渲染数据完之后，才能进行获取动态数据，不然获取不到
    total = 0;
    //先获取所有商品列表信息，动态生成的数据的信息
    var allOrders = $('.order_list_wrapper');
    //这个是获取到一个对象，数据不正确，需要拿到里面的值
    // console.log(allOrders);
    // 循环遍历对象，获取到自定义属性的数据
    allOrders.each(function (index, value) {
      // console.log(value);
      // 获取到自定义属性数据
      var dataObj = $(value).data('obj');
      // console.log(dataObj);
      //获取属性中的价格，注意自定义属性，使用jQuery返回的是一个对象
      var price = dataObj.goods_price;
      // console.log(price);
      //获取数量，因为用户可以修改数量，所以不能从提交到购物车中的数据来拿到数量。所以要通过属性来获取当前的数量
      var num = $(value).find('#test').val();
      // console.log(num);
      // 计算总价格
      total = total + (price * num);
      // console.log(total);
    })
    //将计算好的价格赋值给总价
    $('.listTotal').text(total);

  }
  //单击编辑计算价格，最后阿静价格毒之歌，注意动态生成的数据，钥匙哟红事件委托
  $('.order_list ul').on('tap', '.pyg_userNum', function () {
    calcTotalPrice()
  })

  //最后同步购物车，要将数据返回给后台
  function syncCart(allList) {
    // allList是需要同步的数据,就是按下编辑完成之后,要进行数据更新
    var list_obj = {};
    //遍历所有商品列表，获取数据
    for (var i = 0; i < allList.length; i++) {
      var data = $(allList[i]).data('obj');
      // console.log(data);
      //的剪辑点击完成之后，要将用户设置的数据赋值给前台
      //这个是将用户选择的商品的数据，重新赋值给data.amout,就是修改data中的amount值,
      data.amount = $(allList[i]).find('#test').val();
      //最后变成键值对，将全部数据赋值给空对象，注意键值对中的键是商品的ID，因为这是后台设计的格式
      list_obj[data.goods_id] = data;
      // console.log(data.amount);
      //然后请求后台，同步数据

    }
    $.ajax({
      type: 'post',
      url: 'my/cart/sync',
      data: {
        'infos': JSON.stringify(list_obj)
      }, //注意后台的数据格式是json字符串
      success: function (result) {
        console.log(result);
        init()
      }
    })
  }

  //删除购物车数据
  $('.pyg_orderDel').on('tap', function () {
    //先要找到保留的商品的信息
    // 获取没有被选择的复选框，使用zepto中的not选择器
    var list = $('.order_list').find("[type='checkbox']").not(':checked').parents('.order_list_wrapper');
    console.log(list);
    syncCart(list);
    init();
  })

})