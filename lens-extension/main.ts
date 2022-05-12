import { Main } from "@k8slens/extensions";
import { MyNamespaceStore } from "./src/components/my-namespace-store";
export default class VizRBACMainExtension extends Main.LensExtension {
  async onActivate() {
    console.log("viz-rbac activated");
  }

  async onDeactivate() {
    console.log("viz-rbac de-activated");
  }
}
