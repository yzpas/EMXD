//获取应用实例
const app = getApp()
const city = app.globalData.host + "/city/area-info" // 省市县数据获取
const smsSend = app.globalData.host + "/sms/send" // 获取短信
const shopApply = app.globalData.host + "/shop/apply" // 获取短信

var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })
    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
}
Page({
  data: {
    logs: [],
    province_arr: [],
    provinceArr: true,
    city_arr: [],
    cityArr: true,
    district_arr: [],
    districtArr: true,
    province: '请选择省', //省 
    city: '请选择市', // 市
    district: '请选择区', // 区
    province_id: '',
    city_id: '',
    district_id: '',
    mobile:'',
    is_show: true,
    id:'',
    cityid:'',
    districtid:'',

  },
  onLoad: function (options) {
    let that = this;
    that.province(0);
  },
  // 省
  province: function (id) {
    let that = this;
    // 调取接口
    app.postRequest(city, {"upid": id }, function (res) {
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
    that.city(province_id);
    that.setData({
      id: e.detail.value,
      province: province,
      province_id: province_id,
      provinceArr: false,
      city_arr: []
    });
    
  },
  // 市
  city: function (id) {
    let that = this;
    // 调取接口
    app.postRequest(city, { "upid": id }, function (res) {
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
    that.district(city_id);
    that.setData({
      cityid: e.detail.value,
      city: city,
      city_id: city_id,
      cityArr: false,
      district_arr: []
    });
   
  },
  // 区
  district: function (id) {
    let that = this;
    // 调取接口
    app.postRequest(city, { "upid": id }, function (res) {
      if (res.data.code == 0) {
        that.setData({
          district_arr: res.data.res,
        })
      }
    })
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
      districtArr: false,
    });
  },
  bindKeyInput:function(e){
    this.setData({
      mobile: e.detail.value
    })
  },
  gitcode:function(){
    let that = this;
    let mobile = that.data.mobile;
    console.log(mobile)
    if (mobile != undefined && mobile != '' && mobile.length == 11){
      let param = { 
        mobile: mobile
      }
      app.postRequest(smsSend, param, function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '短信已发送，请查收',
            icon: 'none',
            duration: 2000
          })
          // 将获取验证码按钮隐藏60s，60s后再次显示
          that.setData({
            is_show: (!that.data.is_show)  //false
          })
          settime(that);
        } else if (res.data.code == -1){
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
      },'info')
    }else{
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 保存提交
  formSubmit: function (e) {
    let that = this;
    console.log(e)
    if (that.data.province_id == '' ){
      wx.showToast({
        title: '请输入所在省',
        icon: 'none',
        duration: 2000
      })
      return ; 
    }
    if (that.data.city_id == '') {
      wx.showToast({
        title: '请输入所在市',
        icon: 'none',
        duration: 2000
      })
      return; 
    }
    if (that.data.district_id == '') {
      wx.showToast({
        title: '请输入所在区',
        icon: 'none',
        duration: 2000
      })
      return; 
    }
    if (e.detail.value.shopkeeper == '') {
      wx.showToast({
        title: '请输入联系人',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (e.detail.value.mobile == '') {
      wx.showToast({
        title: '请输入联系人手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (e.detail.value.sms_code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (e.detail.value.shop_title == '') {
      wx.showToast({
        title: '请输入店铺名称',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (e.detail.value.address == '') {
      wx.showToast({
        title: '请输入店铺详细地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (e.detail.value.shop_intro == '') {
      wx.showToast({
        title: '请输入店铺简介',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let data = {
      "province_id": that.data.province_id,
      "city_id": that.data.city_id,
      "area_id": that.data.district_id,
      "address": e.detail.value.address,
      "shopkeeper": e.detail.value.shopkeeper,
      "mobile": e.detail.value.mobile,
      "sms_code": e.detail.value.sms_code,
      "shop_title": e.detail.value.shop_title,
      "shop_intro": e.detail.value.shop_intro,
    }
    app.postRequest(shopApply, data, function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        wx.redirectTo({
          url: '/pages/user/store/store'
        })
      } else if (res.data.code == -1){
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
    }, 'info')
  },
})
