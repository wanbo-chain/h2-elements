
/**
 * 提供公共的格式化方法
 * @polymerBehavior
 */
export const FormatBehavior = {
  properties: {},
  /**
   * 格式化日期
   * @param date 时间戳（毫秒）
   * @param fmt 显示格式，默认为'yyyy-MM-dd HH:mm:ss'
   * @param emptyReturn 默认空值返回数据
   */
  formatDate: function (date, fmt, emptyReturn) {
    if (!date && emptyReturn) {
      return emptyReturn;
    }
    date = date || new Date().getTime();
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
    date = new Date(Number(date));
    let o = {
      "M+": date.getMonth() + 1, // 月份   
      "d+": date.getDate(), // 日  
      "H+": date.getHours(), // 小时   
      "m+": date.getMinutes(), // 分   
      "s+": date.getSeconds(), // 秒    
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度   
      "S": date.getMilliseconds()   // 毫秒   
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k  in  o)
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    return fmt;
  }
};
