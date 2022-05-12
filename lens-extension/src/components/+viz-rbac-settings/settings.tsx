import { Renderer } from "@k8slens/extensions";
import { MyNamespaceStore } from "./../my-namespace-store";
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
  async componentWillUnmount() {
    // api 주소 입력이 바뀔때마다 자동으로 load되게하면 불필요한 호출 증가
    // setting 페이지 밖으로 나갈때 namespace를 불러온다.
    await MyNamespaceStore.getInstanceOrCreate().loadMyNamespaces();
  }
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
            value={MyNamespaceStore.getInstance().apiAddress}
            onChange={(v) => {
              MyNamespaceStore.getInstance().apiAddress = v.target.value;
            }}
          />
        </div>
      </div>
    );
  }
}
