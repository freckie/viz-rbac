import { Common } from "@k8slens/extensions";
import { observable, makeObservable } from "mobx";
import fetch from "node-fetch";
import type { Response, RequestInit } from "node-fetch";

export type MyNamespaceModel = {
  namespaces: Array<string>;
  namespacesCount: number;
  apiAddress: string;
  addressValidity: boolean;
};

export class MyNamespaceStore extends Common.Store
  .ExtensionStore<MyNamespaceModel> {
  @observable namespaces = [""];
  @observable namespacesCount = 0;
  @observable apiAddress = "";
  @observable addressValidity = false;

  public constructor() {
    super({
      configName: "my-namespace-store",
      defaults: {
        namespaces: [],
        namespacesCount: 0,
        apiAddress: "",
        addressValidity: false,
      },
    });
    makeObservable(this);
  }

  // test 를 위해 api api 따로 만들지 않고 여기에 다 넣었음
  // 추후 실제로 사용할 것이라면 api 모아서 따로 구현 필요
  public async loadMyNamespaces() {
    const res: Response = await fetch(this.apiAddress);
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
    } finally {
      this.namespaces = data.data.namespaces;
      this.namespacesCount = data.data.namespaces_count;
      this.addressValidity = true;
    }
  }

  protected fromStore({
    namespaces,
    namespacesCount,
    addressValidity,
    apiAddress,
  }: MyNamespaceModel): void {
    this.namespaces = namespaces;
    this.namespacesCount = namespacesCount;
    this.addressValidity = addressValidity;
    this.apiAddress = apiAddress;
  }

  toJSON(): MyNamespaceModel {
    return {
      namespaces: this.namespaces,
      namespacesCount: this.namespacesCount,
      addressValidity: this.addressValidity,
      apiAddress: this.apiAddress,
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
