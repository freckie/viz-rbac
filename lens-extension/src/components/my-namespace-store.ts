import { Common } from '@k8slens/extensions';
import { observable, makeObservable, runInAction, action } from 'mobx';
import fetch from 'node-fetch';
import type { Response } from 'node-fetch';
import { reaction } from 'mobx';
import { UANamespaceAuthCountStore } from './+viz-rbac-user-account/ua-namespace-auth-count-store';

export type MyNamespaceModel = {
  namespaces: Array<string>;
  namespacesCount: number;
  apiAddress: string;
  addressValidity: boolean;
  selectedNamespace: string;
};

export class MyNamespaceStore extends Common.Store
  .ExtensionStore<MyNamespaceModel> {
  @observable apiAddress = '';
  @observable selectedNamespace = '';
  @observable addressValidity = false;
  namespaces = [''];
  namespacesCount = 0;
  public constructor() {
    super({
      configName: 'my-namespace-store',
      defaults: {
        namespaces: [],
        namespacesCount: 0,
        apiAddress: '',
        addressValidity: false,
        selectedNamespace: '',
      },
    });
    makeObservable(this);
  }

  @action public changeApiAddress(newApiAddress: string) {
    this.apiAddress = newApiAddress;
  }

  @action public changeSelectedNamespace(newNamespace: string) {
    this.selectedNamespace = newNamespace;
  }
  /**
   * load namespaces from stored api server
   */
  @action.bound public async loadMyNamespaces() {
    this.namespaces = [];
    this.namespacesCount = 0;
    this.addressValidity = false;
    this.selectedNamespace = '';

    console.log('[viz-rbac] Run load namespace');

    const res: Response = await fetch(
      `${this.apiAddress}/api/res/v1/namespaces`
    );

    let data: any;
    let text: any;
    try {
      text = await res.text();
      data = text ? await JSON.parse(text) : '';
      runInAction(() => {
        this.namespaces = data.data.namespaces;
        this.namespacesCount = data.data.namespaces_count;
        this.addressValidity = true;
        this.selectedNamespace = '';
      });
    } catch (e) {
      runInAction(() => {
        this.namespaces = [];
        this.namespacesCount = 0;
        this.addressValidity = false;
        this.selectedNamespace = '';
      });
    }
  }

  protected fromStore({
    namespaces,
    namespacesCount,
    addressValidity,
    apiAddress,
    selectedNamespace,
  }: MyNamespaceModel): void {
    this.namespaces = namespaces;
    this.namespacesCount = namespacesCount;
    this.addressValidity = addressValidity;
    this.apiAddress = apiAddress;
    this.selectedNamespace = selectedNamespace;
  }

  toJSON(): MyNamespaceModel {
    return {
      namespaces: this.namespaces,
      namespacesCount: this.namespacesCount,
      addressValidity: this.addressValidity,
      apiAddress: this.apiAddress,
      selectedNamespace: this.selectedNamespace,
    };
  }

  static getInstanceOrCreate() {
    try {
      return this.getInstance();
    } catch {
      const newInstance = this.createInstance();
      // if api address change, reload myNamespaces and userAccountNamespaceAuthCount
      reaction(
        () => newInstance.apiAddress,
        async () => {
          await newInstance.loadMyNamespaces();
          await UANamespaceAuthCountStore.getInstance().loadUserNamespaceAuthCounts();
        }
      );
      return newInstance;
    }
  }
}
