//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  // 选择地址
  address: function () {
    wx.navigateTo({
      url: '../address/address'
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
