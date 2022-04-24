import { Common } from "@k8slens/extensions";
import { observable, makeObservable, reaction } from "mobx";
import fetch from "node-fetch";
import type { Response, RequestInit } from "node-fetch";

export type MyNamespaceModel = {
  namespaces: Array<string>;
  namespacesCount: number;
  addressValidity: boolean;
};

export class MyNamespaceStore extends Common.Store
  .ExtensionStore<MyNamespaceModel> {
  @observable namespaces = [""];
  @observable namespacesCount = 0;
  @observable addressValidity = false;

  public constructor() {
    super({
      configName: "my-namespace-store",
      defaults: {
        namespaces: [],
        namespacesCount: 0,
        addressValidity: false,
      },
    });
    makeObservable(this);
  }

  // test 를 위해 api api 따로 만들지 않고 여기에 다 넣었음
  // 추후 실제로 사용할 것이라면 api 모아서 따로 구현 필요
  public async loadMyNamespaces(address: string) {
    const res: Response = await fetch(address);
    let data;
    let text;
    try {
      text = await res.text();
      data = text ? JSON.parse(text) : "";
    } catch (e) {
      data = text;
    }

    this.namespaces = data.data.namespaces;
    this.namespacesCount = data.data.namespaces_count;
    this.addressValidity = true;
  }

  protected fromStore({
    namespaces,
    namespacesCount,
    addressValidity,
  }: MyNamespaceModel): void {
    this.namespaces = namespaces;
    this.namespacesCount = namespacesCount;
    this.addressValidity = addressValidity;
  }

  toJSON(): MyNamespaceModel {
    return {
      namespaces: this.namespaces,
      namespacesCount: this.namespacesCount,
      addressValidity: this.addressValidity,
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
