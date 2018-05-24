// pages/user/store/commodityManage.js
//获取应用实例
const app = getApp()
const sellerProductList = app.globalData.host + "/products/seller-product-list" // 店家产品管理列表
const UpSell = app.globalData.host + "/products/up-sell" // 上架/批量上架
const DownSell = app.globalData.host + "/products/down-sell" // 下架/批量下架
var page = 0;
let arr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    product_list:[], // 出售中
    product_listTo: [], // 已下架
    isHidden: true,
    loader: false,
    Noloader: false,
    selectAll: false,
    selectShopId: null, // 选中商品ID
    not_sale_count: '',
    on_sale_count: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.sellerProductList(page, 20)
    that.sellerProductList(page, 10)
  },
  tab:function(e){
    let that = this;
    let id = e.target.dataset.id
    let status = 10;
    arr = [];
    page = 0
    that.setData({ currentTab: id });  
    if (id == 0){
      if (that.data.product_list.length == 0) {
        that.setData({
          selectAll: false,
          selectShopId: null
        })
        return;
      }
      let selectAll = [];
      for (let i = 0; i < that.data.product_list.length; i++ ){
        if ( that.data.product_list[i].select == true ){
          that.data.selectAll = true
          selectAll.push(that.data.product_list[i].product_id)
        }else{
          that.data.selectAll = false
        }
      }
      that.setData({
        selectAll: that.data.selectAll,
        selectShopId: selectAll
      })
    }else{
      
      if (that.data.product_listTo.length == 0) {
        that.setData({
          selectAll: false,
          selectShopId: null
        })
        return;
      }
      let selectAll = [];
      for (let i = 0; i < that.data.product_listTo.length; i++) {
        if (that.data.product_listTo[i].select == true) {
          that.data.selectAll = true
          selectAll.push(that.data.product_listTo[i].product_id)
        } else {
          that.data.selectAll = false
        }
      }
      that.setData({
        selectAll: that.data.selectAll,
        selectShopId: selectAll
      })
    }
    console.log(that.data.selectShopId)
  },
  // 下滑加载

  management:function(){
    let that = this;
    if (that.data.isHidden){
      that.setData({
        isHidden: false,
      })
    }else{
      that.setData({
        isHidden: true,
      })
    }
  },
  sellerProductList: function (page, status){
    let that = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true,
    })
    // 调取接口
    if (status == 20){
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true,
      })
      app.getRequest(sellerProductList, { "offset": page,"status": status }, function (res) {
        if (res.data.code == 0) {
          wx.hideToast()
          for (let i = 0; i < res.data.res.product_list.length; i++) {
            res.data.res.product_list[i].select = false;
            res.data.res.product_list[i].shopUp = false;
          }
          
          if (res.data.res.product_list.length>0){
            that.setData({
              product_list: that.data.product_list.concat(res.data.res.product_list),
              not_sale_count: res.data.res.not_sale_count,
              on_sale_count: res.data.res.on_sale_count,
            })
          }else{
              wx.showToast({
                title: '暂无数据',
                icon: 'loading',
                mask: true,
              })
          }
        }
      }, 'hint')
    }else{
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true,
      })
      app.getRequest(sellerProductList, { "offset": page, "status": status }, function (res) {
        if (res.data.code == 0) {
          wx.hideToast()
          for (let i = 0; i < res.data.res.product_list.length;i++ ){
            res.data.res.product_list[i].select = false;
            res.data.res.product_list[i].shopUp = false;
          }
          
          if (res.data.res.product_list.length > 0) {
            that.setData({
              product_listTo: that.data.product_listTo.concat(res.data.res.product_list),
              not_sale_count: res.data.res.not_sale_count,
              on_sale_count: res.data.res.on_sale_count,
            })
          } else {
              wx.showToast({
                title: '暂无数据',
                icon: 'loading',
                mask: true,
              })
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            mask: true,
          })
        }
      }, 'hint')
    }
  },
  bindDownLoad: function () {
    let that = this;
    console.log(that.data.currentTab);
    page+=20;
    that.setData({
      loader: true
    })
    console.log(that.data.currentTab);
    if (that.data.currentTab == 0 ){
      that.sellerProductList(page,20)
    }else{
      that.sellerProductList(page, 10)
    }
    setTimeout(() => {
      that.setData({
        loader: false,
      })
    }, 2000)
  },

  selectTo:function(e){
    let that = this;
    let currentTab = that.data.currentTab;
    let id = e.currentTarget.dataset.id;
  
    if (currentTab==0){
      // let shopId = that.data.selectShopId;
      for (let i = 0; i < that.data.product_list.length; i++) {
        if (that.data.product_list[i].product_id == id) {
          that.data.product_list[i].select = false
          arr.splice(i,1)
        }
      }
      that.setData({
        product_list: that.data.product_list,
        selectShopId: arr
      })
    }
    if (currentTab == 1){
      
      for (let i = 0; i < that.data.product_listTo.length; i++) {
        if (that.data.product_listTo[i].product_id == id) {
          that.data.product_listTo[i].select = false
          arr.splice(i, 1)
        }
      }
      that.setData({
        product_listTo: that.data.product_listTo,
        selectShopId: arr
      })
    }
    console.log(that.data.selectShopId)
  },
  select:function (e) {
    let that = this;
    let currentTab = that.data.currentTab;
    let id = e.currentTarget.dataset.id;
    if (currentTab == 0) {
      
      for (let i = 0; i < that.data.product_list.length; i++) {
        if (that.data.product_list[i].product_id == id) {
          that.data.product_list[i].select = true
          arr.push(that.data.product_list[i].product_id)
          
        }
      }
      that.setData({
        product_list: that.data.product_list,
        selectShopId:arr
      })
    }
    if (currentTab == 1) {
      for (let i = 0; i < that.data.product_listTo.length; i++) {
        if (that.data.product_listTo[i].product_id == id) {
          that.data.product_listTo[i].select = true
          arr.push(that.data.product_listTo[i].product_id)
        }
      }
      that.setData({
        product_listTo: that.data.product_listTo,
        selectShopId: arr
      })
    }
    console.log(arr)
  },
  // 下架
  soldOut:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;  
    // that.setData({
    //   product_list:[],
    //   product_listTo:[]
    // })
    app.getRequest(DownSell, { "id": id}, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          mask: true,
        })
        // that.sellerProductList(page,10)
        app.getRequest(sellerProductList, { "offset": page, "status": 20 }, function (res) {
          if (res.data.code == 0) {
          
            for (let i = 0; i < res.data.res.product_list.length; i++) {
              res.data.res.product_list[i].select = false;
              res.data.res.product_list[i].shopUp = false;
            }
            that.setData({
              product_list: res.data.res.product_list,
              not_sale_count: res.data.res.not_sale_count,
              on_sale_count: res.data.res.on_sale_count,
            })
            console.log(that.data.product_list)
            
          }
        }, 'hint')
        app.getRequest(sellerProductList, { "offset": page, "status": 10 }, function (res) {
          if (res.data.code == 0) {
            for (let i = 0; i < res.data.res.product_list.length; i++) {
              res.data.res.product_list[i].select = false;
              res.data.res.product_list[i].shopUp = false;
            }
            that.setData({
              product_listTo: res.data.res.product_list,
              not_sale_count: res.data.res.not_sale_count,
              on_sale_count: res.data.res.on_sale_count,
            })
            console.log(that.data.product_listTo)
          }
        }, 'hint')
      }
    }, 'hint')
  },
  // 上架
  soldUpTo: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    // that.setData({
    //   product_list: [],
    //   product_listTo: []
    // })
    app.getRequest(UpSell, { "id": id }, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          mask: true,
        })
        // that.sellerProductList(page, 20)
        app.getRequest(sellerProductList, { "offset": page, "status": 20 }, function (res) {
          if (res.data.code == 0) {
            for (let i = 0; i < res.data.res.product_list.length; i++) {
              res.data.res.product_list[i].select = false;
              res.data.res.product_list[i].shopUp = false;
            }
            that.setData({
              product_list:res.data.res.product_list,
              not_sale_count: res.data.res.not_sale_count,
              on_sale_count: res.data.res.on_sale_count,
            })
          }
        }, 'hint')
        app.getRequest(sellerProductList, { "offset": page, "status": 10 }, function (res) {
          if (res.data.code == 0) {
            for (let i = 0; i < res.data.res.product_list.length; i++) {
              res.data.res.product_list[i].select = false;
              res.data.res.product_list[i].shopUp = false;
            }
            that.setData({
              product_listTo: res.data.res.product_list,
              not_sale_count: res.data.res.not_sale_count,
              on_sale_count: res.data.res.on_sale_count,
            })
          }
        }, 'hint')
      }
    }, 'hint')
  },
  checkAll:function(){
    let that = this;
    let id = that.data.currentTab;
    let currentTab = that.data.currentTab;
   
    if (id == 0 ){
      let selectAll = [];
      for (let i = 0; i < that.data.product_list.length; i++ ){
        that.data.product_list[i].select = true;
        selectAll.push(that.data.product_list[i].product_id)
      }
      that.setData({
        product_list: that.data.product_list,
        selectAll: true,
        selectShopId: selectAll
      })
    }
    if (id == 1) {
      let selectAll = [];
      for (let i = 0; i < that.data.product_listTo.length; i++) {
        that.data.product_listTo[i].select = true;
        selectAll.push(that.data.product_listTo[i].product_id)
      }
      that.setData({
        product_listTo: that.data.product_listTo,
        selectAll: true,
        selectShopId: selectAll
      })
    }
  },
  checkAllTo: function () {
    let that = this;
    let id = that.data.currentTab;
    if (id == 0) {
      for (let i = 0; i < that.data.product_list.length; i++) {
        that.data.product_list[i].select = false;
      }
      that.setData({
        product_list: that.data.product_list,
        selectAll: false,
        selectShopId: null
      })
    }
    if (id == 1) {
      for (let i = 0; i < that.data.product_listTo.length; i++) {
        that.data.product_listTo[i].select = false;
      }
      that.setData({
        product_listTo: that.data.product_listTo,
        selectAll: false,
        selectShopId: null
      })
    }
  },
  // 批量下架
  batchBelow:function(){
    let that = this;
    let batchId = String(that.data.selectShopId);
    app.getRequest(DownSell, { "id": batchId }, function (res) {
      if (res.data.code == 0) {
        arr = [];
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
        })
        that.setData({
          selectAll: false
        })
        // that.sellerProductList(page, 20)
        app.getRequest(sellerProductList, { "offset": page, "status": 20 }, function (res) {
          if (res.data.code == 0) {
            for (let i = 0; i < res.data.res.product_list.length; i++) {
              res.data.res.product_list[i].select = false;
              res.data.res.product_list[i].shopUp = false;
            }
            that.setData({
              product_list: res.data.res.product_list,
              not_sale_count: res.data.res.not_sale_count,
              on_sale_count: res.data.res.on_sale_count,
            })
          }
        }, 'hint')
        app.getRequest(sellerProductList, { "offset": page, "status": 10 }, function (res) {
          if (res.data.code == 0) {
            for (let i = 0; i < res.data.res.product_list.length; i++) {
              res.data.res.product_list[i].select = false;
              res.data.res.product_list[i].shopUp = false;

            }
            that.setData({
              product_listTo: res.data.res.product_list,
              not_sale_count: res.data.res.not_sale_count,
            on_sale_count: res.data.res.on_sale_count,
            })
          }
        }, 'hint')
      }
    }, 'hint')
  },
  // 批量上架
  batchUp: function () {
    let that = this;
    let batchId = String(that.data.selectShopId);
    app.getRequest(UpSell, { "id": batchId }, function (res) {
      if (res.data.code == 0) {
        arr = [];
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
        })
        that.setData({
          selectAll: false
        })
        // that.sellerProductList(page, 20)
        app.getRequest(sellerProductList, { "offset": page, "status": 20 }, function (res) {
          if (res.data.code == 0) {
            for (let i = 0; i < res.data.res.product_list.length; i++) {
              res.data.res.product_list[i].select = false;
              res.data.res.product_list[i].shopUp = false;
            }
            that.setData({
              product_list: res.data.res.product_list,
              not_sale_count: res.data.res.not_sale_count,
              on_sale_count: res.data.res.on_sale_count,
            })
          }
        }, 'hint')
        app.getRequest(sellerProductList, { "offset": page, "status": 10 }, function (res) {
          if (res.data.code == 0) {
            for (let i = 0; i < res.data.res.product_list.length; i++) {
              res.data.res.product_list[i].select = false;
              res.data.res.product_list[i].shopUp = false;

            }
            that.setData({
              product_listTo: res.data.res.product_list,
              not_sale_count: res.data.res.not_sale_count,
              on_sale_count: res.data.res.on_sale_count,
            })
          }
        }, 'hint')
      }
    }, 'hint')
  },
  GoaddShop:function(){
    wx.navigateTo({
      url: '/pages/commodity/commodity?my=no'
    })
  },
  // 编辑
  compile:function(e){
    let that = this;
    let item = e.currentTarget.dataset.item;
    wx.setStorage({
      key: "shopInfo",
      data: item,
      success(res){
        wx.navigateTo({
          url: '/pages/commodity/commodity?id='+1
        })
      }
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
    let that = this;
    page = 0 ;
    // 调取接口
    that.setData({
      product_list:[],
      product_listTo: [],
    })
      app.getRequest(sellerProductList, { "offset": page, "status": 20 }, function (res) {
        if (res.data.code == 0) {
          wx.hideToast()
          for (let i = 0; i < res.data.res.product_list.length; i++) {
            res.data.res.product_list[i].select = false;
            res.data.res.product_list[i].shopUp = false;
          }
          that.setData({
            product_list: res.data.res.product_list,
            not_sale_count: res.data.res.not_sale_count,
            on_sale_count: res.data.res.on_sale_count,
          })
        }
      }, 'hint')
   
      app.getRequest(sellerProductList, { "offset": page, "status": 10 }, function (res) {
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          mask: true,
        })
        if (res.data.code == 0) {
          wx.hideToast()
          for (let i = 0; i < res.data.res.product_list.length; i++) {
            res.data.res.product_list[i].select = false;
            res.data.res.product_list[i].shopUp = false;
          }
          that.setData({
            product_listTo: res.data.res.product_list,
            not_sale_count: res.data.res.not_sale_count,
            on_sale_count: res.data.res.on_sale_count,
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            mask: true,
          })
        }
      }, 'hint')
   
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