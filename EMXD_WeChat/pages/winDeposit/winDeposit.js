// pages/user/store/management/management.js
//获取应用实例
var util = require('../../utils/util.js');
const app = getApp()
const withdrawApply = app.globalData.host + "/account/withdraw-apply" // 首页接口
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      money: options.money
    })
  },
  bindReplaceInput: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  deposit:function(){
    if (util.buttonLocked(app, 'tixian', 5000)) {
      return;
    }
    
    let that = this;
    that.depositData();
  },
  depositData: function () {
    let that = this;
    // 调取接口
    app.postRequest(withdrawApply, {}, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: '提现申请提交成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
        
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        });
      }
    }, 'showToast')
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
 
})