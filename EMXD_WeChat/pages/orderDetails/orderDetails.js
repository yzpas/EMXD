//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const buyerView = app.globalData.host + "/orders/buyer-view" // 已卖出详情
const buyerConfirm = app.globalData.host + "/orders/buyer-confirm-receipt" // 我买到的-订单详情-买家确认收货
const buyerCancel = app.globalData.host + "/orders/buyer-cancel" // 我买到的-买家取消订单
const payParams = app.globalData.host + "/orders/get-pay-params" // 我买到的-买家支付订单
Page({
  data: {
    buyerView:[],
    order:'',
  },
  onLoad: function (options) {
    console.log(options)
    let that = this ;
    that.setData({
      order: options.order
    })
    that.buyerView(options.order);
  },
  buyerView:function(id){
    let that = this;
    app.getRequest(buyerView, { "sn": id }, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          mask: true,
        })
        that.setData({
          buyerView:res.data.res
        })
      }
    }, 'hint')
  },
  //   取消订单
  pay: function (e) {
    let that = this;
    let info = e.currentTarget.dataset.info;
    console.log(info);
    if(info.title === '取消订单'){
      if (util.buttonLocked(app, 'order_cancel', 3000)) {
        return;
      }
      wx.showModal({
        title: info.title,
        content: info.confirm_text,
        success: function (res) {
          if (res.confirm) {
            // 调取接口
            app.getRequest(buyerCancel, { "sn": info.callback_params.sn }, function (res) {
              console.log(res);
              if (res.data.code == 0) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'loading',
                  mask: true,
                })
                that.buyerView(that.data.order);
              }
            }, 'hint')
          } else if (res.cancel) {
          }
        }
      })
      return;
    }
    if (info.title === '去支付'){
      if (util.buttonLocked(app, 'order_pay', 3000)) {
        return;
      }
      // 调取接口
      let that = this;
      let info = e.currentTarget.dataset.info;
      // 调取接口
      app.getRequest(payParams, { "sn": info.callback_params.sn }, function (res) {
        console.log(res);
        if (res.data.code == 0) {
          wx.showToast({
            title: '正在支付...',
            icon: 'loading',
            mask: true
          })
          wx.requestPayment({
            'timeStamp': res.data.res.wx_timestamp,
            'nonceStr': res.data.res.wx_nonce_str,
            'package': "prepay_id=" + res.data.res.wx_package,
            'signType': 'MD5',
            'paySign': res.data.res.wx_sign,
            'success': function (res) {
              console.log(res);
              that.buyerView(that.data.order);
            },
            'fail': function (res) {
              console.log(res);
            }
          })
          // app.getRequest(buyerProductList, { "offset": 0 }, function (res) {
          //   if (res.data.code == 0) {
          //     wx.showToast({
          //       title: '加载中...',
          //       icon: 'loading',
          //       mask: true,
          //     })
          //     that.setData({
          //       logs: res.data.res.product_list
          //     })
          //     if (res.data.res.product_list.length == 0) {
          //       that.setData({
          //         Noloader: true,
          //       })
          //     }
          //   }
          // }, 'hint')
        }
      }, 'hint')
      return;
    }
    if (info.title === '确认收货') {
      if (util.buttonLocked(app, 'order_buyer_receipt', 3000)) {
        return;
      }
      // 调取接口
      app.getRequest(buyerConfirm, { "sn": info.callback_params.sn }, function (resTo) {
        // console.log(reresTos);
        wx.showModal({
          title: '确认收货',
          content: '确认收货吗?',
          success: function (res) {
            if (res.confirm) {
              if (resTo.data.code == 0) {
              wx.showToast({
                title: resTo.data.msg,
                icon: 'loading',
                mask: true,
              })
              that.buyerView(that.data.order);
              } else {
                wx.showToast({
                  title: resTo.data.msg,
                  icon: 'loading',
                  mask: true,
                })
              }
          }
          }
      }, 'hint')
      return;
    })
    }
  },
  shop_tel:function(){
    let that = this;
    let shop_tel = that.data.buyerView.shop_tel;
    wx.makePhoneCall({
      phoneNumber: shop_tel //仅为示例，并非真实的电话号码
    })
  }
})
