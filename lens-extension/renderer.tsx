import { Renderer } from "@k8slens/extensions";
import { ServiceAccountPage } from "./src/service-account-page";
import { UserAccountPage } from "./src/user-account-page";
import { SettingPage } from "./src/setting-page";
import { SettingStore } from "./src/setting-store";
import React from "react";

export function VizRBACIcon(props: Renderer.Component.IconProps) {
  return (
    <Renderer.Component.Icon {...props} material="pages" tooltip={"VIZ_RBAC"} />
  );
}

export default class VizRBACExtension extends Renderer.LensExtension {
  async onActivate() {
    await SettingStore.getInstanceOrCreate().loadExtension(this);
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
      parentId: "viz-rbac",
      target: { pageId: "service-account" },
      title: "[viz] Service Account",
      components: {
        Icon: VizRBACIcon,
      },
    },
    {
      parentId: "viz-rbac",
      target: { pageId: "user-account" },
      title: "[viz] User Account",
      components: {
        Icon: VizRBACIcon,
      },
    },
    {
      parentId: "viz-rbac",
      target: { pageId: "settings" },
      title: "[viz] Settings",
      components: {
        Icon: VizRBACIcon,
      },
    },
  ];
}
