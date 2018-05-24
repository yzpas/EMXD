//app.js
//登陆
var tLoginUrl = "/users/login"
const tokens = '';
App({
  onLaunch: function (options) {
    const that = this;
    // that.getUserInfo();
    // that.checkLogin();
    // 登录
    
  },
  // 数据转换json
  jsonToString: function (data) {
    return JSON.stringify(data);
  },
  // 判断用户是否登陆
  // 获取用户信息
  // getUserInfo: function (cb) {
  //   var that = this
  //   if (this.globalData.userInfo) { //先读取本地用户信息
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   } else {
  //     // 没有用户信息调用登录接口
  //     wx.getUserInfo({
  //       withCredentials: false,
  //       success: function (res) {
  //         that.globalData.userInfo = res.userInfo
  //         typeof cb == "function" && cb(that.globalData.userInfo)
  //       }
  //     })
  //   }
  // },
  // // 获取登录过用户信息
  // getLoginUserInfo: function (cb) {
  //   var that = this
  //   if (this.globalData.userInfo) {
  //     typeof cb === "function" && cb(this.globalData.userInfo)
  //   } else {
  //     wx.getUserInfo({
  //       withCredentials: true,
  //       success: function (res) {
  //         that.globalData.userInfo = res.userInfo
  //         typeof cb == "function" && cb(that.globalData.userInfo)
  //       }
  //     })
  //   }
  // },
  // // 第三方登录
  // tLogin: function (encryptAppid, uide) {
  //   var that = this;
  //   wx.login({
  //     success: function (res) {
  //       if (res.code) {
  //         var requestParam = {
  //           code: res.code
  //         }
  //         let host = that.globalData.host;
  //         var loginPostUrl = host + tLoginUrl;
  //         that.getRequest(loginPostUrl, requestParam, function (res) { 
  //           wx.setStorageSync(ssidFlag, res.data.data.ssid);
  //         })
  //       }
  //     }
  //   })
  // },
  //注册页面时加载loading
  loading: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true,
      duration: 5000
    })
  },
  // 精度丢失
  accmul: function (arg1, arg2) {
    return parseFloat(arg1.toFixed(2));
    /** 下面的方式运行不对 当基础金额为0.1时 购买数量为3时 */
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },
  // get请求
  getRequest: function (url, data, succ, status) {
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'ky-token': '1aabac6d068eef6a7bad3fdf50a05cc8'
        'ky-token': wx.getStorageSync('token')
      },
      success: function (res) {
        succ && succ(res);
      },
      fail: function (res) {
        fail && fail(res);
      },
      complete: function () {
        if (!status) {
          wx.hideToast();
        }
      }
    })
  },

  // post请求
  postRequest: function (url, data, succ, status) {
    wx.request({
      url: url,
      data: data,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'ky-token': '1aabac6d068eef6a7bad3fdf50a05cc8',
        'ky-token': wx.getStorageSync('token')
      },
      success: function (res) {
        succ && succ(res);
      },
      fail: function (res) {
        fail && fail(res);
      },
      complete: function () {
        if (!status) {
          wx.hideToast();
        }
      }
    })
  },
  onShow: function () {
    wx.showShareMenu({
      withShareTicket: false
    });
    var token = wx.getStorageSync('token');
    var that = this;
    // if (token) {
    //   wx.getUserInfo({
    //     success: function (res) {
    //       that.globalData.userInfo = res.userInfo;
    //       console.log('没有请求网络，使用缓存');
    //     },
    //     fail: function () {
    //       // fail
    //       console.log("获取失败！")
    //     },
    //     complete: function () {
    //       // complete
    //       console.log("获取用户信息完成！")
    //     }
    //   })
    // } else {
    //   wx.login({
    //     success: function (res) {
    //       that.globalData.code = res.code;
    //       if (res.code) {
    //         wx.getUserInfo({
    //           withCredentials: true,
    //           success: function (res_user) {
    //             console.log(res_user)
    //             wx.request({
    //               //后台接口地址
    //               url: 'https://prd-shop-api.emaoxd.com/users/login',
    //               data: {
    //                 code: res.code,
    //                 encryptedData: res_user.encryptedData,
    //                 iv: res_user.iv
    //               },
    //               method: 'GET',
    //               header: {
    //                 'content-type': 'application/json'
    //               },
    //               success: function (res) {
    //                 console.log('请求了网络');
    //                 that.globalData.userInfo = res.data;
    //                 that.globalData.token = res.data.token
    //                 token = res.data.token;
    //                 wx.setStorageSync("token",res.data.token)
    //                 if (this.employIdCallback) {
    //                   console.log(1);
    //                   this.employIdCallback(res.data.token);
    //                 }
    //               }
    //             })
    //           }, 
    //           fail: function () {
    //             wx.showModal({
    //               title: '警告通知',
    //               content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
    //               success: function (res) {
    //                 if (res.confirm) {
    //                   wx.openSetting({
    //                     success: (res) => {
    //                       if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
    //                         wx.login({
    //                           success: function (res_login) {
    //                             if (res_login.code) {
    //                               wx.getUserInfo({
    //                                 withCredentials: true,
    //                                 success: function (res_user) {
    //                                   wx.request({
    //                                     url: 'https://prd-shop-api.emaoxd.com/users/login',
    //                                     data: {
    //                                       code: res_login.code,
    //                                       encryptedData: res_user.encryptedData,
    //                                       iv: res_user.iv
    //                                     },
    //                                     method: 'GET',
    //                                     header: {
    //                                       'content-type': 'application/json'
    //                                     },
    //                                     success: function (res) {
    //                                       wx.setStorageSync('token', res.data.token);
    //                                     }
    //                                   })
    //                                 }
    //                               })
    //                             }
    //                           }
    //                         });
    //                       }
    //                     }, fail: function (res) {

    //                     }
    //                   })

    //                 }
    //               }
    //             })
    //           }, complete: function (res) {


    //           }
    //         })
    //       }
    //     }
    //   })

    // }

    // globalData: {
    //   userInfo: null
    // }
  },
  onHide: function () {
    // Do something when hide.
  },
  onError: function (msg) {
    //console.log(msg)
  },
  globalData: {
    buttonLockStatus: {
      tixian: ''
    },
    host: "https://prd-shop-api.emaoxd.com",  // 接口调取网址
    userInfo: null, // 用户信息
    appId: "wx4d8d7a755f4d1e76", // appId
    code: '', // code
    token:'',
    cart:{},
    address:[],// 地址
    ShareAppMessage:true,
    shopCart: { //全局取用属性---购物车
      menu_list: [], //商品列表 and 商品规格 => 数组
      total_count: 0, 
      total_fee: 0, //总价格
      shopId:[],
      shopNumber: 0, //总量
      merchantName:'' // 商家名字
    },
  },
  clearCart: function() {
    if (this.globalData.shopCart.menu_list != '') {
      this.globalData.shopCart.menu_list = [];
      this.globalData.shopCart.total_count = 0;
      this.globalData.shopCart.total_fee = 0;
      this.globalData.shopCart.shopId = [];
      this.globalData.shopCart.shopNumber = 0;
      this.globalData.shopCart.merchantName = 0;
    }
  }
})