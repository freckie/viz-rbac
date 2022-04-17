import React from "react";
import { Renderer } from "@k8slens/extensions";
import { SettingStore } from "../+viz-rbac-settings/settings-store";
import { CoffeeDoodle } from "react-open-doodles";
import path from "path";
import { namespaceStore } from "./namespace-store";
import { observer } from "mobx-react";

@observer
export class ServiceAccountPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  render() {
    const doodleStyle = {
      width: "200px",
    };

    return (
      <div className="flex column gaps align-flex-start">
        <div style={doodleStyle}>
          <CoffeeDoodle accent="#3d90ce" />
        </div>
        <p>service account page</p>
        <p>
          설정에서 입력한 api 주소 :{"    "}
          {SettingStore.getInstanceOrCreate().apiAddress}
          <br />
        </p>
        <br />
        <p>
          네임 스페이스 개수 :{"    "}
          {namespaceStore.getTotalCount()}
        </p>
        <br />
        <p>네임 스페이스 리스트</p>
        {namespaceStore.items.map((namespace) => (
          <p>{namespace.getName()}</p>
        ))}
      </div>
    );
  }
}
