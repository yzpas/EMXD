//logs.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
// const getDefault = app.globalData.host + "/user-address/get-default-address" // 获取用户默认地址
const address = app.globalData.host + "/user-address/get-address" // 获取用户所有地址
const ordersConfirm = app.globalData.host + "/orders/confirm"  // 提交订单前的确认(真接口)
const ordersSubmit = app.globalData.host + "/orders/submit"  // 提交订单前的确认(真接口)
Page({
  data: {
    logs: [],
    default_address:[], 
    token:'',
    cart:[],
    list:[],
    remarkValue:'',
    attr_price:0,
    shop_number:0,
    disabled:false,
  },
  onLoad: function () {
    let that = this;
    let attr_price =  0;
    let shop_number = 0;
    let list = [];
    for (let i = 0; i < app.globalData.shopCart.menu_list.length;i++){
      if (app.globalData.shopCart.menu_list[i].select == true){
        app.globalData.shopCart.menu_list[i].attr_info.amount = app.accmul(app.globalData.shopCart.menu_list[i].attr_info.attr_price * app.globalData.shopCart.menu_list[i].attr_info.shop_number, 100);
        list.push(app.globalData.shopCart.menu_list[i]);
        // attr_price += Number(app.globalData.shopCart.menu_list[i].attr_info.shop_number) * Number(app.globalData.shopCart.menu_list[i].attr_info.attr_price);
      }
    }
    console.log(attr_price)
    that.setData({
      cart: app.globalData.shopCart,
      list: list,
      //attr_price: attr_price,
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.site(res.data);
        that.setData({
          token: res.data
        })
      }
    });
  },
  
  site: function (token) {
    let that = this;
    let products = [];
   
    for (let i = 0; i < that.data.list.length; i++) {
      let shop_info = {};
      shop_info.attr_id = that.data.list[i].attr_info.attr_id;
      shop_info.count = that.data.list[i].attr_info.shop_number;
      products.push(shop_info);
    }
    let default_address_id = that.data.default_address.area_id;
    let note = that.data.remarkValue;
    // 调取接口
    app.postRequest(ordersConfirm, { "products": JSON.stringify(products) }, function (res) {
      if (res.data.code == 0) {
        let data = {
          user_name: res.data.res.address.user_name,
          detail_address: res.data.res.address.str_address,
          telephone: res.data.res.address.mobile, 
          id: res.data.res.address.id         
        }
        that.setData({
          default_address: data
        })
        console.log('data.res.pay_amount' + res.data.res.pay_amount);
        that.setData({
          attr_price: res.data.res.pay_amount,
        })
        console.log(that.data.default_address )
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    },'hint')
  },
  remarkInput:function(e){
    let that = this;
    console.log(e)
    that.setData({
      remarkValue: e.detail.value
    })
  },
  // 订单中心
  address: function () {
    wx.navigateTo({
      url: '../location/location'
    })
  },
  // 订单中心
  pays: function () {
    let that = this;
    let products = [];
    for(let i = 0 ; i < that.data.list.length; i ++){
      let shop_info = {};
      shop_info.attr_id = that.data.list[i].attr_info.attr_id;
      shop_info.count = that.data.list[i].attr_info.shop_number;
      products.push(shop_info);
    }
    let default_address_id = that.data.default_address.id;
    let note = that.data.remarkValue;
    
    // 调取接口
    app.postRequest(ordersSubmit, { 
      "products": JSON.stringify(products),
      "address_id": default_address_id ,
      "note": note,
      // "":1,
    }, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: '正在支付...',
          icon: 'loading',
          duration: 2000
        })
        // 禁用支付按钮
        that.setData({
          disabled:true,
        })
        wx.requestPayment({
          'timeStamp': res.data.res.wx_timestamp,
          'nonceStr': res.data.res.wx_nonce_str,
          'package': "prepay_id="+res.data.res.wx_package,
          'signType': 'MD5',
          'paySign': res.data.res.wx_sign,
          'success': function (res) {
            for (let i = 0; i < app.globalData.shopCart.menu_list.length; i ++ ){
              if (app.globalData.shopCart.menu_list[i].select === true ){
                app.globalData.shopCart.menu_list.splice(i,1)
              }
            }
            console.log(app.globalData.shopCart.menu_list);
            // wx.showToast({
            //   title: '支付成功',
            //   icon: 'loading',
            //   duration: 2000,
            //   mask:true
            // })
            wx.switchTab({
              url: '/pages/order/order'
            })
            // setTimeout(function () {
             
            // }, 2000)
            that.setData({
              disabled: false,
            })
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon: 'loading',
              duration: 2000,
              mask: true
            })
            that.setData({
              disabled: false,
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/order/order'
              })
            }, 2000)
          }
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    },'hint')
  },
  onShow: function () {
    let that = this;
    console.log(app.globalData.address);
    if (app.globalData.address.length > 1) {
      let address = JSON.parse(app.globalData.address);
      that.setData({
        default_address: address
      })
    }
    let attr_price = 0;
    let shop_number = 0;
    let list = [];
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      if (app.globalData.shopCart.menu_list[i].select == true) {
        list.push(app.globalData.shopCart.menu_list[i]);
        attr_price += Number(app.globalData.shopCart.menu_list[i].attr_info.shop_number) * Number(app.globalData.shopCart.menu_list[i].attr_info.attr_price);
      }
    }
   // console.log(attr_price)
    if (!wx.getStorageSync('address')){
      that.site();
    }
    
    that.setData({
      cart: app.globalData.shopCart,
      list: list,
      //attr_price: attr_price,s
    })
  },
})
