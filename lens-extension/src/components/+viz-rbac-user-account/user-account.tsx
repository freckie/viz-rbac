import { Renderer } from "@k8slens/extensions";
import { CoffeeDoodle } from "react-open-doodles";
import { MyNamespaceStore } from "./../my-namespace-store";
import path from "path";
import React from "react";

export class UserAccountPage extends React.Component<{
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
        <p>user account page</p>
        <p>{MyNamespaceStore.getInstanceOrCreate().apiAddress}</p>
      </div>
    );
  }
}
