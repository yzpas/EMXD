//获取应用实例
const app = getApp()
const shopCategories = app.globalData.host + "/shop/categories" // 获取本店的商品分类
const addShopCategories = app.globalData.host + "/shop/category-create" // 添加 店铺商品分类
const updateShopCategories = app.globalData.host + "/shop/category-update" // 修改 店铺商品分类
const deleteShopCategories = app.globalData.host + "/shop/category-delete" // 删除 店铺商品分类
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopCategories: [], // 本店的商品分类
    addPopups: false, // 是否显示 添加 或者 修改分类的弹出层 
    token: '',
    inputValue:'',
    addTitle:'', // 获取分类名字
    mark: '0',
    focus: true,
    tag:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      tag: options.tag
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.shopCategories(res.data);
        that.setData({
          token: res.data
        })
      }
    });
  },
  // 获取全部商品分类列表
  shopCategories: function (token) {
    let that = this;
    // 调取接口
    app.getRequest(shopCategories, {}, function (res) {
      if (res.data.code == 0) {
        that.setData({
          shopCategories: res.data.res
        })
      }
    },'hint')
  },
  bindKeyInput: function (e) {
    let that = this;
    that.setData({
      inputValue: e.detail.value
    })
  },
  address:function(e){
    let that = this;
    let mark = e.currentTarget.dataset.mark;
    that.setData({
      addPopups: true,
      addTitle:'',
      inputValue:'',
      mark: mark
    })
  },
  updateClassify:function(e){
    let that = this;
    let title = e.currentTarget.dataset.title;
    let mark = e.currentTarget.dataset.mark;
    let token = that.data.token;
    let id = e.currentTarget.dataset.id;
    that.setData({
      addPopups: true,
      addTitle: title,
      inputValue: title,
      mark: mark,
      id: id
    })
  },
  // 取消  and 确定
  cancel:function(){
    let that = this;
    that.setData({
      addPopups: false,
    })
  },
  confirm: function () {
    let that = this;
    let title = that.data.inputValue;
    let token = that.data.token;
    let id = that.data.id;
    console.log(title);
    if (title ){
      that.addClassify(title, token, id)
     
    }else{
      wx.showToast({
        title: '分类名称不能为空',
        icon: 'none',
        duration: 2000
      })
    }
   
  },

  // 添加分类 and 修改
  addClassify: function (title, token ,id) {
    let that = this;
    console.log(that.data.mark)
    // 调取接口
    if( that.data.mark == 1 ){
      app.postRequest(addShopCategories, { "ky-token": token, "title": title }, function (res) {
        if (res.data.code == 0) {
          that.setData({
            addTitle: '',
            inputValue: '',
          })
          that.shopCategories(token)
          that.setData({
            addPopups: false,
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }, 'hint')
    } else if (that.data.mark == 2  ){
      app.postRequest(updateShopCategories, { "ky-token": token, "title": title, "category_id":id}, function (res) {
        if (res.data.code == 0) {
          that.setData({
            addTitle: '',
            inputValue: '',
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.shopCategories(token)
          that.setData({
            addPopups: false,
          })
          
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },'hint')
    }
  },
  clickDeleteClassify:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let token = that.data.token;
    that.deleteClassify(token,id);
  },
  // 删除
  deleteClassify: function (token,id){
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除此分类么？',
      success: function (res) {
        if (res.confirm) {
          app.getRequest(deleteShopCategories, { "id": id }, function (res) {

            if (res.data.code == 0) {
              that.shopCategories(token)
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }, 'hint')
        } else if (res.cancel) {}
      }
    })
  },
  ClickShop:function(e){
    let that = this;
    let info = e.target.dataset.info;
    let tag = that.data.tag;
    console.log(tag)
    if (tag === 'addshop' || !tag){
      wx.showModal({
        title: '',
        content: '确定选此分类?',
        success: function (res) {
          if (res.confirm) {
            wx.setStorage({
              key: "categoryId",
              data: info,
              success(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{

    }
    
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