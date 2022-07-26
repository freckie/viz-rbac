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

export type UANamespaceModel = {
  userAccounts: Array<string>;
  namespaces: Array<string>;
  countArray: Array<Array<Array<string>>>; // user 가 가진 네임스페이스별 수
  loading: boolean;
  selected: boolean;
};

type UserNamespaceDataType = {
  [key: string]: Namespaces;
};

type Namespaces = {
  [key: string]: number;
};

export class UANamespaceStore extends Common.Store
  .ExtensionStore<UANamespaceModel> {
  @observable userAccounts = [''];
  @observable namespaces = [''];
  @observable countArray = [[['']]];
  @observable loading = false;
  @observable selected = true;

  constructor() {
    super({
      configName: 'User-Account-Namespace-Store',
      defaults: {
        userAccounts: [''],
        namespaces: [''],
        countArray: [[['']]],
        loading: false,
        selected: true,
      },
    });
    makeObservable(this);
  }
  // test 를 위해 api api 따로 만들지 않고 여기에 다 넣었음
  // 추후 실제로 사용할 것이라면 api 모아서 따로 구현 필요
  @action.bound async loadUserNamespacesCount() {
    const myNamespaceStore = MyNamespaceStore.getInstance();
    this.userAccounts = [''];
    this.namespaces = [''];
    this.countArray = [[['']]];
    this.loading = true;
    console.log(myNamespaceStore.apiAddress);
    console.log(myNamespaceStore.addressValidity);
    console.log('load user ns 실행 : ', myNamespaceStore.addressValidity);
    // namespace 주소를 가져온 것이 유효한 경우에만 userAccounts를 가져온다
    if (myNamespaceStore.addressValidity) {
      const res: Response = await fetch(
        `${myNamespaceStore.apiAddress}/api/agg/v1/heatmap/user-ns`
      );
      runInAction(async () => {
        let data;
        let text;
        try {
          text = await res.text();
          data = text ? JSON.parse(text) : '';
        } catch (e) {
          console.log(e);
          data = text;
          this.userAccounts = [''];
          this.namespaces = [''];
          this.countArray = [[['']]];
          this.loading = false;
        } finally {
          // data 정재하고 넣기
          await this.uniformData(data.data);
          this.loading = false;
        }
      });
    } else {
      this.userAccounts = [''];
      this.namespaces = [''];
      this.countArray = [[['']]];
      this.loading = false;
    }
  }

  private async uniformData(userNamespaceData: UserNamespaceDataType) {
    const _ns = userNamespaceData;

    // Data
    console.log(_ns);
    let _x = new Set<string>();
    for (const [k] of Object.entries(_ns)) {
      Object.keys(_ns[k]).forEach((it) => _x.add(it));
    }

    this.namespaces = Array.from(_x);
    this.userAccounts = Object.keys(_ns);
    this.countArray = this.userAccounts.map((y) =>
      this.namespaces.map((x) => [String(_ns[y][x])])
    );
    console.log(this.countArray);
  }

  protected fromStore({
    userAccounts,
    namespaces,
    countArray,
    loading,
    selected,
  }: UANamespaceModel): void {
    this.userAccounts = userAccounts;
    this.namespaces = namespaces;
    this.countArray = countArray;
    this.loading = loading;
    this.selected = selected;
  }

  toJSON(): UANamespaceModel {
    return {
      userAccounts: this.userAccounts,
      namespaces: this.namespaces,
      countArray: this.countArray,
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
