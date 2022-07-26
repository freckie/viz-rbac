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
  authArray: Array<Array<Array<string>>>; // userAccounts에 대한 resource가 가진 권한
  loading: boolean;
  selected: boolean;
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
  @observable authArray = [[['']]];
  @observable loading = false;
  @observable selected = false;
  constructor() {
    super({
      configName: 'User-Account-Resource-Store',
      defaults: {
        userAccounts: [''],
        resources: [''],
        authArray: [[['']]],
        loading: false,
        selected: false,
      },
    });
    makeObservable(this);
  }
  // test 를 위해 api api 따로 만들지 않고 여기에 다 넣었음
  // 추후 실제로 사용할 것이라면 api 모아서 따로 구현 필요
  @action.bound async loadUserResources() {
    const myNamespaceStore = MyNamespaceStore.getInstance();
    this.userAccounts = [''];
    this.resources = [''];
    this.authArray = [[['']]];
    this.loading = true;
    console.log(
      'load user account resource 실행 : ',
      myNamespaceStore.addressValidity
    );
    // namespace 주소를 가져온 것이 유효한 경우에만 userAccounts를 가져온다
    if (myNamespaceStore.addressValidity) {
      const res: Response = await fetch(
        `${myNamespaceStore.apiAddress}/api/agg/v1/heatmap/user-res/${myNamespaceStore.selectedNamespace}`
      );
      runInAction(async () => {
        let data;
        let text;
        try {
          text = await res.text();
          data = text ? JSON.parse(text) : '';
        } catch (e) {
          data = text;
          this.userAccounts = [''];
          this.resources = [''];
          this.authArray = [[['']]];
          this.loading = false;
        } finally {
          // data 정재하고 넣기
          await this.uniformData(data.data);
          this.loading = false;
        }
      });
    } else {
      this.userAccounts = [''];
      this.resources = [''];
      this.authArray = [[['']]];
      this.loading = false;
    }
  }

  private async uniformData(userAccountData: UserAccounts) {
    const _ns = userAccountData;

    // Data
    let _x = new Set<string>();
    for (const [k] of Object.entries(_ns)) {
      Object.keys(_ns[k]).forEach((it) => _x.add(it));
    }

    this.resources = Array.from(_x);
    this.userAccounts = Object.keys(_ns);
    this.authArray = this.userAccounts.map((y) =>
      this.resources.map((x) => _ns[y][x])
    );
  }

  protected fromStore({
    userAccounts,
    resources,
    authArray,
    loading,
    selected,
  }: UAResourceModel): void {
    this.userAccounts = userAccounts;
    this.resources = resources;
    this.authArray = authArray;
    this.loading = loading;
    this.selected = selected;
  }

  toJSON(): UAResourceModel {
    return {
      userAccounts: this.userAccounts,
      resources: this.resources,
      authArray: this.authArray,
      loading: this.loading,
      selected: this.selected,
    };
  }

  static getInstanceOrCreate() {
    try {
      return this.getInstance();
    } catch {
      const newInstance = this.createInstance();
      reaction(
        () => MyNamespaceStore.getInstance().selectedNamespace,
        () => newInstance.loadUserResources()
      );
      return newInstance;
    }
  }
}
