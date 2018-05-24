//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  // 免费领取会员卡
  freeoF: function () {
    wx.navigateTo({
      url: '../free/free'
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
