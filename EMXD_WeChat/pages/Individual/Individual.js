//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const shopIndex = app.globalData.host + "/shop/index" // 首页接口
const shopContents = app.globalData.host + "/shop/shop-contents" // 首页接口
const shopDelete = app.globalData.host + "/shop/shop-contents-delete" // 首页接口


var page = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: '0', // tab切换
    cart: false, // 购物车
    categories: [], // 商品类别
    products: [], // 商品详情
    shop_detail: [], // 店铺详情
    shop_background_image: '', // 店铺背景图片
    categoriesOne: '', // 商品类别
    shop_title: '', // 店铺名称
    shop_qrcode: '', // 店铺二维码
    productsList: [], //根据ID 添加商品
    select_specification: false, // 规格
    imgUrls: [], // 规格图片 
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 500,
    attr: [], // 商品规格
    attr_price: '', // 商品规格价格
    attr_id: '', // 商品规格ID
    menu_list: [], // 购物车
    shopNumberr: '0',// 购物车数量
    // 商品页面点击加号与减号
    total_fee: 0.00, //商品价格
    shop: [], // 当前点击的商品存放地址
    shopCatr: [], // 购物车内容
    attr_list: [], // 规格数组
    shop_attr: [], // 商品加规格数组
    shop_number: 1,
    selectTo: 0,
    selectTos: false,
    allselect: false,
    shopId: '',
    ShareAppMessage: true,
    shopContents: [],// 动态
    is_can_delete: '',
    is_can_write_content:'',
    scrollTop: '',
    scrollY:true,
  },
  selectTab: function (e) {
    // console.log(e);
    let that = this;
    let id = e.target.dataset.id;
    let shopId = that.data.shopId;
    that.setData({
      select: id
    })
    
    // if (id == 1) {
      
    //   that.shopContents(shopId, page, 'chu');

    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.identifying && options.identifying == 'yes') {
        app.globalData.ShareAppMessage = false;
      } else if (options.identifying == 'no') {
        app.clearCart()
      }

    let that = this;
    if (typeof options.scene != 'undefined') {
      var scene = decodeURIComponent(options.scene);
      var sceneObj = util.parseQueryString(scene);      
      var shopId = sceneObj.id;
    } else {      
      var shopId = options.id;
    }

    that.shopContents(shopId, page, 'chu');
    // let token = app.globalData.userInfo.token;
    that.shopIndex(shopId) // 调取接口方法
    let selectTo = 0
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      if (app.globalData.shopCart.menu_list[i].select = true) {
        selectTo += 1;
      }
    }

    that.setData({
      menu_list: app.globalData.shopCart.menu_list,
      selectTo: selectTo,
      shopId: shopId,
      ShareAppMessage: app.globalData.ShareAppMessage,
    })
    
  },
  // onReady:function (options) {
  //   console.log(options.identifying)
    
  //   // body...
  // },
  // onReachBottom: function () {
  //   console.log(1);
  //   let that = this;
  //   page += 20;
  //   that.shopContents(page);
  // },
  // scroll: function (event) {
  //   //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
  //   this.setData({
  //     scrollTop: event.detail.scrollTop
  //   });
  // },
  bindDownLoad: function () {
    console.log(1);
    let that = this;
    page += 20;
    that.shopContents(that.data.shopId, page, 'DownLoad');
  },
  deleteTo: function (e) {
    let that = this;
    let contentId = e.target.dataset.content;
    wx.showModal({
      title: '',
      content: '确定要删除此条动态么？',
      success: function (res) {
        if (res.confirm) {
          // 调取接口
          app.getRequest(shopDelete, { content_id: contentId }, function (res) {
            if (res.data.code == 0) {
              console.log(1);
             
              // that.shopContents(that.data.shopId,page);
              that.shopContents(that.data.shopId, 0,'delete');
            } else if (res.data.code == -100) {
              wx.showToast({
                title: '用户登录过期,请重新获取信息授权!',
                icon: 'none',
                duration: 2000
              })
              setTimeout(function () {
                wx.removeStorageSync('token')
                wx.navigateTo({
                  url: '/pages/index/index?parameter=yes'
                })
              }, 2000)
              return;
            } else {
              wx.showToast({
                title: '网络错误请稍后再试...',
                icon: 'none',
                mask: true
              })
            }
          }, 'hint')
        }
      }
    })
  },
  // 动态调取接口获取数据
  shopContents: function (shopId, page, DownLoad) {
    let that = this;
    // 调取接口
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true,
    })
    app.getRequest(shopContents, { shop_id: shopId, offset: page }, function (res) {
      if (res.data.code == 0) {
        wx.hideToast()
        if (res.data.res.list.length > 0) {
          if (DownLoad == 'DownLoad'){ // 如果是下拉加载则往list追加
            that.setData({
              shopContents: that.data.shopContents.concat(res.data.res.list),
              is_can_delete: res.data.res.is_can_delete
            })
          } else if (DownLoad == 'delete'){
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              mask: true,
            })
            that.setData({
              shopContents: res.data.res.list,
              is_can_delete: res.data.res.is_can_delete
            })
          }else{ // 判断是否是第一次加载
            if (that.data.shopContents.length == 0) {
              that.setData({
                shopContents: that.data.shopContents.concat(res.data.res.list),
                is_can_delete: res.data.res.is_can_delete
              })
            } else {
              that.setData({
                shopContents: res.data.res.list,
                is_can_delete: res.data.res.is_can_delete
              })
            }
          }
        }else{
          if (DownLoad == 'DownLoad'){
            wx.showToast({
              title: '没有更多了',
              icon: 'none',
              duration: 1500
            })
          } else if (DownLoad == 'delete') {
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              mask: true,
            })
            that.setData({
              shopContents: res.data.res.list,
              is_can_delete: res.data.res.is_can_delete
            })
          }
        }
      }  else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          mask: true
        })
      }
    }, 'hint')
  },
  // 点击查看动态图片
  CheckImg: function (e) {
    let that = this;
    let img = e.target.dataset.img;
    let imglist = e.target.dataset.imglist;
    console.log(imglist);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
  // 点击分类tab
  categories: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    that.addProductsList(id);
    that.setData({
      categoriesOne: id,
    })

  },
  // 获取数据方法
  shopIndex: function (id, token) {
    let that = this;
    // 调取接口
    app.loading();
    app.getRequest(shopIndex, { "shop_id": id }, function (res) {
      if (res.data.code == 0) {
       
        wx.hideToast()
        wx.setNavigationBarTitle({
          title: res.data.res.shop_title
        })
        console.log(res.data.res.products);
        console.log(res.data.categories)
        if (res.data.res.categories.length != 0){
          that.setData({
            categories: res.data.res.categories,
            products: res.data.res.products,
            shop_detail: res.data.res.shop_detail,
            shop_background_image: res.data.res.shop_background_image,
            shop_title: res.data.res.shop_title,
            shop_qrcode: res.data.res.shop_qrcode,
            categoriesOne: res.data.res.categories[0].id,
            is_can_write_content: res.data.res.is_can_write_content,
          })
          that.addProductsList(res.data.res.categories[0].id);
        }else{
          that.setData({
            categories: res.data.res.categories,
            products: res.data.res.products,
            shop_detail: res.data.res.shop_detail,
            shop_background_image: res.data.res.shop_background_image,
            shop_title: res.data.res.shop_title,
            shop_qrcode: res.data.res.shop_qrcode,
            is_can_write_content: res.data.res.is_can_write_content,
          })
          // that.addProductsList(res.data.res.categories[0].id);
        }
      } else if (res.data.code == -100) {
        wx.showToast({
          title: '用户登录过期,请重新获取信息授权!',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/index/index?parameter=interval&id='+id
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
        //             that.shopIndex();
        //           }
        //         })
        //       }
        //     })
        //   }
        // })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          mask: true
        })
      }
    }, 'hint')
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
  // 规格添加
  appshop: function (e) {
    let that = this;
    let attr_id = that.data.attr_id;
    let attr_price = that.data.attr_price;
    let shop_number = that.data.shop_number;
    let shop = that.data.shop;
    let selectTo = 0;
    let attr_info = {
      attr_id: attr_id,
      attr_price: attr_price,
      shop_number: shop_number
    }
    shop.attr_info = attr_info;
    shop.select = true;

    that.addCart(attr_id, shop)
    that.setData({
      selectTos: true,
      allselect: true,
      cart: false
    })
    // app.globalData.shopCart.menu_list.push(shop);
    // console.log(app.globalData.shopCart.menu_list)
    // that.setData({
    //   menu_list: app.globalData.shopCart.menu_list
    // })
  },
  // 填加商品
  addProductsList: function (id) {
    let that = this;
    let products = that.data.products;
    let arrProducts = [];
    let isLength;
    for (let i = 0; i < products.length; i++) {
      if (products[i].cat_id == id) {
        if (products[i].length == undefined) {
          products[i].length = 0;
        }
        arrProducts.push(products[i])
      }
    }
    that.setData({
      productsList: arrProducts
    })
  },
  // 
  shop_detail_tel: function () {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.shop_detail.mobile
    })
  },
  addCommodityTo: function (e) {
    let that = this;
    let attr_id = e.currentTarget.dataset.id.attr_id;
    let shop_list = app.globalData.shopCart.menu_list;
    let total_fee = that.data.total_fee;
    let numbersTo = 0;
    let shopNumberTo = 0
    for (let i = 0; i < shop_list.length; i++) {
      if (shop_list[i].attr_info.attr_id == attr_id) {
        shop_list[i].attr_info.shop_number += 1;
        numbersTo = shop_list[i].attr_info.shop_number;
        shopNumberTo = Number(shop_list[i].attr_info.attr_price)
      }
    }
    app.globalData.shopCart.menu_list = shop_list; // 公共添加商品
    app.globalData.shopCart.shopNumber += 1;
    app.globalData.shopCart.total_fee = app.accmul(shopNumberTo + app.globalData.shopCart.total_fee, '100');
    console.log('app.globalData.shopCart.total_fee' + app.globalData.shopCart.total_fee)
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
    console.log(calculate)
    if (e.currentTarget.dataset.id.shop_number == 1) {
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
            app.globalData.shopCart.total_fee = app.accmul(shopNumberTo - app.globalData.shopCart.total_fee,'100');
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
    } else {
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
  // 点击添加商品 添加购物车
  addCommodity: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let productsList = that.data.productsList;
    let shopAdd = e.currentTarget.dataset.shopadd;
    let products = that.data.products;
    let image = [];
    let shop_attr; // 规格
    let shop = {};// 商品
    let shopTo = {};
    console.log(shopAdd)
    that.setData({
      shop_number: 1
    })
    if (shopAdd == 1) {
      for (let i = 0; i < that.data.menu_list.length; i++) {
        console.log(that.data.menu_list[i].product_id)
        if (that.data.menu_list[i].product_id == id) {
          shop = that.data.menu_list[i];
          shop_attr = productsList[i].attr;
        }
      }
      that.setData({
        shop: shop,
      })
    } else {
      for (let i = 0; i < productsList.length; i++) {
        console.log(productsList[i].product_id)
        if (productsList[i].product_id == id) {
          image.push(productsList[i].image)
          shop_attr = productsList[i].attr;
          shop = productsList[i];
        }
      }
      that.setData({
        imgUrls: image,
        attr: shop_attr,
        attr_price: shop_attr[0].price,
        attr_id: shop_attr[0].attr_id,
        shop: shop,
      })
    }
    for (let i = 0; i < that.data.menu_list.length; i++) {
      console.log(that.data.menu_list[i].product_id)
      if (that.data.menu_list[i].product_id == id) {
        shopTo = that.data.menu_list[i];
      }
    }

    // 判断是否有规格 有显示规格 没有显示购物车
    if (shop_attr) {
      that.specification();
      that.setData({
        cart: true,
        select_specification: true
      })
    } else {
      // that.addCart(id, shop)
    }
  },
  // 增加商品 加入购物车 
  addCart: function (product_id, shop) {
    let that = this;
    let cart_is_exist_menu = null; //是否有重复添加
    let cart_is_exist_menus = null; //是否有重复添加

    // 循环数组 并判断 购物车是否有此商品ID 如果有 则 变换length 如果没有则增加此商品
    if (that.data.menu_list.length < 1) {
      // 数组为空直接将商品加入购物车
      shop.length = 0;
      console.log(shop)
      that.data.menu_list.push(shop);
      wx.showToast({
        title: '添加购物车成功',
        icon: 'success',
        duration: 2000
      })
      console.log(app.globalData.shopCart.menu_list);
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
      // for (let i = 0; i < app.globalData.shopCart.menu_list.length ; i++){
      //   if (app.globalData.shopCart.menu_list[i].select == true){
      //     that.setData({
      //       selectTos: true,
      //     })
      //   }
      // }
    } else {
      // 数组不为空 调取方法传入商品ID
      //that.addCart(product_id, shop);
      console.log(app.globalData.shopCart.menu_list)
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
      // that.data.menu_list.push(shop);
      // for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      //   if (app.globalData.shopCart.menu_list[i].select == true) {
      //     that.setData({
      //       selectTos: false,
      //     })
      //   }
      // }
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
    console.log(total_fee);
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
  // 点击删减商品 将购物车数量减少
  remCommodity: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let isrem = e.currentTarget.dataset.isrem;  // 0  商品列表删减   1 购物车删减
    let length = e.currentTarget.dataset.length;  // 购物车商品个数
    let productsList = that.data.productsList;
    let products = that.data.products;
    let shop = {}; // 商品
    let shopTo = {}; // 商品
    for (let i = 0; i < productsList.length; i++) {
      console.log(productsList[i].product_id)
      if (productsList[i].product_id == id) {
        shop = productsList[i];
      }
    }
    for (let i = 0; i < that.data.products.length; i++) {
      console.log(that.data.products[i].product_id)
      if (that.data.products[i].product_id == id) {
        shopTo = that.data.products[i];
      }
    }
    if (isrem == 1 && length == 1) {
      // 判断购物车里的length 是否为0 如果是0 则删除此商品
      let cart = app.globalData.shopCart.menu_list;
      wx.showModal({
        title: '',
        content: '确定要删除此商品么？',
        success: function (res) {
          if (res.confirm) {

            for (let i = 0; i < cart.length; i++) {
              if (cart[i].product_id == id) {
                cart.splice(i, 1)
              }
            }
            for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
              if (app.globalData.shopCart.menu_list[i].product_id == id) {
                app.globalData.shopCart.menu_list.splice(i, 1)
              }
            }

            that.setData({
              menu_list: app.globalData.shopCart.menu_list,
              products: that.data.products
            })
            that.subtractCart(id, shopTo, isrem);

          } else if (res.cancel) { }
        }
      })
    } else {
      that.subtractCart(id, shopTo);
      for (let i = 0; i < products.length; i++) {
        if (products[i].product_id == id) {
          products[i].length -= 1;
        }
      }
      that.setData({
        products: that.data.products
      })
    }
  },
  subtractCart: function (product_id, shop, isrem) {
    let that = this;
    for (let i = 0; i < that.data.menu_list.length; i++) {
      if (that.data.menu_list[i].product_id == product_id) {
        that.data.menu_list[i].length -= 1;
      }
    }
    console.log(that.data.menu_list)
    for (let i = 0; i < that.data.productsList.length; i++) {
      if (that.data.productsList[i].product_id == product_id) {
        that.data.productsList[i].length -= 1;
      }
    }
    console.log(that.data.productsList)
    for (let i = 0; i < that.data.products.length; i++) {
      if (that.data.products[i].product_id == product_id) {
        that.data.products[i].length -= 1;
      }
    }
    for (let i = 0; i < that.data.products.length; i++) {
      for (let j = 0; j < that.data.productsList.length; j++) {
        if (that.data.products[i].product_id == that.data.productsList[j].product_id) {
          that.data.products[i] = that.data.productsList[j]
        }
      }
    }

    app.globalData.shopCart.menu_list = that.data.menu_list; // 公共添加商品
    let shopNumberr = 0;
    // 循环购物车 并循环出每个商品购买的数量 并增加
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      shopNumberr += app.globalData.shopCart.menu_list[i].length;
    }
    app.globalData.shopCart.total_fee -= Number(shop.attr[0].price);
    app.globalData.shopCart.shopNumber = shopNumberr;

    that.setData({
      menu_list: that.data.menu_list,
      productsList: that.data.productsList,
      shopNumberr: shopNumberr,
      products: that.data.products,
      total_fee: app.globalData.shopCart.total_fee,
    })
    console.log(that.data.products)
    app.globalData.shopCart.total_fee = app.globalData.shopCart.total_fee;
  },
  // 如果商品有规格则点击商品加号 显示规格页面 然后 点击确定加入购物车
  /*
   1. 获取此规格的商品id，添加数组 shop 
  */
  specification: function () {
    let that = this;
    let shop = that.data.shop; // 商品；
    console.log(shop);
  },
  // 删减商品 将购物车数量减少
  // 选择规格
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
  popupShow: function () {
    let that = this;
    that.setData({
      cart: false,
      select_specification: false
    })
  },
  // 商品详情
  details: function (e) {
    let ids = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/productDetails/productDetails?id=' + ids
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
    if (that.data.cart) {
      that.setData({
        cart: false,
        menu_list: cart,
      })
    } else {
      that.setData({
        cart: true,
        menu_list: cart,
      })
    }
  },
  // 跳转
  // 去结算
  accounts: function () {
    wx.navigateTo({
      url: '/pages/settle/settle'
    })
  },
  Gouser: function () {
    wx.switchTab({
      url: '/pages/logs/logs'
    })
  },
  Gorelease: function () {
    let shopId = this.data.shopId;
    wx.navigateTo({
      url: '/pages/release/release?id=' + shopId
    })
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
    console.log(allselect)
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
  },
  allselect: function () {
    let that = this;
    let selectTo = 0;
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      app.globalData.shopCart.menu_list[i].select = true;
    }
    // 循环app.globalData.shopCart.menu_list里的select
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
  // 点击图片放大保存图片
  saveImages: function () {
    let that = this;
    let images = that.data.shop_qrcode;
    wx.previewImage({
      current: images, // 当前显示图片的http链接
      urls: [images] // 需要预览的图片http链接列表
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
  onShow: function (options) {
    if (options && options.identifying == 'yes') {
      app.globalData.ShareAppMessage = false;
    } else if (options && options.identifying == 'no') {
      app.clearCart()
    }
    console.log(app.globalData.shopCart.menu_list);
    let that = this;
    let selectTo = 0
    let shopId = that.data.shopId;
    let selectTos = false;
    let allselect = false;
    let calculate = 0
    //let token = app.globalData.userInfo.token;
    //that.shopIndex(shopId) // 调取接口方法
    for (let i = 0; i < app.globalData.shopCart.menu_list.length; i++) {
      if (app.globalData.shopCart.menu_list[i].select == true) {
        selectTo += 1;
        calculate += 1;
        selectTos = true;
      }
    }
    if (calculate === app.globalData.shopCart.menu_list.length) {
      allselect = true;
    }
    that.setData({
      menu_list: app.globalData.shopCart.menu_list,
      shopNumberr: app.globalData.shopCart.shopNumber,
      total_fee: app.globalData.shopCart.total_fee,
      allselect: allselect,
      selectTo: selectTo,
      selectTos: selectTos,
    })
    that.shopContents(shopId, 0);
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
    let shopId = that.data.shopId;
    return {
      title: that.data.shop_title + '店铺期待你的光临',
      path: '/pages/Individual/Individual?identifying=no&id=' + shopId
    }
  }
})