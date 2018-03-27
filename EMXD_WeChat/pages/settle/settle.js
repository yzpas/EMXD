//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  // 订单中心
  address: function () {
    wx.navigateTo({
      url: '../location/location'
    })
  },
  // 订单中心
  pays: function () {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
