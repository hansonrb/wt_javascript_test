if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* jshint globalstrict: false */
/* umdutils ignore */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
define('pdfjs-dist/build/pdf', ['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
factory((root.pdfjsDistBuildPdf = {}));
  }
}(this, function (exports) {
  // Use strict in our context only - users might not want it
  'use strict';

var pdfjsVersion = '1.4.20';
var pdfjsBuild = 'b15f335';

  var pdfjsFilePath =
    typeof document !== 'undefined' && document.currentScript ?
      document.currentScript.src : null;

  var pdfjsLibs = {};

  (function pdfjsWrapper() {



(function (root, factory) {
  {
    factory((root.pdfjsSharedGlobal = {}));
  }
}(this, function (exports) {

  var globalScope = (typeof window !== 'undefined') ? window :
                    (typeof global !== 'undefined') ? global :
                    (typeof self !== 'undefined') ? self : this;

  var isWorker = (typeof window === 'undefined');

  // The global PDFJS object exposes the API
  // In production, it will be declared outside a global wrapper
  // In development, it will be declared here
  if (!globalScope.PDFJS) {
    globalScope.PDFJS = {};
  }

  if (typeof pdfjsVersion !== 'undefined') {
    globalScope.PDFJS.version = pdfjsVersion;
  }
  if (typeof pdfjsVersion !== 'undefined') {
    globalScope.PDFJS.build = pdfjsBuild;
  }

  globalScope.PDFJS.pdfBug = false;

  exports.globalScope = globalScope;
  exports.isWorker = isWorker;
  exports.PDFJS = globalScope.PDFJS;
}));


(function (root, factory) {
  {
    factory((root.pdfjsDisplayDOMUtils = {}), root.pdfjsSharedGlobal);
  }
}(this, function (exports, sharedGlobal) {

var PDFJS = sharedGlobal.PDFJS;

/**
 * Optimised CSS custom property getter/setter.
 * @class
 */
var CustomStyle = (function CustomStyleClosure() {

  // As noted on: http://www.zachstronaut.com/posts/2009/02/17/
  //              animate-css-transforms-firefox-webkit.html
  // in some versions of IE9 it is critical that ms appear in this list
  // before Moz
  var prefixes = ['ms', 'Moz', 'Webkit', 'O'];
  var _cache = {};

  function CustomStyle() {}

  CustomStyle.getProp = function get(propName, element) {
    // check cache only when no element is given
    if (arguments.length === 1 && typeof _cache[propName] === 'string') {
      return _cache[propName];
    }

    element = element || document.documentElement;
    var style = element.style, prefixed, uPropName;

    // test standard property first
    if (typeof style[propName] === 'string') {
      return (_cache[propName] = propName);
    }

    // capitalize
    uPropName = propName.charAt(0).toUpperCase() + propName.slice(1);

    // test vendor specific properties
    for (var i = 0, l = prefixes.length; i < l; i++) {
      prefixed = prefixes[i] + uPropName;
      if (typeof style[prefixed] === 'string') {
        return (_cache[propName] = prefixed);
      }
    }

    //if all fails then set to undefined
    return (_cache[propName] = 'undefined');
  };

  CustomStyle.setProp = function set(propName, element, str) {
    var prop = this.getProp(propName);
    if (prop !== 'undefined') {
      element.style[prop] = str;
    }
  };

  return CustomStyle;
})();

PDFJS.CustomStyle = CustomStyle;

exports.CustomStyle = CustomStyle;
}));


(function (root, factory) {
  {
    factory((root.pdfjsSharedUtil = {}), root.pdfjsSharedGlobal);
  }
}(this, function (exports, sharedGlobal) {

var PDFJS = sharedGlobal.PDFJS;
var globalScope = sharedGlobal.globalScope;

var FONT_IDENTITY_MATRIX = [0.001, 0, 0, 0.001, 0, 0];

var TextRenderingMode = {
  FILL: 0,
  STROKE: 1,
  FILL_STROKE: 2,
  INVISIBLE: 3,
  FILL_ADD_TO_PATH: 4,
  STROKE_ADD_TO_PATH: 5,
  FILL_STROKE_ADD_TO_PATH: 6,
  ADD_TO_PATH: 7,
  FILL_STROKE_MASK: 3,
  ADD_TO_PATH_FLAG: 4
};

var ImageKind = {
  GRAYSCALE_1BPP: 1,
  RGB_24BPP: 2,
  RGBA_32BPP: 3
};

var AnnotationType = {
  TEXT: 1,
  LINK: 2,
  FREETEXT: 3,
  LINE: 4,
  SQUARE: 5,
  CIRCLE: 6,
  POLYGON: 7,
  POLYLINE: 8,
  HIGHLIGHT: 9,
  UNDERLINE: 10,
  SQUIGGLY: 11,
  STRIKEOUT: 12,
  STAMP: 13,
  CARET: 14,
  INK: 15,
  POPUP: 16,
  FILEATTACHMENT: 17,
  SOUND: 18,
  MOVIE: 19,
  WIDGET: 20,
  SCREEN: 21,
  PRINTERMARK: 22,
  TRAPNET: 23,
  WATERMARK: 24,
  THREED: 25,
  REDACT: 26
};

var AnnotationFlag = {
  INVISIBLE: 0x01,
  HIDDEN: 0x02,
  PRINT: 0x04,
  NOZOOM: 0x08,
  NOROTATE: 0x10,
  NOVIEW: 0x20,
  READONLY: 0x40,
  LOCKED: 0x80,
  TOGGLENOVIEW: 0x100,
  LOCKEDCONTENTS: 0x200
};

var AnnotationBorderStyleType = {
  SOLID: 1,
  DASHED: 2,
  BEVELED: 3,
  INSET: 4,
  UNDERLINE: 5
};

var StreamType = {
  UNKNOWN: 0,
  FLATE: 1,
  LZW: 2,
  DCT: 3,
  JPX: 4,
  JBIG: 5,
  A85: 6,
  AHX: 7,
  CCF: 8,
  RL: 9
};

var FontType = {
  UNKNOWN: 0,
  TYPE1: 1,
  TYPE1C: 2,
  CIDFONTTYPE0: 3,
  CIDFONTTYPE0C: 4,
  TRUETYPE: 5,
  CIDFONTTYPE2: 6,
  TYPE3: 7,
  OPENTYPE: 8,
  TYPE0: 9,
  MMTYPE1: 10
};

PDFJS.VERBOSITY_LEVELS = {
  errors: 0,
  warnings: 1,
  infos: 5
};

// All the possible operations for an operator list.
var OPS = PDFJS.OPS = {
  // Intentionally start from 1 so it is easy to spot bad operators that will be
  // 0's.
  dependency: 1,
  setLineWidth: 2,
  setLineCap: 3,
  setLineJoin: 4,
  setMiterLimit: 5,
  setDash: 6,
  setRenderingIntent: 7,
  setFlatness: 8,
  setGState: 9,
  save: 10,
  restore: 11,
  transform: 12,
  moveTo: 13,
  lineTo: 14,
  curveTo: 15,
  curveTo2: 16,
  curveTo3: 17,
  closePath: 18,
  rectangle: 19,
  stroke: 20,
  closeStroke: 21,
  fill: 22,
  eoFill: 23,
  fillStroke: 24,
  eoFillStroke: 25,
  closeFillStroke: 26,
  closeEOFillStroke: 27,
  endPath: 28,
  clip: 29,
  eoClip: 30,
  beginText: 31,
  endText: 32,
  setCharSpacing: 33,
  setWordSpacing: 34,
  setHScale: 35,
  setLeading: 36,
  setFont: 37,
  setTextRenderingMode: 38,
  setTextRise: 39,
  moveText: 40,
  setLeadingMoveText: 41,
  setTextMatrix: 42,
  nextLine: 43,
  showText: 44,
  showSpacedText: 45,
  nextLineShowText: 46,
  nextLineSetSpacingShowText: 47,
  setCharWidth: 48,
  setCharWidthAndBounds: 49,
  setStrokeColorSpace: 50,
  setFillColorSpace: 51,
  setStrokeColor: 52,
  setStrokeColorN: 53,
  setFillColor: 54,
  setFillColorN: 55,
  setStrokeGray: 56,
  setFillGray: 57,
  setStrokeRGBColor: 58,
  setFillRGBColor: 59,
  setStrokeCMYKColor: 60,
  setFillCMYKColor: 61,
  shadingFill: 62,
  beginInlineImage: 63,
  beginImageData: 64,
  endInlineImage: 65,
  paintXObject: 66,
  markPoint: 67,
  markPointProps: 68,
  beginMarkedContent: 69,
  beginMarkedContentProps: 70,
  endMarkedContent: 71,
  beginCompat: 72,
  endCompat: 73,
  paintFormXObjectBegin: 74,
  paintFormXObjectEnd: 75,
  beginGroup: 76,
  endGroup: 77,
  beginAnnotations: 78,
  endAnnotations: 79,
  beginAnnotation: 80,
  endAnnotation: 81,
  paintJpegXObject: 82,
  paintImageMaskXObject: 83,
  paintImageMaskXObjectGroup: 84,
  paintImageXObject: 85,
  paintInlineImageXObject: 86,
  paintInlineImageXObjectGroup: 87,
  paintImageXObjectRepeat: 88,
  paintImageMaskXObjectRepeat: 89,
  paintSolidColorImageMask: 90,
  constructPath: 91
};

// A notice for devs. These are good for things that are helpful to devs, such
// as warning that Workers were disabled, which is important to devs but not
// end users.
function info(msg) {
  if (PDFJS.verbosity >= PDFJS.VERBOSITY_LEVELS.infos) {
    console.log('Info: ' + msg);
  }
}

// Non-fatal warnings.
function warn(msg) {
  if (PDFJS.verbosity >= PDFJS.VERBOSITY_LEVELS.warnings) {
    console.log('Warning: ' + msg);
  }
}

// Deprecated API function -- treated as warnings.
function deprecated(details) {
  warn('Deprecated API usage: ' + details);
}

// Fatal errors that should trigger the fallback UI and halt execution by
// throwing an exception.
function error(msg) {
  if (PDFJS.verbosity >= PDFJS.VERBOSITY_LEVELS.errors) {
    console.log('Error: ' + msg);
    console.log(backtrace());
  }
  throw new Error(msg);
}

function backtrace() {
  try {
    throw new Error();
  } catch (e) {
    return e.stack ? e.stack.split('\n').slice(2).join('\n') : '';
  }
}

function assert(cond, msg) {
  if (!cond) {
    error(msg);
  }
}

var UNSUPPORTED_FEATURES = PDFJS.UNSUPPORTED_FEATURES = {
  unknown: 'unknown',
  forms: 'forms',
  javaScript: 'javaScript',
  smask: 'smask',
  shadingPattern: 'shadingPattern',
  font: 'font'
};

// Combines two URLs. The baseUrl shall be absolute URL. If the url is an
// absolute URL, it will be returned as is.
function combineUrl(baseUrl, url) {
  if (!url) {
    return baseUrl;
  }
  return new URL(url, baseUrl).href;
}

// Validates if URL is safe and allowed, e.g. to avoid XSS.
function isValidUrl(url, allowRelative) {
  if (!url) {
    return false;
  }
  // RFC 3986 (http://tools.ietf.org/html/rfc3986#section-3.1)
  // scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
  var protocol = /^[a-z][a-z0-9+\-.]*(?=:)/i.exec(url);
  if (!protocol) {
    return allowRelative;
  }
  protocol = protocol[0].toLowerCase();
  switch (protocol) {
    case 'http':
    case 'https':
    case 'ftp':
    case 'mailto':
    case 'tel':
      return true;
    default:
      return false;
  }
}
PDFJS.isValidUrl = isValidUrl;

/**
 * Adds various attributes (href, title, target, rel) to hyperlinks.
 * @param {HTMLLinkElement} link - The link element.
 * @param {Object} params - An object with the properties:
 * @param {string} params.url - An absolute URL.
 */
function addLinkAttributes(link, params) {
  var url = params && params.url;
  link.href = link.title = (url ? removeNullCharacters(url) : '');

  if (url) {
    if (isExternalLinkTargetSet()) {
      link.target = LinkTargetStringMap[PDFJS.externalLinkTarget];
    }
    // Strip referrer from the URL.
    link.rel = PDFJS.externalLinkRel;
  }
}
PDFJS.addLinkAttributes = addLinkAttributes;

function shadow(obj, prop, value) {
  Object.defineProperty(obj, prop, { value: value,
                                     enumerable: true,
                                     configurable: true,
                                     writable: false });
  return value;
}
PDFJS.shadow = shadow;

var LinkTarget = PDFJS.LinkTarget = {
  NONE: 0, // Default value.
  SELF: 1,
  BLANK: 2,
  PARENT: 3,
  TOP: 4,
};
var LinkTargetStringMap = [
  '',
  '_self',
  '_blank',
  '_parent',
  '_top'
];

function isExternalLinkTargetSet() {
  if (PDFJS.openExternalLinksInNewWindow) {
    deprecated('PDFJS.openExternalLinksInNewWindow, please use ' +
               '"PDFJS.externalLinkTarget = PDFJS.LinkTarget.BLANK" instead.');
    if (PDFJS.externalLinkTarget === LinkTarget.NONE) {
      PDFJS.externalLinkTarget = LinkTarget.BLANK;
    }
    // Reset the deprecated parameter, to suppress further warnings.
    PDFJS.openExternalLinksInNewWindow = false;
  }
  switch (PDFJS.externalLinkTarget) {
    case LinkTarget.NONE:
      return false;
    case LinkTarget.SELF:
    case LinkTarget.BLANK:
    case LinkTarget.PARENT:
    case LinkTarget.TOP:
      return true;
  }
  warn('PDFJS.externalLinkTarget is invalid: ' + PDFJS.externalLinkTarget);
  // Reset the external link target, to suppress further warnings.
  PDFJS.externalLinkTarget = LinkTarget.NONE;
  return false;
}
PDFJS.isExternalLinkTargetSet = isExternalLinkTargetSet;

var PasswordResponses = PDFJS.PasswordResponses = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2
};

var PasswordException = (function PasswordExceptionClosure() {
  function PasswordException(msg, code) {
    this.name = 'PasswordException';
    this.message = msg;
    this.code = code;
  }

  PasswordException.prototype = new Error();
  PasswordException.constructor = PasswordException;

  return PasswordException;
})();
PDFJS.PasswordException = PasswordException;

var UnknownErrorException = (function UnknownErrorExceptionClosure() {
  function UnknownErrorException(msg, details) {
    this.name = 'UnknownErrorException';
    this.message = msg;
    this.details = details;
  }

  UnknownErrorException.prototype = new Error();
  UnknownErrorException.constructor = UnknownErrorException;

  return UnknownErrorException;
})();
PDFJS.UnknownErrorException = UnknownErrorException;

var InvalidPDFException = (function InvalidPDFExceptionClosure() {
  function InvalidPDFException(msg) {
    this.name = 'InvalidPDFException';
    this.message = msg;
  }

  InvalidPDFException.prototype = new Error();
  InvalidPDFException.constructor = InvalidPDFException;

  return InvalidPDFException;
})();
PDFJS.InvalidPDFException = InvalidPDFException;

var MissingPDFException = (function MissingPDFExceptionClosure() {
  function MissingPDFException(msg) {
    this.name = 'MissingPDFException';
    this.message = msg;
  }

  MissingPDFException.prototype = new Error();
  MissingPDFException.constructor = MissingPDFException;

  return MissingPDFException;
})();
PDFJS.MissingPDFException = MissingPDFException;

var UnexpectedResponseException =
    (function UnexpectedResponseExceptionClosure() {
  function UnexpectedResponseException(msg, status) {
    this.name = 'UnexpectedResponseException';
    this.message = msg;
    this.status = status;
  }

  UnexpectedResponseException.prototype = new Error();
  UnexpectedResponseException.constructor = UnexpectedResponseException;

  return UnexpectedResponseException;
})();
PDFJS.UnexpectedResponseException = UnexpectedResponseException;

var NotImplementedException = (function NotImplementedExceptionClosure() {
  function NotImplementedException(msg) {
    this.message = msg;
  }

  NotImplementedException.prototype = new Error();
  NotImplementedException.prototype.name = 'NotImplementedException';
  NotImplementedException.constructor = NotImplementedException;

  return NotImplementedException;
})();

var MissingDataException = (function MissingDataExceptionClosure() {
  function MissingDataException(begin, end) {
    this.begin = begin;
    this.end = end;
    this.message = 'Missing data [' + begin + ', ' + end + ')';
  }

  MissingDataException.prototype = new Error();
  MissingDataException.prototype.name = 'MissingDataException';
  MissingDataException.constructor = MissingDataException;

  return MissingDataException;
})();

var XRefParseException = (function XRefParseExceptionClosure() {
  function XRefParseException(msg) {
    this.message = msg;
  }

  XRefParseException.prototype = new Error();
  XRefParseException.prototype.name = 'XRefParseException';
  XRefParseException.constructor = XRefParseException;

  return XRefParseException;
})();

var NullCharactersRegExp = /\x00/g;

function removeNullCharacters(str) {
  if (typeof str !== 'string') {
    warn('The argument for removeNullCharacters must be a string.');
    return str;
  }
  return str.replace(NullCharactersRegExp, '');
}
PDFJS.removeNullCharacters = removeNullCharacters;

function bytesToString(bytes) {
  assert(bytes !== null && typeof bytes === 'object' &&
         bytes.length !== undefined, 'Invalid argument for bytesToString');
  var length = bytes.length;
  var MAX_ARGUMENT_COUNT = 8192;
  if (length < MAX_ARGUMENT_COUNT) {
    return String.fromCharCode.apply(null, bytes);
  }
  var strBuf = [];
  for (var i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
    var chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
    var chunk = bytes.subarray(i, chunkEnd);
    strBuf.push(String.fromCharCode.apply(null, chunk));
  }
  return strBuf.join('');
}

function stringToBytes(str) {
  assert(typeof str === 'string', 'Invalid argument for stringToBytes');
  var length = str.length;
  var bytes = new Uint8Array(length);
  for (var i = 0; i < length; ++i) {
    bytes[i] = str.charCodeAt(i) & 0xFF;
  }
  return bytes;
}

function string32(value) {
  return String.fromCharCode((value >> 24) & 0xff, (value >> 16) & 0xff,
                             (value >> 8) & 0xff, value & 0xff);
}

function log2(x) {
  var n = 1, i = 0;
  while (x > n) {
    n <<= 1;
    i++;
  }
  return i;
}

function readInt8(data, start) {
  return (data[start] << 24) >> 24;
}

function readUint16(data, offset) {
  return (data[offset] << 8) | data[offset + 1];
}

function readUint32(data, offset) {
  return ((data[offset] << 24) | (data[offset + 1] << 16) |
         (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
}

// Lazy test the endianness of the platform
// NOTE: This will be 'true' for simulated TypedArrays
function isLittleEndian() {
  var buffer8 = new Uint8Array(2);
  buffer8[0] = 1;
  var buffer16 = new Uint16Array(buffer8.buffer);
  return (buffer16[0] === 1);
}

Object.defineProperty(PDFJS, 'isLittleEndian', {
  configurable: true,
  get: function PDFJS_isLittleEndian() {
    return shadow(PDFJS, 'isLittleEndian', isLittleEndian());
  }
});

  // Lazy test if the userAgent support CanvasTypedArrays
function hasCanvasTypedArrays() {
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  var ctx = canvas.getContext('2d');
  var imageData = ctx.createImageData(1, 1);
  return (typeof imageData.data.buffer !== 'undefined');
}

Object.defineProperty(PDFJS, 'hasCanvasTypedArrays', {
  configurable: true,
  get: function PDFJS_hasCanvasTypedArrays() {
    return shadow(PDFJS, 'hasCanvasTypedArrays', hasCanvasTypedArrays());
  }
});

var Uint32ArrayView = (function Uint32ArrayViewClosure() {

  function Uint32ArrayView(buffer, length) {
    this.buffer = buffer;
    this.byteLength = buffer.length;
    this.length = length === undefined ? (this.byteLength >> 2) : length;
    ensureUint32ArrayViewProps(this.length);
  }
  Uint32ArrayView.prototype = Object.create(null);

  var uint32ArrayViewSetters = 0;
  function createUint32ArrayProp(index) {
    return {
      get: function () {
        var buffer = this.buffer, offset = index << 2;
        return (buffer[offset] | (buffer[offset + 1] << 8) |
          (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24)) >>> 0;
      },
      set: function (value) {
        var buffer = this.buffer, offset = index << 2;
        buffer[offset] = value & 255;
        buffer[offset + 1] = (value >> 8) & 255;
        buffer[offset + 2] = (value >> 16) & 255;
        buffer[offset + 3] = (value >>> 24) & 255;
      }
    };
  }

  function ensureUint32ArrayViewProps(length) {
    while (uint32ArrayViewSetters < length) {
      Object.defineProperty(Uint32ArrayView.prototype,
        uint32ArrayViewSetters,
        createUint32ArrayProp(uint32ArrayViewSetters));
      uint32ArrayViewSetters++;
    }
  }

  return Uint32ArrayView;
})();

exports.Uint32ArrayView = Uint32ArrayView;

var IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];

var Util = PDFJS.Util = (function UtilClosure() {
  function Util() {}

  var rgbBuf = ['rgb(', 0, ',', 0, ',', 0, ')'];

  // makeCssRgb() can be called thousands of times. Using |rgbBuf| avoids
  // creating many intermediate strings.
  Util.makeCssRgb = function Util_makeCssRgb(r, g, b) {
    rgbBuf[1] = r;
    rgbBuf[3] = g;
    rgbBuf[5] = b;
    return rgbBuf.join('');
  };

  // Concatenates two transformation matrices together and returns the result.
  Util.transform = function Util_transform(m1, m2) {
    return [
      m1[0] * m2[0] + m1[2] * m2[1],
      m1[1] * m2[0] + m1[3] * m2[1],
      m1[0] * m2[2] + m1[2] * m2[3],
      m1[1] * m2[2] + m1[3] * m2[3],
      m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
      m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
    ];
  };

  // For 2d affine transforms
  Util.applyTransform = function Util_applyTransform(p, m) {
    var xt = p[0] * m[0] + p[1] * m[2] + m[4];
    var yt = p[0] * m[1] + p[1] * m[3] + m[5];
    return [xt, yt];
  };

  Util.applyInverseTransform = function Util_applyInverseTransform(p, m) {
    var d = m[0] * m[3] - m[1] * m[2];
    var xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
    var yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
    return [xt, yt];
  };

  // Applies the transform to the rectangle and finds the minimum axially
  // aligned bounding box.
  Util.getAxialAlignedBoundingBox =
    function Util_getAxialAlignedBoundingBox(r, m) {

    var p1 = Util.applyTransform(r, m);
    var p2 = Util.applyTransform(r.slice(2, 4), m);
    var p3 = Util.applyTransform([r[0], r[3]], m);
    var p4 = Util.applyTransform([r[2], r[1]], m);
    return [
      Math.min(p1[0], p2[0], p3[0], p4[0]),
      Math.min(p1[1], p2[1], p3[1], p4[1]),
      Math.max(p1[0], p2[0], p3[0], p4[0]),
      Math.max(p1[1], p2[1], p3[1], p4[1])
    ];
  };

  Util.inverseTransform = function Util_inverseTransform(m) {
    var d = m[0] * m[3] - m[1] * m[2];
    return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d,
      (m[2] * m[5] - m[4] * m[3]) / d, (m[4] * m[1] - m[5] * m[0]) / d];
  };

  // Apply a generic 3d matrix M on a 3-vector v:
  //   | a b c |   | X |
  //   | d e f | x | Y |
  //   | g h i |   | Z |
  // M is assumed to be serialized as [a,b,c,d,e,f,g,h,i],
  // with v as [X,Y,Z]
  Util.apply3dTransform = function Util_apply3dTransform(m, v) {
    return [
      m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
      m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
      m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
    ];
  };

  // This calculation uses Singular Value Decomposition.
  // The SVD can be represented with formula A = USV. We are interested in the
  // matrix S here because it represents the scale values.
  Util.singularValueDecompose2dScale =
    function Util_singularValueDecompose2dScale(m) {

    var transpose = [m[0], m[2], m[1], m[3]];

    // Multiply matrix m with its transpose.
    var a = m[0] * transpose[0] + m[1] * transpose[2];
    var b = m[0] * transpose[1] + m[1] * transpose[3];
    var c = m[2] * transpose[0] + m[3] * transpose[2];
    var d = m[2] * transpose[1] + m[3] * transpose[3];

    // Solve the second degree polynomial to get roots.
    var first = (a + d) / 2;
    var second = Math.sqrt((a + d) * (a + d) - 4 * (a * d - c * b)) / 2;
    var sx = first + second || 1;
    var sy = first - second || 1;

    // Scale values are the square roots of the eigenvalues.
    return [Math.sqrt(sx), Math.sqrt(sy)];
  };

  // Normalize rectangle rect=[x1, y1, x2, y2] so that (x1,y1) < (x2,y2)
  // For coordinate systems whose origin lies in the bottom-left, this
  // means normalization to (BL,TR) ordering. For systems with origin in the
  // top-left, this means (TL,BR) ordering.
  Util.normalizeRect = function Util_normalizeRect(rect) {
    var r = rect.slice(0); // clone rect
    if (rect[0] > rect[2]) {
      r[0] = rect[2];
      r[2] = rect[0];
    }
    if (rect[1] > rect[3]) {
      r[1] = rect[3];
      r[3] = rect[1];
    }
    return r;
  };

  // Returns a rectangle [x1, y1, x2, y2] corresponding to the
  // intersection of rect1 and rect2. If no intersection, returns 'false'
  // The rectangle coordinates of rect1, rect2 should be [x1, y1, x2, y2]
  Util.intersect = function Util_intersect(rect1, rect2) {
    function compare(a, b) {
      return a - b;
    }

    // Order points along the axes
    var orderedX = [rect1[0], rect1[2], rect2[0], rect2[2]].sort(compare),
        orderedY = [rect1[1], rect1[3], rect2[1], rect2[3]].sort(compare),
        result = [];

    rect1 = Util.normalizeRect(rect1);
    rect2 = Util.normalizeRect(rect2);

    // X: first and second points belong to different rectangles?
    if ((orderedX[0] === rect1[0] && orderedX[1] === rect2[0]) ||
        (orderedX[0] === rect2[0] && orderedX[1] === rect1[0])) {
      // Intersection must be between second and third points
      result[0] = orderedX[1];
      result[2] = orderedX[2];
    } else {
      return false;
    }

    // Y: first and second points belong to different rectangles?
    if ((orderedY[0] === rect1[1] && orderedY[1] === rect2[1]) ||
        (orderedY[0] === rect2[1] && orderedY[1] === rect1[1])) {
      // Intersection must be between second and third points
      result[1] = orderedY[1];
      result[3] = orderedY[2];
    } else {
      return false;
    }

    return result;
  };

  Util.sign = function Util_sign(num) {
    return num < 0 ? -1 : 1;
  };

  var ROMAN_NUMBER_MAP = [
    '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
    '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
    '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'
  ];
  /**
   * Converts positive integers to (upper case) Roman numerals.
   * @param {integer} number - The number that should be converted.
   * @param {boolean} lowerCase - Indicates if the result should be converted
   *   to lower case letters. The default is false.
   * @return {string} The resulting Roman number.
   */
  Util.toRoman = function Util_toRoman(number, lowerCase) {
    assert(isInt(number) && number > 0,
           'The number should be a positive integer.');
    var pos, romanBuf = [];
    // Thousands
    while (number >= 1000) {
      number -= 1000;
      romanBuf.push('M');
    }
    // Hundreds
    pos = (number / 100) | 0;
    number %= 100;
    romanBuf.push(ROMAN_NUMBER_MAP[pos]);
    // Tens
    pos = (number / 10) | 0;
    number %= 10;
    romanBuf.push(ROMAN_NUMBER_MAP[10 + pos]);
    // Ones
    romanBuf.push(ROMAN_NUMBER_MAP[20 + number]);

    var romanStr = romanBuf.join('');
    return (lowerCase ? romanStr.toLowerCase() : romanStr);
  };

  Util.appendToArray = function Util_appendToArray(arr1, arr2) {
    Array.prototype.push.apply(arr1, arr2);
  };

  Util.prependToArray = function Util_prependToArray(arr1, arr2) {
    Array.prototype.unshift.apply(arr1, arr2);
  };

  Util.extendObj = function extendObj(obj1, obj2) {
    for (var key in obj2) {
      obj1[key] = obj2[key];
    }
  };

  Util.getInheritableProperty = function Util_getInheritableProperty(dict,
                                                                     name) {
    while (dict && !dict.has(name)) {
      dict = dict.get('Parent');
    }
    if (!dict) {
      return null;
    }
    return dict.get(name);
  };

  Util.inherit = function Util_inherit(sub, base, prototype) {
    sub.prototype = Object.create(base.prototype);
    sub.prototype.constructor = sub;
    for (var prop in prototype) {
      sub.prototype[prop] = prototype[prop];
    }
  };

  Util.loadScript = function Util_loadScript(src, callback) {
    var script = document.createElement('script');
    var loaded = false;
    script.setAttribute('src', src);
    if (callback) {
      script.onload = function() {
        if (!loaded) {
          callback();
        }
        loaded = true;
      };
    }
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  return Util;
})();

/**
 * PDF page viewport created based on scale, rotation and offset.
 * @class
 * @alias PDFJS.PageViewport
 */
var PageViewport = PDFJS.PageViewport = (function PageViewportClosure() {
  /**
   * @constructor
   * @private
   * @param viewBox {Array} xMin, yMin, xMax and yMax coordinates.
   * @param scale {number} scale of the viewport.
   * @param rotation {number} rotations of the viewport in degrees.
   * @param offsetX {number} offset X
   * @param offsetY {number} offset Y
   * @param dontFlip {boolean} if true, axis Y will not be flipped.
   */
  function PageViewport(viewBox, scale, rotation, offsetX, offsetY, dontFlip) {
    this.viewBox = viewBox;
    this.scale = scale;
    this.rotation = rotation;
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    // creating transform to convert pdf coordinate system to the normal
    // canvas like coordinates taking in account scale and rotation
    var centerX = (viewBox[2] + viewBox[0]) / 2;
    var centerY = (viewBox[3] + viewBox[1]) / 2;
    var rotateA, rotateB, rotateC, rotateD;
    rotation = rotation % 360;
    rotation = rotation < 0 ? rotation + 360 : rotation;
    switch (rotation) {
      case 180:
        rotateA = -1; rotateB = 0; rotateC = 0; rotateD = 1;
        break;
      case 90:
        rotateA = 0; rotateB = 1; rotateC = 1; rotateD = 0;
        break;
      case 270:
        rotateA = 0; rotateB = -1; rotateC = -1; rotateD = 0;
        break;
      //case 0:
      default:
        rotateA = 1; rotateB = 0; rotateC = 0; rotateD = -1;
        break;
    }

    if (dontFlip) {
      rotateC = -rotateC; rotateD = -rotateD;
    }

    var offsetCanvasX, offsetCanvasY;
    var width, height;
    if (rotateA === 0) {
      offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
      width = Math.abs(viewBox[3] - viewBox[1]) * scale;
      height = Math.abs(viewBox[2] - viewBox[0]) * scale;
    } else {
      offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
      width = Math.abs(viewBox[2] - viewBox[0]) * scale;
      height = Math.abs(viewBox[3] - viewBox[1]) * scale;
    }
    // creating transform for the following operations:
    // translate(-centerX, -centerY), rotate and flip vertically,
    // scale, and translate(offsetCanvasX, offsetCanvasY)
    this.transform = [
      rotateA * scale,
      rotateB * scale,
      rotateC * scale,
      rotateD * scale,
      offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY,
      offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY
    ];

    this.width = width;
    this.height = height;
    this.fontScale = scale;
  }
  PageViewport.prototype = /** @lends PDFJS.PageViewport.prototype */ {
    /**
     * Clones viewport with additional properties.
     * @param args {Object} (optional) If specified, may contain the 'scale' or
     * 'rotation' properties to override the corresponding properties in
     * the cloned viewport.
     * @returns {PDFJS.PageViewport} Cloned viewport.
     */
    clone: function PageViewPort_clone(args) {
      args = args || {};
      var scale = 'scale' in args ? args.scale : this.scale;
      var rotation = 'rotation' in args ? args.rotation : this.rotation;
      return new PageViewport(this.viewBox.slice(), scale, rotation,
                              this.offsetX, this.offsetY, args.dontFlip);
    },
    /**
     * Converts PDF point to the viewport coordinates. For examples, useful for
     * converting PDF location into canvas pixel coordinates.
     * @param x {number} X coordinate.
     * @param y {number} Y coordinate.
     * @returns {Object} Object that contains 'x' and 'y' properties of the
     * point in the viewport coordinate space.
     * @see {@link convertToPdfPoint}
     * @see {@link convertToViewportRectangle}
     */
    convertToViewportPoint: function PageViewport_convertToViewportPoint(x, y) {
      return Util.applyTransform([x, y], this.transform);
    },
    /**
     * Converts PDF rectangle to the viewport coordinates.
     * @param rect {Array} xMin, yMin, xMax and yMax coordinates.
     * @returns {Array} Contains corresponding coordinates of the rectangle
     * in the viewport coordinate space.
     * @see {@link convertToViewportPoint}
     */
    convertToViewportRectangle:
      function PageViewport_convertToViewportRectangle(rect) {
      var tl = Util.applyTransform([rect[0], rect[1]], this.transform);
      var br = Util.applyTransform([rect[2], rect[3]], this.transform);
      return [tl[0], tl[1], br[0], br[1]];
    },
    /**
     * Converts viewport coordinates to the PDF location. For examples, useful
     * for converting canvas pixel location into PDF one.
     * @param x {number} X coordinate.
     * @param y {number} Y coordinate.
     * @returns {Object} Object that contains 'x' and 'y' properties of the
     * point in the PDF coordinate space.
     * @see {@link convertToViewportPoint}
     */
    convertToPdfPoint: function PageViewport_convertToPdfPoint(x, y) {
      return Util.applyInverseTransform([x, y], this.transform);
    }
  };
  return PageViewport;
})();

var PDFStringTranslateTable = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0x2D8, 0x2C7, 0x2C6, 0x2D9, 0x2DD, 0x2DB, 0x2DA, 0x2DC, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2022, 0x2020, 0x2021, 0x2026, 0x2014,
  0x2013, 0x192, 0x2044, 0x2039, 0x203A, 0x2212, 0x2030, 0x201E, 0x201C,
  0x201D, 0x2018, 0x2019, 0x201A, 0x2122, 0xFB01, 0xFB02, 0x141, 0x152, 0x160,
  0x178, 0x17D, 0x131, 0x142, 0x153, 0x161, 0x17E, 0, 0x20AC
];

function stringToPDFString(str) {
  var i, n = str.length, strBuf = [];
  if (str[0] === '\xFE' && str[1] === '\xFF') {
    // UTF16BE BOM
    for (i = 2; i < n; i += 2) {
      strBuf.push(String.fromCharCode(
        (str.charCodeAt(i) << 8) | str.charCodeAt(i + 1)));
    }
  } else {
    for (i = 0; i < n; ++i) {
      var code = PDFStringTranslateTable[str.charCodeAt(i)];
      strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
    }
  }
  return strBuf.join('');
}

function stringToUTF8String(str) {
  return decodeURIComponent(escape(str));
}

function utf8StringToString(str) {
  return unescape(encodeURIComponent(str));
}

function isEmptyObj(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

function isBool(v) {
  return typeof v === 'boolean';
}

function isInt(v) {
  return typeof v === 'number' && ((v | 0) === v);
}

function isNum(v) {
  return typeof v === 'number';
}

function isString(v) {
  return typeof v === 'string';
}

function isArray(v) {
  return v instanceof Array;
}

function isArrayBuffer(v) {
  return typeof v === 'object' && v !== null && v.byteLength !== undefined;
}

/**
 * Promise Capability object.
 *
 * @typedef {Object} PromiseCapability
 * @property {Promise} promise - A promise object.
 * @property {function} resolve - Fullfills the promise.
 * @property {function} reject - Rejects the promise.
 */

/**
 * Creates a promise capability object.
 * @alias PDFJS.createPromiseCapability
 *
 * @return {PromiseCapability} A capability object contains:
 * - a Promise, resolve and reject methods.
 */
function createPromiseCapability() {
  var capability = {};
  capability.promise = new Promise(function (resolve, reject) {
    capability.resolve = resolve;
    capability.reject = reject;
  });
  return capability;
}

PDFJS.createPromiseCapability = createPromiseCapability;

/**
 * Polyfill for Promises:
 * The following promise implementation tries to generally implement the
 * Promise/A+ spec. Some notable differences from other promise libaries are:
 * - There currently isn't a seperate deferred and promise object.
 * - Unhandled rejections eventually show an error if they aren't handled.
 *
 * Based off of the work in:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=810490
 */
(function PromiseClosure() {
  if (globalScope.Promise) {
    // Promises existing in the DOM/Worker, checking presence of all/resolve
    if (typeof globalScope.Promise.all !== 'function') {
      globalScope.Promise.all = function (iterable) {
        var count = 0, results = [], resolve, reject;
        var promise = new globalScope.Promise(function (resolve_, reject_) {
          resolve = resolve_;
          reject = reject_;
        });
        iterable.forEach(function (p, i) {
          count++;
          p.then(function (result) {
            results[i] = result;
            count--;
            if (count === 0) {
              resolve(results);
            }
          }, reject);
        });
        if (count === 0) {
          resolve(results);
        }
        return promise;
      };
    }
    if (typeof globalScope.Promise.resolve !== 'function') {
      globalScope.Promise.resolve = function (value) {
        return new globalScope.Promise(function (resolve) { resolve(value); });
      };
    }
    if (typeof globalScope.Promise.reject !== 'function') {
      globalScope.Promise.reject = function (reason) {
        return new globalScope.Promise(function (resolve, reject) {
          reject(reason);
        });
      };
    }
    if (typeof globalScope.Promise.prototype.catch !== 'function') {
      globalScope.Promise.prototype.catch = function (onReject) {
        return globalScope.Promise.prototype.then(undefined, onReject);
      };
    }
    return;
  }
  var STATUS_PENDING = 0;
  var STATUS_RESOLVED = 1;
  var STATUS_REJECTED = 2;

  // In an attempt to avoid silent exceptions, unhandled rejections are
  // tracked and if they aren't handled in a certain amount of time an
  // error is logged.
  var REJECTION_TIMEOUT = 500;

  var HandlerManager = {
    handlers: [],
    running: false,
    unhandledRejections: [],
    pendingRejectionCheck: false,

    scheduleHandlers: function scheduleHandlers(promise) {
      if (promise._status === STATUS_PENDING) {
        return;
      }

      this.handlers = this.handlers.concat(promise._handlers);
      promise._handlers = [];

      if (this.running) {
        return;
      }
      this.running = true;

      setTimeout(this.runHandlers.bind(this), 0);
    },

    runHandlers: function runHandlers() {
      var RUN_TIMEOUT = 1; // ms
      var timeoutAt = Date.now() + RUN_TIMEOUT;
      while (this.handlers.length > 0) {
        var handler = this.handlers.shift();

        var nextStatus = handler.thisPromise._status;
        var nextValue = handler.thisPromise._value;

        try {
          if (nextStatus === STATUS_RESOLVED) {
            if (typeof handler.onResolve === 'function') {
              nextValue = handler.onResolve(nextValue);
            }
          } else if (typeof handler.onReject === 'function') {
              nextValue = handler.onReject(nextValue);
              nextStatus = STATUS_RESOLVED;

              if (handler.thisPromise._unhandledRejection) {
                this.removeUnhandeledRejection(handler.thisPromise);
              }
          }
        } catch (ex) {
          nextStatus = STATUS_REJECTED;
          nextValue = ex;
        }

        handler.nextPromise._updateStatus(nextStatus, nextValue);
        if (Date.now() >= timeoutAt) {
          break;
        }
      }

      if (this.handlers.length > 0) {
        setTimeout(this.runHandlers.bind(this), 0);
        return;
      }

      this.running = false;
    },

    addUnhandledRejection: function addUnhandledRejection(promise) {
      this.unhandledRejections.push({
        promise: promise,
        time: Date.now()
      });
      this.scheduleRejectionCheck();
    },

    removeUnhandeledRejection: function removeUnhandeledRejection(promise) {
      promise._unhandledRejection = false;
      for (var i = 0; i < this.unhandledRejections.length; i++) {
        if (this.unhandledRejections[i].promise === promise) {
          this.unhandledRejections.splice(i);
          i--;
        }
      }
    },

    scheduleRejectionCheck: function scheduleRejectionCheck() {
      if (this.pendingRejectionCheck) {
        return;
      }
      this.pendingRejectionCheck = true;
      setTimeout(function rejectionCheck() {
        this.pendingRejectionCheck = false;
        var now = Date.now();
        for (var i = 0; i < this.unhandledRejections.length; i++) {
          if (now - this.unhandledRejections[i].time > REJECTION_TIMEOUT) {
            var unhandled = this.unhandledRejections[i].promise._value;
            var msg = 'Unhandled rejection: ' + unhandled;
            if (unhandled.stack) {
              msg += '\n' + unhandled.stack;
            }
            warn(msg);
            this.unhandledRejections.splice(i);
            i--;
          }
        }
        if (this.unhandledRejections.length) {
          this.scheduleRejectionCheck();
        }
      }.bind(this), REJECTION_TIMEOUT);
    }
  };

  function Promise(resolver) {
    this._status = STATUS_PENDING;
    this._handlers = [];
    try {
      resolver.call(this, this._resolve.bind(this), this._reject.bind(this));
    } catch (e) {
      this._reject(e);
    }
  }
  /**
   * Builds a promise that is resolved when all the passed in promises are
   * resolved.
   * @param {array} array of data and/or promises to wait for.
   * @return {Promise} New dependant promise.
   */
  Promise.all = function Promise_all(promises) {
    var resolveAll, rejectAll;
    var deferred = new Promise(function (resolve, reject) {
      resolveAll = resolve;
      rejectAll = reject;
    });
    var unresolved = promises.length;
    var results = [];
    if (unresolved === 0) {
      resolveAll(results);
      return deferred;
    }
    function reject(reason) {
      if (deferred._status === STATUS_REJECTED) {
        return;
      }
      results = [];
      rejectAll(reason);
    }
    for (var i = 0, ii = promises.length; i < ii; ++i) {
      var promise = promises[i];
      var resolve = (function(i) {
        return function(value) {
          if (deferred._status === STATUS_REJECTED) {
            return;
          }
          results[i] = value;
          unresolved--;
          if (unresolved === 0) {
            resolveAll(results);
          }
        };
      })(i);
      if (Promise.isPromise(promise)) {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    }
    return deferred;
  };

  /**
   * Checks if the value is likely a promise (has a 'then' function).
   * @return {boolean} true if value is thenable
   */
  Promise.isPromise = function Promise_isPromise(value) {
    return value && typeof value.then === 'function';
  };

  /**
   * Creates resolved promise
   * @param value resolve value
   * @returns {Promise}
   */
  Promise.resolve = function Promise_resolve(value) {
    return new Promise(function (resolve) { resolve(value); });
  };

  /**
   * Creates rejected promise
   * @param reason rejection value
   * @returns {Promise}
   */
  Promise.reject = function Promise_reject(reason) {
    return new Promise(function (resolve, reject) { reject(reason); });
  };

  Promise.prototype = {
    _status: null,
    _value: null,
    _handlers: null,
    _unhandledRejection: null,

    _updateStatus: function Promise__updateStatus(status, value) {
      if (this._status === STATUS_RESOLVED ||
          this._status === STATUS_REJECTED) {
        return;
      }

      if (status === STATUS_RESOLVED &&
          Promise.isPromise(value)) {
        value.then(this._updateStatus.bind(this, STATUS_RESOLVED),
                   this._updateStatus.bind(this, STATUS_REJECTED));
        return;
      }

      this._status = status;
      this._value = value;

      if (status === STATUS_REJECTED && this._handlers.length === 0) {
        this._unhandledRejection = true;
        HandlerManager.addUnhandledRejection(this);
      }

      HandlerManager.scheduleHandlers(this);
    },

    _resolve: function Promise_resolve(value) {
      this._updateStatus(STATUS_RESOLVED, value);
    },

    _reject: function Promise_reject(reason) {
      this._updateStatus(STATUS_REJECTED, reason);
    },

    then: function Promise_then(onResolve, onReject) {
      var nextPromise = new Promise(function (resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
      });
      this._handlers.push({
        thisPromise: this,
        onResolve: onResolve,
        onReject: onReject,
        nextPromise: nextPromise
      });
      HandlerManager.scheduleHandlers(this);
      return nextPromise;
    },

    catch: function Promise_catch(onReject) {
      return this.then(undefined, onReject);
    }
  };

  globalScope.Promise = Promise;
})();

var StatTimer = (function StatTimerClosure() {
  function rpad(str, pad, length) {
    while (str.length < length) {
      str += pad;
    }
    return str;
  }
  function StatTimer() {
    this.started = {};
    this.times = [];
    this.enabled = true;
  }
  StatTimer.prototype = {
    time: function StatTimer_time(name) {
      if (!this.enabled) {
        return;
      }
      if (name in this.started) {
        warn('Timer is already running for ' + name);
      }
      this.started[name] = Date.now();
    },
    timeEnd: function StatTimer_timeEnd(name) {
      if (!this.enabled) {
        return;
      }
      if (!(name in this.started)) {
        warn('Timer has not been started for ' + name);
      }
      this.times.push({
        'name': name,
        'start': this.started[name],
        'end': Date.now()
      });
      // Remove timer from started so it can be called again.
      delete this.started[name];
    },
    toString: function StatTimer_toString() {
      var i, ii;
      var times = this.times;
      var out = '';
      // Find the longest name for padding purposes.
      var longest = 0;
      for (i = 0, ii = times.length; i < ii; ++i) {
        var name = times[i]['name'];
        if (name.length > longest) {
          longest = name.length;
        }
      }
      for (i = 0, ii = times.length; i < ii; ++i) {
        var span = times[i];
        var duration = span.end - span.start;
        out += rpad(span['name'], ' ', longest) + ' ' + duration + 'ms\n';
      }
      return out;
    }
  };
  return StatTimer;
})();

PDFJS.createBlob = function createBlob(data, contentType) {
  if (typeof Blob !== 'undefined') {
    return new Blob([data], { type: contentType });
  }
  // Blob builder is deprecated in FF14 and removed in FF18.
  var bb = new MozBlobBuilder();
  bb.append(data);
  return bb.getBlob(contentType);
};

PDFJS.createObjectURL = (function createObjectURLClosure() {
  // Blob/createObjectURL is not available, falling back to data schema.
  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  return function createObjectURL(data, contentType) {
    if (!PDFJS.disableCreateObjectURL &&
        typeof URL !== 'undefined' && URL.createObjectURL) {
      var blob = PDFJS.createBlob(data, contentType);
      return URL.createObjectURL(blob);
    }

    var buffer = 'data:' + contentType + ';base64,';
    for (var i = 0, ii = data.length; i < ii; i += 3) {
      var b1 = data[i] & 0xFF;
      var b2 = data[i + 1] & 0xFF;
      var b3 = data[i + 2] & 0xFF;
      var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
      var d3 = i + 1 < ii ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
      var d4 = i + 2 < ii ? (b3 & 0x3F) : 64;
      buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
    }
    return buffer;
  };
})();

function MessageHandler(sourceName, targetName, comObj) {
  this.sourceName = sourceName;
  this.targetName = targetName;
  this.comObj = comObj;
  this.callbackIndex = 1;
  this.postMessageTransfers = true;
  var callbacksCapabilities = this.callbacksCapabilities = {};
  var ah = this.actionHandler = {};

  this._onComObjOnMessage = function messageHandlerComObjOnMessage(event) {
    var data = event.data;
    if (data.targetName !== this.sourceName) {
      return;
    }
    if (data.isReply) {
      var callbackId = data.callbackId;
      if (data.callbackId in callbacksCapabilities) {
        var callback = callbacksCapabilities[callbackId];
        delete callbacksCapabilities[callbackId];
        if ('error' in data) {
          callback.reject(data.error);
        } else {
          callback.resolve(data.data);
        }
      } else {
        error('Cannot resolve callback ' + callbackId);
      }
    } else if (data.action in ah) {
      var action = ah[data.action];
      if (data.callbackId) {
        var sourceName = this.sourceName;
        var targetName = data.sourceName;
        Promise.resolve().then(function () {
          return action[0].call(action[1], data.data);
        }).then(function (result) {
          comObj.postMessage({
            sourceName: sourceName,
            targetName: targetName,
            isReply: true,
            callbackId: data.callbackId,
            data: result
          });
        }, function (reason) {
          if (reason instanceof Error) {
            // Serialize error to avoid "DataCloneError"
            reason = reason + '';
          }
          comObj.postMessage({
            sourceName: sourceName,
            targetName: targetName,
            isReply: true,
            callbackId: data.callbackId,
            error: reason
          });
        });
      } else {
        action[0].call(action[1], data.data);
      }
    } else {
      error('Unknown action from worker: ' + data.action);
    }
  }.bind(this);
  comObj.addEventListener('message', this._onComObjOnMessage);
}

MessageHandler.prototype = {
  on: function messageHandlerOn(actionName, handler, scope) {
    var ah = this.actionHandler;
    if (ah[actionName]) {
      error('There is already an actionName called "' + actionName + '"');
    }
    ah[actionName] = [handler, scope];
  },
  /**
   * Sends a message to the comObj to invoke the action with the supplied data.
   * @param {String} actionName Action to call.
   * @param {JSON} data JSON data to send.
   * @param {Array} [transfers] Optional list of transfers/ArrayBuffers
   */
  send: function messageHandlerSend(actionName, data, transfers) {
    var message = {
      sourceName: this.sourceName,
      targetName: this.targetName,
      action: actionName,
      data: data
    };
    this.postMessage(message, transfers);
  },
  /**
   * Sends a message to the comObj to invoke the action with the supplied data.
   * Expects that other side will callback with the response.
   * @param {String} actionName Action to call.
   * @param {JSON} data JSON data to send.
   * @param {Array} [transfers] Optional list of transfers/ArrayBuffers.
   * @returns {Promise} Promise to be resolved with response data.
   */
  sendWithPromise:
    function messageHandlerSendWithPromise(actionName, data, transfers) {
    var callbackId = this.callbackIndex++;
    var message = {
      sourceName: this.sourceName,
      targetName: this.targetName,
      action: actionName,
      data: data,
      callbackId: callbackId
    };
    var capability = createPromiseCapability();
    this.callbacksCapabilities[callbackId] = capability;
    try {
      this.postMessage(message, transfers);
    } catch (e) {
      capability.reject(e);
    }
    return capability.promise;
  },
  /**
   * Sends raw message to the comObj.
   * @private
   * @param message {Object} Raw message.
   * @param transfers List of transfers/ArrayBuffers, or undefined.
   */
  postMessage: function (message, transfers) {
    if (transfers && this.postMessageTransfers) {
      this.comObj.postMessage(message, transfers);
    } else {
      this.comObj.postMessage(message);
    }
  },

  destroy: function () {
    this.comObj.removeEventListener('message', this._onComObjOnMessage);
  }
};

function loadJpegStream(id, imageUrl, objs) {
  var img = new Image();
  img.onload = (function loadJpegStream_onloadClosure() {
    objs.resolve(id, img);
  });
  img.onerror = (function loadJpegStream_onerrorClosure() {
    objs.resolve(id, null);
    warn('Error during JPEG image loading');
  });
  img.src = imageUrl;
}

  // Polyfill from https://github.com/Polymer/URL
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */
(function checkURLConstructor(scope) {
  /* jshint ignore:start */

  // feature detect for URL constructor
  var hasWorkingUrl = false;
  try {
    if (typeof URL === 'function' &&
        typeof URL.prototype === 'object' &&
        ('origin' in URL.prototype)) {
      var u = new URL('b', 'http://a');
      u.pathname = 'c%20d';
      hasWorkingUrl = u.href === 'http://a/c%20d';
    }
  } catch(e) { }

  if (hasWorkingUrl)
    return;

  var relative = Object.create(null);
  relative['ftp'] = 21;
  relative['file'] = 0;
  relative['gopher'] = 70;
  relative['http'] = 80;
  relative['https'] = 443;
  relative['ws'] = 80;
  relative['wss'] = 443;

  var relativePathDotMapping = Object.create(null);
  relativePathDotMapping['%2e'] = '.';
  relativePathDotMapping['.%2e'] = '..';
  relativePathDotMapping['%2e.'] = '..';
  relativePathDotMapping['%2e%2e'] = '..';

  function isRelativeScheme(scheme) {
    return relative[scheme] !== undefined;
  }

  function invalid() {
    clear.call(this);
    this._isInvalid = true;
  }

  function IDNAToASCII(h) {
    if ('' == h) {
      invalid.call(this)
    }
    // XXX
    return h.toLowerCase()
  }

  function percentEscape(c) {
    var unicode = c.charCodeAt(0);
    if (unicode > 0x20 &&
       unicode < 0x7F &&
       // " # < > ? `
       [0x22, 0x23, 0x3C, 0x3E, 0x3F, 0x60].indexOf(unicode) == -1
      ) {
      return c;
    }
    return encodeURIComponent(c);
  }

  function percentEscapeQuery(c) {
    // XXX This actually needs to encode c using encoding and then
    // convert the bytes one-by-one.

    var unicode = c.charCodeAt(0);
    if (unicode > 0x20 &&
       unicode < 0x7F &&
       // " # < > ` (do not escape '?')
       [0x22, 0x23, 0x3C, 0x3E, 0x60].indexOf(unicode) == -1
      ) {
      return c;
    }
    return encodeURIComponent(c);
  }

  var EOF = undefined,
      ALPHA = /[a-zA-Z]/,
      ALPHANUMERIC = /[a-zA-Z0-9\+\-\.]/;

  function parse(input, stateOverride, base) {
    function err(message) {
      errors.push(message)
    }

    var state = stateOverride || 'scheme start',
        cursor = 0,
        buffer = '',
        seenAt = false,
        seenBracket = false,
        errors = [];

    loop: while ((input[cursor - 1] != EOF || cursor == 0) && !this._isInvalid) {
      var c = input[cursor];
      switch (state) {
        case 'scheme start':
          if (c && ALPHA.test(c)) {
            buffer += c.toLowerCase(); // ASCII-safe
            state = 'scheme';
          } else if (!stateOverride) {
            buffer = '';
            state = 'no scheme';
            continue;
          } else {
            err('Invalid scheme.');
            break loop;
          }
          break;

        case 'scheme':
          if (c && ALPHANUMERIC.test(c)) {
            buffer += c.toLowerCase(); // ASCII-safe
          } else if (':' == c) {
            this._scheme = buffer;
            buffer = '';
            if (stateOverride) {
              break loop;
            }
            if (isRelativeScheme(this._scheme)) {
              this._isRelative = true;
            }
            if ('file' == this._scheme) {
              state = 'relative';
            } else if (this._isRelative && base && base._scheme == this._scheme) {
              state = 'relative or authority';
            } else if (this._isRelative) {
              state = 'authority first slash';
            } else {
              state = 'scheme data';
            }
          } else if (!stateOverride) {
            buffer = '';
            cursor = 0;
            state = 'no scheme';
            continue;
          } else if (EOF == c) {
            break loop;
          } else {
            err('Code point not allowed in scheme: ' + c)
            break loop;
          }
          break;

        case 'scheme data':
          if ('?' == c) {
            this._query = '?';
            state = 'query';
          } else if ('#' == c) {
            this._fragment = '#';
            state = 'fragment';
          } else {
            // XXX error handling
            if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
              this._schemeData += percentEscape(c);
            }
          }
          break;

        case 'no scheme':
          if (!base || !(isRelativeScheme(base._scheme))) {
            err('Missing scheme.');
            invalid.call(this);
          } else {
            state = 'relative';
            continue;
          }
          break;

        case 'relative or authority':
          if ('/' == c && '/' == input[cursor+1]) {
            state = 'authority ignore slashes';
          } else {
            err('Expected /, got: ' + c);
            state = 'relative';
            continue
          }
          break;

        case 'relative':
          this._isRelative = true;
          if ('file' != this._scheme)
            this._scheme = base._scheme;
          if (EOF == c) {
            this._host = base._host;
            this._port = base._port;
            this._path = base._path.slice();
            this._query = base._query;
            this._username = base._username;
            this._password = base._password;
            break loop;
          } else if ('/' == c || '\\' == c) {
            if ('\\' == c)
              err('\\ is an invalid code point.');
            state = 'relative slash';
          } else if ('?' == c) {
            this._host = base._host;
            this._port = base._port;
            this._path = base._path.slice();
            this._query = '?';
            this._username = base._username;
            this._password = base._password;
            state = 'query';
          } else if ('#' == c) {
            this._host = base._host;
            this._port = base._port;
            this._path = base._path.slice();
            this._query = base._query;
            this._fragment = '#';
            this._username = base._username;
            this._password = base._password;
            state = 'fragment';
          } else {
            var nextC = input[cursor+1]
            var nextNextC = input[cursor+2]
            if (
              'file' != this._scheme || !ALPHA.test(c) ||
              (nextC != ':' && nextC != '|') ||
              (EOF != nextNextC && '/' != nextNextC && '\\' != nextNextC && '?' != nextNextC && '#' != nextNextC)) {
              this._host = base._host;
              this._port = base._port;
              this._username = base._username;
              this._password = base._password;
              this._path = base._path.slice();
              this._path.pop();
            }
            state = 'relative path';
            continue;
          }
          break;

        case 'relative slash':
          if ('/' == c || '\\' == c) {
            if ('\\' == c) {
              err('\\ is an invalid code point.');
            }
            if ('file' == this._scheme) {
              state = 'file host';
            } else {
              state = 'authority ignore slashes';
            }
          } else {
            if ('file' != this._scheme) {
              this._host = base._host;
              this._port = base._port;
              this._username = base._username;
              this._password = base._password;
            }
            state = 'relative path';
            continue;
          }
          break;

        case 'authority first slash':
          if ('/' == c) {
            state = 'authority second slash';
          } else {
            err("Expected '/', got: " + c);
            state = 'authority ignore slashes';
            continue;
          }
          break;

        case 'authority second slash':
          state = 'authority ignore slashes';
          if ('/' != c) {
            err("Expected '/', got: " + c);
            continue;
          }
          break;

        case 'authority ignore slashes':
          if ('/' != c && '\\' != c) {
            state = 'authority';
            continue;
          } else {
            err('Expected authority, got: ' + c);
          }
          break;

        case 'authority':
          if ('@' == c) {
            if (seenAt) {
              err('@ already seen.');
              buffer += '%40';
            }
            seenAt = true;
            for (var i = 0; i < buffer.length; i++) {
              var cp = buffer[i];
              if ('\t' == cp || '\n' == cp || '\r' == cp) {
                err('Invalid whitespace in authority.');
                continue;
              }
              // XXX check URL code points
              if (':' == cp && null === this._password) {
                this._password = '';
                continue;
              }
              var tempC = percentEscape(cp);
              (null !== this._password) ? this._password += tempC : this._username += tempC;
            }
            buffer = '';
          } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
            cursor -= buffer.length;
            buffer = '';
            state = 'host';
            continue;
          } else {
            buffer += c;
          }
          break;

        case 'file host':
          if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
            if (buffer.length == 2 && ALPHA.test(buffer[0]) && (buffer[1] == ':' || buffer[1] == '|')) {
              state = 'relative path';
            } else if (buffer.length == 0) {
              state = 'relative path start';
            } else {
              this._host = IDNAToASCII.call(this, buffer);
              buffer = '';
              state = 'relative path start';
            }
            continue;
          } else if ('\t' == c || '\n' == c || '\r' == c) {
            err('Invalid whitespace in file host.');
          } else {
            buffer += c;
          }
          break;

        case 'host':
        case 'hostname':
          if (':' == c && !seenBracket) {
            // XXX host parsing
            this._host = IDNAToASCII.call(this, buffer);
            buffer = '';
            state = 'port';
            if ('hostname' == stateOverride) {
              break loop;
            }
          } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
            this._host = IDNAToASCII.call(this, buffer);
            buffer = '';
            state = 'relative path start';
            if (stateOverride) {
              break loop;
            }
            continue;
          } else if ('\t' != c && '\n' != c && '\r' != c) {
            if ('[' == c) {
              seenBracket = true;
            } else if (']' == c) {
              seenBracket = false;
            }
            buffer += c;
          } else {
            err('Invalid code point in host/hostname: ' + c);
          }
          break;

        case 'port':
          if (/[0-9]/.test(c)) {
            buffer += c;
          } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c || stateOverride) {
            if ('' != buffer) {
              var temp = parseInt(buffer, 10);
              if (temp != relative[this._scheme]) {
                this._port = temp + '';
              }
              buffer = '';
            }
            if (stateOverride) {
              break loop;
            }
            state = 'relative path start';
            continue;
          } else if ('\t' == c || '\n' == c || '\r' == c) {
            err('Invalid code point in port: ' + c);
          } else {
            invalid.call(this);
          }
          break;

        case 'relative path start':
          if ('\\' == c)
            err("'\\' not allowed in path.");
          state = 'relative path';
          if ('/' != c && '\\' != c) {
            continue;
          }
          break;

        case 'relative path':
          if (EOF == c || '/' == c || '\\' == c || (!stateOverride && ('?' == c || '#' == c))) {
            if ('\\' == c) {
              err('\\ not allowed in relative path.');
            }
            var tmp;
            if (tmp = relativePathDotMapping[buffer.toLowerCase()]) {
              buffer = tmp;
            }
            if ('..' == buffer) {
              this._path.pop();
              if ('/' != c && '\\' != c) {
                this._path.push('');
              }
            } else if ('.' == buffer && '/' != c && '\\' != c) {
              this._path.push('');
            } else if ('.' != buffer) {
              if ('file' == this._scheme && this._path.length == 0 && buffer.length == 2 && ALPHA.test(buffer[0]) && buffer[1] == '|') {
                buffer = buffer[0] + ':';
              }
              this._path.push(buffer);
            }
            buffer = '';
            if ('?' == c) {
              this._query = '?';
              state = 'query';
            } else if ('#' == c) {
              this._fragment = '#';
              state = 'fragment';
            }
          } else if ('\t' != c && '\n' != c && '\r' != c) {
            buffer += percentEscape(c);
          }
          break;

        case 'query':
          if (!stateOverride && '#' == c) {
            this._fragment = '#';
            state = 'fragment';
          } else if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
            this._query += percentEscapeQuery(c);
          }
          break;

        case 'fragment':
          if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
            this._fragment += c;
          }
          break;
      }

      cursor++;
    }
  }

  function clear() {
    this._scheme = '';
    this._schemeData = '';
    this._username = '';
    this._password = null;
    this._host = '';
    this._port = '';
    this._path = [];
    this._query = '';
    this._fragment = '';
    this._isInvalid = false;
    this._isRelative = false;
  }

  // Does not process domain names or IP addresses.
  // Does not handle encoding for the query parameter.
  function jURL(url, base /* , encoding */) {
    if (base !== undefined && !(base instanceof jURL))
      base = new jURL(String(base));

    this._url = url;
    clear.call(this);

    var input = url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, '');
    // encoding = encoding || 'utf-8'

    parse.call(this, input, null, base);
  }

  jURL.prototype = {
    toString: function() {
      return this.href;
    },
    get href() {
      if (this._isInvalid)
        return this._url;

      var authority = '';
      if ('' != this._username || null != this._password) {
        authority = this._username +
            (null != this._password ? ':' + this._password : '') + '@';
      }

      return this.protocol +
          (this._isRelative ? '//' + authority + this.host : '') +
          this.pathname + this._query + this._fragment;
    },
    set href(href) {
      clear.call(this);
      parse.call(this, href);
    },

    get protocol() {
      return this._scheme + ':';
    },
    set protocol(protocol) {
      if (this._isInvalid)
        return;
      parse.call(this, protocol + ':', 'scheme start');
    },

    get host() {
      return this._isInvalid ? '' : this._port ?
          this._host + ':' + this._port : this._host;
    },
    set host(host) {
      if (this._isInvalid || !this._isRelative)
        return;
      parse.call(this, host, 'host');
    },

    get hostname() {
      return this._host;
    },
    set hostname(hostname) {
      if (this._isInvalid || !this._isRelative)
        return;
      parse.call(this, hostname, 'hostname');
    },

    get port() {
      return this._port;
    },
    set port(port) {
      if (this._isInvalid || !this._isRelative)
        return;
      parse.call(this, port, 'port');
    },

    get pathname() {
      return this._isInvalid ? '' : this._isRelative ?
          '/' + this._path.join('/') : this._schemeData;
    },
    set pathname(pathname) {
      if (this._isInvalid || !this._isRelative)
        return;
      this._path = [];
      parse.call(this, pathname, 'relative path start');
    },

    get search() {
      return this._isInvalid || !this._query || '?' == this._query ?
          '' : this._query;
    },
    set search(search) {
      if (this._isInvalid || !this._isRelative)
        return;
      this._query = '?';
      if ('?' == search[0])
        search = search.slice(1);
      parse.call(this, search, 'query');
    },

    get hash() {
      return this._isInvalid || !this._fragment || '#' == this._fragment ?
          '' : this._fragment;
    },
    set hash(hash) {
      if (this._isInvalid)
        return;
      this._fragment = '#';
      if ('#' == hash[0])
        hash = hash.slice(1);
      parse.call(this, hash, 'fragment');
    },

    get origin() {
      var host;
      if (this._isInvalid || !this._scheme) {
        return '';
      }
      // javascript: Gecko returns String(""), WebKit/Blink String("null")
      // Gecko throws error for "data://"
      // data: Gecko returns "", Blink returns "data://", WebKit returns "null"
      // Gecko returns String("") for file: mailto:
      // WebKit/Blink returns String("SCHEME://") for file: mailto:
      switch (this._scheme) {
        case 'data':
        case 'file':
        case 'javascript':
        case 'mailto':
          return 'null';
      }
      host = this.host;
      if (!host) {
        return '';
      }
      return this._scheme + '://' + host;
    }
  };

  // Copy over the static methods
  var OriginalURL = scope.URL;
  if (OriginalURL) {
    jURL.createObjectURL = function(blob) {
      // IE extension allows a second optional options argument.
      // http://msdn.microsoft.com/en-us/library/ie/hh772302(v=vs.85).aspx
      return OriginalURL.createObjectURL.apply(OriginalURL, arguments);
    };
    jURL.revokeObjectURL = function(url) {
      OriginalURL.revokeObjectURL(url);
    };
  }

  scope.URL = jURL;
  /* jshint ignore:end */
})(globalScope);

exports.FONT_IDENTITY_MATRIX = FONT_IDENTITY_MATRIX;
exports.IDENTITY_MATRIX = IDENTITY_MATRIX;
exports.OPS = OPS;
exports.UNSUPPORTED_FEATURES = UNSUPPORTED_FEATURES;
exports.AnnotationBorderStyleType = AnnotationBorderStyleType;
exports.AnnotationFlag = AnnotationFlag;
exports.AnnotationType = AnnotationType;
exports.FontType = FontType;
exports.ImageKind = ImageKind;
exports.InvalidPDFException = InvalidPDFException;
exports.LinkTarget = LinkTarget;
exports.LinkTargetStringMap = LinkTargetStringMap;
exports.MessageHandler = MessageHandler;
exports.MissingDataException = MissingDataException;
exports.MissingPDFException = MissingPDFException;
exports.NotImplementedException = NotImplementedException;
exports.PasswordException = PasswordException;
exports.PasswordResponses = PasswordResponses;
exports.StatTimer = StatTimer;
exports.StreamType = StreamType;
exports.TextRenderingMode = TextRenderingMode;
exports.UnexpectedResponseException = UnexpectedResponseException;
exports.UnknownErrorException = UnknownErrorException;
exports.Util = Util;
exports.XRefParseException = XRefParseException;
exports.assert = assert;
exports.bytesToString = bytesToString;
exports.combineUrl = combineUrl;
exports.createPromiseCapability = createPromiseCapability;
exports.deprecated = deprecated;
exports.error = error;
exports.info = info;
exports.isArray = isArray;
exports.isArrayBuffer = isArrayBuffer;
exports.isBool = isBool;
exports.isEmptyObj = isEmptyObj;
exports.isExternalLinkTargetSet = isExternalLinkTargetSet;
exports.isInt = isInt;
exports.isNum = isNum;
exports.isString = isString;
exports.isValidUrl = isValidUrl;
exports.addLinkAttributes = addLinkAttributes;
exports.loadJpegStream = loadJpegStream;
exports.log2 = log2;
exports.readInt8 = readInt8;
exports.readUint16 = readUint16;
exports.readUint32 = readUint32;
exports.removeNullCharacters = removeNullCharacters;
exports.shadow = shadow;
exports.string32 = string32;
exports.stringToBytes = stringToBytes;
exports.stringToPDFString = stringToPDFString;
exports.stringToUTF8String = stringToUTF8String;
exports.utf8StringToString = utf8StringToString;
exports.warn = warn;
}));


(function (root, factory) {
  {
    factory((root.pdfjsDisplayAnnotationLayer = {}), root.pdfjsSharedUtil,
      root.pdfjsDisplayDOMUtils);
  }
}(this, function (exports, sharedUtil, displayDOMUtils) {

var AnnotationBorderStyleType = sharedUtil.AnnotationBorderStyleType;
var AnnotationType = sharedUtil.AnnotationType;
var Util = sharedUtil.Util;
var addLinkAttributes = sharedUtil.addLinkAttributes;
var warn = sharedUtil.warn;
var CustomStyle = displayDOMUtils.CustomStyle;

/**
 * @typedef {Object} AnnotationElementParameters
 * @property {Object} data
 * @property {HTMLDivElement} layer
 * @property {PDFPage} page
 * @property {PageViewport} viewport
 * @property {IPDFLinkService} linkService
 */

/**
 * @class
 * @alias AnnotationElementFactory
 */
function AnnotationElementFactory() {}
AnnotationElementFactory.prototype =
    /** @lends AnnotationElementFactory.prototype */ {
  /**
   * @param {AnnotationElementParameters} parameters
   * @returns {AnnotationElement}
   */
  create: function AnnotationElementFactory_create(parameters) {
    var subtype = parameters.data.annotationType;

    switch (subtype) {
      case AnnotationType.LINK:
        return new LinkAnnotationElement(parameters);

      case AnnotationType.TEXT:
        return new TextAnnotationElement(parameters);

      case AnnotationType.WIDGET:
        return new WidgetAnnotationElement(parameters);

      case AnnotationType.POPUP:
        return new PopupAnnotationElement(parameters);

      case AnnotationType.HIGHLIGHT:
        return new HighlightAnnotationElement(parameters);

      case AnnotationType.UNDERLINE:
        return new UnderlineAnnotationElement(parameters);

      case AnnotationType.SQUIGGLY:
        return new SquigglyAnnotationElement(parameters);

      case AnnotationType.STRIKEOUT:
        return new StrikeOutAnnotationElement(parameters);

      default:
        throw new Error('Unimplemented annotation type "' + subtype + '"');
    }
  }
};

/**
 * @class
 * @alias AnnotationElement
 */
var AnnotationElement = (function AnnotationElementClosure() {
  function AnnotationElement(parameters) {
    this.data = parameters.data;
    this.layer = parameters.layer;
    this.page = parameters.page;
    this.viewport = parameters.viewport;
    this.linkService = parameters.linkService;

    this.container = this._createContainer();
  }

  AnnotationElement.prototype = /** @lends AnnotationElement.prototype */ {
    /**
     * Create an empty container for the annotation's HTML element.
     *
     * @private
     * @memberof AnnotationElement
     * @returns {HTMLSectionElement}
     */
    _createContainer: function AnnotationElement_createContainer() {
      var data = this.data, page = this.page, viewport = this.viewport;
      var container = document.createElement('section');
      var width = data.rect[2] - data.rect[0];
      var height = data.rect[3] - data.rect[1];

      container.setAttribute('data-annotation-id', data.id);

      // Do *not* modify `data.rect`, since that will corrupt the annotation
      // position on subsequent calls to `_createContainer` (see issue 6804).
      var rect = Util.normalizeRect([
        data.rect[0],
        page.view[3] - data.rect[1] + page.view[1],
        data.rect[2],
        page.view[3] - data.rect[3] + page.view[1]
      ]);

      CustomStyle.setProp('transform', container,
                          'matrix(' + viewport.transform.join(',') + ')');
      CustomStyle.setProp('transformOrigin', container,
                          -rect[0] + 'px ' + -rect[1] + 'px');

      if (data.borderStyle.width > 0) {
        container.style.borderWidth = data.borderStyle.width + 'px';
        if (data.borderStyle.style !== AnnotationBorderStyleType.UNDERLINE) {
          // Underline styles only have a bottom border, so we do not need
          // to adjust for all borders. This yields a similar result as
          // Adobe Acrobat/Reader.
          width = width - 2 * data.borderStyle.width;
          height = height - 2 * data.borderStyle.width;
        }

        var horizontalRadius = data.borderStyle.horizontalCornerRadius;
        var verticalRadius = data.borderStyle.verticalCornerRadius;
        if (horizontalRadius > 0 || verticalRadius > 0) {
          var radius = horizontalRadius + 'px / ' + verticalRadius + 'px';
          CustomStyle.setProp('borderRadius', container, radius);
        }

        switch (data.borderStyle.style) {
          case AnnotationBorderStyleType.SOLID:
            container.style.borderStyle = 'solid';
            break;

          case AnnotationBorderStyleType.DASHED:
            container.style.borderStyle = 'dashed';
            break;

          case AnnotationBorderStyleType.BEVELED:
            warn('Unimplemented border style: beveled');
            break;

          case AnnotationBorderStyleType.INSET:
            warn('Unimplemented border style: inset');
            break;

          case AnnotationBorderStyleType.UNDERLINE:
            container.style.borderBottomStyle = 'solid';
            break;

          default:
            break;
        }

        if (data.color) {
          container.style.borderColor =
            Util.makeCssRgb(data.color[0] | 0,
                            data.color[1] | 0,
                            data.color[2] | 0);
        } else {
          // Transparent (invisible) border, so do not draw it at all.
          container.style.borderWidth = 0;
        }
      }

      container.style.left = rect[0] + 'px';
      container.style.top = rect[1] + 'px';

      container.style.width = width + 'px';
      container.style.height = height + 'px';

      return container;
    },

    /**
     * Render the annotation's HTML element in the empty container.
     *
     * @public
     * @memberof AnnotationElement
     */
    render: function AnnotationElement_render() {
      throw new Error('Abstract method AnnotationElement.render called');
    }
  };

  return AnnotationElement;
})();

/**
 * @class
 * @alias LinkAnnotationElement
 */
var LinkAnnotationElement = (function LinkAnnotationElementClosure() {
  function LinkAnnotationElement(parameters) {
    AnnotationElement.call(this, parameters);
  }

  Util.inherit(LinkAnnotationElement, AnnotationElement, {
    /**
     * Render the link annotation's HTML element in the empty container.
     *
     * @public
     * @memberof LinkAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render: function LinkAnnotationElement_render() {
      this.container.className = 'linkAnnotation';

      var link = document.createElement('a');
      addLinkAttributes(link, { url: this.data.url });

      if (!this.data.url) {
        if (this.data.action) {
          this._bindNamedAction(link, this.data.action);
        } else {
          this._bindLink(link, ('dest' in this.data) ? this.data.dest : null);
        }
      }

      this.container.appendChild(link);
      return this.container;
    },

    /**
     * Bind internal links to the link element.
     *
     * @private
     * @param {Object} link
     * @param {Object} destination
     * @memberof LinkAnnotationElement
     */
    _bindLink: function LinkAnnotationElement_bindLink(link, destination) {
      var self = this;

      link.href = this.linkService.getDestinationHash(destination);
      link.onclick = function() {
        if (destination) {
          self.linkService.navigateTo(destination);
        }
        return false;
      };
      if (destination) {
        link.className = 'internalLink';
      }
    },

    /**
     * Bind named actions to the link element.
     *
     * @private
     * @param {Object} link
     * @param {Object} action
     * @memberof LinkAnnotationElement
     */
    _bindNamedAction:
        function LinkAnnotationElement_bindNamedAction(link, action) {
      var self = this;

      link.href = this.linkService.getAnchorUrl('');
      link.onclick = function() {
        self.linkService.executeNamedAction(action);
        return false;
      };
      link.className = 'internalLink';
    }
  });

  return LinkAnnotationElement;
})();

/**
 * @class
 * @alias TextAnnotationElement
 */
var TextAnnotationElement = (function TextAnnotationElementClosure() {
  function TextAnnotationElement(parameters) {
    AnnotationElement.call(this, parameters);
  }

  Util.inherit(TextAnnotationElement, AnnotationElement, {
    /**
     * Render the text annotation's HTML element in the empty container.
     *
     * @public
     * @memberof TextAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render: function TextAnnotationElement_render() {
      this.container.className = 'textAnnotation';

      var image = document.createElement('img');
      image.style.height = this.container.style.height;
      image.style.width = this.container.style.width;
      image.src = PDFJS.imageResourcesPath + 'annotation-' +
        this.data.name.toLowerCase() + '.svg';
      image.alt = '[{{type}} Annotation]';
      image.dataset.l10nId = 'text_annotation_type';
      image.dataset.l10nArgs = JSON.stringify({type: this.data.name});

      if (!this.data.hasPopup) {
        var popupElement = new PopupElement({
          container: this.container,
          trigger: image,
          color: this.data.color,
          title: this.data.title,
          contents: this.data.contents,
          hideWrapper: true
        });
        var popup = popupElement.render();

        // Position the popup next to the Text annotation's container.
        popup.style.left = image.style.width;

        this.container.appendChild(popup);
      }

      this.container.appendChild(image);
      return this.container;
    }
  });

  return TextAnnotationElement;
})();

/**
 * @class
 * @alias WidgetAnnotationElement
 */
var WidgetAnnotationElement = (function WidgetAnnotationElementClosure() {
  function WidgetAnnotationElement(parameters) {
    AnnotationElement.call(this, parameters);
  }

  Util.inherit(WidgetAnnotationElement, AnnotationElement, {
    /**
     * Render the widget annotation's HTML element in the empty container.
     *
     * @public
     * @memberof WidgetAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render: function WidgetAnnotationElement_render() {
      var content = document.createElement('div');
      content.textContent = this.data.fieldValue;
      var textAlignment = this.data.textAlignment;
      content.style.textAlign = ['left', 'center', 'right'][textAlignment];
      content.style.verticalAlign = 'middle';
      content.style.display = 'table-cell';

      var font = (this.data.fontRefName ?
        this.page.commonObjs.getData(this.data.fontRefName) : null);
      this._setTextStyle(content, font);

      this.container.appendChild(content);
      return this.container;
    },

    /**
     * Apply text styles to the text in the element.
     *
     * @private
     * @param {HTMLDivElement} element
     * @param {Object} font
     * @memberof WidgetAnnotationElement
     */
    _setTextStyle:
        function WidgetAnnotationElement_setTextStyle(element, font) {
      // TODO: This duplicates some of the logic in CanvasGraphics.setFont().
      var style = element.style;
      style.fontSize = this.data.fontSize + 'px';
      style.direction = (this.data.fontDirection < 0 ? 'rtl': 'ltr');

      if (!font) {
        return;
      }

      style.fontWeight = (font.black ?
        (font.bold ? '900' : 'bold') :
        (font.bold ? 'bold' : 'normal'));
      style.fontStyle = (font.italic ? 'italic' : 'normal');

      // Use a reasonable default font if the font doesn't specify a fallback.
      var fontFamily = font.loadedName ? '"' + font.loadedName + '", ' : '';
      var fallbackName = font.fallbackName || 'Helvetica, sans-serif';
      style.fontFamily = fontFamily + fallbackName;
    }
  });

  return WidgetAnnotationElement;
})();

/**
 * @class
 * @alias PopupAnnotationElement
 */
var PopupAnnotationElement = (function PopupAnnotationElementClosure() {
  function PopupAnnotationElement(parameters) {
    AnnotationElement.call(this, parameters);
  }

  Util.inherit(PopupAnnotationElement, AnnotationElement, {
    /**
     * Render the popup annotation's HTML element in the empty container.
     *
     * @public
     * @memberof PopupAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render: function PopupAnnotationElement_render() {
      this.container.className = 'popupAnnotation';

      var selector = '[data-annotation-id="' + this.data.parentId + '"]';
      var parentElement = this.layer.querySelector(selector);
      if (!parentElement) {
        return this.container;
      }

      var popup = new PopupElement({
        container: this.container,
        trigger: parentElement,
        color: this.data.color,
        title: this.data.title,
        contents: this.data.contents
      });

      // Position the popup next to the parent annotation's container.
      // PDF viewers ignore a popup annotation's rectangle.
      var parentLeft = parseFloat(parentElement.style.left);
      var parentWidth = parseFloat(parentElement.style.width);
      CustomStyle.setProp('transformOrigin', this.container,
                          -(parentLeft + parentWidth) + 'px -' +
                          parentElement.style.top);
      this.container.style.left = (parentLeft + parentWidth) + 'px';

      this.container.appendChild(popup.render());
      return this.container;
    }
  });

  return PopupAnnotationElement;
})();

/**
 * @class
 * @alias PopupElement
 */
var PopupElement = (function PopupElementClosure() {
  var BACKGROUND_ENLIGHT = 0.7;

  function PopupElement(parameters) {
    this.container = parameters.container;
    this.trigger = parameters.trigger;
    this.color = parameters.color;
    this.title = parameters.title;
    this.contents = parameters.contents;
    this.hideWrapper = parameters.hideWrapper || false;

    this.pinned = false;
  }

  PopupElement.prototype = /** @lends PopupElement.prototype */ {
    /**
     * Render the popup's HTML element.
     *
     * @public
     * @memberof PopupElement
     * @returns {HTMLSectionElement}
     */
    render: function PopupElement_render() {
      var wrapper = document.createElement('div');
      wrapper.className = 'popupWrapper';

      // For Popup annotations we hide the entire section because it contains
      // only the popup. However, for Text annotations without a separate Popup
      // annotation, we cannot hide the entire container as the image would
      // disappear too. In that special case, hiding the wrapper suffices.
      this.hideElement = (this.hideWrapper ? wrapper : this.container);
      this.hideElement.setAttribute('hidden', true);

      var popup = document.createElement('div');
      popup.className = 'popup';

      var color = this.color;
      if (color) {
        // Enlighten the color.
        var r = BACKGROUND_ENLIGHT * (255 - color[0]) + color[0];
        var g = BACKGROUND_ENLIGHT * (255 - color[1]) + color[1];
        var b = BACKGROUND_ENLIGHT * (255 - color[2]) + color[2];
        popup.style.backgroundColor = Util.makeCssRgb(r | 0, g | 0, b | 0);
      }

      var contents = this._formatContents(this.contents);
      var title = document.createElement('h1');
      title.textContent = this.title;

      // Attach the event listeners to the trigger element.
      this.trigger.addEventListener('click', this._toggle.bind(this));
      this.trigger.addEventListener('mouseover', this._show.bind(this, false));
      this.trigger.addEventListener('mouseout', this._hide.bind(this, false));
      popup.addEventListener('click', this._hide.bind(this, true));

      popup.appendChild(title);
      popup.appendChild(contents);
      wrapper.appendChild(popup);
      return wrapper;
    },

    /**
     * Format the contents of the popup by adding newlines where necessary.
     *
     * @private
     * @param {string} contents
     * @memberof PopupElement
     * @returns {HTMLParagraphElement}
     */
    _formatContents: function PopupElement_formatContents(contents) {
      var p = document.createElement('p');
      var lines = contents.split(/(?:\r\n?|\n)/);
      for (var i = 0, ii = lines.length; i < ii; ++i) {
        var line = lines[i];
        p.appendChild(document.createTextNode(line));
        if (i < (ii - 1)) {
          p.appendChild(document.createElement('br'));
        }
      }
      return p;
    },

    /**
     * Toggle the visibility of the popup.
     *
     * @private
     * @memberof PopupElement
     */
    _toggle: function PopupElement_toggle() {
      if (this.pinned) {
        this._hide(true);
      } else {
        this._show(true);
      }
    },

    /**
     * Show the popup.
     *
     * @private
     * @param {boolean} pin
     * @memberof PopupElement
     */
    _show: function PopupElement_show(pin) {
      if (pin) {
        this.pinned = true;
      }
      if (this.hideElement.hasAttribute('hidden')) {
        this.hideElement.removeAttribute('hidden');
        this.container.style.zIndex += 1;
      }
    },

    /**
     * Hide the popup.
     *
     * @private
     * @param {boolean} unpin
     * @memberof PopupElement
     */
    _hide: function PopupElement_hide(unpin) {
      if (unpin) {
        this.pinned = false;
      }
      if (!this.hideElement.hasAttribute('hidden') && !this.pinned) {
        this.hideElement.setAttribute('hidden', true);
        this.container.style.zIndex -= 1;
      }
    }
  };

  return PopupElement;
})();

/**
 * @class
 * @alias HighlightAnnotationElement
 */
var HighlightAnnotationElement = (
    function HighlightAnnotationElementClosure() {
  function HighlightAnnotationElement(parameters) {
    AnnotationElement.call(this, parameters);
  }

  Util.inherit(HighlightAnnotationElement, AnnotationElement, {
    /**
     * Render the highlight annotation's HTML element in the empty container.
     *
     * @public
     * @memberof HighlightAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render: function HighlightAnnotationElement_render() {
      this.container.className = 'highlightAnnotation';
      return this.container;
    }
  });

  return HighlightAnnotationElement;
})();

/**
 * @class
 * @alias UnderlineAnnotationElement
 */
var UnderlineAnnotationElement = (
    function UnderlineAnnotationElementClosure() {
  function UnderlineAnnotationElement(parameters) {
    AnnotationElement.call(this, parameters);
  }

  Util.inherit(UnderlineAnnotationElement, AnnotationElement, {
    /**
     * Render the underline annotation's HTML element in the empty container.
     *
     * @public
     * @memberof UnderlineAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render: function UnderlineAnnotationElement_render() {
      this.container.className = 'underlineAnnotation';
      return this.container;
    }
  });

  return UnderlineAnnotationElement;
})();

/**
 * @class
 * @alias SquigglyAnnotationElement
 */
var SquigglyAnnotationElement = (function SquigglyAnnotationElementClosure() {
  function SquigglyAnnotationElement(parameters) {
    AnnotationElement.call(this, parameters);
  }

  Util.inherit(SquigglyAnnotationElement, AnnotationElement, {
    /**
     * Render the squiggly annotation's HTML element in the empty container.
     *
     * @public
     * @memberof SquigglyAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render: function SquigglyAnnotationElement_render() {
      this.container.className = 'squigglyAnnotation';
      return this.container;
    }
  });

  return SquigglyAnnotationElement;
})();

/**
 * @class
 * @alias StrikeOutAnnotationElement
 */
var StrikeOutAnnotationElement = (
    function StrikeOutAnnotationElementClosure() {
  function StrikeOutAnnotationElement(parameters) {
    AnnotationElement.call(this, parameters);
  }

  Util.inherit(StrikeOutAnnotationElement, AnnotationElement, {
    /**
     * Render the strikeout annotation's HTML element in the empty container.
     *
     * @public
     * @memberof StrikeOutAnnotationElement
     * @returns {HTMLSectionElement}
     */
    render: function StrikeOutAnnotationElement_render() {
      this.container.className = 'strikeoutAnnotation';
      return this.container;
    }
  });

  return StrikeOutAnnotationElement;
})();

/**
 * @typedef {Object} AnnotationLayerParameters
 * @property {PageViewport} viewport
 * @property {HTMLDivElement} div
 * @property {Array} annotations
 * @property {PDFPage} page
 * @property {IPDFLinkService} linkService
 */

/**
 * @class
 * @alias AnnotationLayer
 */
var AnnotationLayer = (function AnnotationLayerClosure() {
  return {
    /**
     * Render a new annotation layer with all annotation elements.
     *
     * @public
     * @param {AnnotationLayerParameters} parameters
     * @memberof AnnotationLayer
     */
    render: function AnnotationLayer_render(parameters) {
      var annotationElementFactory = new AnnotationElementFactory();

      for (var i = 0, ii = parameters.annotations.length; i < ii; i++) {
        var data = parameters.annotations[i];
        if (!data || !data.hasHtml) {
          continue;
        }

        var properties = {
          data: data,
          layer: parameters.div,
          page: parameters.page,
          viewport: parameters.viewport,
          linkService: parameters.linkService
        };
        var element = annotationElementFactory.create(properties);
        parameters.div.appendChild(element.render());
      }
    },

    /**
     * Update the annotation elements on existing annotation layer.
     *
     * @public
     * @param {AnnotationLayerParameters} parameters
     * @memberof AnnotationLayer
     */
    update: function AnnotationLayer_update(parameters) {
      for (var i = 0, ii = parameters.annotations.length; i < ii; i++) {
        var data = parameters.annotations[i];
        var element = parameters.div.querySelector(
          '[data-annotation-id="' + data.id + '"]');
        if (element) {
          CustomStyle.setProp('transform', element,
            'matrix(' + parameters.viewport.transform.join(',') + ')');
        }
      }
      parameters.div.removeAttribute('hidden');
    }
  };
})();

PDFJS.AnnotationLayer = AnnotationLayer;

exports.AnnotationLayer = AnnotationLayer;
}));


(function (root, factory) {
  {
    factory((root.pdfjsDisplayFontLoader = {}), root.pdfjsSharedUtil,
      root.pdfjsSharedGlobal);
  }
}(this, function (exports, sharedUtil, sharedGlobal) {

var assert = sharedUtil.assert;
var bytesToString = sharedUtil.bytesToString;
var string32 = sharedUtil.string32;
var shadow = sharedUtil.shadow;
var warn = sharedUtil.warn;

var PDFJS = sharedGlobal.PDFJS;
var globalScope = sharedGlobal.globalScope;
var isWorker = sharedGlobal.isWorker;

function FontLoader(docId) {
  this.docId = docId;
  this.styleElement = null;
  this.nativeFontFaces = [];
  this.loadTestFontId = 0;
  this.loadingContext = {
    requests: [],
    nextRequestId: 0
  };
}
FontLoader.prototype = {
  insertRule: function fontLoaderInsertRule(rule) {
    var styleElement = this.styleElement;
    if (!styleElement) {
      styleElement = this.styleElement = document.createElement('style');
      styleElement.id = 'PDFJS_FONT_STYLE_TAG_' + this.docId;
      document.documentElement.getElementsByTagName('head')[0].appendChild(
        styleElement);
    }

    var styleSheet = styleElement.sheet;
    styleSheet.insertRule(rule, styleSheet.cssRules.length);
  },

  clear: function fontLoaderClear() {
    var styleElement = this.styleElement;
    if (styleElement) {
      styleElement.parentNode.removeChild(styleElement);
      styleElement = this.styleElement = null;
    }
    this.nativeFontFaces.forEach(function(nativeFontFace) {
      document.fonts.delete(nativeFontFace);
    });
    this.nativeFontFaces.length = 0;
  },
  get loadTestFont() {
    // This is a CFF font with 1 glyph for '.' that fills its entire width and
    // height.
    return shadow(this, 'loadTestFont', atob(
      'T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQAFQ' +
      'AABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAAALwA' +
      'AAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgAAAAGbm' +
      'FtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1AAsD6AAA' +
      'AADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD6AAAAAAD6A' +
      'ABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACMAooCvAAAAeAA' +
      'MQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4DIP84AFoDIQAAAA' +
      'AAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAAAAEAAQAAAAEAAAAA' +
      'AAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUAAQAAAAEAAAAAAAYAAQ' +
      'AAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgABAAMAAQQJAAMAAgABAAMA' +
      'AQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABYAAAAAAAAAwAAAAMAAAAcAA' +
      'EAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAAAC7////TAAEAAAAAAAABBgAA' +
      'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAA' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAA' +
      'AAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAAAAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgc' +
      'A/gXBIwMAYuL+nz5tQXkD5j3CBLnEQACAQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWF' +
      'hYWFhYWFhYAAABAQAADwACAQEEE/t3Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQA' +
      'AAAAAAABAAAAAMmJbzEAAAAAzgTjFQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAg' +
      'ABAAAAAAAAAAAD6AAAAAAAAA=='
    ));
  },

  addNativeFontFace: function fontLoader_addNativeFontFace(nativeFontFace) {
    this.nativeFontFaces.push(nativeFontFace);
    document.fonts.add(nativeFontFace);
  },

  bind: function fontLoaderBind(fonts, callback) {
    assert(!isWorker, 'bind() shall be called from main thread');

    var rules = [];
    var fontsToLoad = [];
    var fontLoadPromises = [];
    var getNativeFontPromise = function(nativeFontFace) {
      // Return a promise that is always fulfilled, even when the font fails to
      // load.
      return nativeFontFace.loaded.catch(function(e) {
        warn('Failed to load font "' + nativeFontFace.family + '": ' + e);
      });
    };
    for (var i = 0, ii = fonts.length; i < ii; i++) {
      var font = fonts[i];

      // Add the font to the DOM only once or skip if the font
      // is already loaded.
      if (font.attached || font.loading === false) {
        continue;
      }
      font.attached = true;

      if (FontLoader.isFontLoadingAPISupported) {
        var nativeFontFace = font.createNativeFontFace();
        if (nativeFontFace) {
          this.addNativeFontFace(nativeFontFace);
          fontLoadPromises.push(getNativeFontPromise(nativeFontFace));
        }
      } else {
        var rule = font.createFontFaceRule();
        if (rule) {
          this.insertRule(rule);
          rules.push(rule);
          fontsToLoad.push(font);
        }
      }
    }

    var request = this.queueLoadingCallback(callback);
    if (FontLoader.isFontLoadingAPISupported) {
      Promise.all(fontLoadPromises).then(function() {
        request.complete();
      });
    } else if (rules.length > 0 && !FontLoader.isSyncFontLoadingSupported) {
      this.prepareFontLoadEvent(rules, fontsToLoad, request);
    } else {
      request.complete();
    }
  },

  queueLoadingCallback: function FontLoader_queueLoadingCallback(callback) {
    function LoadLoader_completeRequest() {
      assert(!request.end, 'completeRequest() cannot be called twice');
      request.end = Date.now();

      // sending all completed requests in order how they were queued
      while (context.requests.length > 0 && context.requests[0].end) {
        var otherRequest = context.requests.shift();
        setTimeout(otherRequest.callback, 0);
      }
    }

    var context = this.loadingContext;
    var requestId = 'pdfjs-font-loading-' + (context.nextRequestId++);
    var request = {
      id: requestId,
      complete: LoadLoader_completeRequest,
      callback: callback,
      started: Date.now()
    };
    context.requests.push(request);
    return request;
  },

  prepareFontLoadEvent: function fontLoaderPrepareFontLoadEvent(rules,
                                                                fonts,
                                                                request) {
      /** Hack begin */
      // There's currently no event when a font has finished downloading so the
      // following code is a dirty hack to 'guess' when a font is
      // ready. It's assumed fonts are loaded in order, so add a known test
      // font after the desired fonts and then test for the loading of that
      // test font.

      function int32(data, offset) {
        return (data.charCodeAt(offset) << 24) |
               (data.charCodeAt(offset + 1) << 16) |
               (data.charCodeAt(offset + 2) << 8) |
               (data.charCodeAt(offset + 3) & 0xff);
      }

      function spliceString(s, offset, remove, insert) {
        var chunk1 = s.substr(0, offset);
        var chunk2 = s.substr(offset + remove);
        return chunk1 + insert + chunk2;
      }

      var i, ii;

      var canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      var ctx = canvas.getContext('2d');

      var called = 0;
      function isFontReady(name, callback) {
        called++;
        // With setTimeout clamping this gives the font ~100ms to load.
        if(called > 30) {
          warn('Load test font never loaded.');
          callback();
          return;
        }
        ctx.font = '30px ' + name;
        ctx.fillText('.', 0, 20);
        var imageData = ctx.getImageData(0, 0, 1, 1);
        if (imageData.data[3] > 0) {
          callback();
          return;
        }
        setTimeout(isFontReady.bind(null, name, callback));
      }

      var loadTestFontId = 'lt' + Date.now() + this.loadTestFontId++;
      // Chromium seems to cache fonts based on a hash of the actual font data,
      // so the font must be modified for each load test else it will appear to
      // be loaded already.
      // TODO: This could maybe be made faster by avoiding the btoa of the full
      // font by splitting it in chunks before hand and padding the font id.
      var data = this.loadTestFont;
      var COMMENT_OFFSET = 976; // has to be on 4 byte boundary (for checksum)
      data = spliceString(data, COMMENT_OFFSET, loadTestFontId.length,
                          loadTestFontId);
      // CFF checksum is important for IE, adjusting it
      var CFF_CHECKSUM_OFFSET = 16;
      var XXXX_VALUE = 0x58585858; // the "comment" filled with 'X'
      var checksum = int32(data, CFF_CHECKSUM_OFFSET);
      for (i = 0, ii = loadTestFontId.length - 3; i < ii; i += 4) {
        checksum = (checksum - XXXX_VALUE + int32(loadTestFontId, i)) | 0;
      }
      if (i < loadTestFontId.length) { // align to 4 bytes boundary
        checksum = (checksum - XXXX_VALUE +
                    int32(loadTestFontId + 'XXX', i)) | 0;
      }
      data = spliceString(data, CFF_CHECKSUM_OFFSET, 4, string32(checksum));

      var url = 'url(data:font/opentype;base64,' + btoa(data) + ');';
      var rule = '@font-face { font-family:"' + loadTestFontId + '";src:' +
                 url + '}';
      this.insertRule(rule);

      var names = [];
      for (i = 0, ii = fonts.length; i < ii; i++) {
        names.push(fonts[i].loadedName);
      }
      names.push(loadTestFontId);

      var div = document.createElement('div');
      div.setAttribute('style',
                       'visibility: hidden;' +
                       'width: 10px; height: 10px;' +
                       'position: absolute; top: 0px; left: 0px;');
      for (i = 0, ii = names.length; i < ii; ++i) {
        var span = document.createElement('span');
        span.textContent = 'Hi';
        span.style.fontFamily = names[i];
        div.appendChild(span);
      }
      document.body.appendChild(div);

      isFontReady(loadTestFontId, function() {
        document.body.removeChild(div);
        request.complete();
      });
      /** Hack end */
  }
};
FontLoader.isFontLoadingAPISupported = (!isWorker &&
  typeof document !== 'undefined' && !!document.fonts);
Object.defineProperty(FontLoader, 'isSyncFontLoadingSupported', {
  get: function () {
    var supported = false;

    // User agent string sniffing is bad, but there is no reliable way to tell
    // if font is fully loaded and ready to be used with canvas.
    var userAgent = window.navigator.userAgent;
    var m = /Mozilla\/5.0.*?rv:(\d+).*? Gecko/.exec(userAgent);
    if (m && m[1] >= 14) {
      supported = true;
    }
    // TODO other browsers
    if (userAgent === 'node') {
      supported = true;
    }
    return shadow(FontLoader, 'isSyncFontLoadingSupported', supported);
  },
  enumerable: true,
  configurable: true
});

var FontFaceObject = (function FontFaceObjectClosure() {
  function FontFaceObject(translatedData) {
    this.compiledGlyphs = {};
    // importing translated data
    for (var i in translatedData) {
      this[i] = translatedData[i];
    }
  }
  Object.defineProperty(FontFaceObject, 'isEvalSupported', {
    get: function () {
      var evalSupport = false;
      if (PDFJS.isEvalSupported) {
        try {
          /* jshint evil: true */
          new Function('');
          evalSupport = true;
        } catch (e) {}
      }
      return shadow(this, 'isEvalSupported', evalSupport);
    },
    enumerable: true,
    configurable: true
  });
  FontFaceObject.prototype = {
    createNativeFontFace: function FontFaceObject_createNativeFontFace() {
      if (!this.data) {
        return null;
      }

      if (PDFJS.disableFontFace) {
        this.disableFontFace = true;
        return null;
      }

      var nativeFontFace = new FontFace(this.loadedName, this.data, {});

      if (PDFJS.pdfBug && 'FontInspector' in globalScope &&
          globalScope['FontInspector'].enabled) {
        globalScope['FontInspector'].fontAdded(this);
      }
      return nativeFontFace;
    },

    createFontFaceRule: function FontFaceObject_createFontFaceRule() {
      if (!this.data) {
        return null;
      }

      if (PDFJS.disableFontFace) {
        this.disableFontFace = true;
        return null;
      }

      var data = bytesToString(new Uint8Array(this.data));
      var fontName = this.loadedName;

      // Add the font-face rule to the document
      var url = ('url(data:' + this.mimetype + ';base64,' +
                 window.btoa(data) + ');');
      var rule = '@font-face { font-family:"' + fontName + '";src:' + url + '}';

      if (PDFJS.pdfBug && 'FontInspector' in globalScope &&
          globalScope['FontInspector'].enabled) {
        globalScope['FontInspector'].fontAdded(this, url);
      }

      return rule;
    },

    getPathGenerator:
        function FontFaceObject_getPathGenerator(objs, character) {
      if (!(character in this.compiledGlyphs)) {
        var cmds = objs.get(this.loadedName + '_path_' + character);
        var current, i, len;

        // If we can, compile cmds into JS for MAXIMUM SPEED
        if (FontFaceObject.isEvalSupported) {
          var args, js = '';
          for (i = 0, len = cmds.length; i < len; i++) {
            current = cmds[i];

            if (current.args !== undefined) {
              args = current.args.join(',');
            } else {
              args = '';
            }

            js += 'c.' + current.cmd + '(' + args + ');\n';
          }
          /* jshint -W054 */
          this.compiledGlyphs[character] = new Function('c', 'size', js);
        } else {
          // But fall back on using Function.prototype.apply() if we're
          // blocked from using eval() for whatever reason (like CSP policies)
          this.compiledGlyphs[character] = function(c, size) {
            for (i = 0, len = cmds.length; i < len; i++) {
              current = cmds[i];

              if (current.cmd === 'scale') {
                current.args = [size, -size];
              }

              c[current.cmd].apply(c, current.args);
            }
          };
        }
      }
      return this.compiledGlyphs[character];
    }
  };
  return FontFaceObject;
})();

exports.FontFaceObject = FontFaceObject;
exports.FontLoader = FontLoader;
}));


(function (root, factory) {
  {
    factory((root.pdfjsDisplayMetadata = {}), root.pdfjsSharedUtil);
  }
}(this, function (exports, sharedUtil) {

var error = sharedUtil.error;

var Metadata = PDFJS.Metadata = (function MetadataClosure() {
  function fixMetadata(meta) {
    return meta.replace(/>\\376\\377([^<]+)/g, function(all, codes) {
      var bytes = codes.replace(/\\([0-3])([0-7])([0-7])/g,
                                function(code, d1, d2, d3) {
        return String.fromCharCode(d1 * 64 + d2 * 8 + d3 * 1);
      });
      var chars = '';
      for (var i = 0; i < bytes.length; i += 2) {
        var code = bytes.charCodeAt(i) * 256 + bytes.charCodeAt(i + 1);
        chars += code >= 32 && code < 127 && code !== 60 && code !== 62 &&
          code !== 38 && false ? String.fromCharCode(code) :
          '&#x' + (0x10000 + code).toString(16).substring(1) + ';';
      }
      return '>' + chars;
    });
  }

  function Metadata(meta) {
    if (typeof meta === 'string') {
      // Ghostscript produces invalid metadata
      meta = fixMetadata(meta);

      var parser = new DOMParser();
      meta = parser.parseFromString(meta, 'application/xml');
    } else if (!(meta instanceof Document)) {
      error('Metadata: Invalid metadata object');
    }

    this.metaDocument = meta;
    this.metadata = {};
    this.parse();
  }

  Metadata.prototype = {
    parse: function Metadata_parse() {
      var doc = this.metaDocument;
      var rdf = doc.documentElement;

      if (rdf.nodeName.toLowerCase() !== 'rdf:rdf') { // Wrapped in <xmpmeta>
        rdf = rdf.firstChild;
        while (rdf && rdf.nodeName.toLowerCase() !== 'rdf:rdf') {
          rdf = rdf.nextSibling;
        }
      }

      var nodeName = (rdf) ? rdf.nodeName.toLowerCase() : null;
      if (!rdf || nodeName !== 'rdf:rdf' || !rdf.hasChildNodes()) {
        return;
      }

      var children = rdf.childNodes, desc, entry, name, i, ii, length, iLength;
      for (i = 0, length = children.length; i < length; i++) {
        desc = children[i];
        if (desc.nodeName.toLowerCase() !== 'rdf:description') {
          continue;
        }

        for (ii = 0, iLength = desc.childNodes.length; ii < iLength; ii++) {
          if (desc.childNodes[ii].nodeName.toLowerCase() !== '#text') {
            entry = desc.childNodes[ii];
            name = entry.nodeName.toLowerCase();
            this.metadata[name] = entry.textContent.trim();
          }
        }
      }
    },

    get: function Metadata_get(name) {
      return this.metadata[name] || null;
    },

    has: function Metadata_has(name) {
      return typeof this.metadata[name] !== 'undefined';
    }
  };

  return Metadata;
})();

exports.Metadata = Metadata;
}));


(function (root, factory) {
  {
    factory((root.pdfjsDisplaySVG = {}), root.pdfjsSharedUtil);
  }
}(this, function (exports, sharedUtil) {

var FONT_IDENTITY_MATRIX = sharedUtil.FONT_IDENTITY_MATRIX;
var IDENTITY_MATRIX = sharedUtil.IDENTITY_MATRIX;
var ImageKind = sharedUtil.ImageKind;
var OPS = sharedUtil.OPS;
var Util = sharedUtil.Util;
var isNum = sharedUtil.isNum;
var isArray = sharedUtil.isArray;
var warn = sharedUtil.warn;

var SVG_DEFAULTS = {
  fontStyle: 'normal',
  fontWeight: 'normal',
  fillColor: '#000000'
};

var convertImgDataToPng = (function convertImgDataToPngClosure() {
  var PNG_HEADER =
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  var CHUNK_WRAPPER_SIZE = 12;

  var crcTable = new Int32Array(256);
  for (var i = 0; i < 256; i++) {
    var c = i;
    for (var h = 0; h < 8; h++) {
      if (c & 1) {
        c = 0xedB88320 ^ ((c >> 1) & 0x7fffffff);
      } else {
        c = (c >> 1) & 0x7fffffff;
      }
    }
    crcTable[i] = c;
  }

  function crc32(data, start, end) {
    var crc = -1;
    for (var i = start; i < end; i++) {
      var a = (crc ^ data[i]) & 0xff;
      var b = crcTable[a];
      crc = (crc >>> 8) ^ b;
    }
    return crc ^ -1;
  }

  function writePngChunk(type, body, data, offset) {
    var p = offset;
    var len = body.length;

    data[p] = len >> 24 & 0xff;
    data[p + 1] = len >> 16 & 0xff;
    data[p + 2] = len >> 8 & 0xff;
    data[p + 3] = len & 0xff;
    p += 4;

    data[p] = type.charCodeAt(0) & 0xff;
    data[p + 1] = type.charCodeAt(1) & 0xff;
    data[p + 2] = type.charCodeAt(2) & 0xff;
    data[p + 3] = type.charCodeAt(3) & 0xff;
    p += 4;

    data.set(body, p);
    p += body.length;

    var crc = crc32(data, offset + 4, p);

    data[p] = crc >> 24 & 0xff;
    data[p + 1] = crc >> 16 & 0xff;
    data[p + 2] = crc >> 8 & 0xff;
    data[p + 3] = crc & 0xff;
  }

  function adler32(data, start, end) {
    var a = 1;
    var b = 0;
    for (var i = start; i < end; ++i) {
      a = (a + (data[i] & 0xff)) % 65521;
      b = (b + a) % 65521;
    }
    return (b << 16) | a;
  }

  function encode(imgData, kind) {
    var width = imgData.width;
    var height = imgData.height;
    var bitDepth, colorType, lineSize;
    var bytes = imgData.data;

    switch (kind) {
      case ImageKind.GRAYSCALE_1BPP:
        colorType = 0;
        bitDepth = 1;
        lineSize = (width + 7) >> 3;
        break;
      case ImageKind.RGB_24BPP:
        colorType = 2;
        bitDepth = 8;
        lineSize = width * 3;
        break;
      case ImageKind.RGBA_32BPP:
        colorType = 6;
        bitDepth = 8;
        lineSize = width * 4;
        break;
      default:
        throw new Error('invalid format');
    }

    // prefix every row with predictor 0
    var literals = new Uint8Array((1 + lineSize) * height);
    var offsetLiterals = 0, offsetBytes = 0;
    var y, i;
    for (y = 0; y < height; ++y) {
      literals[offsetLiterals++] = 0; // no prediction
      literals.set(bytes.subarray(offsetBytes, offsetBytes + lineSize),
                   offsetLiterals);
      offsetBytes += lineSize;
      offsetLiterals += lineSize;
    }

    if (kind === ImageKind.GRAYSCALE_1BPP) {
      // inverting for B/W
      offsetLiterals = 0;
      for (y = 0; y < height; y++) {
        offsetLiterals++; // skipping predictor
        for (i = 0; i < lineSize; i++) {
          literals[offsetLiterals++] ^= 0xFF;
        }
      }
    }

    var ihdr = new Uint8Array([
      width >> 24 & 0xff,
      width >> 16 & 0xff,
      width >> 8 & 0xff,
      width & 0xff,
      height >> 24 & 0xff,
      height >> 16 & 0xff,
      height >> 8 & 0xff,
      height & 0xff,
      bitDepth, // bit depth
      colorType, // color type
      0x00, // compression method
      0x00, // filter method
      0x00 // interlace method
    ]);

    var len = literals.length;
    var maxBlockLength = 0xFFFF;

    var deflateBlocks = Math.ceil(len / maxBlockLength);
    var idat = new Uint8Array(2 + len + deflateBlocks * 5 + 4);
    var pi = 0;
    idat[pi++] = 0x78; // compression method and flags
    idat[pi++] = 0x9c; // flags

    var pos = 0;
    while (len > maxBlockLength) {
      // writing non-final DEFLATE blocks type 0 and length of 65535
      idat[pi++] = 0x00;
      idat[pi++] = 0xff;
      idat[pi++] = 0xff;
      idat[pi++] = 0x00;
      idat[pi++] = 0x00;
      idat.set(literals.subarray(pos, pos + maxBlockLength), pi);
      pi += maxBlockLength;
      pos += maxBlockLength;
      len -= maxBlockLength;
    }

    // writing non-final DEFLATE blocks type 0
    idat[pi++] = 0x01;
    idat[pi++] = len & 0xff;
    idat[pi++] = len >> 8 & 0xff;
    idat[pi++] = (~len & 0xffff) & 0xff;
    idat[pi++] = (~len & 0xffff) >> 8 & 0xff;
    idat.set(literals.subarray(pos), pi);
    pi += literals.length - pos;

    var adler = adler32(literals, 0, literals.length); // checksum
    idat[pi++] = adler >> 24 & 0xff;
    idat[pi++] = adler >> 16 & 0xff;
    idat[pi++] = adler >> 8 & 0xff;
    idat[pi++] = adler & 0xff;

    // PNG will consists: header, IHDR+data, IDAT+data, and IEND.
    var pngLength = PNG_HEADER.length + (CHUNK_WRAPPER_SIZE * 3) +
                    ihdr.length + idat.length;
    var data = new Uint8Array(pngLength);
    var offset = 0;
    data.set(PNG_HEADER, offset);
    offset += PNG_HEADER.length;
    writePngChunk('IHDR', ihdr, data, offset);
    offset += CHUNK_WRAPPER_SIZE + ihdr.length;
    writePngChunk('IDATA', idat, data, offset);
    offset += CHUNK_WRAPPER_SIZE + idat.length;
    writePngChunk('IEND', new Uint8Array(0), data, offset);

    return PDFJS.createObjectURL(data, 'image/png');
  }

  return function convertImgDataToPng(imgData) {
    var kind = (imgData.kind === undefined ?
                ImageKind.GRAYSCALE_1BPP : imgData.kind);
    return encode(imgData, kind);
  };
})();

var SVGExtraState = (function SVGExtraStateClosure() {
  function SVGExtraState() {
    this.fontSizeScale = 1;
    this.fontWeight = SVG_DEFAULTS.fontWeight;
    this.fontSize = 0;

    this.textMatrix = IDENTITY_MATRIX;
    this.fontMatrix = FONT_IDENTITY_MATRIX;
    this.leading = 0;

    // Current point (in user coordinates)
    this.x = 0;
    this.y = 0;

    // Start of text line (in text coordinates)
    this.lineX = 0;
    this.lineY = 0;

    // Character and word spacing
    this.charSpacing = 0;
    this.wordSpacing = 0;
    this.textHScale = 1;
    this.textRise = 0;

    // Default foreground and background colors
    this.fillColor = SVG_DEFAULTS.fillColor;
    this.strokeColor = '#000000';

    this.fillAlpha = 1;
    this.strokeAlpha = 1;
    this.lineWidth = 1;
    this.lineJoin = '';
    this.lineCap = '';
    this.miterLimit = 0;

    this.dashArray = [];
    this.dashPhase = 0;

    this.dependencies = [];

    // Clipping
    this.clipId = '';
    this.pendingClip = false;

    this.maskId = '';
  }

  SVGExtraState.prototype = {
    clone: function SVGExtraState_clone() {
      return Object.create(this);
    },
    setCurrentPoint: function SVGExtraState_setCurrentPoint(x, y) {
      this.x = x;
      this.y = y;
    }
  };
  return SVGExtraState;
})();

var SVGGraphics = (function SVGGraphicsClosure() {
  function createScratchSVG(width, height) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg:svg');
    svg.setAttributeNS(null, 'version', '1.1');
    svg.setAttributeNS(null, 'width', width + 'px');
    svg.setAttributeNS(null, 'height', height + 'px');
    svg.setAttributeNS(null, 'viewBox', '0 0 ' + width + ' ' + height);
    return svg;
  }

  function opListToTree(opList) {
    var opTree = [];
    var tmp = [];
    var opListLen = opList.length;

    for (var x = 0; x < opListLen; x++) {
      if (opList[x].fn === 'save') {
        opTree.push({'fnId': 92, 'fn': 'group', 'items': []});
        tmp.push(opTree);
        opTree = opTree[opTree.length - 1].items;
        continue;
      }

      if(opList[x].fn === 'restore') {
        opTree = tmp.pop();
      } else {
        opTree.push(opList[x]);
      }
    }
    return opTree;
  }

  /**
   * Formats float number.
   * @param value {number} number to format.
   * @returns {string}
   */
  function pf(value) {
    if (value === (value | 0)) { // integer number
      return value.toString();
    }
    var s = value.toFixed(10);
    var i = s.length - 1;
    if (s[i] !== '0') {
      return s;
    }
    // removing trailing zeros
    do {
      i--;
    } while (s[i] === '0');
    return s.substr(0, s[i] === '.' ? i : i + 1);
  }

  /**
   * Formats transform matrix. The standard rotation, scale and translate
   * matrices are replaced by their shorter forms, and for identity matrix
   * returns empty string to save the memory.
   * @param m {Array} matrix to format.
   * @returns {string}
   */
  function pm(m) {
    if (m[4] === 0 && m[5] === 0) {
      if (m[1] === 0 && m[2] === 0) {
        if (m[0] === 1 && m[3] === 1) {
          return '';
        }
        return 'scale(' + pf(m[0]) + ' ' + pf(m[3]) + ')';
      }
      if (m[0] === m[3] && m[1] === -m[2]) {
        var a = Math.acos(m[0]) * 180 / Math.PI;
        return 'rotate(' + pf(a) + ')';
      }
    } else {
      if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1) {
        return 'translate(' + pf(m[4]) + ' ' + pf(m[5]) + ')';
      }
    }
    return 'matrix(' + pf(m[0]) + ' ' + pf(m[1]) + ' ' + pf(m[2]) + ' ' +
      pf(m[3]) + ' ' + pf(m[4]) + ' ' + pf(m[5]) + ')';
  }

  function SVGGraphics(commonObjs, objs) {
    this.current = new SVGExtraState();
    this.transformMatrix = IDENTITY_MATRIX; // Graphics state matrix
    this.transformStack = [];
    this.extraStack = [];
    this.commonObjs = commonObjs;
    this.objs = objs;
    this.pendingEOFill = false;

    this.embedFonts = false;
    this.embeddedFonts = {};
    this.cssStyle = null;
  }

  var NS = 'http://www.w3.org/2000/svg';
  var XML_NS = 'http://www.w3.org/XML/1998/namespace';
  var XLINK_NS = 'http://www.w3.org/1999/xlink';
  var LINE_CAP_STYLES = ['butt', 'round', 'square'];
  var LINE_JOIN_STYLES = ['miter', 'round', 'bevel'];
  var clipCount = 0;
  var maskCount = 0;

  SVGGraphics.prototype = {
    save: function SVGGraphics_save() {
      this.transformStack.push(this.transformMatrix);
      var old = this.current;
      this.extraStack.push(old);
      this.current = old.clone();
    },

    restore: function SVGGraphics_restore() {
      this.transformMatrix = this.transformStack.pop();
      this.current = this.extraStack.pop();

      this.tgrp = document.createElementNS(NS, 'svg:g');
      this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
      this.pgrp.appendChild(this.tgrp);
    },

    group: function SVGGraphics_group(items) {
      this.save();
      this.executeOpTree(items);
      this.restore();
    },

    loadDependencies: function SVGGraphics_loadDependencies(operatorList) {
      var fnArray = operatorList.fnArray;
      var fnArrayLen = fnArray.length;
      var argsArray = operatorList.argsArray;

      var self = this;
      for (var i = 0; i < fnArrayLen; i++) {
        if (OPS.dependency === fnArray[i]) {
          var deps = argsArray[i];
          for (var n = 0, nn = deps.length; n < nn; n++) {
            var obj = deps[n];
            var common = obj.substring(0, 2) === 'g_';
            var promise;
            if (common) {
              promise = new Promise(function(resolve) {
                self.commonObjs.get(obj, resolve);
              });
            } else {
              promise = new Promise(function(resolve) {
                self.objs.get(obj, resolve);
              });
            }
            this.current.dependencies.push(promise);
          }
        }
      }
      return Promise.all(this.current.dependencies);
    },

    transform: function SVGGraphics_transform(a, b, c, d, e, f) {
      var transformMatrix = [a, b, c, d, e, f];
      this.transformMatrix = PDFJS.Util.transform(this.transformMatrix,
                                                  transformMatrix);

      this.tgrp = document.createElementNS(NS, 'svg:g');
      this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
    },

    getSVG: function SVGGraphics_getSVG(operatorList, viewport) {
      this.svg = createScratchSVG(viewport.width, viewport.height);
      this.viewport = viewport;

      return this.loadDependencies(operatorList).then(function () {
        this.transformMatrix = IDENTITY_MATRIX;
        this.pgrp = document.createElementNS(NS, 'svg:g'); // Parent group
        this.pgrp.setAttributeNS(null, 'transform', pm(viewport.transform));
        this.tgrp = document.createElementNS(NS, 'svg:g'); // Transform group
        this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
        this.defs = document.createElementNS(NS, 'svg:defs');
        this.pgrp.appendChild(this.defs);
        this.pgrp.appendChild(this.tgrp);
        this.svg.appendChild(this.pgrp);
        var opTree = this.convertOpList(operatorList);
        this.executeOpTree(opTree);
        return this.svg;
      }.bind(this));
    },

    convertOpList: function SVGGraphics_convertOpList(operatorList) {
      var argsArray = operatorList.argsArray;
      var fnArray = operatorList.fnArray;
      var fnArrayLen  = fnArray.length;
      var REVOPS = [];
      var opList = [];

      for (var op in OPS) {
        REVOPS[OPS[op]] = op;
      }

      for (var x = 0; x < fnArrayLen; x++) {
        var fnId = fnArray[x];
        opList.push({'fnId' : fnId, 'fn': REVOPS[fnId], 'args': argsArray[x]});
      }
      return opListToTree(opList);
    },

    executeOpTree: function SVGGraphics_executeOpTree(opTree) {
      var opTreeLen = opTree.length;
      for(var x = 0; x < opTreeLen; x++) {
        var fn = opTree[x].fn;
        var fnId = opTree[x].fnId;
        var args = opTree[x].args;

        switch (fnId | 0) {
          case OPS.beginText:
            this.beginText();
            break;
          case OPS.setLeading:
            this.setLeading(args);
            break;
          case OPS.setLeadingMoveText:
            this.setLeadingMoveText(args[0], args[1]);
            break;
          case OPS.setFont:
            this.setFont(args);
            break;
          case OPS.showText:
            this.showText(args[0]);
            break;
          case OPS.showSpacedText:
            this.showText(args[0]);
            break;
          case OPS.endText:
            this.endText();
            break;
          case OPS.moveText:
            this.moveText(args[0], args[1]);
            break;
          case OPS.setCharSpacing:
            this.setCharSpacing(args[0]);
            break;
          case OPS.setWordSpacing:
            this.setWordSpacing(args[0]);
            break;
          case OPS.setHScale:
            this.setHScale(args[0]);
            break;
          case OPS.setTextMatrix:
            this.setTextMatrix(args[0], args[1], args[2],
                               args[3], args[4], args[5]);
            break;
          case OPS.setLineWidth:
            this.setLineWidth(args[0]);
            break;
          case OPS.setLineJoin:
            this.setLineJoin(args[0]);
            break;
          case OPS.setLineCap:
            this.setLineCap(args[0]);
            break;
          case OPS.setMiterLimit:
            this.setMiterLimit(args[0]);
            break;
          case OPS.setFillRGBColor:
            this.setFillRGBColor(args[0], args[1], args[2]);
            break;
          case OPS.setStrokeRGBColor:
            this.setStrokeRGBColor(args[0], args[1], args[2]);
            break;
          case OPS.setDash:
            this.setDash(args[0], args[1]);
            break;
          case OPS.setGState:
            this.setGState(args[0]);
            break;
          case OPS.fill:
            this.fill();
            break;
          case OPS.eoFill:
            this.eoFill();
            break;
          case OPS.stroke:
            this.stroke();
            break;
          case OPS.fillStroke:
            this.fillStroke();
            break;
          case OPS.eoFillStroke:
            this.eoFillStroke();
            break;
          case OPS.clip:
            this.clip('nonzero');
            break;
          case OPS.eoClip:
            this.clip('evenodd');
            break;
          case OPS.paintSolidColorImageMask:
            this.paintSolidColorImageMask();
            break;
          case OPS.paintJpegXObject:
            this.paintJpegXObject(args[0], args[1], args[2]);
            break;
          case OPS.paintImageXObject:
            this.paintImageXObject(args[0]);
            break;
          case OPS.paintInlineImageXObject:
            this.paintInlineImageXObject(args[0]);
            break;
          case OPS.paintImageMaskXObject:
            this.paintImageMaskXObject(args[0]);
            break;
          case OPS.paintFormXObjectBegin:
            this.paintFormXObjectBegin(args[0], args[1]);
            break;
          case OPS.paintFormXObjectEnd:
            this.paintFormXObjectEnd();
            break;
          case OPS.closePath:
            this.closePath();
            break;
          case OPS.closeStroke:
            this.closeStroke();
            break;
          case OPS.closeFillStroke:
            this.closeFillStroke();
            break;
          case OPS.nextLine:
            this.nextLine();
            break;
          case OPS.transform:
            this.transform(args[0], args[1], args[2], args[3],
                           args[4], args[5]);
            break;
          case OPS.constructPath:
            this.constructPath(args[0], args[1]);
            break;
          case OPS.endPath:
            this.endPath();
            break;
          case 92:
            this.group(opTree[x].items);
            break;
          default:
            warn('Unimplemented method '+ fn);
            break;
        }
      }
    },

    setWordSpacing: function SVGGraphics_setWordSpacing(wordSpacing) {
      this.current.wordSpacing = wordSpacing;
    },

    setCharSpacing: function SVGGraphics_setCharSpacing(charSpacing) {
      this.current.charSpacing = charSpacing;
    },

    nextLine: function SVGGraphics_nextLine() {
      this.moveText(0, this.current.leading);
    },

    setTextMatrix: function SVGGraphics_setTextMatrix(a, b, c, d, e, f) {
      var current = this.current;
      this.current.textMatrix = this.current.lineMatrix = [a, b, c, d, e, f];

      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;

      current.xcoords = [];
      current.tspan = document.createElementNS(NS, 'svg:tspan');
      current.tspan.setAttributeNS(null, 'font-family', current.fontFamily);
      current.tspan.setAttributeNS(null, 'font-size',
                                   pf(current.fontSize) + 'px');
      current.tspan.setAttributeNS(null, 'y', pf(-current.y));

      current.txtElement = document.createElementNS(NS, 'svg:text');
      current.txtElement.appendChild(current.tspan);
    },

    beginText: function SVGGraphics_beginText() {
      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
      this.current.textMatrix = IDENTITY_MATRIX;
      this.current.lineMatrix = IDENTITY_MATRIX;
      this.current.tspan = document.createElementNS(NS, 'svg:tspan');
      this.current.txtElement = document.createElementNS(NS, 'svg:text');
      this.current.txtgrp = document.createElementNS(NS, 'svg:g');
      this.current.xcoords = [];
    },

    moveText: function SVGGraphics_moveText(x, y) {
      var current = this.current;
      this.current.x = this.current.lineX += x;
      this.current.y = this.current.lineY += y;

      current.xcoords = [];
      current.tspan = document.createElementNS(NS, 'svg:tspan');
      current.tspan.setAttributeNS(null, 'font-family', current.fontFamily);
      current.tspan.setAttributeNS(null, 'font-size',
                                   pf(current.fontSize) + 'px');
      current.tspan.setAttributeNS(null, 'y', pf(-current.y));
    },

    showText: function SVGGraphics_showText(glyphs) {
      var current = this.current;
      var font = current.font;
      var fontSize = current.fontSize;

      if (fontSize === 0) {
        return;
      }

      var charSpacing = current.charSpacing;
      var wordSpacing = current.wordSpacing;
      var fontDirection = current.fontDirection;
      var textHScale = current.textHScale * fontDirection;
      var glyphsLength = glyphs.length;
      var vertical = font.vertical;
      var widthAdvanceScale = fontSize * current.fontMatrix[0];

      var x = 0, i;
      for (i = 0; i < glyphsLength; ++i) {
        var glyph = glyphs[i];
        if (glyph === null) {
          // word break
          x += fontDirection * wordSpacing;
          continue;
        } else if (isNum(glyph)) {
          x += -glyph * fontSize * 0.001;
          continue;
        }
        current.xcoords.push(current.x + x * textHScale);

        var width = glyph.width;
        var character = glyph.fontChar;
        var charWidth = width * widthAdvanceScale + charSpacing * fontDirection;
        x += charWidth;

        current.tspan.textContent += character;
      }
      if (vertical) {
        current.y -= x * textHScale;
      } else {
        current.x += x * textHScale;
      }

      current.tspan.setAttributeNS(null, 'x',
                                   current.xcoords.map(pf).join(' '));
      current.tspan.setAttributeNS(null, 'y', pf(-current.y));
      current.tspan.setAttributeNS(null, 'font-family', current.fontFamily);
      current.tspan.setAttributeNS(null, 'font-size',
                                   pf(current.fontSize) + 'px');
      if (current.fontStyle !== SVG_DEFAULTS.fontStyle) {
        current.tspan.setAttributeNS(null, 'font-style', current.fontStyle);
      }
      if (current.fontWeight !== SVG_DEFAULTS.fontWeight) {
        current.tspan.setAttributeNS(null, 'font-weight', current.fontWeight);
      }
      if (current.fillColor !== SVG_DEFAULTS.fillColor) {
        current.tspan.setAttributeNS(null, 'fill', current.fillColor);
      }

      current.txtElement.setAttributeNS(null, 'transform',
                                        pm(current.textMatrix) +
                                        ' scale(1, -1)' );
      current.txtElement.setAttributeNS(XML_NS, 'xml:space', 'preserve');
      current.txtElement.appendChild(current.tspan);
      current.txtgrp.appendChild(current.txtElement);

      this.tgrp.appendChild(current.txtElement);

    },

    setLeadingMoveText: function SVGGraphics_setLeadingMoveText(x, y) {
      this.setLeading(-y);
      this.moveText(x, y);
    },

    addFontStyle: function SVGGraphics_addFontStyle(fontObj) {
      if (!this.cssStyle) {
        this.cssStyle = document.createElementNS(NS, 'svg:style');
        this.cssStyle.setAttributeNS(null, 'type', 'text/css');
        this.defs.appendChild(this.cssStyle);
      }

      var url = PDFJS.createObjectURL(fontObj.data, fontObj.mimetype);
      this.cssStyle.textContent +=
        '@font-face { font-family: "' + fontObj.loadedName + '";' +
        ' src: url(' + url + '); }\n';
    },

    setFont: function SVGGraphics_setFont(details) {
      var current = this.current;
      var fontObj = this.commonObjs.get(details[0]);
      var size = details[1];
      this.current.font = fontObj;

      if (this.embedFonts && fontObj.data &&
          !this.embeddedFonts[fontObj.loadedName]) {
        this.addFontStyle(fontObj);
        this.embeddedFonts[fontObj.loadedName] = fontObj;
      }

      current.fontMatrix = (fontObj.fontMatrix ?
                            fontObj.fontMatrix : FONT_IDENTITY_MATRIX);

      var bold = fontObj.black ? (fontObj.bold ? 'bolder' : 'bold') :
                                 (fontObj.bold ? 'bold' : 'normal');
      var italic = fontObj.italic ? 'italic' : 'normal';

      if (size < 0) {
        size = -size;
        current.fontDirection = -1;
      } else {
        current.fontDirection = 1;
      }
      current.fontSize = size;
      current.fontFamily = fontObj.loadedName;
      current.fontWeight = bold;
      current.fontStyle = italic;

      current.tspan = document.createElementNS(NS, 'svg:tspan');
      current.tspan.setAttributeNS(null, 'y', pf(-current.y));
      current.xcoords = [];
    },

    endText: function SVGGraphics_endText() {
      if (this.current.pendingClip) {
        this.cgrp.appendChild(this.tgrp);
        this.pgrp.appendChild(this.cgrp);
      } else {
        this.pgrp.appendChild(this.tgrp);
      }
      this.tgrp = document.createElementNS(NS, 'svg:g');
      this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
    },

    // Path properties
    setLineWidth: function SVGGraphics_setLineWidth(width) {
      this.current.lineWidth = width;
    },
    setLineCap: function SVGGraphics_setLineCap(style) {
      this.current.lineCap = LINE_CAP_STYLES[style];
    },
    setLineJoin: function SVGGraphics_setLineJoin(style) {
      this.current.lineJoin = LINE_JOIN_STYLES[style];
    },
    setMiterLimit: function SVGGraphics_setMiterLimit(limit) {
      this.current.miterLimit = limit;
    },
    setStrokeRGBColor: function SVGGraphics_setStrokeRGBColor(r, g, b) {
      var color = Util.makeCssRgb(r, g, b);
      this.current.strokeColor = color;
    },
    setFillRGBColor: function SVGGraphics_setFillRGBColor(r, g, b) {
      var color = Util.makeCssRgb(r, g, b);
      this.current.fillColor = color;
      this.current.tspan = document.createElementNS(NS, 'svg:tspan');
      this.current.xcoords = [];
    },
    setDash: function SVGGraphics_setDash(dashArray, dashPhase) {
      this.current.dashArray = dashArray;
      this.current.dashPhase = dashPhase;
    },

    constructPath: function SVGGraphics_constructPath(ops, args) {
      var current = this.current;
      var x = current.x, y = current.y;
      current.path = document.createElementNS(NS, 'svg:path');
      var d = [];
      var opLength = ops.length;

      for (var i = 0, j = 0; i < opLength; i++) {
        switch (ops[i] | 0) {
          case OPS.rectangle:
            x = args[j++];
            y = args[j++];
            var width = args[j++];
            var height = args[j++];
            var xw = x + width;
            var yh = y + height;
            d.push('M', pf(x), pf(y), 'L', pf(xw) , pf(y), 'L', pf(xw), pf(yh),
                   'L', pf(x), pf(yh), 'Z');
            break;
          case OPS.moveTo:
            x = args[j++];
            y = args[j++];
            d.push('M', pf(x), pf(y));
            break;
          case OPS.lineTo:
            x = args[j++];
            y = args[j++];
            d.push('L', pf(x) , pf(y));
            break;
          case OPS.curveTo:
            x = args[j + 4];
            y = args[j + 5];
            d.push('C', pf(args[j]), pf(args[j + 1]), pf(args[j + 2]),
                   pf(args[j + 3]), pf(x), pf(y));
            j += 6;
            break;
          case OPS.curveTo2:
            x = args[j + 2];
            y = args[j + 3];
            d.push('C', pf(x), pf(y), pf(args[j]), pf(args[j + 1]),
                   pf(args[j + 2]), pf(args[j + 3]));
            j += 4;
            break;
          case OPS.curveTo3:
            x = args[j + 2];
            y = args[j + 3];
            d.push('C', pf(args[j]), pf(args[j + 1]), pf(x), pf(y),
                   pf(x), pf(y));
            j += 4;
            break;
          case OPS.closePath:
            d.push('Z');
            break;
        }
      }
      current.path.setAttributeNS(null, 'd', d.join(' '));
      current.path.setAttributeNS(null, 'stroke-miterlimit',
                                  pf(current.miterLimit));
      current.path.setAttributeNS(null, 'stroke-linecap', current.lineCap);
      current.path.setAttributeNS(null, 'stroke-linejoin', current.lineJoin);
      current.path.setAttributeNS(null, 'stroke-width',
                                  pf(current.lineWidth) + 'px');
      current.path.setAttributeNS(null, 'stroke-dasharray',
                                  current.dashArray.map(pf).join(' '));
      current.path.setAttributeNS(null, 'stroke-dashoffset',
                                  pf(current.dashPhase) + 'px');
      current.path.setAttributeNS(null, 'fill', 'none');

      this.tgrp.appendChild(current.path);
      if (current.pendingClip) {
        this.cgrp.appendChild(this.tgrp);
        this.pgrp.appendChild(this.cgrp);
      } else {
        this.pgrp.appendChild(this.tgrp);
      }
      // Saving a reference in current.element so that it can be addressed
      // in 'fill' and 'stroke'
      current.element = current.path;
      current.setCurrentPoint(x, y);
    },

    endPath: function SVGGraphics_endPath() {
      var current = this.current;
      if (current.pendingClip) {
        this.cgrp.appendChild(this.tgrp);
        this.pgrp.appendChild(this.cgrp);
      } else {
        this.pgrp.appendChild(this.tgrp);
      }
      this.tgrp = document.createElementNS(NS, 'svg:g');
      this.tgrp.setAttributeNS(null, 'transform', pm(this.transformMatrix));
    },

    clip: function SVGGraphics_clip(type) {
      var current = this.current;
      // Add current path to clipping path
      current.clipId = 'clippath' + clipCount;
      clipCount++;
      this.clippath = document.createElementNS(NS, 'svg:clipPath');
      this.clippath.setAttributeNS(null, 'id', current.clipId);
      var clipElement = current.element.cloneNode();
      if (type === 'evenodd') {
        clipElement.setAttributeNS(null, 'clip-rule', 'evenodd');
      } else {
        clipElement.setAttributeNS(null, 'clip-rule', 'nonzero');
      }
      this.clippath.setAttributeNS(null, 'transform', pm(this.transformMatrix));
      this.clippath.appendChild(clipElement);
      this.defs.appendChild(this.clippath);

      // Create a new group with that attribute
      current.pendingClip = true;
      this.cgrp = document.createElementNS(NS, 'svg:g');
      this.cgrp.setAttributeNS(null, 'clip-path',
                               'url(#' + current.clipId + ')');
      this.pgrp.appendChild(this.cgrp);
    },

    closePath: function SVGGraphics_closePath() {
      var current = this.current;
      var d = current.path.getAttributeNS(null, 'd');
      d += 'Z';
      current.path.setAttributeNS(null, 'd', d);
    },

    setLeading: function SVGGraphics_setLeading(leading) {
      this.current.leading = -leading;
    },

    setTextRise: function SVGGraphics_setTextRise(textRise) {
      this.current.textRise = textRise;
    },

    setHScale: function SVGGraphics_setHScale(scale) {
      this.current.textHScale = scale / 100;
    },

    setGState: function SVGGraphics_setGState(states) {
      for (var i = 0, ii = states.length; i < ii; i++) {
        var state = states[i];
        var key = state[0];
        var value = state[1];

        switch (key) {
          case 'LW':
            this.setLineWidth(value);
            break;
          case 'LC':
            this.setLineCap(value);
            break;
          case 'LJ':
            this.setLineJoin(value);
            break;
          case 'ML':
            this.setMiterLimit(value);
            break;
          case 'D':
            this.setDash(value[0], value[1]);
            break;
          case 'RI':
            break;
          case 'FL':
            break;
          case 'Font':
            this.setFont(value);
            break;
          case 'CA':
            break;
          case 'ca':
            break;
          case 'BM':
            break;
          case 'SMask':
            break;
        }
      }
    },

    fill: function SVGGraphics_fill() {
      var current = this.current;
      current.element.setAttributeNS(null, 'fill', current.fillColor);
    },

    stroke: function SVGGraphics_stroke() {
      var current = this.current;
      current.element.setAttributeNS(null, 'stroke', current.strokeColor);
      current.element.setAttributeNS(null, 'fill', 'none');
    },

    eoFill: function SVGGraphics_eoFill() {
      var current = this.current;
      current.element.setAttributeNS(null, 'fill', current.fillColor);
      current.element.setAttributeNS(null, 'fill-rule', 'evenodd');
    },

    fillStroke: function SVGGraphics_fillStroke() {
      // Order is important since stroke wants fill to be none.
      // First stroke, then if fill needed, it will be overwritten.
      this.stroke();
      this.fill();
    },

    eoFillStroke: function SVGGraphics_eoFillStroke() {
      this.current.element.setAttributeNS(null, 'fill-rule', 'evenodd');
      this.fillStroke();
    },

    closeStroke: function SVGGraphics_closeStroke() {
      this.closePath();
      this.stroke();
    },

    closeFillStroke: function SVGGraphics_closeFillStroke() {
      this.closePath();
      this.fillStroke();
    },

    paintSolidColorImageMask:
        function SVGGraphics_paintSolidColorImageMask() {
      var current = this.current;
      var rect = document.createElementNS(NS, 'svg:rect');
      rect.setAttributeNS(null, 'x', '0');
      rect.setAttributeNS(null, 'y', '0');
      rect.setAttributeNS(null, 'width', '1px');
      rect.setAttributeNS(null, 'height', '1px');
      rect.setAttributeNS(null, 'fill', current.fillColor);
      this.tgrp.appendChild(rect);
    },

    paintJpegXObject: function SVGGraphics_paintJpegXObject(objId, w, h) {
      var current = this.current;
      var imgObj = this.objs.get(objId);
      var imgEl = document.createElementNS(NS, 'svg:image');
      imgEl.setAttributeNS(XLINK_NS, 'xlink:href', imgObj.src);
      imgEl.setAttributeNS(null, 'width', imgObj.width + 'px');
      imgEl.setAttributeNS(null, 'height', imgObj.height + 'px');
      imgEl.setAttributeNS(null, 'x', '0');
      imgEl.setAttributeNS(null, 'y', pf(-h));
      imgEl.setAttributeNS(null, 'transform',
                           'scale(' + pf(1 / w) + ' ' + pf(-1 / h) + ')');

      this.tgrp.appendChild(imgEl);
      if (current.pendingClip) {
        this.cgrp.appendChild(this.tgrp);
        this.pgrp.appendChild(this.cgrp);
      } else {
        this.pgrp.appendChild(this.tgrp);
      }
    },

    paintImageXObject: function SVGGraphics_paintImageXObject(objId) {
      var imgData = this.objs.get(objId);
      if (!imgData) {
        warn('Dependent image isn\'t ready yet');
        return;
      }
      this.paintInlineImageXObject(imgData);
    },

    paintInlineImageXObject:
        function SVGGraphics_paintInlineImageXObject(imgData, mask) {
      var current = this.current;
      var width = imgData.width;
      var height = imgData.height;

      var imgSrc = convertImgDataToPng(imgData);
      var cliprect = document.createElementNS(NS, 'svg:rect');
      cliprect.setAttributeNS(null, 'x', '0');
      cliprect.setAttributeNS(null, 'y', '0');
      cliprect.setAttributeNS(null, 'width', pf(width));
      cliprect.setAttributeNS(null, 'height', pf(height));
      current.element = cliprect;
      this.clip('nonzero');
      var imgEl = document.createElementNS(NS, 'svg:image');
      imgEl.setAttributeNS(XLINK_NS, 'xlink:href', imgSrc);
      imgEl.setAttributeNS(null, 'x', '0');
      imgEl.setAttributeNS(null, 'y', pf(-height));
      imgEl.setAttributeNS(null, 'width', pf(width) + 'px');
      imgEl.setAttributeNS(null, 'height', pf(height) + 'px');
      imgEl.setAttributeNS(null, 'transform',
                           'scale(' + pf(1 / width) + ' ' +
                           pf(-1 / height) + ')');
      if (mask) {
        mask.appendChild(imgEl);
      } else {
        this.tgrp.appendChild(imgEl);
      }
      if (current.pendingClip) {
        this.cgrp.appendChild(this.tgrp);
        this.pgrp.appendChild(this.cgrp);
      } else {
        this.pgrp.appendChild(this.tgrp);
      }
    },

    paintImageMaskXObject:
        function SVGGraphics_paintImageMaskXObject(imgData) {
      var current = this.current;
      var width = imgData.width;
      var height = imgData.height;
      var fillColor = current.fillColor;

      current.maskId = 'mask' + maskCount++;
      var mask = document.createElementNS(NS, 'svg:mask');
      mask.setAttributeNS(null, 'id', current.maskId);

      var rect = document.createElementNS(NS, 'svg:rect');
      rect.setAttributeNS(null, 'x', '0');
      rect.setAttributeNS(null, 'y', '0');
      rect.setAttributeNS(null, 'width', pf(width));
      rect.setAttributeNS(null, 'height', pf(height));
      rect.setAttributeNS(null, 'fill', fillColor);
      rect.setAttributeNS(null, 'mask', 'url(#' + current.maskId +')');
      this.defs.appendChild(mask);
      this.tgrp.appendChild(rect);

      this.paintInlineImageXObject(imgData, mask);
    },

    paintFormXObjectBegin:
        function SVGGraphics_paintFormXObjectBegin(matrix, bbox) {
      this.save();

      if (isArray(matrix) && matrix.length === 6) {
        this.transform(matrix[0], matrix[1], matrix[2],
                       matrix[3], matrix[4], matrix[5]);
      }

      if (isArray(bbox) && bbox.length === 4) {
        var width = bbox[2] - bbox[0];
        var height = bbox[3] - bbox[1];

        var cliprect = document.createElementNS(NS, 'svg:rect');
        cliprect.setAttributeNS(null, 'x', bbox[0]);
        cliprect.setAttributeNS(null, 'y', bbox[1]);
        cliprect.setAttributeNS(null, 'width', pf(width));
        cliprect.setAttributeNS(null, 'height', pf(height));
        this.current.element = cliprect;
        this.clip('nonzero');
        this.endPath();
      }
    },

    paintFormXObjectEnd:
        function SVGGraphics_paintFormXObjectEnd() {
      this.restore();
    }
  };
  return SVGGraphics;
})();

PDFJS.SVGGraphics = SVGGraphics;

exports.SVGGraphics = SVGGraphics;
}));


(function (root, factory) {
  {
    factory((root.pdfjsDisplayTextLayer = {}), root.pdfjsSharedUtil,
      root.pdfjsDisplayDOMUtils, root.pdfjsSharedGlobal);
  }
}(this, function (exports, sharedUtil, displayDOMUtils, sharedGlobal) {

var Util = sharedUtil.Util;
var createPromiseCapability = sharedUtil.createPromiseCapability;
var CustomStyle = displayDOMUtils.CustomStyle;
var PDFJS = sharedGlobal.PDFJS;

/**
 * Text layer render parameters.
 *
 * @typedef {Object} TextLayerRenderParameters
 * @property {TextContent} textContent - Text content to render (the object is
 *   returned by the page's getTextContent() method).
 * @property {HTMLElement} container - HTML element that will contain text runs.
 * @property {PDFJS.PageViewport} viewport - The target viewport to properly
 *   layout the text runs.
 * @property {Array} textDivs - (optional) HTML elements that are correspond
 *   the text items of the textContent input. This is output and shall be
 *   initially be set to empty array.
 * @property {number} timeout - (optional) Delay in milliseconds before
 *   rendering of the text  runs occurs.
 */
var renderTextLayer = (function renderTextLayerClosure() {
  var MAX_TEXT_DIVS_TO_RENDER = 100000;

  var NonWhitespaceRegexp = /\S/;

  function isAllWhitespace(str) {
    return !NonWhitespaceRegexp.test(str);
  }

  function appendText(textDivs, viewport, geom, styles) {
    var style = styles[geom.fontName];
    var textDiv = document.createElement('div');
    textDivs.push(textDiv);
    if (isAllWhitespace(geom.str)) {
      textDiv.dataset.isWhitespace = true;
      return;
    }
    var tx = Util.transform(viewport.transform, geom.transform);
    var angle = Math.atan2(tx[1], tx[0]);
    if (style.vertical) {
      angle += Math.PI / 2;
    }
    var fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
    var fontAscent = fontHeight;
    if (style.ascent) {
      fontAscent = style.ascent * fontAscent;
    } else if (style.descent) {
      fontAscent = (1 + style.descent) * fontAscent;
    }

    var left;
    var top;
    if (angle === 0) {
      left = tx[4];
      top = tx[5] - fontAscent;
    } else {
      left = tx[4] + (fontAscent * Math.sin(angle));
      top = tx[5] - (fontAscent * Math.cos(angle));
    }
    textDiv.style.left = left + 'px';
    textDiv.style.top = top + 'px';
    textDiv.style.fontSize = fontHeight + 'px';
    textDiv.style.fontFamily = style.fontFamily;

    textDiv.textContent = geom.str;
    // |fontName| is only used by the Font Inspector. This test will succeed
    // when e.g. the Font Inspector is off but the Stepper is on, but it's
    // not worth the effort to do a more accurate test.
    if (PDFJS.pdfBug) {
      textDiv.dataset.fontName = geom.fontName;
    }
    // Storing into dataset will convert number into string.
    if (angle !== 0) {
      textDiv.dataset.angle = angle * (180 / Math.PI);
    }
    // We don't bother scaling single-char text divs, because it has very
    // little effect on text highlighting. This makes scrolling on docs with
    // lots of such divs a lot faster.
    if (geom.str.length > 1) {
      if (style.vertical) {
        textDiv.dataset.canvasWidth = geom.height * viewport.scale;
      } else {
        textDiv.dataset.canvasWidth = geom.width * viewport.scale;
      }
    }
  }

  function render(task) {
    if (task._canceled) {
      return;
    }
    var textLayerFrag = task._container;
    var textDivs = task._textDivs;
    var capability = task._capability;
    var textDivsLength = textDivs.length;

    // No point in rendering many divs as it would make the browser
    // unusable even after the divs are rendered.
    if (textDivsLength > MAX_TEXT_DIVS_TO_RENDER) {
      capability.resolve();
      return;
    }

    var canvas = document.createElement('canvas');
    canvas.mozOpaque = true;
    var ctx = canvas.getContext('2d', {alpha: false});

    var lastFontSize;
    var lastFontFamily;
    for (var i = 0; i < textDivsLength; i++) {
      var textDiv = textDivs[i];
      if (textDiv.dataset.isWhitespace !== undefined) {
        continue;
      }

      var fontSize = textDiv.style.fontSize;
      var fontFamily = textDiv.style.fontFamily;

      // Only build font string and set to context if different from last.
      if (fontSize !== lastFontSize || fontFamily !== lastFontFamily) {
        ctx.font = fontSize + ' ' + fontFamily;
        lastFontSize = fontSize;
        lastFontFamily = fontFamily;
      }

      var width = ctx.measureText(textDiv.textContent).width;
      if (width > 0) {
        textLayerFrag.appendChild(textDiv);
        var transform;
        if (textDiv.dataset.canvasWidth !== undefined) {
          // Dataset values come of type string.
          var textScale = textDiv.dataset.canvasWidth / width;
          transform = 'scaleX(' + textScale + ')';
        } else {
          transform = '';
        }
        var rotation = textDiv.dataset.angle;
        if (rotation) {
          transform = 'rotate(' + rotation + 'deg) ' + transform;
        }
        if (transform) {
          CustomStyle.setProp('transform' , textDiv, transform);
        }
      }
    }
    capability.resolve();
  }

  /**
   * Text layer rendering task.
   *
   * @param {TextContent} textContent
   * @param {HTMLElement} container
   * @param {PDFJS.PageViewport} viewport
   * @param {Array} textDivs
   * @private
   */
  function TextLayerRenderTask(textContent, container, viewport, textDivs) {
    this._textContent = textContent;
    this._container = container;
    this._viewport = viewport;
    textDivs = textDivs || [];
    this._textDivs = textDivs;
    this._canceled = false;
    this._capability = createPromiseCapability();
    this._renderTimer = null;
  }
  TextLayerRenderTask.prototype = {
    get promise() {
      return this._capability.promise;
    },

    cancel: function TextLayer_cancel() {
      this._canceled = true;
      if (this._renderTimer !== null) {
        clearTimeout(this._renderTimer);
        this._renderTimer = null;
      }
      this._capability.reject('canceled');
    },

    _render: function TextLayer_render(timeout) {
      var textItems = this._textContent.items;
      var styles = this._textContent.styles;
      var textDivs = this._textDivs;
      var viewport = this._viewport;
      for (var i = 0, len = textItems.length; i < len; i++) {
        appendText(textDivs, viewport, textItems[i], styles);
      }

      if (!timeout) { // Render right away
        render(this);
      } else { // Schedule
        var self = this;
        this._renderTimer = setTimeout(function() {
          render(self);
          self._renderTimer = null;
        }, timeout);
      }
    }
  };


  /**
   * Starts rendering of the text layer.
   *
   * @param {TextLayerRenderParameters} renderParameters
   * @returns {TextLayerRenderTask}
   */
  function renderTextLayer(renderParameters) {
    var task = new TextLayerRenderTask(renderParameters.textContent,
                                       renderParameters.container,
                                       renderParameters.viewport,
                                       renderParameters.textDivs);
    task._render(renderParameters.timeout);
    return task;
  }

  return renderTextLayer;
})();

PDFJS.renderTextLayer = renderTextLayer;

exports.renderTextLayer = renderTextLayer;
}));


(function (root, factory) {
  {
    factory((root.pdfjsDisplayWebGL = {}), root.pdfjsSharedUtil);
  }
}(this, function (exports, sharedUtil) {

var shadow = sharedUtil.shadow;

var WebGLUtils = (function WebGLUtilsClosure() {
  function loadShader(gl, code, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var errorMsg = gl.getShaderInfoLog(shader);
      throw new Error('Error during shader compilation: ' + errorMsg);
    }
    return shader;
  }
  function createVertexShader(gl, code) {
    return loadShader(gl, code, gl.VERTEX_SHADER);
  }
  function createFragmentShader(gl, code) {
    return loadShader(gl, code, gl.FRAGMENT_SHADER);
  }
  function createProgram(gl, shaders) {
    var program = gl.createProgram();
    for (var i = 0, ii = shaders.length; i < ii; ++i) {
      gl.attachShader(program, shaders[i]);
    }
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      var errorMsg = gl.getProgramInfoLog(program);
      throw new Error('Error during program linking: ' + errorMsg);
    }
    return program;
  }
  function createTexture(gl, image, textureId) {
    gl.activeTexture(textureId);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
  }

  var currentGL, currentCanvas;
  function generateGL() {
    if (currentGL) {
      return;
    }
    currentCanvas = document.createElement('canvas');
    currentGL = currentCanvas.getContext('webgl',
      { premultipliedalpha: false });
  }

  var smaskVertexShaderCode = '\
  attribute vec2 a_position;                                    \
  attribute vec2 a_texCoord;                                    \
                                                                \
  uniform vec2 u_resolution;                                    \
                                                                \
  varying vec2 v_texCoord;                                      \
                                                                \
  void main() {                                                 \
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;   \
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);          \
                                                                \
    v_texCoord = a_texCoord;                                    \
  }                                                             ';

  var smaskFragmentShaderCode = '\
  precision mediump float;                                      \
                                                                \
  uniform vec4 u_backdrop;                                      \
  uniform int u_subtype;                                        \
  uniform sampler2D u_image;                                    \
  uniform sampler2D u_mask;                                     \
                                                                \
  varying vec2 v_texCoord;                                      \
                                                                \
  void main() {                                                 \
    vec4 imageColor = texture2D(u_image, v_texCoord);           \
    vec4 maskColor = texture2D(u_mask, v_texCoord);             \
    if (u_backdrop.a > 0.0) {                                   \
      maskColor.rgb = maskColor.rgb * maskColor.a +             \
                      u_backdrop.rgb * (1.0 - maskColor.a);     \
    }                                                           \
    float lum;                                                  \
    if (u_subtype == 0) {                                       \
      lum = maskColor.a;                                        \
    } else {                                                    \
      lum = maskColor.r * 0.3 + maskColor.g * 0.59 +            \
            maskColor.b * 0.11;                                 \
    }                                                           \
    imageColor.a *= lum;                                        \
    imageColor.rgb *= imageColor.a;                             \
    gl_FragColor = imageColor;                                  \
  }                                                             ';

  var smaskCache = null;

  function initSmaskGL() {
    var canvas, gl;

    generateGL();
    canvas = currentCanvas;
    currentCanvas = null;
    gl = currentGL;
    currentGL = null;

    // setup a GLSL program
    var vertexShader = createVertexShader(gl, smaskVertexShaderCode);
    var fragmentShader = createFragmentShader(gl, smaskFragmentShaderCode);
    var program = createProgram(gl, [vertexShader, fragmentShader]);
    gl.useProgram(program);

    var cache = {};
    cache.gl = gl;
    cache.canvas = canvas;
    cache.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    cache.positionLocation = gl.getAttribLocation(program, 'a_position');
    cache.backdropLocation = gl.getUniformLocation(program, 'u_backdrop');
    cache.subtypeLocation = gl.getUniformLocation(program, 'u_subtype');

    var texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    var texLayerLocation = gl.getUniformLocation(program, 'u_image');
    var texMaskLocation = gl.getUniformLocation(program, 'u_mask');

    // provide texture coordinates for the rectangle.
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1i(texLayerLocation, 0);
    gl.uniform1i(texMaskLocation, 1);

    smaskCache = cache;
  }

  function composeSMask(layer, mask, properties) {
    var width = layer.width, height = layer.height;

    if (!smaskCache) {
      initSmaskGL();
    }
    var cache = smaskCache,canvas = cache.canvas, gl = cache.gl;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(cache.resolutionLocation, width, height);

    if (properties.backdrop) {
      gl.uniform4f(cache.resolutionLocation, properties.backdrop[0],
                   properties.backdrop[1], properties.backdrop[2], 1);
    } else {
      gl.uniform4f(cache.resolutionLocation, 0, 0, 0, 0);
    }
    gl.uniform1i(cache.subtypeLocation,
                 properties.subtype === 'Luminosity' ? 1 : 0);

    // Create a textures
    var texture = createTexture(gl, layer, gl.TEXTURE0);
    var maskTexture = createTexture(gl, mask, gl.TEXTURE1);


    // Create a buffer and put a single clipspace rectangle in
    // it (2 triangles)
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      width, 0,
      0, height,
      0, height,
      width, 0,
      width, height]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(cache.positionLocation);
    gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);

    // draw
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.flush();

    gl.deleteTexture(texture);
    gl.deleteTexture(maskTexture);
    gl.deleteBuffer(buffer);

    return canvas;
  }

  var figuresVertexShaderCode = '\
  attribute vec2 a_position;                                    \
  attribute vec3 a_color;                                       \
                                                                \
  uniform vec2 u_resolution;                                    \
  uniform vec2 u_scale;                                         \
  uniform vec2 u_offset;                                        \
                                                                \
  varying vec4 v_color;                                         \
                                                                \
  void main() {                                                 \
    vec2 position = (a_position + u_offset) * u_scale;          \
    vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;     \
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);          \
                                                                \
    v_color = vec4(a_color / 255.0, 1.0);                       \
  }                                                             ';

  var figuresFragmentShaderCode = '\
  precision mediump float;                                      \
                                                                \
  varying vec4 v_color;                                         \
                                                                \
  void main() {                                                 \
    gl_FragColor = v_color;                                     \
  }                                                             ';

  var figuresCache = null;

  function initFiguresGL() {
    var canvas, gl;

    generateGL();
    canvas = currentCanvas;
    currentCanvas = null;
    gl = currentGL;
    currentGL = null;

    // setup a GLSL program
    var vertexShader = createVertexShader(gl, figuresVertexShaderCode);
    var fragmentShader = createFragmentShader(gl, figuresFragmentShaderCode);
    var program = createProgram(gl, [vertexShader, fragmentShader]);
    gl.useProgram(program);

    var cache = {};
    cache.gl = gl;
    cache.canvas = canvas;
    cache.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    cache.scaleLocation = gl.getUniformLocation(program, 'u_scale');
    cache.offsetLocation = gl.getUniformLocation(program, 'u_offset');
    cache.positionLocation = gl.getAttribLocation(program, 'a_position');
    cache.colorLocation = gl.getAttribLocation(program, 'a_color');

    figuresCache = cache;
  }

  function drawFigures(width, height, backgroundColor, figures, context) {
    if (!figuresCache) {
      initFiguresGL();
    }
    var cache = figuresCache, canvas = cache.canvas, gl = cache.gl;

    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(cache.resolutionLocation, width, height);

    // count triangle points
    var count = 0;
    var i, ii, rows;
    for (i = 0, ii = figures.length; i < ii; i++) {
      switch (figures[i].type) {
        case 'lattice':
          rows = (figures[i].coords.length / figures[i].verticesPerRow) | 0;
          count += (rows - 1) * (figures[i].verticesPerRow - 1) * 6;
          break;
        case 'triangles':
          count += figures[i].coords.length;
          break;
      }
    }
    // transfer data
    var coords = new Float32Array(count * 2);
    var colors = new Uint8Array(count * 3);
    var coordsMap = context.coords, colorsMap = context.colors;
    var pIndex = 0, cIndex = 0;
    for (i = 0, ii = figures.length; i < ii; i++) {
      var figure = figures[i], ps = figure.coords, cs = figure.colors;
      switch (figure.type) {
        case 'lattice':
          var cols = figure.verticesPerRow;
          rows = (ps.length / cols) | 0;
          for (var row = 1; row < rows; row++) {
            var offset = row * cols + 1;
            for (var col = 1; col < cols; col++, offset++) {
              coords[pIndex] = coordsMap[ps[offset - cols - 1]];
              coords[pIndex + 1] = coordsMap[ps[offset - cols - 1] + 1];
              coords[pIndex + 2] = coordsMap[ps[offset - cols]];
              coords[pIndex + 3] = coordsMap[ps[offset - cols] + 1];
              coords[pIndex + 4] = coordsMap[ps[offset - 1]];
              coords[pIndex + 5] = coordsMap[ps[offset - 1] + 1];
              colors[cIndex] = colorsMap[cs[offset - cols - 1]];
              colors[cIndex + 1] = colorsMap[cs[offset - cols - 1] + 1];
              colors[cIndex + 2] = colorsMap[cs[offset - cols - 1] + 2];
              colors[cIndex + 3] = colorsMap[cs[offset - cols]];
              colors[cIndex + 4] = colorsMap[cs[offset - cols] + 1];
              colors[cIndex + 5] = colorsMap[cs[offset - cols] + 2];
              colors[cIndex + 6] = colorsMap[cs[offset - 1]];
              colors[cIndex + 7] = colorsMap[cs[offset - 1] + 1];
              colors[cIndex + 8] = colorsMap[cs[offset - 1] + 2];

              coords[pIndex + 6] = coords[pIndex + 2];
              coords[pIndex + 7] = coords[pIndex + 3];
              coords[pIndex + 8] = coords[pIndex + 4];
              coords[pIndex + 9] = coords[pIndex + 5];
              coords[pIndex + 10] = coordsMap[ps[offset]];
              coords[pIndex + 11] = coordsMap[ps[offset] + 1];
              colors[cIndex + 9] = colors[cIndex + 3];
              colors[cIndex + 10] = colors[cIndex + 4];
              colors[cIndex + 11] = colors[cIndex + 5];
              colors[cIndex + 12] = colors[cIndex + 6];
              colors[cIndex + 13] = colors[cIndex + 7];
              colors[cIndex + 14] = colors[cIndex + 8];
              colors[cIndex + 15] = colorsMap[cs[offset]];
              colors[cIndex + 16] = colorsMap[cs[offset] + 1];
              colors[cIndex + 17] = colorsMap[cs[offset] + 2];
              pIndex += 12;
              cIndex += 18;
            }
          }
          break;
        case 'triangles':
          for (var j = 0, jj = ps.length; j < jj; j++) {
            coords[pIndex] = coordsMap[ps[j]];
            coords[pIndex + 1] = coordsMap[ps[j] + 1];
            colors[cIndex] = colorsMap[cs[j]];
            colors[cIndex + 1] = colorsMap[cs[j] + 1];
            colors[cIndex + 2] = colorsMap[cs[j] + 2];
            pIndex += 2;
            cIndex += 3;
          }
          break;
      }
    }

    // draw
    if (backgroundColor) {
      gl.clearColor(backgroundColor[0] / 255, backgroundColor[1] / 255,
                    backgroundColor[2] / 255, 1.0);
    } else {
      gl.clearColor(0, 0, 0, 0);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);

    var coordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(cache.positionLocation);
    gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);

    var colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(cache.colorLocation);
    gl.vertexAttribPointer(cache.colorLocation, 3, gl.UNSIGNED_BYTE, false,
                           0, 0);

    gl.uniform2f(cache.scaleLocation, context.scaleX, context.scaleY);
    gl.uniform2f(cache.offsetLocation, context.offsetX, context.offsetY);

    gl.drawArrays(gl.TRIANGLES, 0, count);

    gl.flush();

    gl.deleteBuffer(coordsBuffer);
    gl.deleteBuffer(colorsBuffer);

    return canvas;
  }

  function cleanup() {
    if (smaskCache && smaskCache.canvas) {
      smaskCache.canvas.width = 0;
      smaskCache.canvas.height = 0;
    }
    if (figuresCache && figuresCache.canvas) {
      figuresCache.canvas.width = 0;
      figuresCache.canvas.height = 0;
    }
    smaskCache = null;
    figuresCache = null;
  }

  return {
    get isEnabled() {
      if (PDFJS.disableWebGL) {
        return false;
      }
      var enabled = false;
      try {
        generateGL();
        enabled = !!currentGL;
      } catch (e) { }
      return shadow(this, 'isEnabled', enabled);
    },
    composeSMask: composeSMask,
    drawFigures: drawFigures,
    clear: cleanup
  };
})();

exports.WebGLUtils = WebGLUtils;
}));


(function (root, factory) {
  {
    factory((root.pdfjsDisplayPatternHelper = {}), root.pdfjsSharedUtil,
      root.pdfjsDisplayWebGL);
  }
}(this, function (exports, sharedUtil, displayWebGL) {

var Util = sharedUtil.Util;
var info = sharedUtil.info;
var isArray = sharedUtil.isArray;
var error = sharedUtil.error;
var WebGLUtils = displayWebGL.WebGLUtils;

var ShadingIRs = {};

ShadingIRs.RadialAxial = {
  fromIR: function RadialAxial_fromIR(raw) {
    var type = raw[1];
    var colorStops = raw[2];
    var p0 = raw[3];
    var p1 = raw[4];
    var r0 = raw[5];
    var r1 = raw[6];
    return {
      type: 'Pattern',
      getPattern: function RadialAxial_getPattern(ctx) {
        var grad;
        if (type === 'axial') {
          grad = ctx.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
        } else if (type === 'radial') {
          grad = ctx.createRadialGradient(p0[0], p0[1], r0, p1[0], p1[1], r1);
        }

        for (var i = 0, ii = colorStops.length; i < ii; ++i) {
          var c = colorStops[i];
          grad.addColorStop(c[0], c[1]);
        }
        return grad;
      }
    };
  }
};

var createMeshCanvas = (function createMeshCanvasClosure() {
  function drawTriangle(data, context, p1, p2, p3, c1, c2, c3) {
    // Very basic Gouraud-shaded triangle rasterization algorithm.
    var coords = context.coords, colors = context.colors;
    var bytes = data.data, rowSize = data.width * 4;
    var tmp;
    if (coords[p1 + 1] > coords[p2 + 1]) {
      tmp = p1; p1 = p2; p2 = tmp; tmp = c1; c1 = c2; c2 = tmp;
    }
    if (coords[p2 + 1] > coords[p3 + 1]) {
      tmp = p2; p2 = p3; p3 = tmp; tmp = c2; c2 = c3; c3 = tmp;
    }
    if (coords[p1 + 1] > coords[p2 + 1]) {
      tmp = p1; p1 = p2; p2 = tmp; tmp = c1; c1 = c2; c2 = tmp;
    }
    var x1 = (coords[p1] + context.offsetX) * context.scaleX;
    var y1 = (coords[p1 + 1] + context.offsetY) * context.scaleY;
    var x2 = (coords[p2] + context.offsetX) * context.scaleX;
    var y2 = (coords[p2 + 1] + context.offsetY) * context.scaleY;
    var x3 = (coords[p3] + context.offsetX) * context.scaleX;
    var y3 = (coords[p3 + 1] + context.offsetY) * context.scaleY;
    if (y1 >= y3) {
      return;
    }
    var c1r = colors[c1], c1g = colors[c1 + 1], c1b = colors[c1 + 2];
    var c2r = colors[c2], c2g = colors[c2 + 1], c2b = colors[c2 + 2];
    var c3r = colors[c3], c3g = colors[c3 + 1], c3b = colors[c3 + 2];

    var minY = Math.round(y1), maxY = Math.round(y3);
    var xa, car, cag, cab;
    var xb, cbr, cbg, cbb;
    var k;
    for (var y = minY; y <= maxY; y++) {
      if (y < y2) {
        k = y < y1 ? 0 : y1 === y2 ? 1 : (y1 - y) / (y1 - y2);
        xa = x1 - (x1 - x2) * k;
        car = c1r - (c1r - c2r) * k;
        cag = c1g - (c1g - c2g) * k;
        cab = c1b - (c1b - c2b) * k;
      } else {
        k = y > y3 ? 1 : y2 === y3 ? 0 : (y2 - y) / (y2 - y3);
        xa = x2 - (x2 - x3) * k;
        car = c2r - (c2r - c3r) * k;
        cag = c2g - (c2g - c3g) * k;
        cab = c2b - (c2b - c3b) * k;
      }
      k = y < y1 ? 0 : y > y3 ? 1 : (y1 - y) / (y1 - y3);
      xb = x1 - (x1 - x3) * k;
      cbr = c1r - (c1r - c3r) * k;
      cbg = c1g - (c1g - c3g) * k;
      cbb = c1b - (c1b - c3b) * k;
      var x1_ = Math.round(Math.min(xa, xb));
      var x2_ = Math.round(Math.max(xa, xb));
      var j = rowSize * y + x1_ * 4;
      for (var x = x1_; x <= x2_; x++) {
        k = (xa - x) / (xa - xb);
        k = k < 0 ? 0 : k > 1 ? 1 : k;
        bytes[j++] = (car - (car - cbr) * k) | 0;
        bytes[j++] = (cag - (cag - cbg) * k) | 0;
        bytes[j++] = (cab - (cab - cbb) * k) | 0;
        bytes[j++] = 255;
      }
    }
  }

  function drawFigure(data, figure, context) {
    var ps = figure.coords;
    var cs = figure.colors;
    var i, ii;
    switch (figure.type) {
      case 'lattice':
        var verticesPerRow = figure.verticesPerRow;
        var rows = Math.floor(ps.length / verticesPerRow) - 1;
        var cols = verticesPerRow - 1;
        for (i = 0; i < rows; i++) {
          var q = i * verticesPerRow;
          for (var j = 0; j < cols; j++, q++) {
            drawTriangle(data, context,
              ps[q], ps[q + 1], ps[q + verticesPerRow],
              cs[q], cs[q + 1], cs[q + verticesPerRow]);
            drawTriangle(data, context,
              ps[q + verticesPerRow + 1], ps[q + 1], ps[q + verticesPerRow],
              cs[q + verticesPerRow + 1], cs[q + 1], cs[q + verticesPerRow]);
          }
        }
        break;
      case 'triangles':
        for (i = 0, ii = ps.length; i < ii; i += 3) {
          drawTriangle(data, context,
            ps[i], ps[i + 1], ps[i + 2],
            cs[i], cs[i + 1], cs[i + 2]);
        }
        break;
      default:
        error('illigal figure');
        break;
    }
  }

  function createMeshCanvas(bounds, combinesScale, coords, colors, figures,
                            backgroundColor, cachedCanvases) {
    // we will increase scale on some weird factor to let antialiasing take
    // care of "rough" edges
    var EXPECTED_SCALE = 1.1;
    // MAX_PATTERN_SIZE is used to avoid OOM situation.
    var MAX_PATTERN_SIZE = 3000; // 10in @ 300dpi shall be enough

    var offsetX = Math.floor(bounds[0]);
    var offsetY = Math.floor(bounds[1]);
    var boundsWidth = Math.ceil(bounds[2]) - offsetX;
    var boundsHeight = Math.ceil(bounds[3]) - offsetY;

    var width = Math.min(Math.ceil(Math.abs(boundsWidth * combinesScale[0] *
      EXPECTED_SCALE)), MAX_PATTERN_SIZE);
    var height = Math.min(Math.ceil(Math.abs(boundsHeight * combinesScale[1] *
      EXPECTED_SCALE)), MAX_PATTERN_SIZE);
    var scaleX = boundsWidth / width;
    var scaleY = boundsHeight / height;

    var context = {
      coords: coords,
      colors: colors,
      offsetX: -offsetX,
      offsetY: -offsetY,
      scaleX: 1 / scaleX,
      scaleY: 1 / scaleY
    };

    var canvas, tmpCanvas, i, ii;
    if (WebGLUtils.isEnabled) {
      canvas = WebGLUtils.drawFigures(width, height, backgroundColor,
                                      figures, context);

      // https://bugzilla.mozilla.org/show_bug.cgi?id=972126
      tmpCanvas = cachedCanvases.getCanvas('mesh', width, height, false);
      tmpCanvas.context.drawImage(canvas, 0, 0);
      canvas = tmpCanvas.canvas;
    } else {
      tmpCanvas = cachedCanvases.getCanvas('mesh', width, height, false);
      var tmpCtx = tmpCanvas.context;

      var data = tmpCtx.createImageData(width, height);
      if (backgroundColor) {
        var bytes = data.data;
        for (i = 0, ii = bytes.length; i < ii; i += 4) {
          bytes[i] = backgroundColor[0];
          bytes[i + 1] = backgroundColor[1];
          bytes[i + 2] = backgroundColor[2];
          bytes[i + 3] = 255;
        }
      }
      for (i = 0; i < figures.length; i++) {
        drawFigure(data, figures[i], context);
      }
      tmpCtx.putImageData(data, 0, 0);
      canvas = tmpCanvas.canvas;
    }

    return {canvas: canvas, offsetX: offsetX, offsetY: offsetY,
            scaleX: scaleX, scaleY: scaleY};
  }
  return createMeshCanvas;
})();

ShadingIRs.Mesh = {
  fromIR: function Mesh_fromIR(raw) {
    //var type = raw[1];
    var coords = raw[2];
    var colors = raw[3];
    var figures = raw[4];
    var bounds = raw[5];
    var matrix = raw[6];
    //var bbox = raw[7];
    var background = raw[8];
    return {
      type: 'Pattern',
      getPattern: function Mesh_getPattern(ctx, owner, shadingFill) {
        var scale;
        if (shadingFill) {
          scale = Util.singularValueDecompose2dScale(ctx.mozCurrentTransform);
        } else {
          // Obtain scale from matrix and current transformation matrix.
          scale = Util.singularValueDecompose2dScale(owner.baseTransform);
          if (matrix) {
            var matrixScale = Util.singularValueDecompose2dScale(matrix);
            scale = [scale[0] * matrixScale[0],
                     scale[1] * matrixScale[1]];
          }
        }


        // Rasterizing on the main thread since sending/queue large canvases
        // might cause OOM.
        var temporaryPatternCanvas = createMeshCanvas(bounds, scale, coords,
          colors, figures, shadingFill ? null : background,
          owner.cachedCanvases);

        if (!shadingFill) {
          ctx.setTransform.apply(ctx, owner.baseTransform);
          if (matrix) {
            ctx.transform.apply(ctx, matrix);
          }
        }

        ctx.translate(temporaryPatternCanvas.offsetX,
                      temporaryPatternCanvas.offsetY);
        ctx.scale(temporaryPatternCanvas.scaleX,
                  temporaryPatternCanvas.scaleY);

        return ctx.createPattern(temporaryPatternCanvas.canvas, 'no-repeat');
      }
    };
  }
};

ShadingIRs.Dummy = {
  fromIR: function Dummy_fromIR() {
    return {
      type: 'Pattern',
      getPattern: function Dummy_fromIR_getPattern() {
        return 'hotpink';
      }
    };
  }
};

function getShadingPatternFromIR(raw) {
  var shadingIR = ShadingIRs[raw[0]];
  if (!shadingIR) {
    error('Unknown IR type: ' + raw[0]);
  }
  return shadingIR.fromIR(raw);
}

var TilingPattern = (function TilingPatternClosure() {
  var PaintType = {
    COLORED: 1,
    UNCOLORED: 2
  };

  var MAX_PATTERN_SIZE = 3000; // 10in @ 300dpi shall be enough

  function TilingPattern(IR, color, ctx, canvasGraphicsFactory, baseTransform) {
    this.operatorList = IR[2];
    this.matrix = IR[3] || [1, 0, 0, 1, 0, 0];
    this.bbox = IR[4];
    this.xstep = IR[5];
    this.ystep = IR[6];
    this.paintType = IR[7];
    this.tilingType = IR[8];
    this.color = color;
    this.canvasGraphicsFactory = canvasGraphicsFactory;
    this.baseTransform = baseTransform;
    this.type = 'Pattern';
    this.ctx = ctx;
  }

  TilingPattern.prototype = {
    createPatternCanvas: function TilinPattern_createPatternCanvas(owner) {
      var operatorList = this.operatorList;
      var bbox = this.bbox;
      var xstep = this.xstep;
      var ystep = this.ystep;
      var paintType = this.paintType;
      var tilingType = this.tilingType;
      var color = this.color;
      var canvasGraphicsFactory = this.canvasGraphicsFactory;

      info('TilingType: ' + tilingType);

      var x0 = bbox[0], y0 = bbox[1], x1 = bbox[2], y1 = bbox[3];

      var topLeft = [x0, y0];
      // we want the canvas to be as large as the step size
      var botRight = [x0 + xstep, y0 + ystep];

      var width = botRight[0] - topLeft[0];
      var height = botRight[1] - topLeft[1];

      // Obtain scale from matrix and current transformation matrix.
      var matrixScale = Util.singularValueDecompose2dScale(this.matrix);
      var curMatrixScale = Util.singularValueDecompose2dScale(
        this.baseTransform);
      var combinedScale = [matrixScale[0] * curMatrixScale[0],
        matrixScale[1] * curMatrixScale[1]];

      // MAX_PATTERN_SIZE is used to avoid OOM situation.
      // Use width and height values that are as close as possible to the end
      // result when the pattern is used. Too low value makes the pattern look
      // blurry. Too large value makes it look too crispy.
      width = Math.min(Math.ceil(Math.abs(width * combinedScale[0])),
        MAX_PATTERN_SIZE);

      height = Math.min(Math.ceil(Math.abs(height * combinedScale[1])),
        MAX_PATTERN_SIZE);

      var tmpCanvas = owner.cachedCanvases.getCanvas('pattern',
        width, height, true);
      var tmpCtx = tmpCanvas.context;
      var graphics = canvasGraphicsFactory.createCanvasGraphics(tmpCtx);
      graphics.groupLevel = owner.groupLevel;

      this.setFillAndStrokeStyleToContext(tmpCtx, paintType, color);

      this.setScale(width, height, xstep, ystep);
      this.transformToScale(graphics);

      // transform coordinates to pattern space
      var tmpTranslate = [1, 0, 0, 1, -topLeft[0], -topLeft[1]];
      graphics.transform.apply(graphics, tmpTranslate);

      this.clipBbox(graphics, bbox, x0, y0, x1, y1);

      graphics.executeOperatorList(operatorList);
      return tmpCanvas.canvas;
    },

    setScale: function TilingPattern_setScale(width, height, xstep, ystep) {
      this.scale = [width / xstep, height / ystep];
    },

    transformToScale: function TilingPattern_transformToScale(graphics) {
      var scale = this.scale;
      var tmpScale = [scale[0], 0, 0, scale[1], 0, 0];
      graphics.transform.apply(graphics, tmpScale);
    },

    scaleToContext: function TilingPattern_scaleToContext() {
      var scale = this.scale;
      this.ctx.scale(1 / scale[0], 1 / scale[1]);
    },

    clipBbox: function clipBbox(graphics, bbox, x0, y0, x1, y1) {
      if (bbox && isArray(bbox) && bbox.length === 4) {
        var bboxWidth = x1 - x0;
        var bboxHeight = y1 - y0;
        graphics.ctx.rect(x0, y0, bboxWidth, bboxHeight);
        graphics.clip();
        graphics.endPath();
      }
    },

    setFillAndStrokeStyleToContext:
      function setFillAndStrokeStyleToContext(context, paintType, color) {
        switch (paintType) {
          case PaintType.COLORED:
            var ctx = this.ctx;
            context.fillStyle = ctx.fillStyle;
            context.strokeStyle = ctx.strokeStyle;
            break;
          case PaintType.UNCOLORED:
            var cssColor = Util.makeCssRgb(color[0], color[1], color[2]);
            context.fillStyle = cssColor;
            context.strokeStyle = cssColor;
            break;
          default:
            error('Unsupported paint type: ' + paintType);
        }
      },

    getPattern: function TilingPattern_getPattern(ctx, owner) {
      var temporaryPatternCanvas = this.createPatternCanvas(owner);

      ctx = this.ctx;
      ctx.setTransform.apply(ctx, this.baseTransform);
      ctx.transform.apply(ctx, this.matrix);
      this.scaleToContext();

      return ctx.createPattern(temporaryPatternCanvas, 'repeat');
    }
  };

  return TilingPattern;
})();

exports.getShadingPatternFromIR = getShadingPatternFromIR;
exports.TilingPattern = TilingPattern;
}));


(function (root, factory) {
  {
    factory((root.pdfjsDisplayCanvas = {}), root.pdfjsSharedUtil,
      root.pdfjsDisplayPatternHelper, root.pdfjsDisplayWebGL);
  }
}(this, function (exports, sharedUtil, displayPatternHelper, displayWebGL) {

var FONT_IDENTITY_MATRIX = sharedUtil.FONT_IDENTITY_MATRIX;
var IDENTITY_MATRIX = sharedUtil.IDENTITY_MATRIX;
var ImageKind = sharedUtil.ImageKind;
var OPS = sharedUtil.OPS;
var TextRenderingMode = sharedUtil.TextRenderingMode;
var Uint32ArrayView = sharedUtil.Uint32ArrayView;
var Util = sharedUtil.Util;
var assert = sharedUtil.assert;
var info = sharedUtil.info;
var isNum = sharedUtil.isNum;
var isArray = sharedUtil.isArray;
var error = sharedUtil.error;
var shadow = sharedUtil.shadow;
var warn = sharedUtil.warn;
var TilingPattern = displayPatternHelper.TilingPattern;
var getShadingPatternFromIR = displayPatternHelper.getShadingPatternFromIR;
var WebGLUtils = displayWebGL.WebGLUtils;

// <canvas> contexts store most of the state we need natively.
// However, PDF needs a bit more state, which we store here.

// Minimal font size that would be used during canvas fillText operations.
var MIN_FONT_SIZE = 16;
// Maximum font size that would be used during canvas fillText operations.
var MAX_FONT_SIZE = 100;
var MAX_GROUP_SIZE = 4096;

// Heuristic value used when enforcing minimum line widths.
var MIN_WIDTH_FACTOR = 0.65;

var COMPILE_TYPE3_GLYPHS = true;
var MAX_SIZE_TO_COMPILE = 1000;

var FULL_CHUNK_HEIGHT = 16;

function createScratchCanvas(width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function addContextCurrentTransform(ctx) {
  // If the context doesn't expose a `mozCurrentTransform`, add a JS based one.
  if (!ctx.mozCurrentTransform) {
    ctx._originalSave = ctx.save;
    ctx._originalRestore = ctx.restore;
    ctx._originalRotate = ctx.rotate;
    ctx._originalScale = ctx.scale;
    ctx._originalTranslate = ctx.translate;
    ctx._originalTransform = ctx.transform;
    ctx._originalSetTransform = ctx.setTransform;

    ctx._transformMatrix = ctx._transformMatrix || [1, 0, 0, 1, 0, 0];
    ctx._transformStack = [];

    Object.defineProperty(ctx, 'mozCurrentTransform', {
      get: function getCurrentTransform() {
        return this._transformMatrix;
      }
    });

    Object.defineProperty(ctx, 'mozCurrentTransformInverse', {
      get: function getCurrentTransformInverse() {
        // Calculation done using WolframAlpha:
        // http://www.wolframalpha.com/input/?
        //   i=Inverse+{{a%2C+c%2C+e}%2C+{b%2C+d%2C+f}%2C+{0%2C+0%2C+1}}

        var m = this._transformMatrix;
        var a = m[0], b = m[1], c = m[2], d = m[3], e = m[4], f = m[5];

        var ad_bc = a * d - b * c;
        var bc_ad = b * c - a * d;

        return [
          d / ad_bc,
          b / bc_ad,
          c / bc_ad,
          a / ad_bc,
          (d * e - c * f) / bc_ad,
          (b * e - a * f) / ad_bc
        ];
      }
    });

    ctx.save = function ctxSave() {
      var old = this._transformMatrix;
      this._transformStack.push(old);
      this._transformMatrix = old.slice(0, 6);

      this._originalSave();
    };

    ctx.restore = function ctxRestore() {
      var prev = this._transformStack.pop();
      if (prev) {
        this._transformMatrix = prev;
        this._originalRestore();
      }
    };

    ctx.translate = function ctxTranslate(x, y) {
      var m = this._transformMatrix;
      m[4] = m[0] * x + m[2] * y + m[4];
      m[5] = m[1] * x + m[3] * y + m[5];

      this._originalTranslate(x, y);
    };

    ctx.scale = function ctxScale(x, y) {
      var m = this._transformMatrix;
      m[0] = m[0] * x;
      m[1] = m[1] * x;
      m[2] = m[2] * y;
      m[3] = m[3] * y;

      this._originalScale(x, y);
    };

    ctx.transform = function ctxTransform(a, b, c, d, e, f) {
      var m = this._transformMatrix;
      this._transformMatrix = [
        m[0] * a + m[2] * b,
        m[1] * a + m[3] * b,
        m[0] * c + m[2] * d,
        m[1] * c + m[3] * d,
        m[0] * e + m[2] * f + m[4],
        m[1] * e + m[3] * f + m[5]
      ];

      ctx._originalTransform(a, b, c, d, e, f);
    };

    ctx.setTransform = function ctxSetTransform(a, b, c, d, e, f) {
      this._transformMatrix = [a, b, c, d, e, f];

      ctx._originalSetTransform(a, b, c, d, e, f);
    };

    ctx.rotate = function ctxRotate(angle) {
      var cosValue = Math.cos(angle);
      var sinValue = Math.sin(angle);

      var m = this._transformMatrix;
      this._transformMatrix = [
        m[0] * cosValue + m[2] * sinValue,
        m[1] * cosValue + m[3] * sinValue,
        m[0] * (-sinValue) + m[2] * cosValue,
        m[1] * (-sinValue) + m[3] * cosValue,
        m[4],
        m[5]
      ];

      this._originalRotate(angle);
    };
  }
}

var CachedCanvases = (function CachedCanvasesClosure() {
  function CachedCanvases() {
    this.cache = Object.create(null);
  }
  CachedCanvases.prototype = {
    getCanvas: function CachedCanvases_getCanvas(id, width, height,
                                                 trackTransform) {
      var canvasEntry;
      if (this.cache[id] !== undefined) {
        canvasEntry = this.cache[id];
        canvasEntry.canvas.width = width;
        canvasEntry.canvas.height = height;
        // reset canvas transform for emulated mozCurrentTransform, if needed
        canvasEntry.context.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        var canvas = createScratchCanvas(width, height);
        var ctx = canvas.getContext('2d');
        if (trackTransform) {
          addContextCurrentTransform(ctx);
        }
        this.cache[id] = canvasEntry = {canvas: canvas, context: ctx};
      }
      return canvasEntry;
    },
    clear: function () {
      for (var id in this.cache) {
        var canvasEntry = this.cache[id];
        // Zeroing the width and height causes Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        canvasEntry.canvas.width = 0;
        canvasEntry.canvas.height = 0;
        delete this.cache[id];
      }
    }
  };
  return CachedCanvases;
})();

function compileType3Glyph(imgData) {
  var POINT_TO_PROCESS_LIMIT = 1000;

  var width = imgData.width, height = imgData.height;
  var i, j, j0, width1 = width + 1;
  var points = new Uint8Array(width1 * (height + 1));
  var POINT_TYPES =
      new Uint8Array([0, 2, 4, 0, 1, 0, 5, 4, 8, 10, 0, 8, 0, 2, 1, 0]);

  // decodes bit-packed mask data
  var lineSize = (width + 7) & ~7, data0 = imgData.data;
  var data = new Uint8Array(lineSize * height), pos = 0, ii;
  for (i = 0, ii = data0.length; i < ii; i++) {
    var mask = 128, elem = data0[i];
    while (mask > 0) {
      data[pos++] = (elem & mask) ? 0 : 255;
      mask >>= 1;
    }
  }

  // finding iteresting points: every point is located between mask pixels,
  // so there will be points of the (width + 1)x(height + 1) grid. Every point
  // will have flags assigned based on neighboring mask pixels:
  //   4 | 8
  //   --P--
  //   2 | 1
  // We are interested only in points with the flags:
  //   - outside corners: 1, 2, 4, 8;
  //   - inside corners: 7, 11, 13, 14;
  //   - and, intersections: 5, 10.
  var count = 0;
  pos = 0;
  if (data[pos] !== 0) {
    points[0] = 1;
    ++count;
  }
  for (j = 1; j < width; j++) {
    if (data[pos] !== data[pos + 1]) {
      points[j] = data[pos] ? 2 : 1;
      ++count;
    }
    pos++;
  }
  if (data[pos] !== 0) {
    points[j] = 2;
    ++count;
  }
  for (i = 1; i < height; i++) {
    pos = i * lineSize;
    j0 = i * width1;
    if (data[pos - lineSize] !== data[pos]) {
      points[j0] = data[pos] ? 1 : 8;
      ++count;
    }
    // 'sum' is the position of the current pixel configuration in the 'TYPES'
    // array (in order 8-1-2-4, so we can use '>>2' to shift the column).
    var sum = (data[pos] ? 4 : 0) + (data[pos - lineSize] ? 8 : 0);
    for (j = 1; j < width; j++) {
      sum = (sum >> 2) + (data[pos + 1] ? 4 : 0) +
            (data[pos - lineSize + 1] ? 8 : 0);
      if (POINT_TYPES[sum]) {
        points[j0 + j] = POINT_TYPES[sum];
        ++count;
      }
      pos++;
    }
    if (data[pos - lineSize] !== data[pos]) {
      points[j0 + j] = data[pos] ? 2 : 4;
      ++count;
    }

    if (count > POINT_TO_PROCESS_LIMIT) {
      return null;
    }
  }

  pos = lineSize * (height - 1);
  j0 = i * width1;
  if (data[pos] !== 0) {
    points[j0] = 8;
    ++count;
  }
  for (j = 1; j < width; j++) {
    if (data[pos] !== data[pos + 1]) {
      points[j0 + j] = data[pos] ? 4 : 8;
      ++count;
    }
    pos++;
  }
  if (data[pos] !== 0) {
    points[j0 + j] = 4;
    ++count;
  }
  if (count > POINT_TO_PROCESS_LIMIT) {
    return null;
  }

  // building outlines
  var steps = new Int32Array([0, width1, -1, 0, -width1, 0, 0, 0, 1]);
  var outlines = [];
  for (i = 0; count && i <= height; i++) {
    var p = i * width1;
    var end = p + width;
    while (p < end && !points[p]) {
      p++;
    }
    if (p === end) {
      continue;
    }
    var coords = [p % width1, i];

    var type = points[p], p0 = p, pp;
    do {
      var step = steps[type];
      do {
        p += step;
      } while (!points[p]);

      pp = points[p];
      if (pp !== 5 && pp !== 10) {
        // set new direction
        type = pp;
        // delete mark
        points[p] = 0;
      } else { // type is 5 or 10, ie, a crossing
        // set new direction
        type = pp & ((0x33 * type) >> 4);
        // set new type for "future hit"
        points[p] &= (type >> 2 | type << 2);
      }

      coords.push(p % width1);
      coords.push((p / width1) | 0);
      --count;
    } while (p0 !== p);
    outlines.push(coords);
    --i;
  }

  var drawOutline = function(c) {
    c.save();
    // the path shall be painted in [0..1]x[0..1] space
    c.scale(1 / width, -1 / height);
    c.translate(0, -height);
    c.beginPath();
    for (var i = 0, ii = outlines.length; i < ii; i++) {
      var o = outlines[i];
      c.moveTo(o[0], o[1]);
      for (var j = 2, jj = o.length; j < jj; j += 2) {
        c.lineTo(o[j], o[j+1]);
      }
    }
    c.fill();
    c.beginPath();
    c.restore();
  };

  return drawOutline;
}

var CanvasExtraState = (function CanvasExtraStateClosure() {
  function CanvasExtraState(old) {
    // Are soft masks and alpha values shapes or opacities?
    this.alphaIsShape = false;
    this.fontSize = 0;
    this.fontSizeScale = 1;
    this.textMatrix = IDENTITY_MATRIX;
    this.textMatrixScale = 1;
    this.fontMatrix = FONT_IDENTITY_MATRIX;
    this.leading = 0;
    // Current point (in user coordinates)
    this.x = 0;
    this.y = 0;
    // Start of text line (in text coordinates)
    this.lineX = 0;
    this.lineY = 0;
    // Character and word spacing
    this.charSpacing = 0;
    this.wordSpacing = 0;
    this.textHScale = 1;
    this.textRenderingMode = TextRenderingMode.FILL;
    this.textRise = 0;
    // Default fore and background colors
    this.fillColor = '#000000';
    this.strokeColor = '#000000';
    this.patternFill = false;
    // Note: fill alpha applies to all non-stroking operations
    this.fillAlpha = 1;
    this.strokeAlpha = 1;
    this.lineWidth = 1;
    this.activeSMask = null; // nonclonable field (see the save method below)

    this.old = old;
  }

  CanvasExtraState.prototype = {
    clone: function CanvasExtraState_clone() {
      return Object.create(this);
    },
    setCurrentPoint: function CanvasExtraState_setCurrentPoint(x, y) {
      this.x = x;
      this.y = y;
    }
  };
  return CanvasExtraState;
})();

var CanvasGraphics = (function CanvasGraphicsClosure() {
  // Defines the time the executeOperatorList is going to be executing
  // before it stops and shedules a continue of execution.
  var EXECUTION_TIME = 15;
  // Defines the number of steps before checking the execution time
  var EXECUTION_STEPS = 10;

  function CanvasGraphics(canvasCtx, commonObjs, objs, imageLayer) {
    this.ctx = canvasCtx;
    this.current = new CanvasExtraState();
    this.stateStack = [];
    this.pendingClip = null;
    this.pendingEOFill = false;
    this.res = null;
    this.xobjs = null;
    this.commonObjs = commonObjs;
    this.objs = objs;
    this.imageLayer = imageLayer;
    this.groupStack = [];
    this.processingType3 = null;
    // Patterns are painted relative to the initial page/form transform, see pdf
    // spec 8.7.2 NOTE 1.
    this.baseTransform = null;
    this.baseTransformStack = [];
    this.groupLevel = 0;
    this.smaskStack = [];
    this.smaskCounter = 0;
    this.tempSMask = null;
    this.cachedCanvases = new CachedCanvases();
    if (canvasCtx) {
      // NOTE: if mozCurrentTransform is polyfilled, then the current state of
      // the transformation must already be set in canvasCtx._transformMatrix.
      addContextCurrentTransform(canvasCtx);
    }
    this.cachedGetSinglePixelWidth = null;
  }

  function putBinaryImageData(ctx, imgData) {
    if (typeof ImageData !== 'undefined' && imgData instanceof ImageData) {
      ctx.putImageData(imgData, 0, 0);
      return;
    }

    // Put the image data to the canvas in chunks, rather than putting the
    // whole image at once.  This saves JS memory, because the ImageData object
    // is smaller. It also possibly saves C++ memory within the implementation
    // of putImageData(). (E.g. in Firefox we make two short-lived copies of
    // the data passed to putImageData()). |n| shouldn't be too small, however,
    // because too many putImageData() calls will slow things down.
    //
    // Note: as written, if the last chunk is partial, the putImageData() call
    // will (conceptually) put pixels past the bounds of the canvas.  But
    // that's ok; any such pixels are ignored.

    var height = imgData.height, width = imgData.width;
    var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
    var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
    var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;

    var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
    var srcPos = 0, destPos;
    var src = imgData.data;
    var dest = chunkImgData.data;
    var i, j, thisChunkHeight, elemsInThisChunk;

    // There are multiple forms in which the pixel data can be passed, and
    // imgData.kind tells us which one this is.
    if (imgData.kind === ImageKind.GRAYSCALE_1BPP) {
      // Grayscale, 1 bit per pixel (i.e. black-and-white).
      var srcLength = src.byteLength;
      var dest32 = PDFJS.hasCanvasTypedArrays ? new Uint32Array(dest.buffer) :
        new Uint32ArrayView(dest);
      var dest32DataLength = dest32.length;
      var fullSrcDiff = (width + 7) >> 3;
      var white = 0xFFFFFFFF;
      var black = (PDFJS.isLittleEndian || !PDFJS.hasCanvasTypedArrays) ?
        0xFF000000 : 0x000000FF;
      for (i = 0; i < totalChunks; i++) {
        thisChunkHeight =
          (i < fullChunks) ? FULL_CHUNK_HEIGHT : partialChunkHeight;
        destPos = 0;
        for (j = 0; j < thisChunkHeight; j++) {
          var srcDiff = srcLength - srcPos;
          var k = 0;
          var kEnd = (srcDiff > fullSrcDiff) ? width : srcDiff * 8 - 7;
          var kEndUnrolled = kEnd & ~7;
          var mask = 0;
          var srcByte = 0;
          for (; k < kEndUnrolled; k += 8) {
            srcByte = src[srcPos++];
            dest32[destPos++] = (srcByte & 128) ? white : black;
            dest32[destPos++] = (srcByte & 64) ? white : black;
            dest32[destPos++] = (srcByte & 32) ? white : black;
            dest32[destPos++] = (srcByte & 16) ? white : black;
            dest32[destPos++] = (srcByte & 8) ? white : black;
            dest32[destPos++] = (srcByte & 4) ? white : black;
            dest32[destPos++] = (srcByte & 2) ? white : black;
            dest32[destPos++] = (srcByte & 1) ? white : black;
          }
          for (; k < kEnd; k++) {
             if (mask === 0) {
               srcByte = src[srcPos++];
               mask = 128;
             }

            dest32[destPos++] = (srcByte & mask) ? white : black;
            mask >>= 1;
          }
        }
        // We ran out of input. Make all remaining pixels transparent.
        while (destPos < dest32DataLength) {
          dest32[destPos++] = 0;
        }

        ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
      }
    } else if (imgData.kind === ImageKind.RGBA_32BPP) {
      // RGBA, 32-bits per pixel.

      j = 0;
      elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;
      for (i = 0; i < fullChunks; i++) {
        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
        srcPos += elemsInThisChunk;

        ctx.putImageData(chunkImgData, 0, j);
        j += FULL_CHUNK_HEIGHT;
      }
      if (i < totalChunks) {
        elemsInThisChunk = width * partialChunkHeight * 4;
        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
        ctx.putImageData(chunkImgData, 0, j);
      }

    } else if (imgData.kind === ImageKind.RGB_24BPP) {
      // RGB, 24-bits per pixel.
      thisChunkHeight = FULL_CHUNK_HEIGHT;
      elemsInThisChunk = width * thisChunkHeight;
      for (i = 0; i < totalChunks; i++) {
        if (i >= fullChunks) {
          thisChunkHeight = partialChunkHeight;
          elemsInThisChunk = width * thisChunkHeight;
        }

        destPos = 0;
        for (j = elemsInThisChunk; j--;) {
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = 255;
        }
        ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
      }
    } else {
      error('bad image kind: ' + imgData.kind);
    }
  }

  function putBinaryImageMask(ctx, imgData) {
    var height = imgData.height, width = imgData.width;
    var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
    var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
    var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;

    var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
    var srcPos = 0;
    var src = imgData.data;
    var dest = chunkImgData.data;

    for (var i = 0; i < totalChunks; i++) {
      var thisChunkHeight =
        (i < fullChunks) ? FULL_CHUNK_HEIGHT : partialChunkHeight;

      // Expand the mask so it can be used by the canvas.  Any required
      // inversion has already been handled.
      var destPos = 3; // alpha component offset
      for (var j = 0; j < thisChunkHeight; j++) {
        var mask = 0;
        for (var k = 0; k < width; k++) {
          if (!mask) {
            var elem = src[srcPos++];
            mask = 128;
          }
          dest[destPos] = (elem & mask) ? 0 : 255;
          destPos += 4;
          mask >>= 1;
        }
      }
      ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
    }
  }

  function copyCtxState(sourceCtx, destCtx) {
    var properties = ['strokeStyle', 'fillStyle', 'fillRule', 'globalAlpha',
                      'lineWidth', 'lineCap', 'lineJoin', 'miterLimit',
                      'globalCompositeOperation', 'font'];
    for (var i = 0, ii = properties.length; i < ii; i++) {
      var property = properties[i];
      if (sourceCtx[property] !== undefined) {
        destCtx[property] = sourceCtx[property];
      }
    }
    if (sourceCtx.setLineDash !== undefined) {
      destCtx.setLineDash(sourceCtx.getLineDash());
      destCtx.lineDashOffset =  sourceCtx.lineDashOffset;
    } else if (sourceCtx.mozDashOffset !== undefined) {
      destCtx.mozDash = sourceCtx.mozDash;
      destCtx.mozDashOffset = sourceCtx.mozDashOffset;
    }
  }

  function composeSMaskBackdrop(bytes, r0, g0, b0) {
    var length = bytes.length;
    for (var i = 3; i < length; i += 4) {
      var alpha = bytes[i];
      if (alpha === 0) {
        bytes[i - 3] = r0;
        bytes[i - 2] = g0;
        bytes[i - 1] = b0;
      } else if (alpha < 255) {
        var alpha_ = 255 - alpha;
        bytes[i - 3] = (bytes[i - 3] * alpha + r0 * alpha_) >> 8;
        bytes[i - 2] = (bytes[i - 2] * alpha + g0 * alpha_) >> 8;
        bytes[i - 1] = (bytes[i - 1] * alpha + b0 * alpha_) >> 8;
      }
    }
  }

  function composeSMaskAlpha(maskData, layerData, transferMap) {
    var length = maskData.length;
    var scale = 1 / 255;
    for (var i = 3; i < length; i += 4) {
      var alpha = transferMap ? transferMap[maskData[i]] : maskData[i];
      layerData[i] = (layerData[i] * alpha * scale) | 0;
    }
  }

  function composeSMaskLuminosity(maskData, layerData, transferMap) {
    var length = maskData.length;
    for (var i = 3; i < length; i += 4) {
      var y = (maskData[i - 3] * 77) +  // * 0.3 / 255 * 0x10000
              (maskData[i - 2] * 152) + // * 0.59 ....
              (maskData[i - 1] * 28);   // * 0.11 ....
      layerData[i] = transferMap ?
        (layerData[i] * transferMap[y >> 8]) >> 8 :
        (layerData[i] * y) >> 16;
    }
  }

  function genericComposeSMask(maskCtx, layerCtx, width, height,
                               subtype, backdrop, transferMap) {
    var hasBackdrop = !!backdrop;
    var r0 = hasBackdrop ? backdrop[0] : 0;
    var g0 = hasBackdrop ? backdrop[1] : 0;
    var b0 = hasBackdrop ? backdrop[2] : 0;

    var composeFn;
    if (subtype === 'Luminosity') {
      composeFn = composeSMaskLuminosity;
    } else {
      composeFn = composeSMaskAlpha;
    }

    // processing image in chunks to save memory
    var PIXELS_TO_PROCESS = 1048576;
    var chunkSize = Math.min(height, Math.ceil(PIXELS_TO_PROCESS / width));
    for (var row = 0; row < height; row += chunkSize) {
      var chunkHeight = Math.min(chunkSize, height - row);
      var maskData = maskCtx.getImageData(0, row, width, chunkHeight);
      var layerData = layerCtx.getImageData(0, row, width, chunkHeight);

      if (hasBackdrop) {
        composeSMaskBackdrop(maskData.data, r0, g0, b0);
      }
      composeFn(maskData.data, layerData.data, transferMap);

      maskCtx.putImageData(layerData, 0, row);
    }
  }

  function composeSMask(ctx, smask, layerCtx) {
    var mask = smask.canvas;
    var maskCtx = smask.context;

    ctx.setTransform(smask.scaleX, 0, 0, smask.scaleY,
                     smask.offsetX, smask.offsetY);

    var backdrop = smask.backdrop || null;
    if (!smask.transferMap && WebGLUtils.isEnabled) {
      var composed = WebGLUtils.composeSMask(layerCtx.canvas, mask,
        {subtype: smask.subtype, backdrop: backdrop});
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(composed, smask.offsetX, smask.offsetY);
      return;
    }
    genericComposeSMask(maskCtx, layerCtx, mask.width, mask.height,
                        smask.subtype, backdrop, smask.transferMap);
    ctx.drawImage(mask, 0, 0);
  }

  var LINE_CAP_STYLES = ['butt', 'round', 'square'];
  var LINE_JOIN_STYLES = ['miter', 'round', 'bevel'];
  var NORMAL_CLIP = {};
  var EO_CLIP = {};

  CanvasGraphics.prototype = {

    beginDrawing: function CanvasGraphics_beginDrawing(transform, viewport,
                                                       transparency) {
      // For pdfs that use blend modes we have to clear the canvas else certain
      // blend modes can look wrong since we'd be blending with a white
      // backdrop. The problem with a transparent backdrop though is we then
      // don't get sub pixel anti aliasing on text, creating temporary
      // transparent canvas when we have blend modes.
      var width = this.ctx.canvas.width;
      var height = this.ctx.canvas.height;

      this.ctx.save();
      this.ctx.fillStyle = 'rgb(255, 255, 255)';
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.restore();

      if (transparency) {
        var transparentCanvas = this.cachedCanvases.getCanvas(
          'transparent', width, height, true);
        this.compositeCtx = this.ctx;
        this.transparentCanvas = transparentCanvas.canvas;
        this.ctx = transparentCanvas.context;
        this.ctx.save();
        // The transform can be applied before rendering, transferring it to
        // the new canvas.
        this.ctx.transform.apply(this.ctx,
                                 this.compositeCtx.mozCurrentTransform);
      }

      this.ctx.save();
      if (transform) {
        this.ctx.transform.apply(this.ctx, transform);
      }
      this.ctx.transform.apply(this.ctx, viewport.transform);

      this.baseTransform = this.ctx.mozCurrentTransform.slice();

      if (this.imageLayer) {
        this.imageLayer.beginLayout();
      }
    },

    executeOperatorList: function CanvasGraphics_executeOperatorList(
                                    operatorList,
                                    executionStartIdx, continueCallback,
                                    stepper) {
      var argsArray = operatorList.argsArray;
      var fnArray = operatorList.fnArray;
      var i = executionStartIdx || 0;
      var argsArrayLen = argsArray.length;

      // Sometimes the OperatorList to execute is empty.
      if (argsArrayLen === i) {
        return i;
      }

      var chunkOperations = (argsArrayLen - i > EXECUTION_STEPS &&
                             typeof continueCallback === 'function');
      var endTime = chunkOperations ? Date.now() + EXECUTION_TIME : 0;
      var steps = 0;

      var commonObjs = this.commonObjs;
      var objs = this.objs;
      var fnId;

      while (true) {
        if (stepper !== undefined && i === stepper.nextBreakPoint) {
          stepper.breakIt(i, continueCallback);
          return i;
        }

        fnId = fnArray[i];

        if (fnId !== OPS.dependency) {
          this[fnId].apply(this, argsArray[i]);
        } else {
          var deps = argsArray[i];
          for (var n = 0, nn = deps.length; n < nn; n++) {
            var depObjId = deps[n];
            var common = depObjId[0] === 'g' && depObjId[1] === '_';
            var objsPool = common ? commonObjs : objs;

            // If the promise isn't resolved yet, add the continueCallback
            // to the promise and bail out.
            if (!objsPool.isResolved(depObjId)) {
              objsPool.get(depObjId, continueCallback);
              return i;
            }
          }
        }

        i++;

        // If the entire operatorList was executed, stop as were done.
        if (i === argsArrayLen) {
          return i;
        }

        // If the execution took longer then a certain amount of time and
        // `continueCallback` is specified, interrupt the execution.
        if (chunkOperations && ++steps > EXECUTION_STEPS) {
          if (Date.now() > endTime) {
            continueCallback();
            return i;
          }
          steps = 0;
        }

        // If the operatorList isn't executed completely yet OR the execution
        // time was short enough, do another execution round.
      }
    },

    endDrawing: function CanvasGraphics_endDrawing() {
      this.ctx.restore();

      if (this.transparentCanvas) {
        this.ctx = this.compositeCtx;
        this.ctx.drawImage(this.transparentCanvas, 0, 0);
        this.transparentCanvas = null;
      }

      this.cachedCanvases.clear();
      WebGLUtils.clear();

      if (this.imageLayer) {
        this.imageLayer.endLayout();
      }
    },

    // Graphics state
    setLineWidth: function CanvasGraphics_setLineWidth(width) {
      this.current.lineWidth = width;
      this.ctx.lineWidth = width;
    },
    setLineCap: function CanvasGraphics_setLineCap(style) {
      this.ctx.lineCap = LINE_CAP_STYLES[style];
    },
    setLineJoin: function CanvasGraphics_setLineJoin(style) {
      this.ctx.lineJoin = LINE_JOIN_STYLES[style];
    },
    setMiterLimit: function CanvasGraphics_setMiterLimit(limit) {
      this.ctx.miterLimit = limit;
    },
    setDash: function CanvasGraphics_setDash(dashArray, dashPhase) {
      var ctx = this.ctx;
      if (ctx.setLineDash !== undefined) {
        ctx.setLineDash(dashArray);
        ctx.lineDashOffset = dashPhase;
      } else {
        ctx.mozDash = dashArray;
        ctx.mozDashOffset = dashPhase;
      }
    },
    setRenderingIntent: function CanvasGraphics_setRenderingIntent(intent) {
      // Maybe if we one day fully support color spaces this will be important
      // for now we can ignore.
      // TODO set rendering intent?
    },
    setFlatness: function CanvasGraphics_setFlatness(flatness) {
      // There's no way to control this with canvas, but we can safely ignore.
      // TODO set flatness?
    },
    setGState: function CanvasGraphics_setGState(states) {
      for (var i = 0, ii = states.length; i < ii; i++) {
        var state = states[i];
        var key = state[0];
        var value = state[1];

        switch (key) {
          case 'LW':
            this.setLineWidth(value);
            break;
          case 'LC':
            this.setLineCap(value);
            break;
          case 'LJ':
            this.setLineJoin(value);
            break;
          case 'ML':
            this.setMiterLimit(value);
            break;
          case 'D':
            this.setDash(value[0], value[1]);
            break;
          case 'RI':
            this.setRenderingIntent(value);
            break;
          case 'FL':
            this.setFlatness(value);
            break;
          case 'Font':
            this.setFont(value[0], value[1]);
            break;
          case 'CA':
            this.current.strokeAlpha = state[1];
            break;
          case 'ca':
            this.current.fillAlpha = state[1];
            this.ctx.globalAlpha = state[1];
            break;
          case 'BM':
            if (value && value.name && (value.name !== 'Normal')) {
              var mode = value.name.replace(/([A-Z])/g,
                function(c) {
                  return '-' + c.toLowerCase();
                }
              ).substring(1);
              this.ctx.globalCompositeOperation = mode;
              if (this.ctx.globalCompositeOperation !== mode) {
                warn('globalCompositeOperation "' + mode +
                     '" is not supported');
              }
            } else {
              this.ctx.globalCompositeOperation = 'source-over';
            }
            break;
          case 'SMask':
            if (this.current.activeSMask) {
              this.endSMaskGroup();
            }
            this.current.activeSMask = value ? this.tempSMask : null;
            if (this.current.activeSMask) {
              this.beginSMaskGroup();
            }
            this.tempSMask = null;
            break;
        }
      }
    },
    beginSMaskGroup: function CanvasGraphics_beginSMaskGroup() {

      var activeSMask = this.current.activeSMask;
      var drawnWidth = activeSMask.canvas.width;
      var drawnHeight = activeSMask.canvas.height;
      var cacheId = 'smaskGroupAt' + this.groupLevel;
      var scratchCanvas = this.cachedCanvases.getCanvas(
        cacheId, drawnWidth, drawnHeight, true);

      var currentCtx = this.ctx;
      var currentTransform = currentCtx.mozCurrentTransform;
      this.ctx.save();

      var groupCtx = scratchCanvas.context;
      groupCtx.scale(1 / activeSMask.scaleX, 1 / activeSMask.scaleY);
      groupCtx.translate(-activeSMask.offsetX, -activeSMask.offsetY);
      groupCtx.transform.apply(groupCtx, currentTransform);

      copyCtxState(currentCtx, groupCtx);
      this.ctx = groupCtx;
      this.setGState([
        ['BM', 'Normal'],
        ['ca', 1],
        ['CA', 1]
      ]);
      this.groupStack.push(currentCtx);
      this.groupLevel++;
    },
    endSMaskGroup: function CanvasGraphics_endSMaskGroup() {
      var groupCtx = this.ctx;
      this.groupLevel--;
      this.ctx = this.groupStack.pop();

      composeSMask(this.ctx, this.current.activeSMask, groupCtx);
      this.ctx.restore();
      copyCtxState(groupCtx, this.ctx);
    },
    save: function CanvasGraphics_save() {
      this.ctx.save();
      var old = this.current;
      this.stateStack.push(old);
      this.current = old.clone();
      this.current.activeSMask = null;
    },
    restore: function CanvasGraphics_restore() {
      if (this.stateStack.length !== 0) {
        if (this.current.activeSMask !== null) {
          this.endSMaskGroup();
        }

        this.current = this.stateStack.pop();
        this.ctx.restore();

        // Ensure that the clipping path is reset (fixes issue6413.pdf).
        this.pendingClip = null;

        this.cachedGetSinglePixelWidth = null;
      }
    },
    transform: function CanvasGraphics_transform(a, b, c, d, e, f) {
      this.ctx.transform(a, b, c, d, e, f);

      this.cachedGetSinglePixelWidth = null;
    },

    // Path
    constructPath: function CanvasGraphics_constructPath(ops, args) {
      var ctx = this.ctx;
      var current = this.current;
      var x = current.x, y = current.y;
      for (var i = 0, j = 0, ii = ops.length; i < ii; i++) {
        switch (ops[i] | 0) {
          case OPS.rectangle:
            x = args[j++];
            y = args[j++];
            var width = args[j++];
            var height = args[j++];
            if (width === 0) {
              width = this.getSinglePixelWidth();
            }
            if (height === 0) {
              height = this.getSinglePixelWidth();
            }
            var xw = x + width;
            var yh = y + height;
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(xw, y);
            this.ctx.lineTo(xw, yh);
            this.ctx.lineTo(x, yh);
            this.ctx.lineTo(x, y);
            this.ctx.closePath();
            break;
          case OPS.moveTo:
            x = args[j++];
            y = args[j++];
            ctx.moveTo(x, y);
            break;
          case OPS.lineTo:
            x = args[j++];
            y = args[j++];
            ctx.lineTo(x, y);
            break;
          case OPS.curveTo:
            x = args[j + 4];
            y = args[j + 5];
            ctx.bezierCurveTo(args[j], args[j + 1], args[j + 2], args[j + 3],
                              x, y);
            j += 6;
            break;
          case OPS.curveTo2:
            ctx.bezierCurveTo(x, y, args[j], args[j + 1],
                              args[j + 2], args[j + 3]);
            x = args[j + 2];
            y = args[j + 3];
            j += 4;
            break;
          case OPS.curveTo3:
            x = args[j + 2];
            y = args[j + 3];
            ctx.bezierCurveTo(args[j], args[j + 1], x, y, x, y);
            j += 4;
            break;
          case OPS.closePath:
            ctx.closePath();
            break;
        }
      }
      current.setCurrentPoint(x, y);
    },
    closePath: function CanvasGraphics_closePath() {
      this.ctx.closePath();
    },
    stroke: function CanvasGraphics_stroke(consumePath) {
      consumePath = typeof consumePath !== 'undefined' ? consumePath : true;
      var ctx = this.ctx;
      var strokeColor = this.current.strokeColor;
      // Prevent drawing too thin lines by enforcing a minimum line width.
      ctx.lineWidth = Math.max(this.getSinglePixelWidth() * MIN_WIDTH_FACTOR,
                               this.current.lineWidth);
      // For stroke we want to temporarily change the global alpha to the
      // stroking alpha.
      ctx.globalAlpha = this.current.strokeAlpha;
      if (strokeColor && strokeColor.hasOwnProperty('type') &&
          strokeColor.type === 'Pattern') {
        // for patterns, we transform to pattern space, calculate
        // the pattern, call stroke, and restore to user space
        ctx.save();
        ctx.strokeStyle = strokeColor.getPattern(ctx, this);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.stroke();
      }
      if (consumePath) {
        this.consumePath();
      }
      // Restore the global alpha to the fill alpha
      ctx.globalAlpha = this.current.fillAlpha;
    },
    closeStroke: function CanvasGraphics_closeStroke() {
      this.closePath();
      this.stroke();
    },
    fill: function CanvasGraphics_fill(consumePath) {
      consumePath = typeof consumePath !== 'undefined' ? consumePath : true;
      var ctx = this.ctx;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;
      var needRestore = false;

      if (isPatternFill) {
        ctx.save();
        if (this.baseTransform) {
          ctx.setTransform.apply(ctx, this.baseTransform);
        }
        ctx.fillStyle = fillColor.getPattern(ctx, this);
        needRestore = true;
      }

      if (this.pendingEOFill) {
        if (ctx.mozFillRule !== undefined) {
          ctx.mozFillRule = 'evenodd';
          ctx.fill();
          ctx.mozFillRule = 'nonzero';
        } else {
          ctx.fill('evenodd');
        }
        this.pendingEOFill = false;
      } else {
        ctx.fill();
      }

      if (needRestore) {
        ctx.restore();
      }
      if (consumePath) {
        this.consumePath();
      }
    },
    eoFill: function CanvasGraphics_eoFill() {
      this.pendingEOFill = true;
      this.fill();
    },
    fillStroke: function CanvasGraphics_fillStroke() {
      this.fill(false);
      this.stroke(false);

      this.consumePath();
    },
    eoFillStroke: function CanvasGraphics_eoFillStroke() {
      this.pendingEOFill = true;
      this.fillStroke();
    },
    closeFillStroke: function CanvasGraphics_closeFillStroke() {
      this.closePath();
      this.fillStroke();
    },
    closeEOFillStroke: function CanvasGraphics_closeEOFillStroke() {
      this.pendingEOFill = true;
      this.closePath();
      this.fillStroke();
    },
    endPath: function CanvasGraphics_endPath() {
      this.consumePath();
    },

    // Clipping
    clip: function CanvasGraphics_clip() {
      this.pendingClip = NORMAL_CLIP;
    },
    eoClip: function CanvasGraphics_eoClip() {
      this.pendingClip = EO_CLIP;
    },

    // Text
    beginText: function CanvasGraphics_beginText() {
      this.current.textMatrix = IDENTITY_MATRIX;
      this.current.textMatrixScale = 1;
      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
    },
    endText: function CanvasGraphics_endText() {
      var paths = this.pendingTextPaths;
      var ctx = this.ctx;
      if (paths === undefined) {
        ctx.beginPath();
        return;
      }

      ctx.save();
      ctx.beginPath();
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        ctx.setTransform.apply(ctx, path.transform);
        ctx.translate(path.x, path.y);
        path.addToPath(ctx, path.fontSize);
      }
      ctx.restore();
      ctx.clip();
      ctx.beginPath();
      delete this.pendingTextPaths;
    },
    setCharSpacing: function CanvasGraphics_setCharSpacing(spacing) {
      this.current.charSpacing = spacing;
    },
    setWordSpacing: function CanvasGraphics_setWordSpacing(spacing) {
      this.current.wordSpacing = spacing;
    },
    setHScale: function CanvasGraphics_setHScale(scale) {
      this.current.textHScale = scale / 100;
    },
    setLeading: function CanvasGraphics_setLeading(leading) {
      this.current.leading = -leading;
    },
    setFont: function CanvasGraphics_setFont(fontRefName, size) {
      var fontObj = this.commonObjs.get(fontRefName);
      var current = this.current;

      if (!fontObj) {
        error('Can\'t find font for ' + fontRefName);
      }

      current.fontMatrix = (fontObj.fontMatrix ?
                            fontObj.fontMatrix : FONT_IDENTITY_MATRIX);

      // A valid matrix needs all main diagonal elements to be non-zero
      // This also ensures we bypass FF bugzilla bug #719844.
      if (current.fontMatrix[0] === 0 ||
          current.fontMatrix[3] === 0) {
        warn('Invalid font matrix for font ' + fontRefName);
      }

      // The spec for Tf (setFont) says that 'size' specifies the font 'scale',
      // and in some docs this can be negative (inverted x-y axes).
      if (size < 0) {
        size = -size;
        current.fontDirection = -1;
      } else {
        current.fontDirection = 1;
      }

      this.current.font = fontObj;
      this.current.fontSize = size;

      if (fontObj.isType3Font) {
        return; // we don't need ctx.font for Type3 fonts
      }

      var name = fontObj.loadedName || 'sans-serif';
      var bold = fontObj.black ? (fontObj.bold ? '900' : 'bold') :
                                 (fontObj.bold ? 'bold' : 'normal');

      var italic = fontObj.italic ? 'italic' : 'normal';
      var typeface = '"' + name + '", ' + fontObj.fallbackName;

      // Some font backends cannot handle fonts below certain size.
      // Keeping the font at minimal size and using the fontSizeScale to change
      // the current transformation matrix before the fillText/strokeText.
      // See https://bugzilla.mozilla.org/show_bug.cgi?id=726227
      var browserFontSize = size < MIN_FONT_SIZE ? MIN_FONT_SIZE :
                            size > MAX_FONT_SIZE ? MAX_FONT_SIZE : size;
      this.current.fontSizeScale = size / browserFontSize;

      var rule = italic + ' ' + bold + ' ' + browserFontSize + 'px ' + typeface;
      this.ctx.font = rule;
    },
    setTextRenderingMode: function CanvasGraphics_setTextRenderingMode(mode) {
      this.current.textRenderingMode = mode;
    },
    setTextRise: function CanvasGraphics_setTextRise(rise) {
      this.current.textRise = rise;
    },
    moveText: function CanvasGraphics_moveText(x, y) {
      this.current.x = this.current.lineX += x;
      this.current.y = this.current.lineY += y;
    },
    setLeadingMoveText: function CanvasGraphics_setLeadingMoveText(x, y) {
      this.setLeading(-y);
      this.moveText(x, y);
    },
    setTextMatrix: function CanvasGraphics_setTextMatrix(a, b, c, d, e, f) {
      this.current.textMatrix = [a, b, c, d, e, f];
      this.current.textMatrixScale = Math.sqrt(a * a + b * b);

      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
    },
    nextLine: function CanvasGraphics_nextLine() {
      this.moveText(0, this.current.leading);
    },

    paintChar: function CanvasGraphics_paintChar(character, x, y) {
      var ctx = this.ctx;
      var current = this.current;
      var font = current.font;
      var textRenderingMode = current.textRenderingMode;
      var fontSize = current.fontSize / current.fontSizeScale;
      var fillStrokeMode = textRenderingMode &
        TextRenderingMode.FILL_STROKE_MASK;
      var isAddToPathSet = !!(textRenderingMode &
        TextRenderingMode.ADD_TO_PATH_FLAG);

      var addToPath;
      if (font.disableFontFace || isAddToPathSet) {
        addToPath = font.getPathGenerator(this.commonObjs, character);
      }

      if (font.disableFontFace) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        addToPath(ctx, fontSize);
        if (fillStrokeMode === TextRenderingMode.FILL ||
            fillStrokeMode === TextRenderingMode.FILL_STROKE) {
          ctx.fill();
        }
        if (fillStrokeMode === TextRenderingMode.STROKE ||
            fillStrokeMode === TextRenderingMode.FILL_STROKE) {
          ctx.stroke();
        }
        ctx.restore();
      } else {
        if (fillStrokeMode === TextRenderingMode.FILL ||
            fillStrokeMode === TextRenderingMode.FILL_STROKE) {
          ctx.fillText(character, x, y);
        }
        if (fillStrokeMode === TextRenderingMode.STROKE ||
            fillStrokeMode === TextRenderingMode.FILL_STROKE) {
          ctx.strokeText(character, x, y);
        }
      }

      if (isAddToPathSet) {
        var paths = this.pendingTextPaths || (this.pendingTextPaths = []);
        paths.push({
          transform: ctx.mozCurrentTransform,
          x: x,
          y: y,
          fontSize: fontSize,
          addToPath: addToPath
        });
      }
    },

    get isFontSubpixelAAEnabled() {
      // Checks if anti-aliasing is enabled when scaled text is painted.
      // On Windows GDI scaled fonts looks bad.
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.scale(1.5, 1);
      ctx.fillText('I', 0, 10);
      var data = ctx.getImageData(0, 0, 10, 10).data;
      var enabled = false;
      for (var i = 3; i < data.length; i += 4) {
        if (data[i] > 0 && data[i] < 255) {
          enabled = true;
          break;
        }
      }
      return shadow(this, 'isFontSubpixelAAEnabled', enabled);
    },

    showText: function CanvasGraphics_showText(glyphs) {
      var current = this.current;
      var font = current.font;
      if (font.isType3Font) {
        return this.showType3Text(glyphs);
      }

      var fontSize = current.fontSize;
      if (fontSize === 0) {
        return;
      }

      var ctx = this.ctx;
      var fontSizeScale = current.fontSizeScale;
      var charSpacing = current.charSpacing;
      var wordSpacing = current.wordSpacing;
      var fontDirection = current.fontDirection;
      var textHScale = current.textHScale * fontDirection;
      var glyphsLength = glyphs.length;
      var vertical = font.vertical;
      var spacingDir = vertical ? 1 : -1;
      var defaultVMetrics = font.defaultVMetrics;
      var widthAdvanceScale = fontSize * current.fontMatrix[0];

      var simpleFillText =
        current.textRenderingMode === TextRenderingMode.FILL &&
        !font.disableFontFace;

      ctx.save();
      ctx.transform.apply(ctx, current.textMatrix);
      ctx.translate(current.x, current.y + current.textRise);

      if (current.patternFill) {
        // TODO: Some shading patterns are not applied correctly to text,
        //       e.g. issues 3988 and 5432, and ShowText-ShadingPattern.pdf.
        ctx.fillStyle = current.fillColor.getPattern(ctx, this);
      }

      if (fontDirection > 0) {
        ctx.scale(textHScale, -1);
      } else {
        ctx.scale(textHScale, 1);
      }

      var lineWidth = current.lineWidth;
      var scale = current.textMatrixScale;
      if (scale === 0 || lineWidth === 0) {
        var fillStrokeMode = current.textRenderingMode &
          TextRenderingMode.FILL_STROKE_MASK;
        if (fillStrokeMode === TextRenderingMode.STROKE ||
            fillStrokeMode === TextRenderingMode.FILL_STROKE) {
          this.cachedGetSinglePixelWidth = null;
          lineWidth = this.getSinglePixelWidth() * MIN_WIDTH_FACTOR;
        }
      } else {
        lineWidth /= scale;
      }

      if (fontSizeScale !== 1.0) {
        ctx.scale(fontSizeScale, fontSizeScale);
        lineWidth /= fontSizeScale;
      }

      ctx.lineWidth = lineWidth;

      var x = 0, i;
      for (i = 0; i < glyphsLength; ++i) {
        var glyph = glyphs[i];
        if (isNum(glyph)) {
          x += spacingDir * glyph * fontSize / 1000;
          continue;
        }

        var restoreNeeded = false;
        var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
        var character = glyph.fontChar;
        var accent = glyph.accent;
        var scaledX, scaledY, scaledAccentX, scaledAccentY;
        var width = glyph.width;
        if (vertical) {
          var vmetric, vx, vy;
          vmetric = glyph.vmetric || defaultVMetrics;
          vx = glyph.vmetric ? vmetric[1] : width * 0.5;
          vx = -vx * widthAdvanceScale;
          vy = vmetric[2] * widthAdvanceScale;

          width = vmetric ? -vmetric[0] : width;
          scaledX = vx / fontSizeScale;
          scaledY = (x + vy) / fontSizeScale;
        } else {
          scaledX = x / fontSizeScale;
          scaledY = 0;
        }

        if (font.remeasure && width > 0) {
          // Some standard fonts may not have the exact width: rescale per
          // character if measured width is greater than expected glyph width
          // and subpixel-aa is enabled, otherwise just center the glyph.
          var measuredWidth = ctx.measureText(character).width * 1000 /
            fontSize * fontSizeScale;
          if (width < measuredWidth && this.isFontSubpixelAAEnabled) {
            var characterScaleX = width / measuredWidth;
            restoreNeeded = true;
            ctx.save();
            ctx.scale(characterScaleX, 1);
            scaledX /= characterScaleX;
          } else if (width !== measuredWidth) {
            scaledX += (width - measuredWidth) / 2000 *
              fontSize / fontSizeScale;
          }
        }

        if (simpleFillText && !accent) {
          // common case
          ctx.fillText(character, scaledX, scaledY);
        } else {
          this.paintChar(character, scaledX, scaledY);
          if (accent) {
            scaledAccentX = scaledX + accent.offset.x / fontSizeScale;
            scaledAccentY = scaledY - accent.offset.y / fontSizeScale;
            this.paintChar(accent.fontChar, scaledAccentX, scaledAccentY);
          }
        }

        var charWidth = width * widthAdvanceScale + spacing * fontDirection;
        x += charWidth;

        if (restoreNeeded) {
          ctx.restore();
        }
      }
      if (vertical) {
        current.y -= x * textHScale;
      } else {
        current.x += x * textHScale;
      }
      ctx.restore();
    },

    showType3Text: function CanvasGraphics_showType3Text(glyphs) {
      // Type3 fonts - each glyph is a "mini-PDF"
      var ctx = this.ctx;
      var current = this.current;
      var font = current.font;
      var fontSize = current.fontSize;
      var fontDirection = current.fontDirection;
      var spacingDir = font.vertical ? 1 : -1;
      var charSpacing = current.charSpacing;
      var wordSpacing = current.wordSpacing;
      var textHScale = current.textHScale * fontDirection;
      var fontMatrix = current.fontMatrix || FONT_IDENTITY_MATRIX;
      var glyphsLength = glyphs.length;
      var isTextInvisible =
        current.textRenderingMode === TextRenderingMode.INVISIBLE;
      var i, glyph, width, spacingLength;

      if (isTextInvisible || fontSize === 0) {
        return;
      }
      this.cachedGetSinglePixelWidth = null;

      ctx.save();
      ctx.transform.apply(ctx, current.textMatrix);
      ctx.translate(current.x, current.y);

      ctx.scale(textHScale, fontDirection);

      for (i = 0; i < glyphsLength; ++i) {
        glyph = glyphs[i];
        if (isNum(glyph)) {
          spacingLength = spacingDir * glyph * fontSize / 1000;
          this.ctx.translate(spacingLength, 0);
          current.x += spacingLength * textHScale;
          continue;
        }

        var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
        var operatorList = font.charProcOperatorList[glyph.operatorListId];
        if (!operatorList) {
          warn('Type3 character \"' + glyph.operatorListId +
               '\" is not available');
          continue;
        }
        this.processingType3 = glyph;
        this.save();
        ctx.scale(fontSize, fontSize);
        ctx.transform.apply(ctx, fontMatrix);
        this.executeOperatorList(operatorList);
        this.restore();

        var transformed = Util.applyTransform([glyph.width, 0], fontMatrix);
        width = transformed[0] * fontSize + spacing;

        ctx.translate(width, 0);
        current.x += width * textHScale;
      }
      ctx.restore();
      this.processingType3 = null;
    },

    // Type3 fonts
    setCharWidth: function CanvasGraphics_setCharWidth(xWidth, yWidth) {
      // We can safely ignore this since the width should be the same
      // as the width in the Widths array.
    },
    setCharWidthAndBounds: function CanvasGraphics_setCharWidthAndBounds(xWidth,
                                                                        yWidth,
                                                                        llx,
                                                                        lly,
                                                                        urx,
                                                                        ury) {
      // TODO According to the spec we're also suppose to ignore any operators
      // that set color or include images while processing this type3 font.
      this.ctx.rect(llx, lly, urx - llx, ury - lly);
      this.clip();
      this.endPath();
    },

    // Color
    getColorN_Pattern: function CanvasGraphics_getColorN_Pattern(IR) {
      var pattern;
      if (IR[0] === 'TilingPattern') {
        var color = IR[1];
        var baseTransform = this.baseTransform ||
                            this.ctx.mozCurrentTransform.slice();
        var self = this;
        var canvasGraphicsFactory = {
          createCanvasGraphics: function (ctx) {
            return new CanvasGraphics(ctx, self.commonObjs, self.objs);
          }
        };
        pattern = new TilingPattern(IR, color, this.ctx, canvasGraphicsFactory,
                                    baseTransform);
      } else {
        pattern = getShadingPatternFromIR(IR);
      }
      return pattern;
    },
    setStrokeColorN: function CanvasGraphics_setStrokeColorN(/*...*/) {
      this.current.strokeColor = this.getColorN_Pattern(arguments);
    },
    setFillColorN: function CanvasGraphics_setFillColorN(/*...*/) {
      this.current.fillColor = this.getColorN_Pattern(arguments);
      this.current.patternFill = true;
    },
    setStrokeRGBColor: function CanvasGraphics_setStrokeRGBColor(r, g, b) {
      var color = Util.makeCssRgb(r, g, b);
      this.ctx.strokeStyle = color;
      this.current.strokeColor = color;
    },
    setFillRGBColor: function CanvasGraphics_setFillRGBColor(r, g, b) {
      var color = Util.makeCssRgb(r, g, b);
      this.ctx.fillStyle = color;
      this.current.fillColor = color;
      this.current.patternFill = false;
    },

    shadingFill: function CanvasGraphics_shadingFill(patternIR) {
      var ctx = this.ctx;

      this.save();
      var pattern = getShadingPatternFromIR(patternIR);
      ctx.fillStyle = pattern.getPattern(ctx, this, true);

      var inv = ctx.mozCurrentTransformInverse;
      if (inv) {
        var canvas = ctx.canvas;
        var width = canvas.width;
        var height = canvas.height;

        var bl = Util.applyTransform([0, 0], inv);
        var br = Util.applyTransform([0, height], inv);
        var ul = Util.applyTransform([width, 0], inv);
        var ur = Util.applyTransform([width, height], inv);

        var x0 = Math.min(bl[0], br[0], ul[0], ur[0]);
        var y0 = Math.min(bl[1], br[1], ul[1], ur[1]);
        var x1 = Math.max(bl[0], br[0], ul[0], ur[0]);
        var y1 = Math.max(bl[1], br[1], ul[1], ur[1]);

        this.ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      } else {
        // HACK to draw the gradient onto an infinite rectangle.
        // PDF gradients are drawn across the entire image while
        // Canvas only allows gradients to be drawn in a rectangle
        // The following bug should allow us to remove this.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=664884

        this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
      }

      this.restore();
    },

    // Images
    beginInlineImage: function CanvasGraphics_beginInlineImage() {
      error('Should not call beginInlineImage');
    },
    beginImageData: function CanvasGraphics_beginImageData() {
      error('Should not call beginImageData');
    },

    paintFormXObjectBegin: function CanvasGraphics_paintFormXObjectBegin(matrix,
                                                                        bbox) {
      this.save();
      this.baseTransformStack.push(this.baseTransform);

      if (isArray(matrix) && 6 === matrix.length) {
        this.transform.apply(this, matrix);
      }

      this.baseTransform = this.ctx.mozCurrentTransform;

      if (isArray(bbox) && 4 === bbox.length) {
        var width = bbox[2] - bbox[0];
        var height = bbox[3] - bbox[1];
        this.ctx.rect(bbox[0], bbox[1], width, height);
        this.clip();
        this.endPath();
      }
    },

    paintFormXObjectEnd: function CanvasGraphics_paintFormXObjectEnd() {
      this.restore();
      this.baseTransform = this.baseTransformStack.pop();
    },

    beginGroup: function CanvasGraphics_beginGroup(group) {
      this.save();
      var currentCtx = this.ctx;
      // TODO non-isolated groups - according to Rik at adobe non-isolated
      // group results aren't usually that different and they even have tools
      // that ignore this setting. Notes from Rik on implmenting:
      // - When you encounter an transparency group, create a new canvas with
      // the dimensions of the bbox
      // - copy the content from the previous canvas to the new canvas
      // - draw as usual
      // - remove the backdrop alpha:
      // alphaNew = 1 - (1 - alpha)/(1 - alphaBackdrop) with 'alpha' the alpha
      // value of your transparency group and 'alphaBackdrop' the alpha of the
      // backdrop
      // - remove background color:
      // colorNew = color - alphaNew *colorBackdrop /(1 - alphaNew)
      if (!group.isolated) {
        info('TODO: Support non-isolated groups.');
      }

      // TODO knockout - supposedly possible with the clever use of compositing
      // modes.
      if (group.knockout) {
        warn('Knockout groups not supported.');
      }

      var currentTransform = currentCtx.mozCurrentTransform;
      if (group.matrix) {
        currentCtx.transform.apply(currentCtx, group.matrix);
      }
      assert(group.bbox, 'Bounding box is required.');

      // Based on the current transform figure out how big the bounding box
      // will actually be.
      var bounds = Util.getAxialAlignedBoundingBox(
                    group.bbox,
                    currentCtx.mozCurrentTransform);
      // Clip the bounding box to the current canvas.
      var canvasBounds = [0,
                          0,
                          currentCtx.canvas.width,
                          currentCtx.canvas.height];
      bounds = Util.intersect(bounds, canvasBounds) || [0, 0, 0, 0];
      // Use ceil in case we're between sizes so we don't create canvas that is
      // too small and make the canvas at least 1x1 pixels.
      var offsetX = Math.floor(bounds[0]);
      var offsetY = Math.floor(bounds[1]);
      var drawnWidth = Math.max(Math.ceil(bounds[2]) - offsetX, 1);
      var drawnHeight = Math.max(Math.ceil(bounds[3]) - offsetY, 1);
      var scaleX = 1, scaleY = 1;
      if (drawnWidth > MAX_GROUP_SIZE) {
        scaleX = drawnWidth / MAX_GROUP_SIZE;
        drawnWidth = MAX_GROUP_SIZE;
      }
      if (drawnHeight > MAX_GROUP_SIZE) {
        scaleY = drawnHeight / MAX_GROUP_SIZE;
        drawnHeight = MAX_GROUP_SIZE;
      }

      var cacheId = 'groupAt' + this.groupLevel;
      if (group.smask) {
        // Using two cache entries is case if masks are used one after another.
        cacheId +=  '_smask_' + ((this.smaskCounter++) % 2);
      }
      var scratchCanvas = this.cachedCanvases.getCanvas(
        cacheId, drawnWidth, drawnHeight, true);
      var groupCtx = scratchCanvas.context;

      // Since we created a new canvas that is just the size of the bounding box
      // we have to translate the group ctx.
      groupCtx.scale(1 / scaleX, 1 / scaleY);
      groupCtx.translate(-offsetX, -offsetY);
      groupCtx.transform.apply(groupCtx, currentTransform);

      if (group.smask) {
        // Saving state and cached mask to be used in setGState.
        this.smaskStack.push({
          canvas: scratchCanvas.canvas,
          context: groupCtx,
          offsetX: offsetX,
          offsetY: offsetY,
          scaleX: scaleX,
          scaleY: scaleY,
          subtype: group.smask.subtype,
          backdrop: group.smask.backdrop,
          transferMap: group.smask.transferMap || null
        });
      } else {
        // Setup the current ctx so when the group is popped we draw it at the
        // right location.
        currentCtx.setTransform(1, 0, 0, 1, 0, 0);
        currentCtx.translate(offsetX, offsetY);
        currentCtx.scale(scaleX, scaleY);
      }
      // The transparency group inherits all off the current graphics state
      // except the blend mode, soft mask, and alpha constants.
      copyCtxState(currentCtx, groupCtx);
      this.ctx = groupCtx;
      this.setGState([
        ['BM', 'Normal'],
        ['ca', 1],
        ['CA', 1]
      ]);
      this.groupStack.push(currentCtx);
      this.groupLevel++;
    },

    endGroup: function CanvasGraphics_endGroup(group) {
      this.groupLevel--;
      var groupCtx = this.ctx;
      this.ctx = this.groupStack.pop();
      // Turn off image smoothing to avoid sub pixel interpolation which can
      // look kind of blurry for some pdfs.
      if (this.ctx.imageSmoothingEnabled !== undefined) {
        this.ctx.imageSmoothingEnabled = false;
      } else {
        this.ctx.mozImageSmoothingEnabled = false;
      }
      if (group.smask) {
        this.tempSMask = this.smaskStack.pop();
      } else {
        this.ctx.drawImage(groupCtx.canvas, 0, 0);
      }
      this.restore();
    },

    beginAnnotations: function CanvasGraphics_beginAnnotations() {
      this.save();
      this.current = new CanvasExtraState();

      if (this.baseTransform) {
        this.ctx.setTransform.apply(this.ctx, this.baseTransform);
      }
    },

    endAnnotations: function CanvasGraphics_endAnnotations() {
      this.restore();
    },

    beginAnnotation: function CanvasGraphics_beginAnnotation(rect, transform,
                                                             matrix) {
      this.save();

      if (isArray(rect) && 4 === rect.length) {
        var width = rect[2] - rect[0];
        var height = rect[3] - rect[1];
        this.ctx.rect(rect[0], rect[1], width, height);
        this.clip();
        this.endPath();
      }

      this.transform.apply(this, transform);
      this.transform.apply(this, matrix);
    },

    endAnnotation: function CanvasGraphics_endAnnotation() {
      this.restore();
    },

    paintJpegXObject: function CanvasGraphics_paintJpegXObject(objId, w, h) {
      var domImage = this.objs.get(objId);
      if (!domImage) {
        warn('Dependent image isn\'t ready yet');
        return;
      }

      this.save();

      var ctx = this.ctx;
      // scale the image to the unit square
      ctx.scale(1 / w, -1 / h);

      ctx.drawImage(domImage, 0, 0, domImage.width, domImage.height,
                    0, -h, w, h);
      if (this.imageLayer) {
        var currentTransform = ctx.mozCurrentTransformInverse;
        var position = this.getCanvasPosition(0, 0);
        this.imageLayer.appendImage({
          objId: objId,
          left: position[0],
          top: position[1],
          width: w / currentTransform[0],
          height: h / currentTransform[3]
        });
      }
      this.restore();
    },

    paintImageMaskXObject: function CanvasGraphics_paintImageMaskXObject(img) {
      var ctx = this.ctx;
      var width = img.width, height = img.height;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;

      var glyph = this.processingType3;

      if (COMPILE_TYPE3_GLYPHS && glyph && glyph.compiled === undefined) {
        if (width <= MAX_SIZE_TO_COMPILE && height <= MAX_SIZE_TO_COMPILE) {
          glyph.compiled =
            compileType3Glyph({data: img.data, width: width, height: height});
        } else {
          glyph.compiled = null;
        }
      }

      if (glyph && glyph.compiled) {
        glyph.compiled(ctx);
        return;
      }

      var maskCanvas = this.cachedCanvases.getCanvas('maskCanvas',
                                                     width, height);
      var maskCtx = maskCanvas.context;
      maskCtx.save();

      putBinaryImageMask(maskCtx, img);

      maskCtx.globalCompositeOperation = 'source-in';

      maskCtx.fillStyle = isPatternFill ?
                          fillColor.getPattern(maskCtx, this) : fillColor;
      maskCtx.fillRect(0, 0, width, height);

      maskCtx.restore();

      this.paintInlineImageXObject(maskCanvas.canvas);
    },

    paintImageMaskXObjectRepeat:
      function CanvasGraphics_paintImageMaskXObjectRepeat(imgData, scaleX,
                                                          scaleY, positions) {
      var width = imgData.width;
      var height = imgData.height;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;

      var maskCanvas = this.cachedCanvases.getCanvas('maskCanvas',
                                                     width, height);
      var maskCtx = maskCanvas.context;
      maskCtx.save();

      putBinaryImageMask(maskCtx, imgData);

      maskCtx.globalCompositeOperation = 'source-in';

      maskCtx.fillStyle = isPatternFill ?
                          fillColor.getPattern(maskCtx, this) : fillColor;
      maskCtx.fillRect(0, 0, width, height);

      maskCtx.restore();

      var ctx = this.ctx;
      for (var i = 0, ii = positions.length; i < ii; i += 2) {
        ctx.save();
        ctx.transform(scaleX, 0, 0, scaleY, positions[i], positions[i + 1]);
        ctx.scale(1, -1);
        ctx.drawImage(maskCanvas.canvas, 0, 0, width, height,
          0, -1, 1, 1);
        ctx.restore();
      }
    },

    paintImageMaskXObjectGroup:
      function CanvasGraphics_paintImageMaskXObjectGroup(images) {
      var ctx = this.ctx;

      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;
      for (var i = 0, ii = images.length; i < ii; i++) {
        var image = images[i];
        var width = image.width, height = image.height;

        var maskCanvas = this.cachedCanvases.getCanvas('maskCanvas',
                                                       width, height);
        var maskCtx = maskCanvas.context;
        maskCtx.save();

        putBinaryImageMask(maskCtx, image);

        maskCtx.globalCompositeOperation = 'source-in';

        maskCtx.fillStyle = isPatternFill ?
                            fillColor.getPattern(maskCtx, this) : fillColor;
        maskCtx.fillRect(0, 0, width, height);

        maskCtx.restore();

        ctx.save();
        ctx.transform.apply(ctx, image.transform);
        ctx.scale(1, -1);
        ctx.drawImage(maskCanvas.canvas, 0, 0, width, height,
                      0, -1, 1, 1);
        ctx.restore();
      }
    },

    paintImageXObject: function CanvasGraphics_paintImageXObject(objId) {
      var imgData = this.objs.get(objId);
      if (!imgData) {
        warn('Dependent image isn\'t ready yet');
        return;
      }

      this.paintInlineImageXObject(imgData);
    },

    paintImageXObjectRepeat:
      function CanvasGraphics_paintImageXObjectRepeat(objId, scaleX, scaleY,
                                                          positions) {
      var imgData = this.objs.get(objId);
      if (!imgData) {
        warn('Dependent image isn\'t ready yet');
        return;
      }

      var width = imgData.width;
      var height = imgData.height;
      var map = [];
      for (var i = 0, ii = positions.length; i < ii; i += 2) {
        map.push({transform: [scaleX, 0, 0, scaleY, positions[i],
                 positions[i + 1]], x: 0, y: 0, w: width, h: height});
      }
      this.paintInlineImageXObjectGroup(imgData, map);
    },

    paintInlineImageXObject:
      function CanvasGraphics_paintInlineImageXObject(imgData) {
      var width = imgData.width;
      var height = imgData.height;
      var ctx = this.ctx;

      this.save();
      // scale the image to the unit square
      ctx.scale(1 / width, -1 / height);

      var currentTransform = ctx.mozCurrentTransformInverse;
      var a = currentTransform[0], b = currentTransform[1];
      var widthScale = Math.max(Math.sqrt(a * a + b * b), 1);
      var c = currentTransform[2], d = currentTransform[3];
      var heightScale = Math.max(Math.sqrt(c * c + d * d), 1);

      var imgToPaint, tmpCanvas;
      // instanceof HTMLElement does not work in jsdom node.js module
      if (imgData instanceof HTMLElement || !imgData.data) {
        imgToPaint = imgData;
      } else {
        tmpCanvas = this.cachedCanvases.getCanvas('inlineImage',
                                                  width, height);
        var tmpCtx = tmpCanvas.context;
        putBinaryImageData(tmpCtx, imgData);
        imgToPaint = tmpCanvas.canvas;
      }

      var paintWidth = width, paintHeight = height;
      var tmpCanvasId = 'prescale1';
      // Vertial or horizontal scaling shall not be more than 2 to not loose the
      // pixels during drawImage operation, painting on the temporary canvas(es)
      // that are twice smaller in size
      while ((widthScale > 2 && paintWidth > 1) ||
             (heightScale > 2 && paintHeight > 1)) {
        var newWidth = paintWidth, newHeight = paintHeight;
        if (widthScale > 2 && paintWidth > 1) {
          newWidth = Math.ceil(paintWidth / 2);
          widthScale /= paintWidth / newWidth;
        }
        if (heightScale > 2 && paintHeight > 1) {
          newHeight = Math.ceil(paintHeight / 2);
          heightScale /= paintHeight / newHeight;
        }
        tmpCanvas = this.cachedCanvases.getCanvas(tmpCanvasId,
                                                  newWidth, newHeight);
        tmpCtx = tmpCanvas.context;
        tmpCtx.clearRect(0, 0, newWidth, newHeight);
        tmpCtx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight,
                                     0, 0, newWidth, newHeight);
        imgToPaint = tmpCanvas.canvas;
        paintWidth = newWidth;
        paintHeight = newHeight;
        tmpCanvasId = tmpCanvasId === 'prescale1' ? 'prescale2' : 'prescale1';
      }
      ctx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight,
                                0, -height, width, height);

      if (this.imageLayer) {
        var position = this.getCanvasPosition(0, -height);
        this.imageLayer.appendImage({
          imgData: imgData,
          left: position[0],
          top: position[1],
          width: width / currentTransform[0],
          height: height / currentTransform[3]
        });
      }
      this.restore();
    },

    paintInlineImageXObjectGroup:
      function CanvasGraphics_paintInlineImageXObjectGroup(imgData, map) {
      var ctx = this.ctx;
      var w = imgData.width;
      var h = imgData.height;

      var tmpCanvas = this.cachedCanvases.getCanvas('inlineImage', w, h);
      var tmpCtx = tmpCanvas.context;
      putBinaryImageData(tmpCtx, imgData);

      for (var i = 0, ii = map.length; i < ii; i++) {
        var entry = map[i];
        ctx.save();
        ctx.transform.apply(ctx, entry.transform);
        ctx.scale(1, -1);
        ctx.drawImage(tmpCanvas.canvas, entry.x, entry.y, entry.w, entry.h,
                      0, -1, 1, 1);
        if (this.imageLayer) {
          var position = this.getCanvasPosition(entry.x, entry.y);
          this.imageLayer.appendImage({
            imgData: imgData,
            left: position[0],
            top: position[1],
            width: w,
            height: h
          });
        }
        ctx.restore();
      }
    },

    paintSolidColorImageMask:
      function CanvasGraphics_paintSolidColorImageMask() {
        this.ctx.fillRect(0, 0, 1, 1);
    },

    paintXObject: function CanvasGraphics_paintXObject() {
      warn('Unsupported \'paintXObject\' command.');
    },

    // Marked content

    markPoint: function CanvasGraphics_markPoint(tag) {
      // TODO Marked content.
    },
    markPointProps: function CanvasGraphics_markPointProps(tag, properties) {
      // TODO Marked content.
    },
    beginMarkedContent: function CanvasGraphics_beginMarkedContent(tag) {
      // TODO Marked content.
    },
    beginMarkedContentProps: function CanvasGraphics_beginMarkedContentProps(
                                        tag, properties) {
      // TODO Marked content.
    },
    endMarkedContent: function CanvasGraphics_endMarkedContent() {
      // TODO Marked content.
    },

    // Compatibility

    beginCompat: function CanvasGraphics_beginCompat() {
      // TODO ignore undefined operators (should we do that anyway?)
    },
    endCompat: function CanvasGraphics_endCompat() {
      // TODO stop ignoring undefined operators
    },

    // Helper functions

    consumePath: function CanvasGraphics_consumePath() {
      var ctx = this.ctx;
      if (this.pendingClip) {
        if (this.pendingClip === EO_CLIP) {
          if (ctx.mozFillRule !== undefined) {
            ctx.mozFillRule = 'evenodd';
            ctx.clip();
            ctx.mozFillRule = 'nonzero';
          } else {
            ctx.clip('evenodd');
          }
        } else {
          ctx.clip();
        }
        this.pendingClip = null;
      }
      ctx.beginPath();
    },
    getSinglePixelWidth: function CanvasGraphics_getSinglePixelWidth(scale) {
      if (this.cachedGetSinglePixelWidth === null) {
        var inverse = this.ctx.mozCurrentTransformInverse;
        // max of the current horizontal and vertical scale
        this.cachedGetSinglePixelWidth = Math.sqrt(Math.max(
          (inverse[0] * inverse[0] + inverse[1] * inverse[1]),
          (inverse[2] * inverse[2] + inverse[3] * inverse[3])));
      }
      return this.cachedGetSinglePixelWidth;
    },
    getCanvasPosition: function CanvasGraphics_getCanvasPosition(x, y) {
      var transform = this.ctx.mozCurrentTransform;
      return [
        transform[0] * x + transform[2] * y + transform[4],
        transform[1] * x + transform[3] * y + transform[5]
      ];
    }
  };

  for (var op in OPS) {
    CanvasGraphics.prototype[OPS[op]] = CanvasGraphics.prototype[op];
  }

  return CanvasGraphics;
})();

exports.CanvasGraphics = CanvasGraphics;
exports.createScratchCanvas = createScratchCanvas;
}));


(function (root, factory) {
  {
    factory((root.pdfjsDisplayAPI = {}), root.pdfjsSharedUtil,
      root.pdfjsDisplayFontLoader, root.pdfjsDisplayCanvas,
      root.pdfjsDisplayMetadata, root.pdfjsSharedGlobal);
  }
}(this, function (exports, sharedUtil, displayFontLoader, displayCanvas,
                  displayMetadata, sharedGlobal, amdRequire) {

var InvalidPDFException = sharedUtil.InvalidPDFException;
var MessageHandler = sharedUtil.MessageHandler;
var MissingPDFException = sharedUtil.MissingPDFException;
var PasswordResponses = sharedUtil.PasswordResponses;
var PasswordException = sharedUtil.PasswordException;
var StatTimer = sharedUtil.StatTimer;
var UnexpectedResponseException = sharedUtil.UnexpectedResponseException;
var UnknownErrorException = sharedUtil.UnknownErrorException;
var Util = sharedUtil.Util;
var createPromiseCapability = sharedUtil.createPromiseCapability;
var combineUrl = sharedUtil.combineUrl;
var error = sharedUtil.error;
var deprecated = sharedUtil.deprecated;
var info = sharedUtil.info;
var isArrayBuffer = sharedUtil.isArrayBuffer;
var loadJpegStream = sharedUtil.loadJpegStream;
var stringToBytes = sharedUtil.stringToBytes;
var warn = sharedUtil.warn;
var FontFaceObject = displayFontLoader.FontFaceObject;
var FontLoader = displayFontLoader.FontLoader;
var CanvasGraphics = displayCanvas.CanvasGraphics;
var createScratchCanvas = displayCanvas.createScratchCanvas;
var Metadata = displayMetadata.Metadata;
var PDFJS = sharedGlobal.PDFJS;
var globalScope = sharedGlobal.globalScope;

var DEFAULT_RANGE_CHUNK_SIZE = 65536; // 2^16 = 65536


var useRequireEnsure = false;
if (typeof module !== 'undefined' && module.require) {
  // node.js - disable worker and set require.ensure.
  PDFJS.disableWorker = true;
  if (typeof require.ensure === 'undefined') {
    require.ensure = require('node-ensure');
  }
  useRequireEnsure = true;
}
if (typeof __webpack_require__ !== 'undefined') {
  // Webpack - get/bundle pdf.worker.js as additional file.
  require('./pdf.worker.js');
  PDFJS.workerSrc = '/dist/pdf.worker.js';
  useRequireEnsure = true;
}
if (typeof requirejs !== 'undefined' && requirejs.toUrl) {
  requirejs.toUrl('pdfjs-dist/build/pdf.worker.js');
  PDFJS.workerSrc = '/dist/pdf.worker.js';
}
var fakeWorkerFilesLoader = useRequireEnsure ? (function (callback) {
  require.ensure([], function () {
    require('./pdf.worker.js');
    callback();
  });
}) : (typeof requirejs !== 'undefined') ? (function (callback) {
  requirejs(['pdfjs-dist/build/pdf.worker'], function (worker) {
    callback();
  });
}) : null;


/**
 * The maximum allowed image size in total pixels e.g. width * height. Images
 * above this value will not be drawn. Use -1 for no limit.
 * @var {number}
 */
PDFJS.maxImageSize = (PDFJS.maxImageSize === undefined ?
                      -1 : PDFJS.maxImageSize);

/**
 * The url of where the predefined Adobe CMaps are located. Include trailing
 * slash.
 * @var {string}
 */
PDFJS.cMapUrl = (PDFJS.cMapUrl === undefined ? null : PDFJS.cMapUrl);

/**
 * Specifies if CMaps are binary packed.
 * @var {boolean}
 */
PDFJS.cMapPacked = PDFJS.cMapPacked === undefined ? false : PDFJS.cMapPacked;

/**
 * By default fonts are converted to OpenType fonts and loaded via font face
 * rules. If disabled, the font will be rendered using a built in font renderer
 * that constructs the glyphs with primitive path commands.
 * @var {boolean}
 */
PDFJS.disableFontFace = (PDFJS.disableFontFace === undefined ?
                         false : PDFJS.disableFontFace);

/**
 * Path for image resources, mainly for annotation icons. Include trailing
 * slash.
 * @var {string}
 */
PDFJS.imageResourcesPath = (PDFJS.imageResourcesPath === undefined ?
                            '' : PDFJS.imageResourcesPath);

/**
 * Disable the web worker and run all code on the main thread. This will happen
 * automatically if the browser doesn't support workers or sending typed arrays
 * to workers.
 * @var {boolean}
 */
PDFJS.disableWorker = (PDFJS.disableWorker === undefined ?
                       false : PDFJS.disableWorker);

/**
 * Path and filename of the worker file. Required when the worker is enabled in
 * development mode. If unspecified in the production build, the worker will be
 * loaded based on the location of the pdf.js file. It is recommended that
 * the workerSrc is set in a custom application to prevent issues caused by
 * third-party frameworks and libraries.
 * @var {string}
 */
PDFJS.workerSrc = (PDFJS.workerSrc === undefined ? null : PDFJS.workerSrc);

/**
 * Disable range request loading of PDF files. When enabled and if the server
 * supports partial content requests then the PDF will be fetched in chunks.
 * Enabled (false) by default.
 * @var {boolean}
 */
PDFJS.disableRange = (PDFJS.disableRange === undefined ?
                      false : PDFJS.disableRange);

/**
 * Disable streaming of PDF file data. By default PDF.js attempts to load PDF
 * in chunks. This default behavior can be disabled.
 * @var {boolean}
 */
PDFJS.disableStream = (PDFJS.disableStream === undefined ?
                       false : PDFJS.disableStream);

/**
 * Disable pre-fetching of PDF file data. When range requests are enabled PDF.js
 * will automatically keep fetching more data even if it isn't needed to display
 * the current page. This default behavior can be disabled.
 *
 * NOTE: It is also necessary to disable streaming, see above,
 *       in order for disabling of pre-fetching to work correctly.
 * @var {boolean}
 */
PDFJS.disableAutoFetch = (PDFJS.disableAutoFetch === undefined ?
                          false : PDFJS.disableAutoFetch);

/**
 * Enables special hooks for debugging PDF.js.
 * @var {boolean}
 */
PDFJS.pdfBug = (PDFJS.pdfBug === undefined ? false : PDFJS.pdfBug);

/**
 * Enables transfer usage in postMessage for ArrayBuffers.
 * @var {boolean}
 */
PDFJS.postMessageTransfers = (PDFJS.postMessageTransfers === undefined ?
                              true : PDFJS.postMessageTransfers);

/**
 * Disables URL.createObjectURL usage.
 * @var {boolean}
 */
PDFJS.disableCreateObjectURL = (PDFJS.disableCreateObjectURL === undefined ?
                                false : PDFJS.disableCreateObjectURL);

/**
 * Disables WebGL usage.
 * @var {boolean}
 */
PDFJS.disableWebGL = (PDFJS.disableWebGL === undefined ?
                      true : PDFJS.disableWebGL);

/**
 * Disables fullscreen support, and by extension Presentation Mode,
 * in browsers which support the fullscreen API.
 * @var {boolean}
 */
PDFJS.disableFullscreen = (PDFJS.disableFullscreen === undefined ?
                           false : PDFJS.disableFullscreen);

/**
 * Enables CSS only zooming.
 * @var {boolean}
 */
PDFJS.useOnlyCssZoom = (PDFJS.useOnlyCssZoom === undefined ?
                        false : PDFJS.useOnlyCssZoom);

/**
 * Controls the logging level.
 * The constants from PDFJS.VERBOSITY_LEVELS should be used:
 * - errors
 * - warnings [default]
 * - infos
 * @var {number}
 */
PDFJS.verbosity = (PDFJS.verbosity === undefined ?
                   PDFJS.VERBOSITY_LEVELS.warnings : PDFJS.verbosity);

/**
 * The maximum supported canvas size in total pixels e.g. width * height.
 * The default value is 4096 * 4096. Use -1 for no limit.
 * @var {number}
 */
PDFJS.maxCanvasPixels = (PDFJS.maxCanvasPixels === undefined ?
                         16777216 : PDFJS.maxCanvasPixels);

/**
 * (Deprecated) Opens external links in a new window if enabled.
 * The default behavior opens external links in the PDF.js window.
 *
 * NOTE: This property has been deprecated, please use
 *       `PDFJS.externalLinkTarget = PDFJS.LinkTarget.BLANK` instead.
 * @var {boolean}
 */
PDFJS.openExternalLinksInNewWindow = (
  PDFJS.openExternalLinksInNewWindow === undefined ?
    false : PDFJS.openExternalLinksInNewWindow);

/**
 * Specifies the |target| attribute for external links.
 * The constants from PDFJS.LinkTarget should be used:
 *  - NONE [default]
 *  - SELF
 *  - BLANK
 *  - PARENT
 *  - TOP
 * @var {number}
 */
PDFJS.externalLinkTarget = (PDFJS.externalLinkTarget === undefined ?
                            PDFJS.LinkTarget.NONE : PDFJS.externalLinkTarget);

/**
 * Specifies the |rel| attribute for external links. Defaults to stripping
 * the referrer.
 * @var {string}
 */
PDFJS.externalLinkRel = (PDFJS.externalLinkRel === undefined ?
                         'noreferrer' : PDFJS.externalLinkRel);

/**
  * Determines if we can eval strings as JS. Primarily used to improve
  * performance for font rendering.
  * @var {boolean}
  */
PDFJS.isEvalSupported = (PDFJS.isEvalSupported === undefined ?
                         true : PDFJS.isEvalSupported);

/**
 * Document initialization / loading parameters object.
 *
 * @typedef {Object} DocumentInitParameters
 * @property {string}     url   - The URL of the PDF.
 * @property {TypedArray|Array|string} data - Binary PDF data. Use typed arrays
 *   (Uint8Array) to improve the memory usage. If PDF data is BASE64-encoded,
 *   use atob() to convert it to a binary string first.
 * @property {Object}     httpHeaders - Basic authentication headers.
 * @property {boolean}    withCredentials - Indicates whether or not cross-site
 *   Access-Control requests should be made using credentials such as cookies
 *   or authorization headers. The default is false.
 * @property {string}     password - For decrypting password-protected PDFs.
 * @property {TypedArray} initialData - A typed array with the first portion or
 *   all of the pdf data. Used by the extension since some data is already
 *   loaded before the switch to range requests.
 * @property {number}     length - The PDF file length. It's used for progress
 *   reports and range requests operations.
 * @property {PDFDataRangeTransport} range
 * @property {number}     rangeChunkSize - Optional parameter to specify
 *   maximum number of bytes fetched per range request. The default value is
 *   2^16 = 65536.
 * @property {PDFWorker}  worker - The worker that will be used for the loading
 *   and parsing of the PDF data.
 */

/**
 * @typedef {Object} PDFDocumentStats
 * @property {Array} streamTypes - Used stream types in the document (an item
 *   is set to true if specific stream ID was used in the document).
 * @property {Array} fontTypes - Used font type in the document (an item is set
 *   to true if specific font ID was used in the document).
 */

/**
 * This is the main entry point for loading a PDF and interacting with it.
 * NOTE: If a URL is used to fetch the PDF data a standard XMLHttpRequest(XHR)
 * is used, which means it must follow the same origin rules that any XHR does
 * e.g. No cross domain requests without CORS.
 *
 * @param {string|TypedArray|DocumentInitParameters|PDFDataRangeTransport} src
 * Can be a url to where a PDF is located, a typed array (Uint8Array)
 * already populated with data or parameter object.
 *
 * @param {PDFDataRangeTransport} pdfDataRangeTransport (deprecated) It is used
 * if you want to manually serve range requests for data in the PDF.
 *
 * @param {function} passwordCallback (deprecated) It is used to request a
 * password if wrong or no password was provided. The callback receives two
 * parameters: function that needs to be called with new password and reason
 * (see {PasswordResponses}).
 *
 * @param {function} progressCallback (deprecated) It is used to be able to
 * monitor the loading progress of the PDF file (necessary to implement e.g.
 * a loading bar). The callback receives an {Object} with the properties:
 * {number} loaded and {number} total.
 *
 * @return {PDFDocumentLoadingTask}
 */
PDFJS.getDocument = function getDocument(src,
                                         pdfDataRangeTransport,
                                         passwordCallback,
                                         progressCallback) {
  var task = new PDFDocumentLoadingTask();

  // Support of the obsolete arguments (for compatibility with API v1.0)
  if (arguments.length > 1) {
    deprecated('getDocument is called with pdfDataRangeTransport, ' +
               'passwordCallback or progressCallback argument');
  }
  if (pdfDataRangeTransport) {
    if (!(pdfDataRangeTransport instanceof PDFDataRangeTransport)) {
      // Not a PDFDataRangeTransport instance, trying to add missing properties.
      pdfDataRangeTransport = Object.create(pdfDataRangeTransport);
      pdfDataRangeTransport.length = src.length;
      pdfDataRangeTransport.initialData = src.initialData;
      if (!pdfDataRangeTransport.abort) {
        pdfDataRangeTransport.abort = function () {};
      }
    }
    src = Object.create(src);
    src.range = pdfDataRangeTransport;
  }
  task.onPassword = passwordCallback || null;
  task.onProgress = progressCallback || null;

  var source;
  if (typeof src === 'string') {
    source = { url: src };
  } else if (isArrayBuffer(src)) {
    source = { data: src };
  } else if (src instanceof PDFDataRangeTransport) {
    source = { range: src };
  } else {
    if (typeof src !== 'object') {
      error('Invalid parameter in getDocument, need either Uint8Array, ' +
        'string or a parameter object');
    }
    if (!src.url && !src.data && !src.range) {
      error('Invalid parameter object: need either .data, .range or .url');
    }

    source = src;
  }

  var params = {};
  var rangeTransport = null;
  var worker = null;
  for (var key in source) {
    if (key === 'url' && typeof window !== 'undefined') {
      // The full path is required in the 'url' field.
      params[key] = combineUrl(window.location.href, source[key]);
      continue;
    } else if (key === 'range') {
      rangeTransport = source[key];
      continue;
    } else if (key === 'worker') {
      worker = source[key];
      continue;
    } else if (key === 'data' && !(source[key] instanceof Uint8Array)) {
      // Converting string or array-like data to Uint8Array.
      var pdfBytes = source[key];
      if (typeof pdfBytes === 'string') {
        params[key] = stringToBytes(pdfBytes);
      } else if (typeof pdfBytes === 'object' && pdfBytes !== null &&
                 !isNaN(pdfBytes.length)) {
        params[key] = new Uint8Array(pdfBytes);
      } else if (isArrayBuffer(pdfBytes)) {
        params[key] = new Uint8Array(pdfBytes);
      } else {
        error('Invalid PDF binary data: either typed array, string or ' +
              'array-like object is expected in the data property.');
      }
      continue;
    }
    params[key] = source[key];
  }

  params.rangeChunkSize = params.rangeChunkSize || DEFAULT_RANGE_CHUNK_SIZE;

  if (!worker) {
    // Worker was not provided -- creating and owning our own.
    worker = new PDFWorker();
    task._worker = worker;
  }
  var docId = task.docId;
  worker.promise.then(function () {
    if (task.destroyed) {
      throw new Error('Loading aborted');
    }
    return _fetchDocument(worker, params, rangeTransport, docId).then(
        function (workerId) {
      if (task.destroyed) {
        throw new Error('Loading aborted');
      }
      var messageHandler = new MessageHandler(docId, workerId, worker.port);
      messageHandler.send('Ready', null);
      var transport = new WorkerTransport(messageHandler, task, rangeTransport);
      task._transport = transport;
    });
  }).catch(task._capability.reject);

  return task;
};

/**
 * Starts fetching of specified PDF document/data.
 * @param {PDFWorker} worker
 * @param {Object} source
 * @param {PDFDataRangeTransport} pdfDataRangeTransport
 * @param {string} docId Unique document id, used as MessageHandler id.
 * @returns {Promise} The promise, which is resolved when worker id of
 *                    MessageHandler is known.
 * @private
 */
function _fetchDocument(worker, source, pdfDataRangeTransport, docId) {
  if (worker.destroyed) {
    return Promise.reject(new Error('Worker was destroyed'));
  }

  source.disableAutoFetch = PDFJS.disableAutoFetch;
  source.disableStream = PDFJS.disableStream;
  source.chunkedViewerLoading = !!pdfDataRangeTransport;
  if (pdfDataRangeTransport) {
    source.length = pdfDataRangeTransport.length;
    source.initialData = pdfDataRangeTransport.initialData;
  }
  return worker.messageHandler.sendWithPromise('GetDocRequest', {
    docId: docId,
    source: source,
    disableRange: PDFJS.disableRange,
    maxImageSize: PDFJS.maxImageSize,
    cMapUrl: PDFJS.cMapUrl,
    cMapPacked: PDFJS.cMapPacked,
    disableFontFace: PDFJS.disableFontFace,
    disableCreateObjectURL: PDFJS.disableCreateObjectURL,
    verbosity: PDFJS.verbosity
  }).then(function (workerId) {
    if (worker.destroyed) {
      throw new Error('Worker was destroyed');
    }
    return workerId;
  });
}

/**
 * PDF document loading operation.
 * @class
 * @alias PDFDocumentLoadingTask
 */
var PDFDocumentLoadingTask = (function PDFDocumentLoadingTaskClosure() {
  var nextDocumentId = 0;

  /** @constructs PDFDocumentLoadingTask */
  function PDFDocumentLoadingTask() {
    this._capability = createPromiseCapability();
    this._transport = null;
    this._worker = null;

    /**
     * Unique document loading task id -- used in MessageHandlers.
     * @type {string}
     */
    this.docId = 'd' + (nextDocumentId++);

    /**
     * Shows if loading task is destroyed.
     * @type {boolean}
     */
    this.destroyed = false;

    /**
     * Callback to request a password if wrong or no password was provided.
     * The callback receives two parameters: function that needs to be called
     * with new password and reason (see {PasswordResponses}).
     */
    this.onPassword = null;

    /**
     * Callback to be able to monitor the loading progress of the PDF file
     * (necessary to implement e.g. a loading bar). The callback receives
     * an {Object} with the properties: {number} loaded and {number} total.
     */
    this.onProgress = null;

    /**
     * Callback to when unsupported feature is used. The callback receives
     * an {PDFJS.UNSUPPORTED_FEATURES} argument.
     */
    this.onUnsupportedFeature = null;
  }

  PDFDocumentLoadingTask.prototype =
      /** @lends PDFDocumentLoadingTask.prototype */ {
    /**
     * @return {Promise}
     */
    get promise() {
      return this._capability.promise;
    },

    /**
     * Aborts all network requests and destroys worker.
     * @return {Promise} A promise that is resolved after destruction activity
     *                   is completed.
     */
    destroy: function () {
      this.destroyed = true;

      var transportDestroyed = !this._transport ? Promise.resolve() :
        this._transport.destroy();
      return transportDestroyed.then(function () {
        this._transport = null;
        if (this._worker) {
          this._worker.destroy();
          this._worker = null;
        }
      }.bind(this));
    },

    /**
     * Registers callbacks to indicate the document loading completion.
     *
     * @param {function} onFulfilled The callback for the loading completion.
     * @param {function} onRejected The callback for the loading failure.
     * @return {Promise} A promise that is resolved after the onFulfilled or
     *                   onRejected callback.
     */
    then: function PDFDocumentLoadingTask_then(onFulfilled, onRejected) {
      return this.promise.then.apply(this.promise, arguments);
    }
  };

  return PDFDocumentLoadingTask;
})();

/**
 * Abstract class to support range requests file loading.
 * @class
 * @alias PDFJS.PDFDataRangeTransport
 * @param {number} length
 * @param {Uint8Array} initialData
 */
var PDFDataRangeTransport = (function pdfDataRangeTransportClosure() {
  function PDFDataRangeTransport(length, initialData) {
    this.length = length;
    this.initialData = initialData;

    this._rangeListeners = [];
    this._progressListeners = [];
    this._progressiveReadListeners = [];
    this._readyCapability = createPromiseCapability();
  }
  PDFDataRangeTransport.prototype =
      /** @lends PDFDataRangeTransport.prototype */ {
    addRangeListener:
        function PDFDataRangeTransport_addRangeListener(listener) {
      this._rangeListeners.push(listener);
    },

    addProgressListener:
        function PDFDataRangeTransport_addProgressListener(listener) {
      this._progressListeners.push(listener);
    },

    addProgressiveReadListener:
        function PDFDataRangeTransport_addProgressiveReadListener(listener) {
      this._progressiveReadListeners.push(listener);
    },

    onDataRange: function PDFDataRangeTransport_onDataRange(begin, chunk) {
      var listeners = this._rangeListeners;
      for (var i = 0, n = listeners.length; i < n; ++i) {
        listeners[i](begin, chunk);
      }
    },

    onDataProgress: function PDFDataRangeTransport_onDataProgress(loaded) {
      this._readyCapability.promise.then(function () {
        var listeners = this._progressListeners;
        for (var i = 0, n = listeners.length; i < n; ++i) {
          listeners[i](loaded);
        }
      }.bind(this));
    },

    onDataProgressiveRead:
        function PDFDataRangeTransport_onDataProgress(chunk) {
      this._readyCapability.promise.then(function () {
        var listeners = this._progressiveReadListeners;
        for (var i = 0, n = listeners.length; i < n; ++i) {
          listeners[i](chunk);
        }
      }.bind(this));
    },

    transportReady: function PDFDataRangeTransport_transportReady() {
      this._readyCapability.resolve();
    },

    requestDataRange:
        function PDFDataRangeTransport_requestDataRange(begin, end) {
      throw new Error('Abstract method PDFDataRangeTransport.requestDataRange');
    },

    abort: function PDFDataRangeTransport_abort() {
    }
  };
  return PDFDataRangeTransport;
})();

PDFJS.PDFDataRangeTransport = PDFDataRangeTransport;

/**
 * Proxy to a PDFDocument in the worker thread. Also, contains commonly used
 * properties that can be read synchronously.
 * @class
 * @alias PDFDocumentProxy
 */
var PDFDocumentProxy = (function PDFDocumentProxyClosure() {
  function PDFDocumentProxy(pdfInfo, transport, loadingTask) {
    this.pdfInfo = pdfInfo;
    this.transport = transport;
    this.loadingTask = loadingTask;
  }
  PDFDocumentProxy.prototype = /** @lends PDFDocumentProxy.prototype */ {
    /**
     * @return {number} Total number of pages the PDF contains.
     */
    get numPages() {
      return this.pdfInfo.numPages;
    },
    /**
     * @return {string} A unique ID to identify a PDF. Not guaranteed to be
     * unique.
     */
    get fingerprint() {
      return this.pdfInfo.fingerprint;
    },
    /**
     * @param {number} pageNumber The page number to get. The first page is 1.
     * @return {Promise} A promise that is resolved with a {@link PDFPageProxy}
     * object.
     */
    getPage: function PDFDocumentProxy_getPage(pageNumber) {
      return this.transport.getPage(pageNumber);
    },
    /**
     * @param {{num: number, gen: number}} ref The page reference. Must have
     *   the 'num' and 'gen' properties.
     * @return {Promise} A promise that is resolved with the page index that is
     * associated with the reference.
     */
    getPageIndex: function PDFDocumentProxy_getPageIndex(ref) {
      return this.transport.getPageIndex(ref);
    },
    /**
     * @return {Promise} A promise that is resolved with a lookup table for
     * mapping named destinations to reference numbers.
     *
     * This can be slow for large documents: use getDestination instead
     */
    getDestinations: function PDFDocumentProxy_getDestinations() {
      return this.transport.getDestinations();
    },
    /**
     * @param {string} id The named destination to get.
     * @return {Promise} A promise that is resolved with all information
     * of the given named destination.
     */
    getDestination: function PDFDocumentProxy_getDestination(id) {
      return this.transport.getDestination(id);
    },
    /**
     * @return {Promise} A promise that is resolved with:
     *   an Array containing the pageLabels that correspond to the pageIndexes,
     *   or `null` when no pageLabels are present in the PDF file.
     */
    getPageLabels: function PDFDocumentProxy_getPageLabels() {
      return this.transport.getPageLabels();
    },
    /**
     * @return {Promise} A promise that is resolved with a lookup table for
     * mapping named attachments to their content.
     */
    getAttachments: function PDFDocumentProxy_getAttachments() {
      return this.transport.getAttachments();
    },
    /**
     * @return {Promise} A promise that is resolved with an array of all the
     * JavaScript strings in the name tree.
     */
    getJavaScript: function PDFDocumentProxy_getJavaScript() {
      return this.transport.getJavaScript();
    },
    /**
     * @return {Promise} A promise that is resolved with an {Array} that is a
     * tree outline (if it has one) of the PDF. The tree is in the format of:
     * [
     *  {
     *   title: string,
     *   bold: boolean,
     *   italic: boolean,
     *   color: rgb array,
     *   dest: dest obj,
     *   url: string,
     *   items: array of more items like this
     *  },
     *  ...
     * ].
     */
    getOutline: function PDFDocumentProxy_getOutline() {
      return this.transport.getOutline();
    },
    /**
     * @return {Promise} A promise that is resolved with an {Object} that has
     * info and metadata properties.  Info is an {Object} filled with anything
     * available in the information dictionary and similarly metadata is a
     * {Metadata} object with information from the metadata section of the PDF.
     */
    getMetadata: function PDFDocumentProxy_getMetadata() {
      return this.transport.getMetadata();
    },
    /**
     * @return {Promise} A promise that is resolved with a TypedArray that has
     * the raw data from the PDF.
     */
    getData: function PDFDocumentProxy_getData() {
      return this.transport.getData();
    },
    /**
     * @return {Promise} A promise that is resolved when the document's data
     * is loaded. It is resolved with an {Object} that contains the length
     * property that indicates size of the PDF data in bytes.
     */
    getDownloadInfo: function PDFDocumentProxy_getDownloadInfo() {
      return this.transport.downloadInfoCapability.promise;
    },
    /**
     * @return {Promise} A promise this is resolved with current stats about
     * document structures (see {@link PDFDocumentStats}).
     */
    getStats: function PDFDocumentProxy_getStats() {
      return this.transport.getStats();
    },
    /**
     * Cleans up resources allocated by the document, e.g. created @font-face.
     */
    cleanup: function PDFDocumentProxy_cleanup() {
      this.transport.startCleanup();
    },
    /**
     * Destroys current document instance and terminates worker.
     */
    destroy: function PDFDocumentProxy_destroy() {
      return this.loadingTask.destroy();
    }
  };
  return PDFDocumentProxy;
})();

/**
 * Page getTextContent parameters.
 *
 * @typedef {Object} getTextContentParameters
 * @param {boolean} normalizeWhitespace - replaces all occurrences of
 *   whitespace with standard spaces (0x20). The default value is `false`.
 */

/**
 * Page text content.
 *
 * @typedef {Object} TextContent
 * @property {array} items - array of {@link TextItem}
 * @property {Object} styles - {@link TextStyles} objects, indexed by font
 *                    name.
 */

/**
 * Page text content part.
 *
 * @typedef {Object} TextItem
 * @property {string} str - text content.
 * @property {string} dir - text direction: 'ttb', 'ltr' or 'rtl'.
 * @property {array} transform - transformation matrix.
 * @property {number} width - width in device space.
 * @property {number} height - height in device space.
 * @property {string} fontName - font name used by pdf.js for converted font.
 */

/**
 * Text style.
 *
 * @typedef {Object} TextStyle
 * @property {number} ascent - font ascent.
 * @property {number} descent - font descent.
 * @property {boolean} vertical - text is in vertical mode.
 * @property {string} fontFamily - possible font family
 */

/**
 * Page annotation parameters.
 *
 * @typedef {Object} GetAnnotationsParameters
 * @param {string} intent - Determines the annotations that will be fetched,
 *                 can be either 'display' (viewable annotations) or 'print'
 *                 (printable annotations).
 *                 If the parameter is omitted, all annotations are fetched.
 */

/**
 * Page render parameters.
 *
 * @typedef {Object} RenderParameters
 * @property {Object} canvasContext - A 2D context of a DOM Canvas object.
 * @property {PDFJS.PageViewport} viewport - Rendering viewport obtained by
 *                                calling of PDFPage.getViewport method.
 * @property {string} intent - Rendering intent, can be 'display' or 'print'
 *                    (default value is 'display').
 * @property {Array}  transform - (optional) Additional transform, applied
 *                    just before viewport transform.
 * @property {Object} imageLayer - (optional) An object that has beginLayout,
 *                    endLayout and appendImage functions.
 * @property {function} continueCallback - (deprecated) A function that will be
 *                      called each time the rendering is paused.  To continue
 *                      rendering call the function that is the first argument
 *                      to the callback.
 */

/**
 * PDF page operator list.
 *
 * @typedef {Object} PDFOperatorList
 * @property {Array} fnArray - Array containing the operator functions.
 * @property {Array} argsArray - Array containing the arguments of the
 *                               functions.
 */

/**
 * Proxy to a PDFPage in the worker thread.
 * @class
 * @alias PDFPageProxy
 */
var PDFPageProxy = (function PDFPageProxyClosure() {
  function PDFPageProxy(pageIndex, pageInfo, transport) {
    this.pageIndex = pageIndex;
    this.pageInfo = pageInfo;
    this.transport = transport;
    this.stats = new StatTimer();
    this.stats.enabled = !!globalScope.PDFJS.enableStats;
    this.commonObjs = transport.commonObjs;
    this.objs = new PDFObjects();
    this.cleanupAfterRender = false;
    this.pendingCleanup = false;
    this.intentStates = {};
    this.destroyed = false;
  }
  PDFPageProxy.prototype = /** @lends PDFPageProxy.prototype */ {
    /**
     * @return {number} Page number of the page. First page is 1.
     */
    get pageNumber() {
      return this.pageIndex + 1;
    },
    /**
     * @return {number} The number of degrees the page is rotated clockwise.
     */
    get rotate() {
      return this.pageInfo.rotate;
    },
    /**
     * @return {Object} The reference that points to this page. It has 'num' and
     * 'gen' properties.
     */
    get ref() {
      return this.pageInfo.ref;
    },
    /**
     * @return {Array} An array of the visible portion of the PDF page in the
     * user space units - [x1, y1, x2, y2].
     */
    get view() {
      return this.pageInfo.view;
    },
    /**
     * @param {number} scale The desired scale of the viewport.
     * @param {number} rotate Degrees to rotate the viewport. If omitted this
     * defaults to the page rotation.
     * @return {PDFJS.PageViewport} Contains 'width' and 'height' properties
     * along with transforms required for rendering.
     */
    getViewport: function PDFPageProxy_getViewport(scale, rotate) {
      if (arguments.length < 2) {
        rotate = this.rotate;
      }
      return new PDFJS.PageViewport(this.view, scale, rotate, 0, 0);
    },
    /**
     * @param {GetAnnotationsParameters} params - Annotation parameters.
     * @return {Promise} A promise that is resolved with an {Array} of the
     * annotation objects.
     */
    getAnnotations: function PDFPageProxy_getAnnotations(params) {
      var intent = (params && params.intent) || null;

      if (!this.annotationsPromise || this.annotationsIntent !== intent) {
        this.annotationsPromise = this.transport.getAnnotations(this.pageIndex,
                                                                intent);
        this.annotationsIntent = intent;
      }
      return this.annotationsPromise;
    },
    /**
     * Begins the process of rendering a page to the desired context.
     * @param {RenderParameters} params Page render parameters.
     * @return {RenderTask} An object that contains the promise, which
     *                      is resolved when the page finishes rendering.
     */
    render: function PDFPageProxy_render(params) {
      var stats = this.stats;
      stats.time('Overall');

      // If there was a pending destroy cancel it so no cleanup happens during
      // this call to render.
      this.pendingCleanup = false;

      var renderingIntent = (params.intent === 'print' ? 'print' : 'display');

      if (!this.intentStates[renderingIntent]) {
        this.intentStates[renderingIntent] = {};
      }
      var intentState = this.intentStates[renderingIntent];

      // If there's no displayReadyCapability yet, then the operatorList
      // was never requested before. Make the request and create the promise.
      if (!intentState.displayReadyCapability) {
        intentState.receivingOperatorList = true;
        intentState.displayReadyCapability = createPromiseCapability();
        intentState.operatorList = {
          fnArray: [],
          argsArray: [],
          lastChunk: false
        };

        this.stats.time('Page Request');
        this.transport.messageHandler.send('RenderPageRequest', {
          pageIndex: this.pageNumber - 1,
          intent: renderingIntent
        });
      }

      var internalRenderTask = new InternalRenderTask(complete, params,
                                                      this.objs,
                                                      this.commonObjs,
                                                      intentState.operatorList,
                                                      this.pageNumber);
      internalRenderTask.useRequestAnimationFrame = renderingIntent !== 'print';
      if (!intentState.renderTasks) {
        intentState.renderTasks = [];
      }
      intentState.renderTasks.push(internalRenderTask);
      var renderTask = internalRenderTask.task;

      // Obsolete parameter support
      if (params.continueCallback) {
        deprecated('render is used with continueCallback parameter');
        renderTask.onContinue = params.continueCallback;
      }

      var self = this;
      intentState.displayReadyCapability.promise.then(
        function pageDisplayReadyPromise(transparency) {
          if (self.pendingCleanup) {
            complete();
            return;
          }
          stats.time('Rendering');
          internalRenderTask.initalizeGraphics(transparency);
          internalRenderTask.operatorListChanged();
        },
        function pageDisplayReadPromiseError(reason) {
          complete(reason);
        }
      );

      function complete(error) {
        var i = intentState.renderTasks.indexOf(internalRenderTask);
        if (i >= 0) {
          intentState.renderTasks.splice(i, 1);
        }

        if (self.cleanupAfterRender) {
          self.pendingCleanup = true;
        }
        self._tryCleanup();

        if (error) {
          internalRenderTask.capability.reject(error);
        } else {
          internalRenderTask.capability.resolve();
        }
        stats.timeEnd('Rendering');
        stats.timeEnd('Overall');
      }

      return renderTask;
    },

    /**
     * @return {Promise} A promise resolved with an {@link PDFOperatorList}
     * object that represents page's operator list.
     */
    getOperatorList: function PDFPageProxy_getOperatorList() {
      function operatorListChanged() {
        if (intentState.operatorList.lastChunk) {
          intentState.opListReadCapability.resolve(intentState.operatorList);
        }
      }

      var renderingIntent = 'oplist';
      if (!this.intentStates[renderingIntent]) {
        this.intentStates[renderingIntent] = {};
      }
      var intentState = this.intentStates[renderingIntent];

      if (!intentState.opListReadCapability) {
        var opListTask = {};
        opListTask.operatorListChanged = operatorListChanged;
        intentState.receivingOperatorList = true;
        intentState.opListReadCapability = createPromiseCapability();
        intentState.renderTasks = [];
        intentState.renderTasks.push(opListTask);
        intentState.operatorList = {
          fnArray: [],
          argsArray: [],
          lastChunk: false
        };

        this.transport.messageHandler.send('RenderPageRequest', {
          pageIndex: this.pageIndex,
          intent: renderingIntent
        });
      }
      return intentState.opListReadCapability.promise;
    },

    /**
     * @param {getTextContentParameters} params - getTextContent parameters.
     * @return {Promise} That is resolved a {@link TextContent}
     * object that represent the page text content.
     */
    getTextContent: function PDFPageProxy_getTextContent(params) {
      var normalizeWhitespace = (params && params.normalizeWhitespace) || false;

      return this.transport.messageHandler.sendWithPromise('GetTextContent', {
        pageIndex: this.pageNumber - 1,
        normalizeWhitespace: normalizeWhitespace,
      });
    },

    /**
     * Destroys page object.
     */
    _destroy: function PDFPageProxy_destroy() {
      this.destroyed = true;
      this.transport.pageCache[this.pageIndex] = null;

      var waitOn = [];
      Object.keys(this.intentStates).forEach(function(intent) {
        var intentState = this.intentStates[intent];
        intentState.renderTasks.forEach(function(renderTask) {
          var renderCompleted = renderTask.capability.promise.
            catch(function () {}); // ignoring failures
          waitOn.push(renderCompleted);
          renderTask.cancel();
        });
      }, this);
      this.objs.clear();
      this.annotationsPromise = null;
      this.pendingCleanup = false;
      return Promise.all(waitOn);
    },

    /**
     * Cleans up resources allocated by the page. (deprecated)
     */
    destroy: function() {
      deprecated('page destroy method, use cleanup() instead');
      this.cleanup();
    },

    /**
     * Cleans up resources allocated by the page.
     */
    cleanup: function PDFPageProxy_cleanup() {
      this.pendingCleanup = true;
      this._tryCleanup();
    },
    /**
     * For internal use only. Attempts to clean up if rendering is in a state
     * where that's possible.
     * @ignore
     */
    _tryCleanup: function PDFPageProxy_tryCleanup() {
      if (!this.pendingCleanup ||
          Object.keys(this.intentStates).some(function(intent) {
            var intentState = this.intentStates[intent];
            return (intentState.renderTasks.length !== 0 ||
                    intentState.receivingOperatorList);
          }, this)) {
        return;
      }

      Object.keys(this.intentStates).forEach(function(intent) {
        delete this.intentStates[intent];
      }, this);
      this.objs.clear();
      this.annotationsPromise = null;
      this.pendingCleanup = false;
    },
    /**
     * For internal use only.
     * @ignore
     */
    _startRenderPage: function PDFPageProxy_startRenderPage(transparency,
                                                            intent) {
      var intentState = this.intentStates[intent];
      // TODO Refactor RenderPageRequest to separate rendering
      // and operator list logic
      if (intentState.displayReadyCapability) {
        intentState.displayReadyCapability.resolve(transparency);
      }
    },
    /**
     * For internal use only.
     * @ignore
     */
    _renderPageChunk: function PDFPageProxy_renderPageChunk(operatorListChunk,
                                                            intent) {
      var intentState = this.intentStates[intent];
      var i, ii;
      // Add the new chunk to the current operator list.
      for (i = 0, ii = operatorListChunk.length; i < ii; i++) {
        intentState.operatorList.fnArray.push(operatorListChunk.fnArray[i]);
        intentState.operatorList.argsArray.push(
          operatorListChunk.argsArray[i]);
      }
      intentState.operatorList.lastChunk = operatorListChunk.lastChunk;

      // Notify all the rendering tasks there are more operators to be consumed.
      for (i = 0; i < intentState.renderTasks.length; i++) {
        intentState.renderTasks[i].operatorListChanged();
      }

      if (operatorListChunk.lastChunk) {
        intentState.receivingOperatorList = false;
        this._tryCleanup();
      }
    }
  };
  return PDFPageProxy;
})();

/**
 * PDF.js web worker abstraction, it controls instantiation of PDF documents and
 * WorkerTransport for them.  If creation of a web worker is not possible,
 * a "fake" worker will be used instead.
 * @class
 */
var PDFWorker = (function PDFWorkerClosure() {
  var nextFakeWorkerId = 0;

  function getWorkerSrc() {
    if (process.env.NODE_ENV === 'development') {
      return 'pdf.worker.js';
    } else {
      return '/dist/pdf.worker.js';
    }
    if (PDFJS.workerSrc) {
      return PDFJS.workerSrc;
    }
    if (pdfjsFilePath) {
      return pdfjsFilePath.replace(/\.js$/i, '.worker.js');
    }
    error('No PDFJS.workerSrc specified');
  }

  // Loads worker code into main thread.
  function setupFakeWorkerGlobal() {
    if (!PDFJS.fakeWorkerFilesLoadedCapability) {
      PDFJS.fakeWorkerFilesLoadedCapability = createPromiseCapability();
      // In the developer build load worker_loader which in turn loads all the
      // other files and resolves the promise. In production only the
      // pdf.worker.js file is needed.
      var loader = fakeWorkerFilesLoader || function (callback) {
        Util.loadScript(getWorkerSrc(), callback);
      };
      loader(function () {
        PDFJS.fakeWorkerFilesLoadedCapability.resolve();
      });
    }
    return PDFJS.fakeWorkerFilesLoadedCapability.promise;
  }

  function PDFWorker(name) {
    this.name = name;
    this.destroyed = false;

    this._readyCapability = createPromiseCapability();
    this._port = null;
    this._webWorker = null;
    this._messageHandler = null;
    this._initialize();
  }

  PDFWorker.prototype =  /** @lends PDFWorker.prototype */ {
    get promise() {
      return this._readyCapability.promise;
    },

    get port() {
      return this._port;
    },

    get messageHandler() {
      return this._messageHandler;
    },

    _initialize: function PDFWorker_initialize() {
      // If worker support isn't disabled explicit and the browser has worker
      // support, create a new web worker and test if it/the browser fullfills
      // all requirements to run parts of pdf.js in a web worker.
      // Right now, the requirement is, that an Uint8Array is still an
      // Uint8Array as it arrives on the worker. (Chrome added this with v.15.)
      if (!globalScope.PDFJS.disableWorker && typeof Worker !== 'undefined') {
        var workerSrc = getWorkerSrc();

        try {
          // Some versions of FF can't create a worker on localhost, see:
          // https://bugzilla.mozilla.org/show_bug.cgi?id=683280
          var worker = new Worker(workerSrc);
          var messageHandler = new MessageHandler('main', 'worker', worker);
          messageHandler.on('test', function PDFWorker_test(data) {
            if (this.destroyed) {
              this._readyCapability.reject(new Error('Worker was destroyed'));
              messageHandler.destroy();
              worker.terminate();
              return; // worker was destroyed
            }
            var supportTypedArray = data && data.supportTypedArray;
            if (supportTypedArray) {
              this._messageHandler = messageHandler;
              this._port = worker;
              this._webWorker = worker;
              if (!data.supportTransfers) {
                PDFJS.postMessageTransfers = false;
              }
              this._readyCapability.resolve();
            } else {
              this._setupFakeWorker();
              messageHandler.destroy();
              worker.terminate();
            }
          }.bind(this));

          messageHandler.on('console_log', function (data) {
            console.log.apply(console, data);
          });
          messageHandler.on('console_error', function (data) {
            console.error.apply(console, data);
          });

          messageHandler.on('ready', function (data) {
            if (this.destroyed) {
              this._readyCapability.reject(new Error('Worker was destroyed'));
              messageHandler.destroy();
              worker.terminate();
              return; // worker was destroyed
            }
            try {
              sendTest();
            } catch (e)  {
              // We need fallback to a faked worker.
              this._setupFakeWorker();
            }
          }.bind(this));

          var sendTest = function () {
            var testObj = new Uint8Array(
              [PDFJS.postMessageTransfers ? 255 : 0]);
            // Some versions of Opera throw a DATA_CLONE_ERR on serializing the
            // typed array. Also, checking if we can use transfers.
            try {
              messageHandler.send('test', testObj, [testObj.buffer]);
            } catch (ex) {
              info('Cannot use postMessage transfers');
              testObj[0] = 0;
              messageHandler.send('test', testObj);
            }
          };

          // It might take time for worker to initialize (especially when AMD
          // loader is used). We will try to send test immediately, and then
          // when 'ready' message will arrive. The worker shall process only
          // first received 'test'.
          sendTest();
          return;
        } catch (e) {
          info('The worker has been disabled.');
        }
      }
      // Either workers are disabled, not supported or have thrown an exception.
      // Thus, we fallback to a faked worker.
      this._setupFakeWorker();
    },

    _setupFakeWorker: function PDFWorker_setupFakeWorker() {
      if (!globalScope.PDFJS.disableWorker) {
        warn('Setting up fake worker.');
        globalScope.PDFJS.disableWorker = true;
      }

      setupFakeWorkerGlobal().then(function () {
        if (this.destroyed) {
          this._readyCapability.reject(new Error('Worker was destroyed'));
          return;
        }

        // If we don't use a worker, just post/sendMessage to the main thread.
        var port = {
          _listeners: [],
          postMessage: function (obj) {
            var e = {data: obj};
            this._listeners.forEach(function (listener) {
              listener.call(this, e);
            }, this);
          },
          addEventListener: function (name, listener) {
            this._listeners.push(listener);
          },
          removeEventListener: function (name, listener) {
            var i = this._listeners.indexOf(listener);
            this._listeners.splice(i, 1);
          },
          terminate: function () {}
        };
        this._port = port;

        // All fake workers use the same port, making id unique.
        var id = 'fake' + (nextFakeWorkerId++);

        // If the main thread is our worker, setup the handling for the
        // messages -- the main thread sends to it self.
        var workerHandler = new MessageHandler(id + '_worker', id, port);
        PDFJS.WorkerMessageHandler.setup(workerHandler, port);

        var messageHandler = new MessageHandler(id, id + '_worker', port);
        this._messageHandler = messageHandler;
        this._readyCapability.resolve();
      }.bind(this));
    },

    /**
     * Destroys the worker instance.
     */
    destroy: function PDFWorker_destroy() {
      this.destroyed = true;
      if (this._webWorker) {
        // We need to terminate only web worker created resource.
        this._webWorker.terminate();
        this._webWorker = null;
      }
      this._port = null;
      if (this._messageHandler) {
        this._messageHandler.destroy();
        this._messageHandler = null;
      }
    }
  };

  return PDFWorker;
})();
PDFJS.PDFWorker = PDFWorker;

/**
 * For internal use only.
 * @ignore
 */
var WorkerTransport = (function WorkerTransportClosure() {
  function WorkerTransport(messageHandler, loadingTask, pdfDataRangeTransport) {
    this.messageHandler = messageHandler;
    this.loadingTask = loadingTask;
    this.pdfDataRangeTransport = pdfDataRangeTransport;
    this.commonObjs = new PDFObjects();
    this.fontLoader = new FontLoader(loadingTask.docId);

    this.destroyed = false;
    this.destroyCapability = null;

    this.pageCache = [];
    this.pagePromises = [];
    this.downloadInfoCapability = createPromiseCapability();

    this.setupMessageHandler();
  }
  WorkerTransport.prototype = {
    destroy: function WorkerTransport_destroy() {
      if (this.destroyCapability) {
        return this.destroyCapability.promise;
      }

      this.destroyed = true;
      this.destroyCapability = createPromiseCapability();

      var waitOn = [];
      // We need to wait for all renderings to be completed, e.g.
      // timeout/rAF can take a long time.
      this.pageCache.forEach(function (page) {
        if (page) {
          waitOn.push(page._destroy());
        }
      });
      this.pageCache = [];
      this.pagePromises = [];
      var self = this;
      // We also need to wait for the worker to finish its long running tasks.
      var terminated = this.messageHandler.sendWithPromise('Terminate', null);
      waitOn.push(terminated);
      Promise.all(waitOn).then(function () {
        self.fontLoader.clear();
        if (self.pdfDataRangeTransport) {
          self.pdfDataRangeTransport.abort();
          self.pdfDataRangeTransport = null;
        }
        if (self.messageHandler) {
          self.messageHandler.destroy();
          self.messageHandler = null;
        }
        self.destroyCapability.resolve();
      }, this.destroyCapability.reject);
      return this.destroyCapability.promise;
    },

    setupMessageHandler:
      function WorkerTransport_setupMessageHandler() {
      var messageHandler = this.messageHandler;

      function updatePassword(password) {
        messageHandler.send('UpdatePassword', password);
      }

      var pdfDataRangeTransport = this.pdfDataRangeTransport;
      if (pdfDataRangeTransport) {
        pdfDataRangeTransport.addRangeListener(function(begin, chunk) {
          messageHandler.send('OnDataRange', {
            begin: begin,
            chunk: chunk
          });
        });

        pdfDataRangeTransport.addProgressListener(function(loaded) {
          messageHandler.send('OnDataProgress', {
            loaded: loaded
          });
        });

        pdfDataRangeTransport.addProgressiveReadListener(function(chunk) {
          messageHandler.send('OnDataRange', {
            chunk: chunk
          });
        });

        messageHandler.on('RequestDataRange',
          function transportDataRange(data) {
            pdfDataRangeTransport.requestDataRange(data.begin, data.end);
          }, this);
      }

      messageHandler.on('GetDoc', function transportDoc(data) {
        var pdfInfo = data.pdfInfo;
        this.numPages = data.pdfInfo.numPages;
        var loadingTask = this.loadingTask;
        var pdfDocument = new PDFDocumentProxy(pdfInfo, this, loadingTask);
        this.pdfDocument = pdfDocument;
        loadingTask._capability.resolve(pdfDocument);
      }, this);

      messageHandler.on('NeedPassword',
                        function transportNeedPassword(exception) {
        var loadingTask = this.loadingTask;
        if (loadingTask.onPassword) {
          return loadingTask.onPassword(updatePassword,
                                        PasswordResponses.NEED_PASSWORD);
        }
        loadingTask._capability.reject(
          new PasswordException(exception.message, exception.code));
      }, this);

      messageHandler.on('IncorrectPassword',
                        function transportIncorrectPassword(exception) {
        var loadingTask = this.loadingTask;
        if (loadingTask.onPassword) {
          return loadingTask.onPassword(updatePassword,
                                        PasswordResponses.INCORRECT_PASSWORD);
        }
        loadingTask._capability.reject(
          new PasswordException(exception.message, exception.code));
      }, this);

      messageHandler.on('InvalidPDF', function transportInvalidPDF(exception) {
        this.loadingTask._capability.reject(
          new InvalidPDFException(exception.message));
      }, this);

      messageHandler.on('MissingPDF', function transportMissingPDF(exception) {
        this.loadingTask._capability.reject(
          new MissingPDFException(exception.message));
      }, this);

      messageHandler.on('UnexpectedResponse',
                        function transportUnexpectedResponse(exception) {
        this.loadingTask._capability.reject(
          new UnexpectedResponseException(exception.message, exception.status));
      }, this);

      messageHandler.on('UnknownError',
                        function transportUnknownError(exception) {
        this.loadingTask._capability.reject(
          new UnknownErrorException(exception.message, exception.details));
      }, this);

      messageHandler.on('DataLoaded', function transportPage(data) {
        this.downloadInfoCapability.resolve(data);
      }, this);

      messageHandler.on('PDFManagerReady', function transportPage(data) {
        if (this.pdfDataRangeTransport) {
          this.pdfDataRangeTransport.transportReady();
        }
      }, this);

      messageHandler.on('StartRenderPage', function transportRender(data) {
        if (this.destroyed) {
          return; // Ignore any pending requests if the worker was terminated.
        }
        var page = this.pageCache[data.pageIndex];

        page.stats.timeEnd('Page Request');
        page._startRenderPage(data.transparency, data.intent);
      }, this);

      messageHandler.on('RenderPageChunk', function transportRender(data) {
        if (this.destroyed) {
          return; // Ignore any pending requests if the worker was terminated.
        }
        var page = this.pageCache[data.pageIndex];

        page._renderPageChunk(data.operatorList, data.intent);
      }, this);

      messageHandler.on('commonobj', function transportObj(data) {
        if (this.destroyed) {
          return; // Ignore any pending requests if the worker was terminated.
        }

        var id = data[0];
        var type = data[1];
        if (this.commonObjs.hasData(id)) {
          return;
        }

        switch (type) {
          case 'Font':
            var exportedData = data[2];

            var font;
            if ('error' in exportedData) {
              var error = exportedData.error;
              warn('Error during font loading: ' + error);
              this.commonObjs.resolve(id, error);
              break;
            } else {
              font = new FontFaceObject(exportedData);
            }

            this.fontLoader.bind(
              [font],
              function fontReady(fontObjs) {
                this.commonObjs.resolve(id, font);
              }.bind(this)
            );
            break;
          case 'FontPath':
            this.commonObjs.resolve(id, data[2]);
            break;
          default:
            error('Got unknown common object type ' + type);
        }
      }, this);

      messageHandler.on('obj', function transportObj(data) {
        if (this.destroyed) {
          return; // Ignore any pending requests if the worker was terminated.
        }

        var id = data[0];
        var pageIndex = data[1];
        var type = data[2];
        var pageProxy = this.pageCache[pageIndex];
        var imageData;
        if (pageProxy.objs.hasData(id)) {
          return;
        }

        switch (type) {
          case 'JpegStream':
            imageData = data[3];
            loadJpegStream(id, imageData, pageProxy.objs);
            break;
          case 'Image':
            imageData = data[3];
            pageProxy.objs.resolve(id, imageData);

            // heuristics that will allow not to store large data
            var MAX_IMAGE_SIZE_TO_STORE = 8000000;
            if (imageData && 'data' in imageData &&
                imageData.data.length > MAX_IMAGE_SIZE_TO_STORE) {
              pageProxy.cleanupAfterRender = true;
            }
            break;
          default:
            error('Got unknown object type ' + type);
        }
      }, this);

      messageHandler.on('DocProgress', function transportDocProgress(data) {
        if (this.destroyed) {
          return; // Ignore any pending requests if the worker was terminated.
        }

        var loadingTask = this.loadingTask;
        if (loadingTask.onProgress) {
          loadingTask.onProgress({
            loaded: data.loaded,
            total: data.total
          });
        }
      }, this);

      messageHandler.on('PageError', function transportError(data) {
        if (this.destroyed) {
          return; // Ignore any pending requests if the worker was terminated.
        }

        var page = this.pageCache[data.pageNum - 1];
        var intentState = page.intentStates[data.intent];
        if (intentState.displayReadyCapability) {
          intentState.displayReadyCapability.reject(data.error);
        } else {
          error(data.error);
        }
      }, this);

      messageHandler.on('UnsupportedFeature',
          function transportUnsupportedFeature(data) {
        if (this.destroyed) {
          return; // Ignore any pending requests if the worker was terminated.
        }
        var featureId = data.featureId;
        var loadingTask = this.loadingTask;
        if (loadingTask.onUnsupportedFeature) {
          loadingTask.onUnsupportedFeature(featureId);
        }
        PDFJS.UnsupportedManager.notify(featureId);
      }, this);

      messageHandler.on('JpegDecode', function(data) {
        if (this.destroyed) {
          return Promise.reject('Worker was terminated');
        }

        var imageUrl = data[0];
        var components = data[1];
        if (components !== 3 && components !== 1) {
          return Promise.reject(
            new Error('Only 3 components or 1 component can be returned'));
        }

        return new Promise(function (resolve, reject) {
          var img = new Image();
          img.onload = function () {
            var width = img.width;
            var height = img.height;
            var size = width * height;
            var rgbaLength = size * 4;
            var buf = new Uint8Array(size * components);
            var tmpCanvas = createScratchCanvas(width, height);
            var tmpCtx = tmpCanvas.getContext('2d');
            tmpCtx.drawImage(img, 0, 0);
            var data = tmpCtx.getImageData(0, 0, width, height).data;
            var i, j;

            if (components === 3) {
              for (i = 0, j = 0; i < rgbaLength; i += 4, j += 3) {
                buf[j] = data[i];
                buf[j + 1] = data[i + 1];
                buf[j + 2] = data[i + 2];
              }
            } else if (components === 1) {
              for (i = 0, j = 0; i < rgbaLength; i += 4, j++) {
                buf[j] = data[i];
              }
            }
            resolve({ data: buf, width: width, height: height});
          };
          img.onerror = function () {
            reject(new Error('JpegDecode failed to load image'));
          };
          img.src = imageUrl;
        });
      }, this);
    },

    getData: function WorkerTransport_getData() {
      return this.messageHandler.sendWithPromise('GetData', null);
    },

    getPage: function WorkerTransport_getPage(pageNumber, capability) {
      if (pageNumber <= 0 || pageNumber > this.numPages ||
          (pageNumber|0) !== pageNumber) {
        return Promise.reject(new Error('Invalid page request'));
      }

      var pageIndex = pageNumber - 1;
      if (pageIndex in this.pagePromises) {
        return this.pagePromises[pageIndex];
      }
      var promise = this.messageHandler.sendWithPromise('GetPage', {
        pageIndex: pageIndex
      }).then(function (pageInfo) {
        if (this.destroyed) {
          throw new Error('Transport destroyed');
        }
        var page = new PDFPageProxy(pageIndex, pageInfo, this);
        this.pageCache[pageIndex] = page;
        return page;
      }.bind(this));
      this.pagePromises[pageIndex] = promise;
      return promise;
    },

    getPageIndex: function WorkerTransport_getPageIndexByRef(ref) {
      return this.messageHandler.sendWithPromise('GetPageIndex', { ref: ref });
    },

    getAnnotations: function WorkerTransport_getAnnotations(pageIndex, intent) {
      return this.messageHandler.sendWithPromise('GetAnnotations', {
        pageIndex: pageIndex,
        intent: intent,
      });
    },

    getDestinations: function WorkerTransport_getDestinations() {
      return this.messageHandler.sendWithPromise('GetDestinations', null);
    },

    getDestination: function WorkerTransport_getDestination(id) {
      return this.messageHandler.sendWithPromise('GetDestination', { id: id });
    },

    getPageLabels: function WorkerTransport_getPageLabels() {
      return this.messageHandler.sendWithPromise('GetPageLabels', null);
    },

    getAttachments: function WorkerTransport_getAttachments() {
      return this.messageHandler.sendWithPromise('GetAttachments', null);
    },

    getJavaScript: function WorkerTransport_getJavaScript() {
      return this.messageHandler.sendWithPromise('GetJavaScript', null);
    },

    getOutline: function WorkerTransport_getOutline() {
      return this.messageHandler.sendWithPromise('GetOutline', null);
    },

    getMetadata: function WorkerTransport_getMetadata() {
      return this.messageHandler.sendWithPromise('GetMetadata', null).
        then(function transportMetadata(results) {
        return {
          info: results[0],
          metadata: (results[1] ? new Metadata(results[1]) : null)
        };
      });
    },

    getStats: function WorkerTransport_getStats() {
      return this.messageHandler.sendWithPromise('GetStats', null);
    },

    startCleanup: function WorkerTransport_startCleanup() {
      this.messageHandler.sendWithPromise('Cleanup', null).
        then(function endCleanup() {
        for (var i = 0, ii = this.pageCache.length; i < ii; i++) {
          var page = this.pageCache[i];
          if (page) {
            page.cleanup();
          }
        }
        this.commonObjs.clear();
        this.fontLoader.clear();
      }.bind(this));
    }
  };
  return WorkerTransport;

})();

/**
 * A PDF document and page is built of many objects. E.g. there are objects
 * for fonts, images, rendering code and such. These objects might get processed
 * inside of a worker. The `PDFObjects` implements some basic functions to
 * manage these objects.
 * @ignore
 */
var PDFObjects = (function PDFObjectsClosure() {
  function PDFObjects() {
    this.objs = {};
  }

  PDFObjects.prototype = {
    /**
     * Internal function.
     * Ensures there is an object defined for `objId`.
     */
    ensureObj: function PDFObjects_ensureObj(objId) {
      if (this.objs[objId]) {
        return this.objs[objId];
      }

      var obj = {
        capability: createPromiseCapability(),
        data: null,
        resolved: false
      };
      this.objs[objId] = obj;

      return obj;
    },

    /**
     * If called *without* callback, this returns the data of `objId` but the
     * object needs to be resolved. If it isn't, this function throws.
     *
     * If called *with* a callback, the callback is called with the data of the
     * object once the object is resolved. That means, if you call this
     * function and the object is already resolved, the callback gets called
     * right away.
     */
    get: function PDFObjects_get(objId, callback) {
      // If there is a callback, then the get can be async and the object is
      // not required to be resolved right now
      if (callback) {
        this.ensureObj(objId).capability.promise.then(callback);
        return null;
      }

      // If there isn't a callback, the user expects to get the resolved data
      // directly.
      var obj = this.objs[objId];

      // If there isn't an object yet or the object isn't resolved, then the
      // data isn't ready yet!
      if (!obj || !obj.resolved) {
        error('Requesting object that isn\'t resolved yet ' + objId);
      }

      return obj.data;
    },

    /**
     * Resolves the object `objId` with optional `data`.
     */
    resolve: function PDFObjects_resolve(objId, data) {
      var obj = this.ensureObj(objId);

      obj.resolved = true;
      obj.data = data;
      obj.capability.resolve(data);
    },

    isResolved: function PDFObjects_isResolved(objId) {
      var objs = this.objs;

      if (!objs[objId]) {
        return false;
      } else {
        return objs[objId].resolved;
      }
    },

    hasData: function PDFObjects_hasData(objId) {
      return this.isResolved(objId);
    },

    /**
     * Returns the data of `objId` if object exists, null otherwise.
     */
    getData: function PDFObjects_getData(objId) {
      var objs = this.objs;
      if (!objs[objId] || !objs[objId].resolved) {
        return null;
      } else {
        return objs[objId].data;
      }
    },

    clear: function PDFObjects_clear() {
      this.objs = {};
    }
  };
  return PDFObjects;
})();

/**
 * Allows controlling of the rendering tasks.
 * @class
 * @alias RenderTask
 */
var RenderTask = (function RenderTaskClosure() {
  function RenderTask(internalRenderTask) {
    this._internalRenderTask = internalRenderTask;

    /**
     * Callback for incremental rendering -- a function that will be called
     * each time the rendering is paused.  To continue rendering call the
     * function that is the first argument to the callback.
     * @type {function}
     */
    this.onContinue = null;
  }

  RenderTask.prototype = /** @lends RenderTask.prototype */ {
    /**
     * Promise for rendering task completion.
     * @return {Promise}
     */
    get promise() {
      return this._internalRenderTask.capability.promise;
    },

    /**
     * Cancels the rendering task. If the task is currently rendering it will
     * not be cancelled until graphics pauses with a timeout. The promise that
     * this object extends will resolved when cancelled.
     */
    cancel: function RenderTask_cancel() {
      this._internalRenderTask.cancel();
    },

    /**
     * Registers callbacks to indicate the rendering task completion.
     *
     * @param {function} onFulfilled The callback for the rendering completion.
     * @param {function} onRejected The callback for the rendering failure.
     * @return {Promise} A promise that is resolved after the onFulfilled or
     *                   onRejected callback.
     */
    then: function RenderTask_then(onFulfilled, onRejected) {
      return this.promise.then.apply(this.promise, arguments);
    }
  };

  return RenderTask;
})();

/**
 * For internal use only.
 * @ignore
 */
var InternalRenderTask = (function InternalRenderTaskClosure() {

  function InternalRenderTask(callback, params, objs, commonObjs, operatorList,
                              pageNumber) {
    this.callback = callback;
    this.params = params;
    this.objs = objs;
    this.commonObjs = commonObjs;
    this.operatorListIdx = null;
    this.operatorList = operatorList;
    this.pageNumber = pageNumber;
    this.running = false;
    this.graphicsReadyCallback = null;
    this.graphicsReady = false;
    this.useRequestAnimationFrame = false;
    this.cancelled = false;
    this.capability = createPromiseCapability();
    this.task = new RenderTask(this);
    // caching this-bound methods
    this._continueBound = this._continue.bind(this);
    this._scheduleNextBound = this._scheduleNext.bind(this);
    this._nextBound = this._next.bind(this);
  }

  InternalRenderTask.prototype = {

    initalizeGraphics:
        function InternalRenderTask_initalizeGraphics(transparency) {

      if (this.cancelled) {
        return;
      }
      if (PDFJS.pdfBug && 'StepperManager' in globalScope &&
          globalScope.StepperManager.enabled) {
        this.stepper = globalScope.StepperManager.create(this.pageNumber - 1);
        this.stepper.init(this.operatorList);
        this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint();
      }

      var params = this.params;
      this.gfx = new CanvasGraphics(params.canvasContext, this.commonObjs,
                                    this.objs, params.imageLayer);

      this.gfx.beginDrawing(params.transform, params.viewport, transparency);
      this.operatorListIdx = 0;
      this.graphicsReady = true;
      if (this.graphicsReadyCallback) {
        this.graphicsReadyCallback();
      }
    },

    cancel: function InternalRenderTask_cancel() {
      this.running = false;
      this.cancelled = true;
      this.callback('cancelled');
    },

    operatorListChanged: function InternalRenderTask_operatorListChanged() {
      if (!this.graphicsReady) {
        if (!this.graphicsReadyCallback) {
          this.graphicsReadyCallback = this._continueBound;
        }
        return;
      }

      if (this.stepper) {
        this.stepper.updateOperatorList(this.operatorList);
      }

      if (this.running) {
        return;
      }
      this._continue();
    },

    _continue: function InternalRenderTask__continue() {
      this.running = true;
      if (this.cancelled) {
        return;
      }
      if (this.task.onContinue) {
        this.task.onContinue.call(this.task, this._scheduleNextBound);
      } else {
        this._scheduleNext();
      }
    },

    _scheduleNext: function InternalRenderTask__scheduleNext() {
      if (this.useRequestAnimationFrame) {
        window.requestAnimationFrame(this._nextBound);
      } else {
        Promise.resolve(undefined).then(this._nextBound);
      }
    },

    _next: function InternalRenderTask__next() {
      if (this.cancelled) {
        return;
      }
      this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList,
                                        this.operatorListIdx,
                                        this._continueBound,
                                        this.stepper);
      if (this.operatorListIdx === this.operatorList.argsArray.length) {
        this.running = false;
        if (this.operatorList.lastChunk) {
          this.gfx.endDrawing();
          this.callback();
        }
      }
    }

  };

  return InternalRenderTask;
})();

/**
 * (Deprecated) Global observer of unsupported feature usages. Use
 * onUnsupportedFeature callback of the {PDFDocumentLoadingTask} instance.
 */
PDFJS.UnsupportedManager = (function UnsupportedManagerClosure() {
  var listeners = [];
  return {
    listen: function (cb) {
      deprecated('Global UnsupportedManager.listen is used: ' +
                 ' use PDFDocumentLoadingTask.onUnsupportedFeature instead');
      listeners.push(cb);
    },
    notify: function (featureId) {
      for (var i = 0, ii = listeners.length; i < ii; i++) {
        listeners[i](featureId);
      }
    }
  };
})();

exports.getDocument = PDFJS.getDocument;
exports.PDFDataRangeTransport = PDFDataRangeTransport;
exports.PDFDocumentProxy = PDFDocumentProxy;
exports.PDFPageProxy = PDFPageProxy;
}));


  }).call(pdfjsLibs);

  exports.PDFJS = pdfjsLibs.pdfjsSharedGlobal.PDFJS;

  exports.getDocument = pdfjsLibs.pdfjsDisplayAPI.getDocument;
  exports.PDFDataRangeTransport =
    pdfjsLibs.pdfjsDisplayAPI.PDFDataRangeTransport;
  exports.renderTextLayer = pdfjsLibs.pdfjsDisplayTextLayer.renderTextLayer;
  exports.AnnotationLayer =
    pdfjsLibs.pdfjsDisplayAnnotationLayer.AnnotationLayer;
  exports.CustomStyle = pdfjsLibs.pdfjsDisplayDOMUtils.CustomStyle;
  exports.PasswordResponses = pdfjsLibs.pdfjsSharedUtil.PasswordResponses;
  exports.InvalidPDFException = pdfjsLibs.pdfjsSharedUtil.InvalidPDFException;
  exports.MissingPDFException = pdfjsLibs.pdfjsSharedUtil.MissingPDFException;
  exports.UnexpectedResponseException =
    pdfjsLibs.pdfjsSharedUtil.UnexpectedResponseException;
}));



/*! @license Firebase v2.4.1
    License: https://www.firebase.com/terms/terms-of-service.html */
(function() {var h,n=this;function p(a){return void 0!==a}function aa(){}function ba(a){a.yb=function(){return a.zf?a.zf:a.zf=new a}}
function ca(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function da(a){return"array"==ca(a)}function ea(a){var b=ca(a);return"array"==b||"object"==b&&"number"==typeof a.length}function q(a){return"string"==typeof a}function fa(a){return"number"==typeof a}function r(a){return"function"==ca(a)}function ga(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ha(a,b,c){return a.call.apply(a.bind,arguments)}
function ia(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function u(a,b,c){u=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ha:ia;return u.apply(null,arguments)}var ja=Date.now||function(){return+new Date};
function ka(a,b){function c(){}c.prototype=b.prototype;a.oh=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.kh=function(a,c,f){for(var g=Array(arguments.length-2),k=2;k<arguments.length;k++)g[k-2]=arguments[k];return b.prototype[c].apply(a,g)}};function la(a){if(Error.captureStackTrace)Error.captureStackTrace(this,la);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}ka(la,Error);la.prototype.name="CustomError";function v(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function ma(a,b){var c={},d;for(d in a)c[d]=b.call(void 0,a[d],d,a);return c}function na(a,b){for(var c in a)if(!b.call(void 0,a[c],c,a))return!1;return!0}function oa(a){var b=0,c;for(c in a)b++;return b}function pa(a){for(var b in a)return b}function qa(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function ra(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function sa(a,b){for(var c in a)if(a[c]==b)return!0;return!1}
function ta(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return d}function ua(a,b){var c=ta(a,b,void 0);return c&&a[c]}function va(a){for(var b in a)return!1;return!0}function wa(a){var b={},c;for(c in a)b[c]=a[c];return b}var xa="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function ya(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<xa.length;f++)c=xa[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};function za(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function Aa(){this.Vd=void 0}
function Ba(a,b,c){switch(typeof b){case "string":Ca(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if(da(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],Ba(a,a.Vd?a.Vd.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),Ca(f,c),
c.push(":"),Ba(a,a.Vd?a.Vd.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var Da={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},Ea=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function Ca(a,b){b.push('"',a.replace(Ea,function(a){if(a in Da)return Da[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return Da[a]=e+b.toString(16)}),'"')};function Fa(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^ja()).toString(36)};var w;a:{var Ga=n.navigator;if(Ga){var Ha=Ga.userAgent;if(Ha){w=Ha;break a}}w=""};function Ia(){this.Ya=-1};function Ja(){this.Ya=-1;this.Ya=64;this.P=[];this.pe=[];this.eg=[];this.Od=[];this.Od[0]=128;for(var a=1;a<this.Ya;++a)this.Od[a]=0;this.ge=this.ec=0;this.reset()}ka(Ja,Ia);Ja.prototype.reset=function(){this.P[0]=1732584193;this.P[1]=4023233417;this.P[2]=2562383102;this.P[3]=271733878;this.P[4]=3285377520;this.ge=this.ec=0};
function Ka(a,b,c){c||(c=0);var d=a.eg;if(q(b))for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.P[0];c=a.P[1];for(var g=a.P[2],k=a.P[3],m=a.P[4],l,e=0;80>e;e++)40>e?20>e?(f=k^c&(g^k),l=1518500249):(f=c^g^k,l=1859775393):60>e?(f=c&g|k&(c|g),l=2400959708):(f=c^g^k,l=3395469782),f=(b<<
5|b>>>27)+f+m+l+d[e]&4294967295,m=k,k=g,g=(c<<30|c>>>2)&4294967295,c=b,b=f;a.P[0]=a.P[0]+b&4294967295;a.P[1]=a.P[1]+c&4294967295;a.P[2]=a.P[2]+g&4294967295;a.P[3]=a.P[3]+k&4294967295;a.P[4]=a.P[4]+m&4294967295}
Ja.prototype.update=function(a,b){if(null!=a){p(b)||(b=a.length);for(var c=b-this.Ya,d=0,e=this.pe,f=this.ec;d<b;){if(0==f)for(;d<=c;)Ka(this,a,d),d+=this.Ya;if(q(a))for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.Ya){Ka(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.Ya){Ka(this,e);f=0;break}}this.ec=f;this.ge+=b}};var x=Array.prototype,La=x.indexOf?function(a,b,c){return x.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(q(a))return q(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Ma=x.forEach?function(a,b,c){x.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Na=x.filter?function(a,b,c){return x.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=q(a)?
a.split(""):a,k=0;k<d;k++)if(k in g){var m=g[k];b.call(c,m,k,a)&&(e[f++]=m)}return e},Oa=x.map?function(a,b,c){return x.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=q(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},Pa=x.reduce?function(a,b,c,d){for(var e=[],f=1,g=arguments.length;f<g;f++)e.push(arguments[f]);d&&(e[0]=u(b,d));return x.reduce.apply(a,e)}:function(a,b,c,d){var e=c;Ma(a,function(c,g){e=b.call(d,e,c,g,a)});return e},Qa=x.every?function(a,b,
c){return x.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function Ra(a,b){var c=Sa(a,b,void 0);return 0>c?null:q(a)?a.charAt(c):a[c]}function Sa(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1}function Ta(a,b){var c=La(a,b);0<=c&&x.splice.call(a,c,1)}function Ua(a,b,c){return 2>=arguments.length?x.slice.call(a,b):x.slice.call(a,b,c)}
function Va(a,b){a.sort(b||Wa)}function Wa(a,b){return a>b?1:a<b?-1:0};function Xa(a){n.setTimeout(function(){throw a;},0)}var Ya;
function Za(){var a=n.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==w.indexOf("Presto")&&(a=function(){var a=document.createElement("iframe");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=u(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==w.indexOf("Trident")&&-1==w.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(p(c.next)){c=c.next;var a=c.hb;c.hb=null;a()}};return function(a){d.next={hb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("script")?function(a){var b=
document.createElement("script");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){n.setTimeout(a,0)}};function $a(a,b){ab||bb();cb||(ab(),cb=!0);db.push(new eb(a,b))}var ab;function bb(){if(n.Promise&&n.Promise.resolve){var a=n.Promise.resolve();ab=function(){a.then(fb)}}else ab=function(){var a=fb;!r(n.setImmediate)||n.Window&&n.Window.prototype&&n.Window.prototype.setImmediate==n.setImmediate?(Ya||(Ya=Za()),Ya(a)):n.setImmediate(a)}}var cb=!1,db=[];[].push(function(){cb=!1;db=[]});
function fb(){for(;db.length;){var a=db;db=[];for(var b=0;b<a.length;b++){var c=a[b];try{c.yg.call(c.scope)}catch(d){Xa(d)}}}cb=!1}function eb(a,b){this.yg=a;this.scope=b};var gb=-1!=w.indexOf("Opera")||-1!=w.indexOf("OPR"),hb=-1!=w.indexOf("Trident")||-1!=w.indexOf("MSIE"),ib=-1!=w.indexOf("Gecko")&&-1==w.toLowerCase().indexOf("webkit")&&!(-1!=w.indexOf("Trident")||-1!=w.indexOf("MSIE")),jb=-1!=w.toLowerCase().indexOf("webkit");
(function(){var a="",b;if(gb&&n.opera)return a=n.opera.version,r(a)?a():a;ib?b=/rv\:([^\);]+)(\)|;)/:hb?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:jb&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(w))?a[1]:"");return hb&&(b=(b=n.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var kb=null,lb=null,mb=null;function nb(a,b){if(!ea(a))throw Error("encodeByteArray takes an array as a parameter");ob();for(var c=b?lb:kb,d=[],e=0;e<a.length;e+=3){var f=a[e],g=e+1<a.length,k=g?a[e+1]:0,m=e+2<a.length,l=m?a[e+2]:0,t=f>>2,f=(f&3)<<4|k>>4,k=(k&15)<<2|l>>6,l=l&63;m||(l=64,g||(k=64));d.push(c[t],c[f],c[k],c[l])}return d.join("")}
function ob(){if(!kb){kb={};lb={};mb={};for(var a=0;65>a;a++)kb[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a),lb[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a),mb[lb[a]]=a,62<=a&&(mb["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a)]=a)}};function pb(a,b){this.N=qb;this.Rf=void 0;this.Ba=this.Ha=null;this.yd=this.ye=!1;if(a==rb)sb(this,tb,b);else try{var c=this;a.call(b,function(a){sb(c,tb,a)},function(a){if(!(a instanceof ub))try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(b){}sb(c,vb,a)})}catch(d){sb(this,vb,d)}}var qb=0,tb=2,vb=3;function rb(){}pb.prototype.then=function(a,b,c){return wb(this,r(a)?a:null,r(b)?b:null,c)};pb.prototype.then=pb.prototype.then;pb.prototype.$goog_Thenable=!0;h=pb.prototype;
h.fh=function(a,b){return wb(this,null,a,b)};h.cancel=function(a){this.N==qb&&$a(function(){var b=new ub(a);xb(this,b)},this)};function xb(a,b){if(a.N==qb)if(a.Ha){var c=a.Ha;if(c.Ba){for(var d=0,e=-1,f=0,g;g=c.Ba[f];f++)if(g=g.o)if(d++,g==a&&(e=f),0<=e&&1<d)break;0<=e&&(c.N==qb&&1==d?xb(c,b):(d=c.Ba.splice(e,1)[0],yb(c,d,vb,b)))}a.Ha=null}else sb(a,vb,b)}function zb(a,b){a.Ba&&a.Ba.length||a.N!=tb&&a.N!=vb||Ab(a);a.Ba||(a.Ba=[]);a.Ba.push(b)}
function wb(a,b,c,d){var e={o:null,Hf:null,Jf:null};e.o=new pb(function(a,g){e.Hf=b?function(c){try{var e=b.call(d,c);a(e)}catch(l){g(l)}}:a;e.Jf=c?function(b){try{var e=c.call(d,b);!p(e)&&b instanceof ub?g(b):a(e)}catch(l){g(l)}}:g});e.o.Ha=a;zb(a,e);return e.o}h.Yf=function(a){this.N=qb;sb(this,tb,a)};h.Zf=function(a){this.N=qb;sb(this,vb,a)};
function sb(a,b,c){if(a.N==qb){if(a==c)b=vb,c=new TypeError("Promise cannot resolve to itself");else{var d;if(c)try{d=!!c.$goog_Thenable}catch(e){d=!1}else d=!1;if(d){a.N=1;c.then(a.Yf,a.Zf,a);return}if(ga(c))try{var f=c.then;if(r(f)){Bb(a,c,f);return}}catch(g){b=vb,c=g}}a.Rf=c;a.N=b;a.Ha=null;Ab(a);b!=vb||c instanceof ub||Cb(a,c)}}function Bb(a,b,c){function d(b){f||(f=!0,a.Zf(b))}function e(b){f||(f=!0,a.Yf(b))}a.N=1;var f=!1;try{c.call(b,e,d)}catch(g){d(g)}}
function Ab(a){a.ye||(a.ye=!0,$a(a.wg,a))}h.wg=function(){for(;this.Ba&&this.Ba.length;){var a=this.Ba;this.Ba=null;for(var b=0;b<a.length;b++)yb(this,a[b],this.N,this.Rf)}this.ye=!1};function yb(a,b,c,d){if(c==tb)b.Hf(d);else{if(b.o)for(;a&&a.yd;a=a.Ha)a.yd=!1;b.Jf(d)}}function Cb(a,b){a.yd=!0;$a(function(){a.yd&&Db.call(null,b)})}var Db=Xa;function ub(a){la.call(this,a)}ka(ub,la);ub.prototype.name="cancel";var Eb=Eb||"2.4.1";function y(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function z(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]}function Fb(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])}function Gb(a){var b={};Fb(a,function(a,d){b[a]=d});return b}function Hb(a){return"object"===typeof a&&null!==a};function Ib(a){var b=[];Fb(a,function(a,d){da(d)?Ma(d,function(d){b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))}):b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))});return b.length?"&"+b.join("&"):""}function Jb(a){var b={};a=a.replace(/^\?/,"").split("&");Ma(a,function(a){a&&(a=a.split("="),b[a[0]]=a[1])});return b};function Kb(a,b){if(!a)throw Lb(b);}function Lb(a){return Error("Firebase ("+Eb+") INTERNAL ASSERT FAILED: "+a)};var Mb=n.Promise||pb;pb.prototype["catch"]=pb.prototype.fh;function B(){var a=this;this.reject=this.resolve=null;this.D=new Mb(function(b,c){a.resolve=b;a.reject=c})}function C(a,b){return function(c,d){c?a.reject(c):a.resolve(d);r(b)&&(Nb(a.D),1===b.length?b(c):b(c,d))}}function Nb(a){a.then(void 0,aa)};function Ob(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,Kb(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b}function Pb(a){for(var b=0,c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b++:2048>d?b+=2:55296<=d&&56319>=d?(b+=4,c++):b+=3}return b};function D(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);if(e)throw Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+".");}function E(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:throw Error("errorPrefix called with argumentNumber > 4.  Need to update it?");}return a=a+" failed: "+(d+" argument ")}
function F(a,b,c,d){if((!d||p(c))&&!r(c))throw Error(E(a,b,d)+"must be a valid function.");}function Qb(a,b,c){if(p(c)&&(!ga(c)||null===c))throw Error(E(a,b,!0)+"must be a valid context object.");};function Rb(a){return"undefined"!==typeof JSON&&p(JSON.parse)?JSON.parse(a):za(a)}function G(a){if("undefined"!==typeof JSON&&p(JSON.stringify))a=JSON.stringify(a);else{var b=[];Ba(new Aa,a,b);a=b.join("")}return a};function Sb(){this.Zd=H}Sb.prototype.j=function(a){return this.Zd.S(a)};Sb.prototype.toString=function(){return this.Zd.toString()};function Tb(){}Tb.prototype.uf=function(){return null};Tb.prototype.Ce=function(){return null};var Ub=new Tb;function Vb(a,b,c){this.bg=a;this.Oa=b;this.Nd=c}Vb.prototype.uf=function(a){var b=this.Oa.Q;if(Wb(b,a))return b.j().T(a);b=null!=this.Nd?new Xb(this.Nd,!0,!1):this.Oa.w();return this.bg.Bc(a,b)};Vb.prototype.Ce=function(a,b,c){var d=null!=this.Nd?this.Nd:Yb(this.Oa);a=this.bg.qe(d,b,1,c,a);return 0===a.length?null:a[0]};function Zb(){this.xb=[]}function $b(a,b){for(var c=null,d=0;d<b.length;d++){var e=b[d],f=e.cc();null===c||f.ea(c.cc())||(a.xb.push(c),c=null);null===c&&(c=new ac(f));c.add(e)}c&&a.xb.push(c)}function bc(a,b,c){$b(a,c);cc(a,function(a){return a.ea(b)})}function dc(a,b,c){$b(a,c);cc(a,function(a){return a.contains(b)||b.contains(a)})}
function cc(a,b){for(var c=!0,d=0;d<a.xb.length;d++){var e=a.xb[d];if(e)if(e=e.cc(),b(e)){for(var e=a.xb[d],f=0;f<e.xd.length;f++){var g=e.xd[f];if(null!==g){e.xd[f]=null;var k=g.Zb();ec&&fc("event: "+g.toString());gc(k)}}a.xb[d]=null}else c=!1}c&&(a.xb=[])}function ac(a){this.ta=a;this.xd=[]}ac.prototype.add=function(a){this.xd.push(a)};ac.prototype.cc=function(){return this.ta};function J(a,b,c,d){this.type=a;this.Na=b;this.Za=c;this.Oe=d;this.Td=void 0}function hc(a){return new J(ic,a)}var ic="value";function jc(a,b,c,d){this.xe=b;this.be=c;this.Td=d;this.wd=a}jc.prototype.cc=function(){var a=this.be.Mb();return"value"===this.wd?a.path:a.parent().path};jc.prototype.De=function(){return this.wd};jc.prototype.Zb=function(){return this.xe.Zb(this)};jc.prototype.toString=function(){return this.cc().toString()+":"+this.wd+":"+G(this.be.qf())};function kc(a,b,c){this.xe=a;this.error=b;this.path=c}kc.prototype.cc=function(){return this.path};kc.prototype.De=function(){return"cancel"};
kc.prototype.Zb=function(){return this.xe.Zb(this)};kc.prototype.toString=function(){return this.path.toString()+":cancel"};function Xb(a,b,c){this.A=a;this.ga=b;this.Yb=c}function lc(a){return a.ga}function mc(a){return a.Yb}function nc(a,b){return b.e()?a.ga&&!a.Yb:Wb(a,K(b))}function Wb(a,b){return a.ga&&!a.Yb||a.A.Fa(b)}Xb.prototype.j=function(){return this.A};function oc(a){this.pg=a;this.Gd=null}oc.prototype.get=function(){var a=this.pg.get(),b=wa(a);if(this.Gd)for(var c in this.Gd)b[c]-=this.Gd[c];this.Gd=a;return b};function pc(a,b){this.Vf={};this.hd=new oc(a);this.da=b;var c=1E4+2E4*Math.random();setTimeout(u(this.Of,this),Math.floor(c))}pc.prototype.Of=function(){var a=this.hd.get(),b={},c=!1,d;for(d in a)0<a[d]&&y(this.Vf,d)&&(b[d]=a[d],c=!0);c&&this.da.Ye(b);setTimeout(u(this.Of,this),Math.floor(6E5*Math.random()))};function qc(){this.Hc={}}function rc(a,b,c){p(c)||(c=1);y(a.Hc,b)||(a.Hc[b]=0);a.Hc[b]+=c}qc.prototype.get=function(){return wa(this.Hc)};var sc={},tc={};function uc(a){a=a.toString();sc[a]||(sc[a]=new qc);return sc[a]}function vc(a,b){var c=a.toString();tc[c]||(tc[c]=b());return tc[c]};function L(a,b){this.name=a;this.U=b}function wc(a,b){return new L(a,b)};function xc(a,b){return yc(a.name,b.name)}function zc(a,b){return yc(a,b)};function Ac(a,b,c){this.type=Bc;this.source=a;this.path=b;this.Ja=c}Ac.prototype.$c=function(a){return this.path.e()?new Ac(this.source,M,this.Ja.T(a)):new Ac(this.source,N(this.path),this.Ja)};Ac.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" overwrite: "+this.Ja.toString()+")"};function Cc(a,b){this.type=Dc;this.source=a;this.path=b}Cc.prototype.$c=function(){return this.path.e()?new Cc(this.source,M):new Cc(this.source,N(this.path))};Cc.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" listen_complete)"};function Ec(a,b){this.Pa=a;this.xa=b?b:Fc}h=Ec.prototype;h.Sa=function(a,b){return new Ec(this.Pa,this.xa.Sa(a,b,this.Pa).$(null,null,!1,null,null))};h.remove=function(a){return new Ec(this.Pa,this.xa.remove(a,this.Pa).$(null,null,!1,null,null))};h.get=function(a){for(var b,c=this.xa;!c.e();){b=this.Pa(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return null};
function Gc(a,b){for(var c,d=a.xa,e=null;!d.e();){c=a.Pa(b,d.key);if(0===c){if(d.left.e())return e?e.key:null;for(d=d.left;!d.right.e();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");}h.e=function(){return this.xa.e()};h.count=function(){return this.xa.count()};h.Vc=function(){return this.xa.Vc()};h.jc=function(){return this.xa.jc()};h.ka=function(a){return this.xa.ka(a)};
h.ac=function(a){return new Hc(this.xa,null,this.Pa,!1,a)};h.bc=function(a,b){return new Hc(this.xa,a,this.Pa,!1,b)};h.dc=function(a,b){return new Hc(this.xa,a,this.Pa,!0,b)};h.xf=function(a){return new Hc(this.xa,null,this.Pa,!0,a)};function Hc(a,b,c,d,e){this.Xd=e||null;this.Je=d;this.Ta=[];for(e=1;!a.e();)if(e=b?c(a.key,b):1,d&&(e*=-1),0>e)a=this.Je?a.left:a.right;else if(0===e){this.Ta.push(a);break}else this.Ta.push(a),a=this.Je?a.right:a.left}
function Ic(a){if(0===a.Ta.length)return null;var b=a.Ta.pop(),c;c=a.Xd?a.Xd(b.key,b.value):{key:b.key,value:b.value};if(a.Je)for(b=b.left;!b.e();)a.Ta.push(b),b=b.right;else for(b=b.right;!b.e();)a.Ta.push(b),b=b.left;return c}function Jc(a){if(0===a.Ta.length)return null;var b;b=a.Ta;b=b[b.length-1];return a.Xd?a.Xd(b.key,b.value):{key:b.key,value:b.value}}function Kc(a,b,c,d,e){this.key=a;this.value=b;this.color=null!=c?c:!0;this.left=null!=d?d:Fc;this.right=null!=e?e:Fc}h=Kc.prototype;
h.$=function(a,b,c,d,e){return new Kc(null!=a?a:this.key,null!=b?b:this.value,null!=c?c:this.color,null!=d?d:this.left,null!=e?e:this.right)};h.count=function(){return this.left.count()+1+this.right.count()};h.e=function(){return!1};h.ka=function(a){return this.left.ka(a)||a(this.key,this.value)||this.right.ka(a)};function Lc(a){return a.left.e()?a:Lc(a.left)}h.Vc=function(){return Lc(this).key};h.jc=function(){return this.right.e()?this.key:this.right.jc()};
h.Sa=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.$(null,null,null,e.left.Sa(a,b,c),null):0===d?e.$(null,b,null,null,null):e.$(null,null,null,null,e.right.Sa(a,b,c));return Mc(e)};function Nc(a){if(a.left.e())return Fc;a.left.ha()||a.left.left.ha()||(a=Oc(a));a=a.$(null,null,null,Nc(a.left),null);return Mc(a)}
h.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))c.left.e()||c.left.ha()||c.left.left.ha()||(c=Oc(c)),c=c.$(null,null,null,c.left.remove(a,b),null);else{c.left.ha()&&(c=Pc(c));c.right.e()||c.right.ha()||c.right.left.ha()||(c=Qc(c),c.left.left.ha()&&(c=Pc(c),c=Qc(c)));if(0===b(a,c.key)){if(c.right.e())return Fc;d=Lc(c.right);c=c.$(d.key,d.value,null,null,Nc(c.right))}c=c.$(null,null,null,null,c.right.remove(a,b))}return Mc(c)};h.ha=function(){return this.color};
function Mc(a){a.right.ha()&&!a.left.ha()&&(a=Rc(a));a.left.ha()&&a.left.left.ha()&&(a=Pc(a));a.left.ha()&&a.right.ha()&&(a=Qc(a));return a}function Oc(a){a=Qc(a);a.right.left.ha()&&(a=a.$(null,null,null,null,Pc(a.right)),a=Rc(a),a=Qc(a));return a}function Rc(a){return a.right.$(null,null,a.color,a.$(null,null,!0,null,a.right.left),null)}function Pc(a){return a.left.$(null,null,a.color,null,a.$(null,null,!0,a.left.right,null))}
function Qc(a){return a.$(null,null,!a.color,a.left.$(null,null,!a.left.color,null,null),a.right.$(null,null,!a.right.color,null,null))}function Sc(){}h=Sc.prototype;h.$=function(){return this};h.Sa=function(a,b){return new Kc(a,b,null)};h.remove=function(){return this};h.count=function(){return 0};h.e=function(){return!0};h.ka=function(){return!1};h.Vc=function(){return null};h.jc=function(){return null};h.ha=function(){return!1};var Fc=new Sc;function Tc(a,b){return a&&"object"===typeof a?(O(".sv"in a,"Unexpected leaf node or priority contents"),b[a[".sv"]]):a}function Uc(a,b){var c=new Vc;Wc(a,new P(""),function(a,e){c.rc(a,Xc(e,b))});return c}function Xc(a,b){var c=a.C().J(),c=Tc(c,b),d;if(a.L()){var e=Tc(a.Ea(),b);return e!==a.Ea()||c!==a.C().J()?new Yc(e,Q(c)):a}d=a;c!==a.C().J()&&(d=d.ia(new Yc(c)));a.R(R,function(a,c){var e=Xc(c,b);e!==c&&(d=d.W(a,e))});return d};function Zc(){this.Ac={}}Zc.prototype.set=function(a,b){null==b?delete this.Ac[a]:this.Ac[a]=b};Zc.prototype.get=function(a){return y(this.Ac,a)?this.Ac[a]:null};Zc.prototype.remove=function(a){delete this.Ac[a]};Zc.prototype.Af=!0;function $c(a){this.Ic=a;this.Sd="firebase:"}h=$c.prototype;h.set=function(a,b){null==b?this.Ic.removeItem(this.Sd+a):this.Ic.setItem(this.Sd+a,G(b))};h.get=function(a){a=this.Ic.getItem(this.Sd+a);return null==a?null:Rb(a)};h.remove=function(a){this.Ic.removeItem(this.Sd+a)};h.Af=!1;h.toString=function(){return this.Ic.toString()};function ad(a){try{if("undefined"!==typeof window&&"undefined"!==typeof window[a]){var b=window[a];b.setItem("firebase:sentinel","cache");b.removeItem("firebase:sentinel");return new $c(b)}}catch(c){}return new Zc}var bd=ad("localStorage"),cd=ad("sessionStorage");function dd(a,b,c,d,e){this.host=a.toLowerCase();this.domain=this.host.substr(this.host.indexOf(".")+1);this.ob=b;this.lc=c;this.ih=d;this.Rd=e||"";this.ab=bd.get("host:"+a)||this.host}function ed(a,b){b!==a.ab&&(a.ab=b,"s-"===a.ab.substr(0,2)&&bd.set("host:"+a.host,a.ab))}
function fd(a,b,c){O("string"===typeof b,"typeof type must == string");O("object"===typeof c,"typeof params must == object");if(b===gd)b=(a.ob?"wss://":"ws://")+a.ab+"/.ws?";else if(b===hd)b=(a.ob?"https://":"http://")+a.ab+"/.lp?";else throw Error("Unknown connection type: "+b);a.host!==a.ab&&(c.ns=a.lc);var d=[];v(c,function(a,b){d.push(b+"="+a)});return b+d.join("&")}dd.prototype.toString=function(){var a=(this.ob?"https://":"http://")+this.host;this.Rd&&(a+="<"+this.Rd+">");return a};var id=function(){var a=1;return function(){return a++}}(),O=Kb,jd=Lb;
function kd(a){try{var b;if("undefined"!==typeof atob)b=atob(a);else{ob();for(var c=mb,d=[],e=0;e<a.length;){var f=c[a.charAt(e++)],g=e<a.length?c[a.charAt(e)]:0;++e;var k=e<a.length?c[a.charAt(e)]:64;++e;var m=e<a.length?c[a.charAt(e)]:64;++e;if(null==f||null==g||null==k||null==m)throw Error();d.push(f<<2|g>>4);64!=k&&(d.push(g<<4&240|k>>2),64!=m&&d.push(k<<6&192|m))}if(8192>d.length)b=String.fromCharCode.apply(null,d);else{a="";for(c=0;c<d.length;c+=8192)a+=String.fromCharCode.apply(null,Ua(d,c,
c+8192));b=a}}return b}catch(l){fc("base64Decode failed: ",l)}return null}function ld(a){var b=Ob(a);a=new Ja;a.update(b);var b=[],c=8*a.ge;56>a.ec?a.update(a.Od,56-a.ec):a.update(a.Od,a.Ya-(a.ec-56));for(var d=a.Ya-1;56<=d;d--)a.pe[d]=c&255,c/=256;Ka(a,a.pe);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c]=a.P[d]>>e&255,++c;return nb(b)}
function md(a){for(var b="",c=0;c<arguments.length;c++)b=ea(arguments[c])?b+md.apply(null,arguments[c]):"object"===typeof arguments[c]?b+G(arguments[c]):b+arguments[c],b+=" ";return b}var ec=null,nd=!0;
function od(a,b){Kb(!b||!0===a||!1===a,"Can't turn on custom loggers persistently.");!0===a?("undefined"!==typeof console&&("function"===typeof console.log?ec=u(console.log,console):"object"===typeof console.log&&(ec=function(a){console.log(a)})),b&&cd.set("logging_enabled",!0)):r(a)?ec=a:(ec=null,cd.remove("logging_enabled"))}function fc(a){!0===nd&&(nd=!1,null===ec&&!0===cd.get("logging_enabled")&&od(!0));if(ec){var b=md.apply(null,arguments);ec(b)}}
function pd(a){return function(){fc(a,arguments)}}function qd(a){if("undefined"!==typeof console){var b="FIREBASE INTERNAL ERROR: "+md.apply(null,arguments);"undefined"!==typeof console.error?console.error(b):console.log(b)}}function rd(a){var b=md.apply(null,arguments);throw Error("FIREBASE FATAL ERROR: "+b);}function S(a){if("undefined"!==typeof console){var b="FIREBASE WARNING: "+md.apply(null,arguments);"undefined"!==typeof console.warn?console.warn(b):console.log(b)}}
function sd(a){var b="",c="",d="",e="",f=!0,g="https",k=443;if(q(a)){var m=a.indexOf("//");0<=m&&(g=a.substring(0,m-1),a=a.substring(m+2));m=a.indexOf("/");-1===m&&(m=a.length);b=a.substring(0,m);e="";a=a.substring(m).split("/");for(m=0;m<a.length;m++)if(0<a[m].length){var l=a[m];try{l=decodeURIComponent(l.replace(/\+/g," "))}catch(t){}e+="/"+l}a=b.split(".");3===a.length?(c=a[1],d=a[0].toLowerCase()):2===a.length&&(c=a[0]);m=b.indexOf(":");0<=m&&(f="https"===g||"wss"===g,k=b.substring(m+1),isFinite(k)&&
(k=String(k)),k=q(k)?/^\s*-?0x/i.test(k)?parseInt(k,16):parseInt(k,10):NaN)}return{host:b,port:k,domain:c,eh:d,ob:f,scheme:g,bd:e}}function td(a){return fa(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}
function ud(a){if("complete"===document.readyState)a();else{var b=!1,c=function(){document.body?b||(b=!0,a()):setTimeout(c,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&c()}),window.attachEvent("onload",c))}}
function yc(a,b){if(a===b)return 0;if("[MIN_NAME]"===a||"[MAX_NAME]"===b)return-1;if("[MIN_NAME]"===b||"[MAX_NAME]"===a)return 1;var c=vd(a),d=vd(b);return null!==c?null!==d?0==c-d?a.length-b.length:c-d:-1:null!==d?1:a<b?-1:1}function wd(a,b){if(b&&a in b)return b[a];throw Error("Missing required key ("+a+") in object: "+G(b));}
function xd(a){if("object"!==typeof a||null===a)return G(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=G(b[d]),c+=":",c+=xd(a[b[d]]);return c+"}"}function yd(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}function zd(a,b){if(da(a))for(var c=0;c<a.length;++c)b(c,a[c]);else v(a,b)}
function Ad(a){O(!td(a),"Invalid JSON number");var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;--a)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;--a)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&
(d="0"+d),c+=d;return c.toLowerCase()}var Bd=/^-?\d{1,10}$/;function vd(a){return Bd.test(a)&&(a=Number(a),-2147483648<=a&&2147483647>=a)?a:null}function gc(a){try{a()}catch(b){setTimeout(function(){S("Exception was thrown by user callback.",b.stack||"");throw b;},Math.floor(0))}}function T(a,b){if(r(a)){var c=Array.prototype.slice.call(arguments,1).slice();gc(function(){a.apply(null,c)})}};function Cd(a){var b={},c={},d={},e="";try{var f=a.split("."),b=Rb(kd(f[0])||""),c=Rb(kd(f[1])||""),e=f[2],d=c.d||{};delete c.d}catch(g){}return{lh:b,Ec:c,data:d,ah:e}}function Dd(a){a=Cd(a).Ec;return"object"===typeof a&&a.hasOwnProperty("iat")?z(a,"iat"):null}function Ed(a){a=Cd(a);var b=a.Ec;return!!a.ah&&!!b&&"object"===typeof b&&b.hasOwnProperty("iat")};function Fd(a){this.Y=a;this.g=a.n.g}function Gd(a,b,c,d){var e=[],f=[];Ma(b,function(b){"child_changed"===b.type&&a.g.Dd(b.Oe,b.Na)&&f.push(new J("child_moved",b.Na,b.Za))});Hd(a,e,"child_removed",b,d,c);Hd(a,e,"child_added",b,d,c);Hd(a,e,"child_moved",f,d,c);Hd(a,e,"child_changed",b,d,c);Hd(a,e,ic,b,d,c);return e}function Hd(a,b,c,d,e,f){d=Na(d,function(a){return a.type===c});Va(d,u(a.qg,a));Ma(d,function(c){var d=Id(a,c,f);Ma(e,function(e){e.Qf(c.type)&&b.push(e.createEvent(d,a.Y))})})}
function Id(a,b,c){"value"!==b.type&&"child_removed"!==b.type&&(b.Td=c.wf(b.Za,b.Na,a.g));return b}Fd.prototype.qg=function(a,b){if(null==a.Za||null==b.Za)throw jd("Should only compare child_ events.");return this.g.compare(new L(a.Za,a.Na),new L(b.Za,b.Na))};function Jd(){this.ib={}}
function Kd(a,b){var c=b.type,d=b.Za;O("child_added"==c||"child_changed"==c||"child_removed"==c,"Only child changes supported for tracking");O(".priority"!==d,"Only non-priority child changes can be tracked.");var e=z(a.ib,d);if(e){var f=e.type;if("child_added"==c&&"child_removed"==f)a.ib[d]=new J("child_changed",b.Na,d,e.Na);else if("child_removed"==c&&"child_added"==f)delete a.ib[d];else if("child_removed"==c&&"child_changed"==f)a.ib[d]=new J("child_removed",e.Oe,d);else if("child_changed"==c&&
"child_added"==f)a.ib[d]=new J("child_added",b.Na,d);else if("child_changed"==c&&"child_changed"==f)a.ib[d]=new J("child_changed",b.Na,d,e.Oe);else throw jd("Illegal combination of changes: "+b+" occurred after "+e);}else a.ib[d]=b};function Ld(a){this.g=a}h=Ld.prototype;h.H=function(a,b,c,d,e,f){O(a.Mc(this.g),"A node must be indexed if only a child is updated");e=a.T(b);if(e.S(d).ea(c.S(d))&&e.e()==c.e())return a;null!=f&&(c.e()?a.Fa(b)?Kd(f,new J("child_removed",e,b)):O(a.L(),"A child remove without an old child only makes sense on a leaf node"):e.e()?Kd(f,new J("child_added",c,b)):Kd(f,new J("child_changed",c,b,e)));return a.L()&&c.e()?a:a.W(b,c).pb(this.g)};
h.ya=function(a,b,c){null!=c&&(a.L()||a.R(R,function(a,e){b.Fa(a)||Kd(c,new J("child_removed",e,a))}),b.L()||b.R(R,function(b,e){if(a.Fa(b)){var f=a.T(b);f.ea(e)||Kd(c,new J("child_changed",e,b,f))}else Kd(c,new J("child_added",e,b))}));return b.pb(this.g)};h.ia=function(a,b){return a.e()?H:a.ia(b)};h.Ra=function(){return!1};h.$b=function(){return this};function Md(a){this.Fe=new Ld(a.g);this.g=a.g;var b;a.oa?(b=Nd(a),b=a.g.Sc(Od(a),b)):b=a.g.Wc();this.gd=b;a.ra?(b=Pd(a),a=a.g.Sc(Rd(a),b)):a=a.g.Tc();this.Jc=a}h=Md.prototype;h.matches=function(a){return 0>=this.g.compare(this.gd,a)&&0>=this.g.compare(a,this.Jc)};h.H=function(a,b,c,d,e,f){this.matches(new L(b,c))||(c=H);return this.Fe.H(a,b,c,d,e,f)};
h.ya=function(a,b,c){b.L()&&(b=H);var d=b.pb(this.g),d=d.ia(H),e=this;b.R(R,function(a,b){e.matches(new L(a,b))||(d=d.W(a,H))});return this.Fe.ya(a,d,c)};h.ia=function(a){return a};h.Ra=function(){return!0};h.$b=function(){return this.Fe};function Sd(a){this.ua=new Md(a);this.g=a.g;O(a.la,"Only valid if limit has been set");this.ma=a.ma;this.Nb=!Td(a)}h=Sd.prototype;h.H=function(a,b,c,d,e,f){this.ua.matches(new L(b,c))||(c=H);return a.T(b).ea(c)?a:a.Hb()<this.ma?this.ua.$b().H(a,b,c,d,e,f):Ud(this,a,b,c,e,f)};
h.ya=function(a,b,c){var d;if(b.L()||b.e())d=H.pb(this.g);else if(2*this.ma<b.Hb()&&b.Mc(this.g)){d=H.pb(this.g);b=this.Nb?b.dc(this.ua.Jc,this.g):b.bc(this.ua.gd,this.g);for(var e=0;0<b.Ta.length&&e<this.ma;){var f=Ic(b),g;if(g=this.Nb?0>=this.g.compare(this.ua.gd,f):0>=this.g.compare(f,this.ua.Jc))d=d.W(f.name,f.U),e++;else break}}else{d=b.pb(this.g);d=d.ia(H);var k,m,l;if(this.Nb){b=d.xf(this.g);k=this.ua.Jc;m=this.ua.gd;var t=Vd(this.g);l=function(a,b){return t(b,a)}}else b=d.ac(this.g),k=this.ua.gd,
m=this.ua.Jc,l=Vd(this.g);for(var e=0,A=!1;0<b.Ta.length;)f=Ic(b),!A&&0>=l(k,f)&&(A=!0),(g=A&&e<this.ma&&0>=l(f,m))?e++:d=d.W(f.name,H)}return this.ua.$b().ya(a,d,c)};h.ia=function(a){return a};h.Ra=function(){return!0};h.$b=function(){return this.ua.$b()};
function Ud(a,b,c,d,e,f){var g;if(a.Nb){var k=Vd(a.g);g=function(a,b){return k(b,a)}}else g=Vd(a.g);O(b.Hb()==a.ma,"");var m=new L(c,d),l=a.Nb?Wd(b,a.g):Xd(b,a.g),t=a.ua.matches(m);if(b.Fa(c)){for(var A=b.T(c),l=e.Ce(a.g,l,a.Nb);null!=l&&(l.name==c||b.Fa(l.name));)l=e.Ce(a.g,l,a.Nb);e=null==l?1:g(l,m);if(t&&!d.e()&&0<=e)return null!=f&&Kd(f,new J("child_changed",d,c,A)),b.W(c,d);null!=f&&Kd(f,new J("child_removed",A,c));b=b.W(c,H);return null!=l&&a.ua.matches(l)?(null!=f&&Kd(f,new J("child_added",
l.U,l.name)),b.W(l.name,l.U)):b}return d.e()?b:t&&0<=g(l,m)?(null!=f&&(Kd(f,new J("child_removed",l.U,l.name)),Kd(f,new J("child_added",d,c))),b.W(c,d).W(l.name,H)):b};function Yd(a,b){this.me=a;this.og=b}function Zd(a){this.X=a}
Zd.prototype.gb=function(a,b,c,d){var e=new Jd,f;if(b.type===Bc)b.source.Ae?c=$d(this,a,b.path,b.Ja,c,d,e):(O(b.source.tf,"Unknown source."),f=b.source.ef||mc(a.w())&&!b.path.e(),c=ae(this,a,b.path,b.Ja,c,d,f,e));else if(b.type===be)b.source.Ae?c=ce(this,a,b.path,b.children,c,d,e):(O(b.source.tf,"Unknown source."),f=b.source.ef||mc(a.w()),c=de(this,a,b.path,b.children,c,d,f,e));else if(b.type===ee)if(b.Yd)if(b=b.path,null!=c.xc(b))c=a;else{f=new Vb(c,a,d);d=a.Q.j();if(b.e()||".priority"===K(b))lc(a.w())?
b=c.Aa(Yb(a)):(b=a.w().j(),O(b instanceof fe,"serverChildren would be complete if leaf node"),b=c.Cc(b)),b=this.X.ya(d,b,e);else{var g=K(b),k=c.Bc(g,a.w());null==k&&Wb(a.w(),g)&&(k=d.T(g));b=null!=k?this.X.H(d,g,k,N(b),f,e):a.Q.j().Fa(g)?this.X.H(d,g,H,N(b),f,e):d;b.e()&&lc(a.w())&&(d=c.Aa(Yb(a)),d.L()&&(b=this.X.ya(b,d,e)))}d=lc(a.w())||null!=c.xc(M);c=ge(a,b,d,this.X.Ra())}else c=he(this,a,b.path,b.Ub,c,d,e);else if(b.type===Dc)d=b.path,b=a.w(),f=b.j(),g=b.ga||d.e(),c=ie(this,new je(a.Q,new Xb(f,
g,b.Yb)),d,c,Ub,e);else throw jd("Unknown operation type: "+b.type);e=qa(e.ib);d=c;b=d.Q;b.ga&&(f=b.j().L()||b.j().e(),g=ke(a),(0<e.length||!a.Q.ga||f&&!b.j().ea(g)||!b.j().C().ea(g.C()))&&e.push(hc(ke(d))));return new Yd(c,e)};
function ie(a,b,c,d,e,f){var g=b.Q;if(null!=d.xc(c))return b;var k;if(c.e())O(lc(b.w()),"If change path is empty, we must have complete server data"),mc(b.w())?(e=Yb(b),d=d.Cc(e instanceof fe?e:H)):d=d.Aa(Yb(b)),f=a.X.ya(b.Q.j(),d,f);else{var m=K(c);if(".priority"==m)O(1==le(c),"Can't have a priority with additional path components"),f=g.j(),k=b.w().j(),d=d.nd(c,f,k),f=null!=d?a.X.ia(f,d):g.j();else{var l=N(c);Wb(g,m)?(k=b.w().j(),d=d.nd(c,g.j(),k),d=null!=d?g.j().T(m).H(l,d):g.j().T(m)):d=d.Bc(m,
b.w());f=null!=d?a.X.H(g.j(),m,d,l,e,f):g.j()}}return ge(b,f,g.ga||c.e(),a.X.Ra())}function ae(a,b,c,d,e,f,g,k){var m=b.w();g=g?a.X:a.X.$b();if(c.e())d=g.ya(m.j(),d,null);else if(g.Ra()&&!m.Yb)d=m.j().H(c,d),d=g.ya(m.j(),d,null);else{var l=K(c);if(!nc(m,c)&&1<le(c))return b;var t=N(c);d=m.j().T(l).H(t,d);d=".priority"==l?g.ia(m.j(),d):g.H(m.j(),l,d,t,Ub,null)}m=m.ga||c.e();b=new je(b.Q,new Xb(d,m,g.Ra()));return ie(a,b,c,e,new Vb(e,b,f),k)}
function $d(a,b,c,d,e,f,g){var k=b.Q;e=new Vb(e,b,f);if(c.e())g=a.X.ya(b.Q.j(),d,g),a=ge(b,g,!0,a.X.Ra());else if(f=K(c),".priority"===f)g=a.X.ia(b.Q.j(),d),a=ge(b,g,k.ga,k.Yb);else{c=N(c);var m=k.j().T(f);if(!c.e()){var l=e.uf(f);d=null!=l?".priority"===me(c)&&l.S(c.parent()).e()?l:l.H(c,d):H}m.ea(d)?a=b:(g=a.X.H(k.j(),f,d,c,e,g),a=ge(b,g,k.ga,a.X.Ra()))}return a}
function ce(a,b,c,d,e,f,g){var k=b;ne(d,function(d,l){var t=c.o(d);Wb(b.Q,K(t))&&(k=$d(a,k,t,l,e,f,g))});ne(d,function(d,l){var t=c.o(d);Wb(b.Q,K(t))||(k=$d(a,k,t,l,e,f,g))});return k}function oe(a,b){ne(b,function(b,d){a=a.H(b,d)});return a}
function de(a,b,c,d,e,f,g,k){if(b.w().j().e()&&!lc(b.w()))return b;var m=b;c=c.e()?d:pe(qe,c,d);var l=b.w().j();c.children.ka(function(c,d){if(l.Fa(c)){var I=b.w().j().T(c),I=oe(I,d);m=ae(a,m,new P(c),I,e,f,g,k)}});c.children.ka(function(c,d){var I=!Wb(b.w(),c)&&null==d.value;l.Fa(c)||I||(I=b.w().j().T(c),I=oe(I,d),m=ae(a,m,new P(c),I,e,f,g,k))});return m}
function he(a,b,c,d,e,f,g){if(null!=e.xc(c))return b;var k=mc(b.w()),m=b.w();if(null!=d.value){if(c.e()&&m.ga||nc(m,c))return ae(a,b,c,m.j().S(c),e,f,k,g);if(c.e()){var l=qe;m.j().R(re,function(a,b){l=l.set(new P(a),b)});return de(a,b,c,l,e,f,k,g)}return b}l=qe;ne(d,function(a){var b=c.o(a);nc(m,b)&&(l=l.set(a,m.j().S(b)))});return de(a,b,c,l,e,f,k,g)};function se(){}var te={};function Vd(a){return u(a.compare,a)}se.prototype.Dd=function(a,b){return 0!==this.compare(new L("[MIN_NAME]",a),new L("[MIN_NAME]",b))};se.prototype.Wc=function(){return ue};function ve(a){O(!a.e()&&".priority"!==K(a),"Can't create PathIndex with empty path or .priority key");this.gc=a}ka(ve,se);h=ve.prototype;h.Lc=function(a){return!a.S(this.gc).e()};h.compare=function(a,b){var c=a.U.S(this.gc),d=b.U.S(this.gc),c=c.Gc(d);return 0===c?yc(a.name,b.name):c};
h.Sc=function(a,b){var c=Q(a),c=H.H(this.gc,c);return new L(b,c)};h.Tc=function(){var a=H.H(this.gc,we);return new L("[MAX_NAME]",a)};h.toString=function(){return this.gc.slice().join("/")};function xe(){}ka(xe,se);h=xe.prototype;h.compare=function(a,b){var c=a.U.C(),d=b.U.C(),c=c.Gc(d);return 0===c?yc(a.name,b.name):c};h.Lc=function(a){return!a.C().e()};h.Dd=function(a,b){return!a.C().ea(b.C())};h.Wc=function(){return ue};h.Tc=function(){return new L("[MAX_NAME]",new Yc("[PRIORITY-POST]",we))};
h.Sc=function(a,b){var c=Q(a);return new L(b,new Yc("[PRIORITY-POST]",c))};h.toString=function(){return".priority"};var R=new xe;function ye(){}ka(ye,se);h=ye.prototype;h.compare=function(a,b){return yc(a.name,b.name)};h.Lc=function(){throw jd("KeyIndex.isDefinedOn not expected to be called.");};h.Dd=function(){return!1};h.Wc=function(){return ue};h.Tc=function(){return new L("[MAX_NAME]",H)};h.Sc=function(a){O(q(a),"KeyIndex indexValue must always be a string.");return new L(a,H)};h.toString=function(){return".key"};
var re=new ye;function ze(){}ka(ze,se);h=ze.prototype;h.compare=function(a,b){var c=a.U.Gc(b.U);return 0===c?yc(a.name,b.name):c};h.Lc=function(){return!0};h.Dd=function(a,b){return!a.ea(b)};h.Wc=function(){return ue};h.Tc=function(){return Ae};h.Sc=function(a,b){var c=Q(a);return new L(b,c)};h.toString=function(){return".value"};var Be=new ze;function Ce(){this.Xb=this.ra=this.Pb=this.oa=this.la=!1;this.ma=0;this.Rb="";this.ic=null;this.Bb="";this.fc=null;this.zb="";this.g=R}var De=new Ce;function Td(a){return""===a.Rb?a.oa:"l"===a.Rb}function Od(a){O(a.oa,"Only valid if start has been set");return a.ic}function Nd(a){O(a.oa,"Only valid if start has been set");return a.Pb?a.Bb:"[MIN_NAME]"}function Rd(a){O(a.ra,"Only valid if end has been set");return a.fc}
function Pd(a){O(a.ra,"Only valid if end has been set");return a.Xb?a.zb:"[MAX_NAME]"}function Ee(a){var b=new Ce;b.la=a.la;b.ma=a.ma;b.oa=a.oa;b.ic=a.ic;b.Pb=a.Pb;b.Bb=a.Bb;b.ra=a.ra;b.fc=a.fc;b.Xb=a.Xb;b.zb=a.zb;b.g=a.g;return b}h=Ce.prototype;h.Le=function(a){var b=Ee(this);b.la=!0;b.ma=a;b.Rb="";return b};h.Me=function(a){var b=Ee(this);b.la=!0;b.ma=a;b.Rb="l";return b};h.Ne=function(a){var b=Ee(this);b.la=!0;b.ma=a;b.Rb="r";return b};
h.ce=function(a,b){var c=Ee(this);c.oa=!0;p(a)||(a=null);c.ic=a;null!=b?(c.Pb=!0,c.Bb=b):(c.Pb=!1,c.Bb="");return c};h.vd=function(a,b){var c=Ee(this);c.ra=!0;p(a)||(a=null);c.fc=a;p(b)?(c.Xb=!0,c.zb=b):(c.nh=!1,c.zb="");return c};function Fe(a,b){var c=Ee(a);c.g=b;return c}function Ge(a){var b={};a.oa&&(b.sp=a.ic,a.Pb&&(b.sn=a.Bb));a.ra&&(b.ep=a.fc,a.Xb&&(b.en=a.zb));if(a.la){b.l=a.ma;var c=a.Rb;""===c&&(c=Td(a)?"l":"r");b.vf=c}a.g!==R&&(b.i=a.g.toString());return b}
function He(a){return!(a.oa||a.ra||a.la)}function Ie(a){return He(a)&&a.g==R}function Je(a){var b={};if(Ie(a))return b;var c;a.g===R?c="$priority":a.g===Be?c="$value":a.g===re?c="$key":(O(a.g instanceof ve,"Unrecognized index type!"),c=a.g.toString());b.orderBy=G(c);a.oa&&(b.startAt=G(a.ic),a.Pb&&(b.startAt+=","+G(a.Bb)));a.ra&&(b.endAt=G(a.fc),a.Xb&&(b.endAt+=","+G(a.zb)));a.la&&(Td(a)?b.limitToFirst=a.ma:b.limitToLast=a.ma);return b}h.toString=function(){return G(Ge(this))};function Ke(a,b){this.Ed=a;this.hc=b}Ke.prototype.get=function(a){var b=z(this.Ed,a);if(!b)throw Error("No index defined for "+a);return b===te?null:b};function Le(a,b,c){var d=ma(a.Ed,function(d,f){var g=z(a.hc,f);O(g,"Missing index implementation for "+f);if(d===te){if(g.Lc(b.U)){for(var k=[],m=c.ac(wc),l=Ic(m);l;)l.name!=b.name&&k.push(l),l=Ic(m);k.push(b);return Me(k,Vd(g))}return te}g=c.get(b.name);k=d;g&&(k=k.remove(new L(b.name,g)));return k.Sa(b,b.U)});return new Ke(d,a.hc)}
function Ne(a,b,c){var d=ma(a.Ed,function(a){if(a===te)return a;var d=c.get(b.name);return d?a.remove(new L(b.name,d)):a});return new Ke(d,a.hc)}var Oe=new Ke({".priority":te},{".priority":R});function Yc(a,b){this.B=a;O(p(this.B)&&null!==this.B,"LeafNode shouldn't be created with null/undefined value.");this.ca=b||H;Pe(this.ca);this.Gb=null}var Qe=["object","boolean","number","string"];h=Yc.prototype;h.L=function(){return!0};h.C=function(){return this.ca};h.ia=function(a){return new Yc(this.B,a)};h.T=function(a){return".priority"===a?this.ca:H};h.S=function(a){return a.e()?this:".priority"===K(a)?this.ca:H};h.Fa=function(){return!1};h.wf=function(){return null};
h.W=function(a,b){return".priority"===a?this.ia(b):b.e()&&".priority"!==a?this:H.W(a,b).ia(this.ca)};h.H=function(a,b){var c=K(a);if(null===c)return b;if(b.e()&&".priority"!==c)return this;O(".priority"!==c||1===le(a),".priority must be the last token in a path");return this.W(c,H.H(N(a),b))};h.e=function(){return!1};h.Hb=function(){return 0};h.R=function(){return!1};h.J=function(a){return a&&!this.C().e()?{".value":this.Ea(),".priority":this.C().J()}:this.Ea()};
h.hash=function(){if(null===this.Gb){var a="";this.ca.e()||(a+="priority:"+Re(this.ca.J())+":");var b=typeof this.B,a=a+(b+":"),a="number"===b?a+Ad(this.B):a+this.B;this.Gb=ld(a)}return this.Gb};h.Ea=function(){return this.B};h.Gc=function(a){if(a===H)return 1;if(a instanceof fe)return-1;O(a.L(),"Unknown node type");var b=typeof a.B,c=typeof this.B,d=La(Qe,b),e=La(Qe,c);O(0<=d,"Unknown leaf type: "+b);O(0<=e,"Unknown leaf type: "+c);return d===e?"object"===c?0:this.B<a.B?-1:this.B===a.B?0:1:e-d};
h.pb=function(){return this};h.Mc=function(){return!0};h.ea=function(a){return a===this?!0:a.L()?this.B===a.B&&this.ca.ea(a.ca):!1};h.toString=function(){return G(this.J(!0))};function fe(a,b,c){this.m=a;(this.ca=b)&&Pe(this.ca);a.e()&&O(!this.ca||this.ca.e(),"An empty node cannot have a priority");this.Ab=c;this.Gb=null}h=fe.prototype;h.L=function(){return!1};h.C=function(){return this.ca||H};h.ia=function(a){return this.m.e()?this:new fe(this.m,a,this.Ab)};h.T=function(a){if(".priority"===a)return this.C();a=this.m.get(a);return null===a?H:a};h.S=function(a){var b=K(a);return null===b?this:this.T(b).S(N(a))};h.Fa=function(a){return null!==this.m.get(a)};
h.W=function(a,b){O(b,"We should always be passing snapshot nodes");if(".priority"===a)return this.ia(b);var c=new L(a,b),d,e;b.e()?(d=this.m.remove(a),c=Ne(this.Ab,c,this.m)):(d=this.m.Sa(a,b),c=Le(this.Ab,c,this.m));e=d.e()?H:this.ca;return new fe(d,e,c)};h.H=function(a,b){var c=K(a);if(null===c)return b;O(".priority"!==K(a)||1===le(a),".priority must be the last token in a path");var d=this.T(c).H(N(a),b);return this.W(c,d)};h.e=function(){return this.m.e()};h.Hb=function(){return this.m.count()};
var Se=/^(0|[1-9]\d*)$/;h=fe.prototype;h.J=function(a){if(this.e())return null;var b={},c=0,d=0,e=!0;this.R(R,function(f,g){b[f]=g.J(a);c++;e&&Se.test(f)?d=Math.max(d,Number(f)):e=!1});if(!a&&e&&d<2*c){var f=[],g;for(g in b)f[g]=b[g];return f}a&&!this.C().e()&&(b[".priority"]=this.C().J());return b};h.hash=function(){if(null===this.Gb){var a="";this.C().e()||(a+="priority:"+Re(this.C().J())+":");this.R(R,function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});this.Gb=""===a?"":ld(a)}return this.Gb};
h.wf=function(a,b,c){return(c=Te(this,c))?(a=Gc(c,new L(a,b)))?a.name:null:Gc(this.m,a)};function Wd(a,b){var c;c=(c=Te(a,b))?(c=c.Vc())&&c.name:a.m.Vc();return c?new L(c,a.m.get(c)):null}function Xd(a,b){var c;c=(c=Te(a,b))?(c=c.jc())&&c.name:a.m.jc();return c?new L(c,a.m.get(c)):null}h.R=function(a,b){var c=Te(this,a);return c?c.ka(function(a){return b(a.name,a.U)}):this.m.ka(b)};h.ac=function(a){return this.bc(a.Wc(),a)};
h.bc=function(a,b){var c=Te(this,b);if(c)return c.bc(a,function(a){return a});for(var c=this.m.bc(a.name,wc),d=Jc(c);null!=d&&0>b.compare(d,a);)Ic(c),d=Jc(c);return c};h.xf=function(a){return this.dc(a.Tc(),a)};h.dc=function(a,b){var c=Te(this,b);if(c)return c.dc(a,function(a){return a});for(var c=this.m.dc(a.name,wc),d=Jc(c);null!=d&&0<b.compare(d,a);)Ic(c),d=Jc(c);return c};h.Gc=function(a){return this.e()?a.e()?0:-1:a.L()||a.e()?1:a===we?-1:0};
h.pb=function(a){if(a===re||sa(this.Ab.hc,a.toString()))return this;var b=this.Ab,c=this.m;O(a!==re,"KeyIndex always exists and isn't meant to be added to the IndexMap.");for(var d=[],e=!1,c=c.ac(wc),f=Ic(c);f;)e=e||a.Lc(f.U),d.push(f),f=Ic(c);d=e?Me(d,Vd(a)):te;e=a.toString();c=wa(b.hc);c[e]=a;a=wa(b.Ed);a[e]=d;return new fe(this.m,this.ca,new Ke(a,c))};h.Mc=function(a){return a===re||sa(this.Ab.hc,a.toString())};
h.ea=function(a){if(a===this)return!0;if(a.L())return!1;if(this.C().ea(a.C())&&this.m.count()===a.m.count()){var b=this.ac(R);a=a.ac(R);for(var c=Ic(b),d=Ic(a);c&&d;){if(c.name!==d.name||!c.U.ea(d.U))return!1;c=Ic(b);d=Ic(a)}return null===c&&null===d}return!1};function Te(a,b){return b===re?null:a.Ab.get(b.toString())}h.toString=function(){return G(this.J(!0))};function Q(a,b){if(null===a)return H;var c=null;"object"===typeof a&&".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);O(null===c||"string"===typeof c||"number"===typeof c||"object"===typeof c&&".sv"in c,"Invalid priority type found: "+typeof c);"object"===typeof a&&".value"in a&&null!==a[".value"]&&(a=a[".value"]);if("object"!==typeof a||".sv"in a)return new Yc(a,Q(c));if(a instanceof Array){var d=H,e=a;v(e,function(a,b){if(y(e,b)&&"."!==b.substring(0,1)){var c=Q(a);if(c.L()||!c.e())d=
d.W(b,c)}});return d.ia(Q(c))}var f=[],g=!1,k=a;Fb(k,function(a){if("string"!==typeof a||"."!==a.substring(0,1)){var b=Q(k[a]);b.e()||(g=g||!b.C().e(),f.push(new L(a,b)))}});if(0==f.length)return H;var m=Me(f,xc,function(a){return a.name},zc);if(g){var l=Me(f,Vd(R));return new fe(m,Q(c),new Ke({".priority":l},{".priority":R}))}return new fe(m,Q(c),Oe)}var Ue=Math.log(2);
function Ve(a){this.count=parseInt(Math.log(a+1)/Ue,10);this.nf=this.count-1;this.ng=a+1&parseInt(Array(this.count+1).join("1"),2)}function We(a){var b=!(a.ng&1<<a.nf);a.nf--;return b}
function Me(a,b,c,d){function e(b,d){var f=d-b;if(0==f)return null;if(1==f){var l=a[b],t=c?c(l):l;return new Kc(t,l.U,!1,null,null)}var l=parseInt(f/2,10)+b,f=e(b,l),A=e(l+1,d),l=a[l],t=c?c(l):l;return new Kc(t,l.U,!1,f,A)}a.sort(b);var f=function(b){function d(b,g){var k=t-b,A=t;t-=b;var A=e(k+1,A),k=a[k],I=c?c(k):k,A=new Kc(I,k.U,g,null,A);f?f.left=A:l=A;f=A}for(var f=null,l=null,t=a.length,A=0;A<b.count;++A){var I=We(b),Qd=Math.pow(2,b.count-(A+1));I?d(Qd,!1):(d(Qd,!1),d(Qd,!0))}return l}(new Ve(a.length));
return null!==f?new Ec(d||b,f):new Ec(d||b)}function Re(a){return"number"===typeof a?"number:"+Ad(a):"string:"+a}function Pe(a){if(a.L()){var b=a.J();O("string"===typeof b||"number"===typeof b||"object"===typeof b&&y(b,".sv"),"Priority must be a string or number.")}else O(a===we||a.e(),"priority of unexpected type.");O(a===we||a.C().e(),"Priority nodes can't have a priority of their own.")}var H=new fe(new Ec(zc),null,Oe);function Xe(){fe.call(this,new Ec(zc),H,Oe)}ka(Xe,fe);h=Xe.prototype;
h.Gc=function(a){return a===this?0:1};h.ea=function(a){return a===this};h.C=function(){return this};h.T=function(){return H};h.e=function(){return!1};var we=new Xe,ue=new L("[MIN_NAME]",H),Ae=new L("[MAX_NAME]",we);function je(a,b){this.Q=a;this.ae=b}function ge(a,b,c,d){return new je(new Xb(b,c,d),a.ae)}function ke(a){return a.Q.ga?a.Q.j():null}je.prototype.w=function(){return this.ae};function Yb(a){return a.ae.ga?a.ae.j():null};function Ye(a,b){this.Y=a;var c=a.n,d=new Ld(c.g),c=He(c)?new Ld(c.g):c.la?new Sd(c):new Md(c);this.Nf=new Zd(c);var e=b.w(),f=b.Q,g=d.ya(H,e.j(),null),k=c.ya(H,f.j(),null);this.Oa=new je(new Xb(k,f.ga,c.Ra()),new Xb(g,e.ga,d.Ra()));this.$a=[];this.ug=new Fd(a)}function Ze(a){return a.Y}h=Ye.prototype;h.w=function(){return this.Oa.w().j()};h.kb=function(a){var b=Yb(this.Oa);return b&&(He(this.Y.n)||!a.e()&&!b.T(K(a)).e())?b.S(a):null};h.e=function(){return 0===this.$a.length};h.Tb=function(a){this.$a.push(a)};
h.nb=function(a,b){var c=[];if(b){O(null==a,"A cancel should cancel all event registrations.");var d=this.Y.path;Ma(this.$a,function(a){(a=a.lf(b,d))&&c.push(a)})}if(a){for(var e=[],f=0;f<this.$a.length;++f){var g=this.$a[f];if(!g.matches(a))e.push(g);else if(a.yf()){e=e.concat(this.$a.slice(f+1));break}}this.$a=e}else this.$a=[];return c};
h.gb=function(a,b,c){a.type===be&&null!==a.source.Lb&&(O(Yb(this.Oa),"We should always have a full cache before handling merges"),O(ke(this.Oa),"Missing event cache, even though we have a server cache"));var d=this.Oa;a=this.Nf.gb(d,a,b,c);b=this.Nf;c=a.me;O(c.Q.j().Mc(b.X.g),"Event snap not indexed");O(c.w().j().Mc(b.X.g),"Server snap not indexed");O(lc(a.me.w())||!lc(d.w()),"Once a server snap is complete, it should never go back");this.Oa=a.me;return $e(this,a.og,a.me.Q.j(),null)};
function af(a,b){var c=a.Oa.Q,d=[];c.j().L()||c.j().R(R,function(a,b){d.push(new J("child_added",b,a))});c.ga&&d.push(hc(c.j()));return $e(a,d,c.j(),b)}function $e(a,b,c,d){return Gd(a.ug,b,c,d?[d]:a.$a)};function bf(a,b,c){this.type=be;this.source=a;this.path=b;this.children=c}bf.prototype.$c=function(a){if(this.path.e())return a=this.children.subtree(new P(a)),a.e()?null:a.value?new Ac(this.source,M,a.value):new bf(this.source,M,a);O(K(this.path)===a,"Can't get a merge for a child not on the path of the operation");return new bf(this.source,N(this.path),this.children)};bf.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"};function cf(a,b){this.f=pd("p:rest:");this.G=a;this.Kb=b;this.Ca=null;this.ba={}}function df(a,b){if(p(b))return"tag$"+b;O(Ie(a.n),"should have a tag if it's not a default query.");return a.path.toString()}h=cf.prototype;
h.Cf=function(a,b,c,d){var e=a.path.toString();this.f("Listen called for "+e+" "+a.wa());var f=df(a,c),g={};this.ba[f]=g;a=Je(a.n);var k=this;ef(this,e+".json",a,function(a,b){var t=b;404===a&&(a=t=null);null===a&&k.Kb(e,t,!1,c);z(k.ba,f)===g&&d(a?401==a?"permission_denied":"rest_error:"+a:"ok",null)})};h.$f=function(a,b){var c=df(a,b);delete this.ba[c]};h.O=function(a,b){this.Ca=a;var c=Cd(a),d=c.data,c=c.Ec&&c.Ec.exp;b&&b("ok",{auth:d,expires:c})};h.je=function(a){this.Ca=null;a("ok",null)};
h.Qe=function(){};h.Gf=function(){};h.Md=function(){};h.put=function(){};h.Df=function(){};h.Ye=function(){};
function ef(a,b,c,d){c=c||{};c.format="export";a.Ca&&(c.auth=a.Ca);var e=(a.G.ob?"https://":"http://")+a.G.host+b+"?"+Ib(c);a.f("Sending REST request for "+e);var f=new XMLHttpRequest;f.onreadystatechange=function(){if(d&&4===f.readyState){a.f("REST Response for "+e+" received. status:",f.status,"response:",f.responseText);var b=null;if(200<=f.status&&300>f.status){try{b=Rb(f.responseText)}catch(c){S("Failed to parse JSON response for "+e+": "+f.responseText)}d(null,b)}else 401!==f.status&&404!==
f.status&&S("Got unsuccessful REST response for "+e+" Status: "+f.status),d(f.status);d=null}};f.open("GET",e,!0);f.send()};function ff(a){O(da(a)&&0<a.length,"Requires a non-empty array");this.fg=a;this.Rc={}}ff.prototype.ie=function(a,b){var c;c=this.Rc[a]||[];var d=c.length;if(0<d){for(var e=Array(d),f=0;f<d;f++)e[f]=c[f];c=e}else c=[];for(d=0;d<c.length;d++)c[d].Dc.apply(c[d].Qa,Array.prototype.slice.call(arguments,1))};ff.prototype.Ib=function(a,b,c){gf(this,a);this.Rc[a]=this.Rc[a]||[];this.Rc[a].push({Dc:b,Qa:c});(a=this.Ee(a))&&b.apply(c,a)};
ff.prototype.mc=function(a,b,c){gf(this,a);a=this.Rc[a]||[];for(var d=0;d<a.length;d++)if(a[d].Dc===b&&(!c||c===a[d].Qa)){a.splice(d,1);break}};function gf(a,b){O(Ra(a.fg,function(a){return a===b}),"Unknown event: "+b)};var hf=function(){var a=0,b=[];return function(c){var d=c===a;a=c;for(var e=Array(8),f=7;0<=f;f--)e[f]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c%64),c=Math.floor(c/64);O(0===c,"Cannot push at time == 0");c=e.join("");if(d){for(f=11;0<=f&&63===b[f];f--)b[f]=0;b[f]++}else for(f=0;12>f;f++)b[f]=Math.floor(64*Math.random());for(f=0;12>f;f++)c+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);O(20===c.length,"nextPushId: Length should be 20.");
return c}}();function jf(){ff.call(this,["online"]);this.oc=!0;if("undefined"!==typeof window&&"undefined"!==typeof window.addEventListener){var a=this;window.addEventListener("online",function(){a.oc||(a.oc=!0,a.ie("online",!0))},!1);window.addEventListener("offline",function(){a.oc&&(a.oc=!1,a.ie("online",!1))},!1)}}ka(jf,ff);jf.prototype.Ee=function(a){O("online"===a,"Unknown event type: "+a);return[this.oc]};ba(jf);function kf(){ff.call(this,["visible"]);var a,b;"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document.hidden?(b="visibilitychange",a="hidden"):"undefined"!==typeof document.mozHidden?(b="mozvisibilitychange",a="mozHidden"):"undefined"!==typeof document.msHidden?(b="msvisibilitychange",a="msHidden"):"undefined"!==typeof document.webkitHidden&&(b="webkitvisibilitychange",a="webkitHidden"));this.Sb=!0;if(b){var c=this;document.addEventListener(b,
function(){var b=!document[a];b!==c.Sb&&(c.Sb=b,c.ie("visible",b))},!1)}}ka(kf,ff);kf.prototype.Ee=function(a){O("visible"===a,"Unknown event type: "+a);return[this.Sb]};ba(kf);function P(a,b){if(1==arguments.length){this.u=a.split("/");for(var c=0,d=0;d<this.u.length;d++)0<this.u[d].length&&(this.u[c]=this.u[d],c++);this.u.length=c;this.aa=0}else this.u=a,this.aa=b}function lf(a,b){var c=K(a);if(null===c)return b;if(c===K(b))return lf(N(a),N(b));throw Error("INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")");}
function mf(a,b){for(var c=a.slice(),d=b.slice(),e=0;e<c.length&&e<d.length;e++){var f=yc(c[e],d[e]);if(0!==f)return f}return c.length===d.length?0:c.length<d.length?-1:1}function K(a){return a.aa>=a.u.length?null:a.u[a.aa]}function le(a){return a.u.length-a.aa}function N(a){var b=a.aa;b<a.u.length&&b++;return new P(a.u,b)}function me(a){return a.aa<a.u.length?a.u[a.u.length-1]:null}h=P.prototype;
h.toString=function(){for(var a="",b=this.aa;b<this.u.length;b++)""!==this.u[b]&&(a+="/"+this.u[b]);return a||"/"};h.slice=function(a){return this.u.slice(this.aa+(a||0))};h.parent=function(){if(this.aa>=this.u.length)return null;for(var a=[],b=this.aa;b<this.u.length-1;b++)a.push(this.u[b]);return new P(a,0)};
h.o=function(a){for(var b=[],c=this.aa;c<this.u.length;c++)b.push(this.u[c]);if(a instanceof P)for(c=a.aa;c<a.u.length;c++)b.push(a.u[c]);else for(a=a.split("/"),c=0;c<a.length;c++)0<a[c].length&&b.push(a[c]);return new P(b,0)};h.e=function(){return this.aa>=this.u.length};h.ea=function(a){if(le(this)!==le(a))return!1;for(var b=this.aa,c=a.aa;b<=this.u.length;b++,c++)if(this.u[b]!==a.u[c])return!1;return!0};
h.contains=function(a){var b=this.aa,c=a.aa;if(le(this)>le(a))return!1;for(;b<this.u.length;){if(this.u[b]!==a.u[c])return!1;++b;++c}return!0};var M=new P("");function nf(a,b){this.Ua=a.slice();this.Ka=Math.max(1,this.Ua.length);this.pf=b;for(var c=0;c<this.Ua.length;c++)this.Ka+=Pb(this.Ua[c]);of(this)}nf.prototype.push=function(a){0<this.Ua.length&&(this.Ka+=1);this.Ua.push(a);this.Ka+=Pb(a);of(this)};nf.prototype.pop=function(){var a=this.Ua.pop();this.Ka-=Pb(a);0<this.Ua.length&&--this.Ka};
function of(a){if(768<a.Ka)throw Error(a.pf+"has a key path longer than 768 bytes ("+a.Ka+").");if(32<a.Ua.length)throw Error(a.pf+"path specified exceeds the maximum depth that can be written (32) or object contains a cycle "+pf(a));}function pf(a){return 0==a.Ua.length?"":"in property '"+a.Ua.join(".")+"'"};function qf(a,b){this.value=a;this.children=b||rf}var rf=new Ec(function(a,b){return a===b?0:a<b?-1:1});function sf(a){var b=qe;v(a,function(a,d){b=b.set(new P(d),a)});return b}h=qf.prototype;h.e=function(){return null===this.value&&this.children.e()};function tf(a,b,c){if(null!=a.value&&c(a.value))return{path:M,value:a.value};if(b.e())return null;var d=K(b);a=a.children.get(d);return null!==a?(b=tf(a,N(b),c),null!=b?{path:(new P(d)).o(b.path),value:b.value}:null):null}
function uf(a,b){return tf(a,b,function(){return!0})}h.subtree=function(a){if(a.e())return this;var b=this.children.get(K(a));return null!==b?b.subtree(N(a)):qe};h.set=function(a,b){if(a.e())return new qf(b,this.children);var c=K(a),d=(this.children.get(c)||qe).set(N(a),b),c=this.children.Sa(c,d);return new qf(this.value,c)};
h.remove=function(a){if(a.e())return this.children.e()?qe:new qf(null,this.children);var b=K(a),c=this.children.get(b);return c?(a=c.remove(N(a)),b=a.e()?this.children.remove(b):this.children.Sa(b,a),null===this.value&&b.e()?qe:new qf(this.value,b)):this};h.get=function(a){if(a.e())return this.value;var b=this.children.get(K(a));return b?b.get(N(a)):null};
function pe(a,b,c){if(b.e())return c;var d=K(b);b=pe(a.children.get(d)||qe,N(b),c);d=b.e()?a.children.remove(d):a.children.Sa(d,b);return new qf(a.value,d)}function vf(a,b){return wf(a,M,b)}function wf(a,b,c){var d={};a.children.ka(function(a,f){d[a]=wf(f,b.o(a),c)});return c(b,a.value,d)}function xf(a,b,c){return yf(a,b,M,c)}function yf(a,b,c,d){var e=a.value?d(c,a.value):!1;if(e)return e;if(b.e())return null;e=K(b);return(a=a.children.get(e))?yf(a,N(b),c.o(e),d):null}
function zf(a,b,c){Af(a,b,M,c)}function Af(a,b,c,d){if(b.e())return a;a.value&&d(c,a.value);var e=K(b);return(a=a.children.get(e))?Af(a,N(b),c.o(e),d):qe}function ne(a,b){Bf(a,M,b)}function Bf(a,b,c){a.children.ka(function(a,e){Bf(e,b.o(a),c)});a.value&&c(b,a.value)}function Cf(a,b){a.children.ka(function(a,d){d.value&&b(a,d.value)})}var qe=new qf(null);qf.prototype.toString=function(){var a={};ne(this,function(b,c){a[b.toString()]=c.toString()});return G(a)};function Df(a,b,c){this.type=ee;this.source=Ef;this.path=a;this.Ub=b;this.Yd=c}Df.prototype.$c=function(a){if(this.path.e()){if(null!=this.Ub.value)return O(this.Ub.children.e(),"affectedTree should not have overlapping affected paths."),this;a=this.Ub.subtree(new P(a));return new Df(M,a,this.Yd)}O(K(this.path)===a,"operationForChild called for unrelated child.");return new Df(N(this.path),this.Ub,this.Yd)};
Df.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" ack write revert="+this.Yd+" affectedTree="+this.Ub+")"};var Bc=0,be=1,ee=2,Dc=3;function Ff(a,b,c,d){this.Ae=a;this.tf=b;this.Lb=c;this.ef=d;O(!d||b,"Tagged queries must be from server.")}var Ef=new Ff(!0,!1,null,!1),Gf=new Ff(!1,!0,null,!1);Ff.prototype.toString=function(){return this.Ae?"user":this.ef?"server(queryID="+this.Lb+")":"server"};function Hf(a){this.Z=a}var If=new Hf(new qf(null));function Jf(a,b,c){if(b.e())return new Hf(new qf(c));var d=uf(a.Z,b);if(null!=d){var e=d.path,d=d.value;b=lf(e,b);d=d.H(b,c);return new Hf(a.Z.set(e,d))}a=pe(a.Z,b,new qf(c));return new Hf(a)}function Kf(a,b,c){var d=a;Fb(c,function(a,c){d=Jf(d,b.o(a),c)});return d}Hf.prototype.Ud=function(a){if(a.e())return If;a=pe(this.Z,a,qe);return new Hf(a)};function Lf(a,b){var c=uf(a.Z,b);return null!=c?a.Z.get(c.path).S(lf(c.path,b)):null}
function Mf(a){var b=[],c=a.Z.value;null!=c?c.L()||c.R(R,function(a,c){b.push(new L(a,c))}):a.Z.children.ka(function(a,c){null!=c.value&&b.push(new L(a,c.value))});return b}function Nf(a,b){if(b.e())return a;var c=Lf(a,b);return null!=c?new Hf(new qf(c)):new Hf(a.Z.subtree(b))}Hf.prototype.e=function(){return this.Z.e()};Hf.prototype.apply=function(a){return Of(M,this.Z,a)};
function Of(a,b,c){if(null!=b.value)return c.H(a,b.value);var d=null;b.children.ka(function(b,f){".priority"===b?(O(null!==f.value,"Priority writes must always be leaf nodes"),d=f.value):c=Of(a.o(b),f,c)});c.S(a).e()||null===d||(c=c.H(a.o(".priority"),d));return c};function Pf(){this.V=If;this.pa=[];this.Pc=-1}function Qf(a,b){for(var c=0;c<a.pa.length;c++){var d=a.pa[c];if(d.md===b)return d}return null}h=Pf.prototype;
h.Ud=function(a){var b=Sa(this.pa,function(b){return b.md===a});O(0<=b,"removeWrite called with nonexistent writeId.");var c=this.pa[b];this.pa.splice(b,1);for(var d=c.visible,e=!1,f=this.pa.length-1;d&&0<=f;){var g=this.pa[f];g.visible&&(f>=b&&Rf(g,c.path)?d=!1:c.path.contains(g.path)&&(e=!0));f--}if(d){if(e)this.V=Sf(this.pa,Tf,M),this.Pc=0<this.pa.length?this.pa[this.pa.length-1].md:-1;else if(c.Ja)this.V=this.V.Ud(c.path);else{var k=this;v(c.children,function(a,b){k.V=k.V.Ud(c.path.o(b))})}return!0}return!1};
h.Aa=function(a,b,c,d){if(c||d){var e=Nf(this.V,a);return!d&&e.e()?b:d||null!=b||null!=Lf(e,M)?(e=Sf(this.pa,function(b){return(b.visible||d)&&(!c||!(0<=La(c,b.md)))&&(b.path.contains(a)||a.contains(b.path))},a),b=b||H,e.apply(b)):null}e=Lf(this.V,a);if(null!=e)return e;e=Nf(this.V,a);return e.e()?b:null!=b||null!=Lf(e,M)?(b=b||H,e.apply(b)):null};
h.Cc=function(a,b){var c=H,d=Lf(this.V,a);if(d)d.L()||d.R(R,function(a,b){c=c.W(a,b)});else if(b){var e=Nf(this.V,a);b.R(R,function(a,b){var d=Nf(e,new P(a)).apply(b);c=c.W(a,d)});Ma(Mf(e),function(a){c=c.W(a.name,a.U)})}else e=Nf(this.V,a),Ma(Mf(e),function(a){c=c.W(a.name,a.U)});return c};h.nd=function(a,b,c,d){O(c||d,"Either existingEventSnap or existingServerSnap must exist");a=a.o(b);if(null!=Lf(this.V,a))return null;a=Nf(this.V,a);return a.e()?d.S(b):a.apply(d.S(b))};
h.Bc=function(a,b,c){a=a.o(b);var d=Lf(this.V,a);return null!=d?d:Wb(c,b)?Nf(this.V,a).apply(c.j().T(b)):null};h.xc=function(a){return Lf(this.V,a)};h.qe=function(a,b,c,d,e,f){var g;a=Nf(this.V,a);g=Lf(a,M);if(null==g)if(null!=b)g=a.apply(b);else return[];g=g.pb(f);if(g.e()||g.L())return[];b=[];a=Vd(f);e=e?g.dc(c,f):g.bc(c,f);for(f=Ic(e);f&&b.length<d;)0!==a(f,c)&&b.push(f),f=Ic(e);return b};
function Rf(a,b){return a.Ja?a.path.contains(b):!!ta(a.children,function(c,d){return a.path.o(d).contains(b)})}function Tf(a){return a.visible}
function Sf(a,b,c){for(var d=If,e=0;e<a.length;++e){var f=a[e];if(b(f)){var g=f.path;if(f.Ja)c.contains(g)?(g=lf(c,g),d=Jf(d,g,f.Ja)):g.contains(c)&&(g=lf(g,c),d=Jf(d,M,f.Ja.S(g)));else if(f.children)if(c.contains(g))g=lf(c,g),d=Kf(d,g,f.children);else{if(g.contains(c))if(g=lf(g,c),g.e())d=Kf(d,M,f.children);else if(f=z(f.children,K(g)))f=f.S(N(g)),d=Jf(d,M,f)}else throw jd("WriteRecord should have .snap or .children");}}return d}function Uf(a,b){this.Qb=a;this.Z=b}h=Uf.prototype;
h.Aa=function(a,b,c){return this.Z.Aa(this.Qb,a,b,c)};h.Cc=function(a){return this.Z.Cc(this.Qb,a)};h.nd=function(a,b,c){return this.Z.nd(this.Qb,a,b,c)};h.xc=function(a){return this.Z.xc(this.Qb.o(a))};h.qe=function(a,b,c,d,e){return this.Z.qe(this.Qb,a,b,c,d,e)};h.Bc=function(a,b){return this.Z.Bc(this.Qb,a,b)};h.o=function(a){return new Uf(this.Qb.o(a),this.Z)};function Vf(){this.children={};this.pd=0;this.value=null}function Wf(a,b,c){this.Jd=a?a:"";this.Ha=b?b:null;this.A=c?c:new Vf}function Xf(a,b){for(var c=b instanceof P?b:new P(b),d=a,e;null!==(e=K(c));)d=new Wf(e,d,z(d.A.children,e)||new Vf),c=N(c);return d}h=Wf.prototype;h.Ea=function(){return this.A.value};function Yf(a,b){O("undefined"!==typeof b,"Cannot set value to undefined");a.A.value=b;Zf(a)}h.clear=function(){this.A.value=null;this.A.children={};this.A.pd=0;Zf(this)};
h.zd=function(){return 0<this.A.pd};h.e=function(){return null===this.Ea()&&!this.zd()};h.R=function(a){var b=this;v(this.A.children,function(c,d){a(new Wf(d,b,c))})};function $f(a,b,c,d){c&&!d&&b(a);a.R(function(a){$f(a,b,!0,d)});c&&d&&b(a)}function ag(a,b){for(var c=a.parent();null!==c&&!b(c);)c=c.parent()}h.path=function(){return new P(null===this.Ha?this.Jd:this.Ha.path()+"/"+this.Jd)};h.name=function(){return this.Jd};h.parent=function(){return this.Ha};
function Zf(a){if(null!==a.Ha){var b=a.Ha,c=a.Jd,d=a.e(),e=y(b.A.children,c);d&&e?(delete b.A.children[c],b.A.pd--,Zf(b)):d||e||(b.A.children[c]=a.A,b.A.pd++,Zf(b))}};var bg=/[\[\].#$\/\u0000-\u001F\u007F]/,cg=/[\[\].#$\u0000-\u001F\u007F]/,dg=/^[a-zA-Z][a-zA-Z._\-+]+$/;function eg(a){return q(a)&&0!==a.length&&!bg.test(a)}function fg(a){return null===a||q(a)||fa(a)&&!td(a)||ga(a)&&y(a,".sv")}function gg(a,b,c,d){d&&!p(b)||hg(E(a,1,d),b,c)}
function hg(a,b,c){c instanceof P&&(c=new nf(c,a));if(!p(b))throw Error(a+"contains undefined "+pf(c));if(r(b))throw Error(a+"contains a function "+pf(c)+" with contents: "+b.toString());if(td(b))throw Error(a+"contains "+b.toString()+" "+pf(c));if(q(b)&&b.length>10485760/3&&10485760<Pb(b))throw Error(a+"contains a string greater than 10485760 utf8 bytes "+pf(c)+" ('"+b.substring(0,50)+"...')");if(ga(b)){var d=!1,e=!1;Fb(b,function(b,g){if(".value"===b)d=!0;else if(".priority"!==b&&".sv"!==b&&(e=
!0,!eg(b)))throw Error(a+" contains an invalid key ("+b+") "+pf(c)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');c.push(b);hg(a,g,c);c.pop()});if(d&&e)throw Error(a+' contains ".value" child '+pf(c)+" in addition to actual children.");}}
function ig(a,b){var c,d;for(c=0;c<b.length;c++){d=b[c];for(var e=d.slice(),f=0;f<e.length;f++)if((".priority"!==e[f]||f!==e.length-1)&&!eg(e[f]))throw Error(a+"contains an invalid key ("+e[f]+") in path "+d.toString()+'. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');}b.sort(mf);e=null;for(c=0;c<b.length;c++){d=b[c];if(null!==e&&e.contains(d))throw Error(a+"contains a path "+e.toString()+" that is ancestor of another path "+d.toString());e=d}}
function jg(a,b,c){var d=E(a,1,!1);if(!ga(b)||da(b))throw Error(d+" must be an object containing the children to replace.");var e=[];Fb(b,function(a,b){var k=new P(a);hg(d,b,c.o(k));if(".priority"===me(k)&&!fg(b))throw Error(d+"contains an invalid value for '"+k.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");e.push(k)});ig(d,e)}
function kg(a,b,c){if(td(c))throw Error(E(a,b,!1)+"is "+c.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!fg(c))throw Error(E(a,b,!1)+"must be a valid Firebase priority (a string, finite number, server value, or null).");}
function lg(a,b,c){if(!c||p(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:throw Error(E(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}}function mg(a,b){if(p(b)&&!eg(b))throw Error(E(a,2,!0)+'was an invalid key: "'+b+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');}
function ng(a,b){if(!q(b)||0===b.length||cg.test(b))throw Error(E(a,1,!1)+'was an invalid path: "'+b+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');}function og(a,b){if(".info"===K(b))throw Error(a+" failed: Can't modify data under /.info/");}function pg(a,b){if(!q(b))throw Error(E(a,1,!1)+"must be a valid credential (a string).");}function qg(a,b,c){if(!q(c))throw Error(E(a,b,!1)+"must be a valid string.");}
function rg(a,b){qg(a,1,b);if(!dg.test(b))throw Error(E(a,1,!1)+"'"+b+"' is not a valid authentication provider.");}function sg(a,b,c,d){if(!d||p(c))if(!ga(c)||null===c)throw Error(E(a,b,d)+"must be a valid object.");}function tg(a,b,c){if(!ga(b)||!y(b,c))throw Error(E(a,1,!1)+'must contain the key "'+c+'"');if(!q(z(b,c)))throw Error(E(a,1,!1)+'must contain the key "'+c+'" with type "string"');};function ug(){this.set={}}h=ug.prototype;h.add=function(a,b){this.set[a]=null!==b?b:!0};h.contains=function(a){return y(this.set,a)};h.get=function(a){return this.contains(a)?this.set[a]:void 0};h.remove=function(a){delete this.set[a]};h.clear=function(){this.set={}};h.e=function(){return va(this.set)};h.count=function(){return oa(this.set)};function vg(a,b){v(a.set,function(a,d){b(d,a)})}h.keys=function(){var a=[];v(this.set,function(b,c){a.push(c)});return a};function Vc(){this.m=this.B=null}Vc.prototype.find=function(a){if(null!=this.B)return this.B.S(a);if(a.e()||null==this.m)return null;var b=K(a);a=N(a);return this.m.contains(b)?this.m.get(b).find(a):null};Vc.prototype.rc=function(a,b){if(a.e())this.B=b,this.m=null;else if(null!==this.B)this.B=this.B.H(a,b);else{null==this.m&&(this.m=new ug);var c=K(a);this.m.contains(c)||this.m.add(c,new Vc);c=this.m.get(c);a=N(a);c.rc(a,b)}};
function wg(a,b){if(b.e())return a.B=null,a.m=null,!0;if(null!==a.B){if(a.B.L())return!1;var c=a.B;a.B=null;c.R(R,function(b,c){a.rc(new P(b),c)});return wg(a,b)}return null!==a.m?(c=K(b),b=N(b),a.m.contains(c)&&wg(a.m.get(c),b)&&a.m.remove(c),a.m.e()?(a.m=null,!0):!1):!0}function Wc(a,b,c){null!==a.B?c(b,a.B):a.R(function(a,e){var f=new P(b.toString()+"/"+a);Wc(e,f,c)})}Vc.prototype.R=function(a){null!==this.m&&vg(this.m,function(b,c){a(b,c)})};var xg="auth.firebase.com";function yg(a,b,c){this.qd=a||{};this.he=b||{};this.fb=c||{};this.qd.remember||(this.qd.remember="default")}var zg=["remember","redirectTo"];function Ag(a){var b={},c={};Fb(a||{},function(a,e){0<=La(zg,a)?b[a]=e:c[a]=e});return new yg(b,{},c)};function Bg(a,b){this.Ue=["session",a.Rd,a.lc].join(":");this.ee=b}Bg.prototype.set=function(a,b){if(!b)if(this.ee.length)b=this.ee[0];else throw Error("fb.login.SessionManager : No storage options available!");b.set(this.Ue,a)};Bg.prototype.get=function(){var a=Oa(this.ee,u(this.Bg,this)),a=Na(a,function(a){return null!==a});Va(a,function(a,c){return Dd(c.token)-Dd(a.token)});return 0<a.length?a.shift():null};Bg.prototype.Bg=function(a){try{var b=a.get(this.Ue);if(b&&b.token)return b}catch(c){}return null};
Bg.prototype.clear=function(){var a=this;Ma(this.ee,function(b){b.remove(a.Ue)})};function Cg(){return"undefined"!==typeof navigator&&"string"===typeof navigator.userAgent?navigator.userAgent:""}function Dg(){return"undefined"!==typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Cg())}function Eg(){return"undefined"!==typeof location&&/^file:\//.test(location.href)}
function Fg(a){var b=Cg();if(""===b)return!1;if("Microsoft Internet Explorer"===navigator.appName){if((b=b.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/))&&1<b.length)return parseFloat(b[1])>=a}else if(-1<b.indexOf("Trident")&&(b=b.match(/rv:([0-9]{2,2}[\.0-9]{0,})/))&&1<b.length)return parseFloat(b[1])>=a;return!1};function Gg(){var a=window.opener.frames,b;for(b=a.length-1;0<=b;b--)try{if(a[b].location.protocol===window.location.protocol&&a[b].location.host===window.location.host&&"__winchan_relay_frame"===a[b].name)return a[b]}catch(c){}return null}function Hg(a,b,c){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,!1)}function Ig(a,b,c){a.detachEvent?a.detachEvent("on"+b,c):a.removeEventListener&&a.removeEventListener(b,c,!1)}
function Jg(a){/^https?:\/\//.test(a)||(a=window.location.href);var b=/^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);return b?b[1]:a}function Kg(a){var b="";try{a=a.replace(/.*\?/,"");var c=Jb(a);c&&y(c,"__firebase_request_key")&&(b=z(c,"__firebase_request_key"))}catch(d){}return b}function Lg(){try{var a=document.location.hash.replace(/&__firebase_request_key=([a-zA-z0-9]*)/,""),a=a.replace(/\?$/,""),a=a.replace(/^#+$/,"");document.location.hash=a}catch(b){}}
function Mg(){var a=sd(xg);return a.scheme+"://"+a.host+"/v2"}function Ng(a){return Mg()+"/"+a+"/auth/channel"};function Og(a){var b=this;this.hb=a;this.fe="*";Fg(8)?this.Uc=this.Cd=Gg():(this.Uc=window.opener,this.Cd=window);if(!b.Uc)throw"Unable to find relay frame";Hg(this.Cd,"message",u(this.nc,this));Hg(this.Cd,"message",u(this.Ff,this));try{Pg(this,{a:"ready"})}catch(c){Hg(this.Uc,"load",function(){Pg(b,{a:"ready"})})}Hg(window,"unload",u(this.Mg,this))}function Pg(a,b){b=G(b);Fg(8)?a.Uc.doPost(b,a.fe):a.Uc.postMessage(b,a.fe)}
Og.prototype.nc=function(a){var b=this,c;try{c=Rb(a.data)}catch(d){}c&&"request"===c.a&&(Ig(window,"message",this.nc),this.fe=a.origin,this.hb&&setTimeout(function(){b.hb(b.fe,c.d,function(a,c){b.mg=!c;b.hb=void 0;Pg(b,{a:"response",d:a,forceKeepWindowOpen:c})})},0))};Og.prototype.Mg=function(){try{Ig(this.Cd,"message",this.Ff)}catch(a){}this.hb&&(Pg(this,{a:"error",d:"unknown closed window"}),this.hb=void 0);try{window.close()}catch(b){}};Og.prototype.Ff=function(a){if(this.mg&&"die"===a.data)try{window.close()}catch(b){}};function Qg(a){this.tc=Fa()+Fa()+Fa();this.Kf=a}Qg.prototype.open=function(a,b){cd.set("redirect_request_id",this.tc);cd.set("redirect_request_id",this.tc);b.requestId=this.tc;b.redirectTo=b.redirectTo||window.location.href;a+=(/\?/.test(a)?"":"?")+Ib(b);window.location=a};Qg.isAvailable=function(){return!Eg()&&!Dg()};Qg.prototype.Fc=function(){return"redirect"};var Rg={NETWORK_ERROR:"Unable to contact the Firebase server.",SERVER_ERROR:"An unknown server error occurred.",TRANSPORT_UNAVAILABLE:"There are no login transports available for the requested method.",REQUEST_INTERRUPTED:"The browser redirected the page before the login request could complete.",USER_CANCELLED:"The user cancelled authentication."};function Sg(a){var b=Error(z(Rg,a),a);b.code=a;return b};function Tg(a){var b;(b=!a.window_features)||(b=Cg(),b=-1!==b.indexOf("Fennec/")||-1!==b.indexOf("Firefox/")&&-1!==b.indexOf("Android"));b&&(a.window_features=void 0);a.window_name||(a.window_name="_blank");this.options=a}
Tg.prototype.open=function(a,b,c){function d(a){g&&(document.body.removeChild(g),g=void 0);t&&(t=clearInterval(t));Ig(window,"message",e);Ig(window,"unload",d);if(l&&!a)try{l.close()}catch(b){k.postMessage("die",m)}l=k=void 0}function e(a){if(a.origin===m)try{var b=Rb(a.data);"ready"===b.a?k.postMessage(A,m):"error"===b.a?(d(!1),c&&(c(b.d),c=null)):"response"===b.a&&(d(b.forceKeepWindowOpen),c&&(c(null,b.d),c=null))}catch(e){}}var f=Fg(8),g,k;if(!this.options.relay_url)return c(Error("invalid arguments: origin of url and relay_url must match"));
var m=Jg(a);if(m!==Jg(this.options.relay_url))c&&setTimeout(function(){c(Error("invalid arguments: origin of url and relay_url must match"))},0);else{f&&(g=document.createElement("iframe"),g.setAttribute("src",this.options.relay_url),g.style.display="none",g.setAttribute("name","__winchan_relay_frame"),document.body.appendChild(g),k=g.contentWindow);a+=(/\?/.test(a)?"":"?")+Ib(b);var l=window.open(a,this.options.window_name,this.options.window_features);k||(k=l);var t=setInterval(function(){l&&l.closed&&
(d(!1),c&&(c(Sg("USER_CANCELLED")),c=null))},500),A=G({a:"request",d:b});Hg(window,"unload",d);Hg(window,"message",e)}};
Tg.isAvailable=function(){var a;if(a="postMessage"in window&&!Eg())(a=Dg()||"undefined"!==typeof navigator&&(!!Cg().match(/Windows Phone/)||!!window.Windows&&/^ms-appx:/.test(location.href)))||(a=Cg(),a="undefined"!==typeof navigator&&"undefined"!==typeof window&&!!(a.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i)||a.match(/CriOS/)||a.match(/Twitter for iPhone/)||a.match(/FBAN\/FBIOS/)||window.navigator.standalone)),a=!a;return a&&!Cg().match(/PhantomJS/)};Tg.prototype.Fc=function(){return"popup"};function Ug(a){a.method||(a.method="GET");a.headers||(a.headers={});a.headers.content_type||(a.headers.content_type="application/json");a.headers.content_type=a.headers.content_type.toLowerCase();this.options=a}
Ug.prototype.open=function(a,b,c){function d(){c&&(c(Sg("REQUEST_INTERRUPTED")),c=null)}var e=new XMLHttpRequest,f=this.options.method.toUpperCase(),g;Hg(window,"beforeunload",d);e.onreadystatechange=function(){if(c&&4===e.readyState){var a;if(200<=e.status&&300>e.status){try{a=Rb(e.responseText)}catch(b){}c(null,a)}else 500<=e.status&&600>e.status?c(Sg("SERVER_ERROR")):c(Sg("NETWORK_ERROR"));c=null;Ig(window,"beforeunload",d)}};if("GET"===f)a+=(/\?/.test(a)?"":"?")+Ib(b),g=null;else{var k=this.options.headers.content_type;
"application/json"===k&&(g=G(b));"application/x-www-form-urlencoded"===k&&(g=Ib(b))}e.open(f,a,!0);a={"X-Requested-With":"XMLHttpRequest",Accept:"application/json;text/plain"};ya(a,this.options.headers);for(var m in a)e.setRequestHeader(m,a[m]);e.send(g)};Ug.isAvailable=function(){var a;if(a=!!window.XMLHttpRequest)a=Cg(),a=!(a.match(/MSIE/)||a.match(/Trident/))||Fg(10);return a};Ug.prototype.Fc=function(){return"json"};function Vg(a){this.tc=Fa()+Fa()+Fa();this.Kf=a}
Vg.prototype.open=function(a,b,c){function d(){c&&(c(Sg("USER_CANCELLED")),c=null)}var e=this,f=sd(xg),g;b.requestId=this.tc;b.redirectTo=f.scheme+"://"+f.host+"/blank/page.html";a+=/\?/.test(a)?"":"?";a+=Ib(b);(g=window.open(a,"_blank","location=no"))&&r(g.addEventListener)?(g.addEventListener("loadstart",function(a){var b;if(b=a&&a.url)a:{try{var l=document.createElement("a");l.href=a.url;b=l.host===f.host&&"/blank/page.html"===l.pathname;break a}catch(t){}b=!1}b&&(a=Kg(a.url),g.removeEventListener("exit",
d),g.close(),a=new yg(null,null,{requestId:e.tc,requestKey:a}),e.Kf.requestWithCredential("/auth/session",a,c),c=null)}),g.addEventListener("exit",d)):c(Sg("TRANSPORT_UNAVAILABLE"))};Vg.isAvailable=function(){return Dg()};Vg.prototype.Fc=function(){return"redirect"};function Wg(a){a.callback_parameter||(a.callback_parameter="callback");this.options=a;window.__firebase_auth_jsonp=window.__firebase_auth_jsonp||{}}
Wg.prototype.open=function(a,b,c){function d(){c&&(c(Sg("REQUEST_INTERRUPTED")),c=null)}function e(){setTimeout(function(){window.__firebase_auth_jsonp[f]=void 0;va(window.__firebase_auth_jsonp)&&(window.__firebase_auth_jsonp=void 0);try{var a=document.getElementById(f);a&&a.parentNode.removeChild(a)}catch(b){}},1);Ig(window,"beforeunload",d)}var f="fn"+(new Date).getTime()+Math.floor(99999*Math.random());b[this.options.callback_parameter]="__firebase_auth_jsonp."+f;a+=(/\?/.test(a)?"":"?")+Ib(b);
Hg(window,"beforeunload",d);window.__firebase_auth_jsonp[f]=function(a){c&&(c(null,a),c=null);e()};Xg(f,a,c)};
function Xg(a,b,c){setTimeout(function(){try{var d=document.createElement("script");d.type="text/javascript";d.id=a;d.async=!0;d.src=b;d.onerror=function(){var b=document.getElementById(a);null!==b&&b.parentNode.removeChild(b);c&&c(Sg("NETWORK_ERROR"))};var e=document.getElementsByTagName("head");(e&&0!=e.length?e[0]:document.documentElement).appendChild(d)}catch(f){c&&c(Sg("NETWORK_ERROR"))}},0)}Wg.isAvailable=function(){return"undefined"!==typeof document&&null!=document.createElement};
Wg.prototype.Fc=function(){return"json"};function Yg(a,b,c,d){ff.call(this,["auth_status"]);this.G=a;this.hf=b;this.hh=c;this.Pe=d;this.wc=new Bg(a,[bd,cd]);this.qb=null;this.We=!1;Zg(this)}ka(Yg,ff);h=Yg.prototype;h.Be=function(){return this.qb||null};function Zg(a){cd.get("redirect_request_id")&&$g(a);var b=a.wc.get();b&&b.token?(ah(a,b),a.hf(b.token,function(c,d){bh(a,c,d,!1,b.token,b)},function(b,d){ch(a,"resumeSession()",b,d)})):ah(a,null)}
function dh(a,b,c,d,e,f){"firebaseio-demo.com"===a.G.domain&&S("Firebase authentication is not supported on demo Firebases (*.firebaseio-demo.com). To secure your Firebase, create a production Firebase at https://www.firebase.com.");a.hf(b,function(f,k){bh(a,f,k,!0,b,c,d||{},e)},function(b,c){ch(a,"auth()",b,c,f)})}function eh(a,b){a.wc.clear();ah(a,null);a.hh(function(a,d){if("ok"===a)T(b,null);else{var e=(a||"error").toUpperCase(),f=e;d&&(f+=": "+d);f=Error(f);f.code=e;T(b,f)}})}
function bh(a,b,c,d,e,f,g,k){"ok"===b?(d&&(b=c.auth,f.auth=b,f.expires=c.expires,f.token=Ed(e)?e:"",c=null,b&&y(b,"uid")?c=z(b,"uid"):y(f,"uid")&&(c=z(f,"uid")),f.uid=c,c="custom",b&&y(b,"provider")?c=z(b,"provider"):y(f,"provider")&&(c=z(f,"provider")),f.provider=c,a.wc.clear(),Ed(e)&&(g=g||{},c=bd,"sessionOnly"===g.remember&&(c=cd),"none"!==g.remember&&a.wc.set(f,c)),ah(a,f)),T(k,null,f)):(a.wc.clear(),ah(a,null),f=a=(b||"error").toUpperCase(),c&&(f+=": "+c),f=Error(f),f.code=a,T(k,f))}
function ch(a,b,c,d,e){S(b+" was canceled: "+d);a.wc.clear();ah(a,null);a=Error(d);a.code=c.toUpperCase();T(e,a)}function fh(a,b,c,d,e){gh(a);c=new yg(d||{},{},c||{});hh(a,[Ug,Wg],"/auth/"+b,c,e)}
function ih(a,b,c,d){gh(a);var e=[Tg,Vg];c=Ag(c);"anonymous"===b||"password"===b?setTimeout(function(){T(d,Sg("TRANSPORT_UNAVAILABLE"))},0):(c.he.window_features="menubar=yes,modal=yes,alwaysRaised=yeslocation=yes,resizable=yes,scrollbars=yes,status=yes,height=625,width=625,top="+("object"===typeof screen?.5*(screen.height-625):0)+",left="+("object"===typeof screen?.5*(screen.width-625):0),c.he.relay_url=Ng(a.G.lc),c.he.requestWithCredential=u(a.uc,a),hh(a,e,"/auth/"+b,c,d))}
function $g(a){var b=cd.get("redirect_request_id");if(b){var c=cd.get("redirect_client_options");cd.remove("redirect_request_id");cd.remove("redirect_client_options");var d=[Ug,Wg],b={requestId:b,requestKey:Kg(document.location.hash)},c=new yg(c,{},b);a.We=!0;Lg();hh(a,d,"/auth/session",c,function(){this.We=!1}.bind(a))}}h.ve=function(a,b){gh(this);var c=Ag(a);c.fb._method="POST";this.uc("/users",c,function(a,c){a?T(b,a):T(b,a,c)})};
h.Xe=function(a,b){var c=this;gh(this);var d="/users/"+encodeURIComponent(a.email),e=Ag(a);e.fb._method="DELETE";this.uc(d,e,function(a,d){!a&&d&&d.uid&&c.qb&&c.qb.uid&&c.qb.uid===d.uid&&eh(c);T(b,a)})};h.se=function(a,b){gh(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=Ag(a);d.fb._method="PUT";d.fb.password=a.newPassword;this.uc(c,d,function(a){T(b,a)})};
h.re=function(a,b){gh(this);var c="/users/"+encodeURIComponent(a.oldEmail)+"/email",d=Ag(a);d.fb._method="PUT";d.fb.email=a.newEmail;d.fb.password=a.password;this.uc(c,d,function(a){T(b,a)})};h.Ze=function(a,b){gh(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=Ag(a);d.fb._method="POST";this.uc(c,d,function(a){T(b,a)})};h.uc=function(a,b,c){jh(this,[Ug,Wg],a,b,c)};
function hh(a,b,c,d,e){jh(a,b,c,d,function(b,c){!b&&c&&c.token&&c.uid?dh(a,c.token,c,d.qd,function(a,b){a?T(e,a):T(e,null,b)}):T(e,b||Sg("UNKNOWN_ERROR"))})}
function jh(a,b,c,d,e){b=Na(b,function(a){return"function"===typeof a.isAvailable&&a.isAvailable()});0===b.length?setTimeout(function(){T(e,Sg("TRANSPORT_UNAVAILABLE"))},0):(b=new (b.shift())(d.he),d=Gb(d.fb),d.v="js-"+Eb,d.transport=b.Fc(),d.suppress_status_codes=!0,a=Mg()+"/"+a.G.lc+c,b.open(a,d,function(a,b){if(a)T(e,a);else if(b&&b.error){var c=Error(b.error.message);c.code=b.error.code;c.details=b.error.details;T(e,c)}else T(e,null,b)}))}
function ah(a,b){var c=null!==a.qb||null!==b;a.qb=b;c&&a.ie("auth_status",b);a.Pe(null!==b)}h.Ee=function(a){O("auth_status"===a,'initial event must be of type "auth_status"');return this.We?null:[this.qb]};function gh(a){var b=a.G;if("firebaseio.com"!==b.domain&&"firebaseio-demo.com"!==b.domain&&"auth.firebase.com"===xg)throw Error("This custom Firebase server ('"+a.G.domain+"') does not support delegated login.");};var gd="websocket",hd="long_polling";function kh(a){this.nc=a;this.Qd=[];this.Wb=0;this.te=-1;this.Jb=null}function lh(a,b,c){a.te=b;a.Jb=c;a.te<a.Wb&&(a.Jb(),a.Jb=null)}function mh(a,b,c){for(a.Qd[b]=c;a.Qd[a.Wb];){var d=a.Qd[a.Wb];delete a.Qd[a.Wb];for(var e=0;e<d.length;++e)if(d[e]){var f=a;gc(function(){f.nc(d[e])})}if(a.Wb===a.te){a.Jb&&(clearTimeout(a.Jb),a.Jb(),a.Jb=null);break}a.Wb++}};function nh(a,b,c,d){this.ue=a;this.f=pd(a);this.rb=this.sb=0;this.Xa=uc(b);this.Xf=c;this.Kc=!1;this.Fb=d;this.ld=function(a){return fd(b,hd,a)}}var oh,ph;
nh.prototype.open=function(a,b){this.mf=0;this.na=b;this.Ef=new kh(a);this.Db=!1;var c=this;this.ub=setTimeout(function(){c.f("Timed out trying to connect.");c.bb();c.ub=null},Math.floor(3E4));ud(function(){if(!c.Db){c.Wa=new qh(function(a,b,d,k,m){rh(c,arguments);if(c.Wa)if(c.ub&&(clearTimeout(c.ub),c.ub=null),c.Kc=!0,"start"==a)c.id=b,c.Mf=d;else if("close"===a)b?(c.Wa.$d=!1,lh(c.Ef,b,function(){c.bb()})):c.bb();else throw Error("Unrecognized command received: "+a);},function(a,b){rh(c,arguments);
mh(c.Ef,a,b)},function(){c.bb()},c.ld);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());c.Wa.ke&&(a.cb=c.Wa.ke);a.v="5";c.Xf&&(a.s=c.Xf);c.Fb&&(a.ls=c.Fb);"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");a=c.ld(a);c.f("Connecting via long-poll to "+a);sh(c.Wa,a,function(){})}})};
nh.prototype.start=function(){var a=this.Wa,b=this.Mf;a.Fg=this.id;a.Gg=b;for(a.oe=!0;th(a););a=this.id;b=this.Mf;this.kc=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;this.kc.src=this.ld(c);this.kc.style.display="none";document.body.appendChild(this.kc)};
nh.isAvailable=function(){return oh||!ph&&"undefined"!==typeof document&&null!=document.createElement&&!("object"===typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))&&!("object"===typeof Windows&&"object"===typeof Windows.jh)&&!0};h=nh.prototype;h.Hd=function(){};h.fd=function(){this.Db=!0;this.Wa&&(this.Wa.close(),this.Wa=null);this.kc&&(document.body.removeChild(this.kc),this.kc=null);this.ub&&(clearTimeout(this.ub),this.ub=null)};
h.bb=function(){this.Db||(this.f("Longpoll is closing itself"),this.fd(),this.na&&(this.na(this.Kc),this.na=null))};h.close=function(){this.Db||(this.f("Longpoll is being closed."),this.fd())};h.send=function(a){a=G(a);this.sb+=a.length;rc(this.Xa,"bytes_sent",a.length);a=Ob(a);a=nb(a,!0);a=yd(a,1840);for(var b=0;b<a.length;b++){var c=this.Wa;c.cd.push({Xg:this.mf,gh:a.length,of:a[b]});c.oe&&th(c);this.mf++}};function rh(a,b){var c=G(b).length;a.rb+=c;rc(a.Xa,"bytes_received",c)}
function qh(a,b,c,d){this.ld=d;this.lb=c;this.Te=new ug;this.cd=[];this.we=Math.floor(1E8*Math.random());this.$d=!0;this.ke=id();window["pLPCommand"+this.ke]=a;window["pRTLPCB"+this.ke]=b;a=document.createElement("iframe");a.style.display="none";if(document.body){document.body.appendChild(a);try{a.contentWindow.document||fc("No IE domain setting required")}catch(e){a.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
a.contentDocument?a.jb=a.contentDocument:a.contentWindow?a.jb=a.contentWindow.document:a.document&&(a.jb=a.document);this.Ga=a;a="";this.Ga.src&&"javascript:"===this.Ga.src.substr(0,11)&&(a='<script>document.domain="'+document.domain+'";\x3c/script>');a="<html><body>"+a+"</body></html>";try{this.Ga.jb.open(),this.Ga.jb.write(a),this.Ga.jb.close()}catch(f){fc("frame writing exception"),f.stack&&fc(f.stack),fc(f)}}
qh.prototype.close=function(){this.oe=!1;if(this.Ga){this.Ga.jb.body.innerHTML="";var a=this;setTimeout(function(){null!==a.Ga&&(document.body.removeChild(a.Ga),a.Ga=null)},Math.floor(0))}var b=this.lb;b&&(this.lb=null,b())};
function th(a){if(a.oe&&a.$d&&a.Te.count()<(0<a.cd.length?2:1)){a.we++;var b={};b.id=a.Fg;b.pw=a.Gg;b.ser=a.we;for(var b=a.ld(b),c="",d=0;0<a.cd.length;)if(1870>=a.cd[0].of.length+30+c.length){var e=a.cd.shift(),c=c+"&seg"+d+"="+e.Xg+"&ts"+d+"="+e.gh+"&d"+d+"="+e.of;d++}else break;uh(a,b+c,a.we);return!0}return!1}function uh(a,b,c){function d(){a.Te.remove(c);th(a)}a.Te.add(c,1);var e=setTimeout(d,Math.floor(25E3));sh(a,b,function(){clearTimeout(e);d()})}
function sh(a,b,c){setTimeout(function(){try{if(a.$d){var d=a.Ga.jb.createElement("script");d.type="text/javascript";d.async=!0;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;a&&"loaded"!==a&&"complete"!==a||(d.onload=d.onreadystatechange=null,d.parentNode&&d.parentNode.removeChild(d),c())};d.onerror=function(){fc("Long-poll script failed to load: "+b);a.$d=!1;a.close()};a.Ga.jb.body.appendChild(d)}}catch(e){}},Math.floor(1))};var vh=null;"undefined"!==typeof MozWebSocket?vh=MozWebSocket:"undefined"!==typeof WebSocket&&(vh=WebSocket);function wh(a,b,c,d){this.ue=a;this.f=pd(this.ue);this.frames=this.Nc=null;this.rb=this.sb=this.ff=0;this.Xa=uc(b);a={v:"5"};"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");c&&(a.s=c);d&&(a.ls=d);this.jf=fd(b,gd,a)}var xh;
wh.prototype.open=function(a,b){this.lb=b;this.Kg=a;this.f("Websocket connecting to "+this.jf);this.Kc=!1;bd.set("previous_websocket_failure",!0);try{this.La=new vh(this.jf)}catch(c){this.f("Error instantiating WebSocket.");var d=c.message||c.data;d&&this.f(d);this.bb();return}var e=this;this.La.onopen=function(){e.f("Websocket connected.");e.Kc=!0};this.La.onclose=function(){e.f("Websocket connection was disconnected.");e.La=null;e.bb()};this.La.onmessage=function(a){if(null!==e.La)if(a=a.data,e.rb+=
a.length,rc(e.Xa,"bytes_received",a.length),yh(e),null!==e.frames)zh(e,a);else{a:{O(null===e.frames,"We already have a frame buffer");if(6>=a.length){var b=Number(a);if(!isNaN(b)){e.ff=b;e.frames=[];a=null;break a}}e.ff=1;e.frames=[]}null!==a&&zh(e,a)}};this.La.onerror=function(a){e.f("WebSocket error.  Closing connection.");(a=a.message||a.data)&&e.f(a);e.bb()}};wh.prototype.start=function(){};
wh.isAvailable=function(){var a=!1;if("undefined"!==typeof navigator&&navigator.userAgent){var b=navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b&&1<b.length&&4.4>parseFloat(b[1])&&(a=!0)}return!a&&null!==vh&&!xh};wh.responsesRequiredToBeHealthy=2;wh.healthyTimeout=3E4;h=wh.prototype;h.Hd=function(){bd.remove("previous_websocket_failure")};function zh(a,b){a.frames.push(b);if(a.frames.length==a.ff){var c=a.frames.join("");a.frames=null;c=Rb(c);a.Kg(c)}}
h.send=function(a){yh(this);a=G(a);this.sb+=a.length;rc(this.Xa,"bytes_sent",a.length);a=yd(a,16384);1<a.length&&Ah(this,String(a.length));for(var b=0;b<a.length;b++)Ah(this,a[b])};h.fd=function(){this.Db=!0;this.Nc&&(clearInterval(this.Nc),this.Nc=null);this.La&&(this.La.close(),this.La=null)};h.bb=function(){this.Db||(this.f("WebSocket is closing itself"),this.fd(),this.lb&&(this.lb(this.Kc),this.lb=null))};h.close=function(){this.Db||(this.f("WebSocket is being closed"),this.fd())};
function yh(a){clearInterval(a.Nc);a.Nc=setInterval(function(){a.La&&Ah(a,"0");yh(a)},Math.floor(45E3))}function Ah(a,b){try{a.La.send(b)}catch(c){a.f("Exception thrown from WebSocket.send():",c.message||c.data,"Closing connection."),setTimeout(u(a.bb,a),0)}};function Bh(a){Ch(this,a)}var Dh=[nh,wh];function Ch(a,b){var c=wh&&wh.isAvailable(),d=c&&!(bd.Af||!0===bd.get("previous_websocket_failure"));b.ih&&(c||S("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),d=!0);if(d)a.jd=[wh];else{var e=a.jd=[];zd(Dh,function(a,b){b&&b.isAvailable()&&e.push(b)})}}function Eh(a){if(0<a.jd.length)return a.jd[0];throw Error("No transports available");};function Fh(a,b,c,d,e,f,g){this.id=a;this.f=pd("c:"+this.id+":");this.nc=c;this.Zc=d;this.na=e;this.Re=f;this.G=b;this.Pd=[];this.kf=0;this.Wf=new Bh(b);this.N=0;this.Fb=g;this.f("Connection created");Gh(this)}
function Gh(a){var b=Eh(a.Wf);a.K=new b("c:"+a.id+":"+a.kf++,a.G,void 0,a.Fb);a.Ve=b.responsesRequiredToBeHealthy||0;var c=Hh(a,a.K),d=Ih(a,a.K);a.kd=a.K;a.ed=a.K;a.F=null;a.Eb=!1;setTimeout(function(){a.K&&a.K.open(c,d)},Math.floor(0));b=b.healthyTimeout||0;0<b&&(a.Bd=setTimeout(function(){a.Bd=null;a.Eb||(a.K&&102400<a.K.rb?(a.f("Connection exceeded healthy timeout but has received "+a.K.rb+" bytes.  Marking connection healthy."),a.Eb=!0,a.K.Hd()):a.K&&10240<a.K.sb?a.f("Connection exceeded healthy timeout but has sent "+
a.K.sb+" bytes.  Leaving connection alive."):(a.f("Closing unhealthy connection after timeout."),a.close()))},Math.floor(b)))}function Ih(a,b){return function(c){b===a.K?(a.K=null,c||0!==a.N?1===a.N&&a.f("Realtime connection lost."):(a.f("Realtime connection failed."),"s-"===a.G.ab.substr(0,2)&&(bd.remove("host:"+a.G.host),a.G.ab=a.G.host)),a.close()):b===a.F?(a.f("Secondary connection lost."),c=a.F,a.F=null,a.kd!==c&&a.ed!==c||a.close()):a.f("closing an old connection")}}
function Hh(a,b){return function(c){if(2!=a.N)if(b===a.ed){var d=wd("t",c);c=wd("d",c);if("c"==d){if(d=wd("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.Uf=c.s;ed(a.G,f);0==a.N&&(a.K.start(),Jh(a,a.K,d),"5"!==e&&S("Protocol version mismatch detected"),c=a.Wf,(c=1<c.jd.length?c.jd[1]:null)&&Kh(a,c))}else if("n"===d){a.f("recvd end transmission on primary");a.ed=a.F;for(c=0;c<a.Pd.length;++c)a.Ld(a.Pd[c]);a.Pd=[];Lh(a)}else"s"===d?(a.f("Connection shutdown command received. Shutting down..."),
a.Re&&(a.Re(c),a.Re=null),a.na=null,a.close()):"r"===d?(a.f("Reset packet received.  New host: "+c),ed(a.G,c),1===a.N?a.close():(Mh(a),Gh(a))):"e"===d?qd("Server Error: "+c):"o"===d?(a.f("got pong on primary."),Nh(a),Oh(a)):qd("Unknown control packet command: "+d)}else"d"==d&&a.Ld(c)}else if(b===a.F)if(d=wd("t",c),c=wd("d",c),"c"==d)"t"in c&&(c=c.t,"a"===c?Ph(a):"r"===c?(a.f("Got a reset on secondary, closing it"),a.F.close(),a.kd!==a.F&&a.ed!==a.F||a.close()):"o"===c&&(a.f("got pong on secondary."),
a.Tf--,Ph(a)));else if("d"==d)a.Pd.push(c);else throw Error("Unknown protocol layer: "+d);else a.f("message on old connection")}}Fh.prototype.Ia=function(a){Qh(this,{t:"d",d:a})};function Lh(a){a.kd===a.F&&a.ed===a.F&&(a.f("cleaning up and promoting a connection: "+a.F.ue),a.K=a.F,a.F=null)}
function Ph(a){0>=a.Tf?(a.f("Secondary connection is healthy."),a.Eb=!0,a.F.Hd(),a.F.start(),a.f("sending client ack on secondary"),a.F.send({t:"c",d:{t:"a",d:{}}}),a.f("Ending transmission on primary"),a.K.send({t:"c",d:{t:"n",d:{}}}),a.kd=a.F,Lh(a)):(a.f("sending ping on secondary."),a.F.send({t:"c",d:{t:"p",d:{}}}))}Fh.prototype.Ld=function(a){Nh(this);this.nc(a)};function Nh(a){a.Eb||(a.Ve--,0>=a.Ve&&(a.f("Primary connection is healthy."),a.Eb=!0,a.K.Hd()))}
function Kh(a,b){a.F=new b("c:"+a.id+":"+a.kf++,a.G,a.Uf);a.Tf=b.responsesRequiredToBeHealthy||0;a.F.open(Hh(a,a.F),Ih(a,a.F));setTimeout(function(){a.F&&(a.f("Timed out trying to upgrade."),a.F.close())},Math.floor(6E4))}function Jh(a,b,c){a.f("Realtime connection established.");a.K=b;a.N=1;a.Zc&&(a.Zc(c,a.Uf),a.Zc=null);0===a.Ve?(a.f("Primary connection is healthy."),a.Eb=!0):setTimeout(function(){Oh(a)},Math.floor(5E3))}
function Oh(a){a.Eb||1!==a.N||(a.f("sending ping on primary."),Qh(a,{t:"c",d:{t:"p",d:{}}}))}function Qh(a,b){if(1!==a.N)throw"Connection is not connected";a.kd.send(b)}Fh.prototype.close=function(){2!==this.N&&(this.f("Closing realtime connection."),this.N=2,Mh(this),this.na&&(this.na(),this.na=null))};function Mh(a){a.f("Shutting down all connections");a.K&&(a.K.close(),a.K=null);a.F&&(a.F.close(),a.F=null);a.Bd&&(clearTimeout(a.Bd),a.Bd=null)};function Rh(a,b,c,d){this.id=Sh++;this.f=pd("p:"+this.id+":");this.Bf=this.Ie=!1;this.ba={};this.sa=[];this.ad=0;this.Yc=[];this.qa=!1;this.eb=1E3;this.Id=3E5;this.Kb=b;this.Xc=c;this.Se=d;this.G=a;this.wb=this.Ca=this.Ma=this.Fb=this.$e=null;this.Sb=!1;this.Wd={};this.Wg=0;this.rf=!0;this.Oc=this.Ke=null;Th(this,0);kf.yb().Ib("visible",this.Ng,this);-1===a.host.indexOf("fblocal")&&jf.yb().Ib("online",this.Lg,this)}var Sh=0,Uh=0;h=Rh.prototype;
h.Ia=function(a,b,c){var d=++this.Wg;a={r:d,a:a,b:b};this.f(G(a));O(this.qa,"sendRequest call when we're not connected not allowed.");this.Ma.Ia(a);c&&(this.Wd[d]=c)};h.Cf=function(a,b,c,d){var e=a.wa(),f=a.path.toString();this.f("Listen called for "+f+" "+e);this.ba[f]=this.ba[f]||{};O(Ie(a.n)||!He(a.n),"listen() called for non-default but complete query");O(!this.ba[f][e],"listen() called twice for same path/queryId.");a={I:d,Ad:b,Tg:a,tag:c};this.ba[f][e]=a;this.qa&&Vh(this,a)};
function Vh(a,b){var c=b.Tg,d=c.path.toString(),e=c.wa();a.f("Listen on "+d+" for "+e);var f={p:d};b.tag&&(f.q=Ge(c.n),f.t=b.tag);f.h=b.Ad();a.Ia("q",f,function(f){var k=f.d,m=f.s;if(k&&"object"===typeof k&&y(k,"w")){var l=z(k,"w");da(l)&&0<=La(l,"no_index")&&S("Using an unspecified index. Consider adding "+('".indexOn": "'+c.n.g.toString()+'"')+" at "+c.path.toString()+" to your security rules for better performance")}(a.ba[d]&&a.ba[d][e])===b&&(a.f("listen response",f),"ok"!==m&&Wh(a,d,e),b.I&&
b.I(m,k))})}h.O=function(a,b,c){this.Ca={rg:a,sf:!1,Dc:b,od:c};this.f("Authenticating using credential: "+a);Xh(this);(b=40==a.length)||(a=Cd(a).Ec,b="object"===typeof a&&!0===z(a,"admin"));b&&(this.f("Admin auth credential detected.  Reducing max reconnect time."),this.Id=3E4)};h.je=function(a){this.Ca=null;this.qa&&this.Ia("unauth",{},function(b){a(b.s,b.d)})};
function Xh(a){var b=a.Ca;a.qa&&b&&a.Ia("auth",{cred:b.rg},function(c){var d=c.s;c=c.d||"error";"ok"!==d&&a.Ca===b&&(a.Ca=null);b.sf?"ok"!==d&&b.od&&b.od(d,c):(b.sf=!0,b.Dc&&b.Dc(d,c))})}h.$f=function(a,b){var c=a.path.toString(),d=a.wa();this.f("Unlisten called for "+c+" "+d);O(Ie(a.n)||!He(a.n),"unlisten() called for non-default but complete query");if(Wh(this,c,d)&&this.qa){var e=Ge(a.n);this.f("Unlisten on "+c+" for "+d);c={p:c};b&&(c.q=e,c.t=b);this.Ia("n",c)}};
h.Qe=function(a,b,c){this.qa?Yh(this,"o",a,b,c):this.Yc.push({bd:a,action:"o",data:b,I:c})};h.Gf=function(a,b,c){this.qa?Yh(this,"om",a,b,c):this.Yc.push({bd:a,action:"om",data:b,I:c})};h.Md=function(a,b){this.qa?Yh(this,"oc",a,null,b):this.Yc.push({bd:a,action:"oc",data:null,I:b})};function Yh(a,b,c,d,e){c={p:c,d:d};a.f("onDisconnect "+b,c);a.Ia(b,c,function(a){e&&setTimeout(function(){e(a.s,a.d)},Math.floor(0))})}h.put=function(a,b,c,d){Zh(this,"p",a,b,c,d)};
h.Df=function(a,b,c,d){Zh(this,"m",a,b,c,d)};function Zh(a,b,c,d,e,f){d={p:c,d:d};p(f)&&(d.h=f);a.sa.push({action:b,Pf:d,I:e});a.ad++;b=a.sa.length-1;a.qa?$h(a,b):a.f("Buffering put: "+c)}function $h(a,b){var c=a.sa[b].action,d=a.sa[b].Pf,e=a.sa[b].I;a.sa[b].Ug=a.qa;a.Ia(c,d,function(d){a.f(c+" response",d);delete a.sa[b];a.ad--;0===a.ad&&(a.sa=[]);e&&e(d.s,d.d)})}
h.Ye=function(a){this.qa&&(a={c:a},this.f("reportStats",a),this.Ia("s",a,function(a){"ok"!==a.s&&this.f("reportStats","Error sending stats: "+a.d)}))};
h.Ld=function(a){if("r"in a){this.f("from server: "+G(a));var b=a.r,c=this.Wd[b];c&&(delete this.Wd[b],c(a.b))}else{if("error"in a)throw"A server-side error has occurred: "+a.error;"a"in a&&(b=a.a,c=a.b,this.f("handleServerMessage",b,c),"d"===b?this.Kb(c.p,c.d,!1,c.t):"m"===b?this.Kb(c.p,c.d,!0,c.t):"c"===b?ai(this,c.p,c.q):"ac"===b?(a=c.s,b=c.d,c=this.Ca,this.Ca=null,c&&c.od&&c.od(a,b)):"sd"===b?this.$e?this.$e(c):"msg"in c&&"undefined"!==typeof console&&console.log("FIREBASE: "+c.msg.replace("\n",
"\nFIREBASE: ")):qd("Unrecognized action received from server: "+G(b)+"\nAre you using the latest client?"))}};h.Zc=function(a,b){this.f("connection ready");this.qa=!0;this.Oc=(new Date).getTime();this.Se({serverTimeOffset:a-(new Date).getTime()});this.Fb=b;if(this.rf){var c={};c["sdk.js."+Eb.replace(/\./g,"-")]=1;Dg()?c["framework.cordova"]=1:"object"===typeof navigator&&"ReactNative"===navigator.product&&(c["framework.reactnative"]=1);this.Ye(c)}bi(this);this.rf=!1;this.Xc(!0)};
function Th(a,b){O(!a.Ma,"Scheduling a connect when we're already connected/ing?");a.wb&&clearTimeout(a.wb);a.wb=setTimeout(function(){a.wb=null;ci(a)},Math.floor(b))}h.Ng=function(a){a&&!this.Sb&&this.eb===this.Id&&(this.f("Window became visible.  Reducing delay."),this.eb=1E3,this.Ma||Th(this,0));this.Sb=a};h.Lg=function(a){a?(this.f("Browser went online."),this.eb=1E3,this.Ma||Th(this,0)):(this.f("Browser went offline.  Killing connection."),this.Ma&&this.Ma.close())};
h.If=function(){this.f("data client disconnected");this.qa=!1;this.Ma=null;for(var a=0;a<this.sa.length;a++){var b=this.sa[a];b&&"h"in b.Pf&&b.Ug&&(b.I&&b.I("disconnect"),delete this.sa[a],this.ad--)}0===this.ad&&(this.sa=[]);this.Wd={};di(this)&&(this.Sb?this.Oc&&(3E4<(new Date).getTime()-this.Oc&&(this.eb=1E3),this.Oc=null):(this.f("Window isn't visible.  Delaying reconnect."),this.eb=this.Id,this.Ke=(new Date).getTime()),a=Math.max(0,this.eb-((new Date).getTime()-this.Ke)),a*=Math.random(),this.f("Trying to reconnect in "+
a+"ms"),Th(this,a),this.eb=Math.min(this.Id,1.3*this.eb));this.Xc(!1)};function ci(a){if(di(a)){a.f("Making a connection attempt");a.Ke=(new Date).getTime();a.Oc=null;var b=u(a.Ld,a),c=u(a.Zc,a),d=u(a.If,a),e=a.id+":"+Uh++;a.Ma=new Fh(e,a.G,b,c,d,function(b){S(b+" ("+a.G.toString()+")");a.Bf=!0},a.Fb)}}h.Cb=function(){this.Ie=!0;this.Ma?this.Ma.close():(this.wb&&(clearTimeout(this.wb),this.wb=null),this.qa&&this.If())};h.vc=function(){this.Ie=!1;this.eb=1E3;this.Ma||Th(this,0)};
function ai(a,b,c){c=c?Oa(c,function(a){return xd(a)}).join("$"):"default";(a=Wh(a,b,c))&&a.I&&a.I("permission_denied")}function Wh(a,b,c){b=(new P(b)).toString();var d;p(a.ba[b])?(d=a.ba[b][c],delete a.ba[b][c],0===oa(a.ba[b])&&delete a.ba[b]):d=void 0;return d}function bi(a){Xh(a);v(a.ba,function(b){v(b,function(b){Vh(a,b)})});for(var b=0;b<a.sa.length;b++)a.sa[b]&&$h(a,b);for(;a.Yc.length;)b=a.Yc.shift(),Yh(a,b.action,b.bd,b.data,b.I)}function di(a){var b;b=jf.yb().oc;return!a.Bf&&!a.Ie&&b};var U={zg:function(){oh=xh=!0}};U.forceLongPolling=U.zg;U.Ag=function(){ph=!0};U.forceWebSockets=U.Ag;U.$g=function(a,b){a.k.Va.$e=b};U.setSecurityDebugCallback=U.$g;U.bf=function(a,b){a.k.bf(b)};U.stats=U.bf;U.cf=function(a,b){a.k.cf(b)};U.statsIncrementCounter=U.cf;U.ud=function(a){return a.k.ud};U.dataUpdateCount=U.ud;U.Dg=function(a,b){a.k.He=b};U.interceptServerData=U.Dg;U.Jg=function(a){new Og(a)};U.onPopupOpen=U.Jg;U.Yg=function(a){xg=a};U.setAuthenticationServer=U.Yg;function ei(a,b){this.committed=a;this.snapshot=b};function V(a,b){this.dd=a;this.ta=b}V.prototype.cancel=function(a){D("Firebase.onDisconnect().cancel",0,1,arguments.length);F("Firebase.onDisconnect().cancel",1,a,!0);var b=new B;this.dd.Md(this.ta,C(b,a));return b.D};V.prototype.cancel=V.prototype.cancel;V.prototype.remove=function(a){D("Firebase.onDisconnect().remove",0,1,arguments.length);og("Firebase.onDisconnect().remove",this.ta);F("Firebase.onDisconnect().remove",1,a,!0);var b=new B;fi(this.dd,this.ta,null,C(b,a));return b.D};
V.prototype.remove=V.prototype.remove;V.prototype.set=function(a,b){D("Firebase.onDisconnect().set",1,2,arguments.length);og("Firebase.onDisconnect().set",this.ta);gg("Firebase.onDisconnect().set",a,this.ta,!1);F("Firebase.onDisconnect().set",2,b,!0);var c=new B;fi(this.dd,this.ta,a,C(c,b));return c.D};V.prototype.set=V.prototype.set;
V.prototype.Ob=function(a,b,c){D("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);og("Firebase.onDisconnect().setWithPriority",this.ta);gg("Firebase.onDisconnect().setWithPriority",a,this.ta,!1);kg("Firebase.onDisconnect().setWithPriority",2,b);F("Firebase.onDisconnect().setWithPriority",3,c,!0);var d=new B;gi(this.dd,this.ta,a,b,C(d,c));return d.D};V.prototype.setWithPriority=V.prototype.Ob;
V.prototype.update=function(a,b){D("Firebase.onDisconnect().update",1,2,arguments.length);og("Firebase.onDisconnect().update",this.ta);if(da(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;S("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}jg("Firebase.onDisconnect().update",a,this.ta);F("Firebase.onDisconnect().update",2,b,!0);
c=new B;hi(this.dd,this.ta,a,C(c,b));return c.D};V.prototype.update=V.prototype.update;function W(a,b,c){this.A=a;this.Y=b;this.g=c}W.prototype.J=function(){D("Firebase.DataSnapshot.val",0,0,arguments.length);return this.A.J()};W.prototype.val=W.prototype.J;W.prototype.qf=function(){D("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.A.J(!0)};W.prototype.exportVal=W.prototype.qf;W.prototype.xg=function(){D("Firebase.DataSnapshot.exists",0,0,arguments.length);return!this.A.e()};W.prototype.exists=W.prototype.xg;
W.prototype.o=function(a){D("Firebase.DataSnapshot.child",0,1,arguments.length);fa(a)&&(a=String(a));ng("Firebase.DataSnapshot.child",a);var b=new P(a),c=this.Y.o(b);return new W(this.A.S(b),c,R)};W.prototype.child=W.prototype.o;W.prototype.Fa=function(a){D("Firebase.DataSnapshot.hasChild",1,1,arguments.length);ng("Firebase.DataSnapshot.hasChild",a);var b=new P(a);return!this.A.S(b).e()};W.prototype.hasChild=W.prototype.Fa;
W.prototype.C=function(){D("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.A.C().J()};W.prototype.getPriority=W.prototype.C;W.prototype.forEach=function(a){D("Firebase.DataSnapshot.forEach",1,1,arguments.length);F("Firebase.DataSnapshot.forEach",1,a,!1);if(this.A.L())return!1;var b=this;return!!this.A.R(this.g,function(c,d){return a(new W(d,b.Y.o(c),R))})};W.prototype.forEach=W.prototype.forEach;
W.prototype.zd=function(){D("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.A.L()?!1:!this.A.e()};W.prototype.hasChildren=W.prototype.zd;W.prototype.name=function(){S("Firebase.DataSnapshot.name() being deprecated. Please use Firebase.DataSnapshot.key() instead.");D("Firebase.DataSnapshot.name",0,0,arguments.length);return this.key()};W.prototype.name=W.prototype.name;W.prototype.key=function(){D("Firebase.DataSnapshot.key",0,0,arguments.length);return this.Y.key()};
W.prototype.key=W.prototype.key;W.prototype.Hb=function(){D("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.A.Hb()};W.prototype.numChildren=W.prototype.Hb;W.prototype.Mb=function(){D("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.Y};W.prototype.ref=W.prototype.Mb;function ii(a,b,c){this.Vb=a;this.tb=b;this.vb=c||null}h=ii.prototype;h.Qf=function(a){return"value"===a};h.createEvent=function(a,b){var c=b.n.g;return new jc("value",this,new W(a.Na,b.Mb(),c))};h.Zb=function(a){var b=this.vb;if("cancel"===a.De()){O(this.tb,"Raising a cancel event on a listener with no cancel callback");var c=this.tb;return function(){c.call(b,a.error)}}var d=this.Vb;return function(){d.call(b,a.be)}};h.lf=function(a,b){return this.tb?new kc(this,a,b):null};
h.matches=function(a){return a instanceof ii?a.Vb&&this.Vb?a.Vb===this.Vb&&a.vb===this.vb:!0:!1};h.yf=function(){return null!==this.Vb};function ji(a,b,c){this.ja=a;this.tb=b;this.vb=c}h=ji.prototype;h.Qf=function(a){a="children_added"===a?"child_added":a;return("children_removed"===a?"child_removed":a)in this.ja};h.lf=function(a,b){return this.tb?new kc(this,a,b):null};
h.createEvent=function(a,b){O(null!=a.Za,"Child events should have a childName.");var c=b.Mb().o(a.Za);return new jc(a.type,this,new W(a.Na,c,b.n.g),a.Td)};h.Zb=function(a){var b=this.vb;if("cancel"===a.De()){O(this.tb,"Raising a cancel event on a listener with no cancel callback");var c=this.tb;return function(){c.call(b,a.error)}}var d=this.ja[a.wd];return function(){d.call(b,a.be,a.Td)}};
h.matches=function(a){if(a instanceof ji){if(!this.ja||!a.ja)return!0;if(this.vb===a.vb){var b=oa(a.ja);if(b===oa(this.ja)){if(1===b){var b=pa(a.ja),c=pa(this.ja);return c===b&&(!a.ja[b]||!this.ja[c]||a.ja[b]===this.ja[c])}return na(this.ja,function(b,c){return a.ja[c]===b})}}}return!1};h.yf=function(){return null!==this.ja};function ki(){this.za={}}h=ki.prototype;h.e=function(){return va(this.za)};h.gb=function(a,b,c){var d=a.source.Lb;if(null!==d)return d=z(this.za,d),O(null!=d,"SyncTree gave us an op for an invalid query."),d.gb(a,b,c);var e=[];v(this.za,function(d){e=e.concat(d.gb(a,b,c))});return e};h.Tb=function(a,b,c,d,e){var f=a.wa(),g=z(this.za,f);if(!g){var g=c.Aa(e?d:null),k=!1;g?k=!0:(g=d instanceof fe?c.Cc(d):H,k=!1);g=new Ye(a,new je(new Xb(g,k,!1),new Xb(d,e,!1)));this.za[f]=g}g.Tb(b);return af(g,b)};
h.nb=function(a,b,c){var d=a.wa(),e=[],f=[],g=null!=li(this);if("default"===d){var k=this;v(this.za,function(a,d){f=f.concat(a.nb(b,c));a.e()&&(delete k.za[d],He(a.Y.n)||e.push(a.Y))})}else{var m=z(this.za,d);m&&(f=f.concat(m.nb(b,c)),m.e()&&(delete this.za[d],He(m.Y.n)||e.push(m.Y)))}g&&null==li(this)&&e.push(new X(a.k,a.path));return{Vg:e,vg:f}};function mi(a){return Na(qa(a.za),function(a){return!He(a.Y.n)})}h.kb=function(a){var b=null;v(this.za,function(c){b=b||c.kb(a)});return b};
function ni(a,b){if(He(b.n))return li(a);var c=b.wa();return z(a.za,c)}function li(a){return ua(a.za,function(a){return He(a.Y.n)})||null};function oi(a){this.va=qe;this.mb=new Pf;this.df={};this.qc={};this.Qc=a}function pi(a,b,c,d,e){var f=a.mb,g=e;O(d>f.Pc,"Stacking an older write on top of newer ones");p(g)||(g=!0);f.pa.push({path:b,Ja:c,md:d,visible:g});g&&(f.V=Jf(f.V,b,c));f.Pc=d;return e?qi(a,new Ac(Ef,b,c)):[]}function ri(a,b,c,d){var e=a.mb;O(d>e.Pc,"Stacking an older merge on top of newer ones");e.pa.push({path:b,children:c,md:d,visible:!0});e.V=Kf(e.V,b,c);e.Pc=d;c=sf(c);return qi(a,new bf(Ef,b,c))}
function si(a,b,c){c=c||!1;var d=Qf(a.mb,b);if(a.mb.Ud(b)){var e=qe;null!=d.Ja?e=e.set(M,!0):Fb(d.children,function(a,b){e=e.set(new P(a),b)});return qi(a,new Df(d.path,e,c))}return[]}function ti(a,b,c){c=sf(c);return qi(a,new bf(Gf,b,c))}function ui(a,b,c,d){d=vi(a,d);if(null!=d){var e=wi(d);d=e.path;e=e.Lb;b=lf(d,b);c=new Ac(new Ff(!1,!0,e,!0),b,c);return xi(a,d,c)}return[]}
function yi(a,b,c,d){if(d=vi(a,d)){var e=wi(d);d=e.path;e=e.Lb;b=lf(d,b);c=sf(c);c=new bf(new Ff(!1,!0,e,!0),b,c);return xi(a,d,c)}return[]}
oi.prototype.Tb=function(a,b){var c=a.path,d=null,e=!1;zf(this.va,c,function(a,b){var f=lf(a,c);d=d||b.kb(f);e=e||null!=li(b)});var f=this.va.get(c);f?(e=e||null!=li(f),d=d||f.kb(M)):(f=new ki,this.va=this.va.set(c,f));var g;null!=d?g=!0:(g=!1,d=H,Cf(this.va.subtree(c),function(a,b){var c=b.kb(M);c&&(d=d.W(a,c))}));var k=null!=ni(f,a);if(!k&&!He(a.n)){var m=zi(a);O(!(m in this.qc),"View does not exist, but we have a tag");var l=Ai++;this.qc[m]=l;this.df["_"+l]=m}g=f.Tb(a,b,new Uf(c,this.mb),d,g);
k||e||(f=ni(f,a),g=g.concat(Bi(this,a,f)));return g};
oi.prototype.nb=function(a,b,c){var d=a.path,e=this.va.get(d),f=[];if(e&&("default"===a.wa()||null!=ni(e,a))){f=e.nb(a,b,c);e.e()&&(this.va=this.va.remove(d));e=f.Vg;f=f.vg;b=-1!==Sa(e,function(a){return He(a.n)});var g=xf(this.va,d,function(a,b){return null!=li(b)});if(b&&!g&&(d=this.va.subtree(d),!d.e()))for(var d=Ci(d),k=0;k<d.length;++k){var m=d[k],l=m.Y,m=Di(this,m);this.Qc.af(Ei(l),Fi(this,l),m.Ad,m.I)}if(!g&&0<e.length&&!c)if(b)this.Qc.de(Ei(a),null);else{var t=this;Ma(e,function(a){a.wa();
var b=t.qc[zi(a)];t.Qc.de(Ei(a),b)})}Gi(this,e)}return f};oi.prototype.Aa=function(a,b){var c=this.mb,d=xf(this.va,a,function(b,c){var d=lf(b,a);if(d=c.kb(d))return d});return c.Aa(a,d,b,!0)};function Ci(a){return vf(a,function(a,c,d){if(c&&null!=li(c))return[li(c)];var e=[];c&&(e=mi(c));v(d,function(a){e=e.concat(a)});return e})}function Gi(a,b){for(var c=0;c<b.length;++c){var d=b[c];if(!He(d.n)){var d=zi(d),e=a.qc[d];delete a.qc[d];delete a.df["_"+e]}}}
function Ei(a){return He(a.n)&&!Ie(a.n)?a.Mb():a}function Bi(a,b,c){var d=b.path,e=Fi(a,b);c=Di(a,c);b=a.Qc.af(Ei(b),e,c.Ad,c.I);d=a.va.subtree(d);if(e)O(null==li(d.value),"If we're adding a query, it shouldn't be shadowed");else for(e=vf(d,function(a,b,c){if(!a.e()&&b&&null!=li(b))return[Ze(li(b))];var d=[];b&&(d=d.concat(Oa(mi(b),function(a){return a.Y})));v(c,function(a){d=d.concat(a)});return d}),d=0;d<e.length;++d)c=e[d],a.Qc.de(Ei(c),Fi(a,c));return b}
function Di(a,b){var c=b.Y,d=Fi(a,c);return{Ad:function(){return(b.w()||H).hash()},I:function(b){if("ok"===b){if(d){var f=c.path;if(b=vi(a,d)){var g=wi(b);b=g.path;g=g.Lb;f=lf(b,f);f=new Cc(new Ff(!1,!0,g,!0),f);b=xi(a,b,f)}else b=[]}else b=qi(a,new Cc(Gf,c.path));return b}f="Unknown Error";"too_big"===b?f="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"==b?f="Client doesn't have permission to access the desired data.":"unavailable"==b&&
(f="The service is unavailable");f=Error(b+" at "+c.path.toString()+": "+f);f.code=b.toUpperCase();return a.nb(c,null,f)}}}function zi(a){return a.path.toString()+"$"+a.wa()}function wi(a){var b=a.indexOf("$");O(-1!==b&&b<a.length-1,"Bad queryKey.");return{Lb:a.substr(b+1),path:new P(a.substr(0,b))}}function vi(a,b){var c=a.df,d="_"+b;return d in c?c[d]:void 0}function Fi(a,b){var c=zi(b);return z(a.qc,c)}var Ai=1;
function xi(a,b,c){var d=a.va.get(b);O(d,"Missing sync point for query tag that we're tracking");return d.gb(c,new Uf(b,a.mb),null)}function qi(a,b){return Hi(a,b,a.va,null,new Uf(M,a.mb))}function Hi(a,b,c,d,e){if(b.path.e())return Ii(a,b,c,d,e);var f=c.get(M);null==d&&null!=f&&(d=f.kb(M));var g=[],k=K(b.path),m=b.$c(k);if((c=c.children.get(k))&&m)var l=d?d.T(k):null,k=e.o(k),g=g.concat(Hi(a,m,c,l,k));f&&(g=g.concat(f.gb(b,e,d)));return g}
function Ii(a,b,c,d,e){var f=c.get(M);null==d&&null!=f&&(d=f.kb(M));var g=[];c.children.ka(function(c,f){var l=d?d.T(c):null,t=e.o(c),A=b.$c(c);A&&(g=g.concat(Ii(a,A,f,l,t)))});f&&(g=g.concat(f.gb(b,e,d)));return g};function Ji(a,b){this.G=a;this.Xa=uc(a);this.hd=null;this.fa=new Zb;this.Kd=1;this.Va=null;b||0<=("object"===typeof window&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)?(this.da=new cf(this.G,u(this.Kb,this)),setTimeout(u(this.Xc,this,!0),0)):this.da=this.Va=new Rh(this.G,u(this.Kb,this),u(this.Xc,this),u(this.Se,this));this.dh=vc(a,u(function(){return new pc(this.Xa,this.da)},this));this.yc=new Wf;
this.Ge=new Sb;var c=this;this.Fd=new oi({af:function(a,b,f,g){b=[];f=c.Ge.j(a.path);f.e()||(b=qi(c.Fd,new Ac(Gf,a.path,f)),setTimeout(function(){g("ok")},0));return b},de:aa});Ki(this,"connected",!1);this.na=new Vc;this.O=new Yg(a,u(this.da.O,this.da),u(this.da.je,this.da),u(this.Pe,this));this.ud=0;this.He=null;this.M=new oi({af:function(a,b,f,g){c.da.Cf(a,f,b,function(b,e){var f=g(b,e);dc(c.fa,a.path,f)});return[]},de:function(a,b){c.da.$f(a,b)}})}h=Ji.prototype;
h.toString=function(){return(this.G.ob?"https://":"http://")+this.G.host};h.name=function(){return this.G.lc};function Li(a){a=a.Ge.j(new P(".info/serverTimeOffset")).J()||0;return(new Date).getTime()+a}function Mi(a){a=a={timestamp:Li(a)};a.timestamp=a.timestamp||(new Date).getTime();return a}
h.Kb=function(a,b,c,d){this.ud++;var e=new P(a);b=this.He?this.He(a,b):b;a=[];d?c?(b=ma(b,function(a){return Q(a)}),a=yi(this.M,e,b,d)):(b=Q(b),a=ui(this.M,e,b,d)):c?(d=ma(b,function(a){return Q(a)}),a=ti(this.M,e,d)):(d=Q(b),a=qi(this.M,new Ac(Gf,e,d)));d=e;0<a.length&&(d=Ni(this,e));dc(this.fa,d,a)};h.Xc=function(a){Ki(this,"connected",a);!1===a&&Oi(this)};h.Se=function(a){var b=this;zd(a,function(a,d){Ki(b,d,a)})};h.Pe=function(a){Ki(this,"authenticated",a)};
function Ki(a,b,c){b=new P("/.info/"+b);c=Q(c);var d=a.Ge;d.Zd=d.Zd.H(b,c);c=qi(a.Fd,new Ac(Gf,b,c));dc(a.fa,b,c)}h.Ob=function(a,b,c,d){this.f("set",{path:a.toString(),value:b,mh:c});var e=Mi(this);b=Q(b,c);var e=Xc(b,e),f=this.Kd++,e=pi(this.M,a,e,f,!0);$b(this.fa,e);var g=this;this.da.put(a.toString(),b.J(!0),function(b,c){var e="ok"===b;e||S("set at "+a+" failed: "+b);e=si(g.M,f,!e);dc(g.fa,a,e);Pi(d,b,c)});e=Qi(this,a);Ni(this,e);dc(this.fa,e,[])};
h.update=function(a,b,c){this.f("update",{path:a.toString(),value:b});var d=!0,e=Mi(this),f={};v(b,function(a,b){d=!1;var c=Q(a);f[b]=Xc(c,e)});if(d)fc("update() called with empty data.  Don't do anything."),Pi(c,"ok");else{var g=this.Kd++,k=ri(this.M,a,f,g);$b(this.fa,k);var m=this;this.da.Df(a.toString(),b,function(b,d){var e="ok"===b;e||S("update at "+a+" failed: "+b);var e=si(m.M,g,!e),f=a;0<e.length&&(f=Ni(m,a));dc(m.fa,f,e);Pi(c,b,d)});b=Qi(this,a);Ni(this,b);dc(this.fa,a,[])}};
function Oi(a){a.f("onDisconnectEvents");var b=Mi(a),c=[];Wc(Uc(a.na,b),M,function(b,e){c=c.concat(qi(a.M,new Ac(Gf,b,e)));var f=Qi(a,b);Ni(a,f)});a.na=new Vc;dc(a.fa,M,c)}h.Md=function(a,b){var c=this;this.da.Md(a.toString(),function(d,e){"ok"===d&&wg(c.na,a);Pi(b,d,e)})};function fi(a,b,c,d){var e=Q(c);a.da.Qe(b.toString(),e.J(!0),function(c,g){"ok"===c&&a.na.rc(b,e);Pi(d,c,g)})}function gi(a,b,c,d,e){var f=Q(c,d);a.da.Qe(b.toString(),f.J(!0),function(c,d){"ok"===c&&a.na.rc(b,f);Pi(e,c,d)})}
function hi(a,b,c,d){var e=!0,f;for(f in c)e=!1;e?(fc("onDisconnect().update() called with empty data.  Don't do anything."),Pi(d,"ok")):a.da.Gf(b.toString(),c,function(e,f){if("ok"===e)for(var m in c){var l=Q(c[m]);a.na.rc(b.o(m),l)}Pi(d,e,f)})}function Ri(a,b,c){c=".info"===K(b.path)?a.Fd.Tb(b,c):a.M.Tb(b,c);bc(a.fa,b.path,c)}h.Cb=function(){this.Va&&this.Va.Cb()};h.vc=function(){this.Va&&this.Va.vc()};
h.bf=function(a){if("undefined"!==typeof console){a?(this.hd||(this.hd=new oc(this.Xa)),a=this.hd.get()):a=this.Xa.get();var b=Pa(ra(a),function(a,b){return Math.max(b.length,a)},0),c;for(c in a){for(var d=a[c],e=c.length;e<b+2;e++)c+=" ";console.log(c+d)}}};h.cf=function(a){rc(this.Xa,a);this.dh.Vf[a]=!0};h.f=function(a){var b="";this.Va&&(b=this.Va.id+":");fc(b,arguments)};
function Pi(a,b,c){a&&gc(function(){if("ok"==b)a(null);else{var d=(b||"error").toUpperCase(),e=d;c&&(e+=": "+c);e=Error(e);e.code=d;a(e)}})};function Si(a,b,c,d,e){function f(){}a.f("transaction on "+b);var g=new X(a,b);g.Ib("value",f);c={path:b,update:c,I:d,status:null,Lf:id(),gf:e,Sf:0,le:function(){g.mc("value",f)},ne:null,Da:null,rd:null,sd:null,td:null};d=a.M.Aa(b,void 0)||H;c.rd=d;d=c.update(d.J());if(p(d)){hg("transaction failed: Data returned ",d,c.path);c.status=1;e=Xf(a.yc,b);var k=e.Ea()||[];k.push(c);Yf(e,k);"object"===typeof d&&null!==d&&y(d,".priority")?(k=z(d,".priority"),O(fg(k),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):
k=(a.M.Aa(b)||H).C().J();e=Mi(a);d=Q(d,k);e=Xc(d,e);c.sd=d;c.td=e;c.Da=a.Kd++;c=pi(a.M,b,e,c.Da,c.gf);dc(a.fa,b,c);Ti(a)}else c.le(),c.sd=null,c.td=null,c.I&&(a=new W(c.rd,new X(a,c.path),R),c.I(null,!1,a))}function Ti(a,b){var c=b||a.yc;b||Ui(a,c);if(null!==c.Ea()){var d=Vi(a,c);O(0<d.length,"Sending zero length transaction queue");Qa(d,function(a){return 1===a.status})&&Wi(a,c.path(),d)}else c.zd()&&c.R(function(b){Ti(a,b)})}
function Wi(a,b,c){for(var d=Oa(c,function(a){return a.Da}),e=a.M.Aa(b,d)||H,d=e,e=e.hash(),f=0;f<c.length;f++){var g=c[f];O(1===g.status,"tryToSendTransactionQueue_: items in queue should all be run.");g.status=2;g.Sf++;var k=lf(b,g.path),d=d.H(k,g.sd)}d=d.J(!0);a.da.put(b.toString(),d,function(d){a.f("transaction put response",{path:b.toString(),status:d});var e=[];if("ok"===d){d=[];for(f=0;f<c.length;f++){c[f].status=3;e=e.concat(si(a.M,c[f].Da));if(c[f].I){var g=c[f].td,k=new X(a,c[f].path);d.push(u(c[f].I,
null,null,!0,new W(g,k,R)))}c[f].le()}Ui(a,Xf(a.yc,b));Ti(a);dc(a.fa,b,e);for(f=0;f<d.length;f++)gc(d[f])}else{if("datastale"===d)for(f=0;f<c.length;f++)c[f].status=4===c[f].status?5:1;else for(S("transaction at "+b.toString()+" failed: "+d),f=0;f<c.length;f++)c[f].status=5,c[f].ne=d;Ni(a,b)}},e)}function Ni(a,b){var c=Xi(a,b),d=c.path(),c=Vi(a,c);Yi(a,c,d);return d}
function Yi(a,b,c){if(0!==b.length){for(var d=[],e=[],f=Oa(b,function(a){return a.Da}),g=0;g<b.length;g++){var k=b[g],m=lf(c,k.path),l=!1,t;O(null!==m,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===k.status)l=!0,t=k.ne,e=e.concat(si(a.M,k.Da,!0));else if(1===k.status)if(25<=k.Sf)l=!0,t="maxretry",e=e.concat(si(a.M,k.Da,!0));else{var A=a.M.Aa(k.path,f)||H;k.rd=A;var I=b[g].update(A.J());p(I)?(hg("transaction failed: Data returned ",I,k.path),m=Q(I),"object"===typeof I&&null!=
I&&y(I,".priority")||(m=m.ia(A.C())),A=k.Da,I=Mi(a),I=Xc(m,I),k.sd=m,k.td=I,k.Da=a.Kd++,Ta(f,A),e=e.concat(pi(a.M,k.path,I,k.Da,k.gf)),e=e.concat(si(a.M,A,!0))):(l=!0,t="nodata",e=e.concat(si(a.M,k.Da,!0)))}dc(a.fa,c,e);e=[];l&&(b[g].status=3,setTimeout(b[g].le,Math.floor(0)),b[g].I&&("nodata"===t?(k=new X(a,b[g].path),d.push(u(b[g].I,null,null,!1,new W(b[g].rd,k,R)))):d.push(u(b[g].I,null,Error(t),!1,null))))}Ui(a,a.yc);for(g=0;g<d.length;g++)gc(d[g]);Ti(a)}}
function Xi(a,b){for(var c,d=a.yc;null!==(c=K(b))&&null===d.Ea();)d=Xf(d,c),b=N(b);return d}function Vi(a,b){var c=[];Zi(a,b,c);c.sort(function(a,b){return a.Lf-b.Lf});return c}function Zi(a,b,c){var d=b.Ea();if(null!==d)for(var e=0;e<d.length;e++)c.push(d[e]);b.R(function(b){Zi(a,b,c)})}function Ui(a,b){var c=b.Ea();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;Yf(b,0<c.length?c:null)}b.R(function(b){Ui(a,b)})}
function Qi(a,b){var c=Xi(a,b).path(),d=Xf(a.yc,b);ag(d,function(b){$i(a,b)});$i(a,d);$f(d,function(b){$i(a,b)});return c}
function $i(a,b){var c=b.Ea();if(null!==c){for(var d=[],e=[],f=-1,g=0;g<c.length;g++)4!==c[g].status&&(2===c[g].status?(O(f===g-1,"All SENT items should be at beginning of queue."),f=g,c[g].status=4,c[g].ne="set"):(O(1===c[g].status,"Unexpected transaction status in abort"),c[g].le(),e=e.concat(si(a.M,c[g].Da,!0)),c[g].I&&d.push(u(c[g].I,null,Error("set"),!1,null))));-1===f?Yf(b,null):c.length=f+1;dc(a.fa,b.path(),e);for(g=0;g<d.length;g++)gc(d[g])}};function aj(){this.sc={};this.ag=!1}aj.prototype.Cb=function(){for(var a in this.sc)this.sc[a].Cb()};aj.prototype.vc=function(){for(var a in this.sc)this.sc[a].vc()};aj.prototype.ze=function(){this.ag=!0};ba(aj);aj.prototype.interrupt=aj.prototype.Cb;aj.prototype.resume=aj.prototype.vc;function Y(a,b,c,d){this.k=a;this.path=b;this.n=c;this.pc=d}
function bj(a){var b=null,c=null;a.oa&&(b=Od(a));a.ra&&(c=Rd(a));if(a.g===re){if(a.oa){if("[MIN_NAME]"!=Nd(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==typeof b)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}if(a.ra){if("[MAX_NAME]"!=Pd(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==
typeof c)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}}else if(a.g===R){if(null!=b&&!fg(b)||null!=c&&!fg(c))throw Error("Query: When ordering by priority, the first argument passed to startAt(), endAt(), or equalTo() must be a valid priority value (null, a number, or a string).");}else if(O(a.g instanceof ve||a.g===Be,"unknown index type."),null!=b&&"object"===typeof b||null!=c&&"object"===typeof c)throw Error("Query: First argument passed to startAt(), endAt(), or equalTo() cannot be an object.");
}function cj(a){if(a.oa&&a.ra&&a.la&&(!a.la||""===a.Rb))throw Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.");}function dj(a,b){if(!0===a.pc)throw Error(b+": You can't combine multiple orderBy calls.");}h=Y.prototype;h.Mb=function(){D("Query.ref",0,0,arguments.length);return new X(this.k,this.path)};
h.Ib=function(a,b,c,d){D("Query.on",2,4,arguments.length);lg("Query.on",a,!1);F("Query.on",2,b,!1);var e=ej("Query.on",c,d);if("value"===a)Ri(this.k,this,new ii(b,e.cancel||null,e.Qa||null));else{var f={};f[a]=b;Ri(this.k,this,new ji(f,e.cancel,e.Qa))}return b};
h.mc=function(a,b,c){D("Query.off",0,3,arguments.length);lg("Query.off",a,!0);F("Query.off",2,b,!0);Qb("Query.off",3,c);var d=null,e=null;"value"===a?d=new ii(b||null,null,c||null):a&&(b&&(e={},e[a]=b),d=new ji(e,null,c||null));e=this.k;d=".info"===K(this.path)?e.Fd.nb(this,d):e.M.nb(this,d);bc(e.fa,this.path,d)};
h.Og=function(a,b){function c(k){f&&(f=!1,e.mc(a,c),b&&b.call(d.Qa,k),g.resolve(k))}D("Query.once",1,4,arguments.length);lg("Query.once",a,!1);F("Query.once",2,b,!0);var d=ej("Query.once",arguments[2],arguments[3]),e=this,f=!0,g=new B;Nb(g.D);this.Ib(a,c,function(b){e.mc(a,c);d.cancel&&d.cancel.call(d.Qa,b);g.reject(b)});return g.D};
h.Le=function(a){S("Query.limit() being deprecated. Please use Query.limitToFirst() or Query.limitToLast() instead.");D("Query.limit",1,1,arguments.length);if(!fa(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limit: First argument must be a positive integer.");if(this.n.la)throw Error("Query.limit: Limit was already set (by another call to limit, limitToFirst, orlimitToLast.");var b=this.n.Le(a);cj(b);return new Y(this.k,this.path,b,this.pc)};
h.Me=function(a){D("Query.limitToFirst",1,1,arguments.length);if(!fa(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToFirst: First argument must be a positive integer.");if(this.n.la)throw Error("Query.limitToFirst: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new Y(this.k,this.path,this.n.Me(a),this.pc)};
h.Ne=function(a){D("Query.limitToLast",1,1,arguments.length);if(!fa(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToLast: First argument must be a positive integer.");if(this.n.la)throw Error("Query.limitToLast: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new Y(this.k,this.path,this.n.Ne(a),this.pc)};
h.Pg=function(a){D("Query.orderByChild",1,1,arguments.length);if("$key"===a)throw Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');if("$priority"===a)throw Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');if("$value"===a)throw Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');ng("Query.orderByChild",a);dj(this,"Query.orderByChild");var b=new P(a);if(b.e())throw Error("Query.orderByChild: cannot pass in empty path.  Use Query.orderByValue() instead.");
b=new ve(b);b=Fe(this.n,b);bj(b);return new Y(this.k,this.path,b,!0)};h.Qg=function(){D("Query.orderByKey",0,0,arguments.length);dj(this,"Query.orderByKey");var a=Fe(this.n,re);bj(a);return new Y(this.k,this.path,a,!0)};h.Rg=function(){D("Query.orderByPriority",0,0,arguments.length);dj(this,"Query.orderByPriority");var a=Fe(this.n,R);bj(a);return new Y(this.k,this.path,a,!0)};
h.Sg=function(){D("Query.orderByValue",0,0,arguments.length);dj(this,"Query.orderByValue");var a=Fe(this.n,Be);bj(a);return new Y(this.k,this.path,a,!0)};h.ce=function(a,b){D("Query.startAt",0,2,arguments.length);gg("Query.startAt",a,this.path,!0);mg("Query.startAt",b);var c=this.n.ce(a,b);cj(c);bj(c);if(this.n.oa)throw Error("Query.startAt: Starting point was already set (by another call to startAt or equalTo).");p(a)||(b=a=null);return new Y(this.k,this.path,c,this.pc)};
h.vd=function(a,b){D("Query.endAt",0,2,arguments.length);gg("Query.endAt",a,this.path,!0);mg("Query.endAt",b);var c=this.n.vd(a,b);cj(c);bj(c);if(this.n.ra)throw Error("Query.endAt: Ending point was already set (by another call to endAt or equalTo).");return new Y(this.k,this.path,c,this.pc)};
h.tg=function(a,b){D("Query.equalTo",1,2,arguments.length);gg("Query.equalTo",a,this.path,!1);mg("Query.equalTo",b);if(this.n.oa)throw Error("Query.equalTo: Starting point was already set (by another call to endAt or equalTo).");if(this.n.ra)throw Error("Query.equalTo: Ending point was already set (by another call to endAt or equalTo).");return this.ce(a,b).vd(a,b)};
h.toString=function(){D("Query.toString",0,0,arguments.length);for(var a=this.path,b="",c=a.aa;c<a.u.length;c++)""!==a.u[c]&&(b+="/"+encodeURIComponent(String(a.u[c])));return this.k.toString()+(b||"/")};h.wa=function(){var a=xd(Ge(this.n));return"{}"===a?"default":a};
function ej(a,b,c){var d={cancel:null,Qa:null};if(b&&c)d.cancel=b,F(a,3,d.cancel,!0),d.Qa=c,Qb(a,4,d.Qa);else if(b)if("object"===typeof b&&null!==b)d.Qa=b;else if("function"===typeof b)d.cancel=b;else throw Error(E(a,3,!0)+" must either be a cancel callback or a context object.");return d}Y.prototype.ref=Y.prototype.Mb;Y.prototype.on=Y.prototype.Ib;Y.prototype.off=Y.prototype.mc;Y.prototype.once=Y.prototype.Og;Y.prototype.limit=Y.prototype.Le;Y.prototype.limitToFirst=Y.prototype.Me;
Y.prototype.limitToLast=Y.prototype.Ne;Y.prototype.orderByChild=Y.prototype.Pg;Y.prototype.orderByKey=Y.prototype.Qg;Y.prototype.orderByPriority=Y.prototype.Rg;Y.prototype.orderByValue=Y.prototype.Sg;Y.prototype.startAt=Y.prototype.ce;Y.prototype.endAt=Y.prototype.vd;Y.prototype.equalTo=Y.prototype.tg;Y.prototype.toString=Y.prototype.toString;var Z={};Z.zc=Rh;Z.DataConnection=Z.zc;Rh.prototype.bh=function(a,b){this.Ia("q",{p:a},b)};Z.zc.prototype.simpleListen=Z.zc.prototype.bh;Rh.prototype.sg=function(a,b){this.Ia("echo",{d:a},b)};Z.zc.prototype.echo=Z.zc.prototype.sg;Rh.prototype.interrupt=Rh.prototype.Cb;Z.dg=Fh;Z.RealTimeConnection=Z.dg;Fh.prototype.sendRequest=Fh.prototype.Ia;Fh.prototype.close=Fh.prototype.close;
Z.Cg=function(a){var b=Rh.prototype.put;Rh.prototype.put=function(c,d,e,f){p(f)&&(f=a());b.call(this,c,d,e,f)};return function(){Rh.prototype.put=b}};Z.hijackHash=Z.Cg;Z.cg=dd;Z.ConnectionTarget=Z.cg;Z.wa=function(a){return a.wa()};Z.queryIdentifier=Z.wa;Z.Eg=function(a){return a.k.Va.ba};Z.listens=Z.Eg;Z.ze=function(a){a.ze()};Z.forceRestClient=Z.ze;function X(a,b){var c,d,e;if(a instanceof Ji)c=a,d=b;else{D("new Firebase",1,2,arguments.length);d=sd(arguments[0]);c=d.eh;"firebase"===d.domain&&rd(d.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");c&&"undefined"!=c||rd("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");d.ob||"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&S("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");
c=new dd(d.host,d.ob,c,"ws"===d.scheme||"wss"===d.scheme);d=new P(d.bd);e=d.toString();var f;!(f=!q(c.host)||0===c.host.length||!eg(c.lc))&&(f=0!==e.length)&&(e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),f=!(q(e)&&0!==e.length&&!cg.test(e)));if(f)throw Error(E("new Firebase",1,!1)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');if(b)if(b instanceof aj)e=b;else if(q(b))e=aj.yb(),c.Rd=b;else throw Error("Expected a valid Firebase.Context for second argument to new Firebase()");
else e=aj.yb();f=c.toString();var g=z(e.sc,f);g||(g=new Ji(c,e.ag),e.sc[f]=g);c=g}Y.call(this,c,d,De,!1);this.then=void 0;this["catch"]=void 0}ka(X,Y);var fj=X,gj=["Firebase"],hj=n;gj[0]in hj||!hj.execScript||hj.execScript("var "+gj[0]);for(var ij;gj.length&&(ij=gj.shift());)!gj.length&&p(fj)?hj[ij]=fj:hj=hj[ij]?hj[ij]:hj[ij]={};X.goOffline=function(){D("Firebase.goOffline",0,0,arguments.length);aj.yb().Cb()};X.goOnline=function(){D("Firebase.goOnline",0,0,arguments.length);aj.yb().vc()};
X.enableLogging=od;X.ServerValue={TIMESTAMP:{".sv":"timestamp"}};X.SDK_VERSION=Eb;X.INTERNAL=U;X.Context=aj;X.TEST_ACCESS=Z;X.prototype.name=function(){S("Firebase.name() being deprecated. Please use Firebase.key() instead.");D("Firebase.name",0,0,arguments.length);return this.key()};X.prototype.name=X.prototype.name;X.prototype.key=function(){D("Firebase.key",0,0,arguments.length);return this.path.e()?null:me(this.path)};X.prototype.key=X.prototype.key;
X.prototype.o=function(a){D("Firebase.child",1,1,arguments.length);if(fa(a))a=String(a);else if(!(a instanceof P))if(null===K(this.path)){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));ng("Firebase.child",b)}else ng("Firebase.child",a);return new X(this.k,this.path.o(a))};X.prototype.child=X.prototype.o;X.prototype.parent=function(){D("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return null===a?null:new X(this.k,a)};X.prototype.parent=X.prototype.parent;
X.prototype.root=function(){D("Firebase.ref",0,0,arguments.length);for(var a=this;null!==a.parent();)a=a.parent();return a};X.prototype.root=X.prototype.root;X.prototype.set=function(a,b){D("Firebase.set",1,2,arguments.length);og("Firebase.set",this.path);gg("Firebase.set",a,this.path,!1);F("Firebase.set",2,b,!0);var c=new B;this.k.Ob(this.path,a,null,C(c,b));return c.D};X.prototype.set=X.prototype.set;
X.prototype.update=function(a,b){D("Firebase.update",1,2,arguments.length);og("Firebase.update",this.path);if(da(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;S("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}jg("Firebase.update",a,this.path);F("Firebase.update",2,b,!0);c=new B;this.k.update(this.path,a,C(c,b));return c.D};
X.prototype.update=X.prototype.update;X.prototype.Ob=function(a,b,c){D("Firebase.setWithPriority",2,3,arguments.length);og("Firebase.setWithPriority",this.path);gg("Firebase.setWithPriority",a,this.path,!1);kg("Firebase.setWithPriority",2,b);F("Firebase.setWithPriority",3,c,!0);if(".length"===this.key()||".keys"===this.key())throw"Firebase.setWithPriority failed: "+this.key()+" is a read-only object.";var d=new B;this.k.Ob(this.path,a,b,C(d,c));return d.D};X.prototype.setWithPriority=X.prototype.Ob;
X.prototype.remove=function(a){D("Firebase.remove",0,1,arguments.length);og("Firebase.remove",this.path);F("Firebase.remove",1,a,!0);return this.set(null,a)};X.prototype.remove=X.prototype.remove;
X.prototype.transaction=function(a,b,c){D("Firebase.transaction",1,3,arguments.length);og("Firebase.transaction",this.path);F("Firebase.transaction",1,a,!1);F("Firebase.transaction",2,b,!0);if(p(c)&&"boolean"!=typeof c)throw Error(E("Firebase.transaction",3,!0)+"must be a boolean.");if(".length"===this.key()||".keys"===this.key())throw"Firebase.transaction failed: "+this.key()+" is a read-only object.";"undefined"===typeof c&&(c=!0);var d=new B;r(b)&&Nb(d.D);Si(this.k,this.path,a,function(a,c,g){a?
d.reject(a):d.resolve(new ei(c,g));r(b)&&b(a,c,g)},c);return d.D};X.prototype.transaction=X.prototype.transaction;X.prototype.Zg=function(a,b){D("Firebase.setPriority",1,2,arguments.length);og("Firebase.setPriority",this.path);kg("Firebase.setPriority",1,a);F("Firebase.setPriority",2,b,!0);var c=new B;this.k.Ob(this.path.o(".priority"),a,null,C(c,b));return c.D};X.prototype.setPriority=X.prototype.Zg;
X.prototype.push=function(a,b){D("Firebase.push",0,2,arguments.length);og("Firebase.push",this.path);gg("Firebase.push",a,this.path,!0);F("Firebase.push",2,b,!0);var c=Li(this.k),d=hf(c),c=this.o(d);if(null!=a){var e=this,f=c.set(a,b).then(function(){return e.o(d)});c.then=u(f.then,f);c["catch"]=u(f.then,f,void 0);r(b)&&Nb(f)}return c};X.prototype.push=X.prototype.push;X.prototype.lb=function(){og("Firebase.onDisconnect",this.path);return new V(this.k,this.path)};X.prototype.onDisconnect=X.prototype.lb;
X.prototype.O=function(a,b,c){S("FirebaseRef.auth() being deprecated. Please use FirebaseRef.authWithCustomToken() instead.");D("Firebase.auth",1,3,arguments.length);pg("Firebase.auth",a);F("Firebase.auth",2,b,!0);F("Firebase.auth",3,b,!0);var d=new B;dh(this.k.O,a,{},{remember:"none"},C(d,b),c);return d.D};X.prototype.auth=X.prototype.O;X.prototype.je=function(a){D("Firebase.unauth",0,1,arguments.length);F("Firebase.unauth",1,a,!0);var b=new B;eh(this.k.O,C(b,a));return b.D};X.prototype.unauth=X.prototype.je;
X.prototype.Be=function(){D("Firebase.getAuth",0,0,arguments.length);return this.k.O.Be()};X.prototype.getAuth=X.prototype.Be;X.prototype.Ig=function(a,b){D("Firebase.onAuth",1,2,arguments.length);F("Firebase.onAuth",1,a,!1);Qb("Firebase.onAuth",2,b);this.k.O.Ib("auth_status",a,b)};X.prototype.onAuth=X.prototype.Ig;X.prototype.Hg=function(a,b){D("Firebase.offAuth",1,2,arguments.length);F("Firebase.offAuth",1,a,!1);Qb("Firebase.offAuth",2,b);this.k.O.mc("auth_status",a,b)};X.prototype.offAuth=X.prototype.Hg;
X.prototype.hg=function(a,b,c){D("Firebase.authWithCustomToken",1,3,arguments.length);2===arguments.length&&Hb(b)&&(c=b,b=void 0);pg("Firebase.authWithCustomToken",a);F("Firebase.authWithCustomToken",2,b,!0);sg("Firebase.authWithCustomToken",3,c,!0);var d=new B;dh(this.k.O,a,{},c||{},C(d,b));return d.D};X.prototype.authWithCustomToken=X.prototype.hg;
X.prototype.ig=function(a,b,c){D("Firebase.authWithOAuthPopup",1,3,arguments.length);2===arguments.length&&Hb(b)&&(c=b,b=void 0);rg("Firebase.authWithOAuthPopup",a);F("Firebase.authWithOAuthPopup",2,b,!0);sg("Firebase.authWithOAuthPopup",3,c,!0);var d=new B;ih(this.k.O,a,c,C(d,b));return d.D};X.prototype.authWithOAuthPopup=X.prototype.ig;
X.prototype.jg=function(a,b,c){D("Firebase.authWithOAuthRedirect",1,3,arguments.length);2===arguments.length&&Hb(b)&&(c=b,b=void 0);rg("Firebase.authWithOAuthRedirect",a);F("Firebase.authWithOAuthRedirect",2,b,!1);sg("Firebase.authWithOAuthRedirect",3,c,!0);var d=new B,e=this.k.O,f=c,g=C(d,b);gh(e);var k=[Qg],f=Ag(f);"anonymous"===a||"firebase"===a?T(g,Sg("TRANSPORT_UNAVAILABLE")):(cd.set("redirect_client_options",f.qd),hh(e,k,"/auth/"+a,f,g));return d.D};X.prototype.authWithOAuthRedirect=X.prototype.jg;
X.prototype.kg=function(a,b,c,d){D("Firebase.authWithOAuthToken",2,4,arguments.length);3===arguments.length&&Hb(c)&&(d=c,c=void 0);rg("Firebase.authWithOAuthToken",a);F("Firebase.authWithOAuthToken",3,c,!0);sg("Firebase.authWithOAuthToken",4,d,!0);var e=new B;q(b)?(qg("Firebase.authWithOAuthToken",2,b),fh(this.k.O,a+"/token",{access_token:b},d,C(e,c))):(sg("Firebase.authWithOAuthToken",2,b,!1),fh(this.k.O,a+"/token",b,d,C(e,c)));return e.D};X.prototype.authWithOAuthToken=X.prototype.kg;
X.prototype.gg=function(a,b){D("Firebase.authAnonymously",0,2,arguments.length);1===arguments.length&&Hb(a)&&(b=a,a=void 0);F("Firebase.authAnonymously",1,a,!0);sg("Firebase.authAnonymously",2,b,!0);var c=new B;fh(this.k.O,"anonymous",{},b,C(c,a));return c.D};X.prototype.authAnonymously=X.prototype.gg;
X.prototype.lg=function(a,b,c){D("Firebase.authWithPassword",1,3,arguments.length);2===arguments.length&&Hb(b)&&(c=b,b=void 0);sg("Firebase.authWithPassword",1,a,!1);tg("Firebase.authWithPassword",a,"email");tg("Firebase.authWithPassword",a,"password");F("Firebase.authWithPassword",2,b,!0);sg("Firebase.authWithPassword",3,c,!0);var d=new B;fh(this.k.O,"password",a,c,C(d,b));return d.D};X.prototype.authWithPassword=X.prototype.lg;
X.prototype.ve=function(a,b){D("Firebase.createUser",1,2,arguments.length);sg("Firebase.createUser",1,a,!1);tg("Firebase.createUser",a,"email");tg("Firebase.createUser",a,"password");F("Firebase.createUser",2,b,!0);var c=new B;this.k.O.ve(a,C(c,b));return c.D};X.prototype.createUser=X.prototype.ve;
X.prototype.Xe=function(a,b){D("Firebase.removeUser",1,2,arguments.length);sg("Firebase.removeUser",1,a,!1);tg("Firebase.removeUser",a,"email");tg("Firebase.removeUser",a,"password");F("Firebase.removeUser",2,b,!0);var c=new B;this.k.O.Xe(a,C(c,b));return c.D};X.prototype.removeUser=X.prototype.Xe;
X.prototype.se=function(a,b){D("Firebase.changePassword",1,2,arguments.length);sg("Firebase.changePassword",1,a,!1);tg("Firebase.changePassword",a,"email");tg("Firebase.changePassword",a,"oldPassword");tg("Firebase.changePassword",a,"newPassword");F("Firebase.changePassword",2,b,!0);var c=new B;this.k.O.se(a,C(c,b));return c.D};X.prototype.changePassword=X.prototype.se;
X.prototype.re=function(a,b){D("Firebase.changeEmail",1,2,arguments.length);sg("Firebase.changeEmail",1,a,!1);tg("Firebase.changeEmail",a,"oldEmail");tg("Firebase.changeEmail",a,"newEmail");tg("Firebase.changeEmail",a,"password");F("Firebase.changeEmail",2,b,!0);var c=new B;this.k.O.re(a,C(c,b));return c.D};X.prototype.changeEmail=X.prototype.re;
X.prototype.Ze=function(a,b){D("Firebase.resetPassword",1,2,arguments.length);sg("Firebase.resetPassword",1,a,!1);tg("Firebase.resetPassword",a,"email");F("Firebase.resetPassword",2,b,!0);var c=new B;this.k.O.Ze(a,C(c,b));return c.D};X.prototype.resetPassword=X.prototype.Ze;})();


/* mousetrap v1.5.3 craig.is/killing/mice */
(function(C,r,g){function t(a,b,h){a.addEventListener?a.addEventListener(b,h,!1):a.attachEvent("on"+b,h)}function x(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return l[a.which]?l[a.which]:p[a.which]?p[a.which]:String.fromCharCode(a.which).toLowerCase()}function D(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function u(a){return"shift"==a||"ctrl"==a||"alt"==a||
"meta"==a}function y(a,b){var h,c,e,g=[];h=a;"+"===h?h=["+"]:(h=h.replace(/\+{2}/g,"+plus"),h=h.split("+"));for(e=0;e<h.length;++e)c=h[e],z[c]&&(c=z[c]),b&&"keypress"!=b&&A[c]&&(c=A[c],g.push("shift")),u(c)&&g.push(c);h=c;e=b;if(!e){if(!k){k={};for(var m in l)95<m&&112>m||l.hasOwnProperty(m)&&(k[l[m]]=m)}e=k[h]?"keydown":"keypress"}"keypress"==e&&g.length&&(e="keydown");return{key:c,modifiers:g,action:e}}function B(a,b){return null===a||a===r?!1:a===b?!0:B(a.parentNode,b)}function c(a){function b(a){a=
a||{};var b=!1,n;for(n in q)a[n]?b=!0:q[n]=0;b||(v=!1)}function h(a,b,n,f,c,h){var g,e,l=[],m=n.type;if(!d._callbacks[a])return[];"keyup"==m&&u(a)&&(b=[a]);for(g=0;g<d._callbacks[a].length;++g)if(e=d._callbacks[a][g],(f||!e.seq||q[e.seq]==e.level)&&m==e.action){var k;(k="keypress"==m&&!n.metaKey&&!n.ctrlKey)||(k=e.modifiers,k=b.sort().join(",")===k.sort().join(","));k&&(k=f&&e.seq==f&&e.level==h,(!f&&e.combo==c||k)&&d._callbacks[a].splice(g,1),l.push(e))}return l}function g(a,b,n,f){d.stopCallback(b,
b.target||b.srcElement,n,f)||!1!==a(b,n)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?b.stopPropagation():b.cancelBubble=!0)}function e(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=x(a);b&&("keyup"==a.type&&w===b?w=!1:d.handleKey(b,D(a),a))}function l(a,c,n,f){function e(c){return function(){v=c;++q[a];clearTimeout(k);k=setTimeout(b,1E3)}}function h(c){g(n,c,a);"keyup"!==f&&(w=x(c));setTimeout(b,10)}for(var d=q[a]=0;d<c.length;++d){var p=d+1===c.length?h:e(f||
y(c[d+1]).action);m(c[d],p,f,a,d)}}function m(a,b,c,f,e){d._directMap[a+":"+c]=b;a=a.replace(/\s+/g," ");var g=a.split(" ");1<g.length?l(a,g,b,c):(c=y(a,c),d._callbacks[c.key]=d._callbacks[c.key]||[],h(c.key,c.modifiers,{type:c.action},f,a,e),d._callbacks[c.key][f?"unshift":"push"]({callback:b,modifiers:c.modifiers,action:c.action,seq:f,level:e,combo:a}))}var d=this;a=a||r;if(!(d instanceof c))return new c(a);d.target=a;d._callbacks={};d._directMap={};var q={},k,w=!1,p=!1,v=!1;d._handleKey=function(a,
c,e){var f=h(a,c,e),d;c={};var k=0,l=!1;for(d=0;d<f.length;++d)f[d].seq&&(k=Math.max(k,f[d].level));for(d=0;d<f.length;++d)f[d].seq?f[d].level==k&&(l=!0,c[f[d].seq]=1,g(f[d].callback,e,f[d].combo,f[d].seq)):l||g(f[d].callback,e,f[d].combo);f="keypress"==e.type&&p;e.type!=v||u(a)||f||b(c);p=l&&"keydown"==e.type};d._bindMultiple=function(a,b,c){for(var d=0;d<a.length;++d)m(a[d],b,c)};t(a,"keypress",e);t(a,"keydown",e);t(a,"keyup",e)}var l={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",
20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},p={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},A={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},z={option:"alt",command:"meta","return":"enter",
escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},k;for(g=1;20>g;++g)l[111+g]="f"+g;for(g=0;9>=g;++g)l[g+96]=g;c.prototype.bind=function(a,b,c){a=a instanceof Array?a:[a];this._bindMultiple.call(this,a,b,c);return this};c.prototype.unbind=function(a,b){return this.bind.call(this,a,function(){},b)};c.prototype.trigger=function(a,b){if(this._directMap[a+":"+b])this._directMap[a+":"+b]({},a);return this};c.prototype.reset=function(){this._callbacks={};this._directMap=
{};return this};c.prototype.stopCallback=function(a,b){return-1<(" "+b.className+" ").indexOf(" mousetrap ")||B(b,this.target)?!1:"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable};c.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)};c.init=function(){var a=c(r),b;for(b in a)"_"!==b.charAt(0)&&(c[b]=function(b){return function(){return a[b].apply(a,arguments)}}(b))};c.init();C.Mousetrap=c;"undefined"!==typeof module&&module.exports&&(module.exports=
c);"function"===typeof define&&define.amd&&define(function(){return c})})(window,document);

;(function(){
var h,aa=aa||{},ba=this;function ca(a){return void 0!==a}function ea(){}
function k(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ga(a){return"array"==k(a)}function ha(a){var b=k(a);return"array"==b||"object"==b&&"number"==typeof a.length}function ia(a){return"string"==typeof a}function ja(a){return"number"==typeof a}function la(a){return"function"==k(a)}function pa(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function qa(a){return a[ra]||(a[ra]=++sa)}var ra="closure_uid_"+(1E9*Math.random()>>>0),sa=0;
function wa(a,b,c){return a.call.apply(a.bind,arguments)}function xa(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function ya(a,b,c){ya=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?wa:xa;return ya.apply(null,arguments)}var za=Date.now||function(){return+new Date};
function Aa(a,b){var c=a.split("."),d=ba;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)!c.length&&ca(b)?d[e]=b:d=d[e]?d[e]:d[e]={}}function Ba(a,b){function c(){}c.prototype=b.prototype;a.wb=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.me=function(a,c,f){for(var g=Array(arguments.length-2),l=2;l<arguments.length;l++)g[l-2]=arguments[l];return b.prototype[c].apply(a,g)}};function Ca(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")}var Da=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};
function Fa(a){if(!Ga.test(a))return a;-1!=a.indexOf("\x26")&&(a=a.replace(Ha,"\x26amp;"));-1!=a.indexOf("\x3c")&&(a=a.replace(Ia,"\x26lt;"));-1!=a.indexOf("\x3e")&&(a=a.replace(Ja,"\x26gt;"));-1!=a.indexOf('"')&&(a=a.replace(Ma,"\x26quot;"));-1!=a.indexOf("'")&&(a=a.replace(Na,"\x26#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(Oa,"\x26#0;"));return a}var Ha=/&/g,Ia=/</g,Ja=/>/g,Ma=/"/g,Na=/'/g,Oa=/\x00/g,Ga=/[\x00&<>"']/;
function Pa(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")}var Ra=String.prototype.repeat?function(a,b){return a.repeat(b)}:function(a,b){return Array(b+1).join(a)};function Sa(a,b){return a<b?-1:a>b?1:0}var Ta=2147483648*Math.random()|0;function Va(a){return String(a).replace(/\-([a-z])/g,function(a,c){return c.toUpperCase()})}
function Wa(a){var b=ia(void 0)?Pa(void 0):"\\s";return a.replace(new RegExp("(^"+(b?"|["+b+"]+":"")+")([a-z])","g"),function(a,b,e){return b+e.toUpperCase()})};function Xa(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function Ya(a,b){for(var c in a)if(b.call(void 0,a[c],c,a))return!0;return!1}function Za(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function $a(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function ab(a){return null!==a&&"withCredentials"in a}var bb="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function cb(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<bb.length;f++)c=bb[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};function db(a,b){null!=a&&this.append.apply(this,arguments)}h=db.prototype;h.uc="";h.set=function(a){this.uc=""+a};h.append=function(a,b,c){this.uc+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.uc+=arguments[d];return this};h.clear=function(){this.uc=""};h.toString=function(){return this.uc};function eb(a){if(Error.captureStackTrace)Error.captureStackTrace(this,eb);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}Ba(eb,Error);eb.prototype.name="CustomError";var fb;function hb(a,b){b.unshift(a);eb.call(this,Ca.apply(null,b));b.shift()}Ba(hb,eb);hb.prototype.name="AssertionError";function ib(a,b){throw new hb("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};function jb(a){return a[a.length-1]}
var lb=Array.prototype,mb=lb.indexOf?function(a,b,c){return lb.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(ia(a))return ia(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},nb=lb.forEach?function(a,b,c){lb.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=ia(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},ob=lb.filter?function(a,b,c){return lb.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],
f=0,g=ia(a)?a.split(""):a,l=0;l<d;l++)if(l in g){var m=g[l];b.call(c,m,l,a)&&(e[f++]=m)}return e},pb=lb.map?function(a,b,c){return lb.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=ia(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},qb=lb.some?function(a,b,c){return lb.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=ia(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1},rb=lb.every?function(a,b,c){return lb.every.call(a,b,
c)}:function(a,b,c){for(var d=a.length,e=ia(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function sb(a,b){var c;a:{c=a.length;for(var d=ia(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){c=e;break a}c=-1}return 0>c?null:ia(a)?a.charAt(c):a[c]}function tb(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]}function ub(a,b,c){return 2>=arguments.length?lb.slice.call(a,b):lb.slice.call(a,b,c)}
function vb(a,b){a.sort(b||wb)}function xb(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||wb;vb(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function wb(a,b){return a>b?1:a<b?-1:0};var yb;if("undefined"===typeof zb)var zb=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof Ab)var Ab=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Bb=null;if("undefined"===typeof Cb)var Cb=null;function Db(){return new q(null,5,[Eb,!0,Fb,!0,Gb,!1,Hb,!1,Ib,null],null)}function r(a){return null!=a&&!1!==a}function Jb(a){return null==a}function Kb(a){return a instanceof Array}
function Mb(a){return null==a?!0:!1===a?!0:!1}function Nb(a,b){return a[k(null==b?null:b)]?!0:a._?!0:!1}function Ob(a){return null==a?null:a.constructor}function Pb(a,b){var c=Ob(b),c=r(r(c)?c.Oc:c)?c.hc:k(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Qb(a){var b=a.hc;return r(b)?b:""+t(a)}var Rb="undefined"!==typeof Symbol&&"function"===k(Symbol)?Symbol.iterator:"@@iterator";
function Sb(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}function Tb(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return Ub(arguments[0]);case 2:return Ub(arguments[1]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}function Vb(a){return Ub(a)}function Ub(a){function b(a,b){a.push(b);return a}var c=[];return Wb?Wb(b,c,a):Yb.call(null,b,c,a)}function Zb(){}function $b(){}
var ac=function ac(b){if(null!=b&&null!=b.Ea)return b.Ea(b);var c=ac[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=ac._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("ICloneable.-clone",b);};function bc(){}
var cc=function cc(b){if(null!=b&&null!=b.ba)return b.ba(b);var c=cc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=cc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("ICounted.-count",b);},dc=function dc(b){if(null!=b&&null!=b.ta)return b.ta(b);var c=dc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=dc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IEmptyableCollection.-empty",b);};function ec(){}
var x=function x(b,c){if(null!=b&&null!=b.ia)return b.ia(b,c);var d=x[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=x._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("ICollection.-conj",b);};function fc(){}
var gc=function gc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return gc.a(arguments[0],arguments[1]);case 3:return gc.h(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};
gc.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=gc[k(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=gc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Pb("IIndexed.-nth",a);};gc.h=function(a,b,c){if(null!=a&&null!=a.ab)return a.ab(a,b,c);var d=gc[k(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=gc._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw Pb("IIndexed.-nth",a);};gc.I=3;function hc(){}
var ic=function ic(b){if(null!=b&&null!=b.Da)return b.Da(b);var c=ic[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=ic._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("ISeq.-first",b);},jc=function jc(b){if(null!=b&&null!=b.bb)return b.bb(b);var c=jc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=jc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("ISeq.-rest",b);};function kc(){}function lc(){}
var mc=function mc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return mc.a(arguments[0],arguments[1]);case 3:return mc.h(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};
mc.a=function(a,b){if(null!=a&&null!=a.T)return a.T(a,b);var c=mc[k(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=mc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Pb("ILookup.-lookup",a);};mc.h=function(a,b,c){if(null!=a&&null!=a.R)return a.R(a,b,c);var d=mc[k(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=mc._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw Pb("ILookup.-lookup",a);};mc.I=3;
var nc=function nc(b,c){if(null!=b&&null!=b.pe)return b.pe(b,c);var d=nc[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=nc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("IAssociative.-contains-key?",b);},oc=function oc(b,c,d){if(null!=b&&null!=b.rb)return b.rb(b,c,d);var e=oc[k(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=oc._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw Pb("IAssociative.-assoc",b);};function pc(){}
var qc=function qc(b,c){if(null!=b&&null!=b.Lb)return b.Lb(b,c);var d=qc[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=qc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("IMap.-dissoc",b);};function rc(){}
var sc=function sc(b){if(null!=b&&null!=b.Hd)return b.Hd(b);var c=sc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=sc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IMapEntry.-key",b);},tc=function tc(b){if(null!=b&&null!=b.Id)return b.Id(b);var c=tc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=tc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IMapEntry.-val",b);};function uc(){}
var vc=function vc(b,c){if(null!=b&&null!=b.ef)return b.ef(b,c);var d=vc[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=vc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("ISet.-disjoin",b);},wc=function wc(b){if(null!=b&&null!=b.vc)return b.vc(b);var c=wc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=wc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IStack.-peek",b);},xc=function xc(b){if(null!=b&&null!=b.wc)return b.wc(b);var c=xc[k(null==
b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=xc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IStack.-pop",b);};function zc(){}var Ac=function Ac(b,c,d){if(null!=b&&null!=b.Mc)return b.Mc(b,c,d);var e=Ac[k(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Ac._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw Pb("IVector.-assoc-n",b);};function Bc(){}
var Cc=function Cc(b){if(null!=b&&null!=b.Yb)return b.Yb(b);var c=Cc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Cc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IDeref.-deref",b);};function Dc(){}
var Ec=function Ec(b){if(null!=b&&null!=b.V)return b.V(b);var c=Ec[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Ec._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IMeta.-meta",b);},Fc=function Fc(b,c){if(null!=b&&null!=b.Y)return b.Y(b,c);var d=Fc[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Fc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("IWithMeta.-with-meta",b);};function Gc(){}
var Hc=function Hc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Hc.a(arguments[0],arguments[1]);case 3:return Hc.h(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};
Hc.a=function(a,b){if(null!=a&&null!=a.Fa)return a.Fa(a,b);var c=Hc[k(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Hc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Pb("IReduce.-reduce",a);};Hc.h=function(a,b,c){if(null!=a&&null!=a.Ga)return a.Ga(a,b,c);var d=Hc[k(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=Hc._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw Pb("IReduce.-reduce",a);};Hc.I=3;
var Ic=function Ic(b,c,d){if(null!=b&&null!=b.ed)return b.ed(b,c,d);var e=Ic[k(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Ic._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw Pb("IKVReduce.-kv-reduce",b);},Kc=function Kc(b,c){if(null!=b&&null!=b.K)return b.K(b,c);var d=Kc[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Kc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("IEquiv.-equiv",b);},Lc=function Lc(b){if(null!=b&&null!=b.S)return b.S(b);
var c=Lc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Lc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IHash.-hash",b);};function Mc(){}var Oc=function Oc(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=Oc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Oc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("ISeqable.-seq",b);};function Pc(){}function Qc(){}function Rc(){}function Sc(){}
var Tc=function Tc(b){if(null!=b&&null!=b.fd)return b.fd(b);var c=Tc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Tc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IReversible.-rseq",b);},Uc=function Uc(b,c){if(null!=b&&null!=b.Sf)return b.Sf(0,c);var d=Uc[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Uc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("IWriter.-write",b);};function Vc(){}
var Wc=function Wc(b,c,d){if(null!=b&&null!=b.Nd)return b.Nd(b,c,d);var e=Wc[k(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Wc._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw Pb("IWatchable.-notify-watches",b);},Xc=function Xc(b,c,d){if(null!=b&&null!=b.Md)return b.Md(b,c,d);var e=Xc[k(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Xc._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw Pb("IWatchable.-add-watch",b);},Yc=function Yc(b,
c){if(null!=b&&null!=b.Od)return b.Od(b,c);var d=Yc[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Yc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("IWatchable.-remove-watch",b);},Zc=function Zc(b){if(null!=b&&null!=b.dd)return b.dd(b);var c=Zc[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Zc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IEditableCollection.-as-transient",b);},$c=function $c(b,c){if(null!=b&&null!=b.Lc)return b.Lc(b,
c);var d=$c[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=$c._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("ITransientCollection.-conj!",b);},ad=function ad(b){if(null!=b&&null!=b.hd)return b.hd(b);var c=ad[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=ad._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("ITransientCollection.-persistent!",b);},bd=function bd(b,c,d){if(null!=b&&null!=b.Ld)return b.Ld(b,c,d);var e=bd[k(null==b?null:b)];if(null!=
e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=bd._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw Pb("ITransientAssociative.-assoc!",b);},cd=function cd(b,c,d){if(null!=b&&null!=b.Qf)return b.Qf(0,c,d);var e=cd[k(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=cd._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw Pb("ITransientVector.-assoc-n!",b);};function dd(){}
var ed=function ed(b,c){if(null!=b&&null!=b.gc)return b.gc(b,c);var d=ed[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ed._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("IComparable.-compare",b);},fd=function fd(b){if(null!=b&&null!=b.Of)return b.Of();var c=fd[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=fd._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IChunk.-drop-first",b);},gd=function gd(b){if(null!=b&&null!=b.bf)return b.bf(b);
var c=gd[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=gd._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IChunkedSeq.-chunked-first",b);},hd=function hd(b){if(null!=b&&null!=b.cf)return b.cf(b);var c=hd[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=hd._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IChunkedSeq.-chunked-rest",b);},id=function id(b){if(null!=b&&null!=b.af)return b.af(b);var c=id[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,
b);c=id._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IChunkedNext.-chunked-next",b);},jd=function jd(b){if(null!=b&&null!=b.Jd)return b.Jd(b);var c=jd[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=jd._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("INamed.-name",b);},kd=function kd(b){if(null!=b&&null!=b.Kd)return b.Kd(b);var c=kd[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=kd._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("INamed.-namespace",
b);},ld=function ld(b,c){if(null!=b&&null!=b.te)return b.te(b,c);var d=ld[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ld._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("IReset.-reset!",b);},md=function md(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return md.a(arguments[0],arguments[1]);case 3:return md.h(arguments[0],arguments[1],arguments[2]);case 4:return md.J(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return md.X(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};md.a=function(a,b){if(null!=a&&null!=a.ue)return a.ue(a,b);var c=md[k(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=md._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Pb("ISwap.-swap!",a);};
md.h=function(a,b,c){if(null!=a&&null!=a.ve)return a.ve(a,b,c);var d=md[k(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=md._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw Pb("ISwap.-swap!",a);};md.J=function(a,b,c,d){if(null!=a&&null!=a.we)return a.we(a,b,c,d);var e=md[k(null==a?null:a)];if(null!=e)return e.J?e.J(a,b,c,d):e.call(null,a,b,c,d);e=md._;if(null!=e)return e.J?e.J(a,b,c,d):e.call(null,a,b,c,d);throw Pb("ISwap.-swap!",a);};
md.X=function(a,b,c,d,e){if(null!=a&&null!=a.xe)return a.xe(a,b,c,d,e);var f=md[k(null==a?null:a)];if(null!=f)return f.X?f.X(a,b,c,d,e):f.call(null,a,b,c,d,e);f=md._;if(null!=f)return f.X?f.X(a,b,c,d,e):f.call(null,a,b,c,d,e);throw Pb("ISwap.-swap!",a);};md.I=5;
var nd=function nd(b,c){if(null!=b&&null!=b.Rf)return b.Rf(0,c);var d=nd[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=nd._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("IVolatile.-vreset!",b);},od=function od(b){if(null!=b&&null!=b.ib)return b.ib(b);var c=od[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=od._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IIterable.-iterator",b);};function pd(a){this.dh=a;this.l=1073741824;this.L=0}
pd.prototype.Sf=function(a,b){return this.dh.append(b)};function qd(a){var b=new db;a.U(null,new pd(b),Db());return""+t(b)}var rd="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function sd(a){a=rd(a|0,-862048943);return rd(a<<15|a>>>-15,461845907)}function td(a,b){var c=(a|0)^(b|0);return rd(c<<13|c>>>-13,5)+-430675100|0}
function ud(a,b){var c=(a|0)^b,c=rd(c^c>>>16,-2048144789),c=rd(c^c>>>13,-1028477387);return c^c>>>16}function vd(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=td(c,sd(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^sd(a.charCodeAt(a.length-1)):b;return ud(b,rd(2,a.length))}var wd={},xd=0;
function yd(a){255<xd&&(wd={},xd=0);var b=wd[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=rd(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;wd[a]=b;xd+=1}return a=b}
function zd(a){if(null!=a&&(a.l&4194304||a.df))return a.S(null);if("number"===typeof a){if(r(isFinite(a)))return Math.floor(a)%2147483647;switch(a){case Infinity:return 2146435072;case -Infinity:return-1048576;default:return 2146959360}}else return!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=yd(a),0!==a&&(a=sd(a),a=td(0,a),a=ud(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Lc(a),a}function Bd(a,b){return a^b+2654435769+(a<<6)+(a>>2)}
function Cd(a,b){if(a.mb===b.mb)return 0;var c=Mb(a.kb);if(r(c?b.kb:c))return-1;if(r(a.kb)){if(Mb(b.kb))return 1;c=wb(a.kb,b.kb);return 0===c?wb(a.name,b.name):c}return wb(a.name,b.name)}function y(a,b,c,d,e){this.kb=a;this.name=b;this.mb=c;this.ad=d;this.nb=e;this.l=2154168321;this.L=4096}h=y.prototype;h.toString=function(){return this.mb};h.equiv=function(a){return this.K(null,a)};h.K=function(a,b){return b instanceof y?this.mb===b.mb:!1};
h.call=function(){function a(a,b,c){return A.h?A.h(b,this,c):A.call(null,b,this,c)}function b(a,b){return A.a?A.a(b,this):A.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.h=a;return c}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return A.a?A.a(a,this):A.call(null,a,this)};
h.a=function(a,b){return A.h?A.h(a,this,b):A.call(null,a,this,b)};h.V=function(){return this.nb};h.Y=function(a,b){return new y(this.kb,this.name,this.mb,this.ad,b)};h.S=function(){var a=this.ad;return null!=a?a:this.ad=a=Bd(vd(this.name),yd(this.kb))};h.Jd=function(){return this.name};h.Kd=function(){return this.kb};h.U=function(a,b){return Uc(b,this.mb)};
var Dd=function Dd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Dd.g(arguments[0]);case 2:return Dd.a(arguments[0],arguments[1]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};Dd.g=function(a){if(a instanceof y)return a;var b=a.indexOf("/");return 1>b?Dd.a(null,a):Dd.a(a.substring(0,b),a.substring(b+1,a.length))};Dd.a=function(a,b){var c=null!=a?[t(a),t("/"),t(b)].join(""):b;return new y(a,b,c,null,null)};
Dd.I=2;function B(a){if(null==a)return null;if(null!=a&&(a.l&8388608||a.gd))return a.Z(null);if(Kb(a)||"string"===typeof a)return 0===a.length?null:new C(a,0,null);if(Nb(Mc,a))return Oc(a);throw Error([t(a),t(" is not ISeqable")].join(""));}function D(a){if(null==a)return null;if(null!=a&&(a.l&64||a.M))return a.Da(null);a=B(a);return null==a?null:ic(a)}function Ed(a){return null!=a?null!=a&&(a.l&64||a.M)?a.bb(null):(a=B(a))?jc(a):Fd:Fd}
function F(a){return null==a?null:null!=a&&(a.l&128||a.se)?a.lb(null):B(Ed(a))}var Gd=function Gd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gd.g(arguments[0]);case 2:return Gd.a(arguments[0],arguments[1]);default:return Gd.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};Gd.g=function(){return!0};Gd.a=function(a,b){return null==a?null==b:a===b||Kc(a,b)};
Gd.o=function(a,b,c){for(;;)if(Gd.a(a,b))if(F(c))a=b,b=D(c),c=F(c);else return Gd.a(b,D(c));else return!1};Gd.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return Gd.o(b,a,c)};Gd.I=2;function Hd(a){this.da=a}Hd.prototype.next=function(){if(null!=this.da){var a=D(this.da);this.da=F(this.da);return{value:a,done:!1}}return{value:null,done:!0}};function Id(a){return new Hd(B(a))}function Jd(a,b){var c=sd(a),c=td(0,c);return ud(c,b)}
function Kd(a){var b=0,c=1;for(a=B(a);;)if(null!=a)b+=1,c=rd(31,c)+zd(D(a))|0,a=F(a);else return Jd(c,b)}var Ld=Jd(1,0);function Md(a){var b=0,c=0;for(a=B(a);;)if(null!=a)b+=1,c=c+zd(D(a))|0,a=F(a);else return Jd(c,b)}var Nd=Jd(0,0);bc["null"]=!0;cc["null"]=function(){return 0};Date.prototype.K=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Kc=!0;
Date.prototype.gc=function(a,b){if(b instanceof Date)return wb(this.valueOf(),b.valueOf());throw Error([t("Cannot compare "),t(this),t(" to "),t(b)].join(""));};Kc.number=function(a,b){return a===b};Zb["function"]=!0;Dc["function"]=!0;Ec["function"]=function(){return null};Lc._=function(a){return qa(a)};function Od(a){return a+1}function Pd(a){this.val=a;this.l=32768;this.L=0}Pd.prototype.Yb=function(){return this.val};function Qd(a){return a instanceof Pd}function G(a){return Cc(a)}
function Rd(a,b){var c=cc(a);if(0===c)return b.D?b.D():b.call(null);for(var d=gc.a(a,0),e=1;;)if(e<c){var f=gc.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Qd(d))return Cc(d);e+=1}else return d}function Sd(a,b,c){var d=cc(a),e=c;for(c=0;;)if(c<d){var f=gc.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Qd(e))return Cc(e);c+=1}else return e}
function Td(a,b){var c=a.length;if(0===a.length)return b.D?b.D():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Qd(d))return Cc(d);e+=1}else return d}function Ud(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Qd(e))return Cc(e);c+=1}else return e}function Vd(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Qd(c))return Cc(c);d+=1}else return c}
function Wd(a){return null!=a?a.l&2||a.qe?!0:a.l?!1:Nb(bc,a):Nb(bc,a)}function Xd(a){return null!=a?a.l&16||a.Gd?!0:a.l?!1:Nb(fc,a):Nb(fc,a)}function H(a,b,c){var d=M.g?M.g(a):M.call(null,a);if(c>=d)return-1;!(0<c)&&0>c&&(c+=d,c=0>c?0:c);for(;;)if(c<d){if(Gd.a(Yd?Yd(a,c):Zd.call(null,a,c),b))return c;c+=1}else return-1}
function $d(a,b,c){var d=M.g?M.g(a):M.call(null,a);if(0===d)return-1;0<c?(--d,c=d<c?d:c):c=0>c?d+c:c;for(;;)if(0<=c){if(Gd.a(Yd?Yd(a,c):Zd.call(null,a,c),b))return c;--c}else return-1}function ae(a,b){this.j=a;this.F=b}ae.prototype.Ya=function(){return this.F<this.j.length};ae.prototype.next=function(){var a=this.j[this.F];this.F+=1;return a};function C(a,b,c){this.j=a;this.F=b;this.B=c;this.l=166592766;this.L=8192}h=C.prototype;h.toString=function(){return qd(this)};
h.equiv=function(a){return this.K(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M.g?M.g(this):M.call(null,this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.N=function(a,b){var c=b+this.F;return c<this.j.length?this.j[c]:null};h.ab=function(a,b,c){a=b+this.F;return a<this.j.length?this.j[a]:c};h.ib=function(){return new ae(this.j,this.F)};h.V=function(){return this.B};
h.Ea=function(){return new C(this.j,this.F,this.B)};h.lb=function(){return this.F+1<this.j.length?new C(this.j,this.F+1,null):null};h.ba=function(){var a=this.j.length-this.F;return 0>a?0:a};h.fd=function(){var a=cc(this);return 0<a?new be(this,a-1,null):null};h.S=function(){return Kd(this)};h.K=function(a,b){return ce.a?ce.a(this,b):ce.call(null,this,b)};h.ta=function(){return Fd};h.Fa=function(a,b){return Vd(this.j,b,this.j[this.F],this.F+1)};h.Ga=function(a,b,c){return Vd(this.j,b,c,this.F)};
h.Da=function(){return this.j[this.F]};h.bb=function(){return this.F+1<this.j.length?new C(this.j,this.F+1,null):Fd};h.Z=function(){return this.F<this.j.length?this:null};h.Y=function(a,b){return new C(this.j,this.F,b)};h.ia=function(a,b){return de.a?de.a(b,this):de.call(null,b,this)};C.prototype[Rb]=function(){return Id(this)};function ee(a,b){return b<a.length?new C(a,b,null):null}
function N(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return ee(arguments[0],0);case 2:return ee(arguments[0],arguments[1]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}function be(a,b,c){this.Ed=a;this.F=b;this.B=c;this.l=32374990;this.L=8192}h=be.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M.g?M.g(this):M.call(null,this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.Ea=function(){return new be(this.Ed,this.F,this.B)};h.lb=function(){return 0<this.F?new be(this.Ed,this.F-1,null):null};h.ba=function(){return this.F+1};h.S=function(){return Kd(this)};
h.K=function(a,b){return ce.a?ce.a(this,b):ce.call(null,this,b)};h.ta=function(){var a=Fd,b=this.B;return fe.a?fe.a(a,b):fe.call(null,a,b)};h.Fa=function(a,b){return ge?ge(b,this):he.call(null,b,this)};h.Ga=function(a,b,c){return ie?ie(b,c,this):he.call(null,b,c,this)};h.Da=function(){return gc.a(this.Ed,this.F)};h.bb=function(){return 0<this.F?new be(this.Ed,this.F-1,null):Fd};h.Z=function(){return this};h.Y=function(a,b){return new be(this.Ed,this.F,b)};
h.ia=function(a,b){return de.a?de.a(b,this):de.call(null,b,this)};be.prototype[Rb]=function(){return Id(this)};function je(a){return D(F(a))}function ke(a){for(;;){var b=F(a);if(null!=b)a=b;else return D(a)}}Kc._=function(a,b){return a===b};
var le=function le(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return le.D();case 1:return le.g(arguments[0]);case 2:return le.a(arguments[0],arguments[1]);default:return le.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};le.D=function(){return me};le.g=function(a){return a};le.a=function(a,b){return null!=a?x(a,b):x(Fd,b)};le.o=function(a,b,c){for(;;)if(r(c))a=le.a(a,b),b=D(c),c=F(c);else return le.a(a,b)};
le.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return le.o(b,a,c)};le.I=2;function M(a){if(null!=a)if(null!=a&&(a.l&2||a.qe))a=a.ba(null);else if(Kb(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.l&8388608||a.gd))a:{a=B(a);for(var b=0;;){if(Wd(a)){a=b+cc(a);break a}a=F(a);b+=1}}else a=cc(a);else a=0;return a}function ne(a,b,c){for(;;){if(null==a)return c;if(0===b)return B(a)?D(a):c;if(Xd(a))return gc.h(a,b,c);if(B(a))a=F(a),--b;else return c}}
function Zd(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return Yd(arguments[0],arguments[1]);case 3:return O(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}
function Yd(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.l&16||a.Gd))return a.N(null,b);if(Kb(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.l&64||a.M)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(B(c)){c=D(c);break a}throw Error("Index out of bounds");}if(Xd(c)){c=gc.a(c,d);break a}if(B(c))c=F(c),--d;else throw Error("Index out of bounds");
}}return c}if(Nb(fc,a))return gc.a(a,b);throw Error([t("nth not supported on this type "),t(Qb(Ob(a)))].join(""));}
function O(a,b,c){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return c;if(null!=a&&(a.l&16||a.Gd))return a.ab(null,b,c);if(Kb(a))return b<a.length?a[b]:c;if("string"===typeof a)return b<a.length?a.charAt(b):c;if(null!=a&&(a.l&64||a.M))return ne(a,b,c);if(Nb(fc,a))return gc.a(a,b);throw Error([t("nth not supported on this type "),t(Qb(Ob(a)))].join(""));}
var A=function A(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return A.a(arguments[0],arguments[1]);case 3:return A.h(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};A.a=function(a,b){return null==a?null:null!=a&&(a.l&256||a.Cg)?a.T(null,b):Kb(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Nb(lc,a)?mc.a(a,b):null};
A.h=function(a,b,c){return null!=a?null!=a&&(a.l&256||a.Cg)?a.R(null,b,c):Kb(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Nb(lc,a)?mc.h(a,b,c):c:c};A.I=3;var oe=function oe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return oe.h(arguments[0],arguments[1],arguments[2]);default:return oe.o(arguments[0],arguments[1],arguments[2],new C(c.slice(3),0,null))}};oe.h=function(a,b,c){return null!=a?oc(a,b,c):pe([b],[c])};
oe.o=function(a,b,c,d){for(;;)if(a=oe.h(a,b,c),r(d))b=D(d),c=je(d),d=F(F(d));else return a};oe.H=function(a){var b=D(a),c=F(a);a=D(c);var d=F(c),c=D(d),d=F(d);return oe.o(b,a,c,d)};oe.I=3;var qe=function qe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return qe.g(arguments[0]);case 2:return qe.a(arguments[0],arguments[1]);default:return qe.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};qe.g=function(a){return a};
qe.a=function(a,b){return null==a?null:qc(a,b)};qe.o=function(a,b,c){for(;;){if(null==a)return null;a=qe.a(a,b);if(r(c))b=D(c),c=F(c);else return a}};qe.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return qe.o(b,a,c)};qe.I=2;function re(a){var b=la(a);return b?b:null!=a?a.wg?!0:a.Qd?!1:Nb(Zb,a):Nb(Zb,a)}function se(a,b){this.v=a;this.B=b;this.l=393217;this.L=0}h=se.prototype;h.V=function(){return this.B};h.Y=function(a,b){return new se(this.v,b)};h.wg=!0;
h.call=function(){function a(a,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I,J,Q,R){a=this;return te.Fd?te.Fd(a.v,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I,J,Q,R):te.call(null,a.v,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I,J,Q,R)}function b(a,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I,J,Q){a=this;return a.v.Ra?a.v.Ra(b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I,J,Q):a.v.call(null,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I,J,Q)}function c(a,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I,J){a=this;return a.v.Qa?a.v.Qa(b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I,
J):a.v.call(null,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I,J)}function d(a,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I){a=this;return a.v.Pa?a.v.Pa(b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I):a.v.call(null,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L,I)}function e(a,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L){a=this;return a.v.Oa?a.v.Oa(b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L):a.v.call(null,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K,L)}function f(a,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K){a=this;return a.v.Na?a.v.Na(b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K):a.v.call(null,
b,c,d,e,f,g,l,m,n,p,z,u,w,v,E,K)}function g(a,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E){a=this;return a.v.Ma?a.v.Ma(b,c,d,e,f,g,l,m,n,p,z,u,w,v,E):a.v.call(null,b,c,d,e,f,g,l,m,n,p,z,u,w,v,E)}function l(a,b,c,d,e,f,g,l,m,n,p,z,u,w,v){a=this;return a.v.La?a.v.La(b,c,d,e,f,g,l,m,n,p,z,u,w,v):a.v.call(null,b,c,d,e,f,g,l,m,n,p,z,u,w,v)}function m(a,b,c,d,e,f,g,l,m,n,p,z,u,w){a=this;return a.v.Ka?a.v.Ka(b,c,d,e,f,g,l,m,n,p,z,u,w):a.v.call(null,b,c,d,e,f,g,l,m,n,p,z,u,w)}function n(a,b,c,d,e,f,g,l,m,n,p,z,u){a=this;
return a.v.Ja?a.v.Ja(b,c,d,e,f,g,l,m,n,p,z,u):a.v.call(null,b,c,d,e,f,g,l,m,n,p,z,u)}function p(a,b,c,d,e,f,g,l,m,n,p,z){a=this;return a.v.Ia?a.v.Ia(b,c,d,e,f,g,l,m,n,p,z):a.v.call(null,b,c,d,e,f,g,l,m,n,p,z)}function u(a,b,c,d,e,f,g,l,m,n,p){a=this;return a.v.Ha?a.v.Ha(b,c,d,e,f,g,l,m,n,p):a.v.call(null,b,c,d,e,f,g,l,m,n,p)}function w(a,b,c,d,e,f,g,l,m,n){a=this;return a.v.Ua?a.v.Ua(b,c,d,e,f,g,l,m,n):a.v.call(null,b,c,d,e,f,g,l,m,n)}function v(a,b,c,d,e,f,g,l,m){a=this;return a.v.Ta?a.v.Ta(b,c,
d,e,f,g,l,m):a.v.call(null,b,c,d,e,f,g,l,m)}function E(a,b,c,d,e,f,g,l){a=this;return a.v.Sa?a.v.Sa(b,c,d,e,f,g,l):a.v.call(null,b,c,d,e,f,g,l)}function I(a,b,c,d,e,f,g){a=this;return a.v.xa?a.v.xa(b,c,d,e,f,g):a.v.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=this;return a.v.X?a.v.X(b,c,d,e,f):a.v.call(null,b,c,d,e,f)}function L(a,b,c,d,e){a=this;return a.v.J?a.v.J(b,c,d,e):a.v.call(null,b,c,d,e)}function K(a,b,c,d){a=this;return a.v.h?a.v.h(b,c,d):a.v.call(null,b,c,d)}function Q(a,b,c){a=this;
return a.v.a?a.v.a(b,c):a.v.call(null,b,c)}function R(a,b){a=this;return a.v.g?a.v.g(b):a.v.call(null,b)}function na(a){a=this;return a.v.D?a.v.D():a.v.call(null)}var J=null,J=function(ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb,Nc,Ad,Rh){switch(arguments.length){case 1:return na.call(this,ma);case 2:return R.call(this,ma,W);case 3:return Q.call(this,ma,W,da);case 4:return K.call(this,ma,W,da,fa);case 5:return L.call(this,ma,W,da,fa,ka);case 6:return z.call(this,ma,W,da,fa,ka,U);case 7:return I.call(this,
ma,W,da,fa,ka,U,oa);case 8:return E.call(this,ma,W,da,fa,ka,U,oa,J);case 9:return v.call(this,ma,W,da,fa,ka,U,oa,J,ta);case 10:return w.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua);case 11:return u.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua,va);case 12:return p.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea);case 13:return n.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea,La);case 14:return m.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea,La,Qa);case 15:return l.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea,La,Qa,Ua);case 16:return g.call(this,
ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea,La,Qa,Ua,gb);case 17:return f.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea,La,Qa,Ua,gb,kb);case 18:return e.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb);case 19:return d.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb);case 20:return c.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb,Nc);case 21:return b.call(this,ma,W,da,fa,ka,U,oa,J,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb,Nc,Ad);case 22:return a.call(this,ma,W,da,fa,ka,U,oa,
J,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb,Nc,Ad,Rh)}throw Error("Invalid arity: "+arguments.length);};J.g=na;J.a=R;J.h=Q;J.J=K;J.X=L;J.xa=z;J.Sa=I;J.Ta=E;J.Ua=v;J.Ha=w;J.Ia=u;J.Ja=p;J.Ka=n;J.La=m;J.Ma=l;J.Na=g;J.Oa=f;J.Pa=e;J.Qa=d;J.Ra=c;J.re=b;J.Fd=a;return J}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.D=function(){return this.v.D?this.v.D():this.v.call(null)};h.g=function(a){return this.v.g?this.v.g(a):this.v.call(null,a)};
h.a=function(a,b){return this.v.a?this.v.a(a,b):this.v.call(null,a,b)};h.h=function(a,b,c){return this.v.h?this.v.h(a,b,c):this.v.call(null,a,b,c)};h.J=function(a,b,c,d){return this.v.J?this.v.J(a,b,c,d):this.v.call(null,a,b,c,d)};h.X=function(a,b,c,d,e){return this.v.X?this.v.X(a,b,c,d,e):this.v.call(null,a,b,c,d,e)};h.xa=function(a,b,c,d,e,f){return this.v.xa?this.v.xa(a,b,c,d,e,f):this.v.call(null,a,b,c,d,e,f)};
h.Sa=function(a,b,c,d,e,f,g){return this.v.Sa?this.v.Sa(a,b,c,d,e,f,g):this.v.call(null,a,b,c,d,e,f,g)};h.Ta=function(a,b,c,d,e,f,g,l){return this.v.Ta?this.v.Ta(a,b,c,d,e,f,g,l):this.v.call(null,a,b,c,d,e,f,g,l)};h.Ua=function(a,b,c,d,e,f,g,l,m){return this.v.Ua?this.v.Ua(a,b,c,d,e,f,g,l,m):this.v.call(null,a,b,c,d,e,f,g,l,m)};h.Ha=function(a,b,c,d,e,f,g,l,m,n){return this.v.Ha?this.v.Ha(a,b,c,d,e,f,g,l,m,n):this.v.call(null,a,b,c,d,e,f,g,l,m,n)};
h.Ia=function(a,b,c,d,e,f,g,l,m,n,p){return this.v.Ia?this.v.Ia(a,b,c,d,e,f,g,l,m,n,p):this.v.call(null,a,b,c,d,e,f,g,l,m,n,p)};h.Ja=function(a,b,c,d,e,f,g,l,m,n,p,u){return this.v.Ja?this.v.Ja(a,b,c,d,e,f,g,l,m,n,p,u):this.v.call(null,a,b,c,d,e,f,g,l,m,n,p,u)};h.Ka=function(a,b,c,d,e,f,g,l,m,n,p,u,w){return this.v.Ka?this.v.Ka(a,b,c,d,e,f,g,l,m,n,p,u,w):this.v.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w)};
h.La=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v){return this.v.La?this.v.La(a,b,c,d,e,f,g,l,m,n,p,u,w,v):this.v.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v)};h.Ma=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E){return this.v.Ma?this.v.Ma(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E):this.v.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E)};h.Na=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I){return this.v.Na?this.v.Na(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I):this.v.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I)};
h.Oa=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z){return this.v.Oa?this.v.Oa(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z):this.v.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z)};h.Pa=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L){return this.v.Pa?this.v.Pa(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L):this.v.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L)};
h.Qa=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K){return this.v.Qa?this.v.Qa(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K):this.v.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K)};h.Ra=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q){return this.v.Ra?this.v.Ra(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q):this.v.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q)};
h.re=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R){return te.Fd?te.Fd(this.v,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R):te.call(null,this.v,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R)};function fe(a,b){return la(a)?new se(a,b):null==a?null:Fc(a,b)}function ue(a){var b=null!=a;return(b?null!=a?a.l&131072||a.Fg||(a.l?0:Nb(Dc,a)):Nb(Dc,a):b)?Ec(a):null}
var we=function we(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return we.g(arguments[0]);case 2:return we.a(arguments[0],arguments[1]);default:return we.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};we.g=function(a){return a};we.a=function(a,b){return null==a?null:vc(a,b)};we.o=function(a,b,c){for(;;){if(null==a)return null;a=we.a(a,b);if(r(c))b=D(c),c=F(c);else return a}};
we.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return we.o(b,a,c)};we.I=2;function xe(a){return null==a||Mb(B(a))}function ye(a){return null==a?!1:null!=a?a.l&8||a.ih?!0:a.l?!1:Nb(ec,a):Nb(ec,a)}function ze(a){return null==a?!1:null!=a?a.l&4096||a.ph?!0:a.l?!1:Nb(uc,a):Nb(uc,a)}function Ae(a){return null!=a?a.l&16777216||a.oh?!0:a.l?!1:Nb(Pc,a):Nb(Pc,a)}function Be(a){return null==a?!1:null!=a?a.l&1024||a.Dg?!0:a.l?!1:Nb(pc,a):Nb(pc,a)}
function Ce(a){return null!=a?a.l&67108864||a.mh?!0:a.l?!1:Nb(Rc,a):Nb(Rc,a)}function De(a){return null!=a?a.l&16384||a.qh?!0:a.l?!1:Nb(zc,a):Nb(zc,a)}function Ee(a){return null!=a?a.L&512||a.hh?!0:!1:!1}function Fe(a){var b=[];Xa(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Ge(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var He={};function Ie(a){return null==a?!1:null!=a?a.l&64||a.M?!0:a.l?!1:Nb(hc,a):Nb(hc,a)}function Je(a){return null==a?!1:!1===a?!1:!0}
function Ke(a){var b=re(a);return b?b:null!=a?a.l&1||a.kh?!0:a.l?!1:Nb($b,a):Nb($b,a)}function Le(a,b){return A.h(a,b,He)===He?!1:!0}
function Me(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return wb(a,b);throw Error([t("Cannot compare "),t(a),t(" to "),t(b)].join(""));}if(null!=a?a.L&2048||a.Kc||(a.L?0:Nb(dd,a)):Nb(dd,a))return ed(a,b);if("string"!==typeof a&&!Kb(a)&&!0!==a&&!1!==a||Ob(a)!==Ob(b))throw Error([t("Cannot compare "),t(a),t(" to "),t(b)].join(""));return wb(a,b)}
function Ne(a,b){var c=M(a),d=M(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=Me(Yd(a,d),Yd(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function Oe(a){return Gd.a(a,Me)?Me:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:r(d)?-1:r(a.a?a.a(c,b):a.call(null,c,b))?1:0}}function Pe(a,b){if(B(b)){var c=Qe.g?Qe.g(b):Qe.call(null,b),d=Oe(a);xb(c,d);return B(c)}return Fd}function Se(a,b){return Te(a,b)}
function Te(a,b){return Pe(function(b,d){return Oe(Me).call(null,a.g?a.g(b):a.call(null,b),a.g?a.g(d):a.call(null,d))},b)}function he(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return ge(arguments[0],arguments[1]);case 3:return ie(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}
function ge(a,b){var c=B(b);if(c){var d=D(c),c=F(c);return Wb?Wb(a,d,c):Yb.call(null,a,d,c)}return a.D?a.D():a.call(null)}function ie(a,b,c){for(c=B(c);;)if(c){var d=D(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Qd(b))return Cc(b);c=F(c)}else return b}
function Yb(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return Ue(arguments[0],arguments[1]);case 3:return Wb(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}function Ue(a,b){return null!=b&&(b.l&524288||b.Gg)?b.Fa(null,a):Kb(b)?Td(b,a):"string"===typeof b?Td(b,a):Nb(Gc,b)?Hc.a(b,a):ge(a,b)}
function Wb(a,b,c){return null!=c&&(c.l&524288||c.Gg)?c.Ga(null,a,b):Kb(c)?Ud(c,a,b):"string"===typeof c?Ud(c,a,b):Nb(Gc,c)?Hc.h(c,a,b):ie(a,b,c)}function Ve(a,b,c){return null!=c?Ic(c,a,b):b}function We(a){return a}function Xe(a,b,c,d){a=a.g?a.g(b):a.call(null,b);c=Wb(a,c,d);return a.g?a.g(c):a.call(null,c)}
var Ye=function Ye(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ye.D();case 1:return Ye.g(arguments[0]);case 2:return Ye.a(arguments[0],arguments[1]);default:return Ye.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};Ye.D=function(){return 0};Ye.g=function(a){return a};Ye.a=function(a,b){return a+b};Ye.o=function(a,b,c){return Wb(Ye,a+b,c)};Ye.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return Ye.o(b,a,c)};Ye.I=2;
var Ze=function Ze(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ze.g(arguments[0]);case 2:return Ze.a(arguments[0],arguments[1]);default:return Ze.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};Ze.g=function(a){return-a};Ze.a=function(a,b){return a-b};Ze.o=function(a,b,c){return Wb(Ze,a-b,c)};Ze.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return Ze.o(b,a,c)};Ze.I=2;function $e(a){return a-1}
var af=function af(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return af.g(arguments[0]);case 2:return af.a(arguments[0],arguments[1]);default:return af.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};af.g=function(a){return a};af.a=function(a,b){return a>b?a:b};af.o=function(a,b,c){return Wb(af,a>b?a:b,c)};af.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return af.o(b,a,c)};af.I=2;
var bf=function bf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return bf.g(arguments[0]);case 2:return bf.a(arguments[0],arguments[1]);default:return bf.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};bf.g=function(a){return a};bf.a=function(a,b){return a<b?a:b};bf.o=function(a,b,c){return Wb(bf,a<b?a:b,c)};bf.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return bf.o(b,a,c)};bf.I=2;
function cf(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function df(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function ef(a,b){for(var c=b,d=B(a);;)if(d&&0<c)--c,d=F(d);else return d}var t=function t(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return t.D();case 1:return t.g(arguments[0]);default:return t.o(arguments[0],new C(c.slice(1),0,null))}};t.D=function(){return""};
t.g=function(a){return null==a?"":""+a};t.o=function(a,b){for(var c=new db(""+t(a)),d=b;;)if(r(d))c=c.append(""+t(D(d))),d=F(d);else return c.toString()};t.H=function(a){var b=D(a);a=F(a);return t.o(b,a)};t.I=1;function ce(a,b){var c;if(Ae(b))if(Wd(a)&&Wd(b)&&M(a)!==M(b))c=!1;else a:{c=B(a);for(var d=B(b);;){if(null==c){c=null==d;break a}if(null!=d&&Gd.a(D(c),D(d)))c=F(c),d=F(d);else{c=!1;break a}}}else c=null;return Je(c)}
function ff(a){var b=0;for(a=B(a);;)if(a){var c=D(a),b=(b+(zd(gf.g?gf.g(c):gf.call(null,c))^zd(hf.g?hf.g(c):hf.call(null,c))))%4503599627370496;a=F(a)}else return b}function jf(a,b,c,d,e){this.B=a;this.first=b;this.Vb=c;this.count=d;this.A=e;this.l=65937646;this.L=8192}h=jf.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,this.count)}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.Ea=function(){return new jf(this.B,this.first,this.Vb,this.count,this.A)};h.lb=function(){return 1===this.count?null:this.Vb};h.ba=function(){return this.count};h.vc=function(){return this.first};
h.wc=function(){return jc(this)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};h.ta=function(){return Fc(Fd,this.B)};h.Fa=function(a,b){return ge(b,this)};h.Ga=function(a,b,c){return ie(b,c,this)};h.Da=function(){return this.first};h.bb=function(){return 1===this.count?Fd:this.Vb};h.Z=function(){return this};h.Y=function(a,b){return new jf(b,this.first,this.Vb,this.count,this.A)};h.ia=function(a,b){return new jf(this.B,b,this,this.count+1,null)};
function kf(a){return null!=a?a.l&33554432||a.lh?!0:a.l?!1:Nb(Qc,a):Nb(Qc,a)}jf.prototype[Rb]=function(){return Id(this)};function lf(a){this.B=a;this.l=65937614;this.L=8192}h=lf.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.Ea=function(){return new lf(this.B)};h.lb=function(){return null};h.ba=function(){return 0};h.vc=function(){return null};h.wc=function(){throw Error("Can't pop empty list");};h.S=function(){return Ld};
h.K=function(a,b){return kf(b)||Ae(b)?null==B(b):!1};h.ta=function(){return this};h.Fa=function(a,b){return ge(b,this)};h.Ga=function(a,b,c){return ie(b,c,this)};h.Da=function(){return null};h.bb=function(){return Fd};h.Z=function(){return null};h.Y=function(a,b){return new lf(b)};h.ia=function(a,b){return new jf(this.B,b,null,1,null)};var Fd=new lf(null);lf.prototype[Rb]=function(){return Id(this)};function mf(a){return(null!=a?a.l&134217728||a.nh||(a.l?0:Nb(Sc,a)):Nb(Sc,a))?Tc(a):Wb(le,Fd,a)}
var nf=function nf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return nf.o(0<c.length?new C(c.slice(0),0,null):null)};nf.o=function(a){var b;if(a instanceof C&&0===a.F)b=a.j;else a:for(b=[];;)if(null!=a)b.push(a.Da(null)),a=a.lb(null);else break a;a=b.length;for(var c=Fd;;)if(0<a){var d=a-1,c=c.ia(null,b[a-1]);a=d}else return c};nf.I=0;nf.H=function(a){return nf.o(B(a))};
function of(a,b,c,d){this.B=a;this.first=b;this.Vb=c;this.A=d;this.l=65929452;this.L=8192}h=of.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.Ea=function(){return new of(this.B,this.first,this.Vb,this.A)};h.lb=function(){return null==this.Vb?null:B(this.Vb)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};
h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(Fd,this.B)};h.Fa=function(a,b){return ge(b,this)};h.Ga=function(a,b,c){return ie(b,c,this)};h.Da=function(){return this.first};h.bb=function(){return null==this.Vb?Fd:this.Vb};h.Z=function(){return this};h.Y=function(a,b){return new of(b,this.first,this.Vb,this.A)};h.ia=function(a,b){return new of(null,b,this,null)};of.prototype[Rb]=function(){return Id(this)};
function de(a,b){var c=null==b;return(c?c:null!=b&&(b.l&64||b.M))?new of(null,a,b,null):new of(null,a,B(b),null)}function pf(a,b){if(a.Va===b.Va)return 0;var c=Mb(a.kb);if(r(c?b.kb:c))return-1;if(r(a.kb)){if(Mb(b.kb))return 1;c=wb(a.kb,b.kb);return 0===c?wb(a.name,b.name):c}return wb(a.name,b.name)}function P(a,b,c,d){this.kb=a;this.name=b;this.Va=c;this.ad=d;this.l=2153775105;this.L=4096}h=P.prototype;h.toString=function(){return[t(":"),t(this.Va)].join("")};
h.equiv=function(a){return this.K(null,a)};h.K=function(a,b){return b instanceof P?this.Va===b.Va:!1};h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return A.a(c,this);case 3:return A.h(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return A.a(c,this)};a.h=function(a,c,d){return A.h(c,this,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return A.a(a,this)};
h.a=function(a,b){return A.h(a,this,b)};h.S=function(){var a=this.ad;return null!=a?a:this.ad=a=Bd(vd(this.name),yd(this.kb))+2654435769|0};h.Jd=function(){return this.name};h.Kd=function(){return this.kb};h.U=function(a,b){return Uc(b,[t(":"),t(this.Va)].join(""))};function qf(a,b){return a===b?!0:a instanceof P&&b instanceof P?a.Va===b.Va:!1}
var rf=function rf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return rf.g(arguments[0]);case 2:return rf.a(arguments[0],arguments[1]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};
rf.g=function(a){if(a instanceof P)return a;if(a instanceof y){var b;if(null!=a&&(a.L&4096||a.Pf))b=a.Kd(null);else throw Error([t("Doesn't support namespace: "),t(a)].join(""));return new P(b,sf.g?sf.g(a):sf.call(null,a),a.mb,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new P(b[0],b[1],a,null):new P(null,b[0],a,null)):null};rf.a=function(a,b){return new P(a,b,[t(r(a)?[t(a),t("/")].join(""):null),t(b)].join(""),null)};rf.I=2;
function tf(a,b,c,d){this.B=a;this.md=b;this.da=c;this.A=d;this.l=32374988;this.L=1}h=tf.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};function wf(a){null!=a.md&&(a.da=a.md.D?a.md.D():a.md.call(null),a.md=null);return a.da}
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.lb=function(){Oc(this);return null==this.da?null:F(this.da)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};
h.ta=function(){return fe(Fd,this.B)};h.Fa=function(a,b){return ge(b,this)};h.Ga=function(a,b,c){return ie(b,c,this)};h.Da=function(){Oc(this);return null==this.da?null:D(this.da)};h.bb=function(){Oc(this);return null!=this.da?Ed(this.da):Fd};h.Z=function(){wf(this);if(null==this.da)return null;for(var a=this.da;;)if(a instanceof tf)a=wf(a);else return this.da=a,B(this.da)};h.Y=function(a,b){return new tf(b,this.md,this.da,this.A)};h.ia=function(a,b){return de(b,this)};tf.prototype[Rb]=function(){return Id(this)};
function xf(a,b){this.aa=a;this.end=b;this.l=2;this.L=0}xf.prototype.add=function(a){this.aa[this.end]=a;return this.end+=1};xf.prototype.Ca=function(){var a=new yf(this.aa,0,this.end);this.aa=null;return a};xf.prototype.ba=function(){return this.end};function zf(a){return new xf(Array(a),0)}function yf(a,b,c){this.j=a;this.off=b;this.end=c;this.l=524306;this.L=0}h=yf.prototype;h.ba=function(){return this.end-this.off};h.N=function(a,b){return this.j[this.off+b]};
h.ab=function(a,b,c){return 0<=b&&b<this.end-this.off?this.j[this.off+b]:c};h.Of=function(){if(this.off===this.end)throw Error("-drop-first of empty chunk");return new yf(this.j,this.off+1,this.end)};h.Fa=function(a,b){return Vd(this.j,b,this.j[this.off],this.off+1)};h.Ga=function(a,b,c){return Vd(this.j,b,c,this.off)};function Af(a,b,c,d){this.Ca=a;this.ac=b;this.B=c;this.A=d;this.l=31850732;this.L=1536}h=Af.prototype;h.toString=function(){return qd(this)};
h.equiv=function(a){return this.K(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.lb=function(){if(1<cc(this.Ca))return new Af(fd(this.Ca),this.ac,this.B,null);var a=Oc(this.ac);return null==a?null:a};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};
h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(Fd,this.B)};h.Da=function(){return gc.a(this.Ca,0)};h.bb=function(){return 1<cc(this.Ca)?new Af(fd(this.Ca),this.ac,this.B,null):null==this.ac?Fd:this.ac};h.Z=function(){return this};h.bf=function(){return this.Ca};h.cf=function(){return null==this.ac?Fd:this.ac};h.Y=function(a,b){return new Af(this.Ca,this.ac,b,this.A)};h.ia=function(a,b){return de(b,this)};h.af=function(){return null==this.ac?null:this.ac};Af.prototype[Rb]=function(){return Id(this)};
function Bf(a,b){return 0===cc(a)?b:new Af(a,b,null,null)}function Cf(a,b){a.add(b)}function Qe(a){for(var b=[];;)if(B(a))b.push(D(a)),a=F(a);else return b}function Df(a,b){if(Wd(a))return M(a);for(var c=a,d=b,e=0;;)if(0<d&&B(c))c=F(c),--d,e+=1;else return e}
var Ef=function Ef(b){return null==b?null:null==F(b)?B(D(b)):de(D(b),Ef(F(b)))},Ff=function Ff(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ff.D();case 1:return Ff.g(arguments[0]);case 2:return Ff.a(arguments[0],arguments[1]);default:return Ff.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};Ff.D=function(){return new tf(null,function(){return null},null,null)};
Ff.g=function(a){return new tf(null,function(){return a},null,null)};Ff.a=function(a,b){return new tf(null,function(){var c=B(a);return c?Ee(c)?Bf(gd(c),Ff.a(hd(c),b)):de(D(c),Ff.a(Ed(c),b)):b},null,null)};Ff.o=function(a,b,c){return function e(a,b){return new tf(null,function(){var c=B(a);return c?Ee(c)?Bf(gd(c),e(hd(c),b)):de(D(c),e(Ed(c),b)):r(b)?e(D(b),F(b)):null},null,null)}(Ff.a(a,b),c)};Ff.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return Ff.o(b,a,c)};Ff.I=2;
function Gf(a){return ad(a)}var Hf=function Hf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Hf.D();case 1:return Hf.g(arguments[0]);case 2:return Hf.a(arguments[0],arguments[1]);default:return Hf.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};Hf.D=function(){return Zc(me)};Hf.g=function(a){return a};Hf.a=function(a,b){return $c(a,b)};Hf.o=function(a,b,c){for(;;)if(a=$c(a,b),r(c))b=D(c),c=F(c);else return a};
Hf.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return Hf.o(b,a,c)};Hf.I=2;
function If(a,b,c){var d=B(c);if(0===b)return a.D?a.D():a.call(null);c=ic(d);var e=jc(d);if(1===b)return a.g?a.g(c):a.g?a.g(c):a.call(null,c);var d=ic(e),f=jc(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=ic(f),g=jc(f);if(3===b)return a.h?a.h(c,d,e):a.h?a.h(c,d,e):a.call(null,c,d,e);var f=ic(g),l=jc(g);if(4===b)return a.J?a.J(c,d,e,f):a.J?a.J(c,d,e,f):a.call(null,c,d,e,f);var g=ic(l),m=jc(l);if(5===b)return a.X?a.X(c,d,e,f,g):a.X?a.X(c,d,e,f,g):a.call(null,c,d,e,f,g);var l=ic(m),
n=jc(m);if(6===b)return a.xa?a.xa(c,d,e,f,g,l):a.xa?a.xa(c,d,e,f,g,l):a.call(null,c,d,e,f,g,l);var m=ic(n),p=jc(n);if(7===b)return a.Sa?a.Sa(c,d,e,f,g,l,m):a.Sa?a.Sa(c,d,e,f,g,l,m):a.call(null,c,d,e,f,g,l,m);var n=ic(p),u=jc(p);if(8===b)return a.Ta?a.Ta(c,d,e,f,g,l,m,n):a.Ta?a.Ta(c,d,e,f,g,l,m,n):a.call(null,c,d,e,f,g,l,m,n);var p=ic(u),w=jc(u);if(9===b)return a.Ua?a.Ua(c,d,e,f,g,l,m,n,p):a.Ua?a.Ua(c,d,e,f,g,l,m,n,p):a.call(null,c,d,e,f,g,l,m,n,p);var u=ic(w),v=jc(w);if(10===b)return a.Ha?a.Ha(c,
d,e,f,g,l,m,n,p,u):a.Ha?a.Ha(c,d,e,f,g,l,m,n,p,u):a.call(null,c,d,e,f,g,l,m,n,p,u);var w=ic(v),E=jc(v);if(11===b)return a.Ia?a.Ia(c,d,e,f,g,l,m,n,p,u,w):a.Ia?a.Ia(c,d,e,f,g,l,m,n,p,u,w):a.call(null,c,d,e,f,g,l,m,n,p,u,w);var v=ic(E),I=jc(E);if(12===b)return a.Ja?a.Ja(c,d,e,f,g,l,m,n,p,u,w,v):a.Ja?a.Ja(c,d,e,f,g,l,m,n,p,u,w,v):a.call(null,c,d,e,f,g,l,m,n,p,u,w,v);var E=ic(I),z=jc(I);if(13===b)return a.Ka?a.Ka(c,d,e,f,g,l,m,n,p,u,w,v,E):a.Ka?a.Ka(c,d,e,f,g,l,m,n,p,u,w,v,E):a.call(null,c,d,e,f,g,l,m,
n,p,u,w,v,E);var I=ic(z),L=jc(z);if(14===b)return a.La?a.La(c,d,e,f,g,l,m,n,p,u,w,v,E,I):a.La?a.La(c,d,e,f,g,l,m,n,p,u,w,v,E,I):a.call(null,c,d,e,f,g,l,m,n,p,u,w,v,E,I);var z=ic(L),K=jc(L);if(15===b)return a.Ma?a.Ma(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z):a.Ma?a.Ma(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z):a.call(null,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z);var L=ic(K),Q=jc(K);if(16===b)return a.Na?a.Na(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L):a.Na?a.Na(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L):a.call(null,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L);var K=
ic(Q),R=jc(Q);if(17===b)return a.Oa?a.Oa(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K):a.Oa?a.Oa(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K):a.call(null,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K);var Q=ic(R),na=jc(R);if(18===b)return a.Pa?a.Pa(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q):a.Pa?a.Pa(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q):a.call(null,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q);R=ic(na);na=jc(na);if(19===b)return a.Qa?a.Qa(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R):a.Qa?a.Qa(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R):a.call(null,c,d,e,
f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R);var J=ic(na);jc(na);if(20===b)return a.Ra?a.Ra(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R,J):a.Ra?a.Ra(c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R,J):a.call(null,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R,J);throw Error("Only up to 20 arguments supported on functions");}
function te(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return S(arguments[0],arguments[1]);case 3:return Jf(arguments[0],arguments[1],arguments[2]);case 4:return Kf(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Lf(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return Mf(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new C(b.slice(5),0,null))}}
function S(a,b){var c=a.I;if(a.H){var d=Df(b,c+1);return d<=c?If(a,d,b):a.H(b)}return a.apply(a,Qe(b))}function Jf(a,b,c){b=de(b,c);c=a.I;if(a.H){var d=Df(b,c+1);return d<=c?If(a,d,b):a.H(b)}return a.apply(a,Qe(b))}function Kf(a,b,c,d){b=de(b,de(c,d));c=a.I;return a.H?(d=Df(b,c+1),d<=c?If(a,d,b):a.H(b)):a.apply(a,Qe(b))}function Lf(a,b,c,d,e){b=de(b,de(c,de(d,e)));c=a.I;return a.H?(d=Df(b,c+1),d<=c?If(a,d,b):a.H(b)):a.apply(a,Qe(b))}
function Mf(a,b,c,d,e,f){b=de(b,de(c,de(d,de(e,Ef(f)))));c=a.I;return a.H?(d=Df(b,c+1),d<=c?If(a,d,b):a.H(b)):a.apply(a,Qe(b))}function Nf(a,b){return!Gd.a(a,b)}function Of(a){return B(a)?a:null}
var Pf=function Pf(){"undefined"===typeof yb&&(yb=function(a,c){this.Xg=a;this.Qg=c;this.l=393216;this.L=0},yb.prototype.Y=function(a,c){return new yb(this.Xg,c)},yb.prototype.V=function(){return this.Qg},yb.prototype.Ya=function(){return!1},yb.prototype.next=function(){return Error("No such element")},yb.prototype.remove=function(){return Error("Unsupported operation")},yb.Ud=function(){return new T(null,2,5,V,[fe(Qf,new q(null,1,[Rf,nf(Sf,nf(me))],null)),Tf],null)},yb.Oc=!0,yb.hc="cljs.core/t_cljs$core10138",
yb.jd=function(a,c){return Uc(c,"cljs.core/t_cljs$core10138")});return new yb(Pf,Uf)};function Vf(a,b){for(;;){if(null==B(b))return!0;var c;c=D(b);c=a.g?a.g(c):a.call(null,c);if(r(c)){c=a;var d=F(b);a=c;b=d}else return!1}}function Wf(a,b){for(;;)if(B(b)){var c;c=D(b);c=a.g?a.g(c):a.call(null,c);if(r(c))return c;c=a;var d=F(b);a=c;b=d}else return null}
function Xf(a){return function(){function b(b,c){return Mb(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Mb(a.g?a.g(b):a.call(null,b))}function d(){return Mb(a.D?a.D():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new C(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Mb(Kf(a,b,d,e))}b.I=2;b.H=function(a){var b=D(a);a=F(a);var d=D(a);a=Ed(a);return c(b,d,a)};b.o=c;
return b}(),e=function(a,e,m){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new C(p,0)}return f.o(a,e,n)}throw Error("Invalid arity: "+arguments.length);};e.I=2;e.H=f.H;e.D=d;e.g=c;e.a=b;e.o=f.o;return e}()}
function Yf(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return!1}a.I=0;a.H=function(a){B(a);return!1};a.o=function(){return!1};return a}()}
var Zf=function Zf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Zf.D();case 1:return Zf.g(arguments[0]);case 2:return Zf.a(arguments[0],arguments[1]);case 3:return Zf.h(arguments[0],arguments[1],arguments[2]);default:return Zf.o(arguments[0],arguments[1],arguments[2],new C(c.slice(3),0,null))}};Zf.D=function(){return We};Zf.g=function(a){return a};
Zf.a=function(a,b){return function(){function c(c,d,e){c=b.h?b.h(c,d,e):b.call(null,c,d,e);return a.g?a.g(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.g?a.g(e):a.call(null,e)}function e(c){c=b.g?b.g(c):b.call(null,c);return a.g?a.g(c):a.call(null,c)}function f(){var c=b.D?b.D():b.call(null);return a.g?a.g(c):a.call(null,c)}var g=null,l=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+
3],++g;g=new C(l,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=Lf(b,c,e,f,g);return a.g?a.g(c):a.call(null,c)}c.I=3;c.H=function(a){var b=D(a);a=F(a);var c=D(a);a=F(a);var e=D(a);a=Ed(a);return d(b,c,e,a)};c.o=d;return c}(),g=function(a,b,g,u){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var w=null;if(3<arguments.length){for(var w=0,v=Array(arguments.length-3);w<v.length;)v[w]=arguments[w+
3],++w;w=new C(v,0)}return l.o(a,b,g,w)}throw Error("Invalid arity: "+arguments.length);};g.I=3;g.H=l.H;g.D=f;g.g=e;g.a=d;g.h=c;g.o=l.o;return g}()};
Zf.h=function(a,b,c){return function(){function d(d,e,f){d=c.h?c.h(d,e,f):c.call(null,d,e,f);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.g?b.g(f):b.call(null,f);return a.g?a.g(f):a.call(null,f)}function f(d){d=c.g?c.g(d):c.call(null,d);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}function g(){var d;d=c.D?c.D():c.call(null);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}var l=null,m=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+3],++g;g=new C(l,0)}return e.call(this,a,b,c,g)}function e(d,f,g,l){d=Lf(c,d,f,g,l);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}d.I=3;d.H=function(a){var b=D(a);a=F(a);var c=D(a);a=F(a);var d=D(a);a=Ed(a);return e(b,c,d,a)};d.o=e;return d}(),l=function(a,b,c,l){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var v=null;if(3<arguments.length){for(var v=0,E=Array(arguments.length-3);v<E.length;)E[v]=arguments[v+3],++v;v=new C(E,0)}return m.o(a,b,c,v)}throw Error("Invalid arity: "+arguments.length);};l.I=3;l.H=m.H;l.D=g;l.g=f;l.a=e;l.h=d;l.o=m.o;return l}()};
Zf.o=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new C(e,0)}return c.call(this,d)}function c(b){b=S(D(a),b);for(var d=F(a);;)if(d)b=D(d).call(null,b),d=F(d);else return b}b.I=0;b.H=function(a){a=B(a);return c(a)};b.o=c;return b}()}(mf(de(a,de(b,de(c,d)))))};Zf.H=function(a){var b=D(a),c=F(a);a=D(c);var d=F(c),c=D(d),d=F(d);return Zf.o(b,a,c,d)};Zf.I=3;
var $f=function $f(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return $f.g(arguments[0]);case 2:return $f.a(arguments[0],arguments[1]);case 3:return $f.h(arguments[0],arguments[1],arguments[2]);case 4:return $f.J(arguments[0],arguments[1],arguments[2],arguments[3]);default:return $f.o(arguments[0],arguments[1],arguments[2],arguments[3],new C(c.slice(4),0,null))}};$f.g=function(a){return a};
$f.a=function(a,b){return function(){function c(c,d,e){return a.J?a.J(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.h?a.h(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.g?a.g(b):a.call(null,b)}var g=null,l=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+3],++g;g=new C(l,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return Mf(a,b,c,e,f,N([g],0))}c.I=
3;c.H=function(a){var b=D(a);a=F(a);var c=D(a);a=F(a);var e=D(a);a=Ed(a);return d(b,c,e,a)};c.o=d;return c}(),g=function(a,b,g,u){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var w=null;if(3<arguments.length){for(var w=0,v=Array(arguments.length-3);w<v.length;)v[w]=arguments[w+3],++w;w=new C(v,0)}return l.o(a,b,g,w)}throw Error("Invalid arity: "+arguments.length);};g.I=3;g.H=l.H;g.D=f;g.g=e;
g.a=d;g.h=c;g.o=l.o;return g}()};
$f.h=function(a,b,c){return function(){function d(d,e,f){return a.X?a.X(b,c,d,e,f):a.call(null,b,c,d,e,f)}function e(d,e){return a.J?a.J(b,c,d,e):a.call(null,b,c,d,e)}function f(d){return a.h?a.h(b,c,d):a.call(null,b,c,d)}function g(){return a.a?a.a(b,c):a.call(null,b,c)}var l=null,m=function(){function d(a,b,c,f){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+3],++g;g=new C(l,0)}return e.call(this,a,b,c,g)}function e(d,f,g,l){return Mf(a,b,
c,d,f,N([g,l],0))}d.I=3;d.H=function(a){var b=D(a);a=F(a);var c=D(a);a=F(a);var d=D(a);a=Ed(a);return e(b,c,d,a)};d.o=e;return d}(),l=function(a,b,c,l){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c);default:var v=null;if(3<arguments.length){for(var v=0,E=Array(arguments.length-3);v<E.length;)E[v]=arguments[v+3],++v;v=new C(E,0)}return m.o(a,b,c,v)}throw Error("Invalid arity: "+arguments.length);};l.I=
3;l.H=m.H;l.D=g;l.g=f;l.a=e;l.h=d;l.o=m.o;return l}()};
$f.J=function(a,b,c,d){return function(){function e(e,f,g){return a.xa?a.xa(b,c,d,e,f,g):a.call(null,b,c,d,e,f,g)}function f(e,f){return a.X?a.X(b,c,d,e,f):a.call(null,b,c,d,e,f)}function g(e){return a.J?a.J(b,c,d,e):a.call(null,b,c,d,e)}function l(){return a.h?a.h(b,c,d):a.call(null,b,c,d)}var m=null,n=function(){function e(a,b,c,d){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+3],++g;g=new C(l,0)}return f.call(this,a,b,c,g)}function f(e,g,
l,m){return Mf(a,b,c,d,e,N([g,l,m],0))}e.I=3;e.H=function(a){var b=D(a);a=F(a);var c=D(a);a=F(a);var d=D(a);a=Ed(a);return f(b,c,d,a)};e.o=f;return e}(),m=function(a,b,c,d){switch(arguments.length){case 0:return l.call(this);case 1:return g.call(this,a);case 2:return f.call(this,a,b);case 3:return e.call(this,a,b,c);default:var m=null;if(3<arguments.length){for(var m=0,I=Array(arguments.length-3);m<I.length;)I[m]=arguments[m+3],++m;m=new C(I,0)}return n.o(a,b,c,m)}throw Error("Invalid arity: "+arguments.length);
};m.I=3;m.H=n.H;m.D=l;m.g=g;m.a=f;m.h=e;m.o=n.o;return m}()};$f.o=function(a,b,c,d,e){return function(){function f(a){var b=null;if(0<arguments.length){for(var b=0,c=Array(arguments.length-0);b<c.length;)c[b]=arguments[b+0],++b;b=new C(c,0)}return g.call(this,b)}function g(f){return Lf(a,b,c,d,Ff.a(e,f))}f.I=0;f.H=function(a){a=B(a);return g(a)};f.o=g;return f}()};$f.H=function(a){var b=D(a),c=F(a);a=D(c);var d=F(c),c=D(d),e=F(d),d=D(e),e=F(e);return $f.o(b,a,c,d,e)};$f.I=4;
function ag(){var a=me;return function(){function b(b,c,d){b=null==b?a:b;return le.h?le.h(b,c,d):le.call(null,b,c,d)}function c(b,c){var d=null==b?a:b;return le.a?le.a(d,c):le.call(null,d,c)}function d(b){b=null==b?a:b;return le.g?le.g(b):le.call(null,b)}var e=null,f=function(){function b(a,d,e,f){var g=null;if(3<arguments.length){for(var g=0,v=Array(arguments.length-3);g<v.length;)v[g]=arguments[g+3],++g;g=new C(v,0)}return c.call(this,a,d,e,g)}function c(b,d,e,f){return Lf(le,null==b?a:b,d,e,f)}
b.I=3;b.H=function(a){var b=D(a);a=F(a);var d=D(a);a=F(a);var e=D(a);a=Ed(a);return c(b,d,e,a)};b.o=c;return b}(),e=function(a,e,m,n){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,e);case 3:return b.call(this,a,e,m);default:var p=null;if(3<arguments.length){for(var p=0,u=Array(arguments.length-3);p<u.length;)u[p]=arguments[p+3],++p;p=new C(u,0)}return f.o(a,e,m,p)}throw Error("Invalid arity: "+arguments.length);};e.I=3;e.H=f.H;e.g=d;e.a=c;e.h=b;e.o=f.o;return e}()}
function bg(a,b){return function d(b,f){return new tf(null,function(){var g=B(f);if(g){if(Ee(g)){for(var l=gd(g),m=M(l),n=zf(m),p=0;;)if(p<m)Cf(n,function(){var d=b+p,f=gc.a(l,p);return a.a?a.a(d,f):a.call(null,d,f)}()),p+=1;else break;return Bf(n.Ca(),d(b+m,hd(g)))}return de(function(){var d=D(g);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,Ed(g)))}return null},null,null)}(0,b)}function cg(a,b,c,d){this.state=a;this.B=b;this.xd=c;this.$a=d;this.L=16386;this.l=6455296}h=cg.prototype;
h.equiv=function(a){return this.K(null,a)};h.K=function(a,b){return this===b};h.Yb=function(){return this.state};h.V=function(){return this.B};h.Nd=function(a,b,c){a=B(this.$a);for(var d=null,e=0,f=0;;)if(f<e){var g=d.N(null,f),l=O(g,0,null),g=O(g,1,null);g.J?g.J(l,this,b,c):g.call(null,l,this,b,c);f+=1}else if(a=B(a))Ee(a)?(d=gd(a),a=hd(a),l=d,e=M(d),d=l):(d=D(a),l=O(d,0,null),g=O(d,1,null),g.J?g.J(l,this,b,c):g.call(null,l,this,b,c),a=F(a),d=null,e=0),f=0;else return null};
h.Md=function(a,b,c){this.$a=oe.h(this.$a,b,c);return this};h.Od=function(a,b){return this.$a=qe.a(this.$a,b)};h.S=function(){return qa(this)};function dg(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return eg(arguments[0]);default:return c=arguments[0],b=new C(b.slice(1),0,null),d=null!=b&&(b.l&64||b.M)?S(fg,b):b,b=A.a(d,Gb),d=A.a(d,gg),new cg(c,b,d,null)}}function eg(a){return new cg(a,null,null,null)}
function hg(a,b){if(a instanceof cg){var c=a.xd;if(null!=c&&!r(c.g?c.g(b):c.call(null,b)))throw Error([t("Assert failed: "),t("Validator rejected reference state"),t("\n"),t("(validate new-value)")].join(""));c=a.state;a.state=b;null!=a.$a&&Wc(a,c,b);return b}return ld(a,b)}
var ig=function ig(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ig.a(arguments[0],arguments[1]);case 3:return ig.h(arguments[0],arguments[1],arguments[2]);case 4:return ig.J(arguments[0],arguments[1],arguments[2],arguments[3]);default:return ig.o(arguments[0],arguments[1],arguments[2],arguments[3],new C(c.slice(4),0,null))}};
ig.a=function(a,b){var c;a instanceof cg?(c=a.state,c=b.g?b.g(c):b.call(null,c),c=hg(a,c)):c=md.a(a,b);return c};ig.h=function(a,b,c){if(a instanceof cg){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=hg(a,b)}else a=md.h(a,b,c);return a};ig.J=function(a,b,c,d){if(a instanceof cg){var e=a.state;b=b.h?b.h(e,c,d):b.call(null,e,c,d);a=hg(a,b)}else a=md.J(a,b,c,d);return a};ig.o=function(a,b,c,d,e){return a instanceof cg?hg(a,Lf(b,a.state,c,d,e)):md.X(a,b,c,d,e)};
ig.H=function(a){var b=D(a),c=F(a);a=D(c);var d=F(c),c=D(d),e=F(d),d=D(e),e=F(e);return ig.o(b,a,c,d,e)};ig.I=4;function jg(a){this.state=a;this.l=32768;this.L=0}jg.prototype.Rf=function(a,b){return this.state=b};jg.prototype.Yb=function(){return this.state};
var X=function X(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return X.g(arguments[0]);case 2:return X.a(arguments[0],arguments[1]);case 3:return X.h(arguments[0],arguments[1],arguments[2]);case 4:return X.J(arguments[0],arguments[1],arguments[2],arguments[3]);default:return X.o(arguments[0],arguments[1],arguments[2],arguments[3],new C(c.slice(4),0,null))}};
X.g=function(a){return function(b){return function(){function c(c,d){var e=a.g?a.g(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.g?b.g(a):b.call(null,a)}function e(){return b.D?b.D():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new C(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=Jf(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.I=2;c.H=function(a){var b=
D(a);a=F(a);var c=D(a);a=Ed(a);return d(b,c,a)};c.o=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var p=null;if(2<arguments.length){for(var p=0,u=Array(arguments.length-2);p<u.length;)u[p]=arguments[p+2],++p;p=new C(u,0)}return g.o(a,b,p)}throw Error("Invalid arity: "+arguments.length);};f.I=2;f.H=g.H;f.D=e;f.g=d;f.a=c;f.o=g.o;return f}()}};
X.a=function(a,b){return new tf(null,function(){var c=B(b);if(c){if(Ee(c)){for(var d=gd(c),e=M(d),f=zf(e),g=0;;)if(g<e)Cf(f,function(){var b=gc.a(d,g);return a.g?a.g(b):a.call(null,b)}()),g+=1;else break;return Bf(f.Ca(),X.a(a,hd(c)))}return de(function(){var b=D(c);return a.g?a.g(b):a.call(null,b)}(),X.a(a,Ed(c)))}return null},null,null)};
X.h=function(a,b,c){return new tf(null,function(){var d=B(b),e=B(c);if(d&&e){var f=de,g;g=D(d);var l=D(e);g=a.a?a.a(g,l):a.call(null,g,l);d=f(g,X.h(a,Ed(d),Ed(e)))}else d=null;return d},null,null)};X.J=function(a,b,c,d){return new tf(null,function(){var e=B(b),f=B(c),g=B(d);if(e&&f&&g){var l=de,m;m=D(e);var n=D(f),p=D(g);m=a.h?a.h(m,n,p):a.call(null,m,n,p);e=l(m,X.J(a,Ed(e),Ed(f),Ed(g)))}else e=null;return e},null,null)};
X.o=function(a,b,c,d,e){var f=function l(a){return new tf(null,function(){var b=X.a(B,a);return Vf(We,b)?de(X.a(D,b),l(X.a(Ed,b))):null},null,null)};return X.a(function(){return function(b){return S(a,b)}}(f),f(le.o(e,d,N([c,b],0))))};X.H=function(a){var b=D(a),c=F(a);a=D(c);var d=F(c),c=D(d),e=F(d),d=D(e),e=F(e);return X.o(b,a,c,d,e)};X.I=4;
function kg(a,b){if("number"!==typeof a)throw Error("Assert failed: (number? n)");return new tf(null,function(){if(0<a){var c=B(b);return c?de(D(c),kg(a-1,Ed(c))):null}return null},null,null)}function lg(a,b){if("number"!==typeof a)throw Error("Assert failed: (number? n)");return new tf(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=B(b);if(0<a&&e){var f=a-1,e=Ed(e);a=f;b=e}else return e}}),null,null)}function mg(a){return X.h(function(a){return a},a,lg(2,a))}
function ng(a){var b=og;return new tf(null,function(c){return function(){return c(b,a)}}(function(a,b){for(;;){var e=B(b),f;if(f=e)f=D(e),f=a.g?a.g(f):a.call(null,f);if(r(f))f=a,e=Ed(e),a=f,b=e;else return e}}),null,null)}function sg(a){return new tf(null,function(){return de(a,sg(a))},null,null)}function tg(a){return new tf(null,function(){return de(a.D?a.D():a.call(null),tg(a))},null,null)}function ug(a,b){return kg(a,tg(b))}
var vg=function vg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return vg.a(arguments[0],arguments[1]);default:return vg.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};vg.a=function(a,b){return new tf(null,function(){var c=B(a),d=B(b);return c&&d?de(D(c),de(D(d),vg.a(Ed(c),Ed(d)))):null},null,null)};
vg.o=function(a,b,c){return new tf(null,function(){var d=X.a(B,le.o(c,b,N([a],0)));return Vf(We,d)?Ff.a(X.a(D,d),S(vg,X.a(Ed,d))):null},null,null)};vg.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return vg.o(b,a,c)};vg.I=2;function wg(a,b){return S(Ff,Jf(X,a,b))}
var xg=function xg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return xg.g(arguments[0]);case 2:return xg.a(arguments[0],arguments[1]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};
xg.g=function(a){return function(b){return function(){function c(c,d){return r(a.g?a.g(d):a.call(null,d))?b.a?b.a(c,d):b.call(null,c,d):c}function d(a){return b.g?b.g(a):b.call(null,a)}function e(){return b.D?b.D():b.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.D=e;f.g=d;f.a=c;return f}()}};
xg.a=function(a,b){return new tf(null,function(){var c=B(b);if(c){if(Ee(c)){for(var d=gd(c),e=M(d),f=zf(e),g=0;;)if(g<e){var l;l=gc.a(d,g);l=a.g?a.g(l):a.call(null,l);r(l)&&(l=gc.a(d,g),f.add(l));g+=1}else break;return Bf(f.Ca(),xg.a(a,hd(c)))}d=D(c);c=Ed(c);return r(a.g?a.g(d):a.call(null,d))?de(d,xg.a(a,c)):xg.a(a,c)}return null},null,null)};xg.I=2;
var yg=function yg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return yg.g(arguments[0]);case 2:return yg.a(arguments[0],arguments[1]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};yg.g=function(a){return xg.g(Xf(a))};yg.a=function(a,b){return xg.a(Xf(a),b)};yg.I=2;
function zg(a){return function c(a){return new tf(null,function(){return de(a,r(Ae.g?Ae.g(a):Ae.call(null,a))?wg(c,N([B.g?B.g(a):B.call(null,a)],0)):null)},null,null)}(a)}function Ag(a){return xg.a(function(a){return!Ae(a)},Ed(zg(a)))}
var Bg=function Bg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Bg.a(arguments[0],arguments[1]);case 3:return Bg.h(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};Bg.a=function(a,b){return null!=a?null!=a&&(a.L&4||a.yg)?fe(Gf(Wb($c,Zc(a),b)),ue(a)):Wb(x,a,b):Wb(le,Fd,b)};Bg.h=function(a,b,c){return null!=a&&(a.L&4||a.yg)?fe(Gf(Xe(b,Hf,Zc(a),c)),ue(a)):Xe(b,le,a,c)};
Bg.I=3;function Cg(a,b){return Gf(Wb(function(b,d){return Hf.a(b,a.g?a.g(d):a.call(null,d))},Zc(me),b))}function Dg(a,b){return Gf(Wb(function(b,d){return r(a.g?a.g(d):a.call(null,d))?Hf.a(b,d):b},Zc(me),b))}function Eg(a){return Fg(2,2,a)}function Fg(a,b,c){return new tf(null,function(){var d=B(c);if(d){var e=kg(a,d);return a===M(e)?de(e,Fg(a,b,lg(b,d))):null}return null},null,null)}function Gg(a,b){return Wb(A,a,b)}
var Hg=function Hg(b,c,d){var e=O(c,0,null);c=ef(c,1);return r(c)?oe.h(b,e,Hg(A.a(b,e),c,d)):oe.h(b,e,d)},Ig=function Ig(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Ig.h(arguments[0],arguments[1],arguments[2]);case 4:return Ig.J(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Ig.X(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return Ig.xa(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:return Ig.o(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new C(c.slice(6),0,null))}};Ig.h=function(a,b,c){var d=O(b,0,null);b=ef(b,1);return r(b)?oe.h(a,d,Ig.h(A.a(a,d),b,c)):oe.h(a,d,function(){var b=A.a(a,d);return c.g?c.g(b):c.call(null,b)}())};Ig.J=function(a,b,c,d){var e=O(b,0,null);b=ef(b,1);return r(b)?oe.h(a,e,Ig.J(A.a(a,e),b,c,d)):oe.h(a,e,function(){var b=A.a(a,e);return c.a?c.a(b,d):c.call(null,b,d)}())};
Ig.X=function(a,b,c,d,e){var f=O(b,0,null);b=ef(b,1);return r(b)?oe.h(a,f,Ig.X(A.a(a,f),b,c,d,e)):oe.h(a,f,function(){var b=A.a(a,f);return c.h?c.h(b,d,e):c.call(null,b,d,e)}())};Ig.xa=function(a,b,c,d,e,f){var g=O(b,0,null);b=ef(b,1);return r(b)?oe.h(a,g,Ig.xa(A.a(a,g),b,c,d,e,f)):oe.h(a,g,function(){var b=A.a(a,g);return c.J?c.J(b,d,e,f):c.call(null,b,d,e,f)}())};
Ig.o=function(a,b,c,d,e,f,g){var l=O(b,0,null);b=ef(b,1);return r(b)?oe.h(a,l,Mf(Ig,A.a(a,l),b,c,d,N([e,f,g],0))):oe.h(a,l,Mf(c,A.a(a,l),d,e,f,N([g],0)))};Ig.H=function(a){var b=D(a),c=F(a);a=D(c);var d=F(c),c=D(d),e=F(d),d=D(e),f=F(e),e=D(f),g=F(f),f=D(g),g=F(g);return Ig.o(b,a,c,d,e,f,g)};Ig.I=6;function Jg(a,b,c){return oe.h(a,b,function(){var d=A.a(a,b);return c.g?c.g(d):c.call(null,d)}())}
function Kg(a,b,c,d){return oe.h(a,b,function(){var e=A.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())}function Lg(a,b){this.ra=a;this.j=b}function Mg(a){return new Lg(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ng(a){return new Lg(a.ra,Sb(a.j))}function Og(a){a=a.C;return 32>a?0:a-1>>>5<<5}function Pg(a,b,c){for(;;){if(0===b)return c;var d=Mg(a);d.j[0]=c;c=d;b-=5}}
var Qg=function Qg(b,c,d,e){var f=Ng(d),g=b.C-1>>>c&31;5===c?f.j[g]=e:(d=d.j[g],b=null!=d?Qg(b,c-5,d,e):Pg(null,c-5,e),f.j[g]=b);return f};function Rg(a,b){throw Error([t("No item "),t(a),t(" in vector of length "),t(b)].join(""));}function Sg(a,b){if(b>=Og(a))return a.ja;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.j[b>>>d&31],d=e;else return c.j}function Tg(a,b){return 0<=b&&b<a.C?Sg(a,b):Rg(b,a.C)}
var Ug=function Ug(b,c,d,e,f){var g=Ng(d);if(0===c)g.j[e&31]=f;else{var l=e>>>c&31;b=Ug(b,c-5,d.j[l],e,f);g.j[l]=b}return g},Vg=function Vg(b,c,d){var e=b.C-2>>>c&31;if(5<c){b=Vg(b,c-5,d.j[e]);if(null==b&&0===e)return null;d=Ng(d);d.j[e]=b;return d}if(0===e)return null;d=Ng(d);d.j[e]=null;return d};function Wg(a,b,c,d,e,f){this.F=a;this.me=b;this.j=c;this.yb=d;this.start=e;this.end=f}Wg.prototype.Ya=function(){return this.F<this.end};
Wg.prototype.next=function(){32===this.F-this.me&&(this.j=Sg(this.yb,this.F),this.me+=32);var a=this.j[this.F&31];this.F+=1;return a};function T(a,b,c,d,e,f){this.B=a;this.C=b;this.shift=c;this.root=d;this.ja=e;this.A=f;this.l=167668511;this.L=8196}h=T.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){return"number"===typeof b?gc.h(this,b,c):c};
h.ed=function(a,b,c){a=0;for(var d=c;;)if(a<this.C){var e=Sg(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=f+a,l=e[f],d=b.h?b.h(d,g,l):b.call(null,d,g,l);if(Qd(d)){e=d;break a}f+=1}else{e=d;break a}if(Qd(e))return G.g?G.g(e):G.call(null,e);a+=c;d=e}else return d};h.N=function(a,b){return Tg(this,b)[b&31]};h.ab=function(a,b,c){return 0<=b&&b<this.C?Sg(this,b)[b&31]:c};
h.Mc=function(a,b,c){if(0<=b&&b<this.C)return Og(this)<=b?(a=Sb(this.ja),a[b&31]=c,new T(this.B,this.C,this.shift,this.root,a,null)):new T(this.B,this.C,this.shift,Ug(this,this.shift,this.root,b,c),this.ja,null);if(b===this.C)return x(this,c);throw Error([t("Index "),t(b),t(" out of bounds  [0,"),t(this.C),t("]")].join(""));};h.ib=function(){var a=this.C;return new Wg(0,0,0<M(this)?Sg(this,0):null,this,0,a)};h.V=function(){return this.B};
h.Ea=function(){return new T(this.B,this.C,this.shift,this.root,this.ja,this.A)};h.ba=function(){return this.C};h.Hd=function(){return gc.a(this,0)};h.Id=function(){return gc.a(this,1)};h.vc=function(){return 0<this.C?gc.a(this,this.C-1):null};
h.wc=function(){if(0===this.C)throw Error("Can't pop empty vector");if(1===this.C)return Fc(me,this.B);if(1<this.C-Og(this))return new T(this.B,this.C-1,this.shift,this.root,this.ja.slice(0,-1),null);var a=Sg(this,this.C-2),b=Vg(this,this.shift,this.root),b=null==b?V:b,c=this.C-1;return 5<this.shift&&null==b.j[1]?new T(this.B,c,this.shift-5,b.j[0],a,null):new T(this.B,c,this.shift,b,a,null)};h.fd=function(){return 0<this.C?new be(this,this.C-1,null):null};
h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){if(b instanceof T)if(this.C===M(b))for(var c=od(this),d=od(b);;)if(r(c.Ya())){var e=c.next(),f=d.next();if(!Gd.a(e,f))return!1}else return!0;else return!1;else return ce(this,b)};h.dd=function(){return new Xg(this.C,this.shift,Yg.g?Yg.g(this.root):Yg.call(null,this.root),Zg.g?Zg.g(this.ja):Zg.call(null,this.ja))};h.ta=function(){return fe(me,this.B)};h.Fa=function(a,b){return Rd(this,b)};
h.Ga=function(a,b,c){a=0;for(var d=c;;)if(a<this.C){var e=Sg(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Qd(d)){e=d;break a}f+=1}else{e=d;break a}if(Qd(e))return G.g?G.g(e):G.call(null,e);a+=c;d=e}else return d};h.rb=function(a,b,c){if("number"===typeof b)return Ac(this,b,c);throw Error("Vector's key for assoc must be a number.");};
h.Z=function(){if(0===this.C)return null;if(32>=this.C)return new C(this.ja,0,null);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.j[0];else{a=a.j;break a}}return $g?$g(this,a,0,0):ah.call(null,this,a,0,0)};h.Y=function(a,b){return new T(b,this.C,this.shift,this.root,this.ja,this.A)};
h.ia=function(a,b){if(32>this.C-Og(this)){for(var c=this.ja.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.ja[e],e+=1;else break;d[c]=b;return new T(this.B,this.C+1,this.shift,this.root,d,null)}c=(d=this.C>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Mg(null),d.j[0]=this.root,e=Pg(null,this.shift,new Lg(null,this.ja)),d.j[1]=e):d=Qg(this,this.shift,this.root,new Lg(null,this.ja));return new T(this.B,this.C+1,c,d,[b],null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.ab(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.ab(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return this.N(null,a)};h.a=function(a,b){return this.ab(null,a,b)};
var V=new Lg(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),me=new T(null,0,5,V,[],Ld);function bh(a,b){var c=a.length,d=b?a:Sb(a);if(32>c)return new T(null,c,5,V,d,null);for(var e=32,f=(new T(null,32,5,V,d.slice(0,32),null)).dd(null);;)if(e<c)var g=e+1,f=Hf.a(f,d[e]),e=g;else return ad(f)}T.prototype[Rb]=function(){return Id(this)};
function ch(a){return Kb(a)?bh(a,!0):ad(Wb($c,Zc(me),a))}var dh=function dh(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return dh.o(0<c.length?new C(c.slice(0),0,null):null)};dh.o=function(a){return a instanceof C&&0===a.F?bh(a.j,!0):ch(a)};dh.I=0;dh.H=function(a){return dh.o(B(a))};function eh(a,b,c,d,e,f){this.zb=a;this.node=b;this.F=c;this.off=d;this.B=e;this.A=f;this.l=32375020;this.L=1536}h=eh.prototype;h.toString=function(){return qd(this)};
h.equiv=function(a){return this.K(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.lb=function(){if(this.off+1<this.node.length){var a;a=this.zb;var b=this.node,c=this.F,d=this.off+1;a=$g?$g(a,b,c,d):ah.call(null,a,b,c,d);return null==a?null:a}return id(this)};
h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(me,this.B)};h.Fa=function(a,b){var c;c=this.zb;var d=this.F+this.off,e=M(this.zb);c=fh?fh(c,d,e):gh.call(null,c,d,e);return Rd(c,b)};h.Ga=function(a,b,c){a=this.zb;var d=this.F+this.off,e=M(this.zb);a=fh?fh(a,d,e):gh.call(null,a,d,e);return Sd(a,b,c)};h.Da=function(){return this.node[this.off]};
h.bb=function(){if(this.off+1<this.node.length){var a;a=this.zb;var b=this.node,c=this.F,d=this.off+1;a=$g?$g(a,b,c,d):ah.call(null,a,b,c,d);return null==a?Fd:a}return hd(this)};h.Z=function(){return this};h.bf=function(){var a=this.node;return new yf(a,this.off,a.length)};h.cf=function(){var a=this.F+this.node.length;if(a<cc(this.zb)){var b=this.zb,c=Sg(this.zb,a);return $g?$g(b,c,a,0):ah.call(null,b,c,a,0)}return Fd};
h.Y=function(a,b){return hh?hh(this.zb,this.node,this.F,this.off,b):ah.call(null,this.zb,this.node,this.F,this.off,b)};h.ia=function(a,b){return de(b,this)};h.af=function(){var a=this.F+this.node.length;if(a<cc(this.zb)){var b=this.zb,c=Sg(this.zb,a);return $g?$g(b,c,a,0):ah.call(null,b,c,a,0)}return null};eh.prototype[Rb]=function(){return Id(this)};
function ah(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 3:return b=arguments[0],c=arguments[1],d=arguments[2],new eh(b,Tg(b,c),c,d,null,null);case 4:return $g(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return hh(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}function $g(a,b,c,d){return new eh(a,b,c,d,null,null)}
function hh(a,b,c,d,e){return new eh(a,b,c,d,e,null)}function ih(a,b,c,d,e){this.B=a;this.yb=b;this.start=c;this.end=d;this.A=e;this.l=167666463;this.L=8192}h=ih.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){return"number"===typeof b?gc.h(this,b,c):c};
h.ed=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=gc.a(this.yb,a);c=b.h?b.h(c,e,f):b.call(null,c,e,f);if(Qd(c))return G.g?G.g(c):G.call(null,c);d+=1;a+=1}else return c};h.N=function(a,b){return 0>b||this.end<=this.start+b?Rg(b,this.end-this.start):gc.a(this.yb,this.start+b)};h.ab=function(a,b,c){return 0>b||this.end<=this.start+b?c:gc.h(this.yb,this.start+b,c)};
h.Mc=function(a,b,c){var d=this.start+b;a=this.B;c=oe.h(this.yb,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return jh.X?jh.X(a,c,b,d,null):jh.call(null,a,c,b,d,null)};h.V=function(){return this.B};h.Ea=function(){return new ih(this.B,this.yb,this.start,this.end,this.A)};h.ba=function(){return this.end-this.start};h.vc=function(){return gc.a(this.yb,this.end-1)};
h.wc=function(){if(this.start===this.end)throw Error("Can't pop empty vector");var a=this.B,b=this.yb,c=this.start,d=this.end-1;return jh.X?jh.X(a,b,c,d,null):jh.call(null,a,b,c,d,null)};h.fd=function(){return this.start!==this.end?new be(this,this.end-this.start-1,null):null};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(me,this.B)};h.Fa=function(a,b){return Rd(this,b)};h.Ga=function(a,b,c){return Sd(this,b,c)};
h.rb=function(a,b,c){if("number"===typeof b)return Ac(this,b,c);throw Error("Subvec's key for assoc must be a number.");};h.Z=function(){var a=this;return function(b){return function d(e){return e===a.end?null:de(gc.a(a.yb,e),new tf(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};h.Y=function(a,b){return jh.X?jh.X(b,this.yb,this.start,this.end,this.A):jh.call(null,b,this.yb,this.start,this.end,this.A)};
h.ia=function(a,b){var c=this.B,d=Ac(this.yb,this.end,b),e=this.start,f=this.end+1;return jh.X?jh.X(c,d,e,f,null):jh.call(null,c,d,e,f,null)};h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.ab(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.ab(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};
h.g=function(a){return this.N(null,a)};h.a=function(a,b){return this.ab(null,a,b)};ih.prototype[Rb]=function(){return Id(this)};function jh(a,b,c,d,e){for(;;)if(b instanceof ih)c=b.start+c,d=b.start+d,b=b.yb;else{var f=M(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new ih(a,b,c,d,e)}}
function gh(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return b=arguments[0],fh(b,arguments[1],M(b));case 3:return fh(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}function fh(a,b,c){return jh(null,a,b,c,null)}function kh(a,b){return a===b.ra?b:new Lg(a,Sb(b.j))}function Yg(a){return new Lg({},Sb(a.j))}
function Zg(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Ge(a,0,b,0,a.length);return b}var lh=function lh(b,c,d,e){d=kh(b.root.ra,d);var f=b.C-1>>>c&31;if(5===c)b=e;else{var g=d.j[f];b=null!=g?lh(b,c-5,g,e):Pg(b.root.ra,c-5,e)}d.j[f]=b;return d};function Xg(a,b,c,d){this.C=a;this.shift=b;this.root=c;this.ja=d;this.L=88;this.l=275}h=Xg.prototype;
h.Lc=function(a,b){if(this.root.ra){if(32>this.C-Og(this))this.ja[this.C&31]=b;else{var c=new Lg(this.root.ra,this.ja),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.ja=d;if(this.C>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Pg(this.root.ra,this.shift,c);this.root=new Lg(this.root.ra,d);this.shift=e}else this.root=lh(this,this.shift,this.root,c)}this.C+=1;return this}throw Error("conj! after persistent!");};h.hd=function(){if(this.root.ra){this.root.ra=null;var a=this.C-Og(this),b=Array(a);Ge(this.ja,0,b,0,a);return new T(null,this.C,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
h.Ld=function(a,b,c){if("number"===typeof b)return cd(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
h.Qf=function(a,b,c){var d=this;if(d.root.ra){if(0<=b&&b<d.C)return Og(this)<=b?d.ja[b&31]=c:(a=function(){return function f(a,l){var m=kh(d.root.ra,l);if(0===a)m.j[b&31]=c;else{var n=b>>>a&31,p=f(a-5,m.j[n]);m.j[n]=p}return m}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.C)return $c(this,c);throw Error([t("Index "),t(b),t(" out of bounds for TransientVector of length"),t(d.C)].join(""));}throw Error("assoc! after persistent!");};
h.ba=function(){if(this.root.ra)return this.C;throw Error("count after persistent!");};h.N=function(a,b){if(this.root.ra)return Tg(this,b)[b&31];throw Error("nth after persistent!");};h.ab=function(a,b,c){return 0<=b&&b<this.C?gc.a(this,b):c};h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){return"number"===typeof b?gc.h(this,b,c):c};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.T(null,c);case 3:return this.R(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.T(null,c)};a.h=function(a,c,d){return this.R(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return this.T(null,a)};h.a=function(a,b){return this.R(null,a,b)};function mh(a,b){this.nd=a;this.fe=b}
mh.prototype.Ya=function(){var a=null!=this.nd&&B(this.nd);return a?a:(a=null!=this.fe)?this.fe.Ya():a};mh.prototype.next=function(){if(null!=this.nd){var a=D(this.nd);this.nd=F(this.nd);return a}if(null!=this.fe&&this.fe.Ya())return this.fe.next();throw Error("No such element");};mh.prototype.remove=function(){return Error("Unsupported operation")};function nh(a,b,c,d){this.B=a;this.pb=b;this.Hb=c;this.A=d;this.l=31850572;this.L=0}h=nh.prototype;h.toString=function(){return qd(this)};
h.equiv=function(a){return this.K(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(Fd,this.B)};h.Da=function(){return D(this.pb)};
h.bb=function(){var a=F(this.pb);return a?new nh(this.B,a,this.Hb,null):null==this.Hb?dc(this):new nh(this.B,this.Hb,null,null)};h.Z=function(){return this};h.Y=function(a,b){return new nh(b,this.pb,this.Hb,this.A)};h.ia=function(a,b){return de(b,this)};nh.prototype[Rb]=function(){return Id(this)};function oh(a,b,c,d,e){this.B=a;this.count=b;this.pb=c;this.Hb=d;this.A=e;this.l=31858766;this.L=8192}h=oh.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,this.count.g?this.count.g(this):this.count.call(null,this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.ib=function(){return new mh(this.pb,od(this.Hb))};h.V=function(){return this.B};h.Ea=function(){return new oh(this.B,this.count,this.pb,this.Hb,this.A)};h.ba=function(){return this.count};
h.vc=function(){return D(this.pb)};h.wc=function(){if(r(this.pb)){var a=F(this.pb);return a?new oh(this.B,this.count-1,a,this.Hb,null):new oh(this.B,this.count-1,B(this.Hb),me,null)}return this};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(ph,this.B)};h.Da=function(){return D(this.pb)};h.bb=function(){return Ed(B(this))};h.Z=function(){var a=B(this.Hb),b=this.pb;return r(r(b)?b:a)?new nh(null,this.pb,B(a),null):null};
h.Y=function(a,b){return new oh(b,this.count,this.pb,this.Hb,this.A)};h.ia=function(a,b){var c;r(this.pb)?(c=this.Hb,c=new oh(this.B,this.count+1,this.pb,le.a(r(c)?c:me,b),null)):c=new oh(this.B,this.count+1,le.a(this.pb,b),me,null);return c};var ph=new oh(null,0,null,me,Ld);oh.prototype[Rb]=function(){return Id(this)};function qh(){this.l=2097152;this.L=0}qh.prototype.equiv=function(a){return this.K(null,a)};qh.prototype.K=function(){return!1};var rh=new qh;
function sh(a,b){return Je(Be(b)?M(a)===M(b)?Vf(We,X.a(function(a){return Gd.a(A.h(b,D(a),rh),je(a))},a)):null:null)}function Bh(a,b,c,d,e){this.F=a;this.bh=b;this.Kf=c;this.Mg=d;this.Vf=e}Bh.prototype.Ya=function(){var a=this.F<this.Kf;return a?a:this.Vf.Ya()};Bh.prototype.next=function(){if(this.F<this.Kf){var a=Yd(this.Mg,this.F);this.F+=1;return new T(null,2,5,V,[a,mc.a(this.bh,a)],null)}return this.Vf.next()};Bh.prototype.remove=function(){return Error("Unsupported operation")};
function Ch(a){this.da=a}Ch.prototype.next=function(){if(null!=this.da){var a=D(this.da),b=O(a,0,null),a=O(a,1,null);this.da=F(this.da);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Dh(a){return new Ch(B(a))}function Eh(a){this.da=a}Eh.prototype.next=function(){if(null!=this.da){var a=D(this.da);this.da=F(this.da);return{value:[a,a],done:!1}}return{value:null,done:!0}};function Fh(a){return new Eh(B(a))}
function Gh(a,b){var c;if(b instanceof P)a:{c=a.length;for(var d=b.Va,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof P&&d===a[e].Va){c=e;break a}e+=2}}else if(ia(b)||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof y)a:for(c=a.length,d=b.mb,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof y&&d===a[e].mb){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=a.length,
d=0;;){if(c<=d){c=-1;break a}if(Gd.a(b,a[d])){c=d;break a}d+=2}return c}function Hh(a,b,c){this.j=a;this.F=b;this.nb=c;this.l=32374990;this.L=0}h=Hh.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.nb};h.lb=function(){return this.F<this.j.length-2?new Hh(this.j,this.F+2,this.nb):null};h.ba=function(){return(this.j.length-this.F)/2};h.S=function(){return Kd(this)};
h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(Fd,this.nb)};h.Fa=function(a,b){return ge(b,this)};h.Ga=function(a,b,c){return ie(b,c,this)};h.Da=function(){return new T(null,2,5,V,[this.j[this.F],this.j[this.F+1]],null)};h.bb=function(){return this.F<this.j.length-2?new Hh(this.j,this.F+2,this.nb):Fd};h.Z=function(){return this};h.Y=function(a,b){return new Hh(this.j,this.F,b)};h.ia=function(a,b){return de(b,this)};Hh.prototype[Rb]=function(){return Id(this)};
function Ih(a,b,c){this.j=a;this.F=b;this.C=c}Ih.prototype.Ya=function(){return this.F<this.C};Ih.prototype.next=function(){var a=new T(null,2,5,V,[this.j[this.F],this.j[this.F+1]],null);this.F+=2;return a};function q(a,b,c,d){this.B=a;this.C=b;this.j=c;this.A=d;this.l=16647951;this.L=8196}h=q.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};h.keys=function(){return Id(Jh.g?Jh.g(this):Jh.call(null,this))};h.entries=function(){return Dh(B(this))};
h.values=function(){return Id(Kh.g?Kh.g(this):Kh.call(null,this))};h.has=function(a){return Le(this,a)};h.get=function(a,b){return this.R(null,a,b)};h.forEach=function(a){for(var b=B(this),c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e),g=O(f,0,null),f=O(f,1,null);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=B(b))Ee(b)?(c=gd(b),b=hd(b),g=c,d=M(c),c=g):(c=D(b),g=O(c,0,null),f=O(c,1,null),a.a?a.a(f,g):a.call(null,f,g),b=F(b),c=null,d=0),e=0;else return null};h.T=function(a,b){return mc.h(this,b,null)};
h.R=function(a,b,c){a=Gh(this.j,b);return-1===a?c:this.j[a+1]};h.ed=function(a,b,c){a=this.j.length;for(var d=0;;)if(d<a){var e=this.j[d],f=this.j[d+1];c=b.h?b.h(c,e,f):b.call(null,c,e,f);if(Qd(c))return G.g?G.g(c):G.call(null,c);d+=2}else return c};h.ib=function(){return new Ih(this.j,0,2*this.C)};h.V=function(){return this.B};h.Ea=function(){return new q(this.B,this.C,this.j,this.A)};h.ba=function(){return this.C};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Md(this)};
h.K=function(a,b){if(null!=b&&(b.l&1024||b.Dg)){var c=this.j.length;if(this.C===b.ba(null))for(var d=0;;)if(d<c){var e=b.R(null,this.j[d],He);if(e!==He)if(Gd.a(this.j[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return sh(this,b)};h.dd=function(){return new Lh({},this.j.length,Sb(this.j))};h.ta=function(){return Fc(Uf,this.B)};h.Fa=function(a,b){return ge(b,this)};h.Ga=function(a,b,c){return ie(b,c,this)};
h.Lb=function(a,b){if(0<=Gh(this.j,b)){var c=this.j.length,d=c-2;if(0===d)return dc(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new q(this.B,this.C-1,d,null);Gd.a(b,this.j[e])||(d[f]=this.j[e],d[f+1]=this.j[e+1],f+=2);e+=2}}else return this};
h.rb=function(a,b,c){a=Gh(this.j,b);if(-1===a){if(this.C<Mh){a=this.j;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new q(this.B,this.C+1,e,null)}return Fc(oc(Bg.a(Nh,this),b,c),this.B)}if(c===this.j[a+1])return this;b=Sb(this.j);b[a+1]=c;return new q(this.B,this.C,b,null)};h.pe=function(a,b){return-1!==Gh(this.j,b)};h.Z=function(){var a=this.j;return 0<=a.length-2?new Hh(a,0,null):null};h.Y=function(a,b){return new q(b,this.C,this.j,this.A)};
h.ia=function(a,b){if(De(b))return oc(this,gc.a(b,0),gc.a(b,1));for(var c=this,d=B(b);;){if(null==d)return c;var e=D(d);if(De(e))c=oc(c,gc.a(e,0),gc.a(e,1)),d=F(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.T(null,c);case 3:return this.R(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.T(null,c)};a.h=function(a,c,d){return this.R(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return this.T(null,a)};h.a=function(a,b){return this.R(null,a,b)};var Uf=new q(null,0,[],Nd),Mh=8;
function Oh(a,b,c){a=b?a:Sb(a);if(!c){c=[];for(b=0;;)if(b<a.length){var d=a[b],e=a[b+1];-1===Gh(c,d)&&(c.push(d),c.push(e));b+=2}else break;a=c}return new q(null,a.length/2,a,null)}q.prototype[Rb]=function(){return Id(this)};function Lh(a,b,c){this.ld=a;this.Wc=b;this.j=c;this.l=258;this.L=56}h=Lh.prototype;h.ba=function(){if(r(this.ld))return cf(this.Wc);throw Error("count after persistent!");};h.T=function(a,b){return mc.h(this,b,null)};
h.R=function(a,b,c){if(r(this.ld))return a=Gh(this.j,b),-1===a?c:this.j[a+1];throw Error("lookup after persistent!");};h.Lc=function(a,b){if(r(this.ld)){if(null!=b?b.l&2048||b.Eg||(b.l?0:Nb(rc,b)):Nb(rc,b))return bd(this,gf.g?gf.g(b):gf.call(null,b),hf.g?hf.g(b):hf.call(null,b));for(var c=B(b),d=this;;){var e=D(c);if(r(e))c=F(c),d=bd(d,gf.g?gf.g(e):gf.call(null,e),hf.g?hf.g(e):hf.call(null,e));else return d}}else throw Error("conj! after persistent!");};
h.hd=function(){if(r(this.ld))return this.ld=!1,new q(null,cf(this.Wc),this.j,null);throw Error("persistent! called twice");};h.Ld=function(a,b,c){if(r(this.ld)){a=Gh(this.j,b);if(-1===a){if(this.Wc+2<=2*Mh)return this.Wc+=2,this.j.push(b),this.j.push(c),this;a=Ph.a?Ph.a(this.Wc,this.j):Ph.call(null,this.Wc,this.j);return bd(a,b,c)}c!==this.j[a+1]&&(this.j[a+1]=c);return this}throw Error("assoc! after persistent!");};
function Ph(a,b){for(var c=Zc(Nh),d=0;;)if(d<a)c=bd(c,b[d],b[d+1]),d+=2;else return c}function Qh(){this.val=!1}function Sh(a,b){return a===b?!0:qf(a,b)?!0:Gd.a(a,b)}function Th(a,b,c){a=Sb(a);a[b]=c;return a}function Uh(a,b){var c=Array(a.length-2);Ge(a,0,c,0,2*b);Ge(a,2*(b+1),c,2*b,c.length-2*b);return c}function Vh(a,b,c,d){a=a.Pc(b);a.j[c]=d;return a}
function Wh(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var g=a[e+1];c=b.h?b.h(f,c,g):b.call(null,f,c,g)}else c=a[e+1],c=null!=c?c.Vc(b,f):f;if(Qd(c))return G.g?G.g(c):G.call(null,c);e+=2;f=c}else return f}function Xh(a,b,c,d){this.j=a;this.F=b;this.de=c;this.Tb=d}Xh.prototype.advance=function(){for(var a=this.j.length;;)if(this.F<a){var b=this.j[this.F],c=this.j[this.F+1];null!=b?b=this.de=new T(null,2,5,V,[b,c],null):null!=c?(b=od(c),b=b.Ya()?this.Tb=b:!1):b=!1;this.F+=2;if(b)return!0}else return!1};
Xh.prototype.Ya=function(){var a=null!=this.de;return a?a:(a=null!=this.Tb)?a:this.advance()};Xh.prototype.next=function(){if(null!=this.de){var a=this.de;this.de=null;return a}if(null!=this.Tb)return a=this.Tb.next(),this.Tb.Ya()||(this.Tb=null),a;if(this.advance())return this.next();throw Error("No such element");};Xh.prototype.remove=function(){return Error("Unsupported operation")};function Yh(a,b,c){this.ra=a;this.wa=b;this.j=c}h=Yh.prototype;
h.Pc=function(a){if(a===this.ra)return this;var b=df(this.wa),c=Array(0>b?4:2*(b+1));Ge(this.j,0,c,0,2*b);return new Yh(a,this.wa,c)};h.Yd=function(){return Zh?Zh(this.j):$h.call(null,this.j)};h.Vc=function(a,b){return Wh(this.j,a,b)};h.Dc=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.wa&e))return d;var f=df(this.wa&e-1),e=this.j[2*f],f=this.j[2*f+1];return null==e?f.Dc(a+5,b,c,d):Sh(c,e)?f:d};
h.Rb=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),l=df(this.wa&g-1);if(0===(this.wa&g)){var m=df(this.wa);if(2*m<this.j.length){a=this.Pc(a);b=a.j;f.val=!0;a:for(c=2*(m-l),f=2*l+(c-1),m=2*(l+1)+(c-1);;){if(0===c)break a;b[m]=b[f];--m;--c;--f}b[2*l]=d;b[2*l+1]=e;a.wa|=g;return a}if(16<=m){l=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];l[c>>>b&31]=ai.Rb(a,b+5,c,d,e,f);for(e=d=0;;)if(32>
d)0!==(this.wa>>>d&1)&&(l[d]=null!=this.j[e]?ai.Rb(a,b+5,zd(this.j[e]),this.j[e],this.j[e+1],f):this.j[e+1],e+=2),d+=1;else break;return new bi(a,m+1,l)}b=Array(2*(m+4));Ge(this.j,0,b,0,2*l);b[2*l]=d;b[2*l+1]=e;Ge(this.j,2*l,b,2*(l+1),2*(m-l));f.val=!0;a=this.Pc(a);a.j=b;a.wa|=g;return a}m=this.j[2*l];g=this.j[2*l+1];if(null==m)return m=g.Rb(a,b+5,c,d,e,f),m===g?this:Vh(this,a,2*l+1,m);if(Sh(d,m))return e===g?this:Vh(this,a,2*l+1,e);f.val=!0;f=b+5;d=ci?ci(a,f,m,g,c,d,e):di.call(null,a,f,m,g,c,d,e);
e=2*l;l=2*l+1;a=this.Pc(a);a.j[e]=null;a.j[l]=d;return a};
h.Qb=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=df(this.wa&f-1);if(0===(this.wa&f)){var l=df(this.wa);if(16<=l){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=ai.Qb(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.wa>>>c&1)&&(g[c]=null!=this.j[d]?ai.Qb(a+5,zd(this.j[d]),this.j[d],this.j[d+1],e):this.j[d+1],d+=2),c+=1;else break;return new bi(null,l+1,g)}a=Array(2*(l+1));Ge(this.j,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;Ge(this.j,2*g,a,2*(g+1),2*(l-g));e.val=!0;return new Yh(null,this.wa|f,a)}var m=this.j[2*g],f=this.j[2*g+1];if(null==m)return l=f.Qb(a+5,b,c,d,e),l===f?this:new Yh(null,this.wa,Th(this.j,2*g+1,l));if(Sh(c,m))return d===f?this:new Yh(null,this.wa,Th(this.j,2*g+1,d));e.val=!0;e=this.wa;l=this.j;a+=5;a=ei?ei(a,m,f,b,c,d):di.call(null,a,m,f,b,c,d);c=2*g;g=2*g+1;d=Sb(l);d[c]=null;d[g]=a;return new Yh(null,e,d)};
h.Zd=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.wa&d))return this;var e=df(this.wa&d-1),f=this.j[2*e],g=this.j[2*e+1];return null==f?(a=g.Zd(a+5,b,c),a===g?this:null!=a?new Yh(null,this.wa,Th(this.j,2*e+1,a)):this.wa===d?null:new Yh(null,this.wa^d,Uh(this.j,e))):Sh(c,f)?new Yh(null,this.wa^d,Uh(this.j,e)):this};h.ib=function(){return new Xh(this.j,0,null,null)};var ai=new Yh(null,0,[]);function fi(a,b,c){this.j=a;this.F=b;this.Tb=c}
fi.prototype.Ya=function(){for(var a=this.j.length;;){if(null!=this.Tb&&this.Tb.Ya())return!0;if(this.F<a){var b=this.j[this.F];this.F+=1;null!=b&&(this.Tb=od(b))}else return!1}};fi.prototype.next=function(){if(this.Ya())return this.Tb.next();throw Error("No such element");};fi.prototype.remove=function(){return Error("Unsupported operation")};function bi(a,b,c){this.ra=a;this.C=b;this.j=c}h=bi.prototype;h.Pc=function(a){return a===this.ra?this:new bi(a,this.C,Sb(this.j))};
h.Yd=function(){return gi?gi(this.j):hi.call(null,this.j)};h.Vc=function(a,b){for(var c=this.j.length,d=0,e=b;;)if(d<c){var f=this.j[d];if(null!=f&&(e=f.Vc(a,e),Qd(e)))return G.g?G.g(e):G.call(null,e);d+=1}else return e};h.Dc=function(a,b,c,d){var e=this.j[b>>>a&31];return null!=e?e.Dc(a+5,b,c,d):d};h.Rb=function(a,b,c,d,e,f){var g=c>>>b&31,l=this.j[g];if(null==l)return a=Vh(this,a,g,ai.Rb(a,b+5,c,d,e,f)),a.C+=1,a;b=l.Rb(a,b+5,c,d,e,f);return b===l?this:Vh(this,a,g,b)};
h.Qb=function(a,b,c,d,e){var f=b>>>a&31,g=this.j[f];if(null==g)return new bi(null,this.C+1,Th(this.j,f,ai.Qb(a+5,b,c,d,e)));a=g.Qb(a+5,b,c,d,e);return a===g?this:new bi(null,this.C,Th(this.j,f,a))};
h.Zd=function(a,b,c){var d=b>>>a&31,e=this.j[d];if(null!=e){a=e.Zd(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.C)a:{e=this.j;a=e.length;b=Array(2*(this.C-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new Yh(null,g,b);break a}}else d=new bi(null,this.C-1,Th(this.j,d,a));else d=new bi(null,this.C,Th(this.j,d,a));return d}return this};h.ib=function(){return new fi(this.j,0,null)};
function ii(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Sh(c,a[d]))return d;d+=2}else return-1}function ji(a,b,c,d){this.ra=a;this.ic=b;this.C=c;this.j=d}h=ji.prototype;h.Pc=function(a){if(a===this.ra)return this;var b=Array(2*(this.C+1));Ge(this.j,0,b,0,2*this.C);return new ji(a,this.ic,this.C,b)};h.Yd=function(){return Zh?Zh(this.j):$h.call(null,this.j)};h.Vc=function(a,b){return Wh(this.j,a,b)};h.Dc=function(a,b,c,d){a=ii(this.j,this.C,c);return 0>a?d:Sh(c,this.j[a])?this.j[a+1]:d};
h.Rb=function(a,b,c,d,e,f){if(c===this.ic){b=ii(this.j,this.C,d);if(-1===b){if(this.j.length>2*this.C)return b=2*this.C,c=2*this.C+1,a=this.Pc(a),a.j[b]=d,a.j[c]=e,f.val=!0,a.C+=1,a;c=this.j.length;b=Array(c+2);Ge(this.j,0,b,0,c);b[c]=d;b[c+1]=e;f.val=!0;d=this.C+1;a===this.ra?(this.j=b,this.C=d,a=this):a=new ji(this.ra,this.ic,d,b);return a}return this.j[b+1]===e?this:Vh(this,a,b+1,e)}return(new Yh(a,1<<(this.ic>>>b&31),[null,this,null,null])).Rb(a,b,c,d,e,f)};
h.Qb=function(a,b,c,d,e){return b===this.ic?(a=ii(this.j,this.C,c),-1===a?(a=2*this.C,b=Array(a+2),Ge(this.j,0,b,0,a),b[a]=c,b[a+1]=d,e.val=!0,new ji(null,this.ic,this.C+1,b)):Gd.a(this.j[a],d)?this:new ji(null,this.ic,this.C,Th(this.j,a+1,d))):(new Yh(null,1<<(this.ic>>>a&31),[null,this])).Qb(a,b,c,d,e)};h.Zd=function(a,b,c){a=ii(this.j,this.C,c);return-1===a?this:1===this.C?null:new ji(null,this.ic,this.C-1,Uh(this.j,cf(a)))};h.ib=function(){return new Xh(this.j,0,null,null)};
function di(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 6:return ei(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return ci(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}
function ei(a,b,c,d,e,f){var g=zd(b);if(g===d)return new ji(null,g,2,[b,c,e,f]);var l=new Qh;return ai.Qb(a,g,b,c,l).Qb(a,d,e,f,l)}function ci(a,b,c,d,e,f,g){var l=zd(c);if(l===e)return new ji(null,l,2,[c,d,f,g]);var m=new Qh;return ai.Rb(a,b,l,c,d,m).Rb(a,b,e,f,g,m)}function ki(a,b,c,d,e){this.B=a;this.Fc=b;this.F=c;this.da=d;this.A=e;this.l=32374860;this.L=0}h=ki.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(Fd,this.B)};h.Fa=function(a,b){return ge(b,this)};
h.Ga=function(a,b,c){return ie(b,c,this)};h.Da=function(){return null==this.da?new T(null,2,5,V,[this.Fc[this.F],this.Fc[this.F+1]],null):D(this.da)};h.bb=function(){if(null==this.da){var a=this.Fc,b=this.F+2;return li?li(a,b,null):$h.call(null,a,b,null)}var a=this.Fc,b=this.F,c=F(this.da);return li?li(a,b,c):$h.call(null,a,b,c)};h.Z=function(){return this};h.Y=function(a,b){return new ki(b,this.Fc,this.F,this.da,this.A)};h.ia=function(a,b){return de(b,this)};ki.prototype[Rb]=function(){return Id(this)};
function $h(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return Zh(arguments[0]);case 3:return li(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}function Zh(a){return li(a,0,null)}
function li(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new ki(null,a,b,null,null);var d=a[b+1];if(r(d)&&(d=d.Yd(),r(d)))return new ki(null,a,b+2,d,null);b+=2}else return null;else return new ki(null,a,b,c,null)}function mi(a,b,c,d,e){this.B=a;this.Fc=b;this.F=c;this.da=d;this.A=e;this.l=32374860;this.L=0}h=mi.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(Fd,this.B)};h.Fa=function(a,b){return ge(b,this)};
h.Ga=function(a,b,c){return ie(b,c,this)};h.Da=function(){return D(this.da)};h.bb=function(){var a=this.Fc,b=this.F,c=F(this.da);return ni?ni(null,a,b,c):hi.call(null,null,a,b,c)};h.Z=function(){return this};h.Y=function(a,b){return new mi(b,this.Fc,this.F,this.da,this.A)};h.ia=function(a,b){return de(b,this)};mi.prototype[Rb]=function(){return Id(this)};
function hi(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return gi(arguments[0]);case 4:return ni(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}function gi(a){return ni(null,a,0,null)}function ni(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(r(e)&&(e=e.Yd(),r(e)))return new mi(a,b,c+1,e,null);c+=1}else return null;else return new mi(a,b,c,d,null)}
function oi(a,b,c){this.hb=a;this.mg=b;this.Bf=c}oi.prototype.Ya=function(){return this.Bf&&this.mg.Ya()};oi.prototype.next=function(){if(this.Bf)return this.mg.next();this.Bf=!0;return this.hb};oi.prototype.remove=function(){return Error("Unsupported operation")};function pi(a,b,c,d,e,f){this.B=a;this.C=b;this.root=c;this.fb=d;this.hb=e;this.A=f;this.l=16123663;this.L=8196}h=pi.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.keys=function(){return Id(Jh.g?Jh.g(this):Jh.call(null,this))};h.entries=function(){return Dh(B(this))};h.values=function(){return Id(Kh.g?Kh.g(this):Kh.call(null,this))};h.has=function(a){return Le(this,a)};h.get=function(a,b){return this.R(null,a,b)};
h.forEach=function(a){for(var b=B(this),c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e),g=O(f,0,null),f=O(f,1,null);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=B(b))Ee(b)?(c=gd(b),b=hd(b),g=c,d=M(c),c=g):(c=D(b),g=O(c,0,null),f=O(c,1,null),a.a?a.a(f,g):a.call(null,f,g),b=F(b),c=null,d=0),e=0;else return null};h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){return null==b?this.fb?this.hb:c:null==this.root?c:this.root.Dc(0,zd(b),b,c)};
h.ed=function(a,b,c){a=this.fb?b.h?b.h(c,null,this.hb):b.call(null,c,null,this.hb):c;return Qd(a)?G.g?G.g(a):G.call(null,a):null!=this.root?this.root.Vc(b,a):a};h.ib=function(){var a=this.root?od(this.root):Pf;return this.fb?new oi(this.hb,a,!1):a};h.V=function(){return this.B};h.Ea=function(){return new pi(this.B,this.C,this.root,this.fb,this.hb,this.A)};h.ba=function(){return this.C};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Md(this)};h.K=function(a,b){return sh(this,b)};
h.dd=function(){return new qi({},this.root,this.C,this.fb,this.hb)};h.ta=function(){return Fc(Nh,this.B)};h.Lb=function(a,b){if(null==b)return this.fb?new pi(this.B,this.C-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Zd(0,zd(b),b);return c===this.root?this:new pi(this.B,this.C-1,c,this.fb,this.hb,null)};
h.rb=function(a,b,c){if(null==b)return this.fb&&c===this.hb?this:new pi(this.B,this.fb?this.C:this.C+1,this.root,!0,c,null);a=new Qh;b=(null==this.root?ai:this.root).Qb(0,zd(b),b,c,a);return b===this.root?this:new pi(this.B,a.val?this.C+1:this.C,b,this.fb,this.hb,null)};h.pe=function(a,b){return null==b?this.fb:null==this.root?!1:this.root.Dc(0,zd(b),b,He)!==He};h.Z=function(){if(0<this.C){var a=null!=this.root?this.root.Yd():null;return this.fb?de(new T(null,2,5,V,[null,this.hb],null),a):a}return null};
h.Y=function(a,b){return new pi(b,this.C,this.root,this.fb,this.hb,this.A)};h.ia=function(a,b){if(De(b))return oc(this,gc.a(b,0),gc.a(b,1));for(var c=this,d=B(b);;){if(null==d)return c;var e=D(d);if(De(e))c=oc(c,gc.a(e,0),gc.a(e,1)),d=F(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.T(null,c);case 3:return this.R(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.T(null,c)};a.h=function(a,c,d){return this.R(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return this.T(null,a)};h.a=function(a,b){return this.R(null,a,b)};var Nh=new pi(null,0,null,!1,null,Nd);
function pe(a,b){for(var c=a.length,d=0,e=Zc(Nh);;)if(d<c)var f=d+1,e=e.Ld(null,a[d],b[d]),d=f;else return ad(e)}pi.prototype[Rb]=function(){return Id(this)};function qi(a,b,c,d,e){this.ra=a;this.root=b;this.count=c;this.fb=d;this.hb=e;this.l=258;this.L=56}
function ri(a,b,c){if(a.ra){if(null==b)a.hb!==c&&(a.hb=c),a.fb||(a.count+=1,a.fb=!0);else{var d=new Qh;b=(null==a.root?ai:a.root).Rb(a.ra,0,zd(b),b,c,d);b!==a.root&&(a.root=b);d.val&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}h=qi.prototype;h.ba=function(){if(this.ra)return this.count;throw Error("count after persistent!");};h.T=function(a,b){return null==b?this.fb?this.hb:null:null==this.root?null:this.root.Dc(0,zd(b),b)};
h.R=function(a,b,c){return null==b?this.fb?this.hb:c:null==this.root?c:this.root.Dc(0,zd(b),b,c)};h.Lc=function(a,b){var c;a:if(this.ra)if(null!=b?b.l&2048||b.Eg||(b.l?0:Nb(rc,b)):Nb(rc,b))c=ri(this,gf.g?gf.g(b):gf.call(null,b),hf.g?hf.g(b):hf.call(null,b));else{c=B(b);for(var d=this;;){var e=D(c);if(r(e))c=F(c),d=ri(d,gf.g?gf.g(e):gf.call(null,e),hf.g?hf.g(e):hf.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};
h.hd=function(){var a;if(this.ra)this.ra=null,a=new pi(null,this.count,this.root,this.fb,this.hb,null);else throw Error("persistent! called twice");return a};h.Ld=function(a,b,c){return ri(this,b,c)};function si(a,b,c){for(var d=b;;)if(null!=a)b=c?a.left:a.right,d=le.a(d,a),a=b;else return d}function ti(a,b,c,d,e){this.B=a;this.stack=b;this.le=c;this.C=d;this.A=e;this.l=32374862;this.L=0}h=ti.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.B};h.ba=function(){return 0>this.C?M(F(this))+1:this.C};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(Fd,this.B)};
h.Fa=function(a,b){return ge(b,this)};h.Ga=function(a,b,c){return ie(b,c,this)};h.Da=function(){var a=this.stack;return null==a?null:wc(a)};h.bb=function(){var a=D(this.stack),a=si(this.le?a.right:a.left,F(this.stack),this.le);return null!=a?new ti(null,a,this.le,this.C-1,null):Fd};h.Z=function(){return this};h.Y=function(a,b){return new ti(b,this.stack,this.le,this.C,this.A)};h.ia=function(a,b){return de(b,this)};ti.prototype[Rb]=function(){return Id(this)};
function ui(a,b,c){return new ti(null,si(a,null,b),b,c,null)}function vi(a,b,c,d){return c instanceof wi?c.left instanceof wi?new wi(c.key,c.val,c.left.ec(),new xi(a,b,c.right,d,null),null):c.right instanceof wi?new wi(c.right.key,c.right.val,new xi(c.key,c.val,c.left,c.right.left,null),new xi(a,b,c.right.right,d,null),null):new xi(a,b,c,d,null):new xi(a,b,c,d,null)}
function yi(a,b,c,d){return d instanceof wi?d.right instanceof wi?new wi(d.key,d.val,new xi(a,b,c,d.left,null),d.right.ec(),null):d.left instanceof wi?new wi(d.left.key,d.left.val,new xi(a,b,c,d.left.left,null),new xi(d.key,d.val,d.left.right,d.right,null),null):new xi(a,b,c,d,null):new xi(a,b,c,d,null)}
function zi(a,b,c,d){if(c instanceof wi)return new wi(a,b,c.ec(),d,null);if(d instanceof xi)return yi(a,b,c,d.ee());if(d instanceof wi&&d.left instanceof xi)return new wi(d.left.key,d.left.val,new xi(a,b,c,d.left.left,null),yi(d.key,d.val,d.left.right,d.right.ee()),null);throw Error("red-black tree invariant violation");}
var Ai=function Ai(b,c,d){d=null!=b.left?Ai(b.left,c,d):d;if(Qd(d))return G.g?G.g(d):G.call(null,d);var e=b.key,f=b.val;d=c.h?c.h(d,e,f):c.call(null,d,e,f);if(Qd(d))return G.g?G.g(d):G.call(null,d);b=null!=b.right?Ai(b.right,c,d):d;return Qd(b)?G.g?G.g(b):G.call(null,b):b};function xi(a,b,c,d,e){this.key=a;this.val=b;this.left=c;this.right=d;this.A=e;this.l=32402207;this.L=0}h=xi.prototype;
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();h.Gf=function(a){return a.Jf(this)};h.ee=function(){return new wi(this.key,this.val,this.left,this.right,null)};h.ec=function(){return this};h.Ff=function(a){return a.If(this)};h.replace=function(a,b,c,d){return new xi(a,b,c,d,null)};
h.If=function(a){return new xi(a.key,a.val,this,a.right,null)};h.Jf=function(a){return new xi(a.key,a.val,a.left,this,null)};h.Vc=function(a,b){return Ai(this,a,b)};h.T=function(a,b){return gc.h(this,b,null)};h.R=function(a,b,c){return gc.h(this,b,c)};h.N=function(a,b){return 0===b?this.key:1===b?this.val:null};h.ab=function(a,b,c){return 0===b?this.key:1===b?this.val:c};h.Mc=function(a,b,c){return(new T(null,2,5,V,[this.key,this.val],null)).Mc(null,b,c)};h.V=function(){return null};h.ba=function(){return 2};
h.Hd=function(){return this.key};h.Id=function(){return this.val};h.vc=function(){return this.val};h.wc=function(){return new T(null,1,5,V,[this.key],null)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};h.ta=function(){return me};h.Fa=function(a,b){return Rd(this,b)};h.Ga=function(a,b,c){return Sd(this,b,c)};h.rb=function(a,b,c){return oe.h(new T(null,2,5,V,[this.key,this.val],null),b,c)};h.Z=function(){return x(x(Fd,this.val),this.key)};
h.Y=function(a,b){return fe(new T(null,2,5,V,[this.key,this.val],null),b)};h.ia=function(a,b){return new T(null,3,5,V,[this.key,this.val,b],null)};h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.T(null,c);case 3:return this.R(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.T(null,c)};a.h=function(a,c,d){return this.R(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};
h.g=function(a){return this.T(null,a)};h.a=function(a,b){return this.R(null,a,b)};xi.prototype[Rb]=function(){return Id(this)};function wi(a,b,c,d,e){this.key=a;this.val=b;this.left=c;this.right=d;this.A=e;this.l=32402207;this.L=0}h=wi.prototype;
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();h.Gf=function(a){return new wi(this.key,this.val,this.left,a,null)};h.ee=function(){throw Error("red-black tree invariant violation");};h.ec=function(){return new xi(this.key,this.val,this.left,this.right,null)};
h.Ff=function(a){return new wi(this.key,this.val,a,this.right,null)};h.replace=function(a,b,c,d){return new wi(a,b,c,d,null)};h.If=function(a){return this.left instanceof wi?new wi(this.key,this.val,this.left.ec(),new xi(a.key,a.val,this.right,a.right,null),null):this.right instanceof wi?new wi(this.right.key,this.right.val,new xi(this.key,this.val,this.left,this.right.left,null),new xi(a.key,a.val,this.right.right,a.right,null),null):new xi(a.key,a.val,this,a.right,null)};
h.Jf=function(a){return this.right instanceof wi?new wi(this.key,this.val,new xi(a.key,a.val,a.left,this.left,null),this.right.ec(),null):this.left instanceof wi?new wi(this.left.key,this.left.val,new xi(a.key,a.val,a.left,this.left.left,null),new xi(this.key,this.val,this.left.right,this.right,null),null):new xi(a.key,a.val,a.left,this,null)};h.Vc=function(a,b){return Ai(this,a,b)};h.T=function(a,b){return gc.h(this,b,null)};h.R=function(a,b,c){return gc.h(this,b,c)};
h.N=function(a,b){return 0===b?this.key:1===b?this.val:null};h.ab=function(a,b,c){return 0===b?this.key:1===b?this.val:c};h.Mc=function(a,b,c){return(new T(null,2,5,V,[this.key,this.val],null)).Mc(null,b,c)};h.V=function(){return null};h.ba=function(){return 2};h.Hd=function(){return this.key};h.Id=function(){return this.val};h.vc=function(){return this.val};h.wc=function(){return new T(null,1,5,V,[this.key],null)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};
h.K=function(a,b){return ce(this,b)};h.ta=function(){return me};h.Fa=function(a,b){return Rd(this,b)};h.Ga=function(a,b,c){return Sd(this,b,c)};h.rb=function(a,b,c){return oe.h(new T(null,2,5,V,[this.key,this.val],null),b,c)};h.Z=function(){return x(x(Fd,this.val),this.key)};h.Y=function(a,b){return fe(new T(null,2,5,V,[this.key,this.val],null),b)};h.ia=function(a,b){return new T(null,3,5,V,[this.key,this.val,b],null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.T(null,c);case 3:return this.R(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.T(null,c)};a.h=function(a,c,d){return this.R(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return this.T(null,a)};h.a=function(a,b){return this.R(null,a,b)};wi.prototype[Rb]=function(){return Id(this)};
var Bi=function Bi(b,c,d,e,f){if(null==c)return new wi(d,e,null,null,null);var g;g=c.key;g=b.a?b.a(d,g):b.call(null,d,g);if(0===g)return f[0]=c,null;if(0>g)return b=Bi(b,c.left,d,e,f),null!=b?c.Ff(b):null;b=Bi(b,c.right,d,e,f);return null!=b?c.Gf(b):null},Ci=function Ci(b,c){if(null==b)return c;if(null==c)return b;if(b instanceof wi){if(c instanceof wi){var d=Ci(b.right,c.left);return d instanceof wi?new wi(d.key,d.val,new wi(b.key,b.val,b.left,d.left,null),new wi(c.key,c.val,d.right,c.right,null),
null):new wi(b.key,b.val,b.left,new wi(c.key,c.val,d,c.right,null),null)}return new wi(b.key,b.val,b.left,Ci(b.right,c),null)}if(c instanceof wi)return new wi(c.key,c.val,Ci(b,c.left),c.right,null);d=Ci(b.right,c.left);return d instanceof wi?new wi(d.key,d.val,new xi(b.key,b.val,b.left,d.left,null),new xi(c.key,c.val,d.right,c.right,null),null):zi(b.key,b.val,b.left,new xi(c.key,c.val,d,c.right,null))},Di=function Di(b,c,d,e){if(null!=c){var f;f=c.key;f=b.a?b.a(d,f):b.call(null,d,f);if(0===f)return e[0]=
c,Ci(c.left,c.right);if(0>f)return b=Di(b,c.left,d,e),null!=b||null!=e[0]?c.left instanceof xi?zi(c.key,c.val,b,c.right):new wi(c.key,c.val,b,c.right,null):null;b=Di(b,c.right,d,e);if(null!=b||null!=e[0])if(c.right instanceof xi)if(e=c.key,d=c.val,c=c.left,b instanceof wi)c=new wi(e,d,c,b.ec(),null);else if(c instanceof xi)c=vi(e,d,c.ee(),b);else if(c instanceof wi&&c.right instanceof xi)c=new wi(c.right.key,c.right.val,vi(c.key,c.val,c.left.ee(),c.right.left),new xi(e,d,c.right.right,b,null),null);
else throw Error("red-black tree invariant violation");else c=new wi(c.key,c.val,c.left,b,null);else c=null;return c}return null},Ei=function Ei(b,c,d,e){var f=c.key,g=b.a?b.a(d,f):b.call(null,d,f);return 0===g?c.replace(f,e,c.left,c.right):0>g?c.replace(f,c.val,Ei(b,c.left,d,e),c.right):c.replace(f,c.val,c.left,Ei(b,c.right,d,e))};function Fi(a,b,c,d,e){this.Bb=a;this.cc=b;this.C=c;this.B=d;this.A=e;this.l=418776847;this.L=8192}h=Fi.prototype;
h.forEach=function(a){for(var b=B(this),c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e),g=O(f,0,null),f=O(f,1,null);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=B(b))Ee(b)?(c=gd(b),b=hd(b),g=c,d=M(c),c=g):(c=D(b),g=O(c,0,null),f=O(c,1,null),a.a?a.a(f,g):a.call(null,f,g),b=F(b),c=null,d=0),e=0;else return null};h.get=function(a,b){return this.R(null,a,b)};h.entries=function(){return Dh(B(this))};h.toString=function(){return qd(this)};h.keys=function(){return Id(Jh.g?Jh.g(this):Jh.call(null,this))};
h.values=function(){return Id(Kh.g?Kh.g(this):Kh.call(null,this))};h.equiv=function(a){return this.K(null,a)};function Gi(a,b){for(var c=a.cc;;)if(null!=c){var d;d=c.key;d=a.Bb.a?a.Bb.a(b,d):a.Bb.call(null,b,d);if(0===d)return c;c=0>d?c.left:c.right}else return null}h.has=function(a){return Le(this,a)};h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){a=Gi(this,b);return null!=a?a.val:c};h.ed=function(a,b,c){return null!=this.cc?Ai(this.cc,b,c):c};h.V=function(){return this.B};
h.Ea=function(){return new Fi(this.Bb,this.cc,this.C,this.B,this.A)};h.ba=function(){return this.C};h.fd=function(){return 0<this.C?ui(this.cc,!1,this.C):null};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Md(this)};h.K=function(a,b){return sh(this,b)};h.ta=function(){return new Fi(this.Bb,null,0,this.B,0)};h.Lb=function(a,b){var c=[null],d=Di(this.Bb,this.cc,b,c);return null==d?null==Yd(c,0)?this:new Fi(this.Bb,null,0,this.B,null):new Fi(this.Bb,d.ec(),this.C-1,this.B,null)};
h.rb=function(a,b,c){a=[null];var d=Bi(this.Bb,this.cc,b,c,a);return null==d?(a=Yd(a,0),Gd.a(c,a.val)?this:new Fi(this.Bb,Ei(this.Bb,this.cc,b,c),this.C,this.B,null)):new Fi(this.Bb,d.ec(),this.C+1,this.B,null)};h.pe=function(a,b){return null!=Gi(this,b)};h.Z=function(){return 0<this.C?ui(this.cc,!0,this.C):null};h.Y=function(a,b){return new Fi(this.Bb,this.cc,this.C,b,this.A)};
h.ia=function(a,b){if(De(b))return oc(this,gc.a(b,0),gc.a(b,1));for(var c=this,d=B(b);;){if(null==d)return c;var e=D(d);if(De(e))c=oc(c,gc.a(e,0),gc.a(e,1)),d=F(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.T(null,c);case 3:return this.R(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.T(null,c)};a.h=function(a,c,d){return this.R(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return this.T(null,a)};h.a=function(a,b){return this.R(null,a,b)};Fi.prototype[Rb]=function(){return Id(this)};
var fg=function fg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return fg.o(0<c.length?new C(c.slice(0),0,null):null)};fg.o=function(a){for(var b=B(a),c=Zc(Nh);;)if(b){a=F(F(b));var d=D(b),b=je(b),c=bd(c,d,b),b=a}else return ad(c)};fg.I=0;fg.H=function(a){return fg.o(B(a))};var Hi=function Hi(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Hi.o(0<c.length?new C(c.slice(0),0,null):null)};
Hi.o=function(a){a=a instanceof C&&0===a.F?a.j:Ub(a);return Oh(a,!0,!1)};Hi.I=0;Hi.H=function(a){return Hi.o(B(a))};function Ii(a,b){this.ga=a;this.nb=b;this.l=32374988;this.L=0}h=Ii.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.nb};h.lb=function(){var a=(null!=this.ga?this.ga.l&128||this.ga.se||(this.ga.l?0:Nb(kc,this.ga)):Nb(kc,this.ga))?this.ga.lb(null):F(this.ga);return null==a?null:new Ii(a,this.nb)};h.S=function(){return Kd(this)};
h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(Fd,this.nb)};h.Fa=function(a,b){return ge(b,this)};h.Ga=function(a,b,c){return ie(b,c,this)};h.Da=function(){return this.ga.Da(null).Hd(null)};h.bb=function(){var a=(null!=this.ga?this.ga.l&128||this.ga.se||(this.ga.l?0:Nb(kc,this.ga)):Nb(kc,this.ga))?this.ga.lb(null):F(this.ga);return null!=a?new Ii(a,this.nb):Fd};h.Z=function(){return this};h.Y=function(a,b){return new Ii(this.ga,b)};h.ia=function(a,b){return de(b,this)};
Ii.prototype[Rb]=function(){return Id(this)};function Jh(a){return(a=B(a))?new Ii(a,null):null}function gf(a){return sc(a)}function Ji(a,b){this.ga=a;this.nb=b;this.l=32374988;this.L=0}h=Ji.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};
h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.V=function(){return this.nb};h.lb=function(){var a=(null!=this.ga?this.ga.l&128||this.ga.se||(this.ga.l?0:Nb(kc,this.ga)):Nb(kc,this.ga))?this.ga.lb(null):F(this.ga);return null==a?null:new Ji(a,this.nb)};h.S=function(){return Kd(this)};
h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(Fd,this.nb)};h.Fa=function(a,b){return ge(b,this)};h.Ga=function(a,b,c){return ie(b,c,this)};h.Da=function(){return this.ga.Da(null).Id(null)};h.bb=function(){var a=(null!=this.ga?this.ga.l&128||this.ga.se||(this.ga.l?0:Nb(kc,this.ga)):Nb(kc,this.ga))?this.ga.lb(null):F(this.ga);return null!=a?new Ji(a,this.nb):Fd};h.Z=function(){return this};h.Y=function(a,b){return new Ji(this.ga,b)};h.ia=function(a,b){return de(b,this)};
Ji.prototype[Rb]=function(){return Id(this)};function Kh(a){return(a=B(a))?new Ji(a,null):null}function hf(a){return tc(a)}var Ki=function Ki(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ki.o(0<c.length?new C(c.slice(0),0,null):null)};Ki.o=function(a){return r(Wf(We,a))?Ue(function(a,c){return le.a(r(a)?a:Uf,c)},a):null};Ki.I=0;Ki.H=function(a){return Ki.o(B(a))};
function Li(a,b){for(var c=Uf,d=B(b);;)if(d)var e=D(d),f=A.h(a,e,Mi),c=Nf(f,Mi)?oe.h(c,e,f):c,d=F(d);else return fe(c,ue(a))}function Ni(a){this.rf=a}Ni.prototype.Ya=function(){return this.rf.Ya()};Ni.prototype.next=function(){if(this.rf.Ya())return this.rf.next().ja[0];throw Error("No such element");};Ni.prototype.remove=function(){return Error("Unsupported operation")};function Oi(a,b,c){this.B=a;this.oc=b;this.A=c;this.l=15077647;this.L=8196}h=Oi.prototype;h.toString=function(){return qd(this)};
h.equiv=function(a){return this.K(null,a)};h.keys=function(){return Id(B(this))};h.entries=function(){return Fh(B(this))};h.values=function(){return Id(B(this))};h.has=function(a){return Le(this,a)};h.forEach=function(a){for(var b=B(this),c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e),g=O(f,0,null),f=O(f,1,null);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=B(b))Ee(b)?(c=gd(b),b=hd(b),g=c,d=M(c),c=g):(c=D(b),g=O(c,0,null),f=O(c,1,null),a.a?a.a(f,g):a.call(null,f,g),b=F(b),c=null,d=0),e=0;else return null};
h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){return nc(this.oc,b)?b:c};h.ib=function(){return new Ni(od(this.oc))};h.V=function(){return this.B};h.Ea=function(){return new Oi(this.B,this.oc,this.A)};h.ba=function(){return cc(this.oc)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Md(this)};h.K=function(a,b){return ze(b)&&M(this)===M(b)&&Vf(function(a){return function(b){return Le(a,b)}}(this),b)};h.dd=function(){return new Pi(Zc(this.oc))};h.ta=function(){return fe(Qi,this.B)};
h.ef=function(a,b){return new Oi(this.B,qc(this.oc,b),null)};h.Z=function(){return Jh(this.oc)};h.Y=function(a,b){return new Oi(b,this.oc,this.A)};h.ia=function(a,b){return new Oi(this.B,oe.h(this.oc,b,null),null)};h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.T(null,c);case 3:return this.R(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.T(null,c)};a.h=function(a,c,d){return this.R(null,c,d)};return a}();
h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return this.T(null,a)};h.a=function(a,b){return this.R(null,a,b)};var Qi=new Oi(null,Uf,Nd);function Ri(a){var b=a.length;if(b<=Mh)for(var c=0,d=Zc(Uf);;)if(c<b)var e=c+1,d=bd(d,a[c],null),c=e;else return new Oi(null,ad(d),null);else for(c=0,d=Zc(Qi);;)if(c<b)e=c+1,d=$c(d,a[c]),c=e;else return ad(d)}Oi.prototype[Rb]=function(){return Id(this)};function Pi(a){this.pc=a;this.L=136;this.l=259}h=Pi.prototype;
h.Lc=function(a,b){this.pc=bd(this.pc,b,null);return this};h.hd=function(){return new Oi(null,ad(this.pc),null)};h.ba=function(){return M(this.pc)};h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){return mc.h(this.pc,b,He)===He?c:b};
h.call=function(){function a(a,b,c){return mc.h(this.pc,b,He)===He?c:b}function b(a,b){return mc.h(this.pc,b,He)===He?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.h=a;return c}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return mc.h(this.pc,a,He)===He?null:a};h.a=function(a,b){return mc.h(this.pc,a,He)===He?b:a};
function Si(a,b,c){this.B=a;this.dc=b;this.A=c;this.l=417730831;this.L=8192}h=Si.prototype;h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};h.keys=function(){return Id(B(this))};h.entries=function(){return Fh(B(this))};h.values=function(){return Id(B(this))};h.has=function(a){return Le(this,a)};
h.forEach=function(a){for(var b=B(this),c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e),g=O(f,0,null),f=O(f,1,null);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=B(b))Ee(b)?(c=gd(b),b=hd(b),g=c,d=M(c),c=g):(c=D(b),g=O(c,0,null),f=O(c,1,null),a.a?a.a(f,g):a.call(null,f,g),b=F(b),c=null,d=0),e=0;else return null};h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){a=Gi(this.dc,b);return null!=a?a.key:c};h.V=function(){return this.B};h.Ea=function(){return new Si(this.B,this.dc,this.A)};h.ba=function(){return M(this.dc)};
h.fd=function(){return 0<M(this.dc)?X.a(gf,Tc(this.dc)):null};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Md(this)};h.K=function(a,b){return ze(b)&&M(this)===M(b)&&Vf(function(a){return function(b){return Le(a,b)}}(this),b)};h.ta=function(){return new Si(this.B,dc(this.dc),0)};h.ef=function(a,b){return new Si(this.B,qe.a(this.dc,b),null)};h.Z=function(){return Jh(this.dc)};h.Y=function(a,b){return new Si(b,this.dc,this.A)};h.ia=function(a,b){return new Si(this.B,oe.h(this.dc,b,null),null)};
h.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.T(null,c);case 3:return this.R(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.T(null,c)};a.h=function(a,c,d){return this.R(null,c,d)};return a}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.g=function(a){return this.T(null,a)};h.a=function(a,b){return this.R(null,a,b)};Si.prototype[Rb]=function(){return Id(this)};
function Ti(a){a=B(a);if(null==a)return Qi;if(a instanceof C&&0===a.F){a=a.j;a:for(var b=0,c=Zc(Qi);;)if(b<a.length)var d=b+1,c=c.Lc(null,a[b]),b=d;else break a;return c.hd(null)}for(d=Zc(Qi);;)if(null!=a)b=F(a),d=d.Lc(null,a.Da(null)),a=b;else return ad(d)}function Ui(a){for(var b=me;;)if(F(a))b=le.a(b,D(a)),a=F(a);else return B(b)}function sf(a){if(null!=a&&(a.L&4096||a.Pf))return a.Jd(null);if("string"===typeof a)return a;throw Error([t("Doesn't support name: "),t(a)].join(""));}
function Vi(a,b){return new tf(null,function(){var c=B(b);if(c){var d;d=D(c);d=a.g?a.g(d):a.call(null,d);c=r(d)?de(D(c),Vi(a,Ed(c))):null}else c=null;return c},null,null)}function Wi(a,b,c){this.F=a;this.end=b;this.step=c}Wi.prototype.Ya=function(){return 0<this.step?this.F<this.end:this.F>this.end};Wi.prototype.next=function(){var a=this.F;this.F+=this.step;return a};function Xi(a,b,c,d,e){this.B=a;this.start=b;this.end=c;this.step=d;this.A=e;this.l=32375006;this.L=8192}h=Xi.prototype;
h.toString=function(){return qd(this)};h.equiv=function(a){return this.K(null,a)};h.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return H(this,a,0);case 2:return H(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.g=function(a){return H(this,a,0)};a.a=function(a,c){return H(this,a,c)};return a}();
h.lastIndexOf=function(){function a(a){return $d(this,a,M(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return $d(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.g=a;b.a=function(a,b){return $d(this,a,b)};return b}();h.N=function(a,b){if(b<cc(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};
h.ab=function(a,b,c){return b<cc(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};h.ib=function(){return new Wi(this.start,this.end,this.step)};h.V=function(){return this.B};h.Ea=function(){return new Xi(this.B,this.start,this.end,this.step,this.A)};h.lb=function(){return 0<this.step?this.start+this.step<this.end?new Xi(this.B,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Xi(this.B,this.start+this.step,this.end,this.step,null):null};
h.ba=function(){return Mb(Oc(this))?0:Math.ceil((this.end-this.start)/this.step)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=Kd(this)};h.K=function(a,b){return ce(this,b)};h.ta=function(){return fe(Fd,this.B)};h.Fa=function(a,b){return Rd(this,b)};h.Ga=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Qd(c))return G.g?G.g(c):G.call(null,c);a+=this.step}else return c};h.Da=function(){return null==Oc(this)?null:this.start};
h.bb=function(){return null!=Oc(this)?new Xi(this.B,this.start+this.step,this.end,this.step,null):Fd};h.Z=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};h.Y=function(a,b){return new Xi(b,this.start,this.end,this.step,this.A)};h.ia=function(a,b){return de(b,this)};Xi.prototype[Rb]=function(){return Id(this)};
function Yi(){return function(){function a(a,b,c){return new T(null,2,5,V,[xg.h?xg.h(a,b,c):xg.call(null,a,b,c),yg.h?yg.h(a,b,c):yg.call(null,a,b,c)],null)}function b(a,b){return new T(null,2,5,V,[xg.a?xg.a(a,b):xg.call(null,a,b),yg.a?yg.a(a,b):yg.call(null,a,b)],null)}function c(a){return new T(null,2,5,V,[xg.g?xg.g(a):xg.call(null,a),yg.g?yg.g(a):yg.call(null,a)],null)}function d(){return new T(null,2,5,V,[xg.D?xg.D():xg.call(null),yg.D?yg.D():yg.call(null)],null)}var e=null,f=function(){function a(c,
d,e,f){var g=null;if(3<arguments.length){for(var g=0,v=Array(arguments.length-3);g<v.length;)v[g]=arguments[g+3],++g;g=new C(v,0)}return b.call(this,c,d,e,g)}function b(a,c,d,e){return new T(null,2,5,V,[Lf(xg,a,c,d,e),Lf(yg,a,c,d,e)],null)}a.I=3;a.H=function(a){var c=D(a);a=F(a);var d=D(a);a=F(a);var e=D(a);a=Ed(a);return b(c,d,e,a)};a.o=b;return a}(),e=function(e,l,m,n){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,e);case 2:return b.call(this,e,l);case 3:return a.call(this,
e,l,m);default:var p=null;if(3<arguments.length){for(var p=0,u=Array(arguments.length-3);p<u.length;)u[p]=arguments[p+3],++p;p=new C(u,0)}return f.o(e,l,m,p)}throw Error("Invalid arity: "+arguments.length);};e.I=3;e.H=f.H;e.D=d;e.g=c;e.a=b;e.h=a;e.o=f.o;return e}()}function Zi(a){a:for(var b=a;;)if(B(b))b=F(b);else break a;return a}function $i(a,b){if("string"===typeof b){var c=a.exec(b);return Gd.a(D(c),b)?1===M(c)?D(c):ch(c):null}throw new TypeError("re-matches must match against a string.");}
function aj(a,b){if("string"===typeof b){var c=a.exec(b);return null==c?null:1===M(c)?D(c):ch(c)}throw new TypeError("re-find must match against a string.");}function bj(a){if(!(a instanceof RegExp)){a=aj(/^\(\?([idmsux]*)\)/,a);var b=O(a,0,null);O(a,1,null);M(b)}}
function cj(a,b,c,d,e,f,g){var l=Bb;Bb=null==Bb?null:Bb-1;try{if(null!=Bb&&0>Bb)return Uc(a,"#");Uc(a,c);if(0===Ib.g(f))B(g)&&Uc(a,function(){var a=dj.g(f);return r(a)?a:"..."}());else{if(B(g)){var m=D(g);b.h?b.h(m,a,f):b.call(null,m,a,f)}for(var n=F(g),p=Ib.g(f)-1;;)if(!n||null!=p&&0===p){B(n)&&0===p&&(Uc(a,d),Uc(a,function(){var a=dj.g(f);return r(a)?a:"..."}()));break}else{Uc(a,d);var u=D(n);c=a;g=f;b.h?b.h(u,c,g):b.call(null,u,c,g);var w=F(n);c=p-1;n=w;p=c}}return Uc(a,e)}finally{Bb=l}}
function ej(a,b){for(var c=B(b),d=null,e=0,f=0;;)if(f<e){var g=d.N(null,f);Uc(a,g);f+=1}else if(c=B(c))d=c,Ee(d)?(c=gd(d),e=hd(d),d=c,g=M(c),c=e,e=g):(g=D(d),Uc(a,g),c=F(d),d=null,e=0),f=0;else return null}var fj={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function gj(a){return[t('"'),t(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return fj[a]})),t('"')].join("")}
function hj(a,b){var c=Je(A.a(a,Gb));return c?(c=null!=b?b.l&131072||b.Fg?!0:!1:!1)?null!=ue(b):c:c}
function ij(a,b,c){if(null==a)return Uc(b,"nil");if(hj(c,a)){Uc(b,"^");var d=ue(a);jj.h?jj.h(d,b,c):jj.call(null,d,b,c);Uc(b," ")}if(a.Oc)return a.jd(a,b,c);if(null!=a&&(a.l&2147483648||a.ka))return a.U(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Uc(b,""+t(a));if(null!=a&&a.constructor===Object)return Uc(b,"#js "),d=X.a(function(b){return new T(null,2,5,V,[rf.g(b),a[b]],null)},Fe(a)),kj.J?kj.J(d,jj,b,c):kj.call(null,d,jj,b,c);if(Kb(a))return cj(b,jj,"#js ["," ","]",c,a);if(ia(a))return r(Fb.g(c))?
Uc(b,gj(a)):Uc(b,a);if(la(a)){var e=a.name;c=r(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return ej(b,N(["#object[",c,' "',""+t(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+t(a);;)if(M(c)<b)c=[t("0"),t(c)].join("");else return c},ej(b,N(['#inst "',""+t(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return ej(b,N(['#"',a.source,'"'],0));if(r(a.constructor.hc))return ej(b,N(["#object[",a.constructor.hc.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=r(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return ej(b,N(["#object[",c," ",""+t(a),"]"],0))}function jj(a,b,c){var d=lj.g(c);return r(d)?(c=oe.h(c,mj,ij),d.h?d.h(a,b,c):d.call(null,a,b,c)):ij(a,b,c)}
function nj(a){var b=Db();if(xe(a))b="";else{var c=t,d=new db;a:{var e=new pd(d);jj(D(a),e,b);a=B(F(a));for(var f=null,g=0,l=0;;)if(l<g){var m=f.N(null,l);Uc(e," ");jj(m,e,b);l+=1}else if(a=B(a))f=a,Ee(f)?(a=gd(f),g=hd(f),f=a,m=M(a),a=g,g=m):(m=D(f),Uc(e," "),jj(m,e,b),a=F(f),f=null,g=0),l=0;else break a}b=""+c(d)}return b}
function kj(a,b,c,d){return cj(c,function(a,c,d){var l=sc(a);b.h?b.h(l,c,d):b.call(null,l,c,d);Uc(c," ");a=tc(a);return b.h?b.h(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,B(a))}jg.prototype.ka=!0;jg.prototype.U=function(a,b,c){Uc(b,"#object [cljs.core.Volatile ");jj(new q(null,1,[qj,this.state],null),b,c);return Uc(b,"]")};C.prototype.ka=!0;C.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};tf.prototype.ka=!0;tf.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};
ti.prototype.ka=!0;ti.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};ki.prototype.ka=!0;ki.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};xi.prototype.ka=!0;xi.prototype.U=function(a,b,c){return cj(b,jj,"["," ","]",c,this)};Hh.prototype.ka=!0;Hh.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};Si.prototype.ka=!0;Si.prototype.U=function(a,b,c){return cj(b,jj,"#{"," ","}",c,this)};eh.prototype.ka=!0;
eh.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};of.prototype.ka=!0;of.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};be.prototype.ka=!0;be.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};pi.prototype.ka=!0;pi.prototype.U=function(a,b,c){return kj(this,jj,b,c)};mi.prototype.ka=!0;mi.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};ih.prototype.ka=!0;ih.prototype.U=function(a,b,c){return cj(b,jj,"["," ","]",c,this)};
Fi.prototype.ka=!0;Fi.prototype.U=function(a,b,c){return kj(this,jj,b,c)};Oi.prototype.ka=!0;Oi.prototype.U=function(a,b,c){return cj(b,jj,"#{"," ","}",c,this)};Af.prototype.ka=!0;Af.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};cg.prototype.ka=!0;cg.prototype.U=function(a,b,c){Uc(b,"#object [cljs.core.Atom ");jj(new q(null,1,[qj,this.state],null),b,c);return Uc(b,"]")};Ji.prototype.ka=!0;Ji.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};wi.prototype.ka=!0;
wi.prototype.U=function(a,b,c){return cj(b,jj,"["," ","]",c,this)};T.prototype.ka=!0;T.prototype.U=function(a,b,c){return cj(b,jj,"["," ","]",c,this)};nh.prototype.ka=!0;nh.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};lf.prototype.ka=!0;lf.prototype.U=function(a,b){return Uc(b,"()")};oh.prototype.ka=!0;oh.prototype.U=function(a,b,c){return cj(b,jj,"#queue ["," ","]",c,B(this))};q.prototype.ka=!0;q.prototype.U=function(a,b,c){return kj(this,jj,b,c)};Xi.prototype.ka=!0;
Xi.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};Ii.prototype.ka=!0;Ii.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};jf.prototype.ka=!0;jf.prototype.U=function(a,b,c){return cj(b,jj,"("," ",")",c,this)};y.prototype.Kc=!0;y.prototype.gc=function(a,b){if(b instanceof y)return Cd(this,b);throw Error([t("Cannot compare "),t(this),t(" to "),t(b)].join(""));};P.prototype.Kc=!0;
P.prototype.gc=function(a,b){if(b instanceof P)return pf(this,b);throw Error([t("Cannot compare "),t(this),t(" to "),t(b)].join(""));};ih.prototype.Kc=!0;ih.prototype.gc=function(a,b){if(De(b))return Ne(this,b);throw Error([t("Cannot compare "),t(this),t(" to "),t(b)].join(""));};T.prototype.Kc=!0;T.prototype.gc=function(a,b){if(De(b))return Ne(this,b);throw Error([t("Cannot compare "),t(this),t(" to "),t(b)].join(""));};var rj=null;
function sj(){return function(a){return function(b){return function(){function c(c,d){var e=G.g?G.g(b):G.call(null,b);nd(b,d);return Gd.a(e,d)?c:a.a?a.a(c,d):a.call(null,c,d)}function d(b){return a.g?a.g(b):a.call(null,b)}function e(){return a.D?a.D():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.D=e;f.g=d;f.a=c;return f}()}(new jg(tj))}}
function uj(){}var vj=function vj(b){if(null!=b&&null!=b.Bg)return b.Bg(b);var c=vj[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=vj._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IEncodeJS.-clj-\x3ejs",b);};function wj(a){return(null!=a?a.Ag||(a.Qd?0:Nb(uj,a)):Nb(uj,a))?vj(a):"string"===typeof a||"number"===typeof a||a instanceof P||a instanceof y?xj.g?xj.g(a):xj.call(null,a):nj(N([a],0))}
var xj=function xj(b){if(null==b)return null;if(null!=b?b.Ag||(b.Qd?0:Nb(uj,b)):Nb(uj,b))return vj(b);if(b instanceof P)return sf(b);if(b instanceof y)return""+t(b);if(Be(b)){var c={};b=B(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.N(null,f),l=O(g,0,null),g=O(g,1,null);c[wj(l)]=xj(g);f+=1}else if(b=B(b))Ee(b)?(e=gd(b),b=hd(b),d=e,e=M(e)):(e=D(b),d=O(e,0,null),e=O(e,1,null),c[wj(d)]=xj(e),b=F(b),d=null,e=0),f=0;else break;return c}if(ye(b)){c=[];b=B(X.a(xj,b));d=null;for(f=e=0;;)if(f<e)l=d.N(null,
f),c.push(l),f+=1;else if(b=B(b))d=b,Ee(d)?(b=gd(d),f=hd(d),d=b,e=M(b),b=f):(b=D(d),c.push(b),b=F(d),d=null,e=0),f=0;else break;return c}return b};function yj(){}var zj=function zj(b,c){if(null!=b&&null!=b.zg)return b.zg(b,c);var d=zj[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=zj._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("IEncodeClojure.-js-\x3eclj",b);};function Aj(a){return Bj(a,N([new q(null,1,[Cj,!1],null)],0))}
function Bj(a,b){var c=null!=b&&(b.l&64||b.M)?S(fg,b):b,d=A.a(c,Cj);return function(a,c,d,l){return function n(p){return(null!=p?p.jh||(p.Qd?0:Nb(yj,p)):Nb(yj,p))?zj(p,S(Hi,b)):Ie(p)?Zi(X.a(n,p)):ye(p)?Bg.a(null==p?null:dc(p),X.a(n,p)):Kb(p)?ch(X.a(n,p)):Ob(p)===Object?Bg.a(Uf,function(){return function(a,b,c,d){return function z(e){return new tf(null,function(a,b,c,d){return function(){for(;;){var a=B(e);if(a){if(Ee(a)){var b=gd(a),c=M(b),f=zf(c);a:for(var g=0;;)if(g<c){var l=gc.a(b,g),l=new T(null,
2,5,V,[d.g?d.g(l):d.call(null,l),n(p[l])],null);f.add(l);g+=1}else{b=!0;break a}return b?Bf(f.Ca(),z(hd(a))):Bf(f.Ca(),null)}f=D(a);return de(new T(null,2,5,V,[d.g?d.g(f):d.call(null,f),n(p[f])],null),z(Ed(a)))}return null}}}(a,b,c,d),null,null)}}(a,c,d,l)(Fe(p))}()):p}}(b,c,d,r(d)?rf:t)(a)}var Dj=null;function Ej(){if(null==Dj){var a=new q(null,3,[Fj,Uf,Gj,Uf,Hj,Uf],null);Dj=eg?eg(a):dg.call(null,a)}return Dj}
function Ij(a,b,c){var d=Gd.a(b,c);if(!d&&!(d=Le(Hj.g(a).call(null,b),c))&&(d=De(c))&&(d=De(b)))if(d=M(c)===M(b))for(var d=!0,e=0;;)if(d&&e!==M(c))d=Ij(a,b.g?b.g(e):b.call(null,e),c.g?c.g(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function Jj(a){var b;b=Ej();b=G.g?G.g(b):G.call(null,b);return Of(A.a(Fj.g(b),a))}function Kj(a,b,c,d){ig.a(a,function(){return G.g?G.g(b):G.call(null,b)});ig.a(c,function(){return G.g?G.g(d):G.call(null,d)})}
var Lj=function Lj(b,c,d){var e=(G.g?G.g(d):G.call(null,d)).call(null,b),e=r(r(e)?e.g?e.g(c):e.call(null,c):e)?!0:null;if(r(e))return e;e=function(){for(var a=Jj(c);;)if(0<M(a))Lj(b,D(a),d),a=Ed(a);else return null}();if(r(e))return e;e=function(){for(var a=Jj(b);;)if(0<M(a))Lj(D(a),c,d),a=Ed(a);else return null}();return r(e)?e:!1};function Mj(a,b,c){c=Lj(a,b,c);if(r(c))a=c;else{c=Ij;var d;d=Ej();d=G.g?G.g(d):G.call(null,d);a=c(d,a,b)}return a}
var Nj=function Nj(b,c,d,e,f,g,l){var m=Wb(function(a,e){var g=O(e,0,null);O(e,1,null);if(Ij(G.g?G.g(d):G.call(null,d),c,g)){var l;l=(l=null==a)?l:Mj(g,D(a),f);l=r(l)?e:a;if(!r(Mj(D(l),g,f)))throw Error([t("Multiple methods in multimethod '"),t(b),t("' match dispatch value: "),t(c),t(" -\x3e "),t(g),t(" and "),t(D(l)),t(", and neither is preferred")].join(""));return l}return a},null,G.g?G.g(e):G.call(null,e));if(r(m)){if(Gd.a(G.g?G.g(l):G.call(null,l),G.g?G.g(d):G.call(null,d)))return ig.J(g,oe,
c,je(m)),je(m);Kj(g,e,l,d);return Nj(b,c,d,e,f,g,l)}return null};function Oj(a,b){throw Error([t("No method in multimethod '"),t(a),t("' for dispatch value: "),t(b)].join(""));}function Pj(a,b,c,d,e,f,g,l){this.name=a;this.w=b;this.Jg=c;this.Xd=d;this.sd=e;this.$g=f;this.ce=g;this.Bd=l;this.l=4194305;this.L=4352}h=Pj.prototype;
h.call=function(){function a(a,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I,J,Q,R){a=this;var na=Mf(a.w,b,c,d,e,N([f,g,l,m,n,z,p,u,v,w,K,E,L,I,J,Q,R],0)),yc=Qj(this,na);r(yc)||Oj(a.name,na);return Mf(yc,b,c,d,e,N([f,g,l,m,n,z,p,u,v,w,K,E,L,I,J,Q,R],0))}function b(a,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I,J,Q){a=this;var R=a.w.Ra?a.w.Ra(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I,J,Q):a.w.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I,J,Q),na=Qj(this,R);r(na)||Oj(a.name,R);return na.Ra?na.Ra(b,c,d,e,f,g,l,m,n,z,p,u,v,w,
K,E,L,I,J,Q):na.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I,J,Q)}function c(a,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I,J){a=this;var Q=a.w.Qa?a.w.Qa(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I,J):a.w.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I,J),R=Qj(this,Q);r(R)||Oj(a.name,Q);return R.Qa?R.Qa(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I,J):R.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I,J)}function d(a,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I){a=this;var J=a.w.Pa?a.w.Pa(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I):a.w.call(null,
b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I),Q=Qj(this,J);r(Q)||Oj(a.name,J);return Q.Pa?Q.Pa(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I):Q.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L,I)}function e(a,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L){a=this;var I=a.w.Oa?a.w.Oa(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L):a.w.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L),J=Qj(this,I);r(J)||Oj(a.name,I);return J.Oa?J.Oa(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L):J.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E,L)}function f(a,b,c,d,e,f,g,l,m,n,z,p,u,v,
w,K,E){a=this;var L=a.w.Na?a.w.Na(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E):a.w.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E),I=Qj(this,L);r(I)||Oj(a.name,L);return I.Na?I.Na(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E):I.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K,E)}function g(a,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K){a=this;var E=a.w.Ma?a.w.Ma(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K):a.w.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w,K),L=Qj(this,E);r(L)||Oj(a.name,E);return L.Ma?L.Ma(b,c,d,e,f,g,l,m,n,z,p,u,v,w,K):L.call(null,b,c,d,e,f,g,l,m,n,z,p,
u,v,w,K)}function l(a,b,c,d,e,f,g,l,m,n,z,p,u,v,w){a=this;var K=a.w.La?a.w.La(b,c,d,e,f,g,l,m,n,z,p,u,v,w):a.w.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w),E=Qj(this,K);r(E)||Oj(a.name,K);return E.La?E.La(b,c,d,e,f,g,l,m,n,z,p,u,v,w):E.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v,w)}function m(a,b,c,d,e,f,g,l,m,n,z,p,u,v){a=this;var w=a.w.Ka?a.w.Ka(b,c,d,e,f,g,l,m,n,z,p,u,v):a.w.call(null,b,c,d,e,f,g,l,m,n,z,p,u,v),K=Qj(this,w);r(K)||Oj(a.name,w);return K.Ka?K.Ka(b,c,d,e,f,g,l,m,n,z,p,u,v):K.call(null,b,c,d,e,f,
g,l,m,n,z,p,u,v)}function n(a,b,c,d,e,f,g,l,m,n,z,p,u){a=this;var v=a.w.Ja?a.w.Ja(b,c,d,e,f,g,l,m,n,z,p,u):a.w.call(null,b,c,d,e,f,g,l,m,n,z,p,u),w=Qj(this,v);r(w)||Oj(a.name,v);return w.Ja?w.Ja(b,c,d,e,f,g,l,m,n,z,p,u):w.call(null,b,c,d,e,f,g,l,m,n,z,p,u)}function p(a,b,c,d,e,f,g,l,m,n,z,p){a=this;var u=a.w.Ia?a.w.Ia(b,c,d,e,f,g,l,m,n,z,p):a.w.call(null,b,c,d,e,f,g,l,m,n,z,p),v=Qj(this,u);r(v)||Oj(a.name,u);return v.Ia?v.Ia(b,c,d,e,f,g,l,m,n,z,p):v.call(null,b,c,d,e,f,g,l,m,n,z,p)}function u(a,b,
c,d,e,f,g,l,m,n,z){a=this;var p=a.w.Ha?a.w.Ha(b,c,d,e,f,g,l,m,n,z):a.w.call(null,b,c,d,e,f,g,l,m,n,z),u=Qj(this,p);r(u)||Oj(a.name,p);return u.Ha?u.Ha(b,c,d,e,f,g,l,m,n,z):u.call(null,b,c,d,e,f,g,l,m,n,z)}function w(a,b,c,d,e,f,g,l,m,n){a=this;var z=a.w.Ua?a.w.Ua(b,c,d,e,f,g,l,m,n):a.w.call(null,b,c,d,e,f,g,l,m,n),p=Qj(this,z);r(p)||Oj(a.name,z);return p.Ua?p.Ua(b,c,d,e,f,g,l,m,n):p.call(null,b,c,d,e,f,g,l,m,n)}function v(a,b,c,d,e,f,g,l,m){a=this;var n=a.w.Ta?a.w.Ta(b,c,d,e,f,g,l,m):a.w.call(null,
b,c,d,e,f,g,l,m),z=Qj(this,n);r(z)||Oj(a.name,n);return z.Ta?z.Ta(b,c,d,e,f,g,l,m):z.call(null,b,c,d,e,f,g,l,m)}function E(a,b,c,d,e,f,g,l){a=this;var m=a.w.Sa?a.w.Sa(b,c,d,e,f,g,l):a.w.call(null,b,c,d,e,f,g,l),n=Qj(this,m);r(n)||Oj(a.name,m);return n.Sa?n.Sa(b,c,d,e,f,g,l):n.call(null,b,c,d,e,f,g,l)}function I(a,b,c,d,e,f,g){a=this;var l=a.w.xa?a.w.xa(b,c,d,e,f,g):a.w.call(null,b,c,d,e,f,g),m=Qj(this,l);r(m)||Oj(a.name,l);return m.xa?m.xa(b,c,d,e,f,g):m.call(null,b,c,d,e,f,g)}function z(a,b,c,d,
e,f){a=this;var g=a.w.X?a.w.X(b,c,d,e,f):a.w.call(null,b,c,d,e,f),l=Qj(this,g);r(l)||Oj(a.name,g);return l.X?l.X(b,c,d,e,f):l.call(null,b,c,d,e,f)}function L(a,b,c,d,e){a=this;var f=a.w.J?a.w.J(b,c,d,e):a.w.call(null,b,c,d,e),g=Qj(this,f);r(g)||Oj(a.name,f);return g.J?g.J(b,c,d,e):g.call(null,b,c,d,e)}function K(a,b,c,d){a=this;var e=a.w.h?a.w.h(b,c,d):a.w.call(null,b,c,d),f=Qj(this,e);r(f)||Oj(a.name,e);return f.h?f.h(b,c,d):f.call(null,b,c,d)}function Q(a,b,c){a=this;var d=a.w.a?a.w.a(b,c):a.w.call(null,
b,c),e=Qj(this,d);r(e)||Oj(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function R(a,b){a=this;var c=a.w.g?a.w.g(b):a.w.call(null,b),d=Qj(this,c);r(d)||Oj(a.name,c);return d.g?d.g(b):d.call(null,b)}function na(a){a=this;var b=a.w.D?a.w.D():a.w.call(null),c=Qj(this,b);r(c)||Oj(a.name,b);return c.D?c.D():c.call(null)}var J=null,J=function(J,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb,Nc,Ad,Rh){switch(arguments.length){case 1:return na.call(this,J);case 2:return R.call(this,J,W);case 3:return Q.call(this,
J,W,da);case 4:return K.call(this,J,W,da,fa);case 5:return L.call(this,J,W,da,fa,ka);case 6:return z.call(this,J,W,da,fa,ka,U);case 7:return I.call(this,J,W,da,fa,ka,U,oa);case 8:return E.call(this,J,W,da,fa,ka,U,oa,Ka);case 9:return v.call(this,J,W,da,fa,ka,U,oa,Ka,ta);case 10:return w.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua);case 11:return u.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va);case 12:return p.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea);case 13:return n.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va,
Ea,La);case 14:return m.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa);case 15:return l.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua);case 16:return g.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb);case 17:return f.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb,kb);case 18:return e.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb);case 19:return d.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb);case 20:return c.call(this,J,W,da,fa,ka,U,oa,Ka,
ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb,Nc);case 21:return b.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb,Nc,Ad);case 22:return a.call(this,J,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb,Nc,Ad,Rh)}throw Error("Invalid arity: "+arguments.length);};J.g=na;J.a=R;J.h=Q;J.J=K;J.X=L;J.xa=z;J.Sa=I;J.Ta=E;J.Ua=v;J.Ha=w;J.Ia=u;J.Ja=p;J.Ka=n;J.La=m;J.Ma=l;J.Na=g;J.Oa=f;J.Pa=e;J.Qa=d;J.Ra=c;J.re=b;J.Fd=a;return J}();h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};
h.D=function(){var a=this.w.D?this.w.D():this.w.call(null),b=Qj(this,a);r(b)||Oj(this.name,a);return b.D?b.D():b.call(null)};h.g=function(a){var b=this.w.g?this.w.g(a):this.w.call(null,a),c=Qj(this,b);r(c)||Oj(this.name,b);return c.g?c.g(a):c.call(null,a)};h.a=function(a,b){var c=this.w.a?this.w.a(a,b):this.w.call(null,a,b),d=Qj(this,c);r(d)||Oj(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
h.h=function(a,b,c){var d=this.w.h?this.w.h(a,b,c):this.w.call(null,a,b,c),e=Qj(this,d);r(e)||Oj(this.name,d);return e.h?e.h(a,b,c):e.call(null,a,b,c)};h.J=function(a,b,c,d){var e=this.w.J?this.w.J(a,b,c,d):this.w.call(null,a,b,c,d),f=Qj(this,e);r(f)||Oj(this.name,e);return f.J?f.J(a,b,c,d):f.call(null,a,b,c,d)};h.X=function(a,b,c,d,e){var f=this.w.X?this.w.X(a,b,c,d,e):this.w.call(null,a,b,c,d,e),g=Qj(this,f);r(g)||Oj(this.name,f);return g.X?g.X(a,b,c,d,e):g.call(null,a,b,c,d,e)};
h.xa=function(a,b,c,d,e,f){var g=this.w.xa?this.w.xa(a,b,c,d,e,f):this.w.call(null,a,b,c,d,e,f),l=Qj(this,g);r(l)||Oj(this.name,g);return l.xa?l.xa(a,b,c,d,e,f):l.call(null,a,b,c,d,e,f)};h.Sa=function(a,b,c,d,e,f,g){var l=this.w.Sa?this.w.Sa(a,b,c,d,e,f,g):this.w.call(null,a,b,c,d,e,f,g),m=Qj(this,l);r(m)||Oj(this.name,l);return m.Sa?m.Sa(a,b,c,d,e,f,g):m.call(null,a,b,c,d,e,f,g)};
h.Ta=function(a,b,c,d,e,f,g,l){var m=this.w.Ta?this.w.Ta(a,b,c,d,e,f,g,l):this.w.call(null,a,b,c,d,e,f,g,l),n=Qj(this,m);r(n)||Oj(this.name,m);return n.Ta?n.Ta(a,b,c,d,e,f,g,l):n.call(null,a,b,c,d,e,f,g,l)};h.Ua=function(a,b,c,d,e,f,g,l,m){var n=this.w.Ua?this.w.Ua(a,b,c,d,e,f,g,l,m):this.w.call(null,a,b,c,d,e,f,g,l,m),p=Qj(this,n);r(p)||Oj(this.name,n);return p.Ua?p.Ua(a,b,c,d,e,f,g,l,m):p.call(null,a,b,c,d,e,f,g,l,m)};
h.Ha=function(a,b,c,d,e,f,g,l,m,n){var p=this.w.Ha?this.w.Ha(a,b,c,d,e,f,g,l,m,n):this.w.call(null,a,b,c,d,e,f,g,l,m,n),u=Qj(this,p);r(u)||Oj(this.name,p);return u.Ha?u.Ha(a,b,c,d,e,f,g,l,m,n):u.call(null,a,b,c,d,e,f,g,l,m,n)};h.Ia=function(a,b,c,d,e,f,g,l,m,n,p){var u=this.w.Ia?this.w.Ia(a,b,c,d,e,f,g,l,m,n,p):this.w.call(null,a,b,c,d,e,f,g,l,m,n,p),w=Qj(this,u);r(w)||Oj(this.name,u);return w.Ia?w.Ia(a,b,c,d,e,f,g,l,m,n,p):w.call(null,a,b,c,d,e,f,g,l,m,n,p)};
h.Ja=function(a,b,c,d,e,f,g,l,m,n,p,u){var w=this.w.Ja?this.w.Ja(a,b,c,d,e,f,g,l,m,n,p,u):this.w.call(null,a,b,c,d,e,f,g,l,m,n,p,u),v=Qj(this,w);r(v)||Oj(this.name,w);return v.Ja?v.Ja(a,b,c,d,e,f,g,l,m,n,p,u):v.call(null,a,b,c,d,e,f,g,l,m,n,p,u)};h.Ka=function(a,b,c,d,e,f,g,l,m,n,p,u,w){var v=this.w.Ka?this.w.Ka(a,b,c,d,e,f,g,l,m,n,p,u,w):this.w.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w),E=Qj(this,v);r(E)||Oj(this.name,v);return E.Ka?E.Ka(a,b,c,d,e,f,g,l,m,n,p,u,w):E.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w)};
h.La=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v){var E=this.w.La?this.w.La(a,b,c,d,e,f,g,l,m,n,p,u,w,v):this.w.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v),I=Qj(this,E);r(I)||Oj(this.name,E);return I.La?I.La(a,b,c,d,e,f,g,l,m,n,p,u,w,v):I.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v)};
h.Ma=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E){var I=this.w.Ma?this.w.Ma(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E):this.w.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E),z=Qj(this,I);r(z)||Oj(this.name,I);return z.Ma?z.Ma(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E):z.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E)};
h.Na=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I){var z=this.w.Na?this.w.Na(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I):this.w.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I),L=Qj(this,z);r(L)||Oj(this.name,z);return L.Na?L.Na(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I):L.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I)};
h.Oa=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z){var L=this.w.Oa?this.w.Oa(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z):this.w.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z),K=Qj(this,L);r(K)||Oj(this.name,L);return K.Oa?K.Oa(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z):K.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z)};
h.Pa=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L){var K=this.w.Pa?this.w.Pa(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L):this.w.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L),Q=Qj(this,K);r(Q)||Oj(this.name,K);return Q.Pa?Q.Pa(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L):Q.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L)};
h.Qa=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K){var Q=this.w.Qa?this.w.Qa(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K):this.w.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K),R=Qj(this,Q);r(R)||Oj(this.name,Q);return R.Qa?R.Qa(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K):R.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K)};
h.Ra=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q){var R=this.w.Ra?this.w.Ra(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q):this.w.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q),na=Qj(this,R);r(na)||Oj(this.name,R);return na.Ra?na.Ra(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q):na.call(null,a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q)};
h.re=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R){var na=Mf(this.w,a,b,c,d,N([e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R],0)),J=Qj(this,na);r(J)||Oj(this.name,na);return Mf(J,a,b,c,d,N([e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,R],0))};function Rj(a,b,c){ig.J(a.sd,oe,b,c);Kj(a.ce,a.sd,a.Bd,a.Xd)}
function Qj(a,b){Gd.a(G.g?G.g(a.Bd):G.call(null,a.Bd),G.g?G.g(a.Xd):G.call(null,a.Xd))||Kj(a.ce,a.sd,a.Bd,a.Xd);var c=(G.g?G.g(a.ce):G.call(null,a.ce)).call(null,b);if(r(c))return c;c=Nj(a.name,b,a.Xd,a.sd,a.$g,a.ce,a.Bd);return r(c)?c:(G.g?G.g(a.sd):G.call(null,a.sd)).call(null,a.Jg)}h.Jd=function(){return jd(this.name)};h.Kd=function(){return kd(this.name)};h.S=function(){return qa(this)};function Sj(a,b){this.Wb=a;this.A=b;this.l=2153775104;this.L=2048}h=Sj.prototype;h.toString=function(){return this.Wb};
h.equiv=function(a){return this.K(null,a)};h.K=function(a,b){return b instanceof Sj&&this.Wb===b.Wb};h.U=function(a,b){return Uc(b,[t('#uuid "'),t(this.Wb),t('"')].join(""))};h.S=function(){null==this.A&&(this.A=zd(this.Wb));return this.A};h.gc=function(a,b){return wb(this.Wb,b.Wb)};function Tj(a){return new Sj(a,null)}
function Uj(){function a(){return Math.floor(16*Math.random()).toString(16)}var b=(8|3&Math.floor(16*Math.random())).toString(16);return Tj([t(a()),t(a()),t(a()),t(a()),t(a()),t(a()),t(a()),t(a()),t("-"),t(a()),t(a()),t(a()),t(a()),t("-"),t("4"),t(a()),t(a()),t(a()),t("-"),t(b),t(a()),t(a()),t(a()),t("-"),t(a()),t(a()),t(a()),t(a()),t(a()),t(a()),t(a()),t(a()),t(a()),t(a()),t(a()),t(a())].join(""))}
function Vj(a,b,c){var d=Error(a);this.message=a;this.data=b;this.Nf=c;this.name=d.name;this.description=d.description;this.Yg=d.Yg;this.fileName=d.fileName;this.lineNumber=d.lineNumber;this.columnNumber=d.columnNumber;this.stack=d.stack;return this}Vj.prototype.__proto__=Error.prototype;Vj.prototype.ka=!0;Vj.prototype.U=function(a,b,c){Uc(b,"#error {:message ");jj(this.message,b,c);r(this.data)&&(Uc(b,", :data "),jj(this.data,b,c));r(this.Nf)&&(Uc(b,", :cause "),jj(this.Nf,b,c));return Uc(b,"}")};
Vj.prototype.toString=function(){return qd(this)};var Wj=new P(null,"response","response",-1068424192),Xj=new y(null,"form","form",16469056,null),Yj=new P(null,"annotation-deletion-listeners","annotation-deletion-listeners",291736672),Zj=new y(null,"audio","audio",-835308448,null),ak=new P(null,"mm","mm",-1652850560),bk=new P(null,"aquamarine","aquamarine",263648544),ck=new P(null,"text-selection-listeners","text-selection-listeners",-878362272),dk=new P(null,"description","description",-1428560544),ek=new y(null,"input","input",-2097503808,null),
fk=new P(null,"line-height","line-height",1870784992),gk=new y(null,"target","target",1893533248,null),hk=new P(null,"lime","lime",-1796425088),ik=new y(null,"hgroup","hgroup",-1525585280,null),jk=new P(null,"deepskyblue","deepskyblue",-1691758944),kk=new P(null,"darksalmon","darksalmon",-896495551),lk=new P(null,"doc-sort-x-scale","doc-sort-x-scale",143412321),mk=new P(null,"div.textLayer","div.textLayer",1530883201),nk=new P(null,"antiquewhite","antiquewhite",-1702201183),ok=new y(null,"base","base",
1825810849,null),pk=new y(null,"h1","h1",-256355935,null),qk=new P(null,"finally","finally",1589088705),rk=new P(null,"mediumturquoise","mediumturquoise",2112212449),sk=new P(null,"slategrey","slategrey",-1531406687),tk=new y(null,"first","first",996428481,null),uk=new P(null,"l-brace","l-brace",613286657),vk=new y(null,"read-only","read-only",1448824641,null),wk=new P(null,"slategray","slategray",-178672671),xk=new y(null,"embed","embed",285618178,null),yk=new P(null,"l-paren","l-paren",2052672514),
zk=new P(null,"selector","selector",762528866),Ak=new y(null,"h3","h3",-586824606,null),Bk=new P(null,"sienna","sienna",-1559699358),Ck=new P(null,"kHz","kHz",240398466),Dk=new P(null,"on-set","on-set",-140953470),Ek=new y(null,"body","body",-408674142,null),Fk=new P(null,"format","format",-1306924766),Gk=new P(null,"orange","orange",73816386),Hk=new P(null,"navajowhite","navajowhite",1463125346),Ik=new y(null,"keygen","keygen",1068838274,null),Jk=new y(null,"meta16343","meta16343",557504066,null),
Kk=new P(null,"lavenderblush","lavenderblush",667482818),Lk=new y(null,"progress","progress",1884855074,null),Mk=new y(null,"first-of-type","first-of-type",900311874,null),Nk=new P(null,"doc-sort-y-scale","doc-sort-y-scale",-1904107614),Ok=new P(null,"firebrick","firebrick",-214380606),Tf=new y(null,"meta10139","meta10139",-2146245694,null),Pk=new y(null,"cite","cite",-744995773,null),Qk=new P(null,"orangered","orangered",-1851964317),Rk=new y(null,"enabled","enabled",-1458526013,null),Sk=new P(null,
"cljsLegacyRender","cljsLegacyRender",-1527295613),Tk=new P(null,"palevioletred","palevioletred",-1198100061),Uk=new P(null,"lawngreen","lawngreen",672111043),Vk=new P(null,"viewport-height","viewport-height",1948518883),Wk=new P(null,"pt","pt",556460867),Xk=new P(null,"box-shadow","box-shadow",1600206755),Yk=new y(null,"map","map",-1282745308,null),Zk=new y(null,"object","object",-1179821820,null),$k=new y(null,"i","i",253690212,null),al=new P(null,"api","api",-899839580),bl=new P(null,"seashell",
"seashell",1208259012),cl=new P(null,"original-text","original-text",744448452),dl=new P(null,"transform","transform",1381301764),el=new y(null,"math","math",-386381276,null),Gb=new P(null,"meta","meta",1499536964),fl=new P(null,"lightpink","lightpink",808485476),gl=new P(null,"selection-mode","selection-mode",254575236),hl=new P(null,"animation","animation",-1248293244),il=new y(null,"p","p",1791580836,null),jl=new P(null,"darkolivegreen","darkolivegreen",-2098617596),kl=new y(null,"nav","nav",-1934895292,
null),ll=new P(null,"aliceblue","aliceblue",-1185534108),ml=new P(null,"gray","gray",1013268388),nl=new y(null,"ruby","ruby",-653698108,null),ol=new P(null,"api-base-url","api-base-url",-307501116),pl=new P(null,"lightsteelblue","lightsteelblue",-209586236),ql=new y(null,"out-of-range","out-of-range",-1962117180,null),rl=new P(null,"whitesmoke","whitesmoke",1847137252),sl=new P(null,"color","color",1011675173),tl=new P(null,"selected-annotation-id","selected-annotation-id",-1883946907),ul=new y(null,
"links","links",986024133,null),vl=new P(null,"keywords?","keywords?",764949733),wl=new P(null,"darkgoldenrod","darkgoldenrod",-1115778811),xl=new y(null,"blockable","blockable",-28395259,null),Hb=new P(null,"dup","dup",556298533),yl=new P(null,"text-align","text-align",1786091845),zl=new y(null,"a","a",-482876059,null),Al=new P(null,"read","read",1140058661),Bl=new P(null,"key","key",-1516042587),Cl=new P(null,"tan","tan",1273609893),Dl=new y(null,"menu","menu",1992786725,null),El=new y(null,"blockquote",
"blockquote",2012795717,null),Fl=new y(null,"required","required",-846788763,null),Gl=new y(null,"img","img",-1211748411,null),Hl=new P(null,"bottom","bottom",-1550509018),Il=new P(null,"bisque","bisque",-862836634),Jl=new P(null,"white","white",-483998618),Kl=new y(null,"span","span",-1259562778,null),Ll=new y(null,"track","track",1836319014,null),Ml=new P(null,"private","private",-558947994),Nl=new y(null,"u","u",483896742,null),Ol=new P(null,"not-initialized","not-initialized",-1937378906),Pl=
new P(null,"lightgreen","lightgreen",-1542529498),Ql=new P(null,"white-space","white-space",-707351930),Rl=new y(null,"dl","dl",-499620186,null),Sl=new y(null,"select","select",-1506602266,null),Tl=new P(null,"render-fn","render-fn",398796518),Ul=new P(null,"font-size","font-size",-1847940346),Vl=new P(null,"pretty-print?","pretty-print?",1932217158),Wl=new P(null,"group-id","group-id",-1316082778),Xl=new y(null,"left","left",1241415590,null),Yl=new y(null,"html","html",641734630,null),Zl=new P(null,
"darkseagreen","darkseagreen",410063911),$l=new P(null,"crimson","crimson",-1192060857),am=new P(null,"darkslategray","darkslategray",348576839),bm=new y(null,"thead","thead",1348656231,null),cm=new P(null,"failure","failure",720415879),tj=new P("cljs.core","none","cljs.core/none",926646439),dm=new y(null,"del","del",-2079460185,null),em=new P(null,"mistyrose","mistyrose",-619815737),fm=new P(null,"scale","scale",-230427353),gm=new P(null,"chocolate","chocolate",772404615),hm=new P(null,"top","top",
-1856271961),im=new y(null,"fieldset","fieldset",-309239289,null),jm=new P(null,"font-weight","font-weight",2085804583),km=new y(null,"valid","valid",1796145767,null),lm=new P(null,"displayName","displayName",-809144601),mm=new P(null,"yellow","yellow",-881035449),gg=new P(null,"validator","validator",-1966190681),nm=new P(null,"method","method",55703592),pm=new y(null,"only-child","only-child",220029032,null),qm=new y(null,"aside","aside",-1240038232,null),rm=new y(null,"figure","figure",1079137448,
null),sm=new P(null,"raw","raw",1604651272),tm=new P(null,"default","default",-1987822328),um=new P(null,"space+","space+",378127624),vm=new P(null,"finally-block","finally-block",832982472),wm=new y(null,"cb","cb",-2064487928,null),xm=new y(null,"figcaption","figcaption",-149590520,null),ym=new P(null,"cadetblue","cadetblue",1126335112),zm=new P(null,"overflow","overflow",2058931880),Am=new P(null,"navy","navy",1626342120),Bm=new y(null,"q","q",-1965434072,null),Cm=new P(null,"ghostwhite","ghostwhite",
-1030428888),Dm=new P(null,"warn","warn",-436710552),Em=new P(null,"div.canvasWrapper","div.canvasWrapper",1897874312),Fm=new P(null,"dimgrey","dimgrey",265814984),Gm=new P(null,"canvas-style-height","canvas-style-height",-1108956151),Hm=new P(null,"name","name",1843675177),Im=new y(null,"bdi","bdi",317505641,null),Jm=new y(null,"first-child","first-child",-540335927,null),Km=new P(null,"frames","frames",1765687497),Lm=new P(null,"sy","sy",227523849),Mm=new P(null,"seagreen","seagreen",1345424905),
Nm=new y(null,"video","video",1797419657,null),Om=new y(null,"address","address",-2094936343,null),Pm=new y(null,"caption","caption",785147625,null),Qm=new P(null,"-moz-transform-origin","-moz-transform-origin",-801823959),Rm=new P(null,"comma","comma",1699024745),Sm=new P(null,"value","value",305978217),Tm=new P(null,"green","green",-945526839),Um=new P(null,"mediumseagreen","mediumseagreen",2130779146),Vm=new P(null,"indigo","indigo",-280252374),Wm=new y(null,"read-write","read-write",1818554410,
null),Xm=new P(null,"div.page","div.page",1917984906),Ym=new P(null,"white-space+","white-space+",1452157162),Zm=new P(null,"olivedrab","olivedrab",477000042),$m=new P(null,"auto-prefix","auto-prefix",1484803466),an=new P(null,"response-format","response-format",1664465322),bn=new P(null,"status-text","status-text",-1834235478),cn=new y(null,"dd","dd",300093898,null),dn=new P(null,"component-did-mount","component-did-mount",-1126910518),en=new P(null,"background-color","background-color",570434026),
fn=new P(null,"cyan","cyan",1118839274),gn=new P(null,"peachpuff","peachpuff",-1932127734),hn=new P(null,"limegreen","limegreen",-121735638),jn=new y(null,"rp","rp",-647737686,null),kn=new y(null,"hr","hr",-1276695702,null),ln=new P(null,"mediumslateblue","mediumslateblue",-900241526),mn=new y(null,"meta12260","meta12260",38669419,null),nn=new y(null,"meta","meta",-1154898805,null),on=new y(null,"tbody","tbody",1559853227,null),pn=new P(null,"width","width",-384071477),qn=new P(null,"px","px",281329899),
rn=new P(null,"background","background",-863952629),sn=new P(null,"aborted","aborted",1775972619),tn=new y(null,"table","table",1075588491,null),un=new P(null,"processing-request","processing-request",-264947221),vn=new P(null,"params","params",710516235),wn=new P(null,"violet","violet",-1351470549),xn=new P(null,"rem","rem",-976484757),yn=new P(null,"em","em",707813035),zn=new P(null,"media-expressions","media-expressions",1920421643),An=new P(null,"httpHeaders","httpHeaders",1670099851),Bn=new P(null,
"component-did-update","component-did-update",-1468549173),Cn=new y(null,"pre","pre",-535978900,null),Dn=new P(null,"sandybrown","sandybrown",-417646484),qj=new P(null,"val","val",128701612),En=new P(null,"div.annotationLayer","div.annotationLayer",-282126132),Fn=new P(null,"cursor","cursor",1011937484),Y=new P(null,"recur","recur",-437573268),Gn=new P(null,"type","type",1174270348),Hn=new P(null,"-o-transform-origin","-o-transform-origin",1849984588),In=new P(null,"request-received","request-received",
2110590540),Jn=new y(null,"ul","ul",291010124,null),Kn=new P(null,"alternate","alternate",-931038644),Ln=new P(null,"rendering?","rendering?",-1124117844),Mn=new P(null,"catch-block","catch-block",1175212748),Nn=new y(null,"meta16298","meta16298",885033740,null),On=new P(null,"yellowgreen","yellowgreen",844595052),Pn=new P(null,"params-to-str","params-to-str",-934869108),Qn=new P(null,"Hz","Hz",-1958732916),Rn=new P(null,"pc","pc",512913453),Sn=new P(null,"user-id","user-id",-206822291),Tn=new P(null,
"state","state",-1988618099),Un=new P(null,"mediumspringgreen","mediumspringgreen",-257604339),mj=new P(null,"fallback-impl","fallback-impl",-1501286995),Vn=new P(null,"steelblue","steelblue",1620562381),Wn=new P(null,"rosybrown","rosybrown",1634897517),Xn=new P(null,"cornflowerblue","cornflowerblue",-1713148307),Yn=new P(null,"ivory","ivory",-1259182451),Zn=new y(null,"disabled","disabled",110747309,null),$n=new P(null,"init-listeners","init-listeners",297983725),ao=new P(null,"lightgoldenrodyellow",
"lightgoldenrodyellow",1849392877),bo=new P(null,"handlers","handlers",79528781),co=new y(null,"sup","sup",-398960819,null),Eb=new P(null,"flush-on-newline","flush-on-newline",-151457939),eo=new P(null,"rettag","rettag",-602973235),fo=new y(null,"dfn","dfn",1882439694,null),go=new y(null,"sub","sub",-453228498,null),ho=new P(null,"componentWillUnmount","componentWillUnmount",1573788814),io=new P(null,"salmon","salmon",-1093653298),jo=new P(null,"string","string",-1989541586),ko=new P(null,"darkcyan",
"darkcyan",-1999655442),lo=new y(null,"mark","mark",1266715182,null),mo=new y(null,"only-of-type","only-of-type",-1960460626,null),no=new y(null,"script","script",336087726,null),oo=new P(null,"parse-error","parse-error",255902478),po=new P(null,"peru","peru",1147074382),qo=new P(null,"rules","rules",1198912366),ro=new y(null,"button","button",-1197855826,null),so=new y(null,"alt-flag","alt-flag",-1794972754,null),to=new P(null,"s","s",1705939918),uo=new P(null,"cornsilk","cornsilk",-1628976146),
vo=new y(null,"wbr","wbr",1869193327,null),wo=new P(null,"lightslategray","lightslategray",-1109503825),xo=new P(null,"on-click","on-click",1632826543),yo=new P(null,"authorizationToken","authorizationToken",-1884370705),zo=new P(null,"className","className",-1983287057),Gj=new P(null,"descendants","descendants",1824886031),Ao=new P(null,"merge","merge",-1804319409),Bo=new P(null,"size","size",1098693007),Co=new P(null,"blueviolet","blueviolet",887936463),Do=new y(null,"strong","strong",1910060527,
null),Eo=new P(null,"title","title",636505583),Fo=new P(null,"forestgreen","forestgreen",1609185807),Go=new P(null,"prefix","prefix",-265908465),Ho=new y(null,"default","default",-347290801,null),Io=new P(null,".selected-annotation",".selected-annotation",178111375),Jo=new P(null,"deg","deg",-681556081),Ko=new P(null,"headers","headers",-835030129),Lo=new P(null,"colon","colon",-965200945),Mo=new P(null,"lightseagreen","lightseagreen",-1503692817),No=new P(null,"shouldComponentUpdate","shouldComponentUpdate",
1795750960),Oo=new y(null,"li","li",-1930876848,null),Po=new P(null,"error-handler","error-handler",-484945776),Hj=new P(null,"ancestors","ancestors",-776045424),Qo=new y(null,"dt","dt",1272086768,null),Ro=new y(null,"flag","flag",-1565787888,null),So=new P(null,"style","style",-496642736),To=new P(null,"vendors","vendors",-153040496),Uo=new P(null,"doc-sort-page-scale","doc-sort-page-scale",760292784),Vo=new P(null,"cm","cm",540591536),Wo=new P(null,"write","write",-1857649168),Xo=new P(null,"gold",
"gold",-806826416),Yo=new P(null,"document-data","document-data",1068102352),Zo=new P(null,"div","div",1057191632),$o=new P(null,"output-to","output-to",-965533968),ap=new P(null,"turn","turn",75759344),Fb=new P(null,"readably","readably",1129599760),bp=new P(null,"gainsboro","gainsboro",-218568880),cp=new P(null,"darkorchid","darkorchid",-1255783536),dp=new P(null,"callback-fn","callback-fn",2018892720),ep=new P(null,"burlywood","burlywood",1747294160),fp=new y(null,"td","td",-1174502416,null),gp=
new P(null,"lightskyblue","lightskyblue",397352944),hp=new y(null,"box","box",-1123515375,null),ip=new P(null,"chartreuse","chartreuse",-1626529775),jp=new P(null,"fontFamily","fontFamily",1493518353),dj=new P(null,"more-marker","more-marker",-14717935),kp=new y(null,"tr","tr",215756881,null),lp=new P(null,"preamble","preamble",1641040241),mp=new P(null,"snow","snow",1266930033),np=new P(null,"reagentRender","reagentRender",-358306383),op=new P(null,"end-node","end-node",1655105009),pp=new P(null,
"ease","ease",-1427802543),qp=new y(null,"section","section",1340390001,null),rp=new y(null,"th","th",1094922961,null),sp=new y(null,"time","time",-1268547887,null),tp=new P(null,"moccasin","moccasin",885646097),up=new y(null,"optgroup","optgroup",-916153551,null),vp=new P(null,"honeydew","honeydew",297211825),wp=new P(null,"aqua","aqua",745022417),xp=new P(null,"darkred","darkred",1564487633),yp=new y(null,"iframe","iframe",-1770013743,null),zp=new P(null,"start-node","start-node",-649298991),Ap=
new P(null,"-webkit-transform-origin","-webkit-transform-origin",-969759694),Bp=new y(null,"legend","legend",613339282,null),Cp=new y(null,"em","em",-1946622734,null),Dp=new P(null,"no-cache","no-cache",1588056370),Ep=new P(null,"render","render",-1408033454),Fp=new P(null,"mediumorchid","mediumorchid",114416082),Gp=new P(null,"lightsalmon","lightsalmon",278000114),Hp=new y(null,"kbd","kbd",1956688402,null),Ip=new P(null,"media-queries","media-queries",-1563277678),Jp=new P(null,"saddlebrown","saddlebrown",
-1556765006),Up=new P(null,"wheat","wheat",783520466),Vp=new P(null,"springgreen","springgreen",-1241565454),Wp=new y(null,"article","article",1618846482,null),Xp=new P(null,"lightslategrey","lightslategrey",1806136178),Yp=new P(null,"success","success",1890645906),Zp=new P(null,"project-data","project-data",-1812708430),$p=new P(null,"darkblue","darkblue",511597490),aq=new P(null,"powderblue","powderblue",65928114),bq=new P(null,"z-index","z-index",1892827090),cq=new P(null,"reagent-render","reagent-render",
-985383853),dq=new y(null,"abbr","abbr",-565843885,null),eq=new y(null,"last-of-type","last-of-type",986453331,null),fq=new P(null,"turquoise","turquoise",876845491),gq=new P(null,"priority","priority",1431093715),hq=new y(null,"invalid","invalid",2053401043,null),iq=new P(null,"text-divs","text-divs",-2033659405),jq=new P(null,"blanchedalmond","blanchedalmond",-1397674477),kq=new y(null,"command","command",745990803,null),lq=new y(null,"val","val",1769233139,null),mq=new P(null,"papayawhip","papayawhip",
-330388621),nq=new P(null,"status","status",-1997798413),oq=new P(null,"slateblue","slateblue",79472627),pq=new P(null,"lightblue","lightblue",-1333083084),qq=new y(null,"visited","visited",29677652,null),rq=new P(null,"from","from",1815293044),sq=new P(null,"response-ready","response-ready",245208276),Ib=new P(null,"print-length","print-length",1931866356),tq=new P(null,"writer","writer",-277568236),uq=new y(null,"source","source",1206599988,null),vq=new y(null,"output","output",534662484,null),
wq=new P(null,"opacity","opacity",397153780),xq=new P(null,"skyblue","skyblue",-2076132812),yq=new P(null,"keyframes","keyframes",-1437976012),zq=new P(null,"id","id",-1388402092),Aq=new P(null,"class","class",-2030961996),Bq=new P(null,"red","red",-969428204),Cq=new P(null,"lightyellow","lightyellow",1576303380),Dq=new P(null,"firebase-url","firebase-url",-753469644),Eq=new P(null,"blue","blue",-622100620),Fq=new P(null,"viewport-width","viewport-width",-1146235948),Gq=new P(null,"palegreen","palegreen",
1360601109),Hq=new P(null,"catch-exception","catch-exception",-1997306795),Iq=new P(null,"nil","nil",99600501),Jq=new P(null,"greenyellow","greenyellow",1380924629),Kq=new P(null,"khaki","khaki",-1417823979),Lq=new y(null,"header","header",1759972661,null),Mq=new P(null,"maroon","maroon",-952210123),Nq=new y(null,"datalist","datalist",405488053,null),Oq=new P(null,"auto-run","auto-run",1958400437),Pq=new P(null,"reader","reader",169660853),Qq=new y(null,"tfoot","tfoot",938931637,null),Rq=new y(null,
"s","s",-948495851,null),Fj=new P(null,"parents","parents",-2027538891),Sq=new y(null,"empty","empty",-1886564811,null),Tq=new P(null,"parse","parse",-1162164619),Uq=new y(null,"scope","scope",1201173109,null),Vq=new y(null,"ins","ins",618547957,null),Wq=new P(null,"darkgrey","darkgrey",-860992715),Xq=new P(null,"semicolon","semicolon",797086549),Yq=new P(null,"midnightblue","midnightblue",688164725),Zq=new P(null,"nesting-behavior","nesting-behavior",-1555995755),$q=new y(null,"footer","footer",
-1047990379,null),ar=new P(null,"floralwhite","floralwhite",1656937461),br=new P(null,"deeppink","deeppink",1577828374),cr=new P(null,"component-will-unmount","component-will-unmount",-2058314698),dr=new y(null,"title","title",-2017930186,null),er=new P(null,"prev","prev",-1597069226),fr=new P(null,"paleturquoise","paleturquoise",1255621750),gr=new P(null,"start-offset","start-offset",1295473814),hr=new P(null,"document-id","document-id",797275350),ir=new P(null,"darkkhaki","darkkhaki",1599585526),
jr=new P(null,"url","url",276297046),kr=new P(null,"webworkerUri","webworkerUri",1782753750),lr=new P(null,"azure","azure",1864287702),mr=new P(null,"identifier","identifier",-805503498),nr=new P(null,"continue-block","continue-block",-1852047850),or=new P(null,"indianred","indianred",-1829312906),pr=new y(null,"h5","h5",-188625098,null),qr=new P(null,"content-type","content-type",-508222634),rr=new P(null,"darkviolet","darkviolet",552615766),sr=new P(null,"canvasContext","canvasContext",-2079309962),
tr=new y(null,"canvas","canvas",-158285962,null),ur=new y(null,"param","param",-640803946,null),vr=new P(null,"mediumpurple","mediumpurple",-1891751018),wr=new P(null,"fuchsia","fuchsia",990719926),xr=new P(null,"transform-origin","transform-origin",-586167370),yr=new P(null,"-ms-transform-origin","-ms-transform-origin",383555639),zr=new P(null,"projectID","projectID",1034359991),Ar=new P(null,"end-offset","end-offset",-1290057545),Br=new y(null,"div","div",-1597244137,null),Cr=new y(null,"option",
"option",1705663799,null),Dr=new P(null,"coral","coral",1082484055),Er=new y(null,"summary","summary",2021379479,null),Fr=new P(null,"display-name","display-name",694513143),Gr=new y(null,"samp","samp",-1148294633,null),Hr=new P(null,"right","right",-452581833),Ir=new P(null,"mediumvioletred","mediumvioletred",-1767902505),Jr=new P(null,"page-num","page-num",-1854799049),Kr=new P(null,"component-will-mount","component-will-mount",209708855),Lr=new P(null,"lemonchiffon","lemonchiffon",1115945815),
Mr=new y(null,"small","small",-520957065,null),Nr=new P(null,"text-decoration","text-decoration",1836813207),Or=new y(null,"style","style",1143888791,null),Pr=new y(null,"textarea","textarea",990155703,null),Qr=new y(null,"indeterminate","indeterminate",1127490551,null),Rr=new P(null,"display","display",242065432),Sr=new P(null,"position","position",-2011731912),Tr=new P(null,"mediumblue","mediumblue",-1579936616),Ur=new P(null,"on-dispose","on-dispose",2105306360),Vr=new y(null,"hover","hover",1299389816,
null),Wr=new P(null,"darkmagenta","darkmagenta",-1534491240),Xr=new P(null,"sx","sx",-403071592),Yr=new P(null,"goldenrod","goldenrod",2000666104),Zr=new P(null,"text-selection-data","text-selection-data",1039180312),$r=new P(null,"error","error",-978969032),as=new P(null,"darkorange","darkorange",1453996632),bs=new y(null,"h4","h4",-649572776,null),cs=new P(null,"orchid","orchid",-1953715528),ds=new y(null,"in-range","in-range",-1297863944,null),es=new P(null,"plum","plum",2022177528),fs=new P(null,
"pink","pink",393815864),gs=new P(null,"componentFunction","componentFunction",825866104),hs=new P(null,"teal","teal",1231496088),is=new y(null,"head","head",869147608,null),js=new P(null,"exception","exception",-335277064),ks=new P(null,"pdf-doc","pdf-doc",219261977),ls=new P(null,"magenta","magenta",1687937081),ms=new P(null,"fontSize","fontSize",919623033),ns=new P(null,"uri","uri",-774711847),os=new P(null,"r-brace","r-brace",-1335738887),ps=new P(null,"tag","tag",-1290361223),qs=new P(null,"lightgrey",
"lightgrey",-729897351),rs=new P(null,"interceptors","interceptors",-1546782951),ss=new y(null,"fullscreen","fullscreen",1636160473,null),ts=new y(null,"var","var",870848730,null),us=new P(null,"json","json",1279968570),Sf=new y(null,"quote","quote",1377916282,null),vs=new y(null,"alt-handler","alt-handler",963786170,null),ws=new P(null,"timeout","timeout",-318625318),xs=new y(null,"root","root",1191874074,null),ys=new y(null,"ol","ol",-1721911718,null),zs=new y(null,"details","details",-697640358,
null),As=new P(null,"purple","purple",-876021126),Rf=new P(null,"arglists","arglists",1661989754),Bs=new P(null,"dodgerblue","dodgerblue",-1678389350),Cs=new y(null,"active","active",-758473701,null),Ds=new y(null,"col","col",-318831557,null),Es=new P(null,"import","import",-1399500709),Qf=new y(null,"nil-iter","nil-iter",1101030523,null),Fs=new y(null,"label","label",-936024965,null),Gs=new P(null,"darkturquoise","darkturquoise",-80977765),Hs=new P(null,"autobind","autobind",-570650245),Is=new P(null,
"hierarchy","hierarchy",-1053470341),Js=new P(null,"r-paren","r-paren",-1688338021),Ks=new P(null,"mintcream","mintcream",1437895067),Ls=new y(null,"rt","rt",-2030955077,null),Ms=new P(null,"border","border",1444987323),Ns=new y(null,"pulse","pulse",1396037051,null),Os=new P(null,"pretty-print","pretty-print",-1314067013),Ps=new P(null,"body","body",-2049205669),Qs=new P(null,"project-id","project-id",206449307),Rs=new P(null,"connection-established","connection-established",-1403749733),Ss=new P(null,
"hotpink","hotpink",1103829723),lj=new P(null,"alt-impl","alt-impl",670969595),Ts=new y(null,"h6","h6",-2097141989,null),Us=new P(null,"scaled","scaled",-1947949285),Vs=new P(null,"border-radius","border-radius",419594011),Ws=new y(null,"link","link",-128631941,null),Xs=new P(null,"viewport","viewport",443342715),Ys=new P(null,"ms","ms",-1152709733),Zs=new y(null,"fn-handler","fn-handler",648785851,null),$s=new P(null,"pointer-events","pointer-events",-1053858853),at=new y(null,"checked","checked",
1589575708,null),bt=new P(null,"thistle","thistle",1477120028),ct=new P(null,"chunk","chunk",-1191159620),dt=new y(null,"last-child","last-child",-1323765444,null),et=new P(null,"royalblue","royalblue",978912636),ft=new P(null,"rad","rad",-833983012),gt=new y(null,"optional","optional",-600484260,null),ht=new y(null,"meta16349","meta16349",-783837572,null),it=new y(null,"colgroup","colgroup",-2003317124,null),jt=new P(null,"darkgreen","darkgreen",2002841276),kt=new P(null,"handler","handler",-195596612),
lt=new y(null,"meta16152","meta16152",115896060,null),Cj=new P(null,"keywordize-keys","keywordize-keys",1310784252),mt=new P(null,"darkslateblue","darkslateblue",807219996),nt=new y(null,"meter","meter",1452889916,null),ot=new P(null,"silver","silver",1044501468),pt=new y(null,"bdo","bdo",-490616675,null),qt=new P(null,"media","media",-1066138403),rt=new P(null,"darkgray","darkgray",-1229776547),st=new y(null,"b","b",-1172211299,null),tt=new P(null,"annotation-selection-listeners","annotation-selection-listeners",
990126525),ut=new P(null,"with-credentials","with-credentials",-1163127235),vt=new P(null,"oldlace","oldlace",-966038915),wt=new P(null,"grad","grad",1125187229),xt=new y(null,"svg","svg",-1797646627,null),yt=new P(null,"componentWillMount","componentWillMount",-285327619),zt=new P(null,"mediumaquamarine","mediumaquamarine",1476241181),At=new P(null,"brown","brown",1414854429),Bt=new P(null,"lightgray","lightgray",-845833379),Ct=new y(null,"code","code",-1068142627,null),Dt=new y(null,"right","right",
1187949694,null),Et=new P(null,"apiBaseUrl","apiBaseUrl",2078108862),Ft=new y(null,"focus","focus",1875209438,null),Gt=new P(null,"olive","olive",-2080542466),Ht=new P(null,"canvas-width","canvas-width",1321931102),It=new P(null,"annotation","annotation",-344661666),Jt=new P(null,"lightcoral","lightcoral",-988903010),Kt=new P(null,"failed","failed",-1397425762),Lt=new y(null,"noscript","noscript",935754238,null),Mt=new P(null,"tomato","tomato",1086708254),Nt=new P(null,"annotation-addition-listeners",
"annotation-addition-listeners",-1461607842),Ot=new P(null,"infinite","infinite",-121292194),Pt=new P(null,"canvas-style-width","canvas-style-width",1341059774),Qt=new P(null,"lightcyan","lightcyan",-481418530),Rt=new P(null,"text-range","text-range",-914595042),St=new P(null,"linen","linen",-1305214018),Tt=new P(null,"message","message",-406056002),Ut=new P(null,"height","height",1025178622),Vt=new P(null,"num-pages","num-pages",621838367),Wt=new y(null,"h2","h2",1267868799,null),Xt=new y(null,"area",
"area",2112538783,null),Yt=new P(null,"darkslategrey","darkslategrey",-114797409),Zt=new P(null,"authorization-token","authorization-token",124782783),$t=new P(null,"ready?","ready?",-105765697),au=new P(null,"lavender","lavender",-1469567809),bu=new P(null,"canvas-height","canvas-height",291287231),cu=new P(null,"any","any",1705907423),du=new y(null,"br","br",-1720330977,null),eu=new P(null,"in","in",-1531184865),fu=new P(null,"left","left",-399115937),Mi=new P("cljs.core","not-found","cljs.core/not-found",
-1572889185),gu=new P(null,"text","text",-1790561697),hu=new P(null,"dimgray","dimgray",-412750241),iu=new P(null,"span","span",1394872991),ju=new P(null,"to","to",192099007),ku=new P(null,"palegoldenrod","palegoldenrod",-2067529985),lu=new y(null,"f","f",43394975,null),mu=new P(null,"beige","beige",836725695),nu=new P(null,"black","black",1294279647);var ou="undefined"!==typeof console;if("undefined"===typeof pu)var pu=eg?eg(null):dg.call(null,null);
if("undefined"===typeof qu)var qu=function(){var a={};a.warn=function(){return function(){function a(b){var e=null;if(0<arguments.length){for(var e=0,f=Array(arguments.length-0);e<f.length;)f[e]=arguments[e+0],++e;e=new C(f,0)}return c.call(this,e)}function c(a){return ig.o(pu,Ig,new T(null,1,5,V,[Dm],null),le,N([S(t,a)],0))}a.I=0;a.H=function(a){a=B(a);return c(a)};a.o=c;return a}()}(a);a.error=function(){return function(){function a(b){var e=null;if(0<arguments.length){for(var e=0,f=Array(arguments.length-
0);e<f.length;)f[e]=arguments[e+0],++e;e=new C(f,0)}return c.call(this,e)}function c(a){return ig.o(pu,Ig,new T(null,1,5,V,[$r],null),le,N([S(t,a)],0))}a.I=0;a.H=function(a){a=B(a);return c(a)};a.o=c;return a}()}(a);return a}();function ru(a){return function(){function b(a){var b=null;if(0<arguments.length){for(var b=0,f=Array(arguments.length-0);b<f.length;)f[b]=arguments[b+0],++b;b=new C(f,0)}return c.call(this,b)}function c(b){b=mg(b);if(Gd.a(M(b),1))return b=D(b),a.g?a.g(b):a.call(null,b);b=ch(b);return a.g?a.g(b):a.call(null,b)}b.I=0;b.H=function(a){a=B(a);return c(a)};b.o=c;return b}()}
function su(a,b,c){if("string"===typeof b)return a.replace(new RegExp(Pa(b),"g"),c);if(b instanceof RegExp)return"string"===typeof c?a.replace(new RegExp(b.source,"g"),c):a.replace(new RegExp(b.source,"g"),ru(c));throw[t("Invalid match arg: "),t(b)].join("");}function tu(a,b){for(var c=new db,d=B(b);;)if(null!=d)c.append(""+t(D(d))),d=F(d),null!=d&&c.append(a);else return c.toString()};if("undefined"===typeof uu){var vu;if("undefined"!==typeof React)vu=React;else{var wu;if("undefined"!==typeof require){var xu=require("react");if(r(xu))wu=xu;else throw Error("require('react') failed");}else throw Error("js/React is missing");vu=wu}var uu=vu}var yu=new Oi(null,new q(null,2,["aria",null,"data",null],null),null);function zu(a){return 2>M(a)?a.toUpperCase():[t(a.substring(0,1).toUpperCase()),t(a.substring(1))].join("")}
function Au(a){if("string"===typeof a)return a;a=sf(a);var b,c=/-/,c="/(?:)/"===""+t(c)?le.a(ch(de("",X.a(t,B(a)))),""):ch((""+t(a)).split(c));if(1<M(c))a:for(;;)if(""===(null==c?null:wc(c)))c=null==c?null:xc(c);else break a;b=c;c=O(b,0,null);b=ef(b,1);return r(yu.g?yu.g(c):yu.call(null,c))?a:Jf(t,c,X.a(zu,b))}
function Bu(a){var b=function(){var b=function(){var b=re(a);return b?(b=a.displayName,r(b)?b:a.name):b}();if(r(b))return b;b=function(){var b=null!=a?a.L&4096||a.Pf?!0:!1:!1;return b?sf(a):b}();if(r(b))return b;b=ue(a);return Be(b)?Hm.g(b):null}();return su(""+t(b),"$",".")}var Cu=!1;if("undefined"===typeof Du)var Du=0;function Eu(a){return setTimeout(a,16)}var Fu=Mb("undefined"!==typeof window&&null!=window.document)?Eu:function(){var a=window,b=a.requestAnimationFrame;if(r(b))return b;b=a.webkitRequestAnimationFrame;if(r(b))return b;b=a.mozRequestAnimationFrame;if(r(b))return b;a=a.msRequestAnimationFrame;return r(a)?a:Eu}();function Gu(a,b){return a.cljsMountOrder-b.cljsMountOrder}if("undefined"===typeof Hu)var Hu=function(){return null};function Iu(a){this.Ne=a}
Iu.prototype.enqueue=function(a,b){if(null==b)throw Error("Assert failed: (some? f)");null==this[a]&&(this[a]=[]);this[a].push(b);return Ju(this)};function Ku(a,b){var c=a[b];if(null==c)return null;a[b]=null;for(var d=c.length,e=0;;)if(e<d)c[e].call(null),e+=1;else return null}
function Ju(a){if(a.Ne)return null;a.Ne=!0;a=function(a){return function(){a.Ne=!1;Ku(a,"beforeFlush");Hu();var c=a.componentQueue;if(null!=c)a:{a.componentQueue=null,c.sort(Gu);for(var d=c.length,e=0;;)if(e<d){var f=c[e];!0===f.cljsIsDirty&&f.forceUpdate();e+=1}else break a}return Ku(a,"afterRender")}}(a);return Fu.g?Fu.g(a):Fu.call(null,a)}if("undefined"===typeof Lu)var Lu=new Iu(!1);function Mu(a){if(r(a.cljsIsDirty))return null;a.cljsIsDirty=!0;return Lu.enqueue("componentQueue",a)}
function Nu(a){Lu.enqueue("afterRender",a)};var Ou=function Ou(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ou.g(arguments[0]);case 2:return Ou.a(arguments[0],arguments[1]);default:return Ou.o(arguments[0],arguments[1],new C(c.slice(2),0,null))}};Ou.g=function(a){return a};Ou.a=function(a,b){return M(a)<M(b)?Wb(function(a,d){return Le(b,d)?we.a(a,d):a},a,a):Wb(we,a,b)};Ou.o=function(a,b,c){return Wb(Ou,a,le.a(c,b))};
Ou.H=function(a){var b=D(a),c=F(a);a=D(c);c=F(c);return Ou.o(b,a,c)};Ou.I=2;var Pu;if("undefined"===typeof Qu)var Qu=!1;if("undefined"===typeof Ru)var Ru=0;if("undefined"===typeof Su)var Su=eg?eg(0):dg.call(null,0);function Tu(a,b){var c=Pu;Pu=a;try{return b.D?b.D():b.call(null)}finally{Pu=c}}
function Uu(a,b){b.oe=null;b.uh=Ru+=1;var c=Tu(b,a),d=b.oe;b.zc=!1;var e;a:{e=b.$c;var f=null==d?0:d.length,g=f===(null==e?0:e.length);if(g)for(g=0;;){var l=g===f;if(l){e=l;break a}if(d[g]===e[g])g+=1;else{e=!1;break a}}else e=g}if(!e)a:{e=Ti(d);f=Ti(b.$c);b.$c=d;for(var d=B(Ou.a(e,f)),g=null,m=l=0;;)if(m<l){var n=g.N(null,m);Xc(n,b,Vu);m+=1}else if(d=B(d))g=d,Ee(g)?(d=gd(g),m=hd(g),g=d,l=M(d),d=m):(d=D(g),Xc(d,b,Vu),d=F(g),g=null,l=0),m=0;else break;e=B(Ou.a(f,e));f=null;for(l=g=0;;)if(l<g)d=f.N(null,
l),Yc(d,b),l+=1;else if(e=B(e))f=e,Ee(f)?(e=gd(f),g=hd(f),f=e,d=M(e),e=g,g=d):(d=D(f),Yc(d,b),e=F(f),f=null,g=0),l=0;else break a}return c}function Wu(a){var b=Pu;if(null!=b){var c=b.oe;null==c?b.oe=[a]:c.push(a)}}function Xu(a,b){Qu&&ig.h(Su,Ye,M(b)-M(a));return b}function Yu(a,b,c){var d=a.$a;a.$a=Xu(d,oe.h(d,b,c));return a.Df=null}function Zu(a,b){var c=a.$a;a.$a=Xu(c,qe.a(c,b));return a.Df=null}
function $u(a,b,c){for(var d=a.Df,d=null==d?a.Df=Ve(function(){return function(a,b,c){a.push(b);a.push(c);return a}}(d),[],a.$a):d,e=d.length,f=0;;)if(f<e){var g=d[f],l=d[f+1];l.J?l.J(g,a,b,c):l.call(null,g,a,b,c);f=2+f}else return null}function av(a,b,c,d){Uc(b,[t("#\x3c"),t(d),t(" ")].join(""));var e;a:{d=Pu;Pu=null;try{e=Cc(a);break a}finally{Pu=d}e=void 0}jj(e,b,c);return Uc(b,"\x3e")}if("undefined"===typeof bv)var bv=null;
function cv(){for(;;){var a=bv;if(null==a)return null;bv=null;for(var b=a.length,c=0;;)if(c<b){var d=a[c];d.zc&&null!=d.$c&&dv(d,!0);c+=1}else break}}Hu=cv;function ev(){}function fv(a,b,c,d){this.state=a;this.B=b;this.xd=c;this.$a=d;this.l=2153938944;this.L=114690}h=fv.prototype;h.xf=!0;h.U=function(a,b,c){return av(this,b,c,"Atom:")};h.V=function(){return this.B};h.S=function(){return qa(this)};h.K=function(a,b){return this===b};
h.te=function(a,b){if(null!=this.xd&&!r(this.xd.g?this.xd.g(b):this.xd.call(null,b)))throw Error([t("Assert failed: "),t("Validator rejected reference state"),t("\n"),t("(validator new-value)")].join(""));var c=this.state;this.state=b;null!=this.$a&&$u(this,c,b);return b};h.ue=function(a,b){return ld(this,b.g?b.g(this.state):b.call(null,this.state))};h.ve=function(a,b,c){return ld(this,b.a?b.a(this.state,c):b.call(null,this.state,c))};
h.we=function(a,b,c,d){return ld(this,b.h?b.h(this.state,c,d):b.call(null,this.state,c,d))};h.xe=function(a,b,c,d,e){return ld(this,Lf(b,this.state,c,d,e))};h.Nd=function(a,b,c){return $u(this,b,c)};h.Md=function(a,b,c){return Yu(this,b,c)};h.Od=function(a,b){return Zu(this,b)};h.Yb=function(){Wu(this);return this.state};
var gv=function gv(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return gv.g(arguments[0]);default:return gv.o(arguments[0],new C(c.slice(1),0,null))}};gv.g=function(a){return new fv(a,null,null,null)};gv.o=function(a,b){var c=null!=b&&(b.l&64||b.M)?S(fg,b):b,d=A.a(c,Gb),c=A.a(c,gg);return new fv(a,d,c,null)};gv.H=function(a){var b=D(a);a=F(a);return gv.o(b,a)};gv.I=1;
function hv(a,b,c,d){var e=b.reagReactionCache,f=null==e?Uf:e,g=f.a?f.a(c,null):f.call(null,c,null);if(null!=g)return Cc(g);if(null==Pu)return a.D?a.D():a.call(null);var l=function(){var l=function(){return function(){Qu&&ig.a(Su,$e);var a=qe.a(b.reagReactionCache,c);b.reagReactionCache=a;null!=d&&(d.wf=null);return null}}(a,Ur,e,f,g);return iv.h?iv.h(a,Ur,l):iv.call(null,a,Ur,l)}(),m=Cc(l);b.reagReactionCache=oe.h(f,c,l);Qu&&ig.a(Su,Od);null!=d&&(d.wf=l);return m}
function jv(a,b,c,d,e){this.va=a;this.path=b;this.wf=c;this.state=d;this.$a=e;this.l=2153807872;this.L=114690}function kv(a){var b=Pu;Pu=null;try{return a.Yb(null)}finally{Pu=b}}function lv(a,b,c){b!==c&&(a.state=c,null!=a.$a&&$u(a,b,c))}h=jv.prototype;h.xf=!0;h.U=function(a,b,c){return av(this,b,c,[t("Cursor: "),t(this.path)].join(""))};h.S=function(){return zd(new T(null,2,5,V,[this.va,this.path],null))};h.K=function(a,b){return b instanceof jv&&Gd.a(this.path,b.path)&&Gd.a(this.va,b.va)};
h.te=function(a,b){lv(this,this.state,b);(null!=this.va?this.va.l&32768||this.va.xg||(this.va.l?0:Nb(Bc,this.va)):Nb(Bc,this.va))?Gd.a(this.path,me)?hg.a?hg.a(this.va,b):hg.call(null,this.va,b):ig.J(this.va,Hg,this.path,b):this.va.a?this.va.a(this.path,b):this.va.call(null,this.path,b);return b};h.ue=function(a,b){var c;c=kv(this);c=b.g?b.g(c):b.call(null,c);return ld(this,c)};h.ve=function(a,b,c){a=kv(this);b=b.a?b.a(a,c):b.call(null,a,c);return ld(this,b)};
h.we=function(a,b,c,d){a=kv(this);b=b.h?b.h(a,c,d):b.call(null,a,c,d);return ld(this,b)};h.xe=function(a,b,c,d,e){return ld(this,Lf(b,kv(this),c,d,e))};h.Nd=function(a,b,c){return $u(this,b,c)};h.Md=function(a,b,c){return Yu(this,b,c)};h.Od=function(a,b){return Zu(this,b)};
h.Yb=function(){var a=this,b=this,c=a.state,d=function(){var d=a.wf;return null==d?(d=(null!=a.va?a.va.l&32768||a.va.xg||(a.va.l?0:Nb(Bc,a.va)):Nb(Bc,a.va))?function(){return function(){return Gg(G.g?G.g(a.va):G.call(null,a.va),a.path)}}(d,c,b):function(){return function(){return a.va.g?a.va.g(a.path):a.va.call(null,a.path)}}(d,c,b),hv(d,a.va,a.path,b)):Cc(d)}();lv(b,c,d);return d};
var mv=function mv(b){if(null!=b&&null!=b.jg)return b.jg();var c=mv[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=mv._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IDisposable.dispose!",b);};function Vu(a,b,c,d){c===d||a.zc?a=null:null==a.Xb?(a.zc=!0,null==bv&&(bv=[],!1===Lu.Ne&&Ju(Lu)),a=bv.push(a)):a=!0===a.Xb?dv(a,!1):a.Xb.g?a.Xb.g(a):a.Xb.call(null,a);return a}
function nv(a,b,c,d,e,f,g,l){this.Fb=a;this.state=b;this.zc=c;this.dg=d;this.$c=e;this.$a=f;this.Xb=g;this.Ze=l;this.l=2153807872;this.L=114690}function ov(a){var b=Pu;Pu=null;try{return a.Yb(null)}finally{Pu=b}}function dv(a,b){var c=a.state,d;if(r(b)){var e=a.Fb;try{a.Ze=null,d=Uu(e,a)}catch(f){a.state=f,a.Ze=f,d=a.zc=!1}}else d=Uu(a.Fb,a);a.dg||(a.state=d,null==a.$a||Gd.a(c,d)||$u(a,c,d));return d}
function pv(a,b){var c=null!=b&&(b.l&64||b.M)?S(fg,b):b,d=A.a(c,Oq),e=A.a(c,Dk),f=A.a(c,Ur),c=A.a(c,Dp);null!=d&&(a.Xb=d);null!=e&&(a.ig=e);null!=f&&(a.hg=f);null!=c&&(a.dg=c)}h=nv.prototype;h.xf=!0;h.U=function(a,b,c){return av(this,b,c,[t("Reaction "),t(zd(this)),t(":")].join(""))};h.S=function(){return qa(this)};h.K=function(a,b){return this===b};
h.jg=function(){var a=this.state,b=this.$c;this.Xb=this.state=this.$c=null;this.zc=!0;for(var b=B(Ti(b)),c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e);Yc(f,this);e+=1}else if(b=B(b))c=b,Ee(c)?(b=gd(c),e=hd(c),c=b,d=M(b),b=e):(b=D(c),Yc(b,this),b=F(c),c=null,d=0),e=0;else break;return null!=this.hg?this.hg(a):null};
h.te=function(a,b){if(!re(this.ig))throw Error([t("Assert failed: "),t("Reaction is read only."),t("\n"),t("(fn? (.-on-set a))")].join(""));var c=this.state;this.state=b;this.ig(c,b);$u(this,c,b);return b};h.ue=function(a,b){var c;c=ov(this);c=b.g?b.g(c):b.call(null,c);return ld(this,c)};h.ve=function(a,b,c){a=ov(this);b=b.a?b.a(a,c):b.call(null,a,c);return ld(this,b)};h.we=function(a,b,c,d){a=ov(this);b=b.h?b.h(a,c,d):b.call(null,a,c,d);return ld(this,b)};
h.xe=function(a,b,c,d,e){return ld(this,Lf(b,ov(this),c,d,e))};h.Nd=function(a,b,c){return $u(this,b,c)};h.Md=function(a,b,c){return Yu(this,b,c)};h.Od=function(a,b){var c=xe(this.$a);Zu(this,b);return!c&&xe(this.$a)&&null==this.Xb?mv(this):null};h.Yb=function(){var a=this.Ze;if(null!=a)throw a;(a=null==Pu)&&cv();a&&null==this.Xb?this.zc&&(a=this.state,this.state=this.Fb.D?this.Fb.D():this.Fb.call(null),null==this.$a||Gd.a(a,this.state)||$u(this,a,this.state)):(Wu(this),this.zc&&dv(this,!1));return this.state};
function iv(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;var c=arguments[0],b=1<b.length?new C(b.slice(1),0,null):null,e=null!=b&&(b.l&64||b.M)?S(fg,b):b,b=A.a(e,Oq),d=A.a(e,Dk),e=A.a(e,Ur),c=new nv(c,null,!0,!1,null,null,null,null);pv(c,new q(null,3,[Oq,b,Dk,d,Ur,e],null));return c}var qv=iv(null);
function rv(a,b){var c=sv,d=qv,e=Uu(a,d);null!=d.$c&&(qv=iv(null),pv(d,c),d.Fb=a,d.Xb=function(){return function(){return Mu.g?Mu.g(b):Mu.call(null,b)}}(d,e),b.cljsRatom=d);return e}function tv(a){var b={};a=Tu(b,a);return new T(null,2,5,V,[a,null!=b.oe],null)};var uv;function vv(a,b){var c=b.argv;if(null==c){var c=V,d=a.constructor;a:for(var e=Fe(b),f=e.length,g=Uf,l=0;;)if(l<f)var m=e[l],g=oe.h(g,rf.g(m),b[m]),l=l+1;else break a;c=new T(null,2,5,c,[d,g],null)}return c}function wv(a){var b;if(b=re(a))a=null==a?null:a.prototype,b=null!=(null==a?null:a.reagentRender);return b}function xv(a){var b;if(b=re(a))a=null==a?null:a.prototype,b=null!=(null==a?null:a.render);return b}
function yv(a){for(;;){var b=a.reagentRender,c;if(Ke(b))c=null;else throw Error("Assert failed: (ifn? f)");var d=!0===a.cljsLegacyRender?b.call(a,a):function(){var c=vv(a,a.props);switch(M(c)){case 1:return b.call(a);case 2:return b.call(a,Yd(c,1));case 3:return b.call(a,Yd(c,1),Yd(c,2));case 4:return b.call(a,Yd(c,1),Yd(c,2),Yd(c,3));case 5:return b.call(a,Yd(c,1),Yd(c,2),Yd(c,3),Yd(c,4));default:return b.apply(a,Ub(c).slice(1))}}();if(De(d))return zv(d);if(Ke(d))c=wv(d)?function(a,b,c,d){return function(){function a(c){var d=
null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new C(e,0)}return b.call(this,d)}function b(a){a=Jf(dh,d,a);return zv(a)}a.I=0;a.H=function(a){a=B(a);return b(a)};a.o=b;return a}()}(a,b,c,d):d,a.reagentRender=c;else return d}}
var sv=new q(null,1,[Dp,!0],null),Cw=new q(null,1,[Ep,function(){var a=this.cljsRatom;this.cljsIsDirty=!1;return null==a?rv(function(a,c){return function(){var a;a:{var b=uv;uv=c;try{var f=[!1];try{var g=yv(c);f[0]=!0;a=g;break a}finally{r(f[0])||r(ou)&&(r(!1)?qu:console).error(""+t([t("Error rendering component"),t(Bw.D?Bw.D():Bw.call(null))].join("")))}}finally{uv=b}a=void 0}return a}}(a,this),this):dv(a,!1)}],null);
function Dw(a,b){var c=a instanceof P?a.Va:null;switch(c){case "getDefaultProps":throw Error([t("Assert failed: "),t("getDefaultProps not supported"),t("\n"),t("false")].join(""));case "getInitialState":return function(){return function(){var a;a=this.cljsState;a=null!=a?a:this.cljsState=gv.g(null);var c=b.call(this,this);return hg.a?hg.a(a,c):hg.call(null,a,c)}}(c);case "componentWillReceiveProps":return function(){return function(a){return b.call(this,this,vv(this,a))}}(c);case "shouldComponentUpdate":return function(){return function(a){var c=
Cu;if(r(c))return c;var c=this.props.argv,f=a.argv,g=null==c||null==f;return null==b?g||Nf(c,f):g?b.call(this,this,vv(this,this.props),vv(this,a)):b.call(this,this,c,f)}}(c);case "componentWillUpdate":return function(){return function(a){return b.call(this,this,vv(this,a))}}(c);case "componentDidUpdate":return function(){return function(a){return b.call(this,this,vv(this,a))}}(c);case "componentWillMount":return function(){return function(){this.cljsMountOrder=Du+=1;return null==b?null:b.call(this,
this)}}(c);case "componentDidMount":return function(){return function(){return b.call(this,this)}}(c);case "componentWillUnmount":return function(){return function(){var a=this.cljsRatom;null!=a&&mv(a);this.cljsIsDirty=!1;return null==b?null:b.call(this,this)}}(c);default:return null}}function Ew(a,b,c){var d=Dw(a,b);if(r(r(d)?b:d)&&!Ke(b))throw Error([t("Assert failed: "),t([t("Expected function in "),t(c),t(a),t(" but got "),t(b)].join("")),t("\n"),t("(ifn? f)")].join(""));return r(d)?d:b}
var Fw=new q(null,3,[No,null,yt,null,ho,null],null),Gw=function(a){return function(b){return function(c){var d=A.a(G.g?G.g(b):G.call(null,b),c);if(null!=d)return d;d=a.g?a.g(c):a.call(null,c);ig.J(b,oe,c,d);return d}}(function(){var a=Uf;return eg?eg(a):dg.call(null,a)}())}(Au);function Hw(a){return Ve(function(a,c,d){return oe.h(a,rf.g(Gw.g?Gw.g(c):Gw.call(null,c)),d)},Uf,a)}function Iw(a){return Ki.o(N([Fw,a],0))}
function Jw(a){var b=Li(a,new T(null,3,5,V,[Ep,np,gs],null)),c=D(Kh(b));if(!(0<M(b)))throw Error([t("Assert failed: "),t("Missing reagent-render"),t("\n"),t("(pos? (count renders))")].join(""));if(1!==M(b))throw Error([t("Assert failed: "),t("Too many render functions supplied"),t("\n"),t("(\x3d\x3d 1 (count renders))")].join(""));if(!Ke(c))throw Error([t("Assert failed: "),t([t("Render must be a function, not "),t(nj(N([c],0)))].join("")),t("\n"),t("(ifn? render-fun)")].join(""));var c=function(){var b=
np.g(a);return r(b)?b:gs.g(a)}(),b=null==c,d=r(c)?c:Ep.g(a),e=""+t(function(){var b=lm.g(a);return r(b)?b:Bu(d)}()),f;a:switch(e){case "":f=t;var g;null==rj&&(rj=eg?eg(0):dg.call(null,0));g=Dd.g([t("reagent"),t(ig.a(rj,Od))].join(""));f=""+f(g);break a;default:f=e}c=Ve(function(a,b,c,d,e){return function(a,b,c){return oe.h(a,b,Ew(b,c,e))}}(c,b,d,e,f),Uf,a);return oe.o(c,lm,f,N([Hs,!1,Sk,b,np,d,Ep,Ep.g(Cw)],0))}function Kw(a){return Ve(function(a,c,d){a[sf(c)]=d;return a},{},a)}
function Lw(a){if(!Be(a))throw Error("Assert failed: (map? body)");return uu.createClass(Kw(Jw(Iw(Hw(a)))))}var Mw=function Mw(b){var c=function(){var a;a=null==b?null:b._reactInternalInstance;a=r(a)?a:b;return null==a?null:a._currentElement}(),d=function(){var a=null==c?null:c.type;return null==a?null:a.displayName}(),e=function(){var a=null==c?null:c._owner,a=null==a?null:Mw(a);return null==a?null:[t(a),t(" \x3e ")].join("")}(),d=[t(e),t(d)].join("");return xe(d)?null:d};
function Bw(){var a=uv;var b=Mw(a);r(b)?a=b:(a=null==a?null:a.constructor,a=null==a?null:Bu(a));return xe(a)?"":[t(" (in "),t(a),t(")")].join("")}
function Nw(a){if(!Ke(a))throw Error([t("Assert failed: "),t([t("Expected a function, not "),t(nj(N([a],0)))].join("")),t("\n"),t("(ifn? f)")].join(""));xv(a)&&!wv(a)&&r(ou)&&(r(!1)?qu:console).warn([t("Warning: "),t("Using native React classes directly in Hiccup forms "),t("is not supported. Use create-element or "),t("adapt-react-class instead: "),t(function(){var b=Bu(a);return xe(b)?a:b}()),t(Bw())].join(""));if(wv(a))return a.cljsReactClass=a;var b=ue(a),b=oe.h(b,cq,a),b=Lw(b);return a.cljsReactClass=
b}function Ow(a){var b=a.cljsReactClass;return null==b?Nw(a):b};function Pw(a,b,c){if(kf(c))return c=S(nf,X.a(a,c)),b.g?b.g(c):b.call(null,c);if(Ie(c))return c=Zi(X.a(a,c)),b.g?b.g(c):b.call(null,c);if(Ce(c))return c=Wb(function(b,c){return le.a(b,a.g?a.g(c):a.call(null,c))},c,c),b.g?b.g(c):b.call(null,c);ye(c)&&(c=Bg.a(null==c?null:dc(c),X.a(a,c)));return b.g?b.g(c):b.call(null,c)}var Qw=function Qw(b,c){return Pw($f.a(Qw,b),We,b.g?b.g(c):b.call(null,c))};var Rw=/([^\s\.#]+)(?:#([^\s\.#]+))?(?:\.([^\s#]+))?/;function Sw(a){return a instanceof P||a instanceof y}var Tw={"class":"className","for":"htmlFor",charset:"charSet"};function Uw(a,b,c){if(Sw(b)){var d;d=sf(b);d=Tw.hasOwnProperty(d)?Tw[d]:null;b=null==d?Tw[sf(b)]=Au(b):d}a[b]=Vw.g?Vw.g(c):Vw.call(null,c);return a}
function Vw(a){return"object"!==k(a)?a:Sw(a)?sf(a):Be(a)?Ve(Uw,{},a):ye(a)?xj(a):Ke(a)?function(){function b(a){var b=null;if(0<arguments.length){for(var b=0,f=Array(arguments.length-0);b<f.length;)f[b]=arguments[b+0],++b;b=new C(f,0)}return c.call(this,b)}function c(b){return S(a,b)}b.I=0;b.H=function(a){a=B(a);return c(a)};b.o=c;return b}():xj(a)}function Ww(a,b,c){a=null==a?{}:a;a[b]=c;return a}
var Xw=null,Yw=new Oi(null,new q(null,6,["url",null,"tel",null,"text",null,"textarea",null,"password",null,"search",null],null),null);function Zw(a){var b=a.cljsInputValue;if(null==b)return null;a.cljsInputDirty=!1;a=Xw.g?Xw.g(a):Xw.call(null,a);var c=a.value;return Nf(b,c)?a===document.activeElement&&Le(Yw,a.type)&&"string"===typeof b&&"string"===typeof c?(c=M(c)-a.selectionStart,c=M(b)-c,a.value=b,a.selectionStart=c,a.selectionEnd=c):a.value=b:null}
function $w(a,b,c){b=b.g?b.g(c):b.call(null,c);r(a.cljsInputDirty)||(a.cljsInputDirty=!0,Nu(function(){return function(){return Zw(a)}}(b)));return b}function ax(a){var b=uv;if(r(function(){var b=null!=Xw;return b&&(b=null!=a)?(b=a.hasOwnProperty("onChange"),r(b)?a.hasOwnProperty("value"):b):b}())){var c=a.value,d=null==c?"":c,e=a.onChange;b.cljsInputValue=d;delete a.value;a.defaultValue=d;a.onChange=function(a,c,d,e){return function(a){return $w(b,e,a)}}(a,c,d,e)}else b.cljsInputValue=null}
var bx=null,dx=new q(null,4,[Fr,"ReagentInput",Bn,Zw,cr,function(a){return a.cljsInputValue=null},cq,function(a,b,c,d){ax(c);return cx.J?cx.J(a,b,c,d):cx.call(null,a,b,c,d)}],null);function ex(a){var b;if(Be(a))try{b=A.a(a,Bl)}catch(c){b=null}else b=null;return b}function fx(a){var b=ex(ue(a));return null==b?ex(O(a,1,null)):b}var gx={};
function hx(a,b,c){var d=a.name,e=O(b,c,null),f=null==e||Be(e);var e=Vw(f?e:null),g=a.id,e=null!=g&&null==(null==e?null:e.id)?Ww(e,"id",g):e;a=a.className;null==a?a=e:(g=null==e?null:e.className,a=Ww(e,"className",null==g?a:[t(a),t(" "),t(g)].join("")));c+=f?1:0;a:switch(d){case "input":case "textarea":f=!0;break a;default:f=!1}if(f)return f=V,null==bx&&(bx=Lw(dx)),b=fe(new T(null,5,5,f,[bx,b,d,a,c],null),ue(b)),zv.g?zv.g(b):zv.call(null,b);f=ex(ue(b));f=null==f?a:Ww(a,"key",f);return cx.J?cx.J(b,
d,f,c):cx.call(null,b,d,f,c)}function ix(a){return""+t(Qw(function(a){if(re(a)){var c=Bu(a);switch(c){case "":return a;default:return Dd.g(c)}}else return a},a))}function jx(a,b){return[t(S(t,b)),t(": "),t(ix(a)),t("\n"),t(Bw())].join("")}
function kx(a){for(;;){if(!(0<M(a)))throw Error([t("Assert failed: "),t(jx(a,N(["Hiccup form should not be empty"],0))),t("\n"),t("(pos? (count v))")].join(""));var b=O(a,0,null);if(!Sw(b)&&"string"!==typeof b&&!Ke(b))throw Error([t("Assert failed: "),t(jx(a,N(["Invalid Hiccup form"],0))),t("\n"),t("(valid-tag? tag)")].join(""));if(Sw(b)||"string"===typeof b){var c=sf(b),b=c.indexOf("\x3e");switch(b){case -1:b=gx.hasOwnProperty(c)?gx[c]:null;if(null==b){var b=c,d=F($i(Rw,sf(c))),e=O(d,0,null),f=O(d,
1,null),d=O(d,2,null),d=null==d?null:su(d,/\./," ");if(!r(e))throw Error([t("Assert failed: "),t([t("Invalid tag: '"),t(c),t("'"),t(Bw())].join("")),t("\n"),t("tag")].join(""));b=gx[b]={name:e,id:f,className:d}}return hx(b,a,1);case 0:b=O(a,1,null);if(!Gd.a("\x3e",c))throw Error([t("Assert failed: "),t(jx(a,N(["Invalid Hiccup tag"],0))),t("\n"),t('(\x3d "\x3e" n)')].join(""));if("string"!==typeof b&&!re(b))throw Error([t("Assert failed: "),t(jx(a,N(["Expected React component in"],0))),t("\n"),t("(or (string? comp) (fn? comp))")].join(""));
return hx({name:b},a,2);default:a=new T(null,2,5,V,[c.substring(0,b),oe.h(a,0,c.substring(b+1))],null)}}else return b=Ow(b),c={argv:a},a=fx(a),null!=a&&(c.key=a),uu.createElement(b,c)}}function zv(a){return"object"!==k(a)?a:De(a)?kx(a):Ie(a)?lx.g?lx.g(a):lx.call(null,a):Sw(a)?sf(a):(null!=a?a.l&2147483648||a.ka||(a.l?0:Nb(Vc,a)):Nb(Vc,a))?nj(N([a],0)):a}
function lx(a){var b={},c=tv(function(b){return function(){for(var c=Ub(a),d=c.length,l=0;;)if(l<d){var m=c[l];De(m)&&null==fx(m)&&(b["no-key"]=!0);c[l]=zv(m);l+=1}else break;return c}}(b)),d=O(c,0,null),c=O(c,1,null);r(c)&&r(ou)&&(r(!1)?qu:console).warn([t("Warning: "),t(jx(a,N(["Reactive deref not supported in lazy seq, ","it should be wrapped in doall"],0)))].join(""));r(b["no-key"])&&r(ou)&&(r(!1)?qu:console).warn([t("Warning: "),t(jx(a,N(["Every element in a seq should have a unique :key"],0)))].join(""));
return d}function cx(a,b,c,d){var e=M(a)-d;switch(e){case 0:return uu.createElement(b,c);case 1:return uu.createElement(b,c,zv(O(a,d,null)));default:return uu.createElement.apply(null,Ve(function(){return function(a,b,c){b>=d&&a.push(zv(c));return a}}(e),[b,c],a))}};if("undefined"===typeof mx)var mx=null;if("undefined"===typeof nx)var nx=null;function ox(){if(null!=nx)return nx;if("undefined"!==typeof ReactDOM)return nx=ReactDOM;if("undefined"!==typeof require){var a=nx=require("react-dom");if(r(a))return a;throw Error("require('react-dom') failed");}throw Error("js/ReactDOM is missing");}if("undefined"===typeof px){var px,qx=Uf;px=eg?eg(qx):dg.call(null,qx)}
function rx(a,b,c){var d=Cu;Cu=!0;try{return ox().render(a.D?a.D():a.call(null),b,function(){return function(){var d=Cu;Cu=!1;try{return ig.J(px,oe,b,new T(null,2,5,V,[a,b],null)),null!=c?c.D?c.D():c.call(null):null}finally{Cu=d}}}(d))}finally{Cu=d}}function sx(a,b){return rx(a,b,null)}function tx(a,b,c){cv();return rx(function(){return zv(re(a)?a.D?a.D():a.call(null):a)},b,c)}function ux(a){return ox().findDOMNode(a)}Xw=ux;function vx(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return tx(arguments[0],arguments[1],null);case 3:return tx(arguments[0],arguments[1],arguments[2]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}function wx(a,b){return tx(a,b,null)}
Aa("reagent.core.force_update_all",function(){cv();for(var a=B(Kh(G.g?G.g(px):G.call(null,px))),b=null,c=0,d=0;;)if(d<c){var e=b.N(null,d);S(sx,e);d+=1}else if(a=B(a))b=a,Ee(b)?(a=gd(b),d=hd(b),b=a,c=M(a),a=d):(a=D(b),S(sx,a),a=F(b),b=null,c=0),d=0;else break;return"Updated"});function xx(a){return Lw(a)}function yx(a){return gv.g(a)}
function zx(a){var b=Ax,c=null!=b?b.xf?!0:b.Qd?!1:Nb(ev,b):Nb(ev,b);if(c?!c:!Ke(b)||De(b))throw Error([t("Assert failed: "),t([t("src must be a reactive atom or a function, not "),t(nj(N([b],0)))].join("")),t("\n"),t("(or (satisfies? IReactiveAtom src) (and (ifn? src) (not (vector? src))))")].join(""));return new jv(b,a,null,null,null)};var Cx;a:{var Dx=ba.navigator;if(Dx){var Ex=Dx.userAgent;if(Ex){Cx=Ex;break a}}Cx=""}function Fx(a){return-1!=Cx.indexOf(a)};var Gx=Fx("Opera")||Fx("OPR"),Hx=Fx("Trident")||Fx("MSIE"),Ix=Fx("Edge"),Jx=Fx("Gecko")&&!(-1!=Cx.toLowerCase().indexOf("webkit")&&!Fx("Edge"))&&!(Fx("Trident")||Fx("MSIE"))&&!Fx("Edge"),Kx=-1!=Cx.toLowerCase().indexOf("webkit")&&!Fx("Edge");Kx&&Fx("Mobile");Fx("Macintosh");Fx("Windows");Fx("Linux")||Fx("CrOS");var Lx=ba.navigator||null;Lx&&(Lx.appVersion||"").indexOf("X11");Fx("Android");!Fx("iPhone")||Fx("iPod")||Fx("iPad");Fx("iPad");
function Mx(){var a=Cx;if(Jx)return/rv\:([^\);]+)(\)|;)/.exec(a);if(Ix)return/Edge\/([\d\.]+)/.exec(a);if(Hx)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(Kx)return/WebKit\/(\S+)/.exec(a)}function Nx(){var a=ba.document;return a?a.documentMode:void 0}var Ox=function(){if(Gx&&ba.opera){var a;var b=ba.opera.version;try{a=b()}catch(c){a=b}return a}a="";(b=Mx())&&(a=b?b[1]:"");return Hx&&(b=Nx(),b>parseFloat(a))?String(b):a}(),Px={};
function Qx(a){var b;if(!(b=Px[a])){b=0;for(var c=Da(String(Ox)).split("."),d=Da(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",l=d[f]||"",m=RegExp("(\\d*)(\\D*)","g"),n=RegExp("(\\d*)(\\D*)","g");do{var p=m.exec(g)||["","",""],u=n.exec(l)||["","",""];if(0==p[0].length&&0==u[0].length)break;b=Sa(0==p[1].length?0:parseInt(p[1],10),0==u[1].length?0:parseInt(u[1],10))||Sa(0==p[2].length,0==u[2].length)||Sa(p[2],u[2])}while(0==b)}b=Px[a]=0<=b}return b}
var Rx=ba.document,Sx=Rx&&Hx?Nx()||("CSS1Compat"==Rx.compatMode?parseInt(Ox,10):5):void 0;var Tx=!Hx||9<=Sx,Ux=!Jx&&!Hx||Hx&&9<=Sx||Jx&&Qx("1.9.1"),Vx=Hx&&!Qx("9"),Wx=Hx&&!(9<=Sx);function Xx(a,b){this.x=ca(a)?a:0;this.y=ca(b)?b:0}h=Xx.prototype;h.clone=function(){return new Xx(this.x,this.y)};h.toString=function(){return"("+this.x+", "+this.y+")"};h.ceil=function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);return this};h.floor=function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this};h.round=function(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this};
h.translate=function(a,b){a instanceof Xx?(this.x+=a.x,this.y+=a.y):(this.x+=a,ja(b)&&(this.y+=b));return this};h.scale=function(a,b){var c=ja(b)?b:a;this.x*=a;this.y*=c;return this};function Yx(a){return a?new Zx($x(a)):fb||(fb=new Zx)}
function ay(a,b){var c=document,c=b||c;if(c.querySelectorAll&&c.querySelector)return c.querySelectorAll("DIV"+(a?"."+a:""));if(a&&c.getElementsByClassName){for(var c=c.getElementsByClassName(a),d={},e=0,f=0,g;g=c[f];f++)"DIV"==g.nodeName&&(d[e++]=g);d.length=e;return d}c=c.getElementsByTagName("DIV");if(a){d={};for(f=e=0;g=c[f];f++){var l=g.className,m;if(m="function"==typeof l.split)m=0<=mb(l.split(/\s+/),a);m&&(d[e++]=g)}d.length=e;return d}return c}
function by(a,b){Xa(b,function(b,d){"style"==d?a.style.cssText=b:"class"==d?a.className=b:"for"==d?a.htmlFor=b:cy.hasOwnProperty(d)?a.setAttribute(cy[d],b):0==d.lastIndexOf("aria-",0)||0==d.lastIndexOf("data-",0)?a.setAttribute(d,b):a[d]=b})}var cy={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};
function dy(a){return a.scrollingElement?a.scrollingElement:Kx||"CSS1Compat"!=a.compatMode?a.body||a.documentElement:a.documentElement}function ey(a){return a?a.parentWindow||a.defaultView:window}function fy(a,b,c,d){function e(c){c&&b.appendChild(ia(c)?a.createTextNode(c):c)}for(;d<c.length;d++){var f=c[d];!ha(f)||pa(f)&&0<f.nodeType?e(f):nb(gy(f)?tb(f):f,e)}}
function hy(a){if(1!=a.nodeType)return!1;switch(a.tagName){case "APPLET":case "AREA":case "BASE":case "BR":case "COL":case "COMMAND":case "EMBED":case "FRAME":case "HR":case "IMG":case "INPUT":case "IFRAME":case "ISINDEX":case "KEYGEN":case "LINK":case "NOFRAMES":case "NOSCRIPT":case "META":case "OBJECT":case "PARAM":case "SCRIPT":case "SOURCE":case "STYLE":case "TRACK":case "WBR":return!1}return!0}function iy(a,b){a.appendChild(b)}
function jy(a){return a&&a.parentNode?a.parentNode.removeChild(a):null}function ky(a,b){if(a.contains&&1==b.nodeType)return a==b||a.contains(b);if("undefined"!=typeof a.compareDocumentPosition)return a==b||Boolean(a.compareDocumentPosition(b)&16);for(;b&&a!=b;)b=b.parentNode;return b==a}
function ly(a,b){if(a==b)return 0;if(a.compareDocumentPosition)return a.compareDocumentPosition(b)&2?1:-1;if(Hx&&!(9<=Sx)){if(9==a.nodeType)return-1;if(9==b.nodeType)return 1}if("sourceIndex"in a||a.parentNode&&"sourceIndex"in a.parentNode){var c=1==a.nodeType,d=1==b.nodeType;if(c&&d)return a.sourceIndex-b.sourceIndex;var e=a.parentNode,f=b.parentNode;return e==f?my(a,b):!c&&ky(e,b)?-1*ny(a,b):!d&&ky(f,a)?ny(b,a):(c?a.sourceIndex:e.sourceIndex)-(d?b.sourceIndex:f.sourceIndex)}d=$x(a);c=d.createRange();
c.selectNode(a);c.collapse(!0);d=d.createRange();d.selectNode(b);d.collapse(!0);return c.compareBoundaryPoints(ba.Range.START_TO_END,d)}function ny(a,b){var c=a.parentNode;if(c==b)return-1;for(var d=b;d.parentNode!=c;)d=d.parentNode;return my(d,a)}function my(a,b){for(var c=b;c=c.previousSibling;)if(c==a)return-1;return 1}
function oy(a){var b,c=arguments.length;if(!c)return null;if(1==c)return arguments[0];var d=[],e=Infinity;for(b=0;b<c;b++){for(var f=[],g=arguments[b];g;)f.unshift(g),g=g.parentNode;d.push(f);e=Math.min(e,f.length)}f=null;for(b=0;b<e;b++){for(var g=d[0][b],l=1;l<c;l++)if(g!=d[l][b])return f;f=g}return f}function $x(a){return 9==a.nodeType?a:a.ownerDocument||a.document}var py={SCRIPT:1,STYLE:1,HEAD:1,IFRAME:1,OBJECT:1},qy={IMG:" ",BR:"\n"};
function ry(a,b,c){if(!(a.nodeName in py))if(3==a.nodeType)c?b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g,"")):b.push(a.nodeValue);else if(a.nodeName in qy)b.push(qy[a.nodeName]);else for(a=a.firstChild;a;)ry(a,b,c),a=a.nextSibling}function gy(a){if(a&&"number"==typeof a.length){if(pa(a))return"function"==typeof a.item||"string"==typeof a.item;if(la(a))return"function"==typeof a.item}return!1}function Zx(a){this.Ac=a||ba.document||document}h=Zx.prototype;h.getDocument=function(){return this.Ac};
h.Hg=function(a,b,c){var d=this.Ac,e=arguments,f=e[0],g=e[1];if(!Tx&&g&&(g.name||g.type)){f=["\x3c",f];g.name&&f.push(' name\x3d"',Fa(g.name),'"');if(g.type){f.push(' type\x3d"',Fa(g.type),'"');var l={};cb(l,g);delete l.type;g=l}f.push("\x3e");f=f.join("")}f=d.createElement(f);g&&(ia(g)?f.className=g:ga(g)?f.className=g.join(" "):by(f,g));2<e.length&&fy(d,f,e,2);return f};h.createElement=function(a){return this.Ac.createElement(a)};h.createTextNode=function(a){return this.Ac.createTextNode(String(a))};
h.Zf=function(){var a=this.Ac;return a.parentWindow||a.defaultView};h.appendChild=iy;h.append=function(a,b){fy($x(a),a,arguments,1)};h.canHaveChildren=hy;h.removeNode=jy;h.Yf=function(a){return Ux&&void 0!=a.children?a.children:ob(a.childNodes,function(a){return 1==a.nodeType})};h.contains=ky;
h.getTextContent=function(a){if(Vx&&"innerText"in a)a=a.innerText.replace(/(\r\n|\r|\n)/g,"\n");else{var b=[];ry(a,b,!0);a=b.join("")}a=a.replace(/ \xAD /g," ").replace(/\xAD/g,"");a=a.replace(/\u200B/g,"");Vx||(a=a.replace(/ +/g," "));" "!=a&&(a=a.replace(/^\s*/,""));return a};function sy(a){a=a.className;return ia(a)&&a.match(/\S+/g)||[]}function ty(a,b){for(var c=sy(a),d=c,e=ub(arguments,1),f=0;f<e.length;f++)0<=mb(d,e[f])||d.push(e[f]);a.className=c.join(" ")};var uy;
function vy(){var a=ba.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!Fx("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ya(function(a){if(("*"==d||a.origin==d)&&a.data==
c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!Fx("Trident")&&!Fx("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(ca(c.next)){c=c.next;var a=c.Dd;c.Dd=null;a()}};return function(a){d.next={Dd:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");
b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){ba.setTimeout(a,0)}};function wy(){0!=xy&&(yy[qa(this)]=this);this.kd=this.kd;this.Ie=this.Ie}var xy=0,yy={};wy.prototype.kd=!1;function zy(a){a.kd||(a.kd=!0,a.Ob(),0!=xy&&(a=qa(a),delete yy[a]))}wy.prototype.Ob=function(){if(this.Ie)for(;this.Ie.length;)this.Ie.shift()()};var Ay=!Hx||9<=Sx,By=Hx&&!Qx("9");!Kx||Qx("528");Jx&&Qx("1.9b")||Hx&&Qx("8")||Gx&&Qx("9.5")||Kx&&Qx("528");Jx&&!Qx("8")||Hx&&Qx("9");function Cy(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=this.Xc=!1;this.lg=!0}Cy.prototype.stopPropagation=function(){this.Xc=!0};Cy.prototype.preventDefault=function(){this.defaultPrevented=!0;this.lg=!1};function Dy(a){Dy[" "](a);return a}Dy[" "]=ea;function Ey(a,b){Cy.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.charCode=this.keyCode=this.button=this.screenY=this.screenX=this.clientY=this.clientX=this.offsetY=this.offsetX=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.Sd=this.state=null;a&&this.init(a,b)}Ba(Ey,Cy);
Ey.prototype.init=function(a,b){var c=this.type=a.type,d=a.changedTouches?a.changedTouches[0]:null;this.target=a.target||a.srcElement;this.currentTarget=b;var e=a.relatedTarget;if(e){if(Jx){var f;a:{try{Dy(e.nodeName);f=!0;break a}catch(g){}f=!1}f||(e=null)}}else"mouseover"==c?e=a.fromElement:"mouseout"==c&&(e=a.toElement);this.relatedTarget=e;null===d?(this.offsetX=Kx||void 0!==a.offsetX?a.offsetX:a.layerX,this.offsetY=Kx||void 0!==a.offsetY?a.offsetY:a.layerY,this.clientX=void 0!==a.clientX?a.clientX:
a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0):(this.clientX=void 0!==d.clientX?d.clientX:d.pageX,this.clientY=void 0!==d.clientY?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0);this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.Sd=a;a.defaultPrevented&&
this.preventDefault()};Ey.prototype.stopPropagation=function(){Ey.wb.stopPropagation.call(this);this.Sd.stopPropagation?this.Sd.stopPropagation():this.Sd.cancelBubble=!0};Ey.prototype.preventDefault=function(){Ey.wb.preventDefault.call(this);var a=this.Sd;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,By)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var Fy="closure_listenable_"+(1E6*Math.random()|0),Gy=0;function Hy(a,b,c,d,e){this.listener=a;this.Le=null;this.src=b;this.type=c;this.Cd=!!d;this.ub=e;this.key=++Gy;this.ud=this.ne=!1}function Iy(a){a.ud=!0;a.listener=null;a.Le=null;a.src=null;a.ub=null};function Jy(a){this.src=a;this.qb={};this.ie=0}Jy.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.qb[f];a||(a=this.qb[f]=[],this.ie++);var g=Ky(a,b,d,e);-1<g?(b=a[g],c||(b.ne=!1)):(b=new Hy(b,this.src,f,!!d,e),b.ne=c,a.push(b));return b};Jy.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.qb))return!1;var e=this.qb[a];b=Ky(e,b,c,d);return-1<b?(Iy(e[b]),lb.splice.call(e,b,1),0==e.length&&(delete this.qb[a],this.ie--),!0):!1};
function Ly(a,b){var c=b.type;if(c in a.qb){var d=a.qb[c],e=mb(d,b),f;(f=0<=e)&&lb.splice.call(d,e,1);f&&(Iy(b),0==a.qb[c].length&&(delete a.qb[c],a.ie--))}}Jy.prototype.mf=function(a,b,c,d){a=this.qb[a.toString()];var e=-1;a&&(e=Ky(a,b,c,d));return-1<e?a[e]:null};Jy.prototype.hasListener=function(a,b){var c=ca(a),d=c?a.toString():"",e=ca(b);return Ya(this.qb,function(a){for(var g=0;g<a.length;++g)if(!(c&&a[g].type!=d||e&&a[g].Cd!=b))return!0;return!1})};
function Ky(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.ud&&f.listener==b&&f.Cd==!!c&&f.ub==d)return e}return-1};var My="closure_lm_"+(1E6*Math.random()|0),Ny={},Oy=0;
function Py(a,b,c,d,e){if(ga(b))for(var f=0;f<b.length;f++)Py(a,b[f],c,d,e);else if(c=Qy(c),a&&a[Fy])a.listen(b,c,d,e);else{if(!b)throw Error("Invalid event type");var f=!!d,g=Ry(a);g||(a[My]=g=new Jy(a));c=g.add(b,c,!1,d,e);if(!c.Le){d=Sy();c.Le=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,f);else if(a.attachEvent)a.attachEvent(Ty(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");Oy++}}}
function Sy(){var a=Uy,b=Ay?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b}function Vy(a,b,c,d,e){if(ga(b))for(var f=0;f<b.length;f++)Vy(a,b[f],c,d,e);else c=Qy(c),a&&a[Fy]?a.mc.remove(String(b),c,d,e):a&&(a=Ry(a))&&(b=a.mf(b,c,!!d,e))&&Wy(b)}
function Wy(a){if(!ja(a)&&a&&!a.ud){var b=a.src;if(b&&b[Fy])Ly(b.mc,a);else{var c=a.type,d=a.Le;b.removeEventListener?b.removeEventListener(c,d,a.Cd):b.detachEvent&&b.detachEvent(Ty(c),d);Oy--;(c=Ry(b))?(Ly(c,a),0==c.ie&&(c.src=null,b[My]=null)):Iy(a)}}}function Ty(a){return a in Ny?Ny[a]:Ny[a]="on"+a}function Xy(a,b,c,d){var e=!0;if(a=Ry(a))if(b=a.qb[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.Cd==c&&!f.ud&&(f=Yy(f,d),e=e&&!1!==f)}return e}
function Yy(a,b){var c=a.listener,d=a.ub||a.src;a.ne&&Wy(a);return c.call(d,b)}
function Uy(a,b){if(a.ud)return!0;if(!Ay){var c;if(!(c=b))a:{c=["window","event"];for(var d=ba,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new Ey(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(m){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.currentTarget;f;f=f.parentNode)e.push(f);for(var f=a.type,g=e.length-1;!c.Xc&&0<=g;g--){c.currentTarget=e[g];var l=Xy(e[g],f,!0,c),d=d&&l}for(g=0;!c.Xc&&
g<e.length;g++)c.currentTarget=e[g],l=Xy(e[g],f,!1,c),d=d&&l}return d}return Yy(a,new Ey(b,this))}function Ry(a){a=a[My];return a instanceof Jy?a:null}var Zy="__closure_events_fn_"+(1E9*Math.random()>>>0);function Qy(a){if(la(a))return a;a[Zy]||(a[Zy]=function(b){return a.handleEvent(b)});return a[Zy]};function $y(){wy.call(this);this.mc=new Jy(this);this.qg=this;this.uf=null}Ba($y,wy);$y.prototype[Fy]=!0;h=$y.prototype;h.addEventListener=function(a,b,c,d){Py(this,a,b,c,d)};h.removeEventListener=function(a,b,c,d){Vy(this,a,b,c,d)};
h.dispatchEvent=function(a){var b,c=this.uf;if(c)for(b=[];c;c=c.uf)b.push(c);var c=this.qg,d=a.type||a;if(ia(a))a=new Cy(a,c);else if(a instanceof Cy)a.target=a.target||c;else{var e=a;a=new Cy(d,c);cb(a,e)}var e=!0,f;if(b)for(var g=b.length-1;!a.Xc&&0<=g;g--)f=a.currentTarget=b[g],e=az(f,d,!0,a)&&e;a.Xc||(f=a.currentTarget=c,e=az(f,d,!0,a)&&e,a.Xc||(e=az(f,d,!1,a)&&e));if(b)for(g=0;!a.Xc&&g<b.length;g++)f=a.currentTarget=b[g],e=az(f,d,!1,a)&&e;return e};
h.Ob=function(){$y.wb.Ob.call(this);if(this.mc){var a=this.mc,b=0,c;for(c in a.qb){for(var d=a.qb[c],e=0;e<d.length;e++)++b,Iy(d[e]);delete a.qb[c];a.ie--}}this.uf=null};h.listen=function(a,b,c,d){return this.mc.add(String(a),b,!1,c,d)};function az(a,b,c,d){b=a.mc.qb[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.ud&&g.Cd==c){var l=g.listener,m=g.ub||g.src;g.ne&&Ly(a.mc,g);e=!1!==l.call(m,d)&&e}}return e&&0!=d.lg}
h.mf=function(a,b,c,d){return this.mc.mf(String(a),b,c,d)};h.hasListener=function(a,b){return this.mc.hasListener(ca(a)?String(a):void 0,b)};function bz(a,b,c){if(la(a))c&&(a=ya(a,c));else if(a&&"function"==typeof a.handleEvent)a=ya(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<b?-1:ba.setTimeout(a,b||0)};function cz(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function dz(){this.Me=void 0}
function ez(a,b,c){if(null==b)c.push("null");else{if("object"==typeof b){if(ga(b)){var d=b;b=d.length;c.push("[");for(var e="",f=0;f<b;f++)c.push(e),e=d[f],ez(a,a.Me?a.Me.call(d,String(f),e):e,c),e=",";c.push("]");return}if(b instanceof String||b instanceof Number||b instanceof Boolean)b=b.valueOf();else{c.push("{");f="";for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(e=b[d],"function"!=typeof e&&(c.push(f),fz(d,c),c.push(":"),ez(a,a.Me?a.Me.call(b,d,e):e,c),f=","));c.push("}");return}}switch(typeof b){case "string":fz(b,
c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?String(b):"null");break;case "boolean":c.push(String(b));break;case "function":c.push("null");break;default:throw Error("Unknown type: "+typeof b);}}}var gz={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},hz=/\uffff/.test("￿")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function fz(a,b){b.push('"',a.replace(hz,function(a){var b=gz[a];b||(b="\\u"+(a.charCodeAt(0)|65536).toString(16).substr(1),gz[a]=b);return b}),'"')};function iz(a){if(a.pd&&"function"==typeof a.pd)return a.pd();if(ia(a))return a.split("");if(ha(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Za(a)}
function jz(a,b){if(a.forEach&&"function"==typeof a.forEach)a.forEach(b,void 0);else if(ha(a)||ia(a))nb(a,b,void 0);else{var c;if(a.Zb&&"function"==typeof a.Zb)c=a.Zb();else if(a.pd&&"function"==typeof a.pd)c=void 0;else if(ha(a)||ia(a)){c=[];for(var d=a.length,e=0;e<d;e++)c.push(e)}else c=$a(a);for(var d=iz(a),e=d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a)}};var kz="StopIteration"in ba?ba.StopIteration:{message:"StopIteration",stack:""};function lz(){}lz.prototype.next=function(){throw kz;};lz.prototype.qc=function(){return this};function mz(a){if(a instanceof lz)return a;if("function"==typeof a.qc)return a.qc(!1);if(ha(a)){var b=0,c=new lz;c.next=function(){for(;;){if(b>=a.length)throw kz;if(b in a)return a[b++];b++}};return c}throw Error("Not implemented");};function nz(a,b){this.$b={};this.gb=[];this.ke=this.yc=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else a&&this.addAll(a)}h=nz.prototype;h.pd=function(){oz(this);for(var a=[],b=0;b<this.gb.length;b++)a.push(this.$b[this.gb[b]]);return a};h.Zb=function(){oz(this);return this.gb.concat()};
h.ob=function(a,b){if(this===a)return!0;if(this.yc!=a.yc)return!1;var c=b||pz;oz(this);for(var d,e=0;d=this.gb[e];e++)if(!c(this.get(d),a.get(d)))return!1;return!0};function pz(a,b){return a===b}h.clear=function(){this.$b={};this.ke=this.yc=this.gb.length=0};h.remove=function(a){return Object.prototype.hasOwnProperty.call(this.$b,a)?(delete this.$b[a],this.yc--,this.ke++,this.gb.length>2*this.yc&&oz(this),!0):!1};
function oz(a){if(a.yc!=a.gb.length){for(var b=0,c=0;b<a.gb.length;){var d=a.gb[b];Object.prototype.hasOwnProperty.call(a.$b,d)&&(a.gb[c++]=d);b++}a.gb.length=c}if(a.yc!=a.gb.length){for(var e={},c=b=0;b<a.gb.length;)d=a.gb[b],Object.prototype.hasOwnProperty.call(e,d)||(a.gb[c++]=d,e[d]=1),b++;a.gb.length=c}}h.get=function(a,b){return Object.prototype.hasOwnProperty.call(this.$b,a)?this.$b[a]:b};
h.set=function(a,b){Object.prototype.hasOwnProperty.call(this.$b,a)||(this.yc++,this.gb.push(a),this.ke++);this.$b[a]=b};h.addAll=function(a){var b;a instanceof nz?(b=a.Zb(),a=a.pd()):(b=$a(a),a=Za(a));for(var c=0;c<b.length;c++)this.set(b[c],a[c])};h.forEach=function(a,b){for(var c=this.Zb(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};h.clone=function(){return new nz(this)};
h.qc=function(a){oz(this);var b=0,c=this.ke,d=this,e=new lz;e.next=function(){if(c!=d.ke)throw Error("The map has changed since the iterator was created");if(b>=d.gb.length)throw kz;var e=d.gb[b++];return a?e:d.$b[e]};return e};function qz(a,b,c,d,e){this.reset(a,b,c,d,e)}qz.prototype.Uf=null;var rz=0;qz.prototype.reset=function(a,b,c,d,e){"number"==typeof e||rz++;d||za();this.be=a;this.Wg=b;delete this.Uf};qz.prototype.ng=function(a){this.be=a};function sz(a){this.cg=a;this.$f=this.$e=this.be=this.Je=null}function tz(a,b){this.name=a;this.value=b}tz.prototype.toString=function(){return this.name};var uz=new tz("SEVERE",1E3),vz=new tz("WARNING",900),wz=new tz("INFO",800),xz=new tz("CONFIG",700),yz=new tz("FINE",500);h=sz.prototype;h.getName=function(){return this.cg};h.getParent=function(){return this.Je};h.Yf=function(){this.$e||(this.$e={});return this.$e};h.ng=function(a){this.be=a};
function zz(a){if(a.be)return a.be;if(a.Je)return zz(a.Je);ib("Root logger has no level set.");return null}h.log=function(a,b,c){if(a.value>=zz(this).value)for(la(b)&&(b=b()),a=new qz(a,String(b),this.cg),c&&(a.Uf=c),c="log:"+a.Wg,ba.console&&(ba.console.timeStamp?ba.console.timeStamp(c):ba.console.markTimeline&&ba.console.markTimeline(c)),ba.msWriteProfilerMark&&ba.msWriteProfilerMark(c),c=this;c;){b=c;var d=a;if(b.$f)for(var e=0,f=void 0;f=b.$f[e];e++)f(d);c=c.getParent()}};
h.info=function(a,b){this.log(wz,a,b)};var Az={},Bz=null;function Cz(a){Bz||(Bz=new sz(""),Az[""]=Bz,Bz.ng(xz));var b;if(!(b=Az[a])){b=new sz(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=Cz(a.substr(0,c));c.Yf()[d]=b;b.Je=c;Az[a]=b}return b};function Dz(a,b){a&&a.log(uz,b,void 0)}function Ez(a,b){a&&a.log(yz,b,void 0)};function Fz(){}Fz.prototype.Mf=null;function Gz(a){var b;(b=a.Mf)||(b={},Hz(a)&&(b[0]=!0,b[1]=!0),b=a.Mf=b);return b};var Iz;function Jz(){}Ba(Jz,Fz);function Kz(a){return(a=Hz(a))?new ActiveXObject(a):new XMLHttpRequest}function Hz(a){if(!a.ag&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.ag=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.ag}Iz=new Jz;var Lz=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;function Mz(a){$y.call(this);this.headers=new nz;this.Se=a||null;this.rc=!1;this.Re=this.fa=null;this.bg=this.He="";this.rd=0;this.ae="";this.Tc=this.qf=this.Ge=this.kf=!1;this.wd=0;this.Oe=null;this.kg=Nz;this.Qe=this.ah=this.pg=!1}Ba(Mz,$y);var Nz="";Mz.prototype.vb=Cz("goog.net.XhrIo");var Oz=/^https?$/i,Pz=["POST","PUT"];h=Mz.prototype;
h.send=function(a,b,c,d){if(this.fa)throw Error("[goog.net.XhrIo] Object is active with another request\x3d"+this.He+"; newUri\x3d"+a);b=b?b.toUpperCase():"GET";this.He=a;this.ae="";this.rd=0;this.bg=b;this.kf=!1;this.rc=!0;this.fa=this.Se?Kz(this.Se):Kz(Iz);this.Re=this.Se?Gz(this.Se):Gz(Iz);this.fa.onreadystatechange=ya(this.gg,this);this.ah&&"onprogress"in this.fa&&(this.fa.onprogress=ya(function(a){this.fg(a,!0)},this),this.fa.upload&&(this.fa.upload.onprogress=ya(this.fg,this)));try{Ez(this.vb,
Qz(this,"Opening Xhr")),this.qf=!0,this.fa.open(b,String(a),!0),this.qf=!1}catch(f){Ez(this.vb,Qz(this,"Error opening Xhr: "+f.message));Rz(this,f);return}a=c||"";var e=this.headers.clone();d&&jz(d,function(a,b){e.set(b,a)});d=sb(e.Zb(),Sz);c=ba.FormData&&a instanceof ba.FormData;!(0<=mb(Pz,b))||d||c||e.set("Content-Type","application/x-www-form-urlencoded;charset\x3dutf-8");e.forEach(function(a,b){this.fa.setRequestHeader(b,a)},this);this.kg&&(this.fa.responseType=this.kg);ab(this.fa)&&(this.fa.withCredentials=
this.pg);try{Tz(this),0<this.wd&&(this.Qe=Uz(this.fa),Ez(this.vb,Qz(this,"Will abort after "+this.wd+"ms if incomplete, xhr2 "+this.Qe)),this.Qe?(this.fa.timeout=this.wd,this.fa.ontimeout=ya(this.og,this)):this.Oe=bz(this.og,this.wd,this)),Ez(this.vb,Qz(this,"Sending request")),this.Ge=!0,this.fa.send(a),this.Ge=!1}catch(f){Ez(this.vb,Qz(this,"Send error: "+f.message)),Rz(this,f)}};function Uz(a){return Hx&&Qx(9)&&ja(a.timeout)&&ca(a.ontimeout)}
function Sz(a){return"content-type"==a.toLowerCase()}h.og=function(){"undefined"!=typeof aa&&this.fa&&(this.ae="Timed out after "+this.wd+"ms, aborting",this.rd=8,Ez(this.vb,Qz(this,this.ae)),this.dispatchEvent("timeout"),this.abort(8))};function Rz(a,b){a.rc=!1;a.fa&&(a.Tc=!0,a.fa.abort(),a.Tc=!1);a.ae=b;a.rd=5;Vz(a);Wz(a)}function Vz(a){a.kf||(a.kf=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))}
h.abort=function(a){this.fa&&this.rc&&(Ez(this.vb,Qz(this,"Aborting")),this.rc=!1,this.Tc=!0,this.fa.abort(),this.Tc=!1,this.rd=a||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),Wz(this))};h.Ob=function(){this.fa&&(this.rc&&(this.rc=!1,this.Tc=!0,this.fa.abort(),this.Tc=!1),Wz(this,!0));Mz.wb.Ob.call(this)};h.gg=function(){this.kd||(this.qf||this.Ge||this.Tc?Xz(this):this.Zg())};h.Zg=function(){Xz(this)};
function Xz(a){if(a.rc&&"undefined"!=typeof aa)if(a.Re[1]&&4==Yz(a)&&2==Zz(a))Ez(a.vb,Qz(a,"Local request error detected and ignored"));else if(a.Ge&&4==Yz(a))bz(a.gg,0,a);else if(a.dispatchEvent("readystatechange"),4==Yz(a)){Ez(a.vb,Qz(a,"Request complete"));a.rc=!1;try{var b=Zz(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}var d;if(!(d=c)){var e;if(e=0===b){var f=String(a.He).match(Lz)[1]||null;if(!f&&ba.self&&ba.self.location)var g=ba.self.location.protocol,
f=g.substr(0,g.length-1);e=!Oz.test(f?f.toLowerCase():"")}d=e}d?(a.dispatchEvent("complete"),a.dispatchEvent("success")):(a.rd=6,a.ae=$z(a)+" ["+Zz(a)+"]",Vz(a))}finally{Wz(a)}}}h.fg=function(a,b){this.dispatchEvent(aA(a,"progress"));this.dispatchEvent(aA(a,b?"downloadprogress":"uploadprogress"))};function aA(a,b){return{type:b,lengthComputable:a.lengthComputable,loaded:a.loaded,total:a.total}}
function Wz(a,b){if(a.fa){Tz(a);var c=a.fa,d=a.Re[0]?ea:null;a.fa=null;a.Re=null;b||a.dispatchEvent("ready");try{c.onreadystatechange=d}catch(e){Dz(a.vb,"Problem encountered resetting onreadystatechange: "+e.message)}}}function Tz(a){a.fa&&a.Qe&&(a.fa.ontimeout=null);ja(a.Oe)&&(ba.clearTimeout(a.Oe),a.Oe=null)}function Yz(a){return a.fa?a.fa.readyState:0}function Zz(a){try{return 2<Yz(a)?a.fa.status:-1}catch(b){return-1}}
function $z(a){try{return 2<Yz(a)?a.fa.statusText:""}catch(b){return Ez(a.vb,"Can not get status: "+b.message),""}}h.getResponseHeader=function(a){return this.fa&&4==Yz(this)?this.fa.getResponseHeader(a):void 0};h.getAllResponseHeaders=function(){return this.fa&&4==Yz(this)?this.fa.getAllResponseHeaders():""};function Qz(a,b){return b+" ["+a.bg+" "+a.He+" "+Zz(a)+"]"};var bA=function bA(b,c,d){if(null!=b&&null!=b.Te)return b.Te(b,c,d);var e=bA[k(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=bA._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw Pb("AjaxImpl.-js-ajax-request",b);},cA=function cA(b){if(null!=b&&null!=b.We)return b.We(b);var c=cA[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=cA._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("AjaxResponse.-status",b);},dA=function dA(b){if(null!=b&&null!=
b.Xe)return b.Xe(b);var c=dA[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=dA._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("AjaxResponse.-status-text",b);},eA=function eA(b){if(null!=b&&null!=b.Ue)return b.Ue(b);var c=eA[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=eA._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("AjaxResponse.-body",b);},fA=function fA(b,c){if(null!=b&&null!=b.Ve)return b.Ve(b,c);var d=fA[k(null==b?null:b)];if(null!=d)return d.a?
d.a(b,c):d.call(null,b,c);d=fA._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("AjaxResponse.-get-response-header",b);},gA=function gA(b){if(null!=b&&null!=b.Ye)return b.Ye(b);var c=gA[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=gA._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("AjaxResponse.-was-aborted",b);},hA=function hA(b,c){if(null!=b&&null!=b.zd)return b.zd(b,c);var d=hA[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=hA._;if(null!=
d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("Interceptor.-process-request",b);},iA=function iA(b,c){if(null!=b&&null!=b.Ad)return b.Ad(b,c);var d=iA[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=iA._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("Interceptor.-process-response",b);};h=XMLHttpRequest.prototype;
h.Te=function(a,b,c){var d=null!=b&&(b.l&64||b.M)?S(fg,b):b,e=A.a(d,ns),f=A.a(d,nm);a=A.a(d,Ps);var g=A.a(d,Ko),l=A.h(d,ws,0),m=A.h(d,ut,!1),n=A.a(d,an);this.withCredentials=m;this.onreadystatechange=function(a){return function(b){return Gd.a(sq,(new q(null,5,[0,Ol,1,Rs,2,In,3,un,4,sq],null)).call(null,b.target.readyState))?c.g?c.g(a):c.call(null,a):null}}(this,b,d,e,f,a,g,l,m,n);this.open(f,e,!0);this.timeout=l;b=Gn.g(n);r(b)&&(this.responseType=sf(b));b=B(g);g=null;for(e=d=0;;)if(e<d)l=g.N(null,
e),f=O(l,0,null),l=O(l,1,null),this.setRequestHeader(f,l),e+=1;else if(b=B(b))Ee(b)?(d=gd(b),b=hd(b),g=d,d=M(d)):(d=D(b),g=O(d,0,null),d=O(d,1,null),this.setRequestHeader(g,d),b=F(b),g=null,d=0),e=0;else break;this.send(r(a)?a:"");return this};h.Ue=function(){return this.response};h.We=function(){return this.status};h.Xe=function(){return this.statusText};h.Ve=function(a,b){return this.getResponseHeader(b)};h.Ye=function(){return Gd.a(0,this.readyState)};var jA="undefined"!=typeof Object.keys?function(a){return Object.keys(a)}:function(a){return $a(a)},kA="undefined"!=typeof Array.isArray?function(a){return Array.isArray(a)}:function(a){return"array"===k(a)};function lA(){return Math.round(15*Math.random()).toString(16)};var mA=1;function nA(a,b){if(null==a)return null==b;if(a===b)return!0;if("object"===typeof a){if(kA(a)){if(kA(b)&&a.length===b.length){for(var c=0;c<a.length;c++)if(!nA(a[c],b[c]))return!1;return!0}return!1}if(a.Db)return a.Db(b);if(null!=b&&"object"===typeof b){if(b.Db)return b.Db(a);var c=0,d=jA(b).length,e;for(e in a)if(a.hasOwnProperty(e)&&(c++,!b.hasOwnProperty(e)||!nA(a[e],b[e])))return!1;return c===d}}return!1}function oA(a,b){return a^b+2654435769+(a<<6)+(a>>2)}var pA={},qA=0;
function rA(a){var b=0;if(null!=a.forEach)a.forEach(function(a,c){b=(b+(sA(c)^sA(a)))%4503599627370496});else for(var c=jA(a),d=0;d<c.length;d++)var e=c[d],f=a[e],b=(b+(sA(e)^sA(f)))%4503599627370496;return b}function tA(a){var b=0;if(kA(a))for(var c=0;c<a.length;c++)b=oA(b,sA(a[c]));else a.forEach&&a.forEach(function(a){b=oA(b,sA(a))});return b}
function sA(a){if(null==a)return 0;switch(typeof a){case "number":return a;case "boolean":return!0===a?1:0;case "string":var b=pA[a];if(null==b){for(var c=b=0;c<a.length;++c)b=31*b+a.charCodeAt(c),b%=4294967296;qA++;256<=qA&&(pA={},qA=1);pA[a]=b}a=b;return a;case "function":return b=a.transit$hashCode$,b||(b=mA,"undefined"!=typeof Object.defineProperty?Object.defineProperty(a,"transit$hashCode$",{value:b,enumerable:!1}):a.transit$hashCode$=b,mA++),b;default:return a instanceof Date?a.valueOf():kA(a)?
tA(a):a.Mb?a.Mb():rA(a)}};function uA(a,b){this.Aa=a|0;this.pa=b|0}var vA={},wA={};function xA(a){if(-128<=a&&128>a){var b=vA[a];if(b)return b}b=new uA(a|0,0>a?-1:0);-128<=a&&128>a&&(vA[a]=b);return b}function yA(a){isNaN(a)||!isFinite(a)?a=zA():a<=-AA?a=BA():a+1>=AA?(a=CA,wA[a]||(wA[a]=DA(-1,2147483647)),a=wA[a]):a=0>a?EA(yA(-a)):new uA(a%FA|0,a/FA|0);return a}function DA(a,b){return new uA(a,b)}
function GA(a,b){if(0==a.length)throw Error("number format error: empty string");var c=b||10;if(2>c||36<c)throw Error("radix out of range: "+c);if("-"==a.charAt(0))return EA(GA(a.substring(1),c));if(0<=a.indexOf("-"))throw Error('number format error: interior "-" character: '+a);for(var d=yA(Math.pow(c,8)),e=zA(),f=0;f<a.length;f+=8){var g=Math.min(8,a.length-f),l=parseInt(a.substring(f,f+g),c);8>g?(g=yA(Math.pow(c,g)),e=e.multiply(g).add(yA(l))):(e=e.multiply(d),e=e.add(yA(l)))}return e}
var FA=4294967296,AA=FA*FA/2;function zA(){var a=HA;wA[a]||(wA[a]=xA(0));return wA[a]}function IA(){var a=JA;wA[a]||(wA[a]=xA(1));return wA[a]}function KA(){var a=LA;wA[a]||(wA[a]=xA(-1));return wA[a]}function BA(){var a=MA;wA[a]||(wA[a]=DA(0,-2147483648));return wA[a]}function NA(){var a=OA;wA[a]||(wA[a]=xA(16777216));return wA[a]}function PA(a){return a.pa*FA+(0<=a.Aa?a.Aa:FA+a.Aa)}h=uA.prototype;
h.toString=function(a){a=a||10;if(2>a||36<a)throw Error("radix out of range: "+a);if(QA(this))return"0";if(0>this.pa){if(this.ob(BA())){var b=yA(a),c=RA(this,b),b=SA(c.multiply(b),this);return c.toString(a)+b.Aa.toString(a)}return"-"+EA(this).toString(a)}for(var c=yA(Math.pow(a,6)),b=this,d="";;){var e=RA(b,c),f=(SA(b,e.multiply(c)).Aa>>>0).toString(a),b=e;if(QA(b))return f+d;for(;6>f.length;)f="0"+f;d=""+f+d}};function QA(a){return 0==a.pa&&0==a.Aa}
h.ob=function(a){return this.pa==a.pa&&this.Aa==a.Aa};h.compare=function(a){if(this.ob(a))return 0;var b=0>this.pa,c=0>a.pa;return b&&!c?-1:!b&&c?1:0>SA(this,a).pa?-1:1};function EA(a){return a.ob(BA())?BA():DA(~a.Aa,~a.pa).add(IA())}h.add=function(a){var b=this.pa>>>16,c=this.pa&65535,d=this.Aa>>>16,e=a.pa>>>16,f=a.pa&65535,g=a.Aa>>>16,l;l=0+((this.Aa&65535)+(a.Aa&65535));a=0+(l>>>16);a+=d+g;d=0+(a>>>16);d+=c+f;c=0+(d>>>16);c=c+(b+e)&65535;return DA((a&65535)<<16|l&65535,c<<16|d&65535)};
function SA(a,b){return a.add(EA(b))}
h.multiply=function(a){if(QA(this)||QA(a))return zA();if(this.ob(BA()))return 1==(a.Aa&1)?BA():zA();if(a.ob(BA()))return 1==(this.Aa&1)?BA():zA();if(0>this.pa)return 0>a.pa?EA(this).multiply(EA(a)):EA(EA(this).multiply(a));if(0>a.pa)return EA(this.multiply(EA(a)));var b=NA();if(b=0>this.compare(b))b=NA(),b=0>a.compare(b);if(b)return yA(PA(this)*PA(a));var b=this.pa>>>16,c=this.pa&65535,d=this.Aa>>>16,e=this.Aa&65535,f=a.pa>>>16,g=a.pa&65535,l=a.Aa>>>16;a=a.Aa&65535;var m,n,p,u;u=0+e*a;p=0+(u>>>16);
p+=d*a;n=0+(p>>>16);p=(p&65535)+e*l;n+=p>>>16;p&=65535;n+=c*a;m=0+(n>>>16);n=(n&65535)+d*l;m+=n>>>16;n&=65535;n+=e*g;m+=n>>>16;n&=65535;m=m+(b*a+c*l+d*g+e*f)&65535;return DA(p<<16|u&65535,m<<16|n)};
function RA(a,b){if(QA(b))throw Error("division by zero");if(QA(a))return zA();if(a.ob(BA())){if(b.ob(IA())||b.ob(KA()))return BA();if(b.ob(BA()))return IA();var c;c=1;if(0==c)c=a;else{var d=a.pa;c=32>c?DA(a.Aa>>>c|d<<32-c,d>>c):DA(d>>c-32,0<=d?0:-1)}c=RA(c,b).shiftLeft(1);if(c.ob(zA()))return 0>b.pa?IA():KA();d=SA(a,b.multiply(c));return c.add(RA(d,b))}if(b.ob(BA()))return zA();if(0>a.pa)return 0>b.pa?RA(EA(a),EA(b)):EA(RA(EA(a),b));if(0>b.pa)return EA(RA(a,EA(b)));for(var e=zA(),d=a;0<=d.compare(b);){c=
Math.max(1,Math.floor(PA(d)/PA(b)));for(var f=Math.ceil(Math.log(c)/Math.LN2),f=48>=f?1:Math.pow(2,f-48),g=yA(c),l=g.multiply(b);0>l.pa||0<l.compare(d);)c-=f,g=yA(c),l=g.multiply(b);QA(g)&&(g=IA());e=e.add(g);d=SA(d,l)}return e}h.shiftLeft=function(a){a&=63;if(0==a)return this;var b=this.Aa;return 32>a?DA(b<<a,this.pa<<a|b>>>32-a):DA(0,b<<a-32)};function TA(a,b){b&=63;if(0==b)return a;var c=a.pa;return 32>b?DA(a.Aa>>>b|c<<32-b,c>>>b):32==b?DA(c,0):DA(c>>>b-32,0)}var CA=1,MA=2,HA=3,JA=4,LA=5,OA=6;var UA="undefined"!=typeof Symbol?Symbol.iterator:"@@iterator";function VA(a,b){this.tag=a;this.ha=b;this.sa=-1}VA.prototype.toString=function(){return"[TaggedValue: "+this.tag+", "+this.ha+"]"};VA.prototype.equiv=function(a){return nA(this,a)};VA.prototype.equiv=VA.prototype.equiv;VA.prototype.Db=function(a){return a instanceof VA?this.tag===a.tag&&nA(this.ha,a.ha):!1};VA.prototype.Mb=function(){-1===this.sa&&(this.sa=oA(sA(this.tag),sA(this.ha)));return this.sa};
function WA(a,b){return new VA(a,b)}var XA=GA("9007199254740991"),YA=GA("-9007199254740991");uA.prototype.equiv=function(a){return nA(this,a)};uA.prototype.equiv=uA.prototype.equiv;uA.prototype.Db=function(a){return a instanceof uA&&this.ob(a)};uA.prototype.Mb=function(){return this.Aa};function ZA(a){this.Ba=a;this.sa=-1}ZA.prototype.toString=function(){return":"+this.Ba};ZA.prototype.namespace=function(){var a=this.Ba.indexOf("/");return-1!=a?this.Ba.substring(0,a):null};
ZA.prototype.name=function(){var a=this.Ba.indexOf("/");return-1!=a?this.Ba.substring(a+1,this.Ba.length):this.Ba};ZA.prototype.equiv=function(a){return nA(this,a)};ZA.prototype.equiv=ZA.prototype.equiv;ZA.prototype.Db=function(a){return a instanceof ZA&&this.Ba==a.Ba};ZA.prototype.Mb=function(){-1===this.sa&&(this.sa=sA(this.Ba));return this.sa};function $A(a){this.Ba=a;this.sa=-1}$A.prototype.namespace=function(){var a=this.Ba.indexOf("/");return-1!=a?this.Ba.substring(0,a):null};
$A.prototype.name=function(){var a=this.Ba.indexOf("/");return-1!=a?this.Ba.substring(a+1,this.Ba.length):this.Ba};$A.prototype.toString=function(){return this.Ba};$A.prototype.equiv=function(a){return nA(this,a)};$A.prototype.equiv=$A.prototype.equiv;$A.prototype.Db=function(a){return a instanceof $A&&this.Ba==a.Ba};$A.prototype.Mb=function(){-1===this.sa&&(this.sa=sA(this.Ba));return this.sa};
function aB(a,b,c){var d="";c=c||b+1;for(var e=8*(7-b),f=xA(255).shiftLeft(e);b<c;b++,e-=8,f=TA(f,8)){var g=TA(DA(a.Aa&f.Aa,a.pa&f.pa),e).toString(16);1==g.length&&(g="0"+g);d+=g}return d}function bB(a,b){this.pf=a;this.sf=b;this.sa=-1}bB.prototype.toString=function(){var a,b=this.pf,c=this.sf;a=""+(aB(b,0,4)+"-");a+=aB(b,4,6)+"-";a+=aB(b,6,8)+"-";a+=aB(c,0,2)+"-";return a+=aB(c,2,8)};bB.prototype.equiv=function(a){return nA(this,a)};bB.prototype.equiv=bB.prototype.equiv;
bB.prototype.Db=function(a){return a instanceof bB&&this.pf.ob(a.pf)&&this.sf.ob(a.sf)};bB.prototype.Mb=function(){-1===this.sa&&(this.sa=sA(this.toString()));return this.sa};Date.prototype.Db=function(a){return a instanceof Date?this.valueOf()===a.valueOf():!1};Date.prototype.Mb=function(){return this.valueOf()};function cB(a,b){this.entries=a;this.type=b||0;this.ua=0}
cB.prototype.next=function(){if(this.ua<this.entries.length){var a=null,a=0===this.type?this.entries[this.ua]:1===this.type?this.entries[this.ua+1]:[this.entries[this.ua],this.entries[this.ua+1]],a={value:a,done:!1};this.ua+=2;return a}return{value:null,done:!0}};cB.prototype.next=cB.prototype.next;cB.prototype[UA]=function(){return this};function dB(a,b){this.map=a;this.type=b||0;this.keys=this.map.Zb();this.ua=0;this.Jc=null;this.tc=0}
dB.prototype.next=function(){if(this.ua<this.map.size){null!=this.Jc&&this.tc<this.Jc.length||(this.Jc=this.map.map[this.keys[this.ua]],this.tc=0);var a=null,a=0===this.type?this.Jc[this.tc]:1===this.type?this.Jc[this.tc+1]:[this.Jc[this.tc],this.Jc[this.tc+1]],a={value:a,done:!1};this.ua++;this.tc+=2;return a}return{value:null,done:!0}};dB.prototype.next=dB.prototype.next;dB.prototype[UA]=function(){return this};
function eB(a,b){if(a instanceof fB&&(b instanceof gB||b instanceof fB)){if(a.size!==b.size)return!1;for(var c in a.map)for(var d=a.map[c],e=0;e<d.length;e+=2)if(!nA(d[e+1],b.get(d[e])))return!1;return!0}if(a instanceof gB&&(b instanceof gB||b instanceof fB)){if(a.size!==b.size)return!1;c=a.qa;for(e=0;e<c.length;e+=2)if(!nA(c[e+1],b.get(c[e])))return!1;return!0}if(null!=b&&"object"===typeof b&&(e=jA(b),c=e.length,a.size===c)){for(d=0;d<c;d++){var f=e[d];if(!a.has(f)||!nA(b[f],a.get(f)))return!1}return!0}return!1}
function hB(a){return null==a?"null":ga(a)?"["+a.toString()+"]":ia(a)?'"'+a+'"':a.toString()}function iB(a){var b=0,c="TransitMap {";a.forEach(function(d,e){c+=hB(e)+" \x3d\x3e "+hB(d);b<a.size-1&&(c+=", ");b++});return c+"}"}function jB(a){var b=0,c="TransitSet {";a.forEach(function(d){c+=hB(d);b<a.size-1&&(c+=", ");b++});return c+"}"}function gB(a){this.qa=a;this.na=null;this.sa=-1;this.size=a.length/2;this.Ef=0}gB.prototype.toString=function(){return iB(this)};gB.prototype.inspect=function(){return this.toString()};
function kB(a){if(a.na)throw Error("Invalid operation, already converted");if(8>a.size)return!1;a.Ef++;return 32<a.Ef?(a.na=lB(a.qa,!1,!0),a.qa=[],!0):!1}gB.prototype.clear=function(){this.sa=-1;this.na?this.na.clear():this.qa=[];this.size=0};gB.prototype.clear=gB.prototype.clear;gB.prototype.keys=function(){return this.na?this.na.keys():new cB(this.qa,0)};gB.prototype.keys=gB.prototype.keys;
gB.prototype.Uc=function(){if(this.na)return this.na.Uc();for(var a=[],b=0,c=0;c<this.qa.length;b++,c+=2)a[b]=this.qa[c];return a};gB.prototype.keySet=gB.prototype.Uc;gB.prototype.entries=function(){return this.na?this.na.entries():new cB(this.qa,2)};gB.prototype.entries=gB.prototype.entries;gB.prototype.values=function(){return this.na?this.na.values():new cB(this.qa,1)};gB.prototype.values=gB.prototype.values;
gB.prototype.forEach=function(a){if(this.na)this.na.forEach(a);else for(var b=0;b<this.qa.length;b+=2)a(this.qa[b+1],this.qa[b])};gB.prototype.forEach=gB.prototype.forEach;gB.prototype.get=function(a,b){if(this.na)return this.na.get(a);if(kB(this))return this.get(a);for(var c=0;c<this.qa.length;c+=2)if(nA(this.qa[c],a))return this.qa[c+1];return b};gB.prototype.get=gB.prototype.get;
gB.prototype.has=function(a){if(this.na)return this.na.has(a);if(kB(this))return this.has(a);for(var b=0;b<this.qa.length;b+=2)if(nA(this.qa[b],a))return!0;return!1};gB.prototype.has=gB.prototype.has;gB.prototype.set=function(a,b){this.sa=-1;if(this.na)this.na.set(a,b),this.size=this.na.size;else{for(var c=0;c<this.qa.length;c+=2)if(nA(this.qa[c],a)){this.qa[c+1]=b;return}this.qa.push(a);this.qa.push(b);this.size++;32<this.size&&(this.na=lB(this.qa,!1,!0),this.qa=null)}};gB.prototype.set=gB.prototype.set;
gB.prototype["delete"]=function(a){this.sa=-1;if(this.na)return a=this.na["delete"](a),this.size=this.na.size,a;for(var b=0;b<this.qa.length;b+=2)if(nA(this.qa[b],a))return a=this.qa[b+1],this.qa.splice(b,2),this.size--,a};gB.prototype.clone=function(){var a=lB();this.forEach(function(b,c){a.set(c,b)});return a};gB.prototype.clone=gB.prototype.clone;gB.prototype[UA]=function(){return this.entries()};gB.prototype.Mb=function(){if(this.na)return this.na.Mb();-1===this.sa&&(this.sa=rA(this));return this.sa};
gB.prototype.Db=function(a){return this.na?eB(this.na,a):eB(this,a)};function fB(a,b,c){this.map=b||{};this.bd=a||[];this.size=c||0;this.sa=-1}fB.prototype.toString=function(){return iB(this)};fB.prototype.inspect=function(){return this.toString()};fB.prototype.clear=function(){this.sa=-1;this.map={};this.bd=[];this.size=0};fB.prototype.clear=fB.prototype.clear;fB.prototype.Zb=function(){return null!=this.bd?this.bd:jA(this.map)};
fB.prototype["delete"]=function(a){this.sa=-1;this.bd=null;for(var b=sA(a),c=this.map[b],d=0;d<c.length;d+=2)if(nA(a,c[d]))return a=c[d+1],c.splice(d,2),0===c.length&&delete this.map[b],this.size--,a};fB.prototype.entries=function(){return new dB(this,2)};fB.prototype.entries=fB.prototype.entries;fB.prototype.forEach=function(a){for(var b=this.Zb(),c=0;c<b.length;c++)for(var d=this.map[b[c]],e=0;e<d.length;e+=2)a(d[e+1],d[e],this)};fB.prototype.forEach=fB.prototype.forEach;
fB.prototype.get=function(a,b){var c=sA(a),c=this.map[c];if(null!=c)for(var d=0;d<c.length;d+=2){if(nA(a,c[d]))return c[d+1]}else return b};fB.prototype.get=fB.prototype.get;fB.prototype.has=function(a){var b=sA(a),b=this.map[b];if(null!=b)for(var c=0;c<b.length;c+=2)if(nA(a,b[c]))return!0;return!1};fB.prototype.has=fB.prototype.has;fB.prototype.keys=function(){return new dB(this,0)};fB.prototype.keys=fB.prototype.keys;
fB.prototype.Uc=function(){for(var a=this.Zb(),b=[],c=0;c<a.length;c++)for(var d=this.map[a[c]],e=0;e<d.length;e+=2)b.push(d[e]);return b};fB.prototype.keySet=fB.prototype.Uc;fB.prototype.set=function(a,b){this.sa=-1;var c=sA(a),d=this.map[c];if(null==d)this.bd&&this.bd.push(c),this.map[c]=[a,b],this.size++;else{for(var c=!0,e=0;e<d.length;e+=2)if(nA(b,d[e])){c=!1;d[e]=b;break}c&&(d.push(a),d.push(b),this.size++)}};fB.prototype.set=fB.prototype.set;
fB.prototype.values=function(){return new dB(this,1)};fB.prototype.values=fB.prototype.values;fB.prototype.clone=function(){var a=lB();this.forEach(function(b,c){a.set(c,b)});return a};fB.prototype.clone=fB.prototype.clone;fB.prototype[UA]=function(){return this.entries()};fB.prototype.Mb=function(){-1===this.sa&&(this.sa=rA(this));return this.sa};fB.prototype.Db=function(a){return eB(this,a)};
function lB(a,b,c){a=a||[];b=!1===b?b:!0;if((!0!==c||!c)&&64>=a.length){if(b){var d=a;a=[];for(b=0;b<d.length;b+=2){var e=!1;for(c=0;c<a.length;c+=2)if(nA(a[c],d[b])){a[c+1]=d[b+1];e=!0;break}e||(a.push(d[b]),a.push(d[b+1]))}}return new gB(a)}var d={},e=[],f=0;for(b=0;b<a.length;b+=2){c=sA(a[b]);var g=d[c];if(null==g)e.push(c),d[c]=[a[b],a[b+1]],f++;else{var l=!0;for(c=0;c<g.length;c+=2)if(nA(g[c],a[b])){g[c+1]=a[b+1];l=!1;break}l&&(g.push(a[b]),g.push(a[b+1]),f++)}}return new fB(e,d,f)}
function mB(a){this.map=a;this.size=a.size}mB.prototype.toString=function(){return jB(this)};mB.prototype.inspect=function(){return this.toString()};mB.prototype.add=function(a){this.map.set(a,a);this.size=this.map.size};mB.prototype.add=mB.prototype.add;mB.prototype.clear=function(){this.map=new fB;this.size=0};mB.prototype.clear=mB.prototype.clear;mB.prototype["delete"]=function(a){a=this.map["delete"](a);this.size=this.map.size;return a};mB.prototype.entries=function(){return this.map.entries()};
mB.prototype.entries=mB.prototype.entries;mB.prototype.forEach=function(a){var b=this;this.map.forEach(function(c,d){a(d,b)})};mB.prototype.forEach=mB.prototype.forEach;mB.prototype.has=function(a){return this.map.has(a)};mB.prototype.has=mB.prototype.has;mB.prototype.keys=function(){return this.map.keys()};mB.prototype.keys=mB.prototype.keys;mB.prototype.Uc=function(){return this.map.Uc()};mB.prototype.keySet=mB.prototype.Uc;mB.prototype.values=function(){return this.map.values()};
mB.prototype.values=mB.prototype.values;mB.prototype.clone=function(){var a=nB();this.forEach(function(b){a.add(b)});return a};mB.prototype.clone=mB.prototype.clone;mB.prototype[UA]=function(){return this.values()};mB.prototype.Db=function(a){if(a instanceof mB){if(this.size===a.size)return nA(this.map,a.map)}else return!1};mB.prototype.Mb=function(){return sA(this.map)};
function nB(a){a=a||[];for(var b={},c=[],d=0,e=0;e<a.length;e++){var f=sA(a[e]),g=b[f];if(null==g)c.push(f),b[f]=[a[e],a[e]],d++;else{for(var f=!0,l=0;l<g.length;l+=2)if(nA(g[l],a[e])){f=!1;break}f&&(g.push(a[e]),g.push(a[e]),d++)}}return new mB(new fB(c,b,d))};function oB(a,b){if(3<a.length){if(b)return!0;var c=a.charAt(1);return"~"===a.charAt(0)?":"===c||"$"===c||"#"===c:!1}return!1}function pB(a){var b=Math.floor(a/44);a=String.fromCharCode(a%44+48);return 0===b?"^"+a:"^"+String.fromCharCode(b+48)+a}function qB(){this.vg=this.Td=this.ua=0;this.cache={}}
qB.prototype.write=function(a,b){if(oB(a,b)){4096===this.vg?(this.clear(),this.Td=0,this.cache={}):1936===this.ua&&this.clear();var c=this.cache[a];return null==c?(this.cache[a]=[pB(this.ua),this.Td],this.ua++,a):c[1]!=this.Td?(c[1]=this.Td,c[0]=pB(this.ua),this.ua++,a):c[0]}return a};qB.prototype.clear=function(){this.ua=0;this.Td++};function rB(){this.ua=0;this.cache=[]}rB.prototype.write=function(a){1936==this.ua&&(this.ua=0);this.cache[this.ua]=a;this.ua++;return a};
rB.prototype.read=function(a){return this.cache[2===a.length?a.charCodeAt(1)-48:44*(a.charCodeAt(1)-48)+(a.charCodeAt(2)-48)]};rB.prototype.clear=function(){this.ua=0};function sB(a){this.mb=a}
function tB(a){this.options=a||{};this.Xa={};for(var b in this.Rd.Xa)this.Xa[b]=this.Rd.Xa[b];for(b in this.options.handlers){a:{switch(b){case "_":case "s":case "?":case "i":case "d":case "b":case "'":case "array":case "map":a=!0;break a}a=!1}if(a)throw Error('Cannot override handler for ground type "'+b+'"');this.Xa[b]=this.options.handlers[b]}this.Ke=null!=this.options.preferStrings?this.options.preferStrings:this.Rd.Ke;this.vf=null!=this.options.preferBuffers?this.options.preferBuffers:this.Rd.vf;
this.jf=this.options.defaultHandler||this.Rd.jf;this.Gb=this.options.mapBuilder;this.cd=this.options.arrayBuilder}
tB.prototype.Rd={Xa:{_:function(){return null},"?":function(a){return"t"===a},b:function(a,b){var c;if(b&&!1===b.vf||"undefined"==typeof Buffer)if("undefined"!=typeof Uint8Array){if("undefined"!=typeof atob)c=atob(a);else{c=String(a).replace(/=+$/,"");if(1==c.length%4)throw Error("'atob' failed: The string to be decoded is not correctly encoded.");for(var d=0,e,f,g=0,l="";f=c.charAt(g++);~f&&(e=d%4?64*e+f:f,d++%4)?l+=String.fromCharCode(255&e>>(-2*d&6)):0)f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(f);
c=l}d=c.length;e=new Uint8Array(d);for(f=0;f<d;f++)e[f]=c.charCodeAt(f);c=e}else c=WA("b",a);else c=new Buffer(a,"base64");return c},i:function(a){"number"===typeof a||a instanceof uA||(a=GA(a,10),a=0<a.compare(XA)||0>a.compare(YA)?a:PA(a));return a},n:function(a){return WA("n",a)},d:function(a){return parseFloat(a)},f:function(a){return WA("f",a)},c:function(a){return a},":":function(a){return new ZA(a)},$:function(a){return new $A(a)},r:function(a){return WA("r",a)},z:function(a){a:switch(a){case "-INF":a=
-Infinity;break a;case "INF":a=Infinity;break a;case "NaN":a=NaN;break a;default:throw Error("Invalid special double value "+a);}return a},"'":function(a){return a},m:function(a){a="number"===typeof a?a:parseInt(a,10);return new Date(a)},t:function(a){return new Date(a)},u:function(a){a=a.replace(/-/g,"");for(var b=null,c=null,d=c=0,e=24,f=0,f=c=0,e=24;8>f;f+=2,e-=8)c|=parseInt(a.substring(f,f+2),16)<<e;d=0;f=8;for(e=24;16>f;f+=2,e-=8)d|=parseInt(a.substring(f,f+2),16)<<e;b=DA(d,c);c=0;f=16;for(e=
24;24>f;f+=2,e-=8)c|=parseInt(a.substring(f,f+2),16)<<e;d=0;for(e=f=24;32>f;f+=2,e-=8)d|=parseInt(a.substring(f,f+2),16)<<e;c=DA(d,c);return new bB(b,c)},set:function(a){return nB(a)},list:function(a){return WA("list",a)},link:function(a){return WA("link",a)},cmap:function(a){return lB(a,!1)}},jf:function(a,b){return WA(a,b)},Ke:!0,vf:!0};
tB.prototype.decode=function(a,b,c,d){if(null==a)return null;switch(typeof a){case "string":return oB(a,c)?(a=uB(this,a),b&&b.write(a,c),b=a):b="^"===a.charAt(0)&&" "!==a.charAt(1)?b.read(a,c):uB(this,a),b;case "object":if(kA(a))if("^ "===a[0])if(this.Gb)if(17>a.length&&this.Gb.Qc){d=[];for(c=1;c<a.length;c+=2)d.push(this.decode(a[c],b,!0,!1)),d.push(this.decode(a[c+1],b,!1,!1));b=this.Gb.Qc(d,a)}else{d=this.Gb.init(a);for(c=1;c<a.length;c+=2)d=this.Gb.add(d,this.decode(a[c],b,!0,!1),this.decode(a[c+
1],b,!1,!1),a);b=this.Gb.Fe(d,a)}else{d=[];for(c=1;c<a.length;c+=2)d.push(this.decode(a[c],b,!0,!1)),d.push(this.decode(a[c+1],b,!1,!1));b=lB(d,!1)}else b=vB(this,a,b,c,d);else{c=jA(a);var e=c[0];if((d=1==c.length?this.decode(e,b,!1,!1):null)&&d instanceof sB)a=a[e],c=this.Xa[d.mb],b=null!=c?c(this.decode(a,b,!1,!0),this):WA(d.mb,this.decode(a,b,!1,!1));else if(this.Gb)if(16>c.length&&this.Gb.Qc){var f=[];for(d=0;d<c.length;d++)e=c[d],f.push(this.decode(e,b,!0,!1)),f.push(this.decode(a[e],b,!1,!1));
b=this.Gb.Qc(f,a)}else{f=this.Gb.init(a);for(d=0;d<c.length;d++)e=c[d],f=this.Gb.add(f,this.decode(e,b,!0,!1),this.decode(a[e],b,!1,!1),a);b=this.Gb.Fe(f,a)}else{f=[];for(d=0;d<c.length;d++)e=c[d],f.push(this.decode(e,b,!0,!1)),f.push(this.decode(a[e],b,!1,!1));b=lB(f,!1)}}return b}return a};tB.prototype.decode=tB.prototype.decode;
function vB(a,b,c,d,e){if(e){var f=[];for(e=0;e<b.length;e++)f.push(a.decode(b[e],c,d,!1));return f}f=c&&c.ua;if(2===b.length&&"string"===typeof b[0]&&(e=a.decode(b[0],c,!1,!1))&&e instanceof sB)return b=b[1],f=a.Xa[e.mb],null!=f?f=f(a.decode(b,c,d,!0),a):WA(e.mb,a.decode(b,c,d,!1));c&&f!=c.ua&&(c.ua=f);if(a.cd){if(32>=b.length&&a.cd.Qc){f=[];for(e=0;e<b.length;e++)f.push(a.decode(b[e],c,d,!1));return a.cd.Qc(f,b)}f=a.cd.init(b);for(e=0;e<b.length;e++)f=a.cd.add(f,a.decode(b[e],c,d,!1),b);return a.cd.Fe(f,
b)}f=[];for(e=0;e<b.length;e++)f.push(a.decode(b[e],c,d,!1));return f}function uB(a,b){if("~"===b.charAt(0)){var c=b.charAt(1);if("~"===c||"^"===c||"`"===c)return b.substring(1);if("#"===c)return new sB(b.substring(2));var d=a.Xa[c];return null==d?a.jf(c,b.substring(2)):d(b.substring(2),a)}return b};function wB(a){this.Ig=new tB(a)}function xB(a,b){this.eh=a;this.options=b||{};this.cache=this.options.cache?this.options.cache:new rB}xB.prototype.read=function(a){var b=this.cache;a=this.eh.Ig.decode(JSON.parse(a),b);this.cache.clear();return a};xB.prototype.read=xB.prototype.read;var yB=0,zB=(8|3&Math.round(14*Math.random())).toString(16),AB="transit$guid$"+(lA()+lA()+lA()+lA()+lA()+lA()+lA()+lA()+"-"+lA()+lA()+lA()+lA()+"-4"+lA()+lA()+lA()+"-"+zB+lA()+lA()+lA()+"-"+lA()+lA()+lA()+lA()+lA()+lA()+lA()+lA()+lA()+lA()+lA()+lA());
function BB(a){if(null==a)return"null";if(a===String)return"string";if(a===Boolean)return"boolean";if(a===Number)return"number";if(a===Array)return"array";if(a===Object)return"map";var b=a[AB];null==b&&("undefined"!=typeof Object.defineProperty?(b=++yB,Object.defineProperty(a,AB,{value:b,enumerable:!1})):a[AB]=b=++yB);return b}function CB(a,b){for(var c=a.toString(),d=c.length;d<b;d++)c="0"+c;return c}function DB(){}DB.prototype.tag=function(){return"_"};DB.prototype.ha=function(){return null};
DB.prototype.ya=function(){return"null"};function EB(){}EB.prototype.tag=function(){return"s"};EB.prototype.ha=function(a){return a};EB.prototype.ya=function(a){return a};function FB(){}FB.prototype.tag=function(){return"i"};FB.prototype.ha=function(a){return a};FB.prototype.ya=function(a){return a.toString()};function GB(){}GB.prototype.tag=function(){return"i"};GB.prototype.ha=function(a){return a.toString()};GB.prototype.ya=function(a){return a.toString()};function HB(){}HB.prototype.tag=function(){return"?"};
HB.prototype.ha=function(a){return a};HB.prototype.ya=function(a){return a.toString()};function IB(){}IB.prototype.tag=function(){return"array"};IB.prototype.ha=function(a){return a};IB.prototype.ya=function(){return null};function JB(){}JB.prototype.tag=function(){return"map"};JB.prototype.ha=function(a){return a};JB.prototype.ya=function(){return null};function KB(){}KB.prototype.tag=function(){return"t"};
KB.prototype.ha=function(a){return a.getUTCFullYear()+"-"+CB(a.getUTCMonth()+1,2)+"-"+CB(a.getUTCDate(),2)+"T"+CB(a.getUTCHours(),2)+":"+CB(a.getUTCMinutes(),2)+":"+CB(a.getUTCSeconds(),2)+"."+CB(a.getUTCMilliseconds(),3)+"Z"};KB.prototype.ya=function(a,b){return b.ha(a)};function LB(){}LB.prototype.tag=function(){return"m"};LB.prototype.ha=function(a){return a.valueOf()};LB.prototype.ya=function(a){return a.valueOf().toString()};function MB(){}MB.prototype.tag=function(){return"u"};
MB.prototype.ha=function(a){return a.toString()};MB.prototype.ya=function(a){return a.toString()};function NB(){}NB.prototype.tag=function(){return":"};NB.prototype.ha=function(a){return a.Ba};NB.prototype.ya=function(a,b){return b.ha(a)};function OB(){}OB.prototype.tag=function(){return"$"};OB.prototype.ha=function(a){return a.Ba};OB.prototype.ya=function(a,b){return b.ha(a)};function PB(){}PB.prototype.tag=function(a){return a.tag};PB.prototype.ha=function(a){return a.ha};PB.prototype.ya=function(){return null};
function QB(){}QB.prototype.tag=function(){return"set"};QB.prototype.ha=function(a){var b=[];a.forEach(function(a){b.push(a)});return WA("array",b)};QB.prototype.ya=function(){return null};function RB(){}RB.prototype.tag=function(){return"map"};RB.prototype.ha=function(a){return a};RB.prototype.ya=function(){return null};function SB(){}SB.prototype.tag=function(){return"map"};SB.prototype.ha=function(a){return a};SB.prototype.ya=function(){return null};function TB(){}TB.prototype.tag=function(){return"b"};
TB.prototype.ha=function(a){return a.toString("base64")};TB.prototype.ya=function(){return null};function UB(){}UB.prototype.tag=function(){return"b"};
UB.prototype.ha=function(a){for(var b=0,c=a.length,d="",e=null;b<c;)e=a.subarray(b,Math.min(b+32768,c)),d+=String.fromCharCode.apply(null,e),b+=32768;var f;if("undefined"!=typeof btoa)f=btoa(d);else{a=String(d);c=0;d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d";for(e="";a.charAt(c|0)||(d="\x3d",c%1);e+=d.charAt(63&f>>8-c%1*8)){b=a.charCodeAt(c+=.75);if(255<b)throw Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");f=f<<8|b}f=
e}return f};UB.prototype.ya=function(){return null};
function VB(){this.Xa={};this.set(null,new DB);this.set(String,new EB);this.set(Number,new FB);this.set(uA,new GB);this.set(Boolean,new HB);this.set(Array,new IB);this.set(Object,new JB);this.set(Date,new LB);this.set(bB,new MB);this.set(ZA,new NB);this.set($A,new OB);this.set(VA,new PB);this.set(mB,new QB);this.set(gB,new RB);this.set(fB,new SB);"undefined"!=typeof Buffer&&this.set(Buffer,new TB);"undefined"!=typeof Uint8Array&&this.set(Uint8Array,new UB)}
VB.prototype.get=function(a){var b=null,b="string"===typeof a?this.Xa[a]:this.Xa[BB(a)];return null!=b?b:this.Xa["default"]};VB.prototype.get=VB.prototype.get;VB.prototype.set=function(a,b){var c;if(c="string"===typeof a)a:{switch(a){case "null":case "string":case "boolean":case "number":case "array":case "map":c=!1;break a}c=!0}c?this.Xa[a]=b:this.Xa[BB(a)]=b};function WB(a){this.Gc=a||{};this.Ke=null!=this.Gc.preferStrings?this.Gc.preferStrings:!0;this.eg=this.Gc.objectBuilder||null;this.Xa=new VB;if(a=this.Gc.handlers){if(kA(a)||!a.forEach)throw Error('transit writer "handlers" option must be a map');var b=this;a.forEach(function(a,d){if(void 0!==d)b.Xa.set(d,a);else throw Error("Cannot create handler for JavaScript undefined");})}this.Wd=this.Gc.handlerForForeign;this.Pe=this.Gc.unpack||function(a){return a instanceof gB&&null===a.na?a.qa:!1};this.je=
this.Gc&&this.Gc.verbose||!1}WB.prototype.ub=function(a){var b=this.Xa.get(null==a?null:a.constructor);return null!=b?b:(a=a&&a.transitTag)?this.Xa.get(a):null};function XB(a,b,c,d,e){a=a+b+c;return e?e.write(a,d):a}function YB(a,b,c){var d=[];if(kA(b))for(var e=0;e<b.length;e++)d.push(ZB(a,b[e],!1,c));else b.forEach(function(b){d.push(ZB(a,b,!1,c))});return d}function $B(a,b){if("string"!==typeof b){var c=a.ub(b);return c&&1===c.tag(b).length}return!0}
function aC(a,b){var c=a.Pe(b),d=!0;if(c){for(var e=0;e<c.length&&(d=$B(a,c[e]),d);e+=2);return d}if(b.keys&&(c=b.keys(),e=null,c.next)){for(e=c.next();!e.done;){d=$B(a,e.value);if(!d)break;e=c.next()}return d}if(b.forEach)return b.forEach(function(b,c){d=d&&$B(a,c)}),d;throw Error("Cannot walk keys of object type "+(null==b?null:b.constructor).name);}
function bC(a){if(a.constructor.transit$isObject)return!0;var b=a.constructor.toString(),b=b.substr(9),b=b.substr(0,b.indexOf("("));isObject="Object"==b;"undefined"!=typeof Object.defineProperty?Object.defineProperty(a.constructor,"transit$isObject",{value:isObject,enumerable:!1}):a.constructor.transit$isObject=isObject;return isObject}
function cC(a,b,c){var d=null,e=null,f=null,d=null,g=0;if(b.constructor===Object||null!=b.forEach||a.Wd&&bC(b)){if(a.je){if(null!=b.forEach)if(aC(a,b)){var l={};b.forEach(function(b,d){l[ZB(a,d,!0,!1)]=ZB(a,b,!1,c)})}else{d=a.Pe(b);e=[];f=XB("~#","cmap","",!0,c);if(d)for(;g<d.length;g+=2)e.push(ZB(a,d[g],!1,!1)),e.push(ZB(a,d[g+1],!1,c));else b.forEach(function(b,d){e.push(ZB(a,d,!1,!1));e.push(ZB(a,b,!1,c))});l={};l[f]=e}else for(d=jA(b),l={};g<d.length;g++)l[ZB(a,d[g],!0,!1)]=ZB(a,b[d[g]],!1,c);
return l}if(null!=b.forEach){if(aC(a,b)){d=a.Pe(b);l=["^ "];if(d)for(;g<d.length;g+=2)l.push(ZB(a,d[g],!0,c)),l.push(ZB(a,d[g+1],!1,c));else b.forEach(function(b,d){l.push(ZB(a,d,!0,c));l.push(ZB(a,b,!1,c))});return l}d=a.Pe(b);e=[];f=XB("~#","cmap","",!0,c);if(d)for(;g<d.length;g+=2)e.push(ZB(a,d[g],!1,c)),e.push(ZB(a,d[g+1],!1,c));else b.forEach(function(b,d){e.push(ZB(a,d,!1,c));e.push(ZB(a,b,!1,c))});return[f,e]}l=["^ "];for(d=jA(b);g<d.length;g++)l.push(ZB(a,d[g],!0,c)),l.push(ZB(a,b[d[g]],!1,
c));return l}if(null!=a.eg)return a.eg(b,function(b){return ZB(a,b,!0,c)},function(b){return ZB(a,b,!1,c)});g=(null==b?null:b.constructor).name;d=Error("Cannot write "+g);d.data={tf:b,type:g};throw d;}
function ZB(a,b,c,d){var e=a.ub(b)||(a.Wd?a.Wd(b,a.Xa):null),f=e?e.tag(b):null,g=e?e.ha(b):null;if(null!=e&&null!=f)switch(f){case "_":return c?XB("~","_","",c,d):null;case "s":return 0<g.length?(a=g.charAt(0),a="~"===a||"^"===a||"`"===a?"~"+g:g):a=g,XB("","",a,c,d);case "?":return c?XB("~","?",g.toString()[0],c,d):g;case "i":return Infinity===g?XB("~","z","INF",c,d):-Infinity===g?XB("~","z","-INF",c,d):isNaN(g)?XB("~","z","NaN",c,d):c||"string"===typeof g||g instanceof uA?XB("~","i",g.toString(),
c,d):g;case "d":return c?XB(g.fh,"d",g,c,d):g;case "b":return XB("~","b",g,c,d);case "'":return a.je?(b={},c=XB("~#","'","",!0,d),b[c]=ZB(a,g,!1,d),d=b):d=[XB("~#","'","",!0,d),ZB(a,g,!1,d)],d;case "array":return YB(a,g,d);case "map":return cC(a,g,d);default:a:{if(1===f.length){if("string"===typeof g){d=XB("~",f,g,c,d);break a}if(c||a.Ke){(a=a.je&&new KB)?(f=a.tag(b),g=a.ya(b,a)):g=e.ya(b,e);if(null!==g){d=XB("~",f,g,c,d);break a}d=Error('Tag "'+f+'" cannot be encoded as string');d.data={tag:f,ha:g,
tf:b};throw d;}}b=f;c=g;a.je?(g={},g[XB("~#",b,"",!0,d)]=ZB(a,c,!1,d),d=g):d=[XB("~#",b,"",!0,d),ZB(a,c,!1,d)]}return d}else throw d=(null==b?null:b.constructor).name,a=Error("Cannot write "+d),a.data={tf:b,type:d},a;}function dC(a,b){var c=a.ub(b)||(a.Wd?a.Wd(b,a.Xa):null);if(null!=c)return 1===c.tag(b).length?WA("'",b):b;var c=(null==b?null:b.constructor).name,d=Error("Cannot write "+c);d.data={tf:b,type:c};throw d;}
function eC(a,b){this.yd=a;this.options=b||{};this.cache=!1===this.options.cache?null:this.options.cache?this.options.cache:new qB}eC.prototype.Pg=function(){return this.yd};eC.prototype.marshaller=eC.prototype.Pg;eC.prototype.write=function(a,b){var c=null,d=b||{},c=d.asMapKey||!1,e=this.yd.je?!1:this.cache;!1===d.marshalTop?c=ZB(this.yd,a,c,e):(d=this.yd,c=JSON.stringify(ZB(d,dC(d,a),c,e)));null!=this.cache&&this.cache.clear();return c};eC.prototype.write=eC.prototype.write;
eC.prototype.register=function(a,b){this.yd.Xa.set(a,b)};eC.prototype.register=eC.prototype.register;function fC(a,b){if("json"===a||"json-verbose"===a||null==a){var c=new wB(b);return new xB(c,b)}throw Error("Cannot create reader of type "+a);}function gC(a,b){if("json"===a||"json-verbose"===a||null==a){"json-verbose"===a&&(null==b&&(b={}),b.verbose=!0);var c=new WB(b);return new eC(c,b)}c=Error('Type must be "json"');c.data={type:a};throw c;};Sj.prototype.K=function(a,b){return b instanceof Sj?this.Wb===b.Wb:b instanceof bB?this.Wb===b.toString():!1};Sj.prototype.Kc=!0;Sj.prototype.gc=function(a,b){if(b instanceof Sj||b instanceof bB)return Me(this.toString(),b.toString());throw Error([t("Cannot compare "),t(this),t(" to "),t(b)].join(""));};bB.prototype.Kc=!0;bB.prototype.gc=function(a,b){if(b instanceof Sj||b instanceof bB)return Me(this.toString(),b.toString());throw Error([t("Cannot compare "),t(this),t(" to "),t(b)].join(""));};
uA.prototype.K=function(a,b){return this.equiv(b)};bB.prototype.K=function(a,b){return b instanceof Sj?Kc(b,this):this.equiv(b)};VA.prototype.K=function(a,b){return this.equiv(b)};uA.prototype.df=!0;uA.prototype.S=function(){return sA.g?sA.g(this):sA.call(null,this)};bB.prototype.df=!0;bB.prototype.S=function(){return zd(this.toString())};VA.prototype.df=!0;VA.prototype.S=function(){return sA.g?sA.g(this):sA.call(null,this)};bB.prototype.ka=!0;
bB.prototype.U=function(a,b){return Uc(b,[t('#uuid "'),t(this.toString()),t('"')].join(""))};function hC(a,b){for(var c=B(Fe(b)),d=null,e=0,f=0;;)if(f<e){var g=d.N(null,f);a[g]=b[g];f+=1}else if(c=B(c))d=c,Ee(d)?(c=gd(d),f=hd(d),d=c,e=M(c),c=f):(c=D(d),a[c]=b[c],c=F(d),d=null,e=0),f=0;else break;return a}function iC(){}iC.prototype.init=function(){return Zc(Uf)};iC.prototype.add=function(a,b,c){return bd(a,b,c)};iC.prototype.Fe=function(a){return ad(a)};
iC.prototype.Qc=function(a){return Oh.h?Oh.h(a,!0,!0):Oh.call(null,a,!0,!0)};function jC(){}jC.prototype.init=function(){return Zc(me)};jC.prototype.add=function(a,b){return Hf.a(a,b)};jC.prototype.Fe=function(a){return ad(a)};jC.prototype.Qc=function(a){return bh.a?bh.a(a,!0):bh.call(null,a,!0)};
function kC(a){var b=sf(us);a=hC({handlers:xj(Ki.o(N([new q(null,5,["$",function(){return function(a){return Dd.g(a)}}(b),":",function(){return function(a){return rf.g(a)}}(b),"set",function(){return function(a){return Bg.a(Qi,a)}}(b),"list",function(){return function(a){return Bg.a(Fd,a.reverse())}}(b),"cmap",function(){return function(a){for(var b=0,e=Zc(Uf);;)if(b<a.length)var f=b+2,e=bd(e,a[b],a[b+1]),b=f;else return ad(e)}}(b)],null),bo.g(a)],0))),mapBuilder:new iC,arrayBuilder:new jC,prefersStrings:!1},
xj(qe.a(a,bo)));return fC.a?fC.a(b,a):fC.call(null,b,a)}function lC(){}lC.prototype.tag=function(){return":"};lC.prototype.ha=function(a){return a.Va};lC.prototype.ya=function(a){return a.Va};function mC(){}mC.prototype.tag=function(){return"$"};mC.prototype.ha=function(a){return a.mb};mC.prototype.ya=function(a){return a.mb};function nC(){}nC.prototype.tag=function(){return"list"};
nC.prototype.ha=function(a){var b=[];a=B(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e);b.push(f);e+=1}else if(a=B(a))c=a,Ee(c)?(a=gd(c),e=hd(c),c=a,d=M(a),a=e):(a=D(c),b.push(a),a=F(c),c=null,d=0),e=0;else break;return WA.a?WA.a("array",b):WA.call(null,"array",b)};nC.prototype.ya=function(){return null};function oC(){}oC.prototype.tag=function(){return"map"};oC.prototype.ha=function(a){return a};oC.prototype.ya=function(){return null};function pC(){}pC.prototype.tag=function(){return"set"};
pC.prototype.ha=function(a){var b=[];a=B(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e);b.push(f);e+=1}else if(a=B(a))c=a,Ee(c)?(a=gd(c),e=hd(c),c=a,d=M(a),a=e):(a=D(c),b.push(a),a=F(c),c=null,d=0),e=0;else break;return WA.a?WA.a("array",b):WA.call(null,"array",b)};pC.prototype.ya=function(){return null};function qC(){}qC.prototype.tag=function(){return"array"};
qC.prototype.ha=function(a){var b=[];a=B(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e);b.push(f);e+=1}else if(a=B(a))c=a,Ee(c)?(a=gd(c),e=hd(c),c=a,d=M(a),a=e):(a=D(c),b.push(a),a=F(c),c=null,d=0),e=0;else break;return b};qC.prototype.ya=function(){return null};function rC(){}rC.prototype.tag=function(){return"u"};rC.prototype.ha=function(a){return a.Wb};rC.prototype.ya=function(a){return this.ha(a)};
function sC(a,b){var c=new lC,d=new mC,e=new nC,f=new oC,g=new pC,l=new qC,m=new rC,n=Ki.o(N([pe([pi,of,q,ki,oh,C,P,lf,tf,ih,nh,mi,Ji,Hh,T,jf,be,Oi,Fi,Ii,eh,Si,Af,y,Sj,Xi,ti],[f,e,f,e,e,e,c,e,e,l,e,e,e,e,l,e,e,g,f,e,e,g,e,d,m,e,e]),bo.g(b)],0)),p=sf(a),u=hC({objectBuilder:function(a,b,c,d,e,f,g,l,m){return function(n,p,u){return Ve(function(){return function(a,b,c){a.push(p.g?p.g(b):p.call(null,b),u.g?u.g(c):u.call(null,c));return a}}(a,b,c,d,e,f,g,l,m),["^ "],n)}}(p,c,d,e,f,g,l,m,n),handlers:function(){var a=
ac(n);a.forEach=function(){return function(a){for(var b=B(this),c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e),g=O(f,0,null),f=O(f,1,null);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=B(b))Ee(b)?(c=gd(b),b=hd(b),g=c,d=M(c),c=g):(c=D(b),g=O(c,0,null),f=O(c,1,null),a.a?a.a(f,g):a.call(null,f,g),b=F(b),c=null,d=0),e=0;else return null}}(a,p,c,d,e,f,g,l,m,n);return a}(),unpack:function(){return function(a){return a instanceof q?a.j:!1}}(p,c,d,e,f,g,l,m,n)},xj(qe.a(b,bo)));return gC.a?gC.a(p,u):gC.call(null,
p,u)};h=Mz.prototype;h.Te=function(a,b,c){a=null!=b&&(b.l&64||b.M)?S(fg,b):b;var d=A.a(a,ns),e=A.a(a,nm),f=A.a(a,Ps),g=A.a(a,Ko),l=A.h(a,ws,0),m=A.h(a,ut,!1);Py(this,"complete",function(){return function(a){a=a.target;return c.g?c.g(a):c.call(null,a)}}(this,"complete",this,this,b,a,d,e,f,g,l,m));this.wd=Math.max(0,l);this.pg=m;this.send(d,e,f,xj(g));return this};h.Ue=function(){var a;try{a=this.fa?this.fa.responseText:""}catch(b){Ez(this.vb,"Can not get responseText: "+b.message),a=""}return a};h.We=function(){return Zz(this)};
h.Xe=function(){return $z(this)};h.Ve=function(a,b){return this.getResponseHeader(b)};h.Ye=function(){return Gd.a(this.rd,7)};function tC(a,b){return hA(b,a)}function uC(a){return Wf(Ri([a]),new T(null,6,5,V,[200,201,202,204,205,206],null))}var vC=function vC(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return vC.o(arguments[0],arguments[1],arguments[2],3<c.length?new C(c.slice(3),0,null):null)};vC.o=function(a,b,c,d){return new T(null,2,5,V,[!1,Wb(le,new q(null,3,[nq,a,bn,b,cm,c],null),X.a(ch,Eg(d)))],null)};vC.I=3;
vC.H=function(a){var b=D(a),c=F(a);a=D(c);var d=F(c),c=D(d),d=F(d);return vC.o(b,a,c,d)};function wC(a){return tu(", ",X.a(function(a){return[t(a),t("; charset\x3dutf-8")].join("")},"string"===typeof a?new T(null,1,5,V,[a],null):a))}function xC(a,b,c,d,e,f){this.read=a;this.description=b;this.jc=c;this.O=d;this.G=e;this.A=f;this.l=2229667594;this.L=8192}h=xC.prototype;h.T=function(a,b){return mc.h(this,b,null)};
h.R=function(a,b,c){switch(b instanceof P?b.Va:null){case "read":return this.read;case "description":return this.description;case "content-type":return this.jc;default:return A.h(this.G,b,c)}};h.zd=function(a,b){var c=null!=a&&(a.l&64||a.M)?S(fg,a):a,d=A.a(c,qr),e=null!=this&&(this.l&64||this.M)?S(fg,this):this,f=A.a(e,qr);return Jg(b,Ko,function(a,b,c){return function(a){return Ki.o(N([new q(null,1,["Accept",wC(c)],null),r(a)?a:Uf],0))}}(this,e,f,a,c,d))};
h.Ad=function(a,b){var c=null!=a&&(a.l&64||a.M)?S(fg,a):a;A.a(c,Al);var c=null!=this&&(this.l&64||this.M)?S(fg,this):this,d=A.a(c,Al);try{var e=cA(b),f=$f.a(vC,e);switch(e){case 0:return f.a?f.a("Request failed.",Kt):f.call(null,"Request failed.",Kt);case -1:return r(gA(b))?f.a?f.a("Request aborted by client.",sn):f.call(null,"Request aborted by client.",sn):f.a?f.a("Request timed out.",ws):f.call(null,"Request timed out.",ws);case 204:return new T(null,2,5,V,[!0,null],null);case 205:return new T(null,
2,5,V,[!0,null],null);default:try{var g=d.g?d.g(b):d.call(null,b);if(r(uC(e)))return new T(null,2,5,V,[!0,g],null);var l=dA(b);return f.J?f.J(l,$r,Wj,g):f.call(null,l,$r,Wj,g)}catch(E){if(E instanceof Object){var g=E,f=V,m,n=null!=c&&(c.l&64||c.M)?S(fg,c):c,p=A.a(n,dk),u=new q(null,3,[nq,e,cm,$r,Wj,null],null),w=[t(g.message),t("  Format should have been "),t(p)].join(""),v=oe.o(u,bn,w,N([cm,Tq,cl,eA(b)],0));m=r(uC(e))?v:oe.o(u,bn,dA(b),N([oo,v],0));return new T(null,2,5,f,[!1,m],null)}throw E;}}}catch(E){if(E instanceof
Object)return g=E,vC.o(0,g.message,js,N([js,g],0));throw E;}};h.U=function(a,b,c){return cj(b,function(){return function(a){return cj(b,jj,""," ","",c,a)}}(this),"#ajax.core.ResponseFormat{",", ","}",c,Ff.a(new T(null,3,5,V,[new T(null,2,5,V,[Al,this.read],null),new T(null,2,5,V,[dk,this.description],null),new T(null,2,5,V,[qr,this.jc],null)],null),this.G))};h.ib=function(){return new Bh(0,this,3,new T(null,3,5,V,[Al,dk,qr],null),od(this.G))};h.V=function(){return this.O};
h.Ea=function(){return new xC(this.read,this.description,this.jc,this.O,this.G,this.A)};h.ba=function(){return 3+M(this.G)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=ff(this)};h.K=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?sh(this,b):c:b;return r(c)?!0:!1};h.Lb=function(a,b){return Le(new Oi(null,new q(null,3,[dk,null,Al,null,qr,null],null),null),b)?qe.a(fe(Bg.a(Uf,this),this.O),b):new xC(this.read,this.description,this.jc,this.O,Of(qe.a(this.G,b)),null)};
h.rb=function(a,b,c){return r(qf.a?qf.a(Al,b):qf.call(null,Al,b))?new xC(c,this.description,this.jc,this.O,this.G,null):r(qf.a?qf.a(dk,b):qf.call(null,dk,b))?new xC(this.read,c,this.jc,this.O,this.G,null):r(qf.a?qf.a(qr,b):qf.call(null,qr,b))?new xC(this.read,this.description,c,this.O,this.G,null):new xC(this.read,this.description,this.jc,this.O,oe.h(this.G,b,c),null)};
h.Z=function(){return B(Ff.a(new T(null,3,5,V,[new T(null,2,5,V,[Al,this.read],null),new T(null,2,5,V,[dk,this.description],null),new T(null,2,5,V,[qr,this.jc],null)],null),this.G))};h.Y=function(a,b){return new xC(this.read,this.description,this.jc,b,this.G,this.A)};h.ia=function(a,b){return De(b)?oc(this,gc.a(b,0),gc.a(b,1)):Wb(x,this,b)};function yC(a){return new xC(Al.g(a),dk.g(a),qr.g(a),null,qe.o(a,Al,N([dk,qr],0)),null)}
function zC(a){return function(b,c){var d=new T(null,2,5,V,[b,c],null);return AC?AC(a,d):BC.call(null,a,d)}}function BC(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return AC(arguments[0],arguments[1]);case 1:return CC(arguments[0]);default:throw Error([t("Invalid arity: "),t(b.length)].join(""));}}
function AC(a,b){var c=O(b,0,null),d=O(b,1,null),c=c instanceof P?sf(c):c,c=r(a)?[t(a),t("["),t(c),t("]")].join(""):c;return"string"===typeof d?new T(null,1,5,V,[new T(null,2,5,V,[c,d],null)],null):Be(d)?wg(CC(c),N([B(d)],0)):Ae(d)?S(Ff,bg(zC(c),B(d))):new T(null,1,5,V,[new T(null,2,5,V,[c,d],null)],null)}
function CC(a){return function(b){var c=O(b,0,null);b=O(b,1,null);c=c instanceof P?sf(c):c;c=r(a)?[t(a),t("["),t(c),t("]")].join(""):c;return"string"===typeof b?new T(null,1,5,V,[new T(null,2,5,V,[c,b],null)],null):Be(b)?wg(CC(c),N([B(b)],0)):Ae(b)?S(Ff,bg(zC(c),B(b))):new T(null,1,5,V,[new T(null,2,5,V,[c,b],null)],null)}}function DC(a){return tu("\x26",X.a(function(a){var c=O(a,0,null);a=O(a,1,null);return[t(c),t("\x3d"),t(a)].join("")},wg(CC(null),N([B(a)],0))))}
function EC(a,b){return function(c){return r(a)?[t(c),t(r(aj(/\?/,c))?"\x26":"?"),t(b.g?b.g(a):b.call(null,a))].join(""):c}}function FC(a,b,c,d){this.Hc=a;this.O=b;this.G=c;this.A=d;this.l=2229667594;this.L=8192}h=FC.prototype;h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){switch(b instanceof P?b.Va:null){case "params-to-str":return this.Hc;default:return A.h(this.G,b,c)}};
h.zd=function(a,b){var c=null!=b&&(b.l&64||b.M)?S(fg,b):b,d=A.a(c,nm);Gd.a(d,"GET")&&(c=Jg(c,ns,EC(vn.g(c),this.Hc)),c=new Pd(c));return c};h.Ad=function(a,b){return b};h.U=function(a,b,c){return cj(b,function(){return function(a){return cj(b,jj,""," ","",c,a)}}(this),"#ajax.core.ProcessGet{",", ","}",c,Ff.a(new T(null,1,5,V,[new T(null,2,5,V,[Pn,this.Hc],null)],null),this.G))};h.ib=function(){return new Bh(0,this,1,new T(null,1,5,V,[Pn],null),od(this.G))};h.V=function(){return this.O};
h.Ea=function(){return new FC(this.Hc,this.O,this.G,this.A)};h.ba=function(){return 1+M(this.G)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=ff(this)};h.K=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?sh(this,b):c:b;return r(c)?!0:!1};h.Lb=function(a,b){return Le(new Oi(null,new q(null,1,[Pn,null],null),null),b)?qe.a(fe(Bg.a(Uf,this),this.O),b):new FC(this.Hc,this.O,Of(qe.a(this.G,b)),null)};
h.rb=function(a,b,c){return r(qf.a?qf.a(Pn,b):qf.call(null,Pn,b))?new FC(c,this.O,this.G,null):new FC(this.Hc,this.O,oe.h(this.G,b,c),null)};h.Z=function(){return B(Ff.a(new T(null,1,5,V,[new T(null,2,5,V,[Pn,this.Hc],null)],null),this.G))};h.Y=function(a,b){return new FC(this.Hc,b,this.G,this.A)};h.ia=function(a,b){return De(b)?oc(this,gc.a(b,0),gc.a(b,1)):Wb(x,this,b)};function GC(a){throw Error(""+t(a));}function HC(a,b,c){this.O=a;this.G=b;this.A=c;this.l=2229667594;this.L=8192}h=HC.prototype;
h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){switch(b){default:return A.h(this.G,b,c)}};h.zd=function(a,b){var c=null!=b&&(b.l&64||b.M)?S(fg,b):b,d=A.a(c,Ps);A.a(c,vn);return null==d?c:new Pd(c)};h.Ad=function(a,b){return b};h.U=function(a,b,c){return cj(b,function(){return function(a){return cj(b,jj,""," ","",c,a)}}(this),"#ajax.core.DirectSubmission{",", ","}",c,Ff.a(me,this.G))};h.ib=function(){return new Bh(0,this,0,me,od(this.G))};h.V=function(){return this.O};
h.Ea=function(){return new HC(this.O,this.G,this.A)};h.ba=function(){return 0+M(this.G)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=ff(this)};h.K=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?sh(this,b):c:b;return r(c)?!0:!1};h.Lb=function(a,b){return Le(Qi,b)?qe.a(fe(Bg.a(Uf,this),this.O),b):new HC(this.O,Of(qe.a(this.G,b)),null)};h.rb=function(a,b,c){return new HC(this.O,oe.h(this.G,b,c),null)};h.Z=function(){return B(Ff.a(me,this.G))};
h.Y=function(a,b){return new HC(b,this.G,this.A)};h.ia=function(a,b){return De(b)?oc(this,gc.a(b,0),gc.a(b,1)):Wb(x,this,b)};function IC(a,b,c){this.O=a;this.G=b;this.A=c;this.l=2229667594;this.L=8192}h=IC.prototype;h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){switch(b){default:return A.h(this.G,b,c)}};
h.zd=function(a,b){var c=null!=b&&(b.l&64||b.M)?S(fg,b):b;A.a(c,ns);A.a(c,nm);var d=A.a(c,Fk),e=A.a(c,vn),f=A.a(c,Ko),g;g=Be(d)?d:Ke(d)?new q(null,2,[Wo,d,qr,"text/plain"],null):Uf;g=null!=g&&(g.l&64||g.M)?S(fg,g):g;var l=A.a(g,Wo);g=A.a(g,qr);d=null!=l?l.g?l.g(e):l.call(null,e):GC(new T(null,2,5,V,["unrecognized request format: ",d],null));f=r(f)?f:Uf;return oe.o(c,Ps,d,N([Ko,r(g)?oe.h(f,"Content-Type",wC(g)):f],0))};h.Ad=function(a,b){return b};
h.U=function(a,b,c){return cj(b,function(){return function(a){return cj(b,jj,""," ","",c,a)}}(this),"#ajax.core.ApplyRequestFormat{",", ","}",c,Ff.a(me,this.G))};h.ib=function(){return new Bh(0,this,0,me,od(this.G))};h.V=function(){return this.O};h.Ea=function(){return new IC(this.O,this.G,this.A)};h.ba=function(){return 0+M(this.G)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=ff(this)};h.K=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?sh(this,b):c:b;return r(c)?!0:!1};
h.Lb=function(a,b){return Le(Qi,b)?qe.a(fe(Bg.a(Uf,this),this.O),b):new IC(this.O,Of(qe.a(this.G,b)),null)};h.rb=function(a,b,c){return new IC(this.O,oe.h(this.G,b,c),null)};h.Z=function(){return B(Ff.a(me,this.G))};h.Y=function(a,b){return new IC(b,this.G,this.A)};h.ia=function(a,b){return De(b)?oc(this,gc.a(b,0),gc.a(b,1)):Wb(x,this,b)};function JC(a){a=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(a,Gn);return r(a)?a:us}
function KC(a,b){return function(a){return function(b){return a.write(b)}}(function(){var c=tq.g(b);return r(c)?c:sC(a,b)}())}function LC(a){var b=JC(a),c=Gd.a(b,us)?"json":"msgpack";return new q(null,2,[Wo,KC(b,a),qr,[t("application/transit+"),t(c)].join("")],null)}function MC(a){return function(b){return function(c){c=eA(c);c=b.read(c);return r(sm.g(a))?c:Aj(c)}}(function(){var b=Pq.g(a);return r(b)?b:kC(a)}())}
var NC=function NC(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return NC.D();case 1:return NC.g(arguments[0]);case 2:return NC.a(arguments[0],arguments[1]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};NC.D=function(){return NC.g(Uf)};NC.g=function(a){return NC.a(JC(a),a)};NC.a=function(a,b){return yC(new q(null,3,[Al,MC(b),dk,"Transit",qr,new T(null,1,5,V,["application/transit+json"],null)],null))};NC.I=2;
function OC(){return new q(null,2,[Wo,DC,qr,"application/x-www-form-urlencoded"],null)}var PC=function PC(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return PC.D();case 1:return PC.g(arguments[0]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};PC.D=function(){return yC(new q(null,3,[Al,eA,dk,"raw text",qr,new T(null,1,5,V,["*/*"],null)],null))};PC.g=function(){return PC.D()};PC.I=1;
function QC(a){var b=new dz;a=xj(a);var c=[];ez(b,a,c);return c.join("")}function RC(a,b,c){return function(d){d=eA(d);d=r(r(a)?Gd.a(0,d.indexOf(a)):a)?d.substring(a.length):d;d=cz(d);return r(b)?d:Bj(d,N([Cj,c],0))}}var SC=function SC(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return SC.D();case 1:return SC.g(arguments[0]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};SC.D=function(){return SC.g(Uf)};
SC.g=function(a){var b=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(b,Go);var c=A.a(b,vl),b=A.a(b,sm);return yC(new q(null,3,[Al,RC(a,b,c),dk,[t("JSON"),t(r(a)?[t(" prefix '"),t(a),t("'")].join(""):null),t(r(c)?" keywordize":null)].join(""),qr,new T(null,1,5,V,["application/json"],null)],null))};SC.I=1;
var TC=new T(null,6,5,V,[new T(null,2,5,V,["application/json",SC],null),new T(null,2,5,V,["application/transit+json",NC],null),new T(null,2,5,V,["application/transit+transit",NC],null),new T(null,2,5,V,["text/plain",PC],null),new T(null,2,5,V,["text/html",PC],null),new T(null,2,5,V,["*/*",PC],null)],null);function UC(a,b){return null==b||Be(b)?b:De(b)?UC(a,je(b)):b.g?b.g(a):b.call(null,a)}
function VC(a,b){var c=De(b)?D(b):qr.g(UC(a,b));return null==c?new T(null,1,5,V,["*/*"],null):"string"===typeof c?new T(null,1,5,V,[c],null):c}function WC(a){return function(b){b=De(b)?D(b):qr.g(UC(a,b));return null==b?new T(null,1,5,V,["*/*"],null):"string"===typeof b?new T(null,1,5,V,[b],null):b}}function XC(a){return function(b){return Gd.a(b,"*/*")||0<=a.indexOf(b)}}function YC(a,b){return function(c){c=VC(b,c);return Wf(XC(a),c)}}
function ZC(a){return function(b){var c;c=null!=a&&(a.l&64||a.M)?S(fg,a):a;var d=A.a(c,an),e=fA(b,"Content-Type");c=UC(c,D(xg.a(YC(r(e)?e:"",c),d)));return Al.g(c).call(null,b)}}function $C(a){var b;b=null!=a&&(a.l&64||a.M)?S(fg,a):a;var c=A.a(b,an);b=De(c)?wg(WC(b),N([c],0)):VC(b,c);return yC(new q(null,3,[Al,ZC(a),Fk,[t("(from "),t(b),t(")")].join(""),qr,b],null))}
function aD(a){a=null!=a&&(a.l&64||a.M)?S(fg,a):a;var b=A.a(a,an);return b instanceof xC?b:De(b)?$C(a):Be(b)?yC(b):Ke(b)?yC(new q(null,3,[Al,b,dk,"custom",qr,"*/*"],null)):GC(new T(null,2,5,V,["unrecognized response format: ",b],null))}function bD(a){return a instanceof P?sf(a).toUpperCase():a}function cD(a,b){return function(c){c=Wb(function(a,b){return iA(b,a)},c,b);return a.g?a.g(c):a.call(null,c)}}
var dD=new T(null,3,5,V,[new FC(DC,null,null,null),new HC(null,null,null),new IC(null,null,null)],null),eD,fD=me;eD=eg?eg(fD):dg.call(null,fD);function gD(a){var b=aD(a);return Jg(Jg(a,nm,bD),rs,function(a){return function(b){return Ff.o(new T(null,1,5,V,[a],null),r(b)?b:G.g?G.g(eD):G.call(null,eD),N([dD],0))}}(b))}
function hD(a,b){if(Be(a))return a;if(re(a))return new q(null,1,[Wo,a],null);if(null==a)return LC(b);switch(a instanceof P?a.Va:null){case "transit":return LC(b);case "json":return new q(null,2,[Wo,QC,qr,"application/json"],null);case "text":return new q(null,2,[Wo,We,qr,"text/plain"],null);case "raw":return OC();case "url":return OC();default:return null}}
var iD=function iD(b,c){if(De(b))return new T(null,2,5,V,[D(b),iD(je(b),c)],null);if(Be(b))return b;if(re(b))return new q(null,2,[Al,b,dk,"custom"],null);if(null==b)return $C(new q(null,1,[an,TC],null));switch(b instanceof P?b.Va:null){case "transit":return NC.g(c);case "json":return SC.g(c);case "text":return PC.D?PC.D():PC.call(null);case "raw":return PC.D();case "detect":return $C(new q(null,1,[an,TC],null));default:return null}};
function jD(a,b){return De(a)?S(dh,X.a(function(a){return iD(a,b)},a)):iD(a,b)}function kD(a){var b=null!=a&&(a.l&64||a.M)?S(fg,a):a,c=A.a(b,kt),d=A.a(b,Po),e=A.a(b,qk);return function(a,b,c,d,e){return function(a){var b=O(a,0,null);a=O(a,1,null);b=r(b)?c:d;r(b)&&(b.g?b.g(a):b.call(null,a));return re(e)?e.D?e.D():e.call(null):null}}(a,b,c,d,e)}
function lD(a,b){var c=D(b),c=c instanceof P?S(fg,b):c,c=oe.o(c,ns,a,N([nm,"GET"],0)),c=null!=c&&(c.l&64||c.M)?S(fg,c):c,d=A.a(c,nm),e=A.a(c,Fk),f=A.a(c,an);A.a(c,vn);d=null==A.a(c,Ps)&&Nf(d,"GET");e=r(r(e)?e:d)?hD(e,c):null;c=oe.o(c,kt,kD(c),N([Fk,e,an,jD(f,c)],0));c=gD(c);c=null!=c&&(c.l&64||c.M)?S(fg,c):c;f=A.a(c,rs);c=Wb(tC,c,f);f=mf(f);e=null!=c&&(c.l&64||c.M)?S(fg,c):c;e=A.a(e,kt);f=r(e)?cD(e,f):GC("No ajax handler provided.");e=al.g(c);e=r(e)?e:new Mz;return bA(e,c,f)};function mD(a,b,c,d,e){this.tb=!!b;this.node=null;this.xb=0;this.Cf=!1;this.Ae=!c;a&&this.setPosition(a,d);this.depth=void 0!=e?e:this.xb||0;this.tb&&(this.depth*=-1)}Ba(mD,lz);h=mD.prototype;h.setPosition=function(a,b,c){if(this.node=a)this.xb=ja(b)?b:1!=this.node.nodeType?0:this.tb?-1:1;ja(c)&&(this.depth=c)};h.kc=function(a){this.node=a.node;this.xb=a.xb;this.depth=a.depth;this.tb=a.tb;this.Ae=a.Ae};h.clone=function(){return new mD(this.node,this.tb,!this.Ae,this.xb,this.depth)};
h.next=function(){var a;if(this.Cf){if(!this.node||this.Ae&&0==this.depth)throw kz;a=this.node;var b=this.tb?-1:1;if(this.xb==b){var c=this.tb?a.lastChild:a.firstChild;c?this.setPosition(c):this.setPosition(a,-1*b)}else(c=this.tb?a.previousSibling:a.nextSibling)?this.setPosition(c):this.setPosition(a.parentNode,-1*b);this.depth+=this.xb*(this.tb?-1:1)}else this.Cf=!0;a=this.node;if(!this.node)throw kz;return a};h.ob=function(a){return a.node==this.node&&(!this.node||a.xb==this.xb)};
h.splice=function(a){var b=this.node,c=this.tb?1:-1;this.xb==c&&(this.xb=-1*c,this.depth+=this.xb*(this.tb?-1:1));this.tb=!this.tb;mD.prototype.next.call(this);this.tb=!this.tb;for(var c=ha(arguments[0])?arguments[0]:arguments,d=c.length-1;0<=d;d--)b.parentNode&&b.parentNode.insertBefore(c[d],b.nextSibling);jy(b)};var nD=document.createElement("div");nD.innerHTML="   \x3clink/\x3e\x3ctable\x3e\x3c/table\x3e\x3ca href\x3d'/a' style\x3d'top:1px;float:left;opacity:.55;'\x3ea\x3c/a\x3e\x3cinput type\x3d'checkbox'/\x3e";var oD=Gd.a(nD.firstChild.nodeType,3),pD=Gd.a(nD.getElementsByTagName("tbody").length,0);Gd.a(nD.getElementsByTagName("link").length,0);function qD(a,b,c,d){this.top=a;this.right=b;this.bottom=c;this.left=d}h=qD.prototype;h.clone=function(){return new qD(this.top,this.right,this.bottom,this.left)};h.toString=function(){return"("+this.top+"t, "+this.right+"r, "+this.bottom+"b, "+this.left+"l)"};h.contains=function(a){return this&&a?a instanceof qD?a.left>=this.left&&a.right<=this.right&&a.top>=this.top&&a.bottom<=this.bottom:a.x>=this.left&&a.x<=this.right&&a.y>=this.top&&a.y<=this.bottom:!1};
h.expand=function(a,b,c,d){pa(a)?(this.top-=a.top,this.right+=a.right,this.bottom+=a.bottom,this.left-=a.left):(this.top-=a,this.right+=b,this.bottom+=c,this.left-=d);return this};h.ceil=function(){this.top=Math.ceil(this.top);this.right=Math.ceil(this.right);this.bottom=Math.ceil(this.bottom);this.left=Math.ceil(this.left);return this};h.floor=function(){this.top=Math.floor(this.top);this.right=Math.floor(this.right);this.bottom=Math.floor(this.bottom);this.left=Math.floor(this.left);return this};
h.round=function(){this.top=Math.round(this.top);this.right=Math.round(this.right);this.bottom=Math.round(this.bottom);this.left=Math.round(this.left);return this};h.translate=function(a,b){a instanceof Xx?(this.left+=a.x,this.right+=a.x,this.top+=a.y,this.bottom+=a.y):(this.left+=a,this.right+=a,ja(b)&&(this.top+=b,this.bottom+=b));return this};h.scale=function(a,b){var c=ja(b)?b:a;this.left*=a;this.right*=a;this.top*=c;this.bottom*=c;return this};function rD(a,b,c){if(ia(b))(b=sD(a,b))&&(a.style[b]=c);else for(var d in b){c=a;var e=b[d],f=sD(c,d);f&&(c.style[f]=e)}}var tD={};function sD(a,b){var c=tD[b];if(!c){var d=Va(b),c=d;void 0===a.style[d]&&(d=(Kx?"Webkit":Jx?"Moz":Hx?"ms":Gx?"O":null)+Wa(d),void 0!==a.style[d]&&(c=d));tD[b]=c}return c}function uD(a,b){var c=$x(a);return c.defaultView&&c.defaultView.getComputedStyle&&(c=c.defaultView.getComputedStyle(a,null))?c[b]||c.getPropertyValue(b)||"":""}
function vD(a){var b=$x(a),c=new Xx(0,0),d;d=b?$x(b):document;var e;(e=!Hx||9<=Sx)||(e="CSS1Compat"==Yx(d).Ac.compatMode);if(a==(e?d.documentElement:d.body))return c;var f;a:{try{f=a.getBoundingClientRect()}catch(g){f={left:0,top:0,right:0,bottom:0};break a}Hx&&a.ownerDocument.body&&(a=a.ownerDocument,f.left-=a.documentElement.clientLeft+a.body.clientLeft,f.top-=a.documentElement.clientTop+a.body.clientTop)}a=Yx(b).Ac;b=dy(a);a=a.parentWindow||a.defaultView;b=Hx&&Qx("10")&&a.pageYOffset!=b.scrollTop?
new Xx(b.scrollLeft,b.scrollTop):new Xx(a.pageXOffset||b.scrollLeft,a.pageYOffset||b.scrollTop);c.x=f.left+b.x;c.y=f.top+b.y;return c}var wD={thin:2,medium:4,thick:6};
function xD(a,b){if("none"==(a.currentStyle?a.currentStyle[b+"Style"]:null))return 0;var c=a.currentStyle?a.currentStyle[b+"Width"]:null,d;if(c in wD)d=wD[c];else if(/^\d+px?$/.test(c))d=parseInt(c,10);else{d=a.style.left;var e=a.runtimeStyle.left;a.runtimeStyle.left=a.currentStyle.left;a.style.left=c;c=a.style.pixelLeft;a.style.left=d;a.runtimeStyle.left=e;d=c}return d};if(Hx&&Hx)try{new ActiveXObject("MSXML2.DOMDocument")}catch(a){};var yD=/<|&#?\w+;/,zD=/^\s+/,AD=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/i,BD=/<([\w:]+)/,CD=/<tbody/i,DD=new T(null,3,5,V,[1,"\x3cselect multiple\x3d'multiple'\x3e","\x3c/select\x3e"],null),ED=new T(null,3,5,V,[1,"\x3ctable\x3e","\x3c/table\x3e"],null),FD=new T(null,3,5,V,[3,"\x3ctable\x3e\x3ctbody\x3e\x3ctr\x3e","\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e"],null),GD=pe(["td","optgroup","tfoot","tr","area",tm,"option","legend","thead","col","caption","th","colgroup","tbody"],
[FD,DD,ED,new T(null,3,5,V,[2,"\x3ctable\x3e\x3ctbody\x3e","\x3c/tbody\x3e\x3c/table\x3e"],null),new T(null,3,5,V,[1,"\x3cmap\x3e","\x3c/map\x3e"],null),new T(null,3,5,V,[0,"",""],null),DD,new T(null,3,5,V,[1,"\x3cfieldset\x3e","\x3c/fieldset\x3e"],null),ED,new T(null,3,5,V,[2,"\x3ctable\x3e\x3ctbody\x3e\x3c/tbody\x3e\x3ccolgroup\x3e","\x3c/colgroup\x3e\x3c/table\x3e"],null),ED,FD,ED,ED]);
function HD(a,b,c,d){b=Mb(aj(CD,b));Gd.a(c,"table")&&b?(c=a.firstChild,a=r(c)?a.firstChild.childNodes:c):a=Gd.a(d,"\x3ctable\x3e")&&b?a.childNodes:me;a=B(a);c=null;for(var e=b=0;;)if(e<b)d=c.N(null,e),Gd.a(d.nodeName,"tbody")&&Gd.a(d.childNodes.length,0)&&d.parentNode.removeChild(d),e+=1;else if(a=B(a))c=a,Ee(c)?(a=gd(c),b=hd(c),c=a,d=M(a),a=b,b=d):(d=D(c),Gd.a(d.nodeName,"tbody")&&Gd.a(d.childNodes.length,0)&&d.parentNode.removeChild(d),a=F(c),c=null,b=0),e=0;else break}
function ID(a,b){a.insertBefore(document.createTextNode(D(aj(zD,b))),a.firstChild)}function JD(a){var b=su(a,AD,"\x3c$1\x3e\x3c/$2\x3e");a=(""+t(je(aj(BD,b)))).toLowerCase();var c=A.h(GD,a,tm.g(GD)),d=O(c,0,null),e=O(c,1,null),f=O(c,2,null),c=function(){var a;a=document.createElement("div");a.innerHTML=[t(e),t(b),t(f)].join("");for(var c=d;;)if(0<c)--c,a=a.lastChild;else return a}();r(pD)&&HD(c,b,a,e);r(function(){var a=Mb(oD);return a?aj(zD,b):a}())&&ID(c,b);return c.childNodes}
var KD=function KD(b){if(null!=b&&null!=b.Lg)return b.Lg(b);var c=KD[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=KD._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("DomContent.nodes",b);};function LD(a,b){function c(a,b){var c=a.parentNode;c&&c.replaceChild(b,a)}MD.h?MD.h(c,a,b):MD.call(null,c,a,b)}
function ND(a,b,c){a=B(KD(a));for(var d=null,e=0,f=0;;)if(f<e){var g=d.N(null,f),l=sf(b),m=S(t,c);rD(g,l,m);f+=1}else if(a=B(a))Ee(a)?(e=gd(a),a=hd(a),d=e,e=M(e)):(d=D(a),e=sf(b),f=S(t,c),rD(d,e,f),a=F(a),d=null,e=0),f=0;else break}function OD(a,b,c){a=B(KD(a));for(var d=null,e=0,f=0;;)if(f<e)d.N(null,f).setAttribute(sf(b),S(t,c)),f+=1;else if(a=B(a))d=a,Ee(d)?(a=gd(d),f=hd(d),d=a,e=M(a),a=f):(D(d).setAttribute(sf(b),S(t,c)),a=F(d),d=null,e=0),f=0;else break}
function PD(a,b){for(var c=B(b),d=null,e=0,f=0;;)if(f<e){var g=d.N(null,f),l=O(g,0,null),g=O(g,1,null);ND(a,l,N([g],0));f+=1}else if(c=B(c))Ee(c)?(e=gd(c),c=hd(c),d=e,e=M(e)):(e=D(c),d=O(e,0,null),e=O(e,1,null),ND(a,d,N([e],0)),c=F(c),d=null,e=0),f=0;else break;return a}
function QD(a,b){for(var c=B(b),d=null,e=0,f=0;;)if(f<e){var g=d.N(null,f),l=O(g,0,null),g=O(g,1,null);OD(a,l,N([g],0));f+=1}else if(c=B(c))Ee(c)?(e=gd(c),c=hd(c),d=e,e=M(e)):(e=D(c),d=O(e,0,null),e=O(e,1,null),OD(a,d,N([e],0)),c=F(c),d=null,e=0),f=0;else break;return a}
function MD(a,b,c){b=KD(b);var d=KD(c);c=function(){for(var a=document.createDocumentFragment(),b=B(d),c=null,e=0,f=0;;)if(f<e){var u=c.N(null,f);a.appendChild(u);f+=1}else if(b=B(b))c=b,Ee(c)?(b=gd(c),f=hd(c),c=b,e=M(b),b=f):(b=D(c),a.appendChild(b),b=F(c),c=null,e=0),f=0;else break;return a}();var e=Zi(ug(M(b)-1,function(a,b,c){return function(){return c.cloneNode(!0)}}(b,d,c)));if(B(b)){var f=D(b);a.a?a.a(f,c):a.call(null,f,c);return Zi(X.h(function(){return function(b,c){return a.a?a.a(b,c):a.call(null,
b,c)}}(b,d,c,e),Ed(b),e))}return null}function RD(a,b){return b<a.length?new tf(null,function(){return de(a.item(b),RD(a,b+1))},null,null):null}function SD(a,b){return b<a.length?new tf(null,function(){return de(a[b],SD(a,b+1))},null,null):null}function TD(a){return r(a.item)?RD(a,0):SD(a,0)}KD.string=function(a){a=r(aj(yD,a))?JD(a):document.createTextNode(a);return Zi(KD(a))};
KD._=function(a){if(null==a)a=Fd;else if(null!=a?a.l&8388608||a.gd||(a.l?0:Nb(Mc,a)):Nb(Mc,a))a=B(a);else{var b;b=r(a)?(b=Mb(a.nodeName))?a.length:b:a;a=r(b)?TD(a):B(new T(null,1,5,V,[a],null))}return a};r("undefined"!=typeof NodeList)&&(h=NodeList.prototype,h.qe=!0,h.ba=function(){return this.length},h.Gd=!0,h.N=function(a,b){return this.item(b)},h.ab=function(a,b,c){return this.length<=b?c:Yd(this,b)},h.gd=!0,h.Z=function(){return TD(this)});
r("undefined"!=typeof StaticNodeList)&&(h=StaticNodeList.prototype,h.qe=!0,h.ba=function(){return this.length},h.Gd=!0,h.N=function(a,b){return this.item(b)},h.ab=function(a,b,c){return this.length<=b?c:Yd(this,b)},h.gd=!0,h.Z=function(){return TD(this)});r("undefined"!=typeof HTMLCollection)&&(h=HTMLCollection.prototype,h.qe=!0,h.ba=function(){return this.length},h.Gd=!0,h.N=function(a,b){return this.item(b)},h.ab=function(a,b,c){return this.length<=b?c:Yd(this,b)},h.gd=!0,h.Z=function(){return TD(this)});var UD,VD,WD,XD=function XD(b,c){if(null!=b&&null!=b.hf)return b.hf(0,c);var d=XD[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=XD._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("ReadPort.take!",b);},YD=function YD(b,c,d){if(null!=b&&null!=b.ze)return b.ze(0,c,d);var e=YD[k(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=YD._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw Pb("WritePort.put!",b);},ZD=function ZD(b){if(null!=b&&null!=
b.ye)return b.ye();var c=ZD[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=ZD._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("Channel.close!",b);},$D=function $D(b){if(null!=b&&null!=b.Ab)return b.Ab(b);var c=$D[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=$D._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("Handler.active?",b);},aE=function aE(b){if(null!=b&&null!=b.sb)return b.sb(b);var c=aE[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,
b);c=aE._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("Handler.commit",b);},bE=function bE(b){if(null!=b&&null!=b.Nc)return b.Nc(b);var c=bE[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=bE._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("Buffer.remove!",b);},cE=function cE(b,c){if(null!=b&&null!=b.ff)return b.ff(b,c);var d=cE[k(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=cE._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Pb("Buffer.add!*",
b);},dE=function dE(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return dE.g(arguments[0]);case 2:return dE.a(arguments[0],arguments[1]);default:throw Error([t("Invalid arity: "),t(c.length)].join(""));}};dE.g=function(a){return a};dE.a=function(a,b){if(null==b)throw Error("Assert failed: (not (nil? itm))");return cE(a,b)};dE.I=2;function eE(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function fE(a,b,c,d){this.head=a;this.ja=b;this.length=c;this.j=d}fE.prototype.pop=function(){if(0===this.length)return null;var a=this.j[this.ja];this.j[this.ja]=null;this.ja=(this.ja+1)%this.j.length;--this.length;return a};fE.prototype.unshift=function(a){this.j[this.head]=a;this.head=(this.head+1)%this.j.length;this.length+=1;return null};function gE(a,b){a.length+1===a.j.length&&a.resize();a.unshift(b)}
fE.prototype.resize=function(){var a=Array(2*this.j.length);return this.ja<this.head?(eE(this.j,this.ja,a,0,this.length),this.ja=0,this.head=this.length,this.j=a):this.ja>this.head?(eE(this.j,this.ja,a,0,this.j.length-this.ja),eE(this.j,0,a,this.j.length-this.ja,this.head),this.ja=0,this.head=this.length,this.j=a):this.ja===this.head?(this.head=this.ja=0,this.j=a):null};
fE.prototype.cleanup=function(a){for(var b=this.length,c=0;;)if(c<b){var d=this.pop();(a.g?a.g(d):a.call(null,d))&&this.unshift(d);c+=1}else return null};function hE(a){if(!(0<a))throw Error([t("Assert failed: "),t("Can't create a ring buffer of size 0"),t("\n"),t("(\x3e n 0)")].join(""));return new fE(0,0,0,Array(a))}function iE(a,b){this.aa=a;this.n=b;this.l=2;this.L=0}iE.prototype.gf=function(){return this.aa.length===this.n};iE.prototype.Nc=function(){return this.aa.pop()};
iE.prototype.ff=function(a,b){gE(this.aa,b);return this};iE.prototype.ba=function(){return this.aa.length};function jE(a,b){this.aa=a;this.n=b;this.l=2;this.L=0}jE.prototype.gf=function(){return!1};jE.prototype.Nc=function(){return this.aa.pop()};jE.prototype.ff=function(a,b){this.aa.length===this.n&&bE(this);this.aa.unshift(b);return this};jE.prototype.ba=function(){return this.aa.length};if("undefined"===typeof kE)var kE={};var lE=hE(32),mE=!1,nE=!1;function oE(){mE=!0;nE=!1;for(var a=0;;){var b=lE.pop();if(null!=b&&(b.D?b.D():b.call(null),1024>a)){a+=1;continue}break}mE=!1;return 0<lE.length?pE.D?pE.D():pE.call(null):null}function pE(){var a=nE;if(r(r(a)?mE:a))return null;nE=!0;!la(ba.setImmediate)||ba.Window&&ba.Window.prototype&&ba.Window.prototype.setImmediate==ba.setImmediate?(uy||(uy=vy()),uy(oE)):ba.setImmediate(oE)}function qE(a){gE(lE,a);pE()}function rE(a){setTimeout(a,5)};var sE,tE=function tE(b){"undefined"===typeof sE&&(sE=function(a,b,e){this.ug=a;this.val=b;this.Rg=e;this.l=425984;this.L=0},sE.prototype.Y=function(a,b){return new sE(this.ug,this.val,b)},sE.prototype.V=function(){return this.Rg},sE.prototype.Yb=function(){return this.val},sE.Ud=function(){return new T(null,3,5,V,[fe(hp,new q(null,1,[Rf,nf(Sf,nf(new T(null,1,5,V,[lq],null)))],null)),lq,mn],null)},sE.Oc=!0,sE.hc="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels12259",sE.jd=function(a,
b){return Uc(b,"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels12259")});return new sE(tE,b,Uf)};function uE(a,b){this.ub=a;this.val=b}function vE(a){return $D(a.ub)}var wE=function wE(b){if(null!=b&&null!=b.Tf)return b.Tf();var c=wE[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=wE._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("MMC.abort",b);};function xE(a,b,c,d,e,f,g){this.Zc=a;this.Ee=b;this.Ic=c;this.De=d;this.aa=e;this.closed=f;this.Cb=g}
xE.prototype.Tf=function(){for(;;){var a=this.Ic.pop();if(null!=a){var b=a.ub,c=a.val;if(b.Ab(null)){var d=b.sb(null);qE(function(a){return function(){return a.g?a.g(!0):a.call(null,!0)}}(d,b,c,a,this))}else continue}break}this.Ic.cleanup(Yf());return ZD(this)};
xE.prototype.ze=function(a,b,c){var d=this;if(null==b)throw Error([t("Assert failed: "),t("Can't put nil in on a channel"),t("\n"),t("(not (nil? val))")].join(""));if((a=d.closed)||!c.Ab(null))return tE(!a);if(r(function(){var a=d.aa;return r(a)?Mb(d.aa.gf(null)):a}())){c.sb(null);for(c=Qd(d.Cb.a?d.Cb.a(d.aa,b):d.Cb.call(null,d.aa,b));;){if(0<d.Zc.length&&0<M(d.aa)){var e=d.Zc.pop();if(e.Ab(null)){var f=e.sb(null),g=d.aa.Nc(null);qE(function(a,b){return function(){return a.g?a.g(b):a.call(null,b)}}(f,
g,e,c,a,this))}else continue}break}c&&wE(this);return tE(!0)}e=function(){for(;;){var a=d.Zc.pop();if(r(a)){if(r(a.Ab(null)))return a}else return null}}();if(r(e))return f=aE(e),c.sb(null),qE(function(a){return function(){return a.g?a.g(b):a.call(null,b)}}(f,e,a,this)),tE(!0);64<d.De?(d.De=0,d.Ic.cleanup(vE)):d.De+=1;if(r(c.Pd(null))){if(!(1024>d.Ic.length))throw Error([t("Assert failed: "),t([t("No more than "),t(1024),t(" pending puts are allowed on a single channel."),t(" Consider using a windowed buffer.")].join("")),
t("\n"),t("(\x3c (.-length puts) impl/MAX-QUEUE-SIZE)")].join(""));gE(d.Ic,new uE(c,b))}return null};
xE.prototype.hf=function(a,b){var c=this;if(b.Ab(null)){if(null!=c.aa&&0<M(c.aa)){for(var d=b.sb(null),e=tE(c.aa.Nc(null));;){if(!r(c.aa.gf(null))){var f=c.Ic.pop();if(null!=f){var g=f.ub,l=f.val;if(g.Ab(null)){var m=g.sb(null);b.sb(null);qE(function(a){return function(){return a.g?a.g(!0):a.call(null,!0)}}(m,g,l,f,d,e,this));Qd(c.Cb.a?c.Cb.a(c.aa,l):c.Cb.call(null,c.aa,l))&&wE(this)}continue}}break}return e}d=function(){for(;;){var a=c.Ic.pop();if(r(a)){if($D(a.ub))return a}else return null}}();
if(r(d))return e=aE(d.ub),b.sb(null),qE(function(a){return function(){return a.g?a.g(!0):a.call(null,!0)}}(e,d,this)),tE(d.val);if(r(c.closed))return r(c.aa)&&(c.Cb.g?c.Cb.g(c.aa):c.Cb.call(null,c.aa)),r(function(){var a=b.Ab(null);return r(a)?b.sb(null):a}())?(d=function(){var a=c.aa;return r(a)?0<M(c.aa):a}(),d=r(d)?c.aa.Nc(null):null,tE(d)):null;64<c.Ee?(c.Ee=0,c.Zc.cleanup($D)):c.Ee+=1;if(r(b.Pd(null))){if(!(1024>c.Zc.length))throw Error([t("Assert failed: "),t([t("No more than "),t(1024),t(" pending takes are allowed on a single channel.")].join("")),
t("\n"),t("(\x3c (.-length takes) impl/MAX-QUEUE-SIZE)")].join(""));gE(c.Zc,b)}}return null};xE.prototype.ye=function(){var a=this;if(!a.closed)for(a.closed=!0,r(function(){var b=a.aa;return r(b)?0===a.Ic.length:b}())&&(a.Cb.g?a.Cb.g(a.aa):a.Cb.call(null,a.aa));;){var b=a.Zc.pop();if(null==b)break;else if(b.Ab(null)){var c=b.sb(null),d=r(function(){var b=a.aa;return r(b)?0<M(a.aa):b}())?a.aa.Nc(null):null;qE(function(a,b){return function(){return a.g?a.g(b):a.call(null,b)}}(c,d,b,this))}}return null};
function yE(a){console.log(a);return null}function zE(a,b){var c=(r(null)?null:yE).call(null,b);return null==c?a:dE.a(a,c)}
function AE(a,b){return new xE(hE(32),0,hE(32),0,a,!1,function(){return function(a){return function(){function b(d,e){try{return a.a?a.a(d,e):a.call(null,d,e)}catch(f){return zE(d,f)}}function e(b){try{return a.g?a.g(b):a.call(null,b)}catch(d){return zE(b,d)}}var f=null,f=function(a,c){switch(arguments.length){case 1:return e.call(this,a);case 2:return b.call(this,a,c)}throw Error("Invalid arity: "+arguments.length);};f.g=e;f.a=b;return f}()}(r(b)?b.g?b.g(dE):b.call(null,dE):dE)}())};var BE,CE=function CE(b){"undefined"===typeof BE&&(BE=function(a,b,e){this.Ng=a;this.Fb=b;this.Sg=e;this.l=393216;this.L=0},BE.prototype.Y=function(a,b){return new BE(this.Ng,this.Fb,b)},BE.prototype.V=function(){return this.Sg},BE.prototype.Ab=function(){return!0},BE.prototype.Pd=function(){return!0},BE.prototype.sb=function(){return this.Fb},BE.Ud=function(){return new T(null,3,5,V,[fe(Zs,new q(null,2,[Ml,!0,Rf,nf(Sf,nf(new T(null,1,5,V,[lu],null)))],null)),lu,lt],null)},BE.Oc=!0,BE.hc="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers16151",
BE.jd=function(a,b){return Uc(b,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers16151")});return new BE(CE,b,Uf)};function DE(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].ye(),b;}}function EE(a,b,c){c=c.hf(0,CE(function(c){a[2]=c;a[1]=b;return DE(a)}));return r(c)?(a[2]=G.g?G.g(c):G.call(null,c),a[1]=b,Y):null}function FE(a,b,c,d){c=c.ze(0,d,CE(function(c){a[2]=c;a[1]=b;return DE(a)}));return r(c)?(a[2]=G.g?G.g(c):G.call(null,c),a[1]=b,Y):null}
function GE(a,b){var c=a[6];null!=b&&c.ze(0,b,CE(function(){return function(){return null}}(c)));c.ye();return c}function HE(a,b,c,d,e,f,g,l){this.Jb=a;this.Kb=b;this.Pb=c;this.Nb=d;this.Ub=e;this.O=f;this.G=g;this.A=l;this.l=2229667594;this.L=8192}h=HE.prototype;h.T=function(a,b){return mc.h(this,b,null)};
h.R=function(a,b,c){switch(b instanceof P?b.Va:null){case "catch-block":return this.Jb;case "catch-exception":return this.Kb;case "finally-block":return this.Pb;case "continue-block":return this.Nb;case "prev":return this.Ub;default:return A.h(this.G,b,c)}};
h.U=function(a,b,c){return cj(b,function(){return function(a){return cj(b,jj,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,Ff.a(new T(null,5,5,V,[new T(null,2,5,V,[Mn,this.Jb],null),new T(null,2,5,V,[Hq,this.Kb],null),new T(null,2,5,V,[vm,this.Pb],null),new T(null,2,5,V,[nr,this.Nb],null),new T(null,2,5,V,[er,this.Ub],null)],null),this.G))};h.ib=function(){return new Bh(0,this,5,new T(null,5,5,V,[Mn,Hq,vm,nr,er],null),od(this.G))};h.V=function(){return this.O};
h.Ea=function(){return new HE(this.Jb,this.Kb,this.Pb,this.Nb,this.Ub,this.O,this.G,this.A)};h.ba=function(){return 5+M(this.G)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=ff(this)};h.K=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?sh(this,b):c:b;return r(c)?!0:!1};
h.Lb=function(a,b){return Le(new Oi(null,new q(null,5,[vm,null,Mn,null,Hq,null,er,null,nr,null],null),null),b)?qe.a(fe(Bg.a(Uf,this),this.O),b):new HE(this.Jb,this.Kb,this.Pb,this.Nb,this.Ub,this.O,Of(qe.a(this.G,b)),null)};
h.rb=function(a,b,c){return r(qf.a?qf.a(Mn,b):qf.call(null,Mn,b))?new HE(c,this.Kb,this.Pb,this.Nb,this.Ub,this.O,this.G,null):r(qf.a?qf.a(Hq,b):qf.call(null,Hq,b))?new HE(this.Jb,c,this.Pb,this.Nb,this.Ub,this.O,this.G,null):r(qf.a?qf.a(vm,b):qf.call(null,vm,b))?new HE(this.Jb,this.Kb,c,this.Nb,this.Ub,this.O,this.G,null):r(qf.a?qf.a(nr,b):qf.call(null,nr,b))?new HE(this.Jb,this.Kb,this.Pb,c,this.Ub,this.O,this.G,null):r(qf.a?qf.a(er,b):qf.call(null,er,b))?new HE(this.Jb,this.Kb,this.Pb,this.Nb,
c,this.O,this.G,null):new HE(this.Jb,this.Kb,this.Pb,this.Nb,this.Ub,this.O,oe.h(this.G,b,c),null)};h.Z=function(){return B(Ff.a(new T(null,5,5,V,[new T(null,2,5,V,[Mn,this.Jb],null),new T(null,2,5,V,[Hq,this.Kb],null),new T(null,2,5,V,[vm,this.Pb],null),new T(null,2,5,V,[nr,this.Nb],null),new T(null,2,5,V,[er,this.Ub],null)],null),this.G))};h.Y=function(a,b){return new HE(this.Jb,this.Kb,this.Pb,this.Nb,this.Ub,b,this.G,this.A)};
h.ia=function(a,b){return De(b)?oc(this,gc.a(b,0),gc.a(b,1)):Wb(x,this,b)};
function IE(a){for(;;){var b=a[4],c=Mn.g(b),d=Hq.g(b),e=a[5];if(r(function(){var a=e;return r(a)?Mb(b):a}()))throw e;if(r(function(){var a=e;return r(a)?(a=c,r(a)?Gd.a(tm,d)||e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=oe.o(b,Mn,null,N([Hq,null],0));break}if(r(function(){var a=e;return r(a)?Mb(c)&&Mb(vm.g(b)):a}()))a[4]=er.g(b);else{if(r(function(){var a=e;return r(a)?(a=Mb(c))?vm.g(b):a:a}())){a[1]=vm.g(b);a[4]=oe.h(b,vm,null);break}if(r(function(){var a=Mb(e);return a?vm.g(b):a}())){a[1]=
vm.g(b);a[4]=oe.h(b,vm,null);break}if(Mb(e)&&Mb(vm.g(b))){a[1]=nr.g(b);a[4]=er.g(b);break}throw Error("No matching clause");}}};function JE(a,b,c){this.key=a;this.val=b;this.forward=c;this.l=2155872256;this.L=0}JE.prototype.Z=function(){return x(x(Fd,this.val),this.key)};JE.prototype.U=function(a,b,c){return cj(b,jj,"["," ","]",c,this)};function KE(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new JE(a,b,c)}function LE(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(r(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function ME(a,b){this.Sc=a;this.level=b;this.l=2155872256;this.L=0}ME.prototype.put=function(a,b){var c=Array(15),d=LE(this.Sc,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.val=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.Sc,e+=1;else break;this.level=d}for(d=KE(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
ME.prototype.remove=function(a){var b=Array(15),c=LE(this.Sc,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.Sc.forward[this.level])--this.level;else return null}else return null};function NE(a){for(var b=OE,c=b.Sc,d=b.level;;){if(0>d)return c===b.Sc?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
ME.prototype.Z=function(){return function(a){return function c(d){return new tf(null,function(){return function(){return null==d?null:de(new T(null,2,5,V,[d.key,d.val],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.Sc.forward[0])};ME.prototype.U=function(a,b,c){return cj(b,function(){return function(a){return cj(b,jj,""," ","",c,a)}}(this),"{",", ","}",c,this)};var OE=new ME(KE(null,null,0),0);
function PE(){var a=(new Date).valueOf()+5,b=NE(a),c=r(r(b)?b.key<a+10:b)?b.val:null;if(r(c))return c;var d=AE(null,null);OE.put(a,d);rE(function(a,b,c){return function(){OE.remove(c);return ZD(a)}}(d,c,a,b));return d};function QE(a){return RE(a,null)}function RE(a,b){var c=Gd.a(a,0)?null:a;if(r(b)&&!r(c))throw Error([t("Assert failed: "),t("buffer must be supplied when transducer is"),t("\n"),t("buf-or-n")].join(""));c="number"===typeof c?new iE(hE(c),c):c;return AE(c,b)}var SE;
SE=function(a){"undefined"===typeof UD&&(UD=function(a,c,d){this.Fb=a;this.Lf=c;this.Tg=d;this.l=393216;this.L=0},UD.prototype.Y=function(a,c){return new UD(this.Fb,this.Lf,c)},UD.prototype.V=function(){return this.Tg},UD.prototype.Ab=function(){return!0},UD.prototype.Pd=function(){return this.Lf},UD.prototype.sb=function(){return this.Fb},UD.Ud=function(){return new T(null,3,5,V,[lu,xl,Nn],null)},UD.Oc=!0,UD.hc="cljs.core.async/t_cljs$core$async16297",UD.jd=function(a,c){return Uc(c,"cljs.core.async/t_cljs$core$async16297")});
return new UD(a,!0,Uf)}(function(){return null});function TE(a,b){var c=YD(a,b,SE);return r(c)?G.g?G.g(c):G.call(null,c):!0}function UE(a){for(var b=Array(a),c=0;;)if(c<a)b[c]=0,c+=1;else break;for(c=1;;){if(Gd.a(c,a))return b;var d=Math.floor(Math.random()*c);b[c]=b[d];b[d]=c;c+=1}}
var VE=function VE(){var b=eg?eg(!0):dg.call(null,!0);"undefined"===typeof VD&&(VD=function(a,b,e){this.rg=a;this.nc=b;this.Ug=e;this.l=393216;this.L=0},VD.prototype.Y=function(){return function(a,b){return new VD(this.rg,this.nc,b)}}(b),VD.prototype.V=function(){return function(){return this.Ug}}(b),VD.prototype.Ab=function(){return function(){return G.g?G.g(this.nc):G.call(null,this.nc)}}(b),VD.prototype.Pd=function(){return function(){return!0}}(b),VD.prototype.sb=function(){return function(){hg.a?
hg.a(this.nc,null):hg.call(null,this.nc,null);return!0}}(b),VD.Ud=function(){return function(){return new T(null,3,5,V,[fe(so,new q(null,2,[Ml,!0,Rf,nf(Sf,nf(me))],null)),Ro,Jk],null)}}(b),VD.Oc=!0,VD.hc="cljs.core.async/t_cljs$core$async16342",VD.jd=function(){return function(a,b){return Uc(b,"cljs.core.async/t_cljs$core$async16342")}}(b));return new VD(VE,b,Uf)},WE=function WE(b,c){"undefined"===typeof WD&&(WD=function(a,b,c,g){this.sg=a;this.nc=b;this.Dd=c;this.Vg=g;this.l=393216;this.L=0},WD.prototype.Y=
function(a,b){return new WD(this.sg,this.nc,this.Dd,b)},WD.prototype.V=function(){return this.Vg},WD.prototype.Ab=function(){return $D(this.nc)},WD.prototype.Pd=function(){return!0},WD.prototype.sb=function(){aE(this.nc);return this.Dd},WD.Ud=function(){return new T(null,4,5,V,[fe(vs,new q(null,2,[Ml,!0,Rf,nf(Sf,nf(new T(null,2,5,V,[Ro,wm],null)))],null)),Ro,wm,ht],null)},WD.Oc=!0,WD.hc="cljs.core.async/t_cljs$core$async16348",WD.jd=function(a,b){return Uc(b,"cljs.core.async/t_cljs$core$async16348")});
return new WD(WE,b,c,Uf)};
function XE(a,b,c){var d=VE(),e=M(b),f=UE(e),g=gq.g(c),l=function(){for(var c=0;;)if(c<e){var l=r(g)?c:f[c],p=Yd(b,l),u=De(p)?p.g?p.g(0):p.call(null,0):null,w=r(u)?function(){var b=p.g?p.g(1):p.call(null,1);return YD(u,b,WE(d,function(b,c,d,e,f){return function(b){b=new T(null,2,5,V,[b,f],null);return a.g?a.g(b):a.call(null,b)}}(c,b,l,p,u,d,e,f,g)))}():XD(p,WE(d,function(b,c,d){return function(b){b=new T(null,2,5,V,[b,d],null);return a.g?a.g(b):a.call(null,b)}}(c,l,p,u,d,e,f,g)));if(r(w))return tE(new T(null,
2,5,V,[G.g?G.g(w):G.call(null,w),function(){var a=u;return r(a)?a:p}()],null));c+=1}else return null}();return r(l)?l:Le(c,tm)&&(l=function(){var a=$D(d);return r(a)?aE(d):a}(),r(l))?tE(new T(null,2,5,V,[tm.g(c),tm],null)):null}
function YE(a,b){var c=QE(1);qE(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!qf(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,IE(c),d=Y;else throw f;}if(!qf(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.D=c;d.g=b;return d}()}(function(){return function(c){var d=c[1];return 7===d?(d=c,d[2]=c[2],d[1]=3,Y):1===d?(c[2]=null,c[1]=2,Y):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=r(null==d)?5:6,Y):13===d?(c[2]=null,c[1]=14,Y):6===d?(d=c[7],FE(c,11,b,d)):3===d?(d=c[2],GE(c,d)):12===d?(c[2]=null,c[1]=2,Y):2===d?EE(c,4,a):11===d?(d=c[2],c[1]=r(d)?12:13,Y):9===d?(c[2]=null,c[1]=10,Y):5===d?(c[1]=r(!0)?8:9,Y):14===d||10===d?(d=c[2],c[2]=d,c[1]=7,Y):8===d?(d=ZD(b),c[2]=d,c[1]=10,Y):null}}(c),c)}(),
f=function(){var a=e.D?e.D():e.call(null);a[6]=c;return a}();return DE(f)}}(c));return b}
function ZE(a,b){var c=QE(1);qE(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!qf(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,IE(c),d=Y;else throw f;}if(!qf(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.D=c;d.g=b;return d}()}(function(){return function(c){var d=c[1];return 7===d?(d=c,d[2]=c[2],d[1]=6,Y):1===d?(d=B(b),c[7]=d,c[2]=null,c[1]=2,Y):4===d?(d=c[7],d=D(d),FE(c,7,a,d)):13===d?(d=c[2],c[2]=d,c[1]=10,Y):6===d?(d=c[2],c[1]=r(d)?8:9,Y):3===d?(d=c[2],GE(c,d)):12===d?(c[2]=null,c[1]=13,Y):2===d?(d=c[7],c[1]=r(d)?4:5,Y):11===d?(d=ZD(a),c[2]=d,c[1]=13,Y):9===d?(c[1]=r(!0)?11:12,Y):5===d?(d=c[7],c[2]=d,c[1]=6,Y):10===d?(d=c[2],c[2]=d,c[1]=3,Y):8===d?(d=c[7],d=F(d),c[7]=d,c[2]=
null,c[1]=2,Y):null}}(c),c)}(),f=function(){var a=e.D?e.D():e.call(null);a[6]=c;return a}();return DE(f)}}(c));return c}function $E(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return aF(arguments[0],arguments[1],arguments[2],3<b.length?new C(b.slice(3),0,null):null)}function aF(a,b,c,d){var e=null!=d&&(d.l&64||d.M)?S(fg,d):d;a[1]=b;b=XE(function(){return function(b){a[2]=b;return DE(a)}}(d,e,e),c,e);return r(b)?(a[2]=G.g?G.g(b):G.call(null,b),Y):null}
function bF(a){return cF(a)}
function cF(a){var b=QE(null),c=QE(1);qE(function(b,c){return function(){var f=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!qf(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,IE(c),d=Y;else throw f;}if(!qf(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.D=c;d.g=b;return d}()}(function(b,c){return function(d){var e=d[1];if(7===e){var f=d[7],g=d[8],v=d[2],E=O(v,0,null),I=O(v,1,null);d[9]=I;d[7]=E;d[8]=v;d[1]=r(null==E)?8:9;return Y}if(1===e){var z=ch(a);d[10]=z;d[2]=null;d[1]=2;return Y}return 4===e?(z=d[10],$E(d,7,z)):6===e?(v=d[2],d[2]=v,d[1]=3,Y):3===e?(v=d[2],GE(d,v)):2===e?(z=d[10],v=0<M(z),d[1]=r(v)?4:5,Y):11===e?(z=d[10],d[11]=d[2],d[10]=z,d[2]=null,d[1]=2,Y):9===e?(f=d[7],FE(d,11,c,f)):5===e?(v=ZD(c),d[2]=v,d[1]=6,Y):
10===e?(v=d[2],d[2]=v,d[1]=6,Y):8===e?(I=d[9],f=d[7],g=d[8],z=d[10],v=Dg(function(){return function(a,b,c,d){return function(a){return Nf(d,a)}}(z,g,f,I,I,f,g,z,e,b,c)}(),z),d[10]=v,d[2]=null,d[1]=2,Y):null}}(b,c),b,c)}(),g=function(){var a=f.D?f.D():f.call(null);a[6]=b;return a}();return DE(g)}}(c,b));return b};function dF(a,b){var c=Array.prototype.slice.call(arguments),d=c.shift();if("undefined"==typeof d)throw Error("[goog.string.format] Template required");return d.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g,function(a,b,d,l,m,n,p,u){if("%"==n)return"%";var w=c.shift();if("undefined"==typeof w)throw Error("[goog.string.format] Not enough arguments");arguments[0]=w;return dF.lc[n].apply(null,arguments)})}dF.lc={};
dF.lc.s=function(a,b,c){return isNaN(c)||""==c||a.length>=c?a:a=-1<b.indexOf("-",0)?a+Ra(" ",c-a.length):Ra(" ",c-a.length)+a};dF.lc.f=function(a,b,c,d,e){d=a.toString();isNaN(e)||""==e||(d=parseFloat(a).toFixed(e));var f;f=0>a?"-":0<=b.indexOf("+")?"+":0<=b.indexOf(" ")?" ":"";0<=a&&(d=f+d);if(isNaN(c)||d.length>=c)return d;d=isNaN(e)?Math.abs(a).toString():Math.abs(a).toFixed(e);a=c-d.length-f.length;0<=b.indexOf("-",0)?d=f+d+Ra(" ",a):(b=0<=b.indexOf("0",0)?"0":" ",d=f+Ra(b,a)+d);return d};
dF.lc.d=function(a,b,c,d,e,f,g,l){return dF.lc.f(parseInt(a,10),b,c,d,0,f,g,l)};dF.lc.i=dF.lc.d;dF.lc.u=dF.lc.d;function eF(a){if(a instanceof Error)throw a;return a}function fF(a){var b=QE(null);a.then(function(a){return function(b){return ZE(a,new T(null,1,5,V,[null!=b?b:Iq],null))}}(b),function(a){return function(b){b=new T(null,1,5,V,[new Vj("error occurred in pdf.js promise",b,null)],null);return ZE(a,b)}}(b));return b}function gF(a,b){return b<a.length?new tf(null,function(){return de(a.item(b),gF(a,b+1))},null,null):null}
function hF(a,b){return b<a.length?new tf(null,function(){return de(a[b],hF(a,b+1))},null,null):null}function iF(a){return X.h(dh,new Xi(null,0,Number.MAX_VALUE,1,null),We.g?We.g(a):We.call(null,a))}function jF(a){return Jf(dF,"rgba(%s,%s,%s,%s)",a)}function kF(a){return Ue(Ye,a)/M(a)}function lF(a,b){var c=QE(null);Py(a,b,function(){return function(a){return TE(c,a)}}(a,b));return c}
function mF(a){return function(b,c){O(a,0,null);O(a,1,null);ef(a,2);for(var d=a;;){var e=O(d,0,null),f=O(d,1,null),g=ef(d,2),l=function(){var a=e.g?e.g(b):e.call(null,b),d=e.g?e.g(c):e.call(null,c);return f.a?f.a(a,d):f.call(null,a,d)}();if(r(function(){var a=0===l;return a?g:a}()))d=g;else return l}}}
function nF(a,b){var c=QE(1);qE(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!qf(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,IE(c),d=Y;else throw f;}if(!qf(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.D=c;d.g=b;return d}()}(function(){return function(c){var d=c[1];if(1===d)return c[2]=null,c[1]=2,Y;if(2===d)return c[1]=4,Y;if(3===d)return d=c[2],GE(c,d);if(4===d)return EE(c,8,b);if(5===d)return c[2]=null,c[1]=6,Y;if(6===d)return d=c[2],c[2]=d,c[1]=3,Y;if(7===d){var d=c[2],e=PE();c[7]=d;return EE(c,9,e)}return 8===d?(d=c[2],FE(c,7,a,d)):9===d?(c[8]=c[2],c[2]=null,c[1]=2,Y):null}}(c),c)}(),f=function(){var a=e.D?e.D():e.call(null);a[6]=c;return a}();return DE(f)}}(c));return a}
function oF(a){return nF(QE(null),a)};function pF(){wy.call(this)}Ba(pF,wy);var qF=Cz("goog.dom.SavedRange");pF.prototype.restore=function(a){this.kd&&Dz(qF,"Disposed SavedRange objects cannot be restored.");var b=this.yf();a||zy(this);return b};function rF(){}function sF(a){if(a.getSelection)return a.getSelection();a=a.document;var b=a.selection;if(b){try{var c=b.createRange();if(c.parentElement){if(c.parentElement().document!=a)return null}else if(!c.length||c.item(0).document!=a)return null}catch(d){return null}return b}return null}function tF(a){for(var b=[],c=0,d=a.od();c<d;c++)b.push(a.Cc(c));return b}rF.prototype.qd=function(){return!1};rF.prototype.getDocument=function(){return $x(Hx?this.Bc():this.oa())};rF.prototype.Zf=function(){return ey(this.getDocument())};
rF.prototype.containsNode=function(a,b){return this.xc(uF(vF(a),void 0),b)};function wF(a,b){mD.call(this,a,b,!0)}Ba(wF,mD);function xF(){}Ba(xF,rF);xF.prototype.xc=function(a,b){var c=tF(this),d=tF(a);return(b?qb:rb)(d,function(a){return qb(c,function(c){return c.xc(a,b)})})};xF.prototype.insertNode=function(a,b){if(b){var c=this.oa();c.parentNode&&c.parentNode.insertBefore(a,c)}else c=this.za(),c.parentNode&&c.parentNode.insertBefore(a,c.nextSibling);return a};function yF(a,b,c,d,e){this.ca=this.ea=null;this.la=this.ma=0;var f;a&&(this.ea=a,this.ma=b,this.ca=c,this.la=d,1==a.nodeType&&"BR"!=a.tagName&&(a=a.childNodes,(b=a[b])?(this.ea=b,this.ma=0):(a.length&&(this.ea=jb(a)),f=!0)),1==c.nodeType&&((this.ca=c.childNodes[d])?this.la=0:this.ca=c));mD.call(this,e?this.ca:this.ea,e,!0);if(f)try{this.next()}catch(g){if(g!=kz)throw g;}}Ba(yF,wF);h=yF.prototype;h.oa=function(){return this.ea};h.za=function(){return this.ca};
h.$d=function(){return this.Cf&&this.node==this.ca&&(!this.la||1!=this.xb)};h.next=function(){if(this.$d())throw kz;return yF.wb.next.call(this)};h.kc=function(a){this.ea=a.ea;this.ca=a.ca;this.ma=a.ma;this.la=a.la;this.Sb=a.Sb;yF.wb.kc.call(this,a)};h.clone=function(){var a=new yF(this.ea,this.ma,this.ca,this.la,this.Sb);a.kc(this);return a};function zF(){}zF.prototype.xc=function(a,b){var c=b&&!a.isCollapsed(),d=a.P;try{return c?0<=this.Eb(d,0,1)&&0>=this.Eb(d,1,0):0<=this.Eb(d,0,0)&&0>=this.Eb(d,1,1)}catch(e){if(!Hx)throw e;return!1}};zF.prototype.containsNode=function(a,b){return this.xc(vF(a),b)};zF.prototype.qc=function(){return new yF(this.oa(),this.Wa(),this.za(),this.jb())};function AF(a){this.P=a}Ba(AF,zF);function BF(a){var b=$x(a).createRange();if(3==a.nodeType)b.setStart(a,0),b.setEnd(a,a.length);else if(CF(a)){for(var c,d=a;(c=d.firstChild)&&CF(c);)d=c;b.setStart(d,0);for(d=a;(c=d.lastChild)&&CF(c);)d=c;b.setEnd(d,1==d.nodeType?d.childNodes.length:d.length)}else c=a.parentNode,a=mb(c.childNodes,a),b.setStart(c,a),b.setEnd(c,a+1);return b}function DF(a,b,c,d){var e=$x(a).createRange();e.setStart(a,b);e.setEnd(c,d);return e}h=AF.prototype;h.clone=function(){return new this.constructor(this.P.cloneRange())};
h.Bc=function(){return this.P.commonAncestorContainer};h.oa=function(){return this.P.startContainer};h.Wa=function(){return this.P.startOffset};h.za=function(){return this.P.endContainer};h.jb=function(){return this.P.endOffset};h.Eb=function(a,b,c){return this.P.compareBoundaryPoints(1==c?1==b?ba.Range.START_TO_START:ba.Range.START_TO_END:1==b?ba.Range.END_TO_START:ba.Range.END_TO_END,a)};h.isCollapsed=function(){return this.P.collapsed};h.Rc=function(){return this.P.toString()};
h.select=function(a){var b=ey($x(this.oa()));this.ge(b.getSelection(),a)};h.ge=function(a){a.removeAllRanges();a.addRange(this.P)};h.surroundContents=function(a){this.P.surroundContents(a);return a};h.insertNode=function(a,b){var c=this.P.cloneRange();c.collapse(b);c.insertNode(a);c.detach();return a};h.collapse=function(a){this.P.collapse(a)};function EF(a){this.P=a}Ba(EF,AF);EF.prototype.ge=function(a,b){!b||this.isCollapsed()?EF.wb.ge.call(this,a,b):(a.collapse(this.za(),this.jb()),a.extend(this.oa(),this.Wa()))};function FF(a,b){this.ca=this.ea=this.bc=null;this.la=this.ma=-1;this.P=a;this.Kg=b}Ba(FF,zF);var GF=Cz("goog.dom.browserrange.IeRange");
function HF(a){var b=$x(a).body.createTextRange();if(1==a.nodeType)b.moveToElementText(a),CF(a)&&!a.childNodes.length&&b.collapse(!1);else{for(var c=0,d=a;d=d.previousSibling;){var e=d.nodeType;if(3==e)c+=d.length;else if(1==e){b.moveToElementText(d);break}}d||b.moveToElementText(a.parentNode);b.collapse(!d);c&&b.move("character",c);b.moveEnd("character",a.length)}return b}h=FF.prototype;h.clone=function(){var a=new FF(this.P.duplicate(),this.Kg);a.bc=this.bc;a.ea=this.ea;a.ca=this.ca;return a};
h.fc=function(){this.bc=this.ea=this.ca=null;this.ma=this.la=-1};
h.Bc=function(){if(!this.bc){var a=this.P.text,b=this.P.duplicate(),c=a.replace(/ +$/,"");(c=a.length-c.length)&&b.moveEnd("character",-c);c=b.parentElement();b=b.htmlText.replace(/(\r\n|\r|\n)+/g," ").length;if(this.isCollapsed()&&0<b)return this.bc=c;for(;b>c.outerHTML.replace(/(\r\n|\r|\n)+/g," ").length;)c=c.parentNode;for(;1==c.childNodes.length&&c.innerText==IF(c.firstChild)&&CF(c.firstChild);)c=c.firstChild;0==a.length&&(c=JF(this,c));this.bc=c}return this.bc};
function JF(a,b){for(var c=b.childNodes,d=0,e=c.length;d<e;d++){var f=c[d];if(CF(f)){var g=HF(f),l=g.htmlText!=f.outerHTML;if(a.isCollapsed()&&l?0<=a.Eb(g,1,1)&&0>=a.Eb(g,1,0):a.P.inRange(g))return JF(a,f)}}return b}h.oa=function(){this.ea||(this.ea=KF(this,1),this.isCollapsed()&&(this.ca=this.ea));return this.ea};h.Wa=function(){0>this.ma&&(this.ma=LF(this,1),this.isCollapsed()&&(this.la=this.ma));return this.ma};
h.za=function(){if(this.isCollapsed())return this.oa();this.ca||(this.ca=KF(this,0));return this.ca};h.jb=function(){if(this.isCollapsed())return this.Wa();0>this.la&&(this.la=LF(this,0),this.isCollapsed()&&(this.ma=this.la));return this.la};h.Eb=function(a,b,c){return this.P.compareEndPoints((1==b?"Start":"End")+"To"+(1==c?"Start":"End"),a)};
function KF(a,b,c){c=c||a.Bc();if(!c||!c.firstChild)return c;for(var d=1==b,e=0,f=c.childNodes.length;e<f;e++){var g=d?e:f-e-1,l=c.childNodes[g],m;try{m=vF(l)}catch(p){continue}var n=m.P;if(a.isCollapsed())if(!CF(l)){if(0==a.Eb(n,1,1)){a.ma=a.la=g;break}}else{if(m.xc(a))return KF(a,b,l)}else{if(a.xc(m)){if(!CF(l)){d?a.ma=g:a.la=g+1;break}return KF(a,b,l)}if(0>a.Eb(n,1,0)&&0<a.Eb(n,0,1))return KF(a,b,l)}}return c}
function LF(a,b){var c=1==b,d=c?a.oa():a.za();if(1==d.nodeType){for(var d=d.childNodes,e=d.length,f=c?1:-1,g=c?0:e-1;0<=g&&g<e;g+=f){var l=d[g];if(!CF(l)&&0==a.P.compareEndPoints((1==b?"Start":"End")+"To"+(1==b?"Start":"End"),vF(l).P))return c?g:g+1}return-1==g?0:g}e=a.P.duplicate();f=HF(d);e.setEndPoint(c?"EndToEnd":"StartToStart",f);e=e.text.length;return c?d.length-e:e}function IF(a){return 3==a.nodeType?a.nodeValue:a.innerText}
h.isCollapsed=function(){return 0==this.P.compareEndPoints("StartToEnd",this.P)};h.Rc=function(){return this.P.text};h.select=function(){this.P.select()};function MF(a,b,c){c=c||Yx(a.parentElement());var d,e=d=b.id;d||(d=b.id="goog_"+Ta++);a.pasteHTML(b.outerHTML);(b=ia(d)?c.Ac.getElementById(d):d)&&(e||b.removeAttribute("id"));return b}h.surroundContents=function(a){jy(a);a.innerHTML=this.P.htmlText;(a=MF(this.P,a))&&this.P.moveToElementText(a);this.fc();return a};
h.insertNode=function(a,b){var c,d=this.P.duplicate();c=a;var e;e=e||Yx(d.parentElement());var f;1!=c.nodeType&&(f=!0,c=e.Hg("DIV",null,c));d.collapse(b);c=MF(d,c,e);if(f){d=c.firstChild;if((f=c.parentNode)&&11!=f.nodeType)if(c.removeNode)c.removeNode(!1);else{for(;e=c.firstChild;)f.insertBefore(e,c);jy(c)}c=d}this.fc();return c};h.collapse=function(a){this.P.collapse(a);a?(this.ca=this.ea,this.la=this.ma):(this.ea=this.ca,this.ma=this.la)};function NF(a){this.P=a}Ba(NF,AF);NF.prototype.ge=function(a){a.collapse(this.oa(),this.Wa());this.za()==this.oa()&&this.jb()==this.Wa()||a.extend(this.za(),this.jb());0==a.rangeCount&&a.addRange(this.P)};function OF(a){this.P=a}Ba(OF,AF);OF.prototype.Eb=function(a,b,c){return Qx("528")?OF.wb.Eb.call(this,a,b,c):this.P.compareBoundaryPoints(1==c?1==b?ba.Range.START_TO_START:ba.Range.END_TO_START:1==b?ba.Range.START_TO_END:ba.Range.END_TO_END,a)};OF.prototype.ge=function(a,b){b?a.setBaseAndExtent(this.za(),this.jb(),this.oa(),this.Wa()):a.setBaseAndExtent(this.oa(),this.Wa(),this.za(),this.jb())};function PF(a){return Wx?new FF(a,$x(a.parentElement())):Kx?new OF(a):Jx?new EF(a):Gx?new NF(a):new AF(a)}function vF(a){if(!Hx||9<=Sx)a=Kx?new OF(BF(a)):Jx?new EF(BF(a)):Gx?new NF(BF(a)):new AF(BF(a));else{var b=new FF(HF(a),$x(a));if(CF(a)){for(var c,d=a;(c=d.firstChild)&&CF(c);)d=c;b.ea=d;b.ma=0;for(d=a;(c=d.lastChild)&&CF(c);)d=c;b.ca=d;b.la=1==d.nodeType?d.childNodes.length:d.length;b.bc=a}else b.ea=b.ca=b.bc=a.parentNode,b.ma=mb(b.bc.childNodes,a),b.la=b.ma+1;a=b}return a}
function CF(a){return hy(a)||3==a.nodeType};function QF(){this.la=this.ca=this.ma=this.ea=this.sc=null;this.Sb=!1}Ba(QF,rF);function uF(a,b){var c=new QF;c.sc=a;c.Sb=!!b;return c}h=QF.prototype;h.clone=function(){var a=new QF;a.sc=this.sc&&this.sc.clone();a.ea=this.ea;a.ma=this.ma;a.ca=this.ca;a.la=this.la;a.Sb=this.Sb;return a};h.nf=function(){return"text"};h.Vd=function(){return RF(this).P};h.fc=function(){this.ea=this.ma=this.ca=this.la=null};h.od=function(){return 1};h.Cc=function(){return this};
function RF(a){var b;if(!(b=a.sc)){b=a.oa();var c=a.Wa(),d=a.za(),e=a.jb();if(!Hx||9<=Sx)b=Kx?new OF(DF(b,c,d,e)):Jx?new EF(DF(b,c,d,e)):Gx?new NF(DF(b,c,d,e)):new AF(DF(b,c,d,e));else{var f=b,g=c,l=d,m=e,n=!1;1==f.nodeType&&(g>f.childNodes.length&&Dz(GF,"Cannot have startOffset \x3e startNode child count"),g=f.childNodes[g],n=!g,f=g||f.lastChild||f,g=0);var p=HF(f);g&&p.move("character",g);f==l&&g==m?p.collapse(!0):(n&&p.collapse(!1),n=!1,1==l.nodeType&&(m>l.childNodes.length&&Dz(GF,"Cannot have endOffset \x3e endNode child count"),
l=(g=l.childNodes[m])||l.lastChild||l,m=0,n=!g),f=HF(l),f.collapse(!n),m&&f.moveEnd("character",m),p.setEndPoint("EndToEnd",f));m=new FF(p,$x(b));m.ea=b;m.ma=c;m.ca=d;m.la=e;b=m}b=a.sc=b}return b}h.Bc=function(){return RF(this).Bc()};h.oa=function(){return this.ea||(this.ea=RF(this).oa())};h.Wa=function(){return null!=this.ma?this.ma:this.ma=RF(this).Wa()};h.za=function(){return this.ca||(this.ca=RF(this).za())};h.jb=function(){return null!=this.la?this.la:this.la=RF(this).jb()};h.qd=function(){return this.Sb};
h.xc=function(a,b){var c=a.nf();return"text"==c?RF(this).xc(RF(a),b):"control"==c?(c=SF(a),(b?qb:rb)(c,function(a){return this.containsNode(a,b)},this)):!1};h.isCollapsed=function(){return RF(this).isCollapsed()};h.Rc=function(){return RF(this).Rc()};h.qc=function(){return new yF(this.oa(),this.Wa(),this.za(),this.jb())};h.select=function(){RF(this).select(this.Sb)};h.surroundContents=function(a){a=RF(this).surroundContents(a);this.fc();return a};
h.insertNode=function(a,b){var c=RF(this).insertNode(a,b);this.fc();return c};h.zf=function(){return new TF(this)};h.collapse=function(a){a=this.qd()?!a:a;this.sc&&this.sc.collapse(a);a?(this.ca=this.ea,this.la=this.ma):(this.ea=this.ca,this.ma=this.la);this.Sb=!1};function TF(a){wy.call(this);this.Hf=a.qd()?a.za():a.oa();this.tg=a.qd()?a.jb():a.Wa();this.Wf=a.qd()?a.oa():a.za();this.Og=a.qd()?a.Wa():a.jb()}Ba(TF,pF);
TF.prototype.yf=function(){var a=this.Hf,b=this.tg,c=this.Wf,d=this.Og,e=new QF;e.Sb=UF(a,b,c,d);if(pa(a)&&1==a.nodeType&&!hy(a))var f=a.parentNode,b=mb(f.childNodes,a),a=f;pa(c)&&1==c.nodeType&&!hy(c)&&(f=c.parentNode,d=mb(f.childNodes,c),c=f);e.Sb?(e.ea=c,e.ma=d,e.ca=a,e.la=b):(e.ea=a,e.ma=b,e.ca=c,e.la=d);return e};TF.prototype.Ob=function(){TF.wb.Ob.call(this);this.Wf=this.Hf=null};function VF(){this.he=this.cb=this.P=null}Ba(VF,xF);function WF(a){var b=new VF;b.P=a;return b}function XF(a){for(var b=$x(arguments[0]).body.createControlRange(),c=0,d=arguments.length;c<d;c++)b.addElement(arguments[c]);return WF(b)}h=VF.prototype;h.fc=function(){this.he=this.cb=null};h.clone=function(){return XF.apply(this,SF(this))};h.nf=function(){return"control"};h.Vd=function(){return this.P||document.body.createControlRange()};h.od=function(){return this.P?this.P.length:0};
h.Cc=function(a){a=this.P.item(a);return uF(vF(a),void 0)};h.Bc=function(){return oy.apply(null,SF(this))};h.oa=function(){return YF(this)[0]};h.Wa=function(){return 0};h.za=function(){var a=YF(this),b=jb(a);return sb(a,function(a){return ky(a,b)})};h.jb=function(){return this.za().childNodes.length};function SF(a){if(!a.cb&&(a.cb=[],a.P))for(var b=0;b<a.P.length;b++)a.cb.push(a.P.item(b));return a.cb}
function YF(a){a.he||(a.he=SF(a).concat(),a.he.sort(function(a,c){return a.sourceIndex-c.sourceIndex}));return a.he}h.isCollapsed=function(){return!this.P||!this.P.length};h.Rc=function(){return""};h.qc=function(){return new ZF(this)};h.select=function(){this.P&&this.P.select()};h.zf=function(){return new $F(this)};h.collapse=function(){this.P=null;this.fc()};function $F(a){this.cb=SF(a)}Ba($F,pF);
$F.prototype.yf=function(){for(var a=(this.cb.length?$x(this.cb[0]):document).body.createControlRange(),b=0,c=this.cb.length;b<c;b++)a.addElement(this.cb[b]);return WF(a)};$F.prototype.Ob=function(){$F.wb.Ob.call(this);delete this.cb};function ZF(a){this.cb=this.ca=this.ea=null;a&&(this.cb=YF(a),this.ea=this.cb.shift(),this.ca=jb(this.cb)||this.ea);mD.call(this,this.ea,!1,!0)}Ba(ZF,wF);h=ZF.prototype;h.oa=function(){return this.ea};h.za=function(){return this.ca};
h.$d=function(){return!this.depth&&!this.cb.length};h.next=function(){if(this.$d())throw kz;if(!this.depth){var a=this.cb.shift();this.setPosition(a,1,1);return a}return ZF.wb.next.call(this)};h.kc=function(a){this.cb=a.cb;this.ea=a.ea;this.ca=a.ca;ZF.wb.kc.call(this,a)};h.clone=function(){var a=new ZF(null);a.kc(this);return a};function aG(){this.vb=Cz("goog.dom.MultiRange");this.Ib=[];this.td=[];this.Be=this.vd=null}Ba(aG,xF);function bG(a){var b=new aG;b.td=a;b.Ib=pb(a,function(a){return a.Vd()});return b}h=aG.prototype;h.fc=function(){this.td=[];this.Be=this.vd=null};h.clone=function(){var a=this.Ib,b=new aG;b.Ib=tb(a);return b};h.nf=function(){return"mutli"};h.Vd=function(){if(1<this.Ib.length){var a=this.vb;a&&a.log(vz,"getBrowserRangeObject called on MultiRange with more than 1 range",void 0)}return this.Ib[0]};
h.od=function(){return this.Ib.length};h.Cc=function(a){this.td[a]||(this.td[a]=uF(PF(this.Ib[a]),void 0));return this.td[a]};h.Bc=function(){if(!this.Be){for(var a=[],b=0,c=this.od();b<c;b++)a.push(this.Cc(b).Bc());this.Be=oy.apply(null,a)}return this.Be};function cG(a){a.vd||(a.vd=tF(a),a.vd.sort(function(a,c){var d=a.oa(),e=a.Wa(),f=c.oa(),g=c.Wa();return d==f&&e==g?0:UF(d,e,f,g)?1:-1}));return a.vd}h.oa=function(){return cG(this)[0].oa()};h.Wa=function(){return cG(this)[0].Wa()};h.za=function(){return jb(cG(this)).za()};
h.jb=function(){return jb(cG(this)).jb()};h.isCollapsed=function(){return 0==this.Ib.length||1==this.Ib.length&&this.Cc(0).isCollapsed()};h.Rc=function(){return pb(tF(this),function(a){return a.Rc()}).join("")};h.qc=function(){return new dG(this)};h.select=function(){var a=sF(this.Zf());a.removeAllRanges();for(var b=0,c=this.od();b<c;b++)a.addRange(this.Cc(b).Vd())};h.zf=function(){return new eG(this)};
h.collapse=function(a){if(!this.isCollapsed()){var b=a?this.Cc(0):this.Cc(this.od()-1);this.fc();b.collapse(a);this.td=[b];this.vd=[b];this.Ib=[b.Vd()]}};function eG(a){this.Af=pb(tF(a),function(a){return a.zf()})}Ba(eG,pF);eG.prototype.yf=function(){var a=pb(this.Af,function(a){return a.restore()});return bG(a)};eG.prototype.Ob=function(){eG.wb.Ob.call(this);nb(this.Af,function(a){zy(a)});delete this.Af};
function dG(a){this.Ec=null;this.Ce=0;a&&(this.Ec=pb(cG(a),function(a){return mz(a)}));wF.call(this,a?this.oa():null,!1)}Ba(dG,wF);h=dG.prototype;h.oa=function(){return this.Ec[0].oa()};h.za=function(){return jb(this.Ec).za()};h.$d=function(){return this.Ec[this.Ce].$d()};h.next=function(){try{var a=this.Ec[this.Ce],b=a.next();this.setPosition(a.node,a.xb,a.depth);return b}catch(c){if(c!==kz||this.Ec.length-1==this.Ce)throw c;this.Ce++;return this.next()}};
h.kc=function(a){this.Ec=tb(a.Ec);dG.wb.kc.call(this,a)};h.clone=function(){var a=new dG(null);a.kc(this);return a};function fG(a){var b,c=!1;if(a.createRange)try{b=a.createRange()}catch(e){return null}else if(a.rangeCount){if(1<a.rangeCount){c=new aG;b=0;for(var d=a.rangeCount;b<d;b++)c.Ib.push(a.getRangeAt(b));return c}b=a.getRangeAt(0);c=UF(a.anchorNode,a.anchorOffset,a.focusNode,a.focusOffset)}else return null;return(a=b)&&a.addElement?WF(a):uF(PF(a),c)}function gG(){var a=sF(window||window);if(a)if(a.empty)try{a.empty()}catch(b){}else try{a.removeAllRanges()}catch(b){}}
function UF(a,b,c,d){if(a==c)return d<b;var e;if(1==a.nodeType&&b)if(e=a.childNodes[b])a=e,b=0;else if(ky(a,c))return!0;if(1==c.nodeType&&d)if(e=c.childNodes[d])c=e,d=0;else if(ky(c,a))return!1;return 0<(ly(a,c)||b-d)};function hG(a,b,c,d,e){this.identifier=a;this.value=b;this.O=c;this.G=d;this.A=e;this.l=2229667594;this.L=8192}h=hG.prototype;h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){switch(b instanceof P?b.Va:null){case "identifier":return this.identifier;case "value":return this.value;default:return A.h(this.G,b,c)}};
h.U=function(a,b,c){return cj(b,function(){return function(a){return cj(b,jj,""," ","",c,a)}}(this),"#garden.types.CSSAtRule{",", ","}",c,Ff.a(new T(null,2,5,V,[new T(null,2,5,V,[mr,this.identifier],null),new T(null,2,5,V,[Sm,this.value],null)],null),this.G))};h.ib=function(){return new Bh(0,this,2,new T(null,2,5,V,[mr,Sm],null),od(this.G))};h.V=function(){return this.O};h.Ea=function(){return new hG(this.identifier,this.value,this.O,this.G,this.A)};h.ba=function(){return 2+M(this.G)};
h.S=function(){var a=this.A;return null!=a?a:this.A=a=ff(this)};h.K=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?sh(this,b):c:b;return r(c)?!0:!1};h.Lb=function(a,b){return Le(new Oi(null,new q(null,2,[Sm,null,mr,null],null),null),b)?qe.a(fe(Bg.a(Uf,this),this.O),b):new hG(this.identifier,this.value,this.O,Of(qe.a(this.G,b)),null)};
h.rb=function(a,b,c){return r(qf.a?qf.a(mr,b):qf.call(null,mr,b))?new hG(c,this.value,this.O,this.G,null):r(qf.a?qf.a(Sm,b):qf.call(null,Sm,b))?new hG(this.identifier,c,this.O,this.G,null):new hG(this.identifier,this.value,this.O,oe.h(this.G,b,c),null)};h.Z=function(){return B(Ff.a(new T(null,2,5,V,[new T(null,2,5,V,[mr,this.identifier],null),new T(null,2,5,V,[Sm,this.value],null)],null),this.G))};h.Y=function(a,b){return new hG(this.identifier,this.value,b,this.G,this.A)};
h.ia=function(a,b){return De(b)?oc(this,gc.a(b,0),gc.a(b,1)):Wb(x,this,b)};var iG=function iG(b){if(null!=b&&null!=b.Xf)return b.Xf();var c=iG[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=iG._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("ToString.to-str",b);};P.prototype.Xf=function(){return sf(this)};iG._=function(a){return""+t(a)};iG["null"]=function(){return""};function jG(a){return S(t,X.a(iG,a))}function kG(a){return Be(a)&&!Ce(a)}function lG(a){var b=a instanceof hG;return r(b)?Gd.a(mr.g(a),qt):b}
function mG(a){var b=a instanceof hG;return r(b)?Gd.a(mr.g(a),yq):b}function nG(a,b){var c=iG(a);return Gd.a("-",ke(c))?[t(c),t(b)].join(""):[t(c),t("-"),t(b)].join("")}function oG(a,b){var c=iG(a);return Gd.a("-",D(c))?nG(c,b):nG([t("-"),t(c)].join(""),b)}function pG(a,b,c){b=a<=b?new T(null,2,5,V,[a,b],null):new T(null,2,5,V,[b,a],null);a=O(b,0,null);b=O(b,1,null);c=b<c?b:c;return a>c?a:c}
function qG(a){var b=ch(a),c=function(a){return function f(b){var c=function(a){return function(b){for(var c=M(b)-1;;){if(Gd.a(c,-1))return null;var d=F(b.g?b.g(c):b.call(null,c));if(d)return oe.h(b,c,d);d=c-1;b=oe.h(b,c,a.g?a.g(c):a.call(null,c));c=d}}}(a);return r(b)?de(X.a(D,b),new tf(null,function(a){return function(){return f(a(b))}}(c,a),null,null)):null}}(b);return Vf(B,a)?new tf(null,function(a,b){return function(){return b(a)}}(b,c),null,null):null};function rG(a){throw Error(S(t,a));}bj("^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+))(N)?$");bj("^([-+]?[0-9]+)/([0-9]+)$");bj("^([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$");bj("^[:]?([^0-9/].*/)?([^0-9/][^/]*)$");bj("^[0-9A-Fa-f]{2}$");bj("^[0-9A-Fa-f]{4}$");
var sG=function(a,b){return function(c,d){return A.a(r(d)?b:a,c)}}(new T(null,13,5,V,[null,31,28,31,30,31,30,31,31,30,31,30,31],null),new T(null,13,5,V,[null,31,29,31,30,31,30,31,31,30,31,30,31],null)),tG=/(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;function uG(a){a=parseInt(a,10);return Mb(isNaN(a))?a:null}
function vG(a,b,c,d){a<=b&&b<=c||rG(N([[t(d),t(" Failed:  "),t(a),t("\x3c\x3d"),t(b),t("\x3c\x3d"),t(c)].join("")],0));return b}
function wG(a){var b=$i(tG,a);O(b,0,null);var c=O(b,1,null),d=O(b,2,null),e=O(b,3,null),f=O(b,4,null),g=O(b,5,null),l=O(b,6,null),m=O(b,7,null),n=O(b,8,null),p=O(b,9,null),u=O(b,10,null);if(Mb(b))return rG(N([[t("Unrecognized date/time syntax: "),t(a)].join("")],0));var w=uG(c),v=function(){var a=uG(d);return r(a)?a:1}();a=function(){var a=uG(e);return r(a)?a:1}();var b=function(){var a=uG(f);return r(a)?a:0}(),c=function(){var a=uG(g);return r(a)?a:0}(),E=function(){var a=uG(l);return r(a)?a:0}(),
I=function(){var a;a:if(Gd.a(3,M(m)))a=m;else if(3<M(m))a=m.substring(0,3);else for(a=new db(m);;)if(3>a.uc.length)a=a.append("0");else{a=a.toString();break a}a=uG(a);return r(a)?a:0}(),n=(Gd.a(n,"-")?-1:1)*(60*function(){var a=uG(p);return r(a)?a:0}()+function(){var a=uG(u);return r(a)?a:0}());return new T(null,8,5,V,[w,vG(1,v,12,"timestamp month field must be in range 1..12"),vG(1,a,function(){var a;a=0===(w%4+4)%4;r(a)&&(a=Mb(0===(w%100+100)%100),a=r(a)?a:0===(w%400+400)%400);return sG.a?sG.a(v,
a):sG.call(null,v,a)}(),"timestamp day field must be in range 1..last day in month"),vG(0,b,23,"timestamp hour field must be in range 0..23"),vG(0,c,59,"timestamp minute field must be in range 0..59"),vG(0,E,Gd.a(c,59)?60:59,"timestamp second field must be in range 0..60"),vG(0,I,999,"timestamp millisecond field must be in range 0..999"),n],null)}
var xG=new q(null,4,["inst",function(a){var b;if("string"===typeof a)if(b=wG(a),r(b)){a=O(b,0,null);var c=O(b,1,null),d=O(b,2,null),e=O(b,3,null),f=O(b,4,null),g=O(b,5,null),l=O(b,6,null);b=O(b,7,null);b=new Date(Date.UTC(a,c-1,d,e,f,g,l)-6E4*b)}else b=rG(N([[t("Unrecognized date/time syntax: "),t(a)].join("")],0));else b=rG(N(["Instance literal expects a string for its timestamp."],0));return b},"uuid",function(a){return"string"===typeof a?Tj(a):rG(N(["UUID literal expects a string as its representation."],
0))},"queue",function(a){return De(a)?Bg.a(ph,a):rG(N(["Queue literal expects a vector for its elements."],0))},"js",function(a){if(De(a)){var b=[];a=B(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.N(null,e);b.push(f);e+=1}else if(a=B(a))c=a,Ee(c)?(a=gd(c),e=hd(c),c=a,d=M(a),a=e):(a=D(c),b.push(a),a=F(c),c=null,d=0),e=0;else break;return b}if(Be(a)){b={};a=B(a);c=null;for(e=d=0;;)if(e<d){var g=c.N(null,e),f=O(g,0,null),g=O(g,1,null);b[sf(f)]=g;e+=1}else if(a=B(a))Ee(a)?(d=gd(a),a=hd(a),c=d,d=M(d)):
(d=D(a),c=O(d,0,null),d=O(d,1,null),b[sf(c)]=d,a=F(a),c=null,d=0),e=0;else break;return b}return rG(N([[t("JS literal expects a vector or map containing "),t("only string or unqualified keyword keys")].join("")],0))}],null);eg||dg.call(null,xG);eg||dg.call(null,null);Ri([ak,Wk,qn,Rn,rf.g("%"),Vo,eu]);
pe([ak,Ck,Wk,qn,xn,yn,Qn,Rn,rf.g("%"),to,Jo,Vo,ap,Ys,ft,wt,eu],[new q(null,3,[ak,1,Wk,2.83464567,qn,3.7795275591],null),new q(null,1,[Ck,1],null),new q(null,2,[Wk,1,qn,1.3333333333],null),new q(null,1,[qn,1],null),new q(null,1,[xn,1],null),new q(null,1,[yn,1],null),new q(null,2,[Qn,1,Ck,.001],null),new q(null,4,[ak,4.23333333,Rn,1,Wk,12,qn,16],null),Oh([rf.g("%"),1],!0,!1),new q(null,2,[Ys,1E3,to,1],null),new q(null,4,[Jo,1,wt,1.111111111,ft,.0174532925,ap,.002777778],null),new q(null,5,[Vo,1,ak,
10,Rn,2.36220473,Wk,28.3464567,qn,37.795275591],null),new q(null,1,[ap,1],null),new q(null,1,[Ys,1],null),new q(null,2,[ft,1,ap,.159154943],null),new q(null,3,[wt,1,ft,63.661977237,ap,.0025],null),new q(null,6,[Vo,2.54,eu,1,ak,25.4,Rn,6,Wk,72,qn,96],null)]);function yG(){}var Z=function Z(b){if(null!=b&&null!=b.W)return b.W(b);var c=Z[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Z._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("ICSSSelector.css-selector",b);};function og(a){return null!=a?a.lf?!0:a.Qd?!1:Nb(yG,a):Nb(yG,a)}yG.string=!0;Z.string=function(a){return a};P.prototype.lf=!0;P.prototype.W=function(){return sf(this)};y.prototype.lf=!0;y.prototype.W=function(){return sf(this)};
function zG(a,b,c,d){this.Yc=a;this.O=b;this.G=c;this.A=d;this.l=2229667595;this.L=8192}h=zG.prototype;h.T=function(a,b){return mc.h(this,b,null)};h.R=function(a,b,c){switch(b instanceof P?b.Va:null){case "selector":return this.Yc;default:return A.h(this.G,b,c)}};h.U=function(a,b,c){return cj(b,function(){return function(a){return cj(b,jj,""," ","",c,a)}}(this),"#garden.selectors.CSSSelector{",", ","}",c,Ff.a(new T(null,1,5,V,[new T(null,2,5,V,[zk,this.Yc],null)],null),this.G))};
h.ib=function(){return new Bh(0,this,1,new T(null,1,5,V,[zk],null),od(this.G))};h.V=function(){return this.O};h.Ea=function(){return new zG(this.Yc,this.O,this.G,this.A)};h.ba=function(){return 1+M(this.G)};h.S=function(){var a=this.A;return null!=a?a:this.A=a=ff(this)};h.K=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?sh(this,b):c:b;return r(c)?!0:!1};h.lf=!0;h.W=function(){return Z(zk.g(this))};
h.Lb=function(a,b){return Le(new Oi(null,new q(null,1,[zk,null],null),null),b)?qe.a(fe(Bg.a(Uf,this),this.O),b):new zG(this.Yc,this.O,Of(qe.a(this.G,b)),null)};h.rb=function(a,b,c){return r(qf.a?qf.a(zk,b):qf.call(null,zk,b))?new zG(c,this.O,this.G,null):new zG(this.Yc,this.O,oe.h(this.G,b,c),null)};h.Z=function(){return B(Ff.a(new T(null,1,5,V,[new T(null,2,5,V,[zk,this.Yc],null)],null),this.G))};h.Y=function(a,b){return new zG(this.Yc,b,this.G,this.A)};
h.ia=function(a,b){return De(b)?oc(this,gc.a(b,0),gc.a(b,1)):Wb(x,this,b)};
h.call=function(){function a(a,b,c,d,e,f,g,l,m,z,p,n,v,u,w,K,L,E,I,Q,R){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z)),t(Z(p)),t(Z(n)),t(Z(v)),t(Z(u)),t(Z(w)),t(Z(K)),t(Z(L)),t(Z(E)),t(Z(I)),t(Z(Q)),t(Z(R))].join(""),null,null,null)}function b(a,b,c,d,e,f,g,l,m,z,p,n,v,u,w,K,L,E,I,Q){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z)),t(Z(p)),t(Z(n)),t(Z(v)),t(Z(u)),t(Z(w)),t(Z(K)),t(Z(L)),t(Z(E)),
t(Z(I)),t(Z(Q))].join(""),null,null,null)}function c(a,b,c,d,e,f,g,l,m,z,p,n,v,u,w,K,L,E,I){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z)),t(Z(p)),t(Z(n)),t(Z(v)),t(Z(u)),t(Z(w)),t(Z(K)),t(Z(L)),t(Z(E)),t(Z(I))].join(""),null,null,null)}function d(a,b,c,d,e,f,g,l,m,z,p,n,v,u,w,K,L,E){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z)),t(Z(p)),t(Z(n)),t(Z(v)),t(Z(u)),t(Z(w)),t(Z(K)),t(Z(L)),t(Z(E))].join(""),
null,null,null)}function e(a,b,c,d,e,f,g,l,m,z,p,n,v,u,w,K,L){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z)),t(Z(p)),t(Z(n)),t(Z(v)),t(Z(u)),t(Z(w)),t(Z(K)),t(Z(L))].join(""),null,null,null)}function f(a,b,c,d,e,f,g,l,m,z,p,n,v,u,w,K){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z)),t(Z(p)),t(Z(n)),t(Z(v)),t(Z(u)),t(Z(w)),t(Z(K))].join(""),null,null,null)}function g(a,b,c,d,e,f,g,l,m,z,p,
n,v,u,w){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z)),t(Z(p)),t(Z(n)),t(Z(v)),t(Z(u)),t(Z(w))].join(""),null,null,null)}function l(a,b,c,d,e,f,g,l,m,z,p,n,v,u){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z)),t(Z(p)),t(Z(n)),t(Z(v)),t(Z(u))].join(""),null,null,null)}function m(a,b,c,d,e,f,g,l,m,z,p,n,v){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),
t(Z(m)),t(Z(z)),t(Z(p)),t(Z(n)),t(Z(v))].join(""),null,null,null)}function n(a,b,c,d,e,f,g,l,m,z,p,n){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z)),t(Z(p)),t(Z(n))].join(""),null,null,null)}function p(a,b,c,d,e,f,g,l,m,z,p){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z)),t(Z(p))].join(""),null,null,null)}function u(a,b,c,d,e,f,g,l,m,z){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),
t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(z))].join(""),null,null,null)}function w(a,b,c,d,e,f,g,l,m){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m))].join(""),null,null,null)}function v(a,b,c,d,e,f,g,l){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l))].join(""),null,null,null)}function E(a,b,c,d,e,f,g){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g))].join(""),null,null,null)}function I(a,
b,c,d,e,f){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f))].join(""),null,null,null)}function z(a,b,c,d,e){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e))].join(""),null,null,null)}function L(a,b,c,d){return new zG([t(this.W(null)),t(Z(b)),t(Z(c)),t(Z(d))].join(""),null,null,null)}function K(a,b,c){return new zG([t(this.W(null)),t(Z(b)),t(Z(c))].join(""),null,null,null)}function Q(a,b){return new zG([t(this.W(null)),t(Z(b))].join(""),null,null,null)}var R=null,
R=function(R,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb){switch(arguments.length){case 1:return this;case 2:return Q.call(this,0,J);case 3:return K.call(this,0,J,ma);case 4:return L.call(this,0,J,ma,W);case 5:return z.call(this,0,J,ma,W,da);case 6:return I.call(this,0,J,ma,W,da,fa);case 7:return E.call(this,0,J,ma,W,da,fa,ka);case 8:return v.call(this,0,J,ma,W,da,fa,ka,U);case 9:return w.call(this,0,J,ma,W,da,fa,ka,U,oa);case 10:return u.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka);case 11:return p.call(this,
0,J,ma,W,da,fa,ka,U,oa,Ka,ta);case 12:return n.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua);case 13:return m.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua,va);case 14:return l.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea);case 15:return g.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La);case 16:return f.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa);case 17:return e.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua);case 18:return d.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,
Qa,Ua,gb);case 19:return c.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb,kb);case 20:return b.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb);case 21:return a.call(this,0,J,ma,W,da,fa,ka,U,oa,Ka,ta,ua,va,Ea,La,Qa,Ua,gb,kb,Xb,Lb)}throw Error("Invalid arity: "+arguments.length);};R.g=function(){return this};R.a=Q;R.h=K;R.J=L;R.X=z;R.xa=I;R.Sa=E;R.Ta=v;R.Ua=w;R.Ha=u;R.Ia=p;R.Ja=n;R.Ka=m;R.La=l;R.Ma=g;R.Na=f;R.Oa=e;R.Pa=d;R.Qa=c;R.Ra=b;R.re=a;return R}();
h.apply=function(a,b){return this.call.apply(this,[this].concat(Sb(b)))};h.D=function(){return this};h.g=function(a){return new zG([t(this.W(null)),t(Z(a))].join(""),null,null,null)};h.a=function(a,b){return new zG([t(this.W(null)),t(Z(a)),t(Z(b))].join(""),null,null,null)};h.h=function(a,b,c){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c))].join(""),null,null,null)};h.J=function(a,b,c,d){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d))].join(""),null,null,null)};
h.X=function(a,b,c,d,e){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e))].join(""),null,null,null)};h.xa=function(a,b,c,d,e,f){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f))].join(""),null,null,null)};h.Sa=function(a,b,c,d,e,f,g){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g))].join(""),null,null,null)};
h.Ta=function(a,b,c,d,e,f,g,l){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l))].join(""),null,null,null)};h.Ua=function(a,b,c,d,e,f,g,l,m){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m))].join(""),null,null,null)};h.Ha=function(a,b,c,d,e,f,g,l,m,n){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n))].join(""),null,null,null)};
h.Ia=function(a,b,c,d,e,f,g,l,m,n,p){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n)),t(Z(p))].join(""),null,null,null)};h.Ja=function(a,b,c,d,e,f,g,l,m,n,p,u){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n)),t(Z(p)),t(Z(u))].join(""),null,null,null)};
h.Ka=function(a,b,c,d,e,f,g,l,m,n,p,u,w){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n)),t(Z(p)),t(Z(u)),t(Z(w))].join(""),null,null,null)};h.La=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n)),t(Z(p)),t(Z(u)),t(Z(w)),t(Z(v))].join(""),null,null,null)};
h.Ma=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n)),t(Z(p)),t(Z(u)),t(Z(w)),t(Z(v)),t(Z(E))].join(""),null,null,null)};h.Na=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n)),t(Z(p)),t(Z(u)),t(Z(w)),t(Z(v)),t(Z(E)),t(Z(I))].join(""),null,null,null)};
h.Oa=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n)),t(Z(p)),t(Z(u)),t(Z(w)),t(Z(v)),t(Z(E)),t(Z(I)),t(Z(z))].join(""),null,null,null)};h.Pa=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n)),t(Z(p)),t(Z(u)),t(Z(w)),t(Z(v)),t(Z(E)),t(Z(I)),t(Z(z)),t(Z(L))].join(""),null,null,null)};
h.Qa=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n)),t(Z(p)),t(Z(u)),t(Z(w)),t(Z(v)),t(Z(E)),t(Z(I)),t(Z(z)),t(Z(L)),t(Z(K))].join(""),null,null,null)};
h.Ra=function(a,b,c,d,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q){return new zG([t(this.W(null)),t(Z(a)),t(Z(b)),t(Z(c)),t(Z(d)),t(Z(e)),t(Z(f)),t(Z(g)),t(Z(l)),t(Z(m)),t(Z(n)),t(Z(p)),t(Z(u)),t(Z(w)),t(Z(v)),t(Z(E)),t(Z(I)),t(Z(z)),t(Z(L)),t(Z(K)),t(Z(Q))].join(""),null,null,null)};function AG(a){return new zG(a,null,null,null)}
bh([zl,dq,Om,Xt,Wp,qm,Zj,st,ok,Im,pt,El,Ek,du,ro,tr,Pm,Pk,Ct,Ds,it,kq,Nq,cn,dm,zs,fo,Br,Rl,Qo,Cp,xk,im,xm,rm,$q,Xj,pk,Wt,Ak,bs,pr,Ts,is,Lq,ik,kn,Yl,$k,yp,Gl,ek,Vq,Hp,Ik,Fs,Bp,Oo,Ws,Yk,lo,el,Dl,nn,nt,kl,Lt,Zk,ys,up,Cr,vq,il,ur,Cn,Lk,Bm,jn,Ls,nl,Rq,Gr,no,qp,Sl,Mr,uq,Kl,Do,Or,go,Er,co,xt,tn,on,fp,Pr,Qq,rp,bm,sp,dr,kp,Ll,Nl,Jn,ts,Nm,vo],!0);bh([Cs,at,Ho,Zn,Sq,Rk,tk,Jm,Mk,ss,Ft,Vr,Qr,ds,hq,dt,eq,Xl,ul,pm,mo,gt,ql,vk,Wm,Fl,Dt,xs,Uq,gk,km,qq],!0);
fe(function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new C(e,0)}return b.call(this,d)}function b(a){a=S(function(a){return sf(a)},a);a=r(og(a))?Z(a):a;return AG([t(":"),t("lang"),t("("),t(a),t(")")].join(""))}a.I=0;a.H=function(a){a=B(a);return b(a)};a.o=b;return a}(),new q(null,1,[eo,null],null));
fe(function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new C(e,0)}return b.call(this,d)}function b(a){a=S(function(a){return Z(a)},a);a=r(og(a))?Z(a):a;return AG([t(":"),t("not"),t("("),t(a),t(")")].join(""))}a.I=0;a.H=function(a){a=B(a);return b(a)};a.o=b;return a}(),new q(null,1,[eo,null],null));var BG=/\s*(?:[-+]?\d+n\s*(?:[-+]\s*\d+)?|[-+]?\d+|odd|even)\s*/i;
function CG(a){if(!("string"===typeof a||a instanceof P||a instanceof y))throw Error([t("Assert failed: "),t("Agument must be a string, keyword, or symbol"),t("\n"),t("(or (string? x) (keyword? x) (symbol? x))")].join(""));a=sf(a);var b=$i(BG,a);if(r(b))return b;a=[t("Invalid value "),t(nj(N([a],0)))].join("");throw new Vj("Selector must be either a keyword, string, or symbol.",a,null);}
fe(function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new C(e,0)}return b.call(this,d)}function b(a){a=S(function(a){return"number"===typeof a?CG([t(a),t("n")].join("")):CG(a)},a);a=r(og(a))?Z(a):a;return AG([t(":"),t("nth-child"),t("("),t(a),t(")")].join(""))}a.I=0;a.H=function(a){a=B(a);return b(a)};a.o=b;return a}(),new q(null,1,[eo,null],null));
fe(function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new C(e,0)}return b.call(this,d)}function b(a){a=S(function(a){return CG(a)},a);a=r(og(a))?Z(a):a;return AG([t(":"),t("nth-last-child"),t("("),t(a),t(")")].join(""))}a.I=0;a.H=function(a){a=B(a);return b(a)};a.o=b;return a}(),new q(null,1,[eo,null],null));
fe(function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new C(e,0)}return b.call(this,d)}function b(a){a=S(function(a){return CG(a)},a);a=r(og(a))?Z(a):a;return AG([t(":"),t("nth-of-type"),t("("),t(a),t(")")].join(""))}a.I=0;a.H=function(a){a=B(a);return b(a)};a.o=b;return a}(),new q(null,1,[eo,null],null));
fe(function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new C(e,0)}return b.call(this,d)}function b(a){a=S(function(a){return CG(a)},a);a=r(og(a))?Z(a):a;return AG([t(":"),t("nth-last-of-type"),t("("),t(a),t(")")].join(""))}a.I=0;a.H=function(a){a=B(a);return b(a)};a.o=b;return a}(),new q(null,1,[eo,null],null));$f.h(pG,0,100);$f.h(pG,0,255);var DG=pe([bk,hk,jk,kk,nk,rk,sk,wk,Bk,Gk,Hk,Kk,Ok,Qk,Tk,Uk,bl,fl,jl,ll,ml,pl,rl,wl,Cl,Il,Jl,Pl,Zl,$l,am,em,gm,mm,ym,Am,Cm,Fm,Mm,Tm,Um,Vm,Zm,fn,gn,hn,ln,wn,Dn,On,Un,Vn,Wn,Xn,Yn,ao,io,ko,po,uo,wo,Co,Fo,Mo,Xo,bp,cp,ep,gp,ip,mp,tp,vp,wp,xp,Fp,Gp,Jp,Up,Vp,Xp,$p,aq,fq,jq,mq,oq,pq,xq,Bq,Cq,Eq,Gq,Jq,Kq,Mq,Wq,Yq,ar,br,fr,ir,lr,or,rr,vr,wr,Dr,Ir,Lr,Tr,Wr,Yr,as,cs,es,fs,hs,ls,qs,As,Bs,Gs,Ks,Ss,bt,et,jt,mt,ot,rt,vt,zt,At,Bt,Gt,Jt,Mt,Qt,St,Yt,au,hu,ku,mu,nu],"#7fffd4 #00ff00 #00bfff #e9967a #faebd7 #48d1cc #708090 #708090 #a0522d #ffa500 #ffdead #fff0f5 #b22222 #ff4500 #db7093 #7cfc00 #fff5ee #ffb6c1 #556b2f #f0f8ff #808080 #b0c4de #f5f5f5 #b8860b #d2b48c #ffe4c4 #ffffff #90ee90 #8fbc8f #dc143c #2f4f4f #ffe4e1 #d2691e #ffff00 #5f9ea0 #000080 #f8f8ff #696969 #2e8b57 #008000 #3cb371 #4b0082 #6b8e23 #00ffff #ffdab9 #32cd32 #7b68ee #ee82ee #f4a460 #9acd32 #00fa9a #4682b4 #bc8f8f #6495ed #fffff0 #fafad2 #fa8072 #008b8b #cd853f #fff8dc #778899 #8a2be2 #228b22 #20b2aa #ffd700 #dcdcdc #9932cc #deb887 #87cefa #7fff00 #fffafa #ffe4b5 #f0fff0 #00ffff #8b0000 #ba55d3 #ffa07a #8b4513 #f5deb3 #00ff7f #778899 #00008b #b0e0e6 #40e0d0 #ffebcd #ffefd5 #6a5acd #add8e6 #87ceeb #ff0000 #ffffe0 #0000ff #98fb98 #adff2f #f0e68c #800000 #a9a9a9 #191970 #fffaf0 #ff1493 #afeeee #bdb76b #f0ffff #cd5c5c #9400d3 #9370db #ff00ff #ff7f50 #c71585 #fffacd #0000cd #8b008b #daa520 #ff8c00 #da70d6 #dda0dd #ffc0cb #008080 #ff00ff #d3d3d3 #800080 #1e90ff #00ced1 #f5fffa #ff69b4 #d8bfd8 #4169e1 #006400 #483d8b #c0c0c0 #a9a9a9 #fdf5e6 #66cdaa #a52a2a #d3d3d3 #808000 #f08080 #ff6347 #e0ffff #faf0e6 #2f4f4f #e6e6fa #696969 #eee8aa #f5f5dc #000000".split(" "));
(function(a){return function(b){return function(){function c(a){var b=null;if(0<arguments.length){for(var b=0,c=Array(arguments.length-0);b<c.length;)c[b]=arguments[b+0],++b;b=new C(c,0)}return d.call(this,b)}function d(c){var d=A.h(G.g?G.g(b):G.call(null,b),c,He);d===He&&(d=S(a,c),ig.J(b,oe,c,d));return d}c.I=0;c.H=function(a){a=B(a);return d(a)};c.o=d;return c}()}(function(){var a=Uf;return eg?eg(a):dg.call(null,a)}())})(function(a){return DG.g?DG.g(a):DG.call(null,a)});function EG(a){var b=O(a,0,null),c=O(a,1,null);return function(a,b,c){return function(a){a=aj(c,a);return r(a)?new q(null,3,[ps,b,ct,a,Bo,M(a)],null):null}}(a,b,c)}
var FG=function(a){return function(a){return function(c){return Wf(function(){return function(a){return a.g?a.g(c):a.call(null,c)}}(a),a)}}(X.a(EG,a))}(N([new T(null,2,5,V,[jo,/^\"(?:\\.|[^\"])*\"/],null),new T(null,2,5,V,[os,/^\s*\{\s*/],null),new T(null,2,5,V,[uk,/^;?\s*}/],null),new T(null,2,5,V,[Js,/^\s*\(\s*/],null),new T(null,2,5,V,[yk,/^\s*\)/],null),new T(null,2,5,V,[Rm,/^,\s*/],null),new T(null,2,5,V,[Lo,/^:\s*/],null),new T(null,2,5,V,[Xq,/^;/],null),new T(null,2,5,V,[um,/^ +/],null),new T(null,
2,5,V,[Ym,/^\s+/],null),new T(null,2,5,V,[cu,/^./],null)],0));
function GG(a){for(var b="";;){var c=FG.g?FG.g(a):FG.call(null,a);if(r(c)){var c=null!=c&&(c.l&64||c.M)?S(fg,c):c,d=A.a(c,ps),e=A.a(c,ct),c=A.a(c,Bo);a=a.substring(c);b=[t(b),t(function(){switch(d instanceof P?d.Va:null){case "l-brace":return"}";case "l-paren":return")";case "space+":return" ";case "comma":return",";case "white-space+":return"";case "string":return e;case "colon":return":";case "semi-comma":return";";case "r-brace":return"{";case "r-paren":return"(";default:return e}}())].join("")}else return b}}
;var HG=new q(null,6,[Vl,!0,lp,me,$o,null,To,me,$m,Qi,zn,new q(null,1,[Zq,tm],null)],null),IG=new q(null,2,[Ao,function(a,b){return Ki.o(N([b,a],0))},tm,function(a){return a}],null),JG=null,KG=null;function LG(a){var b=De.g?De.g(a):De.call(null,a);if(r(b))return b;b=a instanceof hG;b=r(b)?Gd.a(mr.g(a),Es):b;if(r(b))return b;b=lG(a);return r(b)?b:mG(a)}
var MG=function MG(b){if(null!=b&&null!=b.eb)return b.eb(b);var c=MG[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=MG._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("IExpandable.expand",b);},NG=function NG(b){return wg(function(a){return Ie(a)?NG(a):x(Fd,a)},N([b],0))},OG=function OG(b){return Wb(function(a){return function(b,e){var f=O(e,0,null),g=O(e,1,null);return r(kG(g))?Wb(function(a,b,c,d){return function(a,c){var e=O(c,0,null),f=O(c,1,null);return oe.h(a,d(b,e),
f)}}(e,f,g,a),b,OG(g)):oe.h(b,iG(f),g)}}(function(a,b){return jG(N([a,"-",b],0))}),Uf,b)};function PG(a){return B(a)?fe(OG(a),ue(a)):null}var QG=/^&(?:\S+)?$/;function RG(a){var b;b=aj(QG,iG(ke(a)));b=r(b)?S(t,Ed(b)):null;return r(b)?(a=Ui(a),Ff.a(Ui(a),x(Fd,jG(N([ke(a),b],0))))):a}
function SG(a){var b=new T(null,2,5,V,[Vi(og,a),ng(a)],null);a=O(b,0,null);var b=O(b,1,null),c=JG;a=X.a(Z,a);a=B(c)?X.a(Ag,qG(N([c,a],0))):X.a(nf,a);a=X.a(RG,a);var b=MG(b),c=Yi().call(null,kG,b),b=O(c,0,null),c=O(c,1,null),d;a:{var e=JG;JG=B(a)?a:JG;try{d=Zi(wg(MG,N([c],0)));break a}finally{JG=e}d=void 0}return le.a(d,le.a(new T(null,1,5,V,[a],null),wg(MG,N([b],0))))}
if("undefined"===typeof TG)var TG=function(){var a=function(){var a=Uf;return eg?eg(a):dg.call(null,a)}(),b=function(){var a=Uf;return eg?eg(a):dg.call(null,a)}(),c=function(){var a=Uf;return eg?eg(a):dg.call(null,a)}(),d=function(){var a=Uf;return eg?eg(a):dg.call(null,a)}(),e=A.h(Uf,Is,Ej());return new Pj(Dd.a("garden.compiler","expand-at-rule"),mr,tm,e,a,b,c,d)}();Rj(TG,tm,function(a){return x(Fd,a)});
Rj(TG,yq,function(a){a=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(a,Sm);var b=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(b,mr);b=A.a(b,Km);return x(Fd,new hG(yq,new q(null,2,[mr,iG(a),Km,wg(MG,N([b],0))],null),null,null,null))});
Rj(TG,qt,function(a){a=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(a,Sm);a=null!=a&&(a.l&64||a.M)?S(fg,a):a;var b=A.a(a,Ip);a=A.a(a,qo);var c;c=Gg(HG,new T(null,2,5,V,[zn,Zq],null));c=IG.g?IG.g(c):IG.call(null,c);var b=r(c)?c.a?c.a(b,KG):c.call(null,b,KG):b,d;a:{c=KG;KG=b;try{d=Zi(wg(MG,N([MG(a)],0)));break a}finally{KG=c}d=void 0}a=Yi().call(null,lG,d);d=O(a,0,null);a=O(a,1,null);return de(new hG(qt,new q(null,2,[Ip,b,qo,a],null),null,null,null),d)});MG["null"]=function(){return null};
C.prototype.eb=function(){return NG(this)};tf.prototype.eb=function(){return NG(this)};ki.prototype.eb=function(){return NG(this)};xi.prototype.eb=function(){return SG(this)};Hh.prototype.eb=function(){return NG(this)};eh.prototype.eb=function(){return NG(this)};of.prototype.eb=function(){return NG(this)};be.prototype.eb=function(){return NG(this)};pi.prototype.eb=function(){return x(Fd,PG(this))};mi.prototype.eb=function(){return NG(this)};ih.prototype.eb=function(){return SG(this)};
MG._=function(a){return x(Fd,a)};Fi.prototype.eb=function(){return x(Fd,PG(this))};Af.prototype.eb=function(){return NG(this)};hG.prototype.eb=function(){return TG.g?TG.g(this):TG.call(null,this)};wi.prototype.eb=function(){return SG(this)};T.prototype.eb=function(){return SG(this)};q.prototype.eb=function(){return x(Fd,PG(this))};jf.prototype.eb=function(){return NG(this)};
var UG=function UG(b){if(null!=b&&null!=b.Za)return b.Za(b);var c=UG[k(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=UG._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw Pb("CSSRenderer.render-css",b);};
function VG(a,b){return tu(", ",function(){return function d(b){return new tf(null,function(){for(;;){var f=B(b);if(f){if(Ee(f)){var g=gd(f),l=M(g),m=zf(l);a:for(var n=0;;)if(n<l){var p=gc.a(g,n),p=Ae(p)?tu(" ",X.a(a,p)):a.g?a.g(p):a.call(null,p);m.add(p);n+=1}else{g=!0;break a}return g?Bf(m.Ca(),d(hd(f))):Bf(m.Ca(),null)}m=D(f);return de(Ae(m)?tu(" ",X.a(a,m)):a.g?a.g(m):a.call(null,m),d(Ed(f)))}return null}},null,null)}(b)}())}function WG(a){return tu("\n\n",a)}
var XG=RegExp("(?\x3d[ A-Za-z#.}-]+)^","gm");function YG(a){return a.replace(XG,"  ")}function ZG(a){return r(mG(a))?iG(Gg(a,new T(null,2,5,V,[Sm,mr],null))):UG(a)}var $G=function $G(b){var c=O(b,0,null);b=O(b,1,null);if(ze(b))return tu("\n",X.a($G,Eg(vg.a(sg(c),b))));b=Ae(b)?VG(ZG,b):ZG(b);return jG(N([c,": ",b,";"],0))};function aH(a,b){return wg(function(b){return de(b,a.g?a.g(b):a.call(null,b))},N([b],0))}
function bH(a,b){var c=O(b,0,null),d=O(b,1,null);return function(a,b,c){return function m(d){return new tf(null,function(a,b,c){return function(){for(;;){var a=B(d);if(a){if(Ee(a)){var e=gd(a),f=M(e),g=zf(f);a:for(var p=0;;)if(p<f){var K=gc.a(e,p),K=new T(null,2,5,V,[oG(K,sf(b)),c],null);g.add(K);p+=1}else{e=!0;break a}return e?Bf(g.Ca(),m(hd(a))):Bf(g.Ca(),null)}g=D(a);return de(new T(null,2,5,V,[oG(g,sf(b)),c],null),m(Ed(a)))}return null}}}(a,b,c),null,null)}}(b,c,d)(a)}
function cH(a,b){return aH($f.a(bH,a),b)}function dH(a,b){return aH(function(b){var d=O(b,0,null);O(b,1,null);d=sf(d);d=Le(Ti(X.a(sf,$m.g(HG))),d);return r(d)?bH(a,b):null},b)}function eH(a){var b;b=To.g(ue(a));b=r(b)?b:B(To.g(HG));var c=r(Go.g(ue(a)))?cH:dH;return c.a?c.a(b,a):c.call(null,b,a)}function fH(a){return tu("\n",X.a($G,eH(a)))}function gH(a){var b=O(a,0,null),c=O(a,1,null);return B(a)&&Vf(B,a)?[t(VG(UG,b)),t(" {\n"),t(YG(tu("\n",X.a(UG,c)))),t("\n}")].join(""):null}
function hH(a){var b=O(a,0,null);a=O(a,1,null);var c=X.a(ZG,new T(null,2,5,V,[b,a],null)),b=O(c,0,null),c=O(c,1,null);return!0===a?b:!1===a?[t("not "),t(b)].join(""):Gd.a("only",c)?[t("only "),t(b)].join(""):r(r(a)?B(c):a)?[t("("),t(b),t(": "),t(c),t(")")].join(""):[t("("),t(b),t(")")].join("")}var iH=function iH(b){Ae(b)?(b=X.a(iH,b),b=VG(UG,b)):b=tu(" and ",X.a(hH,b));return b};
if("undefined"===typeof jH)var jH=function(){var a=function(){var a=Uf;return eg?eg(a):dg.call(null,a)}(),b=function(){var a=Uf;return eg?eg(a):dg.call(null,a)}(),c=function(){var a=Uf;return eg?eg(a):dg.call(null,a)}(),d=function(){var a=Uf;return eg?eg(a):dg.call(null,a)}(),e=A.h(Uf,Is,Ej());return new Pj(Dd.a("garden.compiler","render-at-rule"),mr,tm,e,a,b,c,d)}();Rj(jH,tm,function(){return null});
Rj(jH,Es,function(a){a=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(a,Sm);var b=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(b,jr);b=A.a(b,Ip);a="string"===typeof a?[t('"'),t(a),t('"')].join(""):UG(a);b=r(b)?iH(b):null;return[t("@import "),t(r(b)?[t(a),t(" "),t(b)].join(""):a),t(";")].join("")});
Rj(jH,yq,function(a){var b=null!=a&&(a.l&64||a.M)?S(fg,a):a,c=A.a(b,Sm),d=null!=c&&(c.l&64||c.M)?S(fg,c):c,e=A.a(d,mr),f=A.a(d,Km);if(B(f)){var g=[t(iG(e)),t(" {\n\n"),t(YG(WG(X.a(UG,f)))),t("\n\n}")].join(""),l=function(){return function(a){return[t("@"),t(oG(a,"keyframes "))].join("")}}(g,c,d,e,f,a,b,c);return WG(X.a(function(a){return function(b){return[t(b),t(a)].join("")}}(g,l,c,d,e,f,a,b,c),de("@keyframes ",X.a(l,B(To.g(HG))))))}return null});
Rj(jH,qt,function(a){a=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(a,Sm);var b=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(b,Ip);b=A.a(b,qo);return B(b)?[t("@media "),t(iH(a)),t(" {\n\n"),t(YG(WG(X.a(UG,b)))),t("\n\n}")].join(""):null});UG["null"]=function(){return""};C.prototype.Za=function(){return X.a(UG,this)};tf.prototype.Za=function(){return X.a(UG,this)};ki.prototype.Za=function(){return X.a(UG,this)};xi.prototype.Za=function(){return gH(this)};Hh.prototype.Za=function(){return X.a(UG,this)};
eh.prototype.Za=function(){return X.a(UG,this)};of.prototype.Za=function(){return X.a(UG,this)};be.prototype.Za=function(){return X.a(UG,this)};UG.number=function(a){return""+t(a)};pi.prototype.Za=function(){return fH(this)};mi.prototype.Za=function(){return X.a(UG,this)};ih.prototype.Za=function(){return gH(this)};UG._=function(a){return""+t(a)};Fi.prototype.Za=function(){return fH(this)};Af.prototype.Za=function(){return X.a(UG,this)};
hG.prototype.Za=function(){return jH.g?jH.g(this):jH.call(null,this)};wi.prototype.Za=function(){return gH(this)};T.prototype.Za=function(){return gH(this)};P.prototype.Za=function(){return sf(this)};q.prototype.Za=function(){return fH(this)};jf.prototype.Za=function(){return X.a(UG,this)};var kH=function kH(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return kH.o(arguments[0],1<c.length?new C(c.slice(1),0,null):null)};
kH.o=function(a,b){var c;c=kG(a);c=r(c)?Wf(Ti(Jh(a)),Jh(HG)):c;var d=r(c)?new T(null,2,5,V,[Ki.o(N([HG,a],0)),b],null):new T(null,2,5,V,[HG,de(a,b)],null);c=O(d,0,null);var e;a:{var d=O(d,1,null),f=HG;HG=c;try{e=WG(yg.a(Jb,X.a(UG,xg.a(LG,S(Ff,X.a(MG,MG(d)))))));break a}finally{HG=f}e=void 0}d=null!=c&&(c.l&64||c.M)?S(fg,c):c;A.a(d,lp);f=null!=c&&(c.l&64||c.M)?S(fg,c):c;d=A.a(f,Vl);f=A.a(f,Os);e=r(r(d)?d:f)?e:GG(e);c=null!=c&&(c.l&64||c.M)?S(fg,c):c;A.a(c,$o);return e};kH.I=1;
kH.H=function(a){var b=D(a);a=F(a);return kH.o(b,a)};var Ax=yx(Uf),lH=PDFJS,mH=new hG(yq,new q(null,2,[mr,""+t(Ns),Km,x(x(Fd,new T(null,2,5,V,[ju,new q(null,1,[wq,.2],null)],null)),new T(null,2,5,V,[rq,new q(null,1,[wq,1.5],null)],null))],null)),nH=lH.Util.transform;function oH(a,b){console.debug.apply(console,Qe(x(x(Fd,a),"fetching PDF document: ")));return fF(lH.getDocument(xj(Ki.o(N([new q(null,1,[jr,a],null),r(b)?new q(null,1,[An,new q(null,1,["Authorization",[t("Bearer "),t(b)].join("")],null)],null):null],0)))))}
function pH(a){var b=function(){var a=window.devicePixelRatio;return r(a)?a:1}()/function(){var b=a.vh;if(r(b))return b;b=a.rh;if(r(b))return b;b=a.sh;if(r(b))return b;b=a.th;if(r(b))return b;b=a.gh;return r(b)?b:1}();return new q(null,3,[Xr,b,Lm,b,Us,Nf(b,1)],null)}
function qH(a){var b=1/a;if(Gd.a(Math.floor(a),a))return new T(null,2,5,V,[a,1],null);if(8<b)return new T(null,2,5,V,[1,8],null);if(Gd.a(Math.floor(b),b))return new T(null,2,5,V,[1,b],null);for(var b=1<a?b:a,c=0,d=1,e=1,f=1;;){var g=c+e,l=d+f;if(8<l)return b-c/d<e/f-b?Gd.a(b,a)?new T(null,2,5,V,[c,d],null):new T(null,2,5,V,[d,c],null):Gd.a(b,a)?new T(null,2,5,V,[e,f],null):new T(null,2,5,V,[f,e],null);b<=g/l?(f=l,e=g):(d=l,c=g)}}
function rH(a,b){var c=(a%b+b)%b;return Gd.a(0,c)?a:Math.round(a-(c+b))}function sH(a,b,c,d){a.font=[t(b),t("px "),t(c)].join("");return a.measureText(d).width}function tH(a){var b=null==a;return b?b:isNaN(a)}
function uH(a,b,c,d,e){c=c[e.fontName];var f=c.vertical,g=function(){var a=b.transform,c=e.transform;return nH.a?nH.a(a,c):nH.call(null,a,c)}(),l=O(g,0,null),m=O(g,1,null),n=O(g,2,null),p=O(g,3,null),u=O(g,4,null),g=O(g,5,null),w=180/Math.PI*function(){var a=Math.atan2(m,l);return r(f)?a+Math.PI/2:a}(),v=Math.sqrt(n*n+p*p),n=c.ascent,p=c.descent,n=Mb(tH(n))?n*v:Mb(tH(p))?(1+p)*v:v,u=0===w?new T(null,2,5,V,[u,g-n],null):new T(null,2,5,V,[u+n*Math.sin(w),g-n*Math.cos(w)],null),E=O(u,0,null),I=O(u,1,
null),z=c.fontFamily;c=e.str;var L=1<M(c)?r(f)?e.height*b.scale:e.width*b.scale:null,K=sH(a,v,z,c);a=function(){var a=new q(null,8,[fu,E,hm,I,ms,v,jp,z,sl,"transparent",Sr,"absolute",Ql,"pre",Fn,"text"],null),b=0<K;return r(b?L:b)?oe.o(a,dl,[t("scaleX("),t(L/K),t(")")].join(""),N([Ap,"0% 0%",Qm,"0% 0%",Hn,"0% 0%",yr,"0% 0%",xr,"0% 0%"],0)):a}();return new T(null,3,5,V,[Zo,new q(null,2,[Bl,d,So,a],null),c],null)}
function vH(a,b){var c=ux(a).offsetWidth,d=b.getViewport(1),d=c/d.width;console.debug.apply(console,Qe(x(x(x(x(Fd,d),"; initial scale calculated to be: "),c),"container width: ")));return d}
function wH(a){var b=a.getElementsByTagName("canvas");if(null==b)b=Fd;else if(null!=b?b.l&8388608||b.gd||(b.l?0:Nb(Mc,b)):Nb(Mc,b))b=B(b);else{var c;c=r(b)?(c=Mb(b.nodeName))?b.length:c:b;b=r(c)?r(b.item)?gF(b,0):hF(b,0):B(new T(null,1,5,V,[b],null))}b=D(b);if(r(b))return b;b=document.createElement("canvas");r(a.firstChild)?a.insertBefore(b,a.firstChild):a.appendChild(b);return b}
function xH(a,b,c,d,e){var f=QE(new jE(hE(10),10)),g=function(a){return function(){function b(a,d){var e=null;if(1<arguments.length){for(var e=0,f=Array(arguments.length-1);e<f.length;)f[e]=arguments[e+1],++e;e=new C(f,0)}return c.call(this,a,e)}function c(b,e){var f=null!=e&&(e.l&64||e.M)?S(fg,e):e;return TE(a,oe.h(Ki.o(N([G.g?G.g(d):G.call(null,d),f],0)),dp,b))}b.I=1;b.H=function(a){var b=D(a);a=Ed(a);return c(b,a)};b.o=c;return b}()}(f),l=QE(1);qE(function(f,g,l){return function(){var u=function(){return function(a){return function(){function b(c){for(;;){var d;
a:try{for(;;){var e=a(c);if(!qf(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,IE(c),d=Y;else throw f;}if(!qf(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.D=c;d.g=b;return d}()}(function(f,g,l){return function(m){var p=m[1];if(65===p){var n=m,u=n;u[2]=null;u[1]=66;return Y}if(70===p){var w=n=m;w[2]=null;w[1]=71;return Y}if(62===p){var na=m[7],J=n=m;J[2]=na;J[1]=63;return Y}if(74===p){var ma=m[2],W=n=m;W[2]=ma;W[1]=50;return Y}if(7===p){var da=m[2],n=m;n[1]=r(da)?11:12;return Y}if(59===p){var fa=n=m;fa[2]=!1;fa[1]=60;return Y}if(20===p){var ka=n=m;ka[2]=null;ka[1]=21;return Y}if(72===p){var U=m[8],oa=[Yp,Tt,Tn],Ka=[!0,"re-rendering not necessary",
G.g?G.g(d):G.call(null,d)],ta=pe(oa,Ka),ua=U.g?U.g(ta):U.call(null,ta),va=n=m;va[2]=ua;va[1]=74;return Y}if(58===p){var Ea=n=m;Ea[2]=!0;Ea[1]=60;return Y}if(60===p){var La=m[2],Qa=n=m;Qa[2]=La;Qa[1]=57;return Y}if(27===p){var Ua=n=m;Ua[2]=!1;Ua[1]=28;return Y}if(1===p){var gb=n=m;gb[2]=null;gb[1]=2;return Y}if(69===p){var kb=m[9],U=m[8],Xb=pe([Yp,Tn],[!0,kb]),Lb=U.g?U.g(Xb):U.call(null,Xb),Nc=n=m;Nc[2]=Lb;Nc[1]=71;return Y}if(24===p){var Ad=n=m;Ad[2]=!1;Ad[1]=25;return Y}if(55===p){var na=m[7],Rh=
na.M,Bx=na.l&64||Rh,n=m;n[1]=r(Bx)?58:59;return Y}if(39===p){var yc=m[10],PH=yc.numPages,Av=n=m;Av[2]=PH;Av[1]=41;return Y}if(46===p){var yc=m[10],Bv=n=m;Bv[2]=yc;Bv[1]=47;return Y}if(4===p){var pg=m[11],Cv=m[2],Kp=Mb(null==Cv);m[11]=Cv;n=m;n[1]=Kp?5:6;return Y}if(77===p){var Lp=m[2],Dv=n=m;Dv[2]=Lp;Dv[1]=16;return Y}if(54===p){var Ev=m[12],uf=m[13],Mp=m[14],om=m[15],Re=m[16],na=m[7],Fv=m[2],th=Re.getViewport(Fv),Np=th.height,Op=th.width,Gv=wH(e),Hv=Gv.getContext("2d",{alpha:!1}),Iv=pH(Hv),QH=Mb(null==
Iv);m[12]=Fv;m[13]=th;m[14]=Gv;m[15]=Hv;m[17]=Op;m[7]=Iv;m[18]=Np;n=m;n[1]=QH?55:56;return Y}if(15===p)return U=m[8],n=m,n[1]=r(U)?75:76,Y;if(48===p){var yc=m[10],ve=m[19],RH=fF(yc.getPage(ve)),n=m;return EE(n,51,RH)}if(50===p){var SH=m[2],n=m;n[2]=SH;IE(n);return Y}if(75===p){var U=m[8],TH=[Yp,Tt,Tn],UH=[!1,"not yet initialized!",G.g?G.g(d):G.call(null,d)],Jv=pe(TH,UH),VH=U.g?U.g(Jv):U.call(null,Jv),Kv=n=m;Kv[2]=VH;Kv[1]=77;return Y}if(21===p){var WH=m[2],n=m;n[2]=WH;IE(n);return Y}if(31===p){var Jc=
m[20],Pp=m[21],oj=m[2],uh=A.a(oj,jr),vf=A.a(oj,ks),vh=A.a(oj,Jr),wh=A.a(oj,fm);m[22]=vh;m[23]=wh;m[24]=uh;m[21]=oj;m[25]=vf;n=m;n[1]=r(Jc)?32:33;return Y}if(32===p){var Jc=m[20],uh=m[24],XH=Nf(Jc,uh),Lv=n=m;Lv[2]=XH;Lv[1]=34;return Y}if(40===p){var xh=m[26],Mv=n=m;Mv[2]=xh;Mv[1]=41;return Y}if(56===p){var Nv=n=m;Nv[2]=!1;Nv[1]=57;return Y}if(33===p){var Jc=m[20],Ov=n=m;Ov[2]=Jc;Ov[1]=34;return Y}if(13===p){var Qp=m[27],pj=m[2],Jc=A.a(pj,jr),xh=A.h(pj,Jr,1),yh=A.a(pj,fm),U=A.a(pj,dp),YH=G.g?G.g(b):
G.call(null,b);m[8]=U;m[28]=yh;m[20]=Jc;m[27]=pj;m[26]=xh;n=m;n[1]=r(YH)?14:15;return Y}if(22===p){var qg=m[29];m[4]=new HE(18,tm,null,17,m[4],null,null,null);var Pv=G.g?G.g(d):G.call(null,d),ZH=Mb(null==Pv);m[29]=Pv;n=m;n[1]=ZH?23:24;return Y}if(36===p){var vf=m[25],Qv=n=m;Qv[2]=vf;Qv[1]=37;return Y}if(41===p){var yh=m[28],xh=m[26],Rv=m[2],Sv=xh<Rv?xh:Rv,ve=1>Sv?1:Sv;m[19]=ve;n=m;n[1]=r(yh)?42:43;return Y}if(43===p){var Tv=n=m;Tv[2]=null;Tv[1]=44;return Y}if(61===p){var na=m[7],$H=S(fg,na),Uv=n=
m;Uv[2]=$H;Uv[1]=63;return Y}if(29===p){var qg=m[29],aI=S(fg,qg),Vv=n=m;Vv[2]=aI;Vv[1]=31;return Y}if(44===p){var U=m[8],vh=m[22],Jc=m[20],wh=m[23],uh=m[24],Pp=m[21],Qp=m[27],vf=m[25],rg=m[30],yc=m[10],ve=m[19],Rp=m[2],bI=ig.a(d,function(){return function(a,b,c,d,e,f,g,l,m,n,p){return function(a){a=r(p)?oe.h(a,Jr,p):a;return r(c)?oe.h(a,fm,c):a}}(yc,uh,Rp,vf,U,vh,Qp,wh,Pp,Jc,ve,U,vh,Jc,wh,uh,Pp,Qp,vf,rg,yc,ve,Rp,p,f,g,l)}());m[31]=bI;m[30]=Rp;n=m;n[1]=r(yc)?45:46;return Y}if(6===p){var Wv=n=m;Wv[2]=
!1;Wv[1]=7;return Y}if(28===p){var cI=m[2],Xv=n=m;Xv[2]=cI;Xv[1]=25;return Y}if(64===p){var zh=m[32],Ah=m[33],dI=new T(null,6,5,V,[zh,0,0,Ah,0,0],null),Yv=n=m;Yv[2]=dI;Yv[1]=66;return Y}if(51===p)return rg=m[30],Re=eF(m[2]),m[16]=Re,n=m,n[1]=r(rg)?52:53,Y;if(25===p){var eI=m[2],n=m;n[1]=r(eI)?29:30;return Y}if(34===p){var fI=m[2],n=m;n[1]=r(fI)?35:36;return Y}if(17===p){var gI=m[2],Zv=n=m;Zv[2]=gI;Zv[1]=16;return Y}if(3===p){var hI=m[2],n=m;return GE(n,hI)}if(12===p){var pg=m[11],$v=n=m;$v[2]=pg;
$v[1]=13;return Y}if(2===p)return n=m,EE(n,4,g);if(66===p){var zh=m[32],uf=m[13],Ah=m[33],Mp=m[14],om=m[15],Re=m[16],iI=[sr,Xs,dl],jI=xj(m[2]),kI=pe(iI,[om,uf,jI]),lI=xj(kI),aw=qH(zh),mI=O(aw,0,null),nI=O(aw,1,null),bw=qH(Ah),oI=O(bw,0,null),pI=O(bw,1,null),cw=rH(uf.width*zh,mI),dw=rH(uf.height*Ah,oI),ew=rH(uf.width,nI),fw=rH(uf.height,pI),qI=pe([pn,Ut],[cw,dw]),rI=QD(Mp,qI),sI=[pn,Ut],tI=[t(ew),t("px")].join(""),uI=[t(fw),t("px")].join(""),vI=pe(sI,[tI,uI]),wI=PD(Mp,vI),xI=ig.o(d,oe,Ht,cw,N([bu,
dw,Pt,ew,Gm,fw],0)),yI=fF(Re.render(lI));m[34]=wI;m[35]=xI;m[36]=rI;n=m;return EE(n,67,yI)}if(23===p){var qg=m[29],zI=qg.M,AI=qg.l&64||zI,n=m;n[1]=r(AI)?26:27;return Y}if(47===p){var BI=m[2],n=m;n[1]=r(BI)?48:49;return Y}if(35===p){var Jc=m[20],CI=oH(Jc,c),n=m;return EE(n,38,CI)}if(76===p){var gw=n=m;gw[2]=null;gw[1]=77;return Y}if(19===p){var U=m[8],DI=[Yp,Tt,Tn],EI=[!1,"rendering failed",G.g?G.g(d):G.call(null,d)],hw=pe(DI,EI),FI=U.g?U.g(hw):U.call(null,hw),iw=n=m;iw[2]=FI;iw[1]=21;return Y}if(57===
p){var GI=m[2],n=m;n[1]=r(GI)?61:62;return Y}if(68===p){var Ev=m[12],U=m[8],uf=m[13],om=m[15],Op=m[17],ve=m[19],Np=m[18],jw=eF(m[2]),HI=$f.J(uH,om,uf,jw.styles),kb=ig.o(d,oe,Jr,ve,N([Ln,!1,fm,Ev,Vk,Np,Fq,Op,iq,bg(HI,jw.items)],0));m[9]=kb;n=m;n[1]=r(U)?69:70;return Y}if(11===p){var pg=m[11],II=S(fg,pg),kw=n=m;kw[2]=II;kw[1]=13;return Y}if(9===p){var lw=n=m;lw[2]=!1;lw[1]=10;return Y}if(5===p){var pg=m[11],JI=pg.M,KI=pg.l&64||JI,n=m;n[1]=r(KI)?8:9;return Y}if(14===p){var mw=n=m;mw[2]=null;mw[1]=22;
return Y}if(45===p){var vh=m[22],wh=m[23],vf=m[25],rg=m[30],yc=m[10],ve=m[19],LI=Mb(yc===vf),MI=Nf(vh,ve),NI=Nf(wh,rg),OI=LI||MI||NI,nw=n=m;nw[2]=OI;nw[1]=47;return Y}if(53===p){var Re=m[16],PI=vH(a,Re),ow=n=m;ow[2]=PI;ow[1]=54;return Y}if(26===p){var pw=n=m;pw[2]=!0;pw[1]=28;return Y}if(16===p){m[37]=m[2];var qw=n=m;qw[2]=null;qw[1]=2;return Y}if(38===p){var Jc=m[20],Sp=eF(m[2]),QI=ig.o(d,oe,jr,Jc,N([ks,Sp,Vt,Sp.numPages],0));m[38]=QI;var rw=n=m;rw[2]=Sp;rw[1]=37;return Y}if(30===p){var qg=m[29],
sw=n=m;sw[2]=qg;sw[1]=31;return Y}if(73===p){var tw=n=m;tw[2]=null;tw[1]=74;return Y}if(10===p){var RI=m[2],uw=n=m;uw[2]=RI;uw[1]=7;return Y}if(18===p){var U=m[8],SI=console.error,TI=x(Fd,m[2]),UI=Qe(TI),VI=SI.apply(console,UI);m[39]=VI;n=m;n[1]=r(U)?19:20;return Y}if(52===p){var rg=m[30],vw=n=m;vw[2]=rg;vw[1]=54;return Y}if(67===p){var Re=m[16],WI=eF(m[2]),XI=fF(Re.getTextContent({normalizeWhitespace:!0}));m[40]=WI;n=m;return EE(n,68,XI)}if(71===p){var YI=m[2],ww=n=m;ww[2]=YI;ww[1]=50;return Y}if(42===
p){var yh=m[28],xw=5>yh?yh:5,ZI=.25>xw?.25:xw,yw=n=m;yw[2]=ZI;yw[1]=44;return Y}if(37===p){var yc=m[10],zw=m[2];m[10]=zw;n=m;n[1]=r(zw)?39:40;return Y}if(63===p){var Tp=m[2],zh=A.a(Tp,Xr),Ah=A.a(Tp,Lm),$I=A.a(Tp,Us);m[32]=zh;m[33]=Ah;n=m;n[1]=r($I)?64:65;return Y}if(8===p){var Aw=n=m;Aw[2]=!0;Aw[1]=10;return Y}return 49===p?(U=m[8],n=m,n[1]=r(U)?72:73,Y):null}}(f,g,l),f,g,l)}(),w=function(){var a=u.D?u.D():u.call(null);a[6]=f;return a}();return DE(w)}}(l,f,g));return g}
function yH(a){return Wb(function(a,c){var d=M(a)-1,e=a.g?a.g(d):a.call(null,d);if(xe(e))return Kg(a,d,le,c);var f=kF(X.a(hm,e)),e=kF(X.a(Ut,e)),e=f+e,g=hm.g(c),l=Ut.g(c);l=g+l;if(f<=g&&g<=l&&l<=e||g<=f&&f<=e&&e<=l)f=1;else if(r(f<=g&&g<=e||f<=l&&l<=e||g<=f&&f<=l))var m=e-g,n=l-f,f=(m<n?m:n)/((e>l?e:l)-(f<g?f:g));else f=0;return.5<f?Kg(a,d,le,c):le.a(a,new T(null,1,5,V,[c],null))},new T(null,1,5,V,[me],null),a)}
function zH(a){var b=Te(fu,a),c=D(b),c=fu.g(c),d=ke(b),d=pn.g(d)+fu.g(d)-c,e=S(bf,X.a(hm,a));a=S(af,X.a(Ut,a));b=Jr.g(D(b));return new q(null,5,[fu,c,pn,d,hm,e,Ut,a,Jr,b],null)}function AH(a){var b=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(b,fu);var c=A.a(b,pn),d=A.a(b,hm),b=A.a(b,Ut);return new T(null,4,5,V,[a,d,a+c,d+b],null)}
function BH(a,b,c){a=B(a);a=null==a?null:X.a(function(){return function(a){var e=null!=a&&(a.l&64||a.M)?S(fg,a):a;a=A.a(e,fu);var f=A.a(e,hm),g=A.a(e,pn),e=A.a(e,Ut);return new q(null,4,[fu,a/b,pn,g/b,hm,f/c,Ut,e/c],null)}}(a),a);a=null==a?null:Pe(mF(N([Jr,Me,hm,Me],0)),a);a=null==a?null:yH(a);a=null==a?null:X.a(zH,a);a=null==a?null:Cg(AH,a);return null==a?null:Pe(mF(N([je,Me,D,Me],0)),a)}function CH(a){return new q(null,4,[fu,a.left,hm,a.top,pn,a.width,Ut,a.height],null)}
var DH=function DH(b){var c;c=sy(b);c=0<=mb(c,"textLayer");if(r(c))return b;b=b.parentElement;return r(b)?DH(b):null},EH=function(a){return function(){return[t("lai-temp-annotation-"),t(ig.a(a,Od))].join("")}}(eg?eg(0):dg.call(null,0)),FH=function FH(b){return new tf(null,function(){try{return de(b.next(),FH(b))}catch(a){return null}},null,null)};function GH(a){return Dg(function(a){var c;if(c=Gd.a(3,a.nodeType))a=a.textContent,c=!/^[\s\xa0]*$/.test(null==a?"":String(a));return c},FH(a.qc()))}
function HH(a,b){var c=document.createTextNode(String(a)),d=document.createElement("span");MD.h?MD.h(iy,d,c):MD.call(null,iy,d,c);for(var c=B(KD(d)),e=null,f=0,g=0;;)if(g<f){var l=e.N(null,g);ty(l,b);g+=1}else if(c=B(c))e=c,Ee(e)?(c=gd(e),g=hd(e),e=c,f=M(c),c=g):(c=D(e),ty(c,b),c=F(e),e=null,f=0),g=0;else break;return d}
function IH(a,b,c,d){a=a.textContent;if(null==b&&null==c)return new T(null,1,5,V,[HH(a,d)],null);if(null==c)return c=new T(null,2,5,V,[a.substring(0,b),a.substring(b)],null),b=O(c,0,null),c=O(c,1,null),new T(null,2,5,V,[document.createTextNode(String(b)),HH(c,d)],null);if(null==b)return c=new T(null,2,5,V,[a.substring(0,c),a.substring(c)],null),b=O(c,0,null),c=O(c,1,null),new T(null,2,5,V,[HH(b,d),document.createTextNode(String(c))],null);a=new T(null,3,5,V,[a.substring(0,b),a.substring(b,c),a.substring(c)],
null);b=O(a,0,null);c=O(a,1,null);a=O(a,2,null);return new T(null,3,5,V,[document.createTextNode(String(b)),HH(c,d),document.createTextNode(String(a))],null)}
function JH(a){var b=a.Wa(),c=a.oa(),d=a.jb(),e=a.za(),f=Gd.a(c,e)&&Gd.a(b,d);if(f)return null;var g=EH(),l=GH(a);a=M(l)-1;var m=bg(function(a,b,c,d,e,f){return function(b,e){return 0===c?IH(e,d,f,a):0===b?IH(e,d,null,a):Gd.a(b,c)?IH(e,null,f,a):IH(e,null,null,a)}}(g,l,a,b,c,d,e,f),l),n=function(){for(var a=B(X.h(dh,l,m)),b=null,c=0,d=0;;)if(d<c){var e=b.N(null,d),f=O(e,0,null),e=O(e,1,null);LD(f,e);d+=1}else if(a=B(a))Ee(a)?(b=gd(a),a=hd(a),f=b,c=M(b),b=f):(b=D(a),f=O(b,0,null),e=O(b,1,null),LD(f,
e),a=F(a),b=null,c=0),d=0;else return null}(),p=xg.a(function(){return function(a){return Gd.a(1,a.nodeType)}}(g,l,a,m,n,b,c,d,e,f),Ag(m)),u=CH(DH(D(p)).getBoundingClientRect());return Cg(function(a,b,c,d,e,f,g){return function(a){a=CH(a.getBoundingClientRect());return Kg(Kg(a,hm,Ze,hm.g(g)),fu,Ze,fu.g(g))}}(g,l,a,m,n,p,u,b,c,d,e,f),p)}
function KH(){var a;a=(a=sF(window))&&fG(a);if(r(a)){var b=a.Wa(),c=a.oa(),d=a.jb(),e=a.za();return Gd.a(c,e)&&Gd.a(b,d)?new q(null,2,[gu,null,Rt,null],null):new q(null,6,[zp,c,op,e,gr,b,Ar,d,gu,a.Rc(),Rt,a],null)}return new q(null,2,[gu,null,Rt,null],null)}function LH(a){return function(b){b.preventDefault();b.stopPropagation();a.g?a.g(b):a.call(null,b);return null}}function MH(a){return[t("annotation-component-"),t(a)].join("")}
function NH(a,b,c,d,e){b=null!=e&&(e.l&64||e.M)?S(fg,e):e;c=A.a(b,"color");d=A.a(b,"name");return function(a,b,c,d,e){return function(p,u,w,v,E,I,z){var L=null!=w&&(w.l&64||w.M)?S(fg,w):w,K=A.a(L,"highlights"),Q=null!=E&&(E.l&64||E.M)?S(fg,E):E,R=A.a(Q,"color"),na=A.a(Q,"name"),J=A.a(K,[t("p"),t(v-1)].join("")),ma=Gd.a(G.g?G.g(a):G.call(null,a),u),W=O(R,0,null),da=O(R,1,null),fa=O(R,2,null),ka=O(R,3,null),U=jF(N([W,da,fa,2*ka],0)),oa=jF(N([W,da,fa,.5*ka],0)),Ka=jF(N([W,da,fa,.8*ka],0)),ta=ma?Ka:oa,
ua=ma?[t(U),t(" solid 1px")].join(""):null,va=OH.g?OH.g(p):OH.call(null,p);return new T(null,4,5,V,[Zo,new q(null,1,[zq,MH(u)],null),Zi(function(){return function(a,b,c,d,e,f,g,l,m,n,v,w,E,J,K,L,Q,U,R,W,fa,da,ka,oa,ma,na){return function th(ua){return new tf(null,function(a,b,c,d,e,f,g,l,m,n,v,w,E,J,K,L,Q,U,R,Nc,W,fa,da,ka,oa,Ad){return function(){for(;;){var ma=B(ua);if(ma){var na=ma;if(Ee(na)){var ta=gd(na),gb=M(ta),va=zf(gb);return function(){for(var ua=0;;)if(ua<gb){var Ua=gc.a(ta,ua),Ka=O(Ua,
0,null),Ea=O(Ua,1,null),La=O(Ea,0,null),Qa=O(Ea,1,null),kb=O(Ea,2,null),Lb=O(Ea,3,null);Cf(va,fe(new T(null,2,5,V,[Zo,new q(null,4,[Eo,W,Aq,b?"selected-annotation":null,xo,LH(function(a,b,c,d,e,f,g,l,m,n,v,w,z,E,I){return function(){return I?null:aJ.a?aJ.a(p,u):aJ.call(null,p,u)}}(ua,Ua,Ka,Ea,La,Qa,kb,Lb,ta,gb,va,na,ma,a,b,c,d,e,f,g,l,m,n,v,w,E,J,K,L,Q,U,R,Nc,W,fa,da,ka,oa,Ad)),So,new q(null,8,[Vs,4,Sr,"absolute",fu,La*I,hm,Qa*z,pn,(kb-La)*I,Ut,(Lb-Qa)*z,en,v,Ms,w],null)],null)],null),new q(null,
1,[Bl,[t("highlight-div-"),t(u),t("-"),t(Ka)].join("")],null)));ua+=1}else return!0}()?Bf(va.Ca(),th(hd(na))):Bf(va.Ca(),null)}var Ua=D(na),Ea=O(Ua,0,null),Ka=O(Ua,1,null),La=O(Ka,0,null),Qa=O(Ka,1,null),kb=O(Ka,2,null),Lb=O(Ka,3,null);return de(fe(new T(null,2,5,V,[Zo,new q(null,4,[Eo,W,Aq,b?"selected-annotation":null,xo,LH(function(a,b,c,d,e,f,g,l,m,n,v){return function(){return v?null:aJ.a?aJ.a(p,u):aJ.call(null,p,u)}}(Ua,Ea,Ka,La,Qa,kb,Lb,na,ma,a,b,c,d,e,f,g,l,m,n,v,w,E,J,K,L,Q,U,R,Nc,W,fa,da,
ka,oa,Ad)),So,new q(null,8,[Vs,4,Sr,"absolute",fu,La*I,hm,Qa*z,pn,(kb-La)*I,Ut,(Lb-Qa)*z,en,v,Ms,w],null)],null)],null),new q(null,1,[Bl,[t("highlight-div-"),t(u),t("-"),t(Ea)].join("")],null)),th(Ed(na)))}return null}}}(a,b,c,d,e,f,g,l,m,n,v,w,E,J,K,L,Q,U,R,W,fa,da,ka,oa,ma,na),null,null)}}(J,ma,R,W,da,fa,ka,U,oa,Ka,ta,ua,va,w,L,L,K,E,Q,R,na,a,b,c,d,e)(iF(J))}()),ma&&B(J)?function(){var v=ke(J),La=O(v,0,null),Qa=O(v,1,null),Ua=O(v,2,null),gb=O(v,3,null);return new T(null,3,5,V,[iu,new q(null,2,[xo,
LH(function(){return function(){return bJ.h?bJ.h(p,u,null):bJ.call(null,p,u,null)}}(v,La,Qa,Ua,gb,J,ma,R,W,da,fa,ka,U,oa,Ka,ta,ua,va,w,L,L,K,E,Q,R,na,a,b,c,d,e)),So,pe([fk,Xk,sl,yl,Ul,hm,jm,pn,rn,Fn,bq,Nr,Rr,Sr,Ms,Vs,$s,Ut,fu],[1.5,"0 0 3px gray","#f5f5f5","center",[t(5*va),t("px")].join(""),Qa*z+-5*va,"bold",8*va,"#464646","default",100,"none","block","absolute","2px solid #f5f5f5","50%","auto",8*va,La*I+(Ua-La)*I+-4*va])],null),"×"],null)}():null],null)}}(zx(new T(null,2,5,V,[a,tl],null)),e,b,c,
d)}
function cJ(a){var b=yx(new q(null,1,[gl,gu],null));a=zx(new T(null,2,5,V,[a,tl],null));return xx(new q(null,2,[dn,function(a,b){return function(){var e=new Mousetrap;e.bind("command",function(a,b){return function(){return ig.J(b,oe,gl,gu)}}(e,a,b),"keyup");return e.bind("command",function(a,b){return function(){return ig.J(b,oe,gl,It)}}(e,a,b),"keydown")}}(b,a),cq,function(a,b){return function(e,f,g,l,m,n,p){return new T(null,3,5,V,[En,new q(null,2,[xo,LH(function(a,b){return function(){return null==(G.g?
G.g(b):G.call(null,b))?null:aJ.a?aJ.a(e,null):aJ.call(null,e,null)}}(a,b)),So,pe([Hl,hm,pn,Fn,bq,Hr,Sr,$s,Ut,fu],[0,0,n,"pointer",2,0,"absolute",Gd.a(gu,gl.g(G.g?G.g(a):G.call(null,a)))?"none":"auto",p,0])],null),r(f)?function(){var u=A.a(g,"schema"),w=Gg(g,new T(null,4,5,V,["documents",f,m,"annotations"],null));return function(a,b,c,d){return function K(f){return new tf(null,function(a){return function(){for(;;){var b=B(f);if(b){if(Ee(b)){var c=gd(b),d=M(c),g=zf(d);a:for(var m=0;;)if(m<d){var u=
gc.a(c,m),v=O(u,0,null),u=O(u,1,null),w=null!=u&&(u.l&64||u.M)?S(fg,u):u,u=w,w=A.a(w,"annotation_type_id"),w=A.a(a,w),v=fe(new T(null,8,5,V,[NH,e,v,u,l,w,n,p],null),new q(null,1,[Bl,[t("annotation-div-"),t(v)].join("")],null));g.add(v);m+=1}else{c=!0;break a}return c?Bf(g.Ca(),K(hd(b))):Bf(g.Ca(),null)}c=D(b);g=O(c,0,null);c=O(c,1,null);c=d=null!=c&&(c.l&64||c.M)?S(fg,c):c;d=A.a(d,"annotation_type_id");d=A.a(a,d);return de(fe(new T(null,8,5,V,[NH,e,g,c,l,d,n,p],null),new q(null,1,[Bl,[t("annotation-div-"),
t(g)].join("")],null)),K(Ed(b)))}return null}}}(a,b,c,d),null,null)}}(u,w,a,b)(w)}():null],null)}}(b,a)],null))}function dJ(a,b,c,d){return new T(null,3,5,V,[mk,new q(null,1,[So,pe([Hl,hm,pn,Fn,bq,Hr,Sr,Ut,fu],[0,0,c,"text",1,0,"absolute",d,0])],null),b],null)}function eJ(a,b,c){a=new Firebase(a);a.child("/").authWithCustomToken(b,function(a){return function(b){return r(b)?console.error.apply(console,Qe(x(x(Fd,b),"firebase auth failed: "))):c.g?c.g(a):c.call(null,a)}}(a))}
function fJ(a,b,c,d,e){var f=zx(new T(null,1,5,V,[a],null)),g=yx(null),l=function(a,b){return function(c){c.a?c.a("firebase connection lost: ",c):c.call(null,"firebase connection lost: ",c);if(null==(G.g?G.g(b):G.call(null,b))){c=B($n.g(G.g?G.g(a):G.call(null,a)));for(var d=null,e=0,f=0;;)if(f<e){var g=d.N(null,f),l=new q(null,2,[Yp,!1,Tn,G.g?G.g(a):G.call(null,a)],null);g.g?g.g(l):g.call(null,l);f+=1}else if(c=B(c))Ee(c)?(d=gd(c),c=hd(c),g=d,e=M(d),d=g):(g=D(c),d=new q(null,2,[Yp,!1,Tn,G.g?G.g(a):
G.call(null,a)],null),g.g?g.g(d):g.call(null,d),c=F(c),d=null,e=0),f=0;else return null}else return null}}(f,g);return xx(new q(null,4,[Kr,function(a){return function(){return ig.h(a,Ki,new q(null,5,[ol,b,$t,!1,Qs,d,Zt,c,tl,null],null))}}(f,g,l),dn,function(f,g,l){return function(u){return lD([t(b),t("/configuration")].join(""),N([Ki.o(N([new q(null,2,[kt,function(b,f,g){return function(l){var m=A.a(l,"USER"),n=A.a(l,"GROUP"),p=A.a(l,"FIREBASE_URL"),Q=A.a(l,"TOKEN"),R=A.a(l,"DOCUMENT_SORT_PAGE_SCALE"),
na=A.a(l,"DOCUMENT_SORT_X_SCALE");l=A.a(l,"DOCUMENT_SORT_Y_SCALE");eJ(p,Q,function(a,b,c,e,f,g,l,m,n,p){return function(u){u.child("documents/").on("value",function(a,b,c,d,e,f,g,l){return function(a){a=Aj(a.val());return ig.J(l,oe,Yo,a)}}(a,b,c,e,f,g,l,m,n,p),p);return u.child([t("projects/"),t(d)].join("")).on("value",function(a,b,c,d,e,f,g,l,m){return function(a){a=Aj(a.val());ig.o(l,oe,$t,!0,N([Zp,a],0));if(null==(G.g?G.g(m):G.call(null,m))){a=B($n.g(G.g?G.g(l):G.call(null,l)));for(var b=null,
c=0,d=0;;)if(d<c){var e=b.N(null,d),f=new q(null,2,[Yp,!0,Tn,G.g?G.g(l):G.call(null,l)],null);e.g?e.g(f):e.call(null,f);d+=1}else if(a=B(a))Ee(a)?(c=gd(a),a=hd(a),b=c,c=M(c)):(b=D(a),c=new q(null,2,[Yp,!0,Tn,G.g?G.g(l):G.call(null,l)],null),b.g?b.g(c):b.call(null,c),a=F(a),b=null,c=0),d=0;else break;return hg.a?hg.a(m,!0):hg.call(null,m,!0)}return null}}(a,b,c,e,f,g,l,m,n,p),p)}}(m,n,p,Q,R,na,l,b,f,g));ig.o(b,oe,Dq,p,N([Sn,m,Wl,n,Zt,Q,Uo,R,lk,na,Nk,l],0));r(e)?(console.debug.apply(console,Qe(x(Fd,
[t("enabling webworker: "),t(e)].join("")))),lH.disableWorker=!1,lH.workerSrc=e):(console.debug.apply(console,Qe(x(Fd,""+t("disabling webworker!")))),lH.disableWorker=!0,lH.workerSrc=null);m=function(){var a=ux(u);return ay("textLayer",a)}()[0];n=lF(m,"mousedown");p=Zf.a(X.g(KH),sj());Q=RE(1,p);R=oF(bF(new T(null,2,5,V,[lF(m,"keyup"),lF(m,"mouseup")],null)));na=YE(R,Q);l=QE(1);qE(function(b,c,d,e,f,g,l,m,n,p){return function(){var u=function(){return function(a){return function(){function b(c){for(;;){var d;
a:try{for(;;){var e=a(c);if(!qf(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,IE(c),d=Y;else throw f;}if(!qf(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.D=c;d.g=b;return d}()}(function(b,c,d){return function(b){var c=b[1];if(1===c)return b[2]=null,b[1]=2,Y;if(2===c)return EE(b,
4,d);if(3===c)return c=b[2],GE(b,c);if(4===c){var c=b[2],e=aJ.a?aJ.a(a,null):aJ.call(null,a,null);b[7]=e;b[8]=c;b[2]=null;b[1]=2;return Y}return null}}(b,c,d,e,f,g,l,m,n,p),b,c,d,e,f,g,l,m,n,p)}(),v=function(){var a=u.D?u.D():u.call(null);a[6]=b;return a}();return DE(v)}}(l,m,n,p,Q,R,na,b,f,g));l=QE(1);qE(function(a,b,c,d,e,f,g,l,m,n){return function(){var p=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!qf(e,Y)){d=e;break a}}}catch(f){if(f instanceof
Object)c[5]=f,IE(c),d=Y;else throw f;}if(!qf(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.D=c;d.g=b;return d}()}(function(a,b,c,d,e,f,g,l){return function(a){var b=a[1];if(7===b)return a[7]=a[2],a[2]=null,a[1]=2,Y;if(1===b)return a[2]=null,a[1]=
2,Y;if(4===b){var c=a[8],b=a[2],d=G.g?G.g(l):G.call(null,l),d=Zr.g(d),d=Nf(b,d);a[8]=b;a[1]=d?5:6;return Y}if(15===b)return b=a[2],a[2]=b,a[1]=12,Y;if(13===b)return b=a[9],b=Ee(b),a[1]=b?16:17,Y;if(6===b)return a[2]=null,a[1]=7,Y;if(17===b){var c=a[8],b=a[9],d=D(b),d=d.g?d.g(c):d.call(null,c),b=F(b),f,g;a[10]=b;a[11]=d;a[12]=0;a[13]=null;a[14]=0;a[2]=null;a[1]=8;return Y}if(3===b)return b=a[2],GE(a,b);if(12===b)return b=a[2],a[2]=b,a[1]=9,Y;if(2===b)return EE(a,4,e);if(11===b)return b=a[10],b=B(b),
a[9]=b,a[1]=b?13:14,Y;if(9===b)return b=a[2],a[2]=b,a[1]=7,Y;if(5===b)return c=a[8],d=ig.J(l,oe,Zr,c),b=G.g?G.g(l):G.call(null,l),b=ck.g(b),b=B(b),a[10]=b,a[15]=d,a[12]=0,a[13]=null,a[14]=0,a[2]=null,a[1]=8,Y;if(14===b)return a[2]=null,a[1]=15,Y;if(16===b)return b=a[9],d=gd(b),b=hd(b),c=M(d),a[10]=b,a[12]=c,a[13]=d,a[14]=0,a[2]=null,a[1]=8,Y;if(10===b){b=a[10];g=a[12];c=a[8];f=a[13];var d=a[14],m=gc.a(f,d),c=m.g?m.g(c):m.call(null,c);a[10]=b;a[16]=c;a[12]=g;a[13]=f;a[14]=d+1;a[2]=null;a[1]=8;return Y}return 18===
b?(b=a[2],a[2]=b,a[1]=15,Y):8===b?(g=a[12],d=a[14],b=d<g,a[1]=r(b)?10:11,Y):null}}(a,b,c,d,e,f,g,l,m,n),a,b,c,d,e,f,g,l,m,n)}(),u=function(){var b=p.D?p.D():p.call(null);b[6]=a;return b}();return DE(u)}}(l,m,n,p,Q,R,na,b,f,g));m=function(){var a=ux(u);return ay("canvasWrapper",a)}()[0];return ig.J(b,oe,Tl,xH(u,f,c,b,m))}}(f,g,l),Po,function(a){return function(b){var c=null!=b&&(b.l&64||b.M)?S(fg,b):b;b=A.a(c,nq);c=A.a(c,bn);console.error.apply(console,Qe(x(x(x(x(Fd,c)," "),b),"failed to connect to API! status: ")));
b=B($n.g(G.g?G.g(a):G.call(null,a)));for(var d=null,e=0,f=0;;)if(f<e){var c=d.N(null,f),g=new q(null,2,[Yp,!1,Tn,G.g?G.g(a):G.call(null,a)],null);c.g?c.g(g):c.call(null,g);f+=1}else if(b=B(b))Ee(b)?(d=gd(b),b=hd(b),c=d,e=M(d),d=c):(c=D(b),d=new q(null,2,[Yp,!1,Tn,G.g?G.g(a):G.call(null,a)],null),c.g?c.g(d):c.call(null,d),b=F(b),d=null,e=0),f=0;else return null}}(f,g,l)],null),r(c)?new q(null,1,[Ko,new q(null,1,["Authorization",[t("Bearer "),t(c)].join("")],null)],null):null],0))],0))}}(f,g,l),Fr,
"pdf-viewer-component",cq,function(a){return function(b,c,d,e,f,g,l,z){c=G.g?G.g(a):G.call(null,a);var L=null!=c&&(c.l&64||c.M)?S(fg,c):c;A.a(L,Zr);c=A.a(L,hr);d=A.a(L,Sn);e=A.a(L,Jr);f=A.a(L,Pt);var K=A.a(L,Gm),Q=A.a(L,iq),L=A.a(L,Zp),R=V;g=new q(null,3,[zq,"notaviewer-container-id",Aq,g,So,new q(null,4,[pn,l,Ut,z,zm,"scroll",bq,-1],null)],null);l=V;z=N([new q(null,1,[To,new T(null,1,5,V,["webkit"],null)],null),mH,new T(null,2,5,V,[Io,fe(new q(null,1,[hl,new T(null,1,5,V,[new T(null,5,5,V,[mH,"0.75s",
Ot,Kn,pp],null)],null)],null),new q(null,1,[Go,!0],null))],null)],0);z=S(kH,z);return new T(null,4,5,R,[Zo,g,new T(null,2,5,l,[So,z],null),new T(null,5,5,V,[Xm,new q(null,1,[So,new q(null,3,[Sr,"relative",pn,f,Ut,K],null)],null),new T(null,2,5,V,[Em,new q(null,1,[So,new q(null,2,[pn,f,Ut,K],null)],null)],null),new T(null,8,5,V,[cJ,b,c,L,e,d,f,K],null),new T(null,5,5,V,[dJ,b,Q,f,K],null)],null)],null)}}(f,g,l)],null))}
function gJ(a){return Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,2,5,V,[a,$t],null))}function hJ(a,b){r(b)?ig.a(Ax,function(c){return Ig.J(c,new T(null,2,5,V,[a,$n],null),ag(),b)}):console.warn.apply(console,Qe(x(x(Fd,a),"no initialization listener function provided to notaviewer for instance ")))}
function iJ(a,b,c){if(r(gJ(a)))return a=A.a(G.g?G.g(Ax):G.call(null,Ax),a),a=null!=a&&(a.l&64||a.M)?S(fg,a):a,a=A.a(a,Tl),a.h?a.h(c,Jr,b):a.call(null,c,Jr,b),!0;console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance ")));return!1}function OH(a){if(r(gJ(a)))return Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,2,5,V,[a,fm],null));console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance ")));return!1}
function jJ(a,b){if(r(b))return A.a(ig.a(Ax,function(c){return Ig.J(c,new T(null,2,5,V,[a,ck],null),ag(),b)}),a);console.warn.apply(console,Qe(x(x(Fd,a),"no text selection listener function provided to notaviewer for instance ")));return!1}
function aJ(a,b){if(r(gJ(a))){if(Nf(b,Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,2,5,V,[a,tl],null)))){for(var c=ig.a(Ax,function(c){return Hg(c,new T(null,2,5,V,[a,tl],null),b)}),d=B(Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,2,5,V,[a,tt],null))),e=null,f=0,g=0;;)if(g<f){var l=e.N(null,g);l.g?l.g(b):l.call(null,b);g+=1}else if(d=B(d))e=d,Ee(e)?(d=gd(e),g=hd(e),e=d,f=M(d),d=g):(d=D(e),d.g?d.g(b):d.call(null,b),d=F(e),e=null,f=0),g=0;else break;return A.a(c,a)}return null}console.warn.apply(console,
Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance ")));return!1}
function kJ(a,b,c,d){if(r(gJ(a))){var e=A.a(G.g?G.g(Ax):G.call(null,Ax),a),f=null!=e&&(e.l&64||e.M)?S(fg,e):e,g=A.a(f,Qs),l=A.a(f,Pt),m=A.a(f,Zt),n=A.a(f,lk),p=A.a(f,Nk),u=A.a(f,Wl),w=A.a(f,Gm),v=A.a(f,Sn),E=A.a(f,Uo),I=A.a(f,Zp),z=A.a(f,Dq),L=A.a(f,hr),K=A.a(f,Jr),Q=A.a(f,Zr),R=null!=Q&&(Q.l&64||Q.M)?S(fg,Q):Q,na=A.a(R,gu),J=A.a(R,Rt);if(r(r(na)?b:na)){var ma=JH(J),W=BH(ma,l,w),da=""+t(Uj()),fa=aJ(a,da);b=new q(null,8,["annotation_type_id",b,"document_sort_order_number",K*E+je(D(W))*p+D(D(W))*n,
"created_at",new q(null,1,[".sv","timestamp"],null),"created_by",v,"group",u,"highlights",Oh([[t("p"),t(K-1)].join(""),W],!0,!1),"metadata",c,"text",na],null);c=oe.h(Gg(I,new T(null,4,5,V,["documents",L,v,"annotations"],null)),da,b);gG();eJ(z,m,function(b,c,e,f,g,l,m,n,p,u,v,w,z,E,I,K,L,J,Q,R,W,da,fa,na,ma,Kp){return function(Lp){return Lp.child([t("projects/"),t(p),t("/documents/"),t(R),t("/"),t(K),t("/annotations")].join("")).update(xj(l),function(){return function(b){r(b)&&console.warn.apply(console,
Qe(x(x(Fd,b),"failed to add annotation to firebase: ")));return r(d)?(b=new q(null,2,[Yp,null==b,Tn,A.a(G.g?G.g(Ax):G.call(null,Ax),a)],null),d.g?d.g(b):d.call(null,b)):null}}(b,c,e,f,g,l,m,n,p,u,v,w,z,E,I,K,L,J,Q,R,W,da,fa,na,ma,Kp))}}(ma,W,da,fa,b,c,e,f,g,l,m,n,p,u,w,v,E,I,z,L,K,Q,Q,R,na,J));e=B(Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,2,5,V,[a,Nt],null)));f=null;for(l=g=0;;)if(l<g)m=f.N(null,l),m.g?m.g(b):m.call(null,b),l+=1;else if(e=B(e))f=e,Ee(f)?(e=gd(f),l=hd(f),f=e,g=M(e),e=l):(e=D(f),e.g?
e.g(b):e.call(null,b),e=F(f),f=null,g=0),l=0;else break;return!0}console.warn.apply(console,Qe(x(Fd,"no text selection data or selected annotation type id")));return!1}console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance ")));return!1}
function bJ(a,b,c){if(r(gJ(a))){var d=A.a(G.g?G.g(Ax):G.call(null,Ax),a),e=null!=d&&(d.l&64||d.M)?S(fg,d):d,f=A.a(e,Dq),g=A.a(e,Qs),l=A.a(e,Sn),m=A.a(e,Zt),n=A.a(e,hr),p=A.a(e,tl);eJ([t(f),t("projects/"),t(g),t("/documents/"),t(n),t("/"),t(l),t("/annotations/"),t(b)].join(""),m,function(d,e,f,g,l,m,n,p){return function(Q){return Q.remove(function(d,e,f,g,l,m,n,p){return function(d){r(d)&&console.warn.apply(console,Qe(x(x(x(x(Fd,d)," from firebase: "),b),"failed to remove annotation ")));Gd.a(b,p)&&
aJ(a,null);for(var e=B(Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,2,5,V,[a,Yj],null))),f=null,g=0,l=0;;)if(l<g){var m=f.N(null,l);m.g?m.g(b):m.call(null,b);l+=1}else if(e=B(e))f=e,Ee(f)?(e=gd(f),l=hd(f),f=e,g=M(e),e=l):(e=D(f),e.g?e.g(b):e.call(null,b),e=F(f),f=null,g=0),l=0;else break;return r(c)?(d=new q(null,2,[Yp,null==d,Tn,A.a(G.g?G.g(Ax):G.call(null,Ax),a)],null),c.g?c.g(d):c.call(null,d)):null}}(d,e,f,g,l,m,n,p))}}(d,e,f,g,l,m,n,p));return!0}console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),
a),"notaviewer for instance ")));return!1}
function lJ(a,b,c){if(r(gJ(a))){var d=A.a(G.g?G.g(Ax):G.call(null,Ax),a),e=null!=d&&(d.l&64||d.M)?S(fg,d):d,f=A.a(e,Zp),g=A.a(e,hr),l=A.a(e,Sn);return Se(function(){return function(a){return A.a(a,"document_sort_order_number")}}(d,e,f,g,l),function(){return function(a,b,c,d,e){return function E(f){return new tf(null,function(){return function(){for(;;){var a=B(f);if(a){if(Ee(a)){var b=gd(a),c=M(b),d=zf(c);a:for(var e=0;;)if(e<c){var g=gc.a(b,e),l=O(g,0,null),g=O(g,1,null),l=oe.h(g,"annotation_id",
l);d.add(l);e+=1}else{b=!0;break a}return b?Bf(d.Ca(),E(hd(a))):Bf(d.Ca(),null)}b=D(a);d=O(b,0,null);b=O(b,1,null);return de(oe.h(b,"annotation_id",d),E(Ed(a)))}return null}}}(a,b,c,d,e),null,null)}}(d,e,f,g,l)(Gg(f,new T(null,4,5,V,["documents",r(b)?b:g,r(c)?c:l,"annotations"],null)))}())}console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance ")));return!1}
function mJ(a,b){if(r(b))return A.a(ig.a(Ax,function(c){return Ig.J(c,new T(null,2,5,V,[a,tt],null),ag(),b)}),a);console.warn.apply(console,Qe(x(x(Fd,a),"no annotation selection listener function provided to notaviewer for instance ")));return!1}
function nJ(a,b,c){if(r(gJ(a))){var d=A.a(G.g?G.g(Ax):G.call(null,Ax),a),e=null!=d&&(d.l&64||d.M)?S(fg,d):d,f=A.a(e,Zp),g=A.a(e,hr),l=A.a(e,Sn),m=Gg(f,new T(null,5,5,V,["documents",g,l,"annotations",b],null)),n=null!=m&&(m.l&64||m.M)?S(fg,m):m,p=A.a(n,"highlights"),u=function(){var a=null==p?null:Jh(p),a=null==a?null:Pe(Me,a),a=null==a?null:D(a),a=null==a?null:a.substring(1);return null==a?null:parseInt(a)}();r(n)&&(aJ(a,b),iJ(a,u+1,function(){return function(a){var d;d=null==b?null:MH(b);d=null==
d?null:ia(d)?document.getElementById(d):d;d=null==d?null:d.firstElementChild;var e;e=ia("notaviewer-container-id")?document.getElementById("notaviewer-container-id"):"notaviewer-container-id";if(r(d)){var f=(e=e||dy(document))||dy(document),g=vD(d),l=vD(f),m;if(!Hx||9<=Sx)n=uD(f,"borderLeftWidth"),m=uD(f,"borderRightWidth"),p=uD(f,"borderTopWidth"),u=uD(f,"borderBottomWidth"),m=new qD(parseFloat(p),parseFloat(m),parseFloat(u),parseFloat(n));else{var n=xD(f,"borderLeft");m=xD(f,"borderRight");var p=
xD(f,"borderTop"),u=xD(f,"borderBottom");m=new qD(p,m,u,n)}if(f==dy(document)){n=g.x-f.scrollLeft;g=g.y-f.scrollTop;if(l=Hx)l=!(10<=Sx);l&&(n+=m.left,g+=m.top)}else n=g.x-l.x-m.left,g=g.y-l.y-m.top;l=f.clientHeight-d.offsetHeight;m=f.scrollLeft;p=f.scrollTop;m+=n-(f.clientWidth-d.offsetWidth)/2;d=new Xx(m,p+(g-l/2));e.scrollLeft=d.x;e.scrollTop=d.y}return r(c)?c.g?c.g(a):c.call(null,a):null}}(d,e,f,g,l,m,n,n,p,u)))}else console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance ")))}
function oJ(a,b){if(r(b))return A.a(ig.a(Ax,function(c){return Ig.J(c,new T(null,2,5,V,[a,Nt],null),ag(),b)}),a);console.warn.apply(console,Qe(x(x(Fd,a),"no annotation addition listener function provided to notaviewer for instance ")));return!1}function pJ(a,b){if(r(b))return A.a(ig.a(Ax,function(c){return Ig.J(c,new T(null,2,5,V,[a,Yj],null),ag(),b)}),a);console.warn.apply(console,Qe(x(x(Fd,a),"no annotation deletion listener function provided to notaviewer for instance ")));return!1};zb=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new C(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Vb?Ub(a):Tb.call(null,a))}a.I=0;a.H=function(a){a=B(a);return b(a)};a.o=b;return a}();
Ab=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new C(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Vb?Ub(a):Tb.call(null,a))}a.I=0;a.H=function(a){a=B(a);return b(a)};a.o=b;return a}();console.info.apply(console,Qe(x(x(Fd,PDFJS.version),"PDFJS version: ")));var qJ;
function rJ(a){return new T(null,9,5,V,[fJ,zq.g(a),Et.g(a),yo.g(a),zr.g(a),kr.g(a),zo.g(a),pn.g(a),Ut.g(a)],null)}if(!r(rJ))throw Error("Assert failed: c");qJ=xv(rJ)?rJ:Ow(rJ);Aa("notaviewer.PDFViewerComponent",qJ);Aa("notaviewer.main",function(a,b,c,d,e,f,g,l){a=new T(null,9,5,V,[fJ,a,b,c,d,e,f,g,l],null);b=document.getElementById("app");return wx?tx(a,b,null):vx.call(null,a,b)});Aa("notaviewer.addInitializationListener",function(a,b){r(b)&&hJ(a,Zf.a(b,xj));return null});
Aa("notaviewer.dumpState",function(a){var b=xj;a=A.a(G.g?G.g(Ax):G.call(null,Ax),a);return b(a)});Aa("notaviewer.getDocuments",function(a){var b=xj;if(r(gJ(a))){var c=Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,2,5,V,[a,Yo],null));a=Li(c,Jh(Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,3,5,V,[a,Zp,"documents"],null))))}else console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance "))),a=!1;return b(a)});
Aa("notaviewer.getSchema",function(a){var b=xj;r(gJ(a))?a=Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,3,5,V,[a,Zp,"schema"],null)):(console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance "))),a=!1);return b(a)});
Aa("notaviewer.openDocument",function(a,b,c){c=r(c)?Zf.a(c,xj):null;if(r(gJ(a))){var d=A.a(G.g?G.g(Ax):G.call(null,Ax),a),e=null!=d&&(d.l&64||d.M)?S(fg,d):d,d=A.a(e,Tl),e=A.a(e,ol),e=[t(e),t("/documents/"),t(b),t("/pdf")].join("");ig.J(Ax,Hg,new T(null,2,5,V,[a,hr],null),b);d.h?d.h(c,jr,e):d.call(null,c,jr,e);a=!0}else console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance "))),a=!1;return a});
Aa("notaviewer.getPageCount",function(a){r(gJ(a))?a=Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,2,5,V,[a,Vt],null)):(console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance "))),a=!1);return a});Aa("notaviewer.getPageNum",function(a){r(gJ(a))?a=Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,2,5,V,[a,Jr],null)):(console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance "))),a=!1);return a});
Aa("notaviewer.setPageNum",function(a,b,c){return iJ(a,b,r(c)?Zf.a(c,xj):null)});Aa("notaviewer.getScale",function(a){return OH(a)});Aa("notaviewer.setScale",function(a,b,c){c=r(c)?Zf.a(c,xj):null;r(gJ(a))?(a=A.a(G.g?G.g(Ax):G.call(null,Ax),a),a=null!=a&&(a.l&64||a.M)?S(fg,a):a,a=A.a(a,Tl),a.h?a.h(c,fm,b):a.call(null,c,fm,b),b=!0):(console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance "))),b=!1);return b});
Aa("notaviewer.addTextSelectionListener",function(a,b){return r(b)?xj(jJ(a,Zf.a(b,xj))):null});Aa("notaviewer.addAnnotation",function(a,b,c,d){return kJ(a,b,c,r(d)?Zf.a(d,xj):null)});Aa("notaviewer.deleteAnnotation",function(a,b,c){return bJ(a,b,r(c)?Zf.a(c,xj):null)});Aa("notaviewer.selectAnnotation",function(a,b){return xj(aJ(a,b))});
Aa("notaviewer.getSelectedAnnotationID",function(a){r(gJ(a))?a=Gg(G.g?G.g(Ax):G.call(null,Ax),new T(null,2,5,V,[a,tl],null)):(console.warn.apply(console,Qe(x(x(x(Fd," is not ready!"),a),"notaviewer for instance "))),a=!1);return a});Aa("notaviewer.getAnnotations",function(a,b,c){return xj(lJ(a,b,c))});Aa("notaviewer.addAnnotationSelectionListener",function(a,b){return r(b)?xj(mJ(a,b)):null});Aa("notaviewer.scrollToAnnotation",function(a,b,c){r(b)&&nJ(a,b,r(c)?Zf.a(c,xj):null);return null});
Aa("notaviewer.addAnnotationAdditionListener",function(a,b){return r(b)?xj(oJ(a,r(b)?Zf.a(b,xj):null)):null});Aa("notaviewer.addAnnotationDeletionListener",function(a,b){return r(b)?xj(pJ(a,b)):null});
})();
