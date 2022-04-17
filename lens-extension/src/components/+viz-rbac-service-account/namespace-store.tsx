import type { IReactionDisposer } from "mobx";
import { Renderer } from "@k8slens/extensions";
import { comparer, makeObservable, reaction, computed } from "mobx";

// refer https://github.com/lensapp/lens/blob/1a29759bff937dde69c1e6bdfa0231d1253ed379/src/renderer/components/%2Bnamespaces/namespace-store/namespace.store.ts

export class NamespaceStore extends Renderer.K8sApi
  .KubeObjectStore<Renderer.K8sApi.Namespace> {
  api = Renderer.K8sApi.namespacesApi;

  constructor() {
    super();
    makeObservable(this);
    this.init();
  }

  private async init() {
    await this.contextReady;
    this.autoLoadAllowedNamespaces();
  }

  private autoLoadAllowedNamespaces(): IReactionDisposer {
    return reaction(
      () => this.allowedNamespaces,
      (namespaces) => this.loadAll({ namespaces }),
      {
        fireImmediately: true,
        equals: comparer.shallow,
      }
    );
  }

  @computed get allowedNamespaces(): string[] {
    return Array.from(
      new Set(
        [
          ...(this.context?.allNamespaces ?? []), // allowed namespaces from cluster (main), updating every 30s
          ...this.items.map((item) => item.getName()), // loaded namespaces from k8s api
        ].flat()
      )
    );
  }
}

export const namespaceStore = new NamespaceStore();
