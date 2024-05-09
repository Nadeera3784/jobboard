import { Abstract, Type } from '@nestjs/common';

export interface DiscoveredModule {
    name: string;
    instance: {};
    injectType?: Type<any> | Abstract<any>;
    dependencyType: Type<{}>;
}
export interface DiscoveredClass extends DiscoveredModule {
    parentModule: DiscoveredModule;
}

export interface DiscoveredMethod {
    handler: Function;
    methodName: string;
    parentClass: DiscoveredClass;
}

export interface DiscoveredMethodWithMeta<T> {
    discoveredMethod: DiscoveredMethod;
    meta: T;
}
export interface DiscoveredClassWithMeta<T> {
    discoveredClass: DiscoveredClass;
    meta: T;
}

export interface MetaData {
    discoveredMethod: DiscoveredMethod;
    meta: any;
}