var cssModuleHMR = function cssModuleHMR() {
  var CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)($|\\?)/;
  // eslint-disable-next-line security/detect-non-literal-regexp
  var cssModuleRE = new RegExp("\\.module".concat(CSS_LANGS_RE.source));
  return {
    enforce: 'post',
    name: 'css-module-hmr',
    apply: 'serve',
    // @ts-ignore
    transform: function transform(src, id) {
      if (cssModuleRE.test(id)) {
        return {
          code: "".concat(src, "\n\nimport.meta.hot && import.meta.hot.accept()")
        };
      }
    },
    handleHotUpdate: function handleHotUpdate(context) {
      var modules = context.modules;
      modules.forEach(function (module) {
        if (cssModuleRE.test(module.id)) module.isSelfAccepting = true;
      });
    }
  };
};
export { cssModuleHMR };
