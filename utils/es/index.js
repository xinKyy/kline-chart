import { setPrecision } from './decimal/index.js';
import * as index from './decimal/index.js';
export { index as decimalUtils };
import * as index$1 from './market/index.js';
export { index$1 as marketUtils };
import * as index$2 from './fast-url/index.js';
export { index$2 as fastUrlUtils };
import * as index$3 from './security/index.js';
export { index$3 as securityUtils };
import * as index$4 from './env/index.js';
export { index$4 as envUtils };
import * as index$5 from './vite-plugins/index.js';
export { index$5 as vitePlugins };
import * as index$6 from './post-message/index.js';
export { index$6 as postMessage };

/** 调整默认精度位：运算结果的最大有效位数 */
setPrecision(40);
