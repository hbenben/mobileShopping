$(function () {
  $('#login_btn').on('tap', function () {
    // 登录页面要从前台传送用户输入的账号密码参数
    var obj = {
      username: '',
      password: ''
    }
    //先获取用户输入的数据
    obj.username = $('input[type=text]').val();
    obj.password = $('input[type=password]').val()
    // console.log(obj.username);
    // console.log(obj.password);
    // 手机号码验证
    if (!/^1[3-9]\d{9}$/.test(obj.username)) {
      mui.toast('手机号码格式不正确');
      return false;
    }
    if (obj.password.length < 6) {
      mui.toast('密码长度小于6位');
      return false;
    } 
    //发送ajax请求
    $.ajax({
      type: 'post',
      url: 'login',
      data: obj,
      dataType: 'json', 
      success: function (result) {
        alert('跳转成功')
        console.log(result);
        //登录成功之后获取对应的token值，要注意，这个是私密API，路径不一样的
        if(result.meta.status==200){
          //登录成功，然后将当前的token值存储到本地
          sessionStorage.setItem('pyg_token',result.data.token);
          //登陆成功，获取当前的token值后，还要进行页面跳转
          var re=sessionStorage.getItem('redirectUrl');
          if(re){
            location.href=re;
          }else{
            location.href='../index.html'
          }
        }else{
          mui.toast(result.meta.msg);
        }
      }
    })
  })


})