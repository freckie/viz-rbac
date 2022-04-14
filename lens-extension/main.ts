import { Main } from "@k8slens/extensions";

export default class VizRBACExtensionMain extends Main.LensExtension {
  onActivate() {
    console.log("viz-rbac activated");
  }

  onDeactivate() {
    console.log("viz-rbac de-activated");
  }
}
