// pages/user/store/store.js
var util = require('../../../utils/util.js');
//获取应用实例
const app = getApp()
const shopManage = app.globalData.host + "/shop/manage" // 首页接口
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopManage:[],
    token: '',
    deposit_btn:false,
    shopId:0,
    tixianButtonStatus:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.shopManage(res.data);
        that.setData({
          token: res.data
        })
      }
    });
  },
  shopManage: function (token) {
    let that = this;
    // 调取接口
    app.getRequest(shopManage, { }, function (res) {
      if (res.data.code == 0) {
        that.setData({
          shopManage: res.data.res
        });
        if (Number(res.data.res.allow_withdraw) >= 1){
          that.setData({
            deposit_btn: true,
          })
        }else{
          that.setData({
            deposit_btn: false,
          })
        }
        // 存储店铺信息
        wx.setStorage({
          key: "shop_info",
          data: res.data.res.shop_info
        })
      }
    })
  },
  depositTo:function(){    
    let that = this;
    
     //return;
    let shopManage = that.data.shopManage.allow_withdraw;
    if (shopManage < 1 || !shopManage){
      wx.showToast({
        title: '金额大于1元才可提现',
        icon: 'none',
        duration: 2000
      })
    }

  },
  // Goindex: function () {
  //   console.log(1);
  //   wx.switchTab ({
  //     url: '/pages/index/index'
  //   })
  // },
  Gouser: function () {
    wx.switchTab ({
      url: '/pages/logs/logs'
    })
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
      url: '/pages/commodity/commodity?my=yes'
    })
  },
  sellorderMan: function () {
    wx.navigateTo({
      url: '/pages/sellorderMan/sellorderMan'
    })
  },
  shopaddClassify: function () {
    wx.navigateTo({
      url: '/pages/shopaddClassify/shopaddClassify?tag=winDeposit'
    })
  },
  deposit: function () {
    let that = this;
    let shopManage = that.data.shopManage.allow_withdraw;
    wx.navigateTo({
      url: '/pages/winDeposit/winDeposit?money=' + shopManage
    })
    
  },
  winDeposit: function () {
    wx.navigateTo({
      url: '/pages/incomePair/incomePair'
    })
  },
  shopView: function (e) {
    app.clearCart()
    wx.navigateTo({
      url: '../../Individual/Individual?identifying=no&id=' + this.data.shopManage.shop_info.shop_id
    })
  },
  sellorder: function () {
    wx.navigateTo({
      url: '/pages/sellorder/sellorder'
    })
  },
  visitor: function () {
    wx.navigateTo({
      url: '/pages/visitant/visitant'
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
    this.data.shopManage = [];
    this.shopManage();
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