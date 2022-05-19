import { Renderer } from "@k8slens/extensions";
import { ServiceAccountPage } from "./src/components/+viz-rbac-service-account/service-account";
import { UserAccountPage } from "./src/components/+viz-rbac-user-account/user-account";
import { SettingPage } from "./src/components/+viz-rbac-settings/settings";
import React from "react";
import { MyNamespaceStore } from "./src/components/my-namespace-store";
import { SAResourceStore } from "./src/components/+viz-rbac-service-account/sa-resource-store";

export function VizRBACIcon(props: Renderer.Component.IconProps) {
  return (
    <Renderer.Component.Icon {...props} material="pages" tooltip={"VIZ_RBAC"} />
  );
}

export default class VizRBACExtension extends Renderer.LensExtension {
  async onActivate() {
    MyNamespaceStore.getInstanceOrCreate().loadExtension(this);
    SAResourceStore.getInstanceOrCreate().loadExtension(this);
    console.log("viz-rbac");
  }

  clusterPages = [
    {
      id: "service-account",
      components: {
        Page: () => <ServiceAccountPage extension={this} />,
      },
    },
    {
      id: "user-account",
      components: {
        Page: () => <UserAccountPage extension={this} />,
      },
    },
    {
      id: "settings",
      components: {
        Page: () => <SettingPage extension={this} />,
      },
    },
  ];

  clusterPageMenus = [
    {
      id: "viz-rbac",
      title: "viz-rbac",
      components: {
        Icon: VizRBACIcon,
      },
    },
    {
      id: "service-account",
      parentId: "viz-rbac",
      target: { pageId: "service-account" },
      title: "Service Account",
      components: {
        Icon: VizRBACIcon,
      },
    },
    {
      id: "user-account",
      parentId: "viz-rbac",
      target: { pageId: "user-account" },
      title: "User Account",
      components: {
        Icon: VizRBACIcon,
      },
    },
    {
      id: "settings",
      parentId: "viz-rbac",
      target: { pageId: "settings" },
      title: "Settings",
      components: {
        Icon: VizRBACIcon,
      },
    },
  ];
}
