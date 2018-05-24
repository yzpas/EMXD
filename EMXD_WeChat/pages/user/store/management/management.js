// pages/user/store/management/management.js
//获取应用实例
const app = getApp()
const manageSetting = app.globalData.host + "/shop/manage-setting" // 首页接口
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_info:[],
    shop_title:'',
    shop_introduce: '',
    shop_photo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'shop_info',
      success: function (res) {
        that.setData({
          shop_info:res.data,
          shop_title:res.data.shop_title,
          shop_introduce: res.data.shop_introduce,
          shop_photo: res.data.shop_photo
        })
      }
    })
  },
  bindReplaceInput:function(e){
    this.setData({
      shop_title: e.detail.value
    })
  },
  bindReplaceInputTo: function (e) {
    console.log(e.detail.value)
    this.setData({
      shop_introduce: e.detail.value
    })
  },
  updateSave:function(){
    let that = this;
    let shop_title = '';
    let shop_introduce = '';
    console.log(1);
    wx.getStorage({
      key: 'shop_info',
      success: function (res) {
          shop_title = res.data.shop_title;
          shop_introduce =  res.data.shop_introduce;
      }
    })
    
    if (that.data.shop_title != shop_title || that.data.shop_introduce != shop_introduce){
      that.update(that.data.shop_title, that.data.shop_introduce);
      console.log('修改')
    }
  },
  update: function (shop_title, shop_introduce){
    let that = this;
    // 调取接口
    app.postRequest(manageSetting, { "shop_title": shop_title, "shop_introduce": shop_introduce }, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        });
        let shop_info = { 
          shop_title: that.data.shop_title, 
          shop_introduce: that.data.shop_introduce, 
          shop_photo: that.data.shop_photo,
          renzheng: that.data.shop_info.renzheng
        }
        wx.setStorage({
          key: "shop_info",
          data: shop_info
        })
      }
    },'showToast')
  },
  preview:function(){
    let that = this;
    wx.previewImage({
      current: that.data.shop_photo, // 当前显示图片的http链接
      urls: [that.data.shop_photo] // 需要预览的图片http链接列表
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
  
  }
 
})