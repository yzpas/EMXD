
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  // 订单详情
  details: function () {
    wx.navigateTo({
      url: '../orderDetails/orderDetails'
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
