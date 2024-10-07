export declare const Namespaces: {
    getwayBaseUrl: string;
    uatServerBaseUrl: string;
    commonServerBaseUrl: string;
    getBaseServerUrl: (bid: string | number) => string;
};
export declare enum MerchantIDEnum {
    common = "common",
    uat = "uat",
    im = "im",
    vpn = "vpn"
}
export declare const MerchantID: {
    common: {
        originDevS3Domain: string;
        fastDevS3Domain: string;
        originTestS3Domain: string;
        fastTestS3Domain: string;
        originProdS3Domain: string;
        fastProdS3Domain: string;
        originS3Domain: string;
        fastS3Domain: string;
        fastS3DomainOld: string;
        originOSSDomain: string;
        fastOSSDomain: string;
        originOSSDomainOld: string;
        fastOSSDomainOld: string;
        originDevS3ProdUploadDomain: string;
        fastDevS3ProdUploadDomain: string;
        originDevS3DevUploadDomain: string;
        fastDevS3DevUploadDomain: string;
        mergeModeS3ProdDomain: string;
        mergeModeS3TestDomain: string;
        mergeModeS3DevDomain: string;
    };
    uat: {
        originProdS3Domain: string;
        fastProdS3Domain: string;
        originDevS3Domain: string;
        fastDevS3Domain: string;
        originTestS3Domain: string;
        fastTestS3Domain: string;
        originS3Domain: string;
        fastS3Domain: string;
        fastS3DomainOld: string;
        originOSSDomain: string;
        fastOSSDomain: string;
        originOSSDomainOld: string;
        fastOSSDomainOld: string;
        originDevS3ProdUploadDomain: string;
        fastDevS3ProdUploadDomain: string;
        originDevS3DevUploadDomain: string;
        fastDevS3DevUploadDomain: string;
        mergeModeS3ProdDomain: string;
        mergeModeS3TestDomain: string;
        mergeModeS3DevDomain: string;
    };
    im: {
        originProdS3Domain: string;
        fastProdS3Domain: string;
        originTestS3Domain: string;
        fastTestS3Domain: string;
        mergeModeS3ProdDomain: string;
        originDevS3Domain: string;
        fastDevS3Domain: string;
        originS3Domain: string;
        fastS3Domain: string;
        fastS3DomainOld: string;
        originOSSDomain: string;
        fastOSSDomain: string;
        originOSSDomainOld: string;
        fastOSSDomainOld: string;
        originDevS3ProdUploadDomain: string;
        fastDevS3ProdUploadDomain: string;
        originDevS3DevUploadDomain: string;
        fastDevS3DevUploadDomain: string;
        mergeModeS3TestDomain: string;
        mergeModeS3DevDomain: string;
    };
    vpn: {
        originProdS3Domain: string;
        fastProdS3Domain: string;
        originTestS3Domain: string;
        fastTestS3Domain: string;
        mergeModeS3ProdDomain: string;
        originDevS3Domain: string;
        fastDevS3Domain: string;
        originS3Domain: string;
        fastS3Domain: string;
        fastS3DomainOld: string;
        originOSSDomain: string;
        fastOSSDomain: string;
        originOSSDomainOld: string;
        fastOSSDomainOld: string;
        originDevS3ProdUploadDomain: string;
        fastDevS3ProdUploadDomain: string;
        originDevS3DevUploadDomain: string;
        fastDevS3DevUploadDomain: string;
        mergeModeS3TestDomain: string;
        mergeModeS3DevDomain: string;
    };
};
export declare enum EnvTypesEnum {
    development = "development",
    dev = "dev",
    test = "test",
    stress = "stress",
    production = "production"
}
/**
 * Nodejs 环境变量映射到实际业务的环境变量简称
 */
export declare const EnvTypesMap: {
    development: string;
    dev: string;
    test: string;
    stress: string;
    production: string;
};
/** S3 配置文件名枚举 */
export declare enum S3UrlNameEnum {
    /** dns 配置文件名 */
    dnsConfig = "_dnsConfig.json",
    /** 动态化配置文件名 */
    moduleAuthConfig = "_mainFuncStatus.json"
}
/**
 * 获取 S3 域名配置信息
 */
export declare const getBaseEnvS3Url: (mode: string, type: string, id?: MerchantIDEnum) => string;
/**
 * 获取 S3 域名配置信息
 */
export declare const getEnvS3Url: (mode: string, businessId: string, urlName?: S3UrlNameEnum, id?: MerchantIDEnum) => string;
/**
 * 获取 S3 秘钥信息
 */
export declare const getEnvSecretS3KeyConfig: (mode: string, accessKey: string, id?: MerchantIDEnum) => string;
/**
 * 获取融合模式秘钥信息
 */
export declare const getMergeModeEnvSecretS3KeyConfig: (mode: string, accessKey: string, id?: MerchantIDEnum) => string;
/**
 * AWS S3 对象存储配置，上传需要的 config
 */
export declare function getEnvAwsS3Config(mode: any): {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
};
/**
 * 获取系统维护相关信息
 */
export declare const getEnvS3MaintenanceApiUrl: (mode: EnvTypesEnum, businessId: any, id?: MerchantIDEnum) => string;
