import { Common } from "@k8slens/extensions";
import { observable, makeObservable } from "mobx";

export type SettingModel = {
  apiAddress: string;
};

export class SettingStore extends Common.Store.ExtensionStore<SettingModel> {
  @observable apiAddress = "localhost";

  public constructor() {
    super({
      configName: "example-preferences-store",
      defaults: {
        apiAddress: "localhost",
      },
    });
    makeObservable(this);
  }

  protected fromStore({ apiAddress }: SettingModel): void {
    this.apiAddress = apiAddress;
  }

  toJSON(): SettingModel {
    return {
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
