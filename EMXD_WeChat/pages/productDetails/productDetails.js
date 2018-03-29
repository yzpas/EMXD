// Page({
//   data: {
//     logs: []
//   },
//   onLoad: function (options) {

//   },

// })
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '/pages/images/details_1.jpg',
      '/pages/images/details_1.jpg',
      '/pages/images/details_1.jpg'
    ],
    imgSmall:[
      '/pages/images/details_2.jpg',
      '/pages/images/details_2.jpg',
      '/pages/images/details_2.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 500,
    select_specification:false, //选择规格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
   // 去结算
    accounts: function () {
      wx.navigateTo({
        url: '../settle/settle'
      })
    },
    Gouser:function (){
      console.log(1);
      wx.redirectTo({
        url: '../logs/logs'
      })
    },
    // 加入购物车
    addCart:function(){
      let that = this;
      that.setData({
        select_specification: true
      })
    },
    // 隐藏弹层
    popupShow:function(){
      let that = this;
      that.setData({
        select_specification: false
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