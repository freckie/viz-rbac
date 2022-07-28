import { Common } from '@k8slens/extensions';
import {
  observable,
  makeObservable,
  runInAction,
  action,
  reaction,
} from 'mobx';
import fetch from 'node-fetch';
import type { Response } from 'node-fetch';
import { MyNamespaceStore } from '../my-namespace-store';

export type SAResourceModel = {
  serviceAccounts: Array<string>;
  resources: Array<string>;
  resourceAuths: Array<Array<Array<string>>>; // resource auth
  loading: boolean;
};

type ServiceAccounts = {
  [key: string]: Resources;
};

type Resources = {
  [key: string]: Array<string>;
};

export class SAResourceStore extends Common.Store
  .ExtensionStore<SAResourceModel> {
  @observable serviceAccounts = [''];
  @observable resources = [''];
  @observable resourceAuths = [[['']]];
  @observable loading = false;
  constructor() {
    super({
      configName: 'Service-Accounts-Resource-Store',
      defaults: {
        serviceAccounts: [''],
        resources: [''],
        resourceAuths: [[['']]],
        loading: false,
      },
    });
    makeObservable(this);
  }

  /**
   * load service account resource from stored api server
   */
  @action.bound async loadServiceAccounts() {
    const myNamespaceStore = MyNamespaceStore.getInstanceOrCreate();
    this.loading = true;

    console.log('[viz-rbac] Run load service account resource');

    // only address is valid
    if (myNamespaceStore.addressValidity) {
      const res: Response = await fetch(
        `${myNamespaceStore.apiAddress}/api/agg/v1/heatmap/sa-res/${myNamespaceStore.selectedNamespace}`
      );
      let data: any;
      let text: any;
      try {
        text = await res.text();
        data = text ? await JSON.parse(text) : '';
        await this.uniformData(data.data);
      } catch (e) {
        console.log(e);
        runInAction(async () => {
          this.serviceAccounts = [''];
          this.resources = [''];
          this.resourceAuths = [[['']]];
          this.loading = false;
        });
      }
    } else {
      runInAction(() => {
        this.serviceAccounts = [''];
        this.resources = [''];
        this.resourceAuths = [[['']]];
        this.loading = false;
      });
    }
  }

  private async uniformData(serviceAccountData: ServiceAccounts) {
    const _ns = serviceAccountData;

    // Data
    let _x = new Set<string>();
    for (const [k] of Object.entries(_ns)) {
      Object.keys(_ns[k]).forEach((it) => _x.add(it));
    }
    runInAction(async () => {
      this.resources = Array.from(_x);
      this.serviceAccounts = Object.keys(_ns);
      this.resourceAuths = this.serviceAccounts.map((y) =>
        this.resources.map((x) => _ns[y][x])
      );
      this.loading = false;
    });
  }

  protected fromStore({
    serviceAccounts,
    resources,
    resourceAuths,
    loading,
  }: SAResourceModel): void {
    this.serviceAccounts = serviceAccounts;
    this.resources = resources;
    this.resourceAuths = resourceAuths;
    this.loading = loading;
  }

  toJSON(): SAResourceModel {
    return {
      serviceAccounts: this.serviceAccounts,
      resources: this.resources,
      resourceAuths: this.resourceAuths,
      loading: this.loading,
    };
  }

  static getInstanceOrCreate() {
    try {
      return this.getInstance();
    } catch {
      const newInstance = this.createInstance();
      // if selected namespace change, reload data
      reaction(
        () => MyNamespaceStore.getInstanceOrCreate().selectedNamespace,
        () => newInstance.loadServiceAccounts()
      );
      return newInstance;
    }
  }
}
