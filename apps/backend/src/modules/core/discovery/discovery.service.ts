import { Injectable, Scope } from '@nestjs/common';
import {
  DiscoveredClass,
  DiscoveredClassWithMeta,
  DiscoveredMethod,
  MetaData,
} from './discovery.interfaces';
import { MetadataScanner, ModulesContainer } from '@nestjs/core';
import { some, uniqBy, flatMap, get } from 'lodash';
import { PATH_METADATA } from '@nestjs/common/constants';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';

@Injectable()
export class DiscoveryService {
  private discoveredControllers: Promise<DiscoveredClass[]>;
  private discoveredProviders: Promise<DiscoveredClass[]>;

  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
  ) {
    const modulesMap = [...this.modulesContainer.entries()];
    this.discoveredControllers = Promise.all(
      flatMap(modulesMap, ([_key, nestModule]) => {
        const components = [...nestModule.routes.values()];
        return components
          .filter((component) => component.scope !== Scope.REQUEST)
          .map((component) => this.toDiscoveredClass(nestModule, component));
      }),
    );
    this.discoveredProviders = Promise.all(
      flatMap(modulesMap, ([_key, nestModule]) => {
        const components = [...nestModule.components.values()];
        return components
          .filter((component) => component.scope !== Scope.REQUEST)
          .map((component) => this.toDiscoveredClass(nestModule, component));
      }),
    );
  }

  /**
   * Discovers all providers in a Nest App that match a filter
   *
   * @param filter
   */
  async providers(
    filter: (component: DiscoveredClass) => boolean,
  ): Promise<DiscoveredClass[]> {
    return (await this.discoveredProviders).filter((x) => filter(x));
  }

  /**
   * Discovers all controller methods that either directly have a certain meta key attached to them
   * or belong to a controller that has the same meta key attached to them
   *
   * @param metaKey The meta key to scan for
   * @param metaFilter An optional filter for the contents of the meta object
   */
  async methodsAndControllerMethodsWithMetaAtKey(
    metaKey: string,
    metaFilter: (meta: any) => boolean = (meta) => true,
  ): Promise<DiscoveredMethod[]> {
    const controllersWithMeta = (
      await this.controllersWithMetaAtKey(metaKey)
    ).filter((_x) => metaFilter(_x.meta));
    const methodsFromDecoratedControllers = flatMap(
      controllersWithMeta,
      (controller) => {
        return this.classMethodsWithMetaAtKey(
          controller.discoveredClass,
          PATH_METADATA,
        );
      },
    );
    const decoratedMethods = (
      await this.controllerMethodsWithMetaAtKey(metaKey)
    ).filter((_x) => metaFilter(_x.meta));
    return uniqBy(
      [...methodsFromDecoratedControllers, ...decoratedMethods],
      (x) => x.discoveredMethod.handler,
    );
  }

  /**
   * Discovers all providers in an App that have meta at a specific key and returns the provider(s) and associated meta
   *
   * @param metaKey The metakey to scan for
   */
  async providersWithMetaAtKey<T>(
    metaKey: string,
  ): Promise<Array<DiscoveredClassWithMeta<T>>> {
    const providers = await this.providers(this.withMetaAtKey(metaKey));
    return providers.map((x) => ({
      discoveredClass: x,
      meta: this.getComponentMetaAtKey(metaKey, x),
    }));
  }

  /**
   * Discovers all controllers in a Nest App that match a filter
   *
   * @param filter
   */
  async controllers(
    filter: (component: DiscoveredClass) => boolean,
  ): Promise<DiscoveredClass[]> {
    return (await this.discoveredControllers).filter((x) => filter(x));
  }

  /**
   * Discovers all controllers in an App that have meta at a specific key
   * and returns the controller(s) and associated meta
   *
   * @param metaKey The metakey to scan for
   */
  async controllersWithMetaAtKey<T>(
    metaKey: string,
  ): Promise<Array<DiscoveredClassWithMeta<T>>> {
    const controllers = await this.controllers(this.withMetaAtKey(metaKey));
    return controllers.map((x) => ({
      discoveredClass: x,
      meta: this.getComponentMetaAtKey(metaKey, x),
    }));
  }

  /**
   * Discovers all method handlersMapping matching a particular metakey from a Provider or Controller
   *
   * @param component
   * @param metaKey
   */
  classMethodsWithMetaAtKey(
    component: DiscoveredClass,
    metaKey: string,
  ): MetaData[] {
    const { instance } = component;
    if (instance === undefined) {
      return [];
    }
    const prototype = Object.getPrototypeOf(instance);
    return this.metadataScanner
      .scanFromPrototype(instance, prototype, (name) =>
        this.extractMethodMetaAtKey(metaKey, component, prototype, name),
      )
      .filter((x) => !!x.meta);
  }

  /**
   * Discovers all the methods that exist on providers in a Nest App that contain metadata under a specific key
   *
   * @param metaKey The metakey to scan for
   * @param providerFilter A predicate used to limit the providers being scanned. Defaults to all providers
   */
  async providerMethodsWithMetaAtKey(
    metaKey: string,
    providerFilter: (component: DiscoveredClass) => boolean = (x) => true,
  ): Promise<MetaData[]> {
    const providers = await this.providers(providerFilter);
    return flatMap(providers, (provider) =>
      this.classMethodsWithMetaAtKey(provider, metaKey),
    );
  }

  /**
   * Discovers all the methods that exist on controllers in a Nest App that contain metadata under a specific key
   *
   * @param metaKey The metakey to scan for
   * @param controllerFilter A predicate used to limit the controllers being scanned. Defaults to all providers
   */
  async controllerMethodsWithMetaAtKey(
    metaKey: string,
    controllerFilter: (component: DiscoveredClass) => boolean = (x) => true,
  ): Promise<MetaData[]> {
    const controllers = await this.controllers(controllerFilter);
    return flatMap(controllers, (controller) =>
      this.classMethodsWithMetaAtKey(controller, metaKey),
    );
  }

  private async toDiscoveredClass(
    nestModule: any,
    wrapper: any,
  ): Promise<DiscoveredClass> {
    const instanceHost = wrapper.getInstanceByContextId(
      STATIC_CONTEXT,
      wrapper && wrapper.id ? wrapper.id : undefined,
    );
    if (instanceHost.isPending && !instanceHost.isResolved) {
      await instanceHost.donePromise;
    }
    return {
      dependencyType: get(instanceHost, 'instance.constructor'),
      injectType: wrapper.metatype,
      instance: instanceHost.instance,
      name: wrapper.name,
      parentModule: {
        dependencyType: nestModule.instance.constructor,
        injectType: nestModule.metatype,
        instance: nestModule.instance,
        name: nestModule.metatype.name,
      },
    };
  }

  private extractMethodMetaAtKey(
    metaKey: string,
    discoveredClass: DiscoveredClass,
    prototype: any,
    methodName: string,
  ): MetaData {
    const handler = prototype[methodName];
    const meta = Reflect.getMetadata(metaKey, handler);
    return {
      discoveredMethod: {
        handler,
        methodName,
        parentClass: discoveredClass,
      },
      meta,
    };
  }

  private getComponentMetaAtKey(key: string, component: DiscoveredClass): any {
    const dependencyMeta = Reflect.getMetadata(key, component.dependencyType);
    if (dependencyMeta) {
      return dependencyMeta;
    }
    if (component.injectType !== null) {
      return Reflect.getMetadata(key, component.injectType);
    }
  }

  /**
   * A filter that can be used to search for DiscoveredClasses in an App that contain meta attached to a
   * certain key
   *
   * @param key The meta key to search for
   */
  private withMetaAtKey = (key: string) => (component: DiscoveredClass) => {
    const metaTargets = [
      component.instance ? component.instance.constructor : null,
      component.injectType,
    ].filter((x) => x !== null && x !== undefined);
    return some(metaTargets, (x) => Reflect.getMetadata(key, x));
  };
}
