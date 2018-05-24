// pages/commodity/commodity.js 添加商品
//获取应用实例
const app = getApp()
const imagesUpload = app.globalData.host + "/images/upload" // 图片上传地址
const imagesDelete = app.globalData.host + "/products/delete-image" // 删除单张产品轮播图
const productsCreate = app.globalData.host + "/products/create" // 发布产品
const productsUpdate = app.globalData.host + "/products/update" // 修改发布产品
const deleteUpdate = app.globalData.host + "/products/delete-attr" // 删除单个规格接口

const shopCategories = app.globalData.host + "/shop/categories" // 获取本店的商品分类

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
    my:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    let that = this;
    console.log(options)
    that.setData({
      my: options.my
    })
    if (options.my === 'yes'){
      wx.removeStorage({
        key: 'categoryId',
        success: function (res) {
          console.log('缓存清除成功')
        }
      })
    }
    let lists = that.data.specificationLists;  
    if(options.id){
      wx.setNavigationBarTitle({
        title: '修改商品'
      })
      wx.getStorage({
        key: 'shopInfo',
        success: function (res) {
          let shopCategory = {};
          let isShopCategory = false;
          // 调取接口 // 分类接口
          app.getRequest(shopCategories, {}, function (data) {
            if (data.data.code == 0) {
              console.log(data.data.res.length);
              if (data.data.res.length > 0){
                console.log(res.data.category_title)
                console.log(data.data.res[0].title)
                
                for (let i = 0; i < data.data.res.length; i++){
                  if (data.data.res[i].title == res.data.category_title){
                    isShopCategory = true;
                  }else{
                      shopCategory = {
                        title: '',
                        id: ''
                      }
                  }
                }
                if (isShopCategory){
                  shopCategory = {
                    title: res.data.category_title,
                    id: res.data.category_id
                  };
                }
              }else{
                shopCategory = {
                  title: '',
                  id: ''
                }
              }
              console.log(shopCategory);
              that.setData({
                shopCategory: shopCategory
              })
            }
          }, 'hint')
          
          
          let specificationLists= [];
          for( let i=0;i<res.data.attr.length;i++ ){
            res.data.attr[i].judge_fields = i
            specificationLists.push(res.data.attr[i])
          }
          let imagesIdList = []
          for (let i = 0; i < res.data.images.length; i++) {
            imagesIdList.push(res.data.images[i].id)
          }
          that.setData({
            addImageList: res.data.images,
            InputTextTo: res.data.title,
            InputText: res.data.title,
            textareaText: res.data.contents,
            specificationLists: specificationLists,
            imagesIdList: imagesIdList,
            product_id: res.data.product_id,
            Update:1
          })
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加商品'
      })
    }
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data
        })
      }
    });
    // wx.getStorage({
    //   key: 'categoryId',
    //   success: function (res) {
    //     that.setData({
    //       shopCategory: res.data
    //     })
    //   }
    // })    
    // console.log(that.data.shopCategory)
  },
  addList:function(e){
    let that = this;
    let lists = that.data.specificationLists;
    let length = lists.length
    let newData = {
      price: '',
      stock: '',
      title: '',
      judge_fields: length,
    };
    if (lists.length == 15) {
      that.setData({
        addShop:true,
      })
      return;
    }
    lists.push(newData);
    that.setData({
      specificationLists: lists
    })
    
  },
  delList: function (e) {
    let that = this;
    let lists = that.data.specificationLists;
    let id = parseInt(e.currentTarget.dataset.id);
    let attrid = e.currentTarget.dataset.attrid;
    
    if (lists.length == 1 ){
      wx.showToast({
        title: '最少留一个规格',
        icon: 'none',
        mask: true
      })
      return;
    }
    for( let i = 0; i < lists.length ; i++ ){
      if (lists[i].judge_fields == id ){
        lists.splice(i, 1);
      }
    }
    console.log(lists)
    if (attrid){
      app.getRequest(deleteUpdate, { "attr_id": attrid }, function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            mask: true
          })
        }
      }, 'hint')
    }
    that.setData({
      specificationLists: lists,
      addShop: false,
    })
  },   
  // 填写规格
  InputPrice:function(e){
    let that = this;
    let price = e.detail.value;
    let id = e.currentTarget.dataset.id;
    let list = that.data.specificationLists;
    // let reg = /^\d{1,10}(\.\d{1,2})?$/;
    // if (!reg.test(price)){
    //   wx.showToast({
    //     title: '请输入正确的金额',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return;
    // }
    for (let i = 0; i < list.length ; i++ ){
      if (list[i].judge_fields == id ){
        list[i].price = price;
      }
    }
  },
  InputStock: function (e) {
    let that = this;
    let stock = e.detail.value;
    let id = e.currentTarget.dataset.id;
    let list = that.data.specificationLists;
    for (let i = 0; i < list.length; i++) {
      if (list[i].judge_fields == id) {
        list[i].stock = stock;
      }
    }
  },
  InputTitle: function (e) {
    let that = this;
    let title = e.detail.value;
    let id = e.currentTarget.dataset.id;
    let list = that.data.specificationLists;
    for (let i = 0; i < list.length; i++) {
      if (list[i].judge_fields == id) {
        list[i].title = title;
      }
    }
  },
  InputTexts:function(e){
    let that = this;
    that.setData({
      InputText: e.detail.value
    })
  },
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
        that.ImageUpload(that, res.tempFilePaths[0], that.data.token);
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
    console.log(that.data.shopCategory)
    let InputText = that.data.InputText;
    let specificationLists = that.data.specificationLists;
    let textareaText = that.data.textareaText;
    let shopCategorys = that.data.shopCategory.id;
    let imagesIdList;
    if (that.data.imagesIdList.length > 0){
      imagesIdList = JSON.stringify(that.data.imagesIdList)
    }else{
      imagesIdList='';
    }
    console.log(InputText);
    // 判断
    if (imagesIdList === '') {
      wx.showToast({
        title: '最少有一张商品图片',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    if (InputText== ''){
      wx.showToast({
        title: '输入商品标题',
        icon: 'none',
        duration: 2000,
        mask:true
      })
      return;
    }
    if (specificationLists[0].title === '' && specificationLists[0].stock === '' && specificationLists[0].price === '') {
      wx.showToast({ 
        title: '最少填写一条规格',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }
    for (let i = 0; i < specificationLists.length; i++){
      if (specificationLists[i].stock === '' ){
        wx.showToast({
          title: '请填写正确的库存',
          icon: 'none',
          duration: 1500,
          mask: true
        })
        return;
      }
      // console.log(specificationLists[i].price.split("."))
      // let re = /.*\..*?\..*/;
      // console.log(re.test(specificationLists[i].price));
      //  && specificationLists[i].price.indexOf(".") > 1
      // && re.test(specificationLists[i].price)
      // if (specificationLists[i].price.toString().split(".")[1].length > 2 ){
      //   wx.showToast({
      //     title: '请填写正确的规格价格',
      //     icon: 'none',
      //     duration: 2000,
      //     mask: true
      //   })
      //   return;
      // }
      if (specificationLists[i].price === '') {
        wx.showToast({
          title: '价格不能为空',
          icon: 'none',
          duration: 1500,
          mask: true
        })
        return;
      }
      var a = /^[0-9]*(\.[0-9]{1,2})?$/;
      if (!a.test(specificationLists[i].price)) {
        wx.showToast({
          title: '请填写正确的价格',
          icon: 'none',
          duration: 1500,
          mask: true
        })
        return;
      }
      if (specificationLists[i].title === '') {
        wx.showToast({
          title: '请填写正确的规格',
          icon: 'none',
          duration: 1500,
          mask: true
        })
        return;
      }
    }

    if (shopCategorys==undefined) {
      wx.showToast({
        title: '请选择规格的分类',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return;
    }
    // console.log('shopCategorys' + shopCategorys);
    // return;
    if (that.data.Update == 0 ){
      console.log(1);
      let data = {
        title: InputText,
        image_ids: imagesIdList,
        attr: JSON.stringify(specificationLists),
        contents: textareaText,
        category_id: shopCategorys,
      }
      // 调取接口
      app.postRequest(productsCreate, data, function (res) {
        if (res.data.code == 1) {
          wx.removeStorage({
            key: 'categoryId',
            success: function (res) {
              console.log('缓存清除成功')
            }
          })
          wx.removeStorage({
            key: 'shopInfo',
            success: function (res) {
              console.log('缓存清除成功')
            }
          })
          wx.showToast({
            title: '商品添加成功',
            duration: 2000,
            success:function(res) {
              if( that.data.my == 'yes'){
                wx.redirectTo({
                  url: '/pages/user/store/commodityManage/commodityManage'
                })
              }else{
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })

        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration: 2000
          })
        }
      }, 'hint')
    }
    if (that.data.Update == 1 ){
      console.log(12312)
      let data = {
        title: InputText,
        image_ids: imagesIdList,
        attr: JSON.stringify(specificationLists),
        contents: textareaText,
        category_id: shopCategorys,
        product_id: that.data.product_id
      }
      // 调取接口
      app.postRequest(productsUpdate, data, function (res) {
        if (res.data.code == 1) {
          wx.removeStorage({
            key: 'categoryId',
            success: function (res) {
              console.log('缓存清除成功')
            }
          })
          wx.removeStorage({
            key: 'shopInfo',
            success: function (res) {
              console.log('缓存清除成功')
            }
          })
          wx.showToast({
            title: '商品修改成功',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2500)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }, 'hint')
    }
  },
  // 添加分类
  goClassify:function(){
    wx.navigateTo({
      url: '/pages/shopaddClassify/shopaddClassify?tag=addshop'
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