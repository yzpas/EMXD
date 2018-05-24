const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 按钮锁 */
function buttonLocked(app, buttonName, millisecond = 3000) {
  if (app.globalData.buttonLockStatus.buttonName === 'locked') {
    console.log('stop');
    return true;
  }
  console.log('locked');
  app.globalData.buttonLockStatus.buttonName = 'locked';
  setTimeout(function () {
    if (app.globalData.buttonLockStatus.buttonName === 'locked') {
      app.globalData.buttonLockStatus.buttonName = '';
      console.log('unlocked');
    }
  }, millisecond);
  return false;
}


/** url参数解析 */
function parseQueryString(argu) {
  //var str = argu.split('?')[1];
  var result = {};
  var temp = argu.split('&');
  for (var i = 0; i < temp.length; i++) {
    var temp2 = temp[i].split('=');
    result[temp2[0]] = temp2[1];
  }
  return result;
}

module.exports = {
  formatTime: formatTime,
  buttonLocked: buttonLocked,
  parseQueryString: parseQueryString
}
