// pages/commodity/commodity.js 添加商品
//获取应用实例
const app = getApp()
const imagesUpload = app.globalData.host + "/images/upload" // 图片上传地址
const imagesDelete = app.globalData.host + "/products/delete-image" // 删除单张产品轮播图
const contentsCreate = app.globalData.host + "/shop/shop-contents-create" // 动态发布

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addImageList:[],
    addImage:false,
    addShop:false,
    token:'',
    imagesIdList:[],
    specificationLists:[  // 规格
      {
        price:'',
        stock:'',
        title:'',
        judge_fields: 0 
      }
    ],
    shopCategory:[],// 类别
    InputText: '' ,// 商品名称
    InputTextTo: '', // 商品名称
    textareaText:'' , // 商品介绍
    product_id:'',
    Update:0,
    disabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      shopId:options.id
    })
  },
  // addList:function(e){
  //   let that = this;
  //   let lists = that.data.specificationLists;
  //   let length = lists.length
  //   let newData = {
  //     price: '',
  //     stock: '',
  //     title: '',
  //     judge_fields: length,
  //   };
  //   if (lists.length == 15) {
  //     that.setData({
  //       addShop:true,
  //     })
  //     return;
  //   }
  //   lists.push(newData);
  //   that.setData({
  //     specificationLists: lists
  //   })
    
  // },
  // delList: function (e) {
  //   let that = this;
  //   let lists = that.data.specificationLists;
  //   let id = parseInt(e.currentTarget.dataset.id);
  //   let attrid = e.currentTarget.dataset.attrid;
    
  //   if (lists.length == 1 ){
  //     wx.showToast({
  //       title: '最少留一个规格',
  //       icon: 'none',
  //       mask: true
  //     })
  //     return;
  //   }
  //   for( let i = 0; i < lists.length ; i++ ){
  //     if (lists[i].judge_fields == id ){
  //       lists.splice(i, 1);
  //     }
  //   }
  //   console.log(lists)
  //   if (attrid){
  //     app.getRequest(deleteUpdate, { "attr_id": attrid }, function (res) {
  //       if (res.data.code == 0) {
  //         wx.showToast({
  //           title: res.data.msg,
  //           icon:'none',
  //           mask: true
  //         })
  //       }
  //     }, 'hint')
  //   }
  //   that.setData({
  //     specificationLists: lists,
  //     addShop: false,
  //   })
  // },   
  // // 填写规格
  // InputPrice:function(e){
  //   let that = this;
  //   let price = e.detail.value;
  //   let id = e.currentTarget.dataset.id;
  //   let list = that.data.specificationLists;
  //   // let reg = /^\d{1,10}(\.\d{1,2})?$/;
  //   // if (!reg.test(price)){
  //   //   wx.showToast({
  //   //     title: '请输入正确的金额',
  //   //     icon: 'none',
  //   //     duration: 2000
  //   //   })
  //   //   return;
  //   // }
  //   for (let i = 0; i < list.length ; i++ ){
  //     if (list[i].judge_fields == id ){
  //       list[i].price = price;
  //     }
  //   }
  // },
  // InputStock: function (e) {
  //   let that = this;
  //   let stock = e.detail.value;
  //   let id = e.currentTarget.dataset.id;
  //   let list = that.data.specificationLists;
  //   for (let i = 0; i < list.length; i++) {
  //     if (list[i].judge_fields == id) {
  //       list[i].stock = stock;
  //     }
  //   }
  // },
  // InputTitle: function (e) {
  //   let that = this;
  //   let title = e.detail.value;
  //   let id = e.currentTarget.dataset.id;
  //   let list = that.data.specificationLists;
  //   for (let i = 0; i < list.length; i++) {
  //     if (list[i].judge_fields == id) {
  //       list[i].title = title;
  //     }
  //   }
  // },
  // InputTexts:function(e){
  //   let that = this;
  //   that.setData({
  //     InputText: e.detail.value
  //   })
  // },
  textareaText:function(e){
    let that = this;
    let textareaText = e.detail.value;
    that.setData({
      textareaText: textareaText
    })
  },
  // 方法
  addImage:function(){
    let that = this;
    wx.chooseImage({
      count: 1, // 一次最多可以选择2张图片一起上传
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let imgeList = that.data.addImageList.concat({ 
          url: res.tempFilePaths
        });
        if (that.data.addImageList.length >= 5 ){
          that.setData({
            addImage: true
          });
        }
        that.setData({
          addImageList: imgeList
        });
        that.ImageUpload(that, res.tempFilePaths[0], wx.getStorageSync('token'));
      }
    })
  },
  ImageUpload: function (page, path, token) {
    let that = this;
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: imagesUpload,
      filePath: path,
      name: 'file',
      header: { 
        "Content-Type": "multipart/form-data",
        'ky-token': token
       },
      formData: {

      },
      success: function (res) {
        let data = JSON.parse(res.data)     
        if (data.code == 0) {
          wx.hideToast();
          that.data.imagesIdList.push(data.res.image_id)
          wx.showToast({
            icon: "loading",
            title: "上传成功",
          });
          that.setData({
            imagesIdList: that.data.imagesIdList
          })
          console.log(that.data.imagesIdList);
        } else if (data.code == -100) {
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
        } else {
          wx.showToast({
            title: '网络错误请稍后再试...',
            icon: 'none',
            mask: true
          })
        }
      },
      fail: function (e) {
        console.log(e);
        wx.showToast({
          icon: "loading",
          title: "上传失败",
        });
      },
    })
  },
  // 删除
  delImages:function(e){
    let that = this;
    let index = e.target.dataset.index;
    let image_id = that.data.imagesIdList[index];
    let token = that.data.token;
    that.imagesDelete(token, image_id,index)
  },
  imagesDelete: function (token,image_id,index){
    let that = this;
    // 调取接口
    app.getRequest(imagesDelete, {"ky-token":token,"image_id": image_id}, function (res) {
      if (res.data.code == 0) {
        that.data.addImageList.splice(index,1);
        that.setData({
          addImageList: that.data.addImageList
        })
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        })
      }
    },'hint')
  },
  // 提交
  address:function(){
    let that = this;
    
    // console.log(that.data.shopCategory)
    // let InputText = that.data.InputText;
    // let specificationLists = that.data.specificationLists;
    let textareaText = that.data.textareaText;
    // let shopCategorys = that.data.shopCategory.id;
    let imagesIdList;
    if (that.data.imagesIdList.length > 0){
      imagesIdList = JSON.stringify(that.data.imagesIdList)
    }else{
      imagesIdList='';
    }
    console.log(textareaText);
    // 判断
    if (textareaText === ''){
      wx.showToast({
        title: '请说点什么吧...',
        icon: 'none',
        duration: 2000,
        mask:true
      })
      return;
    }
    that.setData({
      disabled: true
    })
      let data = {
        image_ids: imagesIdList,
        contents: textareaText,
      }
      // 调取接口
      app.postRequest(contentsCreate, data, function (res) {
        if (res.data.code == 0) {
          
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
            success:function(res) {
              // wx.redirectTo({
              //   url: '/pages/Individual/Individual?id=' + that.data.shopId
              // })
              wx.navigateBack({
                delta: 1
              })
            }
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
              url: '/pages/index/index?parameter=yes'
            })
          }, 2000)
        } else {
          wx.showToast({
            title: '网络错误请稍后再试...',
            icon: 'none',
            mask: true
          })
        }
      }, 'hint')
   
  },
  // 添加分类
  goClassify:function(){
    wx.navigateTo({
      url: '/pages/shopaddClassify/shopaddClassify'
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
    let categoryId = null;
    let shopInfo = null
      // wx.getStorage({
      //   key: 'shopInfo',
      //   success: function (res) {
      //     shopInfo = res.data;
      //   }
      // })
      wx.getStorage({
        key: 'categoryId',
        success: function (res) {
          categoryId = res.data;
          that.setData({
            shopCategory: res.data
          })
        }
      })
      // console.log(categoryId);
    // console.log(that.data.shopCategory.id)
  },
  load:function(e){
    console.log(e);
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