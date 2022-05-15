import { Common } from "@k8slens/extensions";
import { observable, makeObservable, runInAction, action } from "mobx";
import fetch from "node-fetch";
import type { Response, RequestInit } from "node-fetch";
import { MyNamespaceStore } from "../my-namespace-store";

export type SAResourceModel = {
  serviceAccounts: Array<string>;
  resources: Array<string>;
  authArray: Array<Array<Array<string>>>; // serviceAccounts에 대한 resource가 가진 권한
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
  @observable serviceAccounts = [""];
  @observable resources = [""];
  @observable authArray = [[[""]]];
  @observable loading = false;
  public constructor() {
    super({
      configName: "Service-Account-Resource-Store",
      defaults: {
        serviceAccounts: [""],
        resources: [""],
        authArray: [[[""]]],
        loading: false,
      },
    });
    makeObservable(this);
  }

  // test 를 위해 api api 따로 만들지 않고 여기에 다 넣었음
  // 추후 실제로 사용할 것이라면 api 모아서 따로 구현 필요
  async loadServiceAccounts() {
    const myNamespaceStore = MyNamespaceStore.getInstanceOrCreate();
    this.serviceAccounts = [""];
    this.resources = [""];
    this.authArray = [[[""]]];
    this.loading = true;
    console.log(
      "load service account 실행 : ",
      myNamespaceStore.addressValidity
    );
    // namespace 주소를 가져온 것이 유효한 경우에만 serviceAccounts를 가져온다
    if (myNamespaceStore.addressValidity) {
      const res: Response = await fetch(
        `${myNamespaceStore.apiAddress}/api/agg/v1/heatmap/sa-res/${myNamespaceStore.selectedNamespace}`
      );
      runInAction(async () => {
        let data;
        let text;
        try {
          text = await res.text();
          data = text ? JSON.parse(text) : "";
        } catch (e) {
          data = text;
          this.serviceAccounts = [""];
          this.resources = [""];
          this.authArray = [[[""]]];
          this.loading = false;
        } finally {
          // data 정재하고 넣기
          await this.uniformData(data.data);
          this.loading = false;
        }
      });
    } else {
      this.serviceAccounts = [""];
      this.resources = [""];
      this.authArray = [[[""]]];
      this.loading = false;
    }
  }

  private async uniformData(serviceAccountData: ServiceAccounts) {
    const _ns = serviceAccountData;

    // Data
    let _x = new Set<string>();
    for (const [k] of Object.entries(_ns)) {
      Object.keys(_ns[k]).forEach((it) => _x.add(it));
    }

    this.resources = Array.from(_x);
    this.serviceAccounts = Object.keys(_ns);
    this.authArray = this.serviceAccounts.map((y) =>
      this.resources.map((x) => _ns[y][x])
    );
  }

  protected fromStore({
    serviceAccounts,
    resources,
    authArray,
    loading,
  }: SAResourceModel): void {
    this.serviceAccounts = serviceAccounts;
    this.resources = resources;
    this.authArray = authArray;
    this.loading = loading;
  }

  toJSON(): SAResourceModel {
    return {
      serviceAccounts: this.serviceAccounts,
      resources: this.resources,
      authArray: this.authArray,
      loading: this.loading,
    };
  }

  static getInstanceOrCreate() {
    try {
      return this.getInstance();
    } catch {
      return this.createInstance();
    }
  }
}
