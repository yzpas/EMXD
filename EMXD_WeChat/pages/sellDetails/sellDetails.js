//获取应用实例
const app = getApp()
const sellerView = app.globalData.host + "/orders/seller-view" // 已卖出详情
Page({
  data: {
    sellerView: [],
    id:'',
  },

  onLoad: function (options) {
    console.log(options)
    
    let that = this;
    that.sellerView(options.id);2018041252975510
    that.setData({
      id: options.id
    })
    // that.sellerView(2018041252975510);
  },
  sellerView: function (id) {
    let that = this;
    app.getRequest(sellerView, { "sn": id }, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          mask: true,
        })
        that.setData({
          sellerView: res.data.res
        })
      }
    }, 'hint')
  },
  bindtelephone:function(e){
    let that = this;
    // console.log(e.target.dataset.telephone);
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.telephone //仅为示例，并非真实的电话号码
    })
  },
  Goitem:function(e){
    let that = this;
    let item = e.target.dataset.item;
    wx.showModal({
      title: '',
      content: item.confirm_text,
      success: function (res) {
        if (res.confirm) {
          if (item.callback_func === 'orderShipping'){
            wx.navigateTo({
              url: '/pages/deliver/deliver?id=' + item.callback_params.sn
            })
          }
        } else if (res.cancel) {
          
        }
      }
    })
  },
  onShow:function(){
    let that = this;
    let id = that.data.id;
    this.sellerView(id);
  }
  // 选择地址
  // address: function () {
  //   wx.navigateTo({
  //     url: '../location/location'
  //   })
  // },
})
