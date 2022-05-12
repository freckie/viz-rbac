import React from "react";
import { Renderer } from "@k8slens/extensions";
import { namespaceStore } from "./namespace-store";
import { MyNamespaceStore } from "../my-namespace-store";
import { observer } from "mobx-react";

const {
  Component: { Menu, MenuItem, Select },
} = Renderer;

@observer
export class ServiceAccountPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  render() {
    return (
      <Renderer.Component.TabLayout className="ServiceAccountPage">
        <header className="flex gaps align-center">
          <h2 className="flex gaps align-center">
            <span>64 Service Account</span>
          </h2>
          <h2 className="flex gaps align-center">
            <span>128 resources</span>
          </h2>
          <div className="box right">Namespace Fillter</div>
        </header>
      </Renderer.Component.TabLayout>
    );
  }
}
