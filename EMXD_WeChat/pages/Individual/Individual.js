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
    select:'0', //tab切换
    cart:false, //购物车
  },
  selectTab:function(e){
    console.log(e);
    let that = this;
    let id = e.target.dataset.id;
    that.setData({
      select:id
    })
  },
   /**
   * 商品详情
   */
  details: function () {
    wx.navigateTo({
      url: '../productDetails/productDetails'
    })
  },
  // 点击添加商品
  addCommodity:function(){
    let that = this;
    that.setData({
      cart:true
    })
  },

  // 购物车点击删减按钮
  cartRemove:function(){
    let that = this;
    that.setData({
      cart: false
    })
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