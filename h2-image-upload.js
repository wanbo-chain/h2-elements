/*
`h2-image-upload`

Example:
```html
<h2-image-upload label="上河图" value="{{file}}"></h2-image-upload>
<h2-image-upload size-limit="1.4M" value="{{file}}"></h2-image-upload>

```
## Styling

The following custom properties and mixins are available for styling:

|Custom property | Description | Default|
|----------------|-------------|----------|
|`--h2-image-upload-label` | Mixin applied to the label of image uploader | {}
|`--h2-image-upload-width` | Mixin applied to width of image uploader | 140px
|`--h2-image-upload-height` | Mixin applied to height of image uploader | 180px
|`--h2-image-upload-buttons` | Mixin applied to tool buttons of the uploader | {}

*/

import './behaviors/base-behavior.js';

import {html, PolymerElement} from "@polymer/polymer";
import {BaseBehavior} from "./behaviors/base-behavior";
import {TipBehavior} from "./behaviors/tip-behavior";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/paper-dialog';
import './behaviors/h2-elements-shared-styles.js';
import './h2-button.js';
import './h2-dialog';
import './h2-tip';

/**
 * @customElement
 * @polymer
 * @demo demo/h2-image-upload/index.html
 */
class H2ImageUpload extends mixinBehaviors([BaseBehavior, TipBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: inline-block;
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
      }

      #main-container {
        display: flex;
        height: inherit;
      }

      #inner-container {
        display: flex;
        flex-flow: column nowrap;
        border: 1px dashed #ccc;
        font-size: inherit;
        width: var(--h2-image-upload-width, 140px);
        height: var(--h2-image-upload-height, 180px);
        background: #fafafa;
        position: relative;
        border-radius: 5px;
      }

      #img__container {
        flex: 1;
        cursor: zoom-in;
        display: flex;
      }

      .toolbar {
        display: flex;
        background: #f0f0f0;
        height: 36px;
        justify-content: space-evenly;
        align-items: center;
        padding: 0 2px;
      }

      .toolbar h2-button {
        height: 26px;
        width: 42px;
        --h2-button: {
          background-color: #5cb85c;
          @apply --h2-image-upload-buttons;
        };
      }

      #viewer-dialog {
        display: flex;
        overflow: auto;
        width: 100%;
        height: 100%;
        padding: 0;
        cursor: zoom-out;
      }
      
      #viewer-img {
        cursor: move;
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        margin: 0 auto;
        padding: 0;
      }

      #file-chooser {
        display: none;
      }

      #paste-panel {
        flex: 1;
        outline: 1px dashed #aeaeae;
        outline-offset: -10px;
        text-align: center;
        padding: 20px;

        display: flex;
        justify-content: center;
        align-items: center;
      }

      #paste-panel[hidden] {
        display: none;
      }

      :host([data-has-src]) #paste-panel,
      :host(:not([data-has-src])) #cancel-btn {
        display: none;
      }

      :host(:not([data-has-src])) #img__container {
        cursor: default;
      }
      
      .rotate-button,.up-scale-button,.down-scale-button,.close-button {
        position: fixed;
        right: 5%;
        top: 50%;
        background: linear-gradient(315deg, #8FCDFF 0%, #2196F3 100%);;
        border-radius: 10px;
        padding: 15px;
        transform: translateY(-47px);
        color: #fff;
        cursor: pointer;
        box-shadow: 0 0 5px 2px #ccc;
      }
      
      .close-button {
        top: 10%;
      }
      
      .up-scale-button {
        top: 40%;
      }
      
      .down-scale-button {
        top: 60%;
      }
      
      .up-scale-button:active,.rotate-button:active,.down-scale-button:active {
        background: var(--h2-ui-red);
      }
    </style>

    <div id="main-container">
      <template is="dom-if" if="[[ toBoolean(label) ]]">
        <div class="h2-label">[[label]]</div>
      </template>
      
      <div id="inner-container">
        <div id="img__container" on-click="openViewZoom">
          <div id="paste-panel">拖拽或者粘贴图片到这里</div>
        </div>

        <div class="toolbar">
          <h2-button title="点击选择文件" on-click="_triggerChooseFile">选择</h2-button>
          <h2-button id="cancel-btn" type="warning" on-click="cancelSelection">取消</h2-button>
          <input type="file" on-change="_chooseFile" id="file-chooser" accept$="[[accept]]">
        </div>
        <div class="mask"></div>
      </div>
    </div>
    <paper-dialog id="viewer-dialog" on-click="closeViewZoom">
      <img id="viewer-img" src="[[src]]" draggable="true" on-click="onImgClick"></img>
      <div class="close-button" on-click="closeViewZoom">
        <iron-icon icon="close"></iron-icon>
      </div>
      <div class="up-scale-button" on-click="imgUpScale" on-mousedown="upScaleMouseDown" on-mouseup="onMouseUp">
        <iron-icon icon="add"></iron-icon>
      </div>
      <div class="rotate-button" on-click="imgRotate">
        <iron-icon icon="cached"></iron-icon>
      </div>
      <div class="down-scale-button" on-click="imgDownScale" on-mousedown="downScaleMouseDown" on-mouseup="onMouseUp">
        <iron-icon icon="remove"></iron-icon>
      </div>
    </paper-dialog>
`;
  }

  static get properties() {
    return {
      /**
       * The remote uri of image.
       */
      src: {
        type: String
      },
      /**
       * The file object of the image. It will be `undefined` when image is from remote server.
       */
      value: {
        type: Object,
        notify: true
      },

      /**
       * The label of the uploader.
       */
      label: {
        type: String
      },

      /**
       * Set to true, if the select is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false
      },
      /**
       * Set to true, if the select is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false
      },

      /**
       * The max size/length of image allowed to upload.
       * Support pattern:  /^((?:\d*\.)?\d+)([GgMmKk][Bb]?$)/
       * i.e 1M, 1Mb, 2Kb
       * @type string
       */
      sizeLimit: {
        type: String
      },

      __byteSize: {
        type: Number,
        computed: '__parseSizeLimit(sizeLimit)'
      },

      /**
       * Bound to input's `accept` attribute.
       * @default 'image/gif, image/jpeg, image/png'
       */
      accept: {
        type: String,
        value: 'image/gif, image/jpeg, image/png'
      },
      rotateValue: {
        type: Number,
        value: 0
      },
      interval: {
        type: Object,
        value: () => ({})
      },
      /**
       * Click the picture to follow the mouse movement
       * **/
      openFollow: {
        type: Boolean,
        value: false
      },
      /**
       * Do you need to turn the picture into grayscale
       * **/
      grayscale: {
        type: Boolean,
        value: false
      },
      compress: {
        type: Boolean,
        value: false
      },
      compressMinSize: {
        type: String
      },
      __byteCompressMinSize: {
        type: Number,
        computed: '__parseSizeLimit(compressMinSize)'
      }
    };
  }

  static get is() {
    return "h2-image-upload";
  }

  static get observers() {
    return [
      '__srcChanged(src)'
    ]
  }

  connectedCallback() {
    super.connectedCallback();
    const ele = this.$['paste-panel'];

    const dragHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (this.readonly) return;
      if (e.type === "drop") {
        this.__readDataTransfer(e.dataTransfer);
      } else if (e.type === 'paste') {
        this.__readDataTransfer(e.clipboardData);
      }
    };

    ele.addEventListener("dragenter", dragHandler, false);
    ele.addEventListener("dragleave", dragHandler, false);
    ele.addEventListener('dragover', dragHandler, false);
    ele.addEventListener('drop', dragHandler, false);
    ele.addEventListener('paste', dragHandler, false);
  }


  __srcChanged(src) {
    const style = this.$["img__container"].style;
    const viewer = this.$['viewer-img'];

    if (src) {
      this.setAttribute('data-has-src', '');

      style.background = `url(${src}) no-repeat center`;
      style.backgroundSize = "contain";
      viewer.src = src;
    } else {
      this.removeAttribute('data-has-src');

      style.background = "none";
      viewer.src = "";
    }
  }

  __parseSizeLimit(sizeLimit) {
    const reg = /^((?:\d*\.)?\d+)([GgMmKk][Bb]?$)/g;

    if (!reg.test(sizeLimit)) return 0;

    const bits = sizeLimit.replace(reg, (match, size, unit) => {
      switch (unit.toUpperCase()) {
        case 'GB':
        case 'G':
          return size * Math.pow(1024, 3);
        case 'MB':
        case 'M':
          return size * Math.pow(1024, 2);
        case 'KB':
        case 'K':
          return size * 1024;
      }
    });

    return bits | 0;
  }

  _triggerChooseFile() {
    const fileChooser = this.$['file-chooser'];
    fileChooser && fileChooser.click();
  }

  _chooseFile(e) {
    const file = e.target.files[0];
    file && this.__loadFileData(file);
    this.dispatchEvent(new CustomEvent('choose', {detail: {value: file}}));
  }

  __readDataTransfer(dataTransfer) {
    const source = [].find.call(dataTransfer.items, item => item.kind === 'file' && item.type.startsWith("image"));
    source && this.__loadFileData(source.getAsFile());
    this.dispatchEvent(new CustomEvent('choose', {detail: {value: source.getAsFile()}}));
  }

  __loadFileData(blob) {
    if (this.__byteSize > 0 && blob.size > this.__byteSize) {
      this.h2Tip.error(`上传图片不能超过${this.sizeLimit}`, 3000);
      return;
    }

    if (this.compress && blob.size >= this.__byteCompressMinSize) {
      this.compression(blob).then((res) => {
        console.log('图片压缩结果:', res);
        const {afterSrc, file} = res;
        this.src = afterSrc;
        this.value = file;
      }).catch((err) => {
        console.log('图片压缩异常:', err);
      })
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (this.grayscale) {
        this.imageToGrayscale(e);
      } else {
        this.src = e.target.result;
        this.value = blob;
      }
    };
    reader.readAsDataURL(blob);
  }

  compression(file) {
    let quality;
    const size = file.size;
    const percent = (size / this.__byteSize).toFixed(1);
    quality = (1 - (+percent)).toFixed(1);
    return new Promise((resolve) => {
      const reader = new FileReader() // 创建 FileReader
      reader.onload = ({target: {result: src}}) => {
        const image = new Image() // 创建 img 元素
        image.onload = async () => {
          const canvas = document.createElement('canvas') // 创建 canvas 元素
          canvas.width = image.width
          canvas.height = image.height
          canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height) // 绘制 canvas
          const canvasURL = canvas.toDataURL('image/jpeg', +quality)
          const buffer = atob(canvasURL.split(',')[1])
          let length = buffer.length
          const bufferArray = new Uint8Array(new ArrayBuffer(length))
          while (length--) {
            bufferArray[length] = buffer.charCodeAt(length)
          }
          const miniFile = new File([bufferArray], file.name, {type: 'image/jpeg'})
          resolve({
            file: miniFile,
            origin: file,
            beforeSrc: src,
            afterSrc: canvasURL,
            beforeKB: Number((file.size / 1024).toFixed(2)),
            afterKB: Number((miniFile.size / 1024).toFixed(2)),
            quality
          })
        }
        image.src = src
      }
      reader.readAsDataURL(file)
    })
  }

  imageToGrayscale(e) {
    let imgObj = new Image();
    imgObj.src = e.target.result;
    imgObj.onload = () => {
      let canvas = document.createElement('canvas');
      let canvasContext = canvas.getContext('2d');
      let imgW = imgObj.width;
      let imgH = imgObj.height;
      canvas.width = imgW;
      canvas.height = imgH;
      canvasContext.drawImage(imgObj, 0, 0);
      let imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
      let imgPixelsData = imgPixels.data;
      for (let i = 0; i < imgPixelsData.length; i += 4) {
        let avg = (imgPixelsData[i] + imgPixelsData[i + 1] + imgPixelsData[i + 2]) / 3;
        imgPixelsData[i] = avg;
        imgPixelsData[i + 1] = avg;
        imgPixelsData[i + 2] = avg;
      }
      canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
      this.src = canvas.toDataURL();
      canvas.toBlob(blob => this.value = blob);
    }
  }

  /**
   * Cancel selection of the image.It will clear the `src` and `value`.
   * */
  cancelSelection() {
    this.src = null;
    this.value = null;
    this.$['file-chooser'].value = '';
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  /**
   * Open the view zoom
   */
  openViewZoom() {
    if (this.src) {
      this.resetRotateAndScale();
      this.$['viewer-dialog'].open();
      this.$['viewer-img'].addEventListener('dragstart', this.dragStartEvents)
      this.$['viewer-img'].addEventListener('dragend', this.dragEndEvents)
    }
  }

  /**
   * Close the view zoom.
   */
  closeViewZoom() {
    this.$['viewer-dialog'].close();
  }

  /**
   * Validate, true if the select is set to be required and this.value is a truth-value or else false.
   * @returns {boolean}
   */
  validate() {
    return this.required ? !!this.value : true;
  }

  /**
   * Scale + the image.
   */
  imgUpScale(e) {
    e.stopPropagation();
    let imgWidth = this.$['viewer-img'].width;
    let imgHeight = this.$['viewer-img'].height;
    if (imgWidth >= 10000) {
      this.h2Tip.warn(`不能再放大了哦~`, 1500);
      if (this.interval) clearInterval(this.interval);
      return;
    }
    imgWidth += 100;
    imgHeight += 100;
    this.$['viewer-img'].style.width = `${imgWidth}px`;
    this.$['viewer-img'].style.height = `${imgHeight}px`;
  }

  upScaleMouseDown(e) {
    const start = Date.now();
    this.interval = setInterval(() => {
      const end = Date.now();
      if (end - start > 300) {
        this.imgUpScale(e);
      }
    }, 100)
  }

  /**
   * Rotate the image.
   */
  imgRotate(e) {
    e.stopPropagation();
    if (this.rotateValue == 360) this.rotateValue = 0;
    this.rotateValue += 90;
    this.$['viewer-img'].style.transform = `rotate(${this.rotateValue}deg)`;
    this.$['viewer-img'].style.transformOrigin = `center`;
  }

  /**
   * Scale - the image.
   */
  imgDownScale(e) {
    e.stopPropagation();
    let imgWidth = this.$['viewer-img'].width;
    let imgHeight = this.$['viewer-img'].height;
    if (imgWidth <= 100) {
      this.h2Tip.warn(`不能再缩小了哦~`, 1500);
      if (this.interval) clearInterval(this.interval);
      return;
    }
    ;
    imgWidth -= 100;
    imgHeight -= 100;
    this.$['viewer-img'].style.width = `${imgWidth}px`;
    this.$['viewer-img'].style.height = `${imgHeight}px`;
  }

  downScaleMouseDown(e) {
    const start = Date.now();
    this.interval = setInterval(() => {
      const end = Date.now();
      if (end - start > 300) {
        this.imgDownScale(e);
      }
    }, 100)
  }

  onMouseUp(e) {
    clearInterval(this.interval);
  }

  resetRotateAndScale() {
    this.openFollow = false;
    this.$['viewer-img'].removeEventListener('mousemove', this.followEvents);
    this.$['viewer-img'].style.transform = `rotate(0deg)`;
    this.$['viewer-img'].style.width = 'auto';
    this.$['viewer-img'].style.height = 'auto';
    this.$['viewer-img'].style.left = '0px';
    this.$['viewer-img'].style.top = '0px';
    this.$['viewer-img'].style.right = '0px';
    this.$['viewer-img'].removeEventListener('dragstart', this.dragStartEvents);
    this.$['viewer-img'].removeEventListener('dragend', this.dragEndEvents);
  }

  dragStartEvents(e) {

  }

  dragEndEvents(e) {
    const target = this;
    const left = e.clientX - (target.width / 2);
    const top = e.clientY - (target.height / 2);
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
    target.style.right = `unset`;
  }

  onImgClick(e) {
    e.stopPropagation();
    this.openFollow = !this.openFollow;
    if (this.openFollow) {
      this.$['viewer-img'].addEventListener('mousemove', this.followEvents);
    } else {
      this.$['viewer-img'].removeEventListener('mousemove', this.followEvents);
    }
  }

  followEvents(e) {
    const target = this;
    const left = (+target.style.left.replace('px', '')) + (+e.movementX);
    const top = (+target.style.top.replace('px', '')) + (+e.movementY);
    if (+target.style.left.replace('px', '')) {
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
    } else {
      target.style.left = `${target.offsetLeft}px`;
      target.style.top = `${target.offsetTop}px`;
    }
    target.style.right = `unset`;
  }
}

window.customElements.define(H2ImageUpload.is, H2ImageUpload);
