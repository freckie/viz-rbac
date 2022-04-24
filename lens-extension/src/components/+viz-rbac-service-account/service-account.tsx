import React from "react";
import { Renderer } from "@k8slens/extensions";
import { SettingStore } from "../+viz-rbac-settings/settings-store";
import { CoffeeDoodle } from "react-open-doodles";
import path from "path";
import { namespaceStore } from "./namespace-store";
import { MyNamespaceStore } from "./my-namespace-store";
import { observer } from "mobx-react";

@observer
export class ServiceAccountPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  async componentDidMount() {
    // api 주소 입력이 바뀔때마다 자동으로 load되게하면 불필요한 호출 증가
    // service account에서만 쓸것이니 component 마운트 되면 namespace load
    await MyNamespaceStore.getInstanceOrCreate().loadMyNamespaces(
      SettingStore.getInstanceOrCreate().apiAddress
    );
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
        <p>service account page</p>
        <p>
          설정에서 입력한 api 주소 :{"    "}
          {SettingStore.getInstanceOrCreate().apiAddress}
          <br />
        </p>
        <br />
        <p> lens 제공 api </p>
        <p>
          네임 스페이스 개수 :{"    "}
          {namespaceStore.getTotalCount()}
        </p>
        <br />
        <p>네임 스페이스 리스트</p>
        {namespaceStore.items.map((namespace) => (
          <p>{namespace.getName()}</p>
        ))}
        <br /> <br />
        <p> frekie 제공 api</p>
        {MyNamespaceStore.getInstanceOrCreate().addressValidity ? (
          <>
            <p>
              네임 스페이스 개수 :{"    "}
              {MyNamespaceStore.getInstanceOrCreate().namespacesCount}
            </p>
            <br />
            <p>네임 스페이스 리스트</p>
            {MyNamespaceStore.getInstanceOrCreate().namespaces.map(
              (namespace) => (
                <p>{namespace}</p>
              )
            )}
            <button
              onClick={() =>
                MyNamespaceStore.getInstanceOrCreate().loadMyNamespaces(
                  SettingStore.getInstanceOrCreate().apiAddress
                )
              }
            >
              네임스페이스 리스트 불러오기
            </button>
          </>
        ) : (
          <p>올바른 api 경로가 아니거나, api에 문제가 존재합니다.</p>
        )}
      </div>
    );
  }
}
