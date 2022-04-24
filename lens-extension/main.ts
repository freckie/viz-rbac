import { Main } from "@k8slens/extensions";
import { SettingStore } from "./src/components/+viz-rbac-settings/settings-store";
import { MyNamespaceStore } from "./src/components/+viz-rbac-service-account/my-namespace-store";
export default class VizRBACMainExtension extends Main.LensExtension {
  async onActivate() {
    await SettingStore.getInstanceOrCreate().loadExtension(this);
    await MyNamespaceStore.getInstanceOrCreate().loadExtension(this);
    console.log("viz-rbac activated");
  }

  async onDeactivate() {
    await SettingStore.resetInstance();
    console.log("viz-rbac de-activated");
  }
}
