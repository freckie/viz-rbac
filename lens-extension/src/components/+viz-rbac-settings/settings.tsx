import { Renderer } from "@k8slens/extensions";
import { SettingStore } from "./settings-store";
import { CoffeeDoodle } from "react-open-doodles";
import path from "path";
import React from "react";
import { observer } from "mobx-react";

// store 는 lens가 재시작 되면 default로 초기화
// However, in the example, the enabled state is not stored anywhere, and it reverts to the default when Lens is restarted.

@observer
export class SettingPage extends React.Component<{
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
        <p>setting page</p>
        <div style={{ display: "flex" }}>
          <input
            value={SettingStore.getInstance().apiAddress}
            onChange={(v) => {
              SettingStore.getInstance().apiAddress = v.target.value;
            }}
          />
        </div>
      </div>
    );
  }
}
