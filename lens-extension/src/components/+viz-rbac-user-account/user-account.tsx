import React from 'react';
import { Renderer } from '@k8slens/extensions';
import { MyNamespaceStore } from './../my-namespace-store';
import { UAResourceStore } from './ua-resource-store';
import { observer } from 'mobx-react';
import { Heatmap } from '../heatmap';

@observer
export class UserAccountPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  render() {
    const mynamespaceStore = MyNamespaceStore.getInstanceOrCreate();
    const uAResourceStore = UAResourceStore.getInstanceOrCreate();
    return (
      <div className='ItemListLayout flex column'>
        <div className='header flex gaps align-center'>
          <h5 className='title'>User Account</h5>
          <div className='info-panel box grow'>
            {uAResourceStore.userAccounts.length} userAccounts
          </div>
          <div className='info-panel box grow'>
            {uAResourceStore.resources.length} resources
          </div>
          <Renderer.Component.Select
            id='container-selector-input'
            placeholder='Select a namespace...'
            options={mynamespaceStore.namespaces}
            onChange={({ value }) => {
              mynamespaceStore.changeSelectedNamespace(value);
            }}
            value={mynamespaceStore.selectedNamespace}
            isDisabled={uAResourceStore.loading}
          />
        </div>
        <div className='items grow flex column'>
          <Renderer.Component.TableHead sticky nowrap showTopLine>
            <Renderer.Component.TableCell>
              <div className='content'>
                <br />
              </div>
            </Renderer.Component.TableCell>
          </Renderer.Component.TableHead>
          <Heatmap
            xlabels={uAResourceStore.resources}
            ylabels={uAResourceStore.userAccounts}
            data={uAResourceStore.authArray}
            loading={uAResourceStore.loading}
            addressValidity={mynamespaceStore.addressValidity}
            theme={Renderer.Theme.getActiveTheme().type}
          />
        </div>
      </div>
    );
  }
}
