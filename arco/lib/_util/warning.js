"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function warning(condition, message) {
    if (process.env.NODE_ENV !== 'production' && console) {
        if (condition) {
            console.error("[@arco-design/web-react]: " + message);
        }
    }
}
exports.default = warning;
