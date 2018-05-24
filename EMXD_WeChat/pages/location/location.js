//logs.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
const address = app.globalData.host + "/user-address/get-address" // 获取用户所有地址
const addressDelete = app.globalData.host + "/user-address/delete" // 获取用户默认地址
Page({
  data: {
    default_address:[],
    address: [],
    token:'',
  },
  
  onLoad: function () {
    let that = this;
    // wx.chooseAddress({
    //   success: function (res) {
    //     console.log(res.userName)
    //     console.log(res.postalCode)
    //     console.log(res.provinceName)
    //     console.log(res.cityName)
    //     console.log(res.countyName)
    //     console.log(res.detailInfo)
    //     console.log(res.nationalCode)
    //     console.log(res.telNumber)
    //   }
    // })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.site(res.data);
        // that.getDefault(res.data);
        that.setData({
          token: res.data
        })
      }
    });
    
  },
  onShow:function(){
    let that = this;
    that.site(that.data.token)
    // that.getDefault(that.data.token);
  },
  // 地址方法
  site: function (token){
    let that = this;
    // 调取接口
    app.getRequest(address, {}, function (res) {
      if (res.data.code == 0) {
        
        that.setData({
          address:res.data.res.list
        })
      }
    })
  },
  // getDefault: function (token) {
  //   let that = this;
  //   // 调取接口
  //   app.getRequest(getDefault, { "ky-token": token }, function (res) {
  //     if (res.data.code == 0) {
  //       that.setData({
  //         default_address: res.data.res
  //       })
  //     }
  //   })
  // },
  // 选择地址
  address: function (e) {
    let that = this;
    let address = JSON.stringify(e.currentTarget.dataset.address);
    wx.navigateTo({
      url: '../newAddress/newAddress?address=' + address
    })
  },
  addressTo:function(e){
    let that = this;
    console.log(e.currentTarget.dataset.address);
    wx.showModal({
      title: '',
      content: '是否设置为默认收货地址',
      success: function (res) {
        if (res.confirm) {
          let address = JSON.stringify(e.currentTarget.dataset.address);
          app.globalData.address = address;
          wx.navigateBack({
            delta: 1
          })
          wx.setStorageSync('address', 'yes')
          console.log(app.globalData.address)
        }else{
          wx.setStorageSync('address', 'no')
        }
      }
    }) 
  },
  clickDeleteClassify:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '',
      content: '确认删除此收货地址么?',
      success: function (res) {
        if (res.confirm) {
          app.getRequest(addressDelete, { "address_id": id }, function (res) {
            if (res.data.code == 0) {
              // that.setData({
              //   address: res.data.res.list
              // })
              app.globalData.address = [];
             
              that.site(that.data.token)
              
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
})
