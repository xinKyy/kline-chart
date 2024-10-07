declare class IframeEventChannel {
    private subscribers;
    private constructor();
    static instance: IframeEventChannel;
    static getInstance(): IframeEventChannel;
    subscribe(eventName: string, callback: any): void;
    publish(eventName: string, data: MessageEvent): void;
    send(dom: any, data: MessageEvent, url?: string): void;
    receive(fun: (data: MessageEvent) => void): void;
    emit(data: MessageEvent, url?: string): void;
    on(fun: (data: MessageEvent) => void): void;
    destroy(): void;
}
export declare enum CommandsEnum {
    jumpToLogin = "jumpToLogin",
    jumpToHome = "jumpToHome",
    start = "start",
    switch = "switch",
    web = "recreation-web",
    h5 = "recreation-h5"
}
/** 公告跑马灯路由挑战 */
export declare enum HourseLampEnum {
    main = "announcement",
    article = "announcementArticle"
}
export default IframeEventChannel;
