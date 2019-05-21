/**
 * @polymerBehavior
 */
export const TipBehavior = {
  /**
   * h2Tip提供了以下便捷方法来使用 `h2-tip`.
   * - `h2Tip.success(message, duration = 1500)`
   * - `h2Tip.success({message, title}, duration = 1500)`
   * - `h2Tip.warn(message, duration = 5000)`
   * - `h2Tip.warn({message, title}, duration = 5000)`
   * - `h2Tip.error(message, duration = 600000)`
   * - `h2Tip.error({message, title}, duration = 600000)`
   * - `h2Tip.confirm(message, confirmCallback, cancelCallback)`
   * - `h2Tip.confirm({message, title}, confirmCallback, cancelCallback)`
   * - `h2Tip.prompt(message, confirmCallback, cancelCallback)`
   * - `h2Tip.prompt({message, title}, confirmCallback, cancelCallback)`
   * - `h2Tip.tip({message, type, duration = 0, confirmCallback, cancelCallback})`
   * - `h2Tip.tip({{message, title}, type, duration = 0, confirmCallback, cancelCallback})`
   * @type {object}
   */
  h2Tip: {
    /**
     * 成功提示框
     * @param {string|object} msgObj
     * @param {number=1500} duration
     */
    success(msgObj, duration = 1500) {
      this.tip({msgObj, duration, type: 'success'});
    },
    
    /**
     * 警告提示框
     * @param {string|object} msgObj
     * @param {number=5000} duration
     */
    warn(msgObj, duration = 5000) {
      this.tip({msgObj, duration, type: 'warn'});
    },
    
    /**
     * 错误提示框
     * @param {string|object} msgObj
     * @param {number=600000} duration
     */
    error(msgObj, duration = 600000) {
      this.tip({msgObj, duration, type: 'error'});
    },
    
    /**
     * 确认提示框
     * @param {string|object} msgObj
     * @param {function} confirmCallback
     * @param {function} cancelCallback
     */
    confirm(msgObj, confirmCallback, cancelCallback) {
      this.tip({msgObj, type: 'confirm', confirmCallback, cancelCallback});
    },
    
    
    /**
     * 确认提示框（带备注）
     * @param {string|object} msgObj
     * @param {function} confirmCallback
     * @param {function} cancelCallback
     */
    prompt(msgObj, confirmCallback, cancelCallback) {
      this.tip({msgObj, type: 'prompt', confirmCallback, cancelCallback});
    },
    
    /**
     * @param {{msgObj:string|object, type:string, duration:number = 0, confirmCallback:function, cancelCallback:function}}
     */
    tip({msgObj, type, duration = 0, confirmCallback, cancelCallback}) {
      
      let {message, title, width, height, cancelBtnLabel, confirmBtnLabel} = (typeof msgObj === 'object') ? msgObj : {message: msgObj};
      
      const tip = document.createElement('h2-tip');
      tip.setAttribute('type', type);
      tip.message = message;
      tip.title = title;
      tip.width = width;
      tip.height = height;
      tip.duration = duration;
      tip.autoDetach = true;
      tip.config = {cancelBtnLabel, confirmBtnLabel, title};
      document.body.appendChild(tip);
      tip.open(confirmCallback, cancelCallback);
    }
  }
};