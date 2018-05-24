//获取应用实例
const app = getApp()
const sellerSellerList = app.globalData.host + "/orders/seller-product-list" // 已卖出
var page0 = 0;
var page10 = 0;
var page20 = 0;
var page50 = 0;
var page90 = 0;
Page({
  data: {
    currentTab: 0,
    sellerSellerList0:[],
    sellerSellerList10:[],
    sellerSellerList20:[],
    sellerSellerList50:[],
    sellerSellerList90:[],
    Noloader: false,
  },
  onLoad: function (options) {
    let that = this;
    let id = that.data.currentTab
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true,
    })
    that.sellerSellerList(page0,id)

  },
  sellerSellerList:function(page,status,hint){
    let that = this;
    // 调取接口
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true,
    })
    app.getRequest(sellerSellerList, { "offset": page, "status": status }, function (res) {
      if (res.data.code == 0) {
        wx.hideToast()
        if (status == 0 ){
          that.setData({
            sellerSellerList0: that.data.sellerSellerList0.concat(res.data.res.product_list)
          });
          if (res.data.res.product_list.length == 0 && !hint){
            wx.showToast({
              title: '暂无商品',
              icon: 'none',
              mask: true,
            })
            page0 -= 20;
          }
        }
        if (status == 10) {
          that.setData({
            sellerSellerList10: that.data.sellerSellerList10.concat(res.data.res.product_list)
          });
          if (res.data.res.product_list.length == 0 && !hint) {
            wx.showToast({
              title: '暂无商品',
              icon: 'none',
              mask: true,
            })
            page10 -= 20;
          }
        }
        if (status == 20) {
          that.setData({
            sellerSellerList20: that.data.sellerSellerList20.concat(res.data.res.product_list)
          });
          if (res.data.res.product_list.length == 0 && !hint) {
            wx.showToast({
              title: '暂无商品',
              icon: 'none',
              mask: true,
            })
            page20 -= 20;
          }
        }
        if (status == 50) {
          that.setData({
            sellerSellerList50: that.data.sellerSellerList50.concat(res.data.res.product_list)
          });
          if (res.data.res.product_list.length == 0 && !hint) {
            wx.showToast({
              title: '暂无商品',
              icon: 'none',
              mask: true,
            })
            page50 -= 20;
          }
        }
        if (status == 90) {
          that.setData({
            sellerSellerList90: that.data.sellerSellerList90.concat(res.data.res.product_list)
          });
          if (res.data.res.product_list.length == 0 && !hint) {
            wx.showToast({
              title: '暂无商品',
              icon: 'none',
              mask: true,
            })
            page90 -= 20;
          }
        }
        if (res.data.res.product_list.length == 0 && that.data.sellerSellerList0.length == 0 && that.data.sellerSellerList10.length == 0 && that.data.sellerSellerList20.length == 0 && that.data.sellerSellerList50.length == 0 && that.data.sellerSellerList90.length == 0){
          that.setData({
            Noloader:true,
          })
        }
      }
    }, 'hint')
  },
  // 下滑加载
  onReachBottom: function () {
    
    let that = this;
    let id = that.data.currentTab;
    if( id == 0 ){
      page0 += 20;
      that.sellerSellerList(page0,id);
    }
    if (id == 10) {
      page10 += 20;
      that.sellerSellerList(page10, id);
    }
    if (id == 20) {
      page20 += 20;
      that.sellerSellerList(page20, id);
    }
    if (id == 50) {
      page50 += 20;
      that.sellerSellerList(page50, id);
    }
    if (id == 90) {
      page90 += 20;
      that.sellerSellerList(page90, id);
    }
  },
  tab: function (e) {
    let that = this;
    that.setData({ 
      currentTab: e.target.dataset.id,
      Noloader: false
    });
    if (that.data.sellerSellerList0.length < 1 && e.target.dataset.id == 0 ){
      that.sellerSellerList(page0, e.target.dataset.id,'yes');
      return;
    }
    if (that.data.sellerSellerList10.length < 1 && e.target.dataset.id == 10) {
      that.sellerSellerList(page10, e.target.dataset.id, 'yes');
      return;
    }
    if (that.data.sellerSellerList20.length < 1 && e.target.dataset.id == 20) {
      that.sellerSellerList(page20, e.target.dataset.id), 'yes';
      return;
    }
    if (that.data.sellerSellerList50.length < 1 && e.target.dataset.id == 50) {
      that.sellerSellerList(page50, e.target.dataset.id, 'yes');
      return;
    }
    if (that.data.sellerSellerList90.length < 1 && e.target.dataset.id == 90) {
      that.sellerSellerList(page90, e.target.dataset.id, 'yes');
      return;
    }
  },
  goInfo:function(e){
    let that = this;
    let order_sn = e.currentTarget.dataset.order_sn;
    wx.navigateTo({
      url: '/pages/sellDetails/sellDetails?id='+order_sn
    })
  },
  godelivery: function (e) {
    let that = this;
    let order_sn = e.currentTarget.dataset.order_sn;
    wx.navigateTo({
      url: '/pages/deliver/deliver?id=' + order_sn
    })
  },
  onShow:function(){
    let that = this;
    let id = that.data.currentTab
    // that.setData({
    //   sellerSellerList0: [],
    //   sellerSellerList10: [],
    //   sellerSellerList20: [],
    //   sellerSellerList50: [],
    //   sellerSellerList90: []
    // })
    page0 = 0;
    app.getRequest(sellerSellerList, { "offset": page0, "status": 0 }, function (res) {
      console.log(111111)
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true,
      })
      if (res.data.code == 0) {
        wx.hideToast()
        that.setData({
          sellerSellerList0: res.data.res.product_list,
        });
      }
    }, 'hint')
    app.getRequest(sellerSellerList, { "offset": page0, "status": 20 }, function (res) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true,
      })
      if (res.data.code == 0) {
        wx.hideToast()
        that.setData({
          sellerSellerList20: res.data.res.product_list,
        });
      }
    }, 'hint')
    app.getRequest(sellerSellerList, { "offset": page0, "status": 50 }, function (res) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true,
      })
      if (res.data.code == 0) {
        wx.hideToast()
          that.setData({
            sellerSellerList50: res.data.res.product_list,
          });
      }
    }, 'hint')
    app.getRequest(sellerSellerList, { "offset": page0, "status": 10 }, function (res) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true,
      })
      if (res.data.code == 0) {
        wx.hideToast()
        that.setData({
          sellerSellerList10: res.data.res.product_list,
        });
      }
    }, 'hint')
    app.getRequest(sellerSellerList, { "offset": page0, "status": 90 }, function (res) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true,
      })
      if (res.data.code == 0) {
        wx.hideToast()
        that.setData({
          sellerSellerList90: res.data.res.product_list,
        });
      }
    }, 'hint')
  }
})
