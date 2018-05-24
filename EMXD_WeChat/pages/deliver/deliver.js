//获取应用实例
const app = getApp()
const shipping = app.globalData.host + "/shipping/companies" // 获取快递公司
const sellerShipping = app.globalData.host + "/orders/seller-shipping" // 卖家发货(真接口)
Page({
  data: {
    shipping: [],
    province: '请选择快递 ', //
    title:'',
    code:'',
    inputValue:'',
    sn:'',
  },

  onLoad: function (options) {
    let that = this;
    console.log(options.id)
    that.setData({
      sn:options.id
    })
    that.shipping(); 
    // that.sellerView(2018041252975510);
  },
  shipping: function () {
    let that = this;
    app.getRequest(shipping,  {}, function (res) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true,
      })
      if (res.data.code == 0) {
        wx.hideToast()
        that.setData({
          shipping: res.data.res.changyong
        })
      }
    }, 'hint')
  },
  provincechange: function (e) {
    let that = this;
    let id = e.detail.value
    let title = that.data.shipping[id].title; // 省名字
    let code = that.data.shipping[id].code; // 省名字
    console.log(title);
    console.log(code);
    that.setData({
      id: e.detail.value,
      title: title,
      code: code,
    });
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  deliver:function(){
    let that = this;
    console.log(that.data.sn)
    let sn = that.data.sn;
    let inputValue = that.data.inputValue;
    let code = that.data.code;
    if (!sn) {
      return;
    }
    if (!code){
      wx.showToast({
        title: '请选择快递',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!inputValue) {
      wx.showToast({
        title: '请输入快递单号',
        icon: 'none',
      })
      return;
    }
    app.postRequest(sellerShipping, {
      "sn": sn,
      "shipping_company_code": code,
      "shipping_number": inputValue,
    }, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          mask: true,
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          mask: true,
        })
      }
    }, 'hint')
  },
  beenSent:function(){
    let that = this;
    wx.showModal({
      title: '',
      content: '确认寄出？',
      success: function (res) {
        if (res.confirm) {
          app.postRequest(sellerShipping, {
            "sn": that.data.sn,
            "shipping_company_code": '',
            "shipping_number": '',
          }, function (res) {
            if (res.data.code == 0) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask: true,
                duration: 2000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)
              
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask: true,
              })
            }
          }, 'hint')
        } else if (res.cancel) {
         
        }
      }
    })
  },
})
