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

export type UAResourceModel = {
  userAccounts: Array<string>;
  resources: Array<string>;
  resourceAuths: Array<Array<Array<string>>>; // resource auth
  loading: boolean;
  selected: boolean; // is res selected
};

type UserAccounts = {
  [key: string]: Resources;
};

type Resources = {
  [key: string]: Array<string>;
};

export class UAResourceStore extends Common.Store
  .ExtensionStore<UAResourceModel> {
  @observable userAccounts = [''];
  @observable resources = [''];
  @observable resourceAuths = [[['']]];
  @observable loading = false;
  @observable selected = false;
  constructor() {
    super({
      configName: 'User-Accounts-Resource-Store',
      defaults: {
        userAccounts: [''],
        resources: [''],
        resourceAuths: [[['']]],
        loading: false,
        selected: false,
      },
    });
    makeObservable(this);
  }

  /**
   * load user account resource from stored api server
   */
  @action.bound async loadUserResources() {
    const myNamespaceStore = MyNamespaceStore.getInstance();
    this.loading = true;

    console.log('[viz-rbac] Run load user account resource');

    // only address is valid
    if (myNamespaceStore.addressValidity) {
      const res: Response = await fetch(
        `${myNamespaceStore.apiAddress}/api/agg/v1/heatmap/user-res/${myNamespaceStore.selectedNamespace}`
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
          this.userAccounts = [''];
          this.resources = [''];
          this.resourceAuths = [[['']]];
          this.loading = false;
        });
      }
    } else {
      runInAction(() => {
        this.userAccounts = [''];
        this.resources = [''];
        this.resourceAuths = [[['']]];
        this.loading = false;
      });
    }
  }

  private async uniformData(userAccountData: UserAccounts) {
    const _ns = userAccountData;

    // Data
    let _x = new Set<string>();
    for (const [k] of Object.entries(_ns)) {
      Object.keys(_ns[k]).forEach((it) => _x.add(it));
    }
    runInAction(() => {
      this.resources = Array.from(_x);
      this.userAccounts = Object.keys(_ns);
      this.resourceAuths = this.userAccounts.map((y) =>
        this.resources.map((x) => _ns[y][x])
      );
      this.loading = false;
    });
  }

  protected fromStore({
    userAccounts,
    resources,
    resourceAuths,
    loading,
    selected,
  }: UAResourceModel): void {
    this.userAccounts = userAccounts;
    this.resources = resources;
    this.resourceAuths = resourceAuths;
    this.loading = loading;
    this.selected = selected;
  }

  toJSON(): UAResourceModel {
    return {
      userAccounts: this.userAccounts,
      resources: this.resources,
      resourceAuths: this.resourceAuths,
      loading: this.loading,
      selected: this.selected,
    };
  }

  static getInstanceOrCreate() {
    try {
      return this.getInstance();
    } catch {
      const newInstance = this.createInstance();
      // if selected namespace change, reload userResources
      reaction(
        () => MyNamespaceStore.getInstance().selectedNamespace,
        () => newInstance.loadUserResources()
      );
      return newInstance;
    }
  }
}
