import { Common } from '@k8slens/extensions';
import { observable, makeObservable, runInAction, action } from 'mobx';
import fetch from 'node-fetch';
import type { Response } from 'node-fetch';
import { MyNamespaceStore } from '../my-namespace-store';

export type UANamespaceModel = {
  userAccounts: Array<string>;
  namespaces: Array<string>;
  namespaceAuthCounts: Array<Array<Array<string>>>; // user's namespaces auth count
  loading: boolean;
  selected: boolean; // is na selected
};

type UserNamespaceDataType = {
  [key: string]: Namespaces;
};

type Namespaces = {
  [key: string]: number;
};

export class UANamespaceAuthCountStore extends Common.Store
  .ExtensionStore<UANamespaceModel> {
  @observable userAccounts = [''];
  @observable namespaces = [''];
  @observable namespaceAuthCounts = [[['']]];
  @observable loading = false;
  @observable selected = true;

  constructor() {
    super({
      configName: 'User-Accounts-Namespace-Auth-Count-Store',
      defaults: {
        userAccounts: [''],
        namespaces: [''],
        namespaceAuthCounts: [[['']]],
        loading: false,
        selected: true,
      },
    });
    makeObservable(this);
  }

  @action.bound async loadUserNamespaceAuthCounts() {
    const myNamespaceStore = MyNamespaceStore.getInstance();
    this.loading = true;

    console.log('[viz-rbac] Run load user account namespace auth count');

    // only address is valid
    if (myNamespaceStore.addressValidity) {
      const res: Response = await fetch(
        `${myNamespaceStore.apiAddress}/api/agg/v1/heatmap/user-ns`
      );
      let data: any;
      let text: any;
      try {
        text = await res.text();
        data = text ? await JSON.parse(text) : '';
        await this.uniformData(data.data);
      } catch (e) {
        console.log(e);
        runInAction(() => {
          this.userAccounts = [''];
          this.namespaces = [''];
          this.namespaceAuthCounts = [[['']]];
          this.loading = false;
        });
      }
    } else {
      runInAction(() => {
        this.userAccounts = [''];
        this.namespaces = [''];
        this.namespaceAuthCounts = [[['']]];
        this.loading = false;
      });
    }
  }

  private async uniformData(userNamespaceData: UserNamespaceDataType) {
    const _ns = userNamespaceData;

    // Data
    let _x = new Set<string>();
    for (const [k] of Object.entries(_ns)) {
      Object.keys(_ns[k]).forEach((it) => _x.add(it));
    }

    runInAction(() => {
      this.namespaces = Array.from(_x);
      this.userAccounts = Object.keys(_ns);
      this.namespaceAuthCounts = this.userAccounts.map((y) =>
        this.namespaces.map((x) => [String(_ns[y][x])])
      );
      this.loading = false;
    });
  }

  protected fromStore({
    userAccounts,
    namespaces,
    namespaceAuthCounts,
    loading,
    selected,
  }: UANamespaceModel): void {
    this.userAccounts = userAccounts;
    this.namespaces = namespaces;
    this.namespaceAuthCounts = namespaceAuthCounts;
    this.loading = loading;
    this.selected = selected;
  }

  toJSON(): UANamespaceModel {
    return {
      userAccounts: this.userAccounts,
      namespaces: this.namespaces,
      namespaceAuthCounts: this.namespaceAuthCounts,
      loading: this.loading,
      selected: this.selected,
    };
  }

  static getInstanceOrCreate() {
    try {
      return this.getInstance();
    } catch {
      const newInstance = this.createInstance();
      return newInstance;
    }
  }
}
