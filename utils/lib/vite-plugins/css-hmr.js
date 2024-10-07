'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const cssModuleHMR = () => {
    const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)($|\\?)/;
    // eslint-disable-next-line security/detect-non-literal-regexp
    const cssModuleRE = new RegExp(`\\.module${CSS_LANGS_RE.source}`);
    return {
        enforce: 'post',
        name: 'css-module-hmr',
        apply: 'serve',
        // @ts-ignore
        transform(src, id) {
            if (cssModuleRE.test(id)) {
                return {
                    code: `${src}\n\nimport.meta.hot && import.meta.hot.accept()`,
                };
            }
        },
        handleHotUpdate(context) {
            const { modules } = context;
            modules.forEach(module => {
                if (cssModuleRE.test(module.id))
                    module.isSelfAccepting = true;
            });
        },
    };
};

exports.cssModuleHMR = cssModuleHMR;
