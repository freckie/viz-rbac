import React from 'react';
import { Renderer } from '@k8slens/extensions';
import { ServiceAccountsPage } from './src/components/+viz-rbac-service-account/service-accounts';
import { UserAccountsPage } from './src/components/+viz-rbac-user-account/user-accounts';
import { SettingsPage } from './src/components/+viz-rbac-settings/settings';
import { MyNamespaceStore } from './src/components/my-namespace-store';
import { SAResourceStore } from './src/components/+viz-rbac-service-account/sa-resource-store';
import { UAResourceStore } from './src/components/+viz-rbac-user-account/ua-resource-store';
import { UANamespaceAuthCountStore } from './src/components/+viz-rbac-user-account/ua-namespace-auth-count-store';

export function VizRBACIcon(props: Renderer.Component.IconProps) {
  return (
    <Renderer.Component.Icon
      {...props}
      material='verified_user'
      tooltip={'VIZ_RBAC'}
    />
  );
}

export function NoneIcon(props: Renderer.Component.IconProps) {
  return <></>;
}

export default class VizRBACExtension extends Renderer.LensExtension {
  async onActivate() {
    MyNamespaceStore.getInstanceOrCreate().loadExtension(this);
    SAResourceStore.getInstanceOrCreate().loadExtension(this);
    UAResourceStore.getInstanceOrCreate().loadExtension(this);
    UANamespaceAuthCountStore.getInstanceOrCreate().loadExtension(this);

    console.log('[viz-rbac] activate');
  }

  clusterPages = [
    {
      id: 'service-accounts',
      components: {
        Page: () => <ServiceAccountsPage extension={this} />,
      },
    },
    {
      id: 'user-accounts',
      components: {
        Page: () => <UserAccountsPage extension={this} />,
      },
    },
    {
      id: 'settings',
      components: {
        Page: () => <SettingsPage extension={this} />,
      },
    },
  ];

  clusterPageMenus = [
    {
      id: 'viz-rbac',
      title: 'viz-rbac',
      components: {
        Icon: VizRBACIcon,
      },
    },
    {
      parentId: 'viz-rbac',
      target: { pageId: 'service-accounts' },
      title: 'Service Accounts',
      components: {
        Icon: NoneIcon,
      },
    },
    {
      parentId: 'viz-rbac',
      target: { pageId: 'user-accounts' },
      title: 'User Accounts',
      components: {
        Icon: NoneIcon,
      },
    },
    {
      parentId: 'viz-rbac',
      target: { pageId: 'settings' },
      title: 'Settings',
      components: {
        Icon: NoneIcon,
      },
    },
  ];
}
