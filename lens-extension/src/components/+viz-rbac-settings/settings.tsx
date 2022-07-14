import { Renderer } from '@k8slens/extensions';
import { MyNamespaceStore } from './../my-namespace-store';
import { CoffeeDoodle } from 'react-open-doodles';
import path from 'path';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { reaction, observable, autorun } from 'mobx';

@observer
export class SettingPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  state = {
    apiAddr: MyNamespaceStore.getInstanceOrCreate().apiAddress,
  };
  render() {
    const mynamespaceStore = MyNamespaceStore.getInstanceOrCreate();
    const doodleStyle = {
      width: '200px',
    };
    return (
      <div className='flex column gaps align-flex-start'>
        <div style={doodleStyle}>
          <CoffeeDoodle accent='#3d90ce' />
        </div>
        <p>setting page</p>
        <div style={{ display: 'flex' }}>
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
            저장
          </button>
        </div>
      </div>
    );
  }
}
