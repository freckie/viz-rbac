import { Renderer } from "@k8slens/extensions";
import { VizRBACIcon, VizRBACPage } from "./src/service-account-page";
import React from "react";

export default class VizRBACExtension extends Renderer.LensExtension {
  clusterPages = [
    {
      id: "viz-rbac", // hello-world:foo
      components: {
        Page: () => <VizRBACPage extension={this} />,
      },
    },
  ];

  clusterPageMenus = [
    {
      target: { pageId: "viz-rbac" },
      title: "viz-rbac",
      components: {
        Icon: VizRBACIcon,
      },
    },
  ];

  async onActivate() {
    console.log("viz-rbac");
  }
}
