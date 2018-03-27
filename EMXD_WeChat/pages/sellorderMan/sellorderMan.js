Page({
  data: {
    currentTab: 0,
  },
  tab: function (e) {
    let that = this;
    that.setData({ currentTab: e.target.dataset.id });
  }
})
