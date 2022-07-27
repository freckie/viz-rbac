import { Renderer } from '@k8slens/extensions';
import { MyNamespaceStore } from './../my-namespace-store';
import React from 'react';
import { observer } from 'mobx-react';

@observer
export class SettingsPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  state = {
    apiAddr: MyNamespaceStore.getInstanceOrCreate().apiAddress,
  };
  render() {
    const mynamespaceStore = MyNamespaceStore.getInstanceOrCreate();
    return (
      <div className='flex column gaps align-flex-start'>
        <p>setting page</p>
        <div className='flex'>
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
            }}
          >
            apply
          </button>
        </div>
      </div>
    );
  }
}
