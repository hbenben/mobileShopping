$(function () {
  render();

  //所有分类数据,变成全局变量，都可以直接使用
  var cateData;

  // console.log('cate');
  //初始化iscroll
  // 动态渲染页面
  function render(){
    //获取本地数据，先要进行判断是否超时，，没有超时的话，直接使用本地数据
    cateData=JSON.parse(localStorage.getItem('pyg_cateData'));
    if(cateData&&Date.now()-cateData.time<60*60*1000){
      //注意是毫秒，使用本地存储的数据进行渲染
      cateLeft();
      //先默认是
      cateRight(0);
    }else{
      //如果超时的话，就重新发起ajax请求
      getCateList()
    }
  }
//发起ajax请求，获取数据
function getCateList(){
  $.get('categories',function(result){
    console.log(result);
    if(result.meta.status==200){
      //通过判断状态码来确定是否获取数据成功，
      //注意客户端和服务器的数据交互只能是字符串，
      //将结果赋值给全局变量cateDate，让后面的函数可以直接使用
      cateDate={'list':result.data,time:Date.now()}
      //将获取到的所有数据线存入本地存储中，注意数据格式
      localStorage.setItem('pyg_cateData',JSON.stringify(cateData));
      //将获取到的数据，是一个对象，变成一个字符串数据
      //动态生成左侧导航栏结构
      cateLeft();
      //动态生成右侧的二级分类,先要默认生成第一个数据
      cateRight(0);
    }
    
  },'json')
}

//动态生成左侧导航栏数据
function cateLeft(){
  var html=template('leftnavTemp',cateData);
  $('.left ul').html(html);
  //先要生成动态数据格式之后，在进行iscroll滑动的初始化设置
  var myScroll=new IScroll('.left');
  //先为一级目录绑定li的单机操作，注意移动端不能使用click事件，是使用tap事件，注意要使用事件委托的方式，动态数据
  $('.left').on('tap','li',function(){
    $(this).addClass('active').siblings().removeClass('active');
    //点击this之后，实现该元素置顶
    myScroll.scrollToElement(this);
    //动态元素耳机分类数据,吸纳获取当前元素的index
    var index=$(this).index()
    //将获取到的index传去函数
    cateRight(index)
  })
}
//动态生成耳机目录
function cateRight(index){
  //拿到一级目录传过来的index，根据index找到对应的二级目录的数据
  var html=template('rightListTemp',cateData.list[index]);
  $('.rightList').html(html);

  //要先判断图片是否全部加载完毕，先获取全部图片的数量
  var imgcount=('.rightList img').length;
  $('.rightList img').on('load',function(){
    //图片加载完会触发load事件，
    imgcount--;
    if(imgcount==0){
      //说明全部图片加载完毕，然后再实现iscroll中的滑动功能
      var isscroll=new IScroll('.right')
    }
  })
}
  

//   function cateLeft() {
//     //获取左边目录的数据
//     $.get('categories', function (result) {
//       // console.log(result);
//       // console.log(result.data);

//       var cateListHTML = template('cateListTemp', {
//         'list': result.data
//       });
//       // console.log(cateListHTML);

//       $('.left ul').html(cateListHTML);
//       //注意不能卸载外面，因为要等这个加载完毕之后才进行初始化，不然不能滑动
//       var myScroll = new IScroll('.left');
//     }, 'json')
//   }
// cateLeft()

// //右边数据的渲染
// function cateRight(){
  
// }

})