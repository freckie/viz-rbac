import './user-account.scss';
import React from 'react';
import { Renderer } from '@k8slens/extensions';
import { MyNamespaceStore } from './../my-namespace-store';
import { UAResourceStore } from './ua-resource-store';
import { observer } from 'mobx-react';
import { Heatmap } from '../heatmap';
import { UANamespaceAuthCountStore } from './ua-namespace-auth-count-store';
import { SAResourceStore } from '../+viz-rbac-service-account/sa-resource-store';

@observer
export class UserAccountsPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  render() {
    const mynamespaceStore = MyNamespaceStore.getInstance();
    const sAResourceStore = SAResourceStore.getInstanceOrCreate();
    const uAResourceStore = UAResourceStore.getInstance();
    const uANamespaceAuthCountStore = UANamespaceAuthCountStore.getInstance();

    return (
      <div className='ItemListLayout flex column'>
        <div className='header flex gaps align-center'>
          <h5 className='title'>User Accounts</h5>
          <div className='info-panel box grow'>
            {uAResourceStore.userAccounts.length} userAccounts
          </div>
          <div className='info-panel flex align-center'>
            <span>NS </span>
            <Renderer.Component.Switch
              className='UserViewSwitch'
              checked={uAResourceStore.selected}
              onChange={() => {
                uAResourceStore.selected = !uAResourceStore.selected;
                uANamespaceAuthCountStore.selected =
                  !uANamespaceAuthCountStore.selected;
              }}
            />
            <span> RES</span>
          </div>
          <Renderer.Component.Select
            id='container-selector-input'
            placeholder='Select a namespace...'
            options={mynamespaceStore.namespaces}
            onChange={({ value }) => {
              mynamespaceStore.changeSelectedNamespace(value);
            }}
            value={mynamespaceStore.selectedNamespace}
            isDisabled={
              uAResourceStore.loading ||
              sAResourceStore.loading ||
              uANamespaceAuthCountStore.selected
            }
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
          {uAResourceStore.selected ? (
            <Heatmap
              xlabels={uAResourceStore.resources}
              ylabels={uAResourceStore.userAccounts}
              data={uAResourceStore.resourceAuths}
              loading={uAResourceStore.loading}
              addressValidity={mynamespaceStore.addressValidity}
              theme={Renderer.Theme.getActiveTheme().type}
              type='res'
            />
          ) : (
            ''
          )}
          {uANamespaceAuthCountStore.selected ? (
            <Heatmap
              xlabels={uANamespaceAuthCountStore.namespaces}
              ylabels={uANamespaceAuthCountStore.userAccounts}
              data={uANamespaceAuthCountStore.namespaceAuthCounts}
              loading={uANamespaceAuthCountStore.loading}
              addressValidity={mynamespaceStore.addressValidity}
              theme={Renderer.Theme.getActiveTheme().type}
              type='ns'
            />
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
