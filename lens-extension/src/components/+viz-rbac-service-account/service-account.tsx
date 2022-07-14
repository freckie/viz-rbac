import React from 'react';
import { Renderer } from '@k8slens/extensions';
import { MyNamespaceStore } from '../my-namespace-store';
import { SAResourceStore } from './sa-resource-store';
import { observer } from 'mobx-react';
import { Heatmap } from '../heatmap';

@observer
export class ServiceAccountPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  render() {
    const mynamespaceStore = MyNamespaceStore.getInstanceOrCreate();
    const sAResourceStore = SAResourceStore.getInstanceOrCreate();
    return (
      <div className='ItemListLayout flex column'>
        <div className='header flex gaps align-center'>
          <h5 className='title'>Service Account</h5>
          <div className='info-panel box grow'>
            {sAResourceStore.serviceAccounts.length} serviceAccounts
          </div>
          <div className='info-panel box grow'>
            {sAResourceStore.resources.length} resources
          </div>
          <Renderer.Component.Select
            id='container-selector-input'
            placeholder='Select a namespace...'
            options={mynamespaceStore.namespaces}
            onChange={({ value }) => {
              mynamespaceStore.changeSelectedNamespace(value);
            }}
            value={mynamespaceStore.selectedNamespace}
            isDisabled={sAResourceStore.loading}
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
            xlabels={sAResourceStore.resources}
            ylabels={sAResourceStore.serviceAccounts}
            data={sAResourceStore.authArray}
            loading={sAResourceStore.loading}
            addressValidity={mynamespaceStore.addressValidity}
            theme={Renderer.Theme.getActiveTheme().type}
          />
        </div>
      </div>
    );
  }
}
