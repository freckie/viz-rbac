import React from "react";
import { Renderer } from "@k8slens/extensions";
import { MyNamespaceStore } from "../my-namespace-store";
import { SAResourceStore } from "./sa-resource-store";
import { observer, disposeOnUnmount } from "mobx-react";
import { reaction, action } from "mobx";

@observer
export class ServiceAccountPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  render() {
    const mynamespaceStore = MyNamespaceStore.getInstanceOrCreate();
    const sAResourceStore = SAResourceStore.getInstanceOrCreate();

    this.componentDidMount = () => {
      console.log("asdasd");
      sAResourceStore.loadServiceAccounts();
    };
    return (
      <Renderer.Component.TabLayout className="ServiceAccountPage">
        <header className="flex gaps align-center">
          <h4 className="flex gaps align-center">
            <span>
              {sAResourceStore.serviceAccounts.length} Service Account
            </span>
          </h4>
          <h4 className="flex gaps align-center">
            <span>{sAResourceStore.resources.length} resources</span>
          </h4>
          <div className="box right">Namespace Fillter</div>
          <Renderer.Component.Select
            id="container-selector-input"
            placeholder="Select a namespace..."
            options={mynamespaceStore.namespaces}
            onChange={({ value }) => {
              mynamespaceStore.selectedNamespace = value;
              sAResourceStore.loadServiceAccounts();
            }}
            value={mynamespaceStore.selectedNamespace}
          />
        </header>
        <div>
          {sAResourceStore.loading ? (
            <p>로딩중</p>
          ) : (
            <div>
              <p>로딩완료</p>
              {mynamespaceStore.addressValidity
                ? sAResourceStore.serviceAccounts.length > 0
                  ? sAResourceStore.serviceAccounts.map((item) => <p>{item}</p>)
                  : "no serviceaccount check api or check namepsace"
                : "주소가 유효하지 않습니다."}
            </div>
          )}
        </div>
      </Renderer.Component.TabLayout>
    );
  }
}
