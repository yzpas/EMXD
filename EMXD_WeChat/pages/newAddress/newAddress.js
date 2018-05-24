//logs.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
const city = app.globalData.host + "/city/area-info" // 省市县数据获取
const useAaddress = app.globalData.host + "/user-address/create" // 新增/修改用户地址
Page({
  data: {
    province_arr: [],
    provinceArr:true,
    city_arr: [],
    cityArr: true,
    district_arr: [],
    districtArr: true,
    province:'请选择省 ', //省 
    city: '请选择市', // 市
    district: '请选择区', // 区
    province_id:'',
    city_id: '',
    district_id: '',
    user_name:'',
    telephone:'',
    detail_address:'',
    isAddress: false,
    token:'',
    addressId:'',
    
  },
  
  onLoad: function (options) {
    let that = this;
    let address;
    if (options.address != 'undefined' && options.address != []){
      wx.setNavigationBarTitle({
        title: "修改地址"
      })
      address = JSON.parse(options.address);
      that.setData({
        address: address,
        province: address.province_name,
        city: address.city_name,
        district: address.area_name,
        province_id: address.province_id,
        city_id: address.city_id,
        district_id: address.area_id,
        addressId: address.id,
        user_name: address.user_name,
        detail_address: address.detail_address,
        telephone: address.telephone,
        isAddress:true,
      })
    }else{
      that.setData({
        isAddress: false,
      })
    }
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.province(res.data, '0');
        if (that.data.city_id) {
          that.city(res.data, that.data.province_id);
        }
        if (that.data.district_id) {
          that.district(res.data, that.data.city_id);
        }
        that.setData({
          token: res.data
        })
      }
    });
    // 
   
  },
  // 省
  province: function (token, id) {
    let that = this;
    // 调取接口
    app.postRequest(city, { "upid": id }, function (res) {
      if (res.data.code == 0) {
        that.setData({
          province_arr: res.data.res
        })
      }
    })
  },
  provincechange: function (e) {
    let that = this;
    let id = e.detail.value
    let province = that.data.province_arr[id].name; // 省名字
    let province_id = that.data.province_arr[id].id; // 省名字
    console.log(province);
    console.log(province_id);
    that.setData({
      id: e.detail.value,
      province: province,
      province_id: province_id,
      provinceArr: false,
      city_arr: []
    });

    that.city(that.data.token, province_id);
  },
 
  // 市
  city: function (token, id) {
    let that = this;
    // 调取接口
    app.postRequest(city, { "ky-token": token, "upid": id }, function (res) {
      if (res.data.code == 0) {
        that.setData({
          city_arr: res.data.res
        })
      }
    })
  },
  citychange: function (e) {
    let that = this;
    let cityid = e.detail.value
    let city = that.data.city_arr[cityid].name; // 省名字
    let city_id = that.data.city_arr[cityid].id; // 省名字
    that.setData({
      cityid: e.detail.value,
      city: city,
      city_id: city_id,
      cityArr:false,
      district_arr:[],
    });
    that.district(that.data.token, city_id);
  },
  // 区
  district: function (token, id) {
    let that = this;
    // 调取接口
    app.postRequest(city, { "ky-token": token, "upid": id }, function (res) {
      if (res.data.code == 0) {
        that.setData({
          district_arr: res.data.res,
        })
      }
    })
    console.log(that.data.districtArr);
  },
  districtchange: function (e) {
    let that = this;
    let districtid = e.detail.value
    let district = that.data.district_arr[districtid].name; // 省名字
    let district_id = that.data.district_arr[districtid].id; // 省名字
    that.setData({
      districtid: e.detail.value,
      district: district,
      district_id: district_id,
      districtArr: false
    });
  },
  // 保存提交
  formSubmit: function (e) {
    let that = this;
    let default_address = '0';
    let data = {
      "user_name": e.detail.value.user_name,
      "telephone": e.detail.value.telephone,
      "detail_address": e.detail.value.detail_address,
      "id": that.data.addressId,
      "province_id": that.data.province_id,
      "city_id": that.data.city_id,
      "area_id": that.data.district_id,
      "street_id": '',
      "default_address": default_address,
      "ky-token": that.data.token
    }
    if (e.detail.value.user_name == ''){
      data.user_name = that.data.user_name;
    }else{
      data.user_name = e.detail.value.user_name;
    }
    if (e.detail.value.telephone == ''){
      data.telephone = that.data.telephone;
    }else{
      data.telephone = e.detail.value.telephone;
    }
    if (e.detail.value.detail_address == '') {
      data.detail_address = that.data.detail_address;
    } else {
      data.detail_address = e.detail.value.detail_address;
    }
    if (!data.user_name || !data.telephone || !data.detail_address || !data.province_id || !data.city_id || !data.area_id){
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 2000
      })
    }else{
      that.userAdd(data);
    }
  },
  userAdd:function(data){
    let that = this;
    // 调取接口
    app.postRequest(useAaddress, data, function (res) {
      if (res.data.code == 1) {
        wx.showToast({
          title: '地址保存成功',
          icon: 'success',
          duration: 2000,
          mask:true,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000,
        })
      }
    },'showToast')
  },
  // 选择地址
  address: function () {
    wx.navigateTo({
      url: '../address/address'
    })
  },
})
