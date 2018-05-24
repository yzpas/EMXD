//获取应用实例
const app = getApp()
const productsView = app.globalData.host + "/products/view" // 商品详情页
const qrcodeImages = app.globalData.host + "/share/qrcode-image" // 产品小程序码合成图

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 500,
    select_specification: false, //选择规格
    productsView: [], // 商品详情
    attr: [], // 规格
    attr_id: '', // 规格ID
    attr_price: '', // 不同规格不同价格
    shopCatr: [], // 购物车内容
    attr_list:[], // 规格数组
    shop_attr:[], // 商品加规格数组
    shop_number:1,
    cart: false, // 购物车
    menu_list:[],
    shopNumberr: '0',// 购物车数量
    // 商品页面点击加号与减号
    total_fee: 0, //商品价格
    selectTo: 0,
    selectTos: false,
    allselect: false,
    images:[],
    product_id:null,    
    ShareAppMessage:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.identifying == 'yes') {
      app.globalData.ShareAppMessage = false;
    } else if (options.identifying == 'no'){
      app.globalData.shopCart.menu_list = [];
      app.globalData.shopCart.shopNumber = 0;
      app.globalData.shopCart.total_fee = 0;
    }
    let that = this;
    let id = options.id;
    // let token = app.globalData.userInfo.token;
    let shopCatr = app.globalData.shopCart;

    let allselect = false;
    let selectTos = false;
    let calculate = 0
    
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      if (app.globalData.shopCart.menu_list[i].select == true) {
        calculate += 1;
        selectTos = true;
      }
    }
    if (calculate === app.globalData.shopCart.menu_list.length) {
      allselect = true;
    }
    that.setData({
      shopCatr: shopCatr,
      menu_list: shopCatr.menu_list,
      product_id: id,
      allselect: allselect,
      selectTos: selectTos,
      selectTo: calculate,
      ShareAppMessage: app.globalData.ShareAppMessage,
    })
    that.productsView(id) // 调取接口方法
  },
  productsView: function (id) {
    let that = this;
    // 调取接口
    app.getRequest(productsView, { "id": id }, function (res) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true
      })
      if (res.data.code == 0) {
        wx.hideToast()
        if (res.data.res.attr){
          that.setData({
            attr_price: res.data.res.attr[0].price,
            attr_id: res.data.res.attr[0].attr_id,
          })
          //that.data.attr_list = that.data.productsView.attr[0];
        }
        that.setData({
          productsView: res.data.res,
          attr: res.data.res.attr,
          images: res.data.res.images,
        })
      } else if (res.data.code == -100) {
        wx.showToast({
          title: '用户登录过期,请重新获取信息授权!',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/index/index?parameter=product&id=' + id
          })
        }, 2000)
        return;
        // wx.login({
        //   success: function (resCode) {
        //     wx.getUserInfo({
        //       withCredentials: true,
        //       success: function (res_user) {
        //         wx.request({
        //           url: 'https://dev-shop-api.emaoapp.com/users/login',
        //           data: {
        //             code: resCode.code,
        //             encryptedData: res_user.encryptedData,
        //             iv: res_user.iv
        //           },
        //           method: 'GET',
        //           header: {
        //             'content-type': 'application/json'
        //           },
        //           success: function (res) {
        //             wx.setStorageSync('token', res.data.token);
        //             that.productsView();
        //           }
        //         })
        //       }
        //     })
        //   }
        // })
      } else {
        wx.showToast({
          title: '网络错误请稍后再试...',
          icon: 'none',
          mask: true
        })
      }
      
      //that.data.productsView.attr_list = that.data.attr_list;
      console.log(that.data.productsView);
    }, 'hint')
   
  },
  // 规格添加
  appshop: function (e) {
    let that = this;
    let attr_id = that.data.attr_id;
    let attr_price = that.data.attr_price;
    let shop_number = that.data.shop_number;
    let shop = that.data.productsView;
    let selectTos = false;
    let attr_info = {
      attr_id: attr_id,
      attr_price: attr_price,
      shop_number: shop_number
    };
    shop.attr_info = attr_info;
    shop.select = true;
    // for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
    //   if (app.globalData.shopCart.menu_list[i].select == true) {
    //     selectTos = true;
    //   }
    // }
    that.addCart(attr_id, shop)
    that.setData({
      selectTos: true,
      allselect: true
    })
    // app.globalData.shopCart.menu_list.push(shop);
    // console.log(app.globalData.shopCart.menu_list)
    // that.setData({
    //   menu_list: app.globalData.shopCart.menu_list
    // })
  },
  // 增加商品 加入购物车 
  addCart: function (product_id, shop) {
    let that = this;
    let cart_is_exist_menu = null; //是否有重复添加
    let cart_is_exist_menus = null; //是否有重复添加
    // 循环数组 并判断 购物车是否有此商品ID 如果有 则 变换length 如果没有则增加此商品
    if (that.data.menu_list.length < 1) {
      // 数组为空直接将商品加入购物车
      that.data.menu_list.push(shop);
      console.log(that.data.menu_list)
      wx.showToast({
        title: '添加购物车成功',
        icon: 'success',
        duration: 2000
      })
      let selectTo = 0;
      for (let i = 0; i < that.data.menu_list.length; i++) {
        if (that.data.menu_list[i].select == true) {
          console.log(1);
          selectTo += 1;
        }
      }
      that.setData({
        selectTo: selectTo,
        select_specification: false
      })
      // for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      //   if (app.globalData.shopCart.menu_list[i].select == true) {
      //     that.setData({
      //       selectTos: false,
      //     })
      //   }
      // }
    } else {
      // 数组不为空 调取方法传入商品ID
      //that.addCart(product_id, shop);
      // for (let i = 0; i < that.data.menu_list.length; i++) {
      //   if (that.data.menu_list[i].product_id == product_id) {
      //     that.data.menu_list[i].length += 1;
      //     cart_is_exist_menu = true; // 是否为重复添加 
      //     break;
      //   }
      // }
      // if (!cart_is_exist_menu) {
      //   shop.length = 0;
      //   that.data.menu_list.push(shop);
      // }
      for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
        if (app.globalData.shopCart.menu_list[i].attr_info.attr_id == product_id) {
          app.globalData.shopCart.menu_list[i].attr_info.shop_number += shop.attr_info.shop_number;
          cart_is_exist_menu = true; // 是否为重复添加 
          break;
        }
      }
      if (!cart_is_exist_menu) {
        console.log('不重复')
        that.data.menu_list.push(shop);
        app.globalData.shopCart.menu_list = that.data.menu_list;
        that.setData({
          menu_list: app.globalData.shopCart.menu_list
        })
      }
      for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
        if (app.globalData.shopCart.menu_list[i].attr_info.attr_id != product_id) {
          // app.globalData.shopCart.menu_list[i].attr_info.shop_number += shop.attr_info.shop_number;
          cart_is_exist_menus = true; // 是否为重复添加 
          break;
        }
      }
      if (!cart_is_exist_menus) {
        console.log('重复')
        that.setData({
          menu_list: app.globalData.shopCart.menu_list
        })
      }
      let selectTo = 0;
      for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
        if (app.globalData.shopCart.menu_list[i].select == true) {
          console.log(1);
          selectTo += 1;
        }
      }
      that.setData({
        selectTo: selectTo,
        select_specification: false,
        menu_list: app.globalData.shopCart.menu_list
      })
      wx.showToast({
        title: '添加购物车成功',
        icon: 'success',
        duration: 2000
      })
      
      // for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      //   if (app.globalData.shopCart.menu_list[i].select == true) {
      //     that.setData({
      //       selectTos: false,
      //     })
      //   }
      // }
      // console.log(that.data.menu_list);
    }
    app.globalData.shopCart.menu_list = that.data.menu_list; // 公共添加商品
    // 页面增减数量
    // for (let i = 0; i < that.data.productsList.length; i++) {
    //   if (that.data.productsList[i].product_id == product_id) {
    //     that.data.productsList[i].length += 1;
    //   }
    // }
    // for (let i = 0; i < that.data.products.length; i++) {
    //   if (that.data.products[i].product_id == product_id) {
    //     that.data.products[i].length += 1;
    //   }
    // }
    // for (let i = 0; i < that.data.products.length; i++) {
    //   for (let j = 0; j < that.data.productsList.length; j++) {
    //     if (that.data.products[i].product_id == that.data.productsList[j].product_id) {
    //       that.data.products[i] = that.data.productsList[j]
    //     }
    //   }
    // }
    let shopNumber = 0;
    let total_fee = that.data.total_fee;
    // 循环购物车 并循环出每个商品购买的数量 并增加
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      shopNumber += Number(app.globalData.shopCart.menu_list[i].attr_info.shop_number);
    }
    total_fee = app.accmul(total_fee + Number(shop.attr_info.attr_price) * that.data.shop_number,'100');
    app.globalData.shopCart.shopNumber = shopNumber;
    app.globalData.shopCart.total_fee = total_fee;

    // 显示弹框
    that.setData({
      // cart: true,
      menu_list: that.data.menu_list,
      productsList: that.data.productsList,
      products: that.data.products,
      shopNumberr: shopNumber,
      total_fee: total_fee,
    })
  },
  // 选择规格里的减少购物车
  subtractCartTo: function () {
    let that = this;
    if ((that.data.shop_number - 1) == 0) {
      wx.showToast({
        title: '最少为1件商品',
        icon: 'none',
        duration: 2000
      })
    } else {
      that.data.shop_number -= 1;
    }
    that.setData({
      shop_number: that.data.shop_number
    })
  },
  // 选择规格里的增加购物车
  addCartTo: function () {
    let that = this;
    let attr_id = that.data.attr_id;
    // 1.获取当前规格id 如果是规格里的第一个 则是默认规格 添加到productsView数组里
    for (let i = 0; i < that.data.attr.length; i++) {
      if (that.data.attr[i].attr_id == attr_id) {
        that.data.attr_list = [];
        that.data.attr_list = that.data.attr[i];
        if ((that.data.shop_number + 1) > Number(that.data.attr[i].stock)) {
          wx.showToast({
            title: '选择数量大于库存',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.data.shop_number += 1;
        }
      }
    }
    let attr_list = that.data.attr_list;
    that.data.attr_list = attr_list;
    console.log(that.data.productsView)
    that.setData({
      shop_number: that.data.shop_number
    })
  },
  addCommodityTo:function(e){
    let that = this;
    let attr_id = e.currentTarget.dataset.id.attr_id;
    let shop_list = app.globalData.shopCart.menu_list;
    let total_fee = that.data.total_fee;
    let numbersTo = 0;
    let shopNumberTo = 0
    for (let i = 0; i < shop_list.length; i++ ){
      if (shop_list[i].attr_info.attr_id == attr_id ){
        shop_list[i].attr_info.shop_number += 1;
        numbersTo = shop_list[i].attr_info.shop_number;
        shopNumberTo = Number(shop_list[i].attr_info.attr_price)
      }
    }
    app.globalData.shopCart.menu_list = shop_list; // 公共添加商品
    app.globalData.shopCart.shopNumber += 1;
    app.globalData.shopCart.total_fee = app.accmul(app.globalData.shopCart.total_fee + shopNumberTo,'100');
    // 显示弹框
    that.setData({
      menu_list: app.globalData.shopCart.menu_list,
      shopNumberr: app.globalData.shopCart.shopNumber,
      total_fee: app.globalData.shopCart.total_fee,
    })
  },
  remCommodityTo: function (e) {
    let that = this;
    let attr_id = e.currentTarget.dataset.id.attr_id;
    let shop_list = app.globalData.shopCart.menu_list;
    let total_fee = that.data.total_fee;
    let numbersTo = 0;
    let shopNumberTo = 0;
    let calculate = 0
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      if (app.globalData.shopCart.menu_list[i].select == true) {
        calculate += 1;
      }
    }
    if (e.currentTarget.dataset.id.shop_number == 1){
      wx.showModal({
        title: '',
        content: '确定要删除此商品么？',
        success: function (res) {
          if (res.confirm) {
            for (let i = 0; i < shop_list.length; i++) {
              if (shop_list[i].attr_info.attr_id == attr_id) {
                numbersTo = shop_list[i].attr_info.shop_number;
                shopNumberTo = Number(shop_list[i].attr_info.attr_price)
                shop_list.splice(i, 1)
              }
            }
            calculate -= 1;
            app.globalData.shopCart.menu_list = shop_list; // 公共添加商品
            app.globalData.shopCart.shopNumber -= 1;
            app.globalData.shopCart.total_fee = app.accmul(app.globalData.shopCart.total_fee - shopNumberTo, '100');
            // 显示弹框
            that.setData({
              selectTo: calculate,
              menu_list: app.globalData.shopCart.menu_list,
              shopNumberr: app.globalData.shopCart.shopNumber,
              total_fee: app.globalData.shopCart.total_fee,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      for (let i = 0; i < shop_list.length; i++) {
        if (shop_list[i].attr_info.attr_id == attr_id) {
          shop_list[i].attr_info.shop_number -= 1;
          numbersTo = shop_list[i].attr_info.shop_number;
          shopNumberTo = Number(shop_list[i].attr_info.attr_price)
        }
      }
      app.globalData.shopCart.menu_list = shop_list; // 公共添加商品
      app.globalData.shopCart.shopNumber -= 1;
      app.globalData.shopCart.total_fee = app.accmul(app.globalData.shopCart.total_fee - shopNumberTo, '100');
      // 显示弹框
      that.setData({
        menu_list: app.globalData.shopCart.menu_list,
        shopNumberr: app.globalData.shopCart.shopNumber,
        total_fee: app.globalData.shopCart.total_fee,
      })
    }
    
  },
  attr_price: function (e) {
    let that = this;
    let attr_id = e.currentTarget.dataset.id;
    let price = e.currentTarget.dataset.price;
    that.setData({
      attr_id: attr_id,
      attr_price: price,
      shop_number: 1
    })
  },

  // 去结算
  accounts: function () {
    wx.navigateTo({
      url: '../settle/settle'
    })
  },
  Gouser: function () {
    console.log(1);
    wx.redirectTo({
      url: '../logs/logs'
    })
  },
  // 加入购物车
  addCarts: function () {
    let that = this;
    that.setData({
      shop_number: 1,
      select_specification: true
    })
  },
  // 隐藏弹层
  popupShow: function () {
    let that = this;
    that.setData({
      select_specification: false
    })
  },
  // 购物车点击删减按钮
  cartRemove: function () {
    let that = this;
    that.setData({
      cart: false,
      select_specification: false
    })
  },
  popup: function () {
    let that = this;
    that.setData({
      cart: false,
      select_specification: false
    })
  },
  // 点击购物车
  ClickCart: function () {
    let that = this;
    // 判断购物车里的length 是否为0 如果是0 则删除此商品
    let cart = app.globalData.shopCart.menu_list;

    // let cartTo = '';
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].shop_number == 0) {
        cart.splice(i, 1)
      }
    }
    app.globalData.shopCart.menu_list = cart;
    if (that.data.cart){
      that.setData({
        cart: false,
        menu_list: cart,
      })
    }else{
      that.setData({
        cart: true,
        menu_list: cart,
      })
    }
  },
  selectClick: function (e) {
    let that = this;
    let attr_info = e.currentTarget.dataset.id;
    let selectTo = that.data.selectTo;
    let selectTos = null;
    let allselect = false;
    let calculate = 0
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      if (app.globalData.shopCart.menu_list[i].attr_info.attr_id == attr_info.attr_id) {
        app.globalData.shopCart.menu_list[i].select = true;
      }
    }
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      if (app.globalData.shopCart.menu_list[i].select == true) {
        calculate += 1;
      }
    }
    if (calculate === app.globalData.shopCart.menu_list.length) {
      allselect = true;
    }
    selectTo += 1;
    if (selectTo > 0) {
      selectTos = true;
    }
    that.setData({
      selectTo: selectTo,
      selectTos: selectTos,
      allselect: allselect,
      menu_list: app.globalData.shopCart.menu_list
    })
    app.globalData.shopCart.menu_list = app.globalData.shopCart.menu_list;
  },
  selectClicks: function (e) {
    let that = this;
    let attr_info = e.currentTarget.dataset.id;
    let selectTo = that.data.selectTo;
    let selectTos = null;
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      if (app.globalData.shopCart.menu_list[i].attr_info.attr_id == attr_info.attr_id) {
        app.globalData.shopCart.menu_list[i].select = false;
      }
    }
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      if (app.globalData.shopCart.menu_list[i].select == true) {
        selectTos = true;
      }
    }
    selectTo -= 1;
    // if (selectTo = 0) {
    //   selectTos = false;
    // }
    that.setData({
      selectTo: selectTo,
      selectTos: selectTos,
      allselect: false,
      menu_list: app.globalData.shopCart.menu_list
    })
    
    app.globalData.shopCart.menu_list = app.globalData.shopCart.menu_list;
    console.log(app.globalData.shopCart.menu_list);
  },
  allselect: function () {
    let that = this;
    let selectTo = 0;
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {

      app.globalData.shopCart.menu_list[i].select = true;

    }
    selectTo = app.globalData.shopCart.menu_list.length;
    that.setData({
      selectTo: selectTo,
      allselect: true,
      selectTos: true,
      menu_list: app.globalData.shopCart.menu_list
    })
    app.globalData.shopCart.menu_list = app.globalData.shopCart.menu_list;
  },
  allselectTo: function () {
    let that = this;
    let selectTo = 0;
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      app.globalData.shopCart.menu_list[i].select = false;
    }
    selectTo = 0;
    that.setData({
      selectTo: selectTo,
      allselect: false,
      selectTos: false,
      menu_list: app.globalData.shopCart.menu_list
    })
    app.globalData.shopCart.menu_list = app.globalData.shopCart.menu_list;
  },
  del: function () {
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要清空所有商品么',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            menu_list: [],
            selectTos: false,
            shopNumberr: 0,
            total_fee: 0,
            selectTo: 0,
            allselect: false
          })
          app.globalData.shopCart.menu_list = [];
          app.globalData.shopCart.shopNumber = 0;
          app.globalData.shopCart.total_fee = 0;
          // app.globalData.shopCart.total_fee = app.globalData.shopCart.total_fee;
          // app.globalData.shopCart.shopNumber = app.globalData.shopCart.shopNumber;
          // app.globalData.shopCart.menu_list = app.globalData.shopCart.menu_list;

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  create:function(){
    wx.showToast({
      title: '正在生成图片',
      icon: 'loading',
      mask: true
    })
    let that = this;
    let product_id = that.data.product_id;
    app.getRequest(qrcodeImages, { "product_id": product_id }, function (res) {
      
      if (res.data.code == 0) {
        wx.hideToast()
        wx.previewImage({
          current: res.data.res.link, // 当前显示图片的http链接
          urls: [res.data.res.link] // 需要预览的图片http链接列表
        })
      }
    },'hint')
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
    that.setData({
      menu_list: app.globalData.shopCart.menu_list,
      shopNumberr: app.globalData.shopCart.shopNumber,
      total_fee: app.globalData.shopCart.total_fee,
    })
    that.productsView(that.data.product_id) // 调取接口方法
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let id = that.data.product_id;
    return {
      title: that.data.productsView.title,
      path: '/pages/productDetails/productDetails?is_share=1&identifying=no&id=' + id
    }
  }
})