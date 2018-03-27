// pages/user/store/store.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  management:function(){
    console.log(1);
    wx.navigateTo({
      url: '/pages/user/store/management/management'
    })
  },
  commodityManage: function () {
    wx.navigateTo({
      url: '/pages/user/store/commodityManage/commodityManage'
    })
  },
  commodity: function () {
    wx.navigateTo({
      url: '/pages/commodity/commodity'
    })
  },
  sellorderMan: function () {
    wx.navigateTo({
      url: '/pages/sellorderMan/sellorderMan'
    })
  },
  shopaddClassify: function () {
    wx.navigateTo({
      url: '/pages/shopaddClassify/shopaddClassify'
    })
  },
  winDeposit: function () {
    wx.navigateTo({
      url: '/pages/winDeposit/winDeposit'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})