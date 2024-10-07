import { s3CommonConfig } from './common.js';
var s3VpnConfig = Object.assign(Object.assign({}, s3CommonConfig), {
  // s3 生产环境加速
  originProdS3Domain: 'https://vpn-s3-prod-saas-515.s3.ap-southeast-1.amazonaws.com',
  fastProdS3Domain: 'https://vpn-s3-prod-saas-515.s3-accelerate.amazonaws.com',
  // s3 测试环境加速
  originTestS3Domain: 'https://vpn-s3-staging-saas-515.s3.ap-southeast-1.amazonaws.com',
  fastTestS3Domain: 'https://vpn-s3-staging-saas-515.s3-accelerate.amazonaws.com',
  // 融合模式 s3 秘钥信息
  mergeModeS3ProdDomain: 'https://hybird-accesskey-prod-aa-saas-515.s3.ap-southeast-1.amazonaws.com'
});
export { s3VpnConfig };
