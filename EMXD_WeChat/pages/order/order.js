//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()
const buyerProductList = app.globalData.host + "/orders/buyer-product-list" // 已买到
const buyerConfirm = app.globalData.host + "/orders/buyer-confirm-receipt" // 我买到的-订单详情-买家确认收货
const buyerCancel = app.globalData.host + "/orders/buyer-cancel" // 我买到的-买家取消订单
const payParams = app.globalData.host + "/orders/get-pay-params" // 我买到的-买家支付订单
var page0 = 0;
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    let that = this;
    that.buyerProductList(page0);
  },
  // 下滑加载
  onReachBottom: function () {
        let that = this;
        page0+= 20;
        that.buyerProductList(page0);
  },
  buyerProductList: function (page){
      let that = this;
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true,
      })
      // 调取接口
      app.getRequest(buyerProductList, { "offset": page}, function (res) {
          if (res.data.code == 0) {
            wx.hideToast()
            let list = []
              if (res.data.res.product_list.length > 0 ){
                that.setData({
                  logs: that.data.logs.concat(res.data.res.product_list)
                })
                if (res.data.res.product_list.length == 0) {
                  that.setData({
                    Noloader: true,
                  })
                }
              }else{
                wx.showToast({
                  title: '暂无数据',
                  icon: 'none',
                  duration: 2000
                })
                page0 -= 20;
              }
          } else if (res.data.code == -100) {
            wx.showToast({
              title: '用户登录过期,请重新获取信息授权!',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function () {
              wx.removeStorageSync('token')
              wx.navigateTo({
                url: '/pages/index/index?parameter=order'
              })
            }, 2000)
            return;
          }else{
            wx.showToast({
              title: '网络错误请稍后再试...',
              icon: 'none',
              mask: true
            })
          }
      }, 'hint')
  },
//   取消订单
  Cancel:function(e){
    if (util.buttonLocked(app, 'order_cancel', 3000)) {
      return;
    }
    let that = this;
    let info = e.currentTarget.dataset.info;
    console
    console.log(info);
    wx.showModal({
      title: info.title,
      content: info.confirm_text,
      success: function (res) {
        if (res.confirm) {
          // 调取接口
          app.getRequest(buyerCancel, { "sn": info.callback_params.sn }, function (res) {
            wx.showToast({
              title: '加载中...',
              icon: 'loading',
              mask: true,
            })
            if (res.data.code == 0) {
              wx.hideToast()
              app.getRequest(buyerProductList, { "offset": 0 }, function (res) {
                if (res.data.code == 0) {
                  // wx.showToast({
                  //   title: '加载中...',
                  //   icon: 'loading',
                  //   mask: true,
                  // })
                  that.setData({
                    logs: res.data.res.product_list
                  })
                  if (res.data.res.product_list.length == 0) {
                    that.setData({
                      Noloader: true,
                    })
                  }
                }
              }, 'hint')
            }
          }, 'hint')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 去支付
  //   取消订单
  goPay: function (e) {
    if(util.buttonLocked(app, 'order_gopay', 3000)) {
      return;
    }
    
    let that = this;
    let info = e.currentTarget.dataset.info;
    // 调取接口
    app.getRequest(payParams, { "sn": info }, function (res) {
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
          'package': "prepay_id="+res.data.res.wx_package,
          'signType': 'MD5',
          'paySign': res.data.res.wx_sign,
          'success': function (res) {
            console.log(res);
            app.getRequest(buyerProductList, { "offset": 0 }, function (res) {
              if (res.data.code == 0) {
                wx.showToast({
                  title: '加载中...',
                  icon: 'loading',
                  mask: true,
                })
                that.setData({
                  logs: res.data.res.product_list
                })
                if (res.data.res.product_list.length == 0) {
                  that.setData({
                    Noloader: true,
                  })
                }
              }
            }, 'hint')
          },
          'fail': function (res) {
            console.log(res);
          }
        })
        
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          mask: true,
        })
      }
    }, 'hint')
  },
  // 确认收货
  affirm: function (e) {
    let that = this;
    let info = e.currentTarget.dataset.info;
    wx.showModal({
      title: info.title,
      content: info.confirm_text,
      success: function (res) {
        if (res.confirm) {
          app.getRequest(buyerConfirm, { "sn": info.callback_params.sn }, function (res) {
            console.log(res);
            if (res.data.code == 0) {
              wx.showToast({
                title: res.data.msg,
                icon: 'loading',
                mask: true,
              })
              app.getRequest(buyerProductList, { "offset": 0 }, function (res) {
                if (res.data.code == 0) {
                  wx.showToast({
                    title: '加载中...',
                    icon: 'loading',
                    mask: true,
                  })
                  that.setData({
                    logs: res.data.res.product_list
                  })
                  if (res.data.res.product_list.length == 0) {
                    that.setData({
                      Noloader: true,
                    })
                  }
                }
              }, 'hint')
            }
          }, 'hint')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 订单详情
  details: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.order_sn;
    wx.navigateTo({
      url: '../orderDetails/orderDetails?order='+id
    })
  },
  onShow:function(){
    page0 = 0;
    let that = this;
    app.getRequest(buyerProductList, { "offset": page0}, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          mask: true,
        })
        that.setData({
          logs: res.data.res.product_list
        })
        if (res.data.res.product_list.length == 0) {
          that.setData({
            Noloader: true,
          })
        }
      }
    }, 'hint')
  }
})
