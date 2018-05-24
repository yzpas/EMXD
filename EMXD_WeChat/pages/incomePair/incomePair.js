//获取应用实例
const app = getApp()
const accountList = app.globalData.host + "/account/list" // 资金列表
var page2 = 0;
var page1 = 0;
var page10 = 0;
var page20 = 0;
Page({
  data: {
    currentTab: 2,
    accountList2:[],
    accountList1: [],
    accountList10: [],
    accountList20: [],
    Noloader: false,
  },
  onLoad: function (options) {
    let that = this;
    let id = that.data.currentTab
    that.accountList(2, page2)
  },
  accountList: function (currentTab, offset ) {
    let that = this;
    // 调取接口
    app.getRequest(accountList, { "type": currentTab, "offset": offset }, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: '正在加载...',
          icon:'loading',
          mask:true
        })
        console.log(res.data.res.list);
        if (currentTab == 2) {
          that.setData({
            accountList2: that.data.accountList2.concat(res.data.res.list)
          });
          if (res.data.res.list.length == 0) {
            that.setData({
              Noloader: true,
            })
            wx.showToast({
              title: '暂无数据',
              icon: 'loading',
              mask: true
            })
            page2 -= 20;
          }
        }
        if (currentTab == 1) {
          that.setData({
            accountList1: that.data.accountList1.concat(res.data.res.list)
          });
          if (res.data.res.list.length == 0) {
            that.setData({
              Noloader: true,
            })
            wx.showToast({
              title: '暂无数据',
              icon: 'loading',
              mask: true
            })
            page1 -= 20;
          }
        }
        if (currentTab == 10) {
          that.setData({
            accountList10: that.data.accountList10.concat(res.data.res.list)
          });
          if (res.data.res.list.length == 0) {
            that.setData({
              Noloader: true,
            })
            wx.showToast({
              title: '暂无数据',
              icon: 'loading',
              mask: true
            })
            page10 -= 20;
          }
        }
        if (currentTab == 20) {
          that.setData({
            accountList20: that.data.accountList20.concat(res.data.res.list)
          });
          if (res.data.res.list.length == 0) {
            that.setData({
              Noloader: true,
            })
            wx.showToast({
              title: '暂无数据',
              icon: 'loading',
              mask: true
            })
            page20 -= 20;
          }
        }
       // console.log(that.data.accountList1.length)
        
      }
    }, 'hint')
  },
  // 下滑加载
  onReachBottom: function () {
    let that = this;
    let id = that.data.currentTab;
    if (id == 2) {
      page2 += 20;
      that.accountList(id, page2);
    }
    if (id == 1) {
      page1 += 20;
      that.accountList(id, page1);
    }
    if (id == 10) {
      page10 += 20;
      that.accountList(id, page10);
    }
    if (id == 20) {
      page20 += 20;
      that.accountList(id, page20);
    }
  },
  tab: function (e) {
    let that = this;
    that.setData({ 
      currentTab: e.target.dataset.id ,
      Noloader: false
    });
    if (that.data.accountList2.length < 1 && e.target.dataset.id == 2) {
      that.accountList(e.target.dataset.id, page2);
      return;
    }
    if (that.data.accountList1.length < 1 && e.target.dataset.id == 1) {
      that.accountList(e.target.dataset.id, page1);
      return;
    }
    if (that.data.accountList10.length < 1 && e.target.dataset.id == 10) {
      that.accountList(e.target.dataset.id, page10);
      return;
    }
    if (that.data.accountList20.length < 1 && e.target.dataset.id == 20) {
      that.accountList(e.target.dataset.id, page20);
      return;
    }
  }
})
