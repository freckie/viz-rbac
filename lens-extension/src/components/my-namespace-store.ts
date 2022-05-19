import { Common } from "@k8slens/extensions";
import { observable, makeObservable, runInAction, action } from "mobx";
import fetch from "node-fetch";
import type { Response, RequestInit } from "node-fetch";

export type MyNamespaceModel = {
  namespaces: Array<string>;
  namespacesCount: number;
  apiAddress: string;
  addressValidity: boolean;
  selectedNamespace: string;
};

export class MyNamespaceStore extends Common.Store
  .ExtensionStore<MyNamespaceModel> {
  @observable namespaces = [""];
  @observable namespacesCount = 0;
  @observable apiAddress = "";
  @observable addressValidity = false;
  @observable selectedNamespace = "";

  public constructor() {
    super({
      configName: "my-namespace-store",
      defaults: {
        namespaces: [],
        namespacesCount: 0,
        apiAddress: "",
        addressValidity: false,
        selectedNamespace: "",
      },
    });
    makeObservable(this);
  }
  // test 를 위해 api api 따로 만들지 않고 여기에 다 넣었음
  // 추후 실제로 사용할 것이라면 api 모아서 따로 구현 필요
  @action.bound public async loadMyNamespaces() {
    console.log("load my namespace 실행 : ", this.apiAddress);
    this.namespaces = [];
    this.namespacesCount = 0;
    this.addressValidity = false;
    this.selectedNamespace = "";
    const res: Response = await fetch(
      `${this.apiAddress}/api/res/v1/namespaces`
    );
    runInAction(async () => {
      let data;
      let text;
      try {
        text = await res.text();
        data = text ? JSON.parse(text) : "";
      } catch (e) {
        data = text;
        this.namespaces = [];
        this.namespacesCount = 0;
        this.addressValidity = false;
        this.apiAddress = "";
        this.selectedNamespace = "";
      } finally {
        this.namespaces = data.data.namespaces;
        this.namespacesCount = data.data.namespaces_count;
        this.addressValidity = true;
        this.selectedNamespace = "";
      }
    });
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
      return this.createInstance();
    }
  }
}
