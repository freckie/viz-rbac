import { Renderer } from "@k8slens/extensions";
import { MyNamespaceStore } from "./../my-namespace-store";
import { CoffeeDoodle } from "react-open-doodles";
import path from "path";
import React from "react";
import { observer } from "mobx-react";
import { reaction, observable } from "mobx";

@observer
export class SettingPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  // observable apiAddr = "" 로 했을때 Input value 변경 안되는 issue 해결 못함
  // 추후 시간 여유 있을때 해결해보기. 일단은 state로 대체
  state = {
    apiAddr: MyNamespaceStore.getInstanceOrCreate().apiAddress,
  };
  render() {
    const mynamespaceStore = MyNamespaceStore.getInstanceOrCreate();
    const doodleStyle = {
      width: "200px",
    };

    return (
      <div className="flex column gaps align-flex-start">
        <div style={doodleStyle}>
          <CoffeeDoodle accent="#3d90ce" />
        </div>
        <p>setting page</p>
        <div style={{ display: "flex" }}>
          <Renderer.Component.Input
            value={this.state.apiAddr}
            onChange={(v) => {
              this.setState({
                apiAddr: v,
              });
            }}
          />
          <button
            onClick={() => {
              mynamespaceStore.apiAddress = this.state.apiAddr;
              mynamespaceStore.loadMyNamespaces();
            }}
          >
            저장
          </button>
        </div>
      </div>
    );
  }
}
