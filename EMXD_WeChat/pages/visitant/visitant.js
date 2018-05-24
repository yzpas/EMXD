//获取应用实例
const app = getApp()
const shopVisitor = app.globalData.host + "/shop/visitor" // 获取用户默认地址
var page = 0
Page({
  data: {
    shopVisitor:[],
  },
  onLoad:function(){
    let that = this;
    that.shopVisitor(page);
  },
  // 下滑加载
  onReachBottom: function () {
    let that = this;
    page += 20;
    that.shopVisitor(page);
  },
  // 获取数据方法
  shopVisitor: function (page) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask:true
    })
    let that = this;
    // 调取接口
    app.getRequest(shopVisitor, { offset: page}, function (res) {
      if (res.data.code == 0) {
        wx.hideToast()
        if (res.data.res){
          that.setData({
            shopVisitor: that.data.shopVisitor.concat(res.data.res)
          })
        }else{
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1500
          })
          page -= 20;
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
            url: '/pages/index/index?parameter=yes'
          })
        }, 2000)
      } else {
        wx.showToast({
          title: '网络错误请稍后再试...',
          icon: 'none',
          mask: true
        })
      }
    }, 'hint')
  },
})
