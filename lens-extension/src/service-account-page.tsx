import { Renderer } from "@k8slens/extensions";
import { SettingStore } from "./setting-store";
import { CoffeeDoodle } from "react-open-doodles";
import path from "path";
import React from "react";

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
          설정에서 입력한 address :{" "}
          {SettingStore.getInstanceOrCreate().apiAddress}
        </p>
      </div>
    );
  }
}
