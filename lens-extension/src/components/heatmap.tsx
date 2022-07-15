/* heatmap 컴포넌트를 반환 */
import React, { useEffect } from 'react';
import { clearHeatmap, createHeatmap } from '../api/heatmap';
import { Renderer } from '@k8slens/extensions';

type HeatmapProps = {
  xlabels: Array<string>;
  ylabels: Array<string>;
  data: Array<Array<Array<string>>>;
  loading: boolean;
  addressValidity: boolean;
  theme: string;
  type: 'ns' | 'res';
};

type GenerageHeatmapData = {
  xlabels: Array<string>;
  ylabels: Array<string>;
  data: Array<Array<Array<string>>>;
};
export const Heatmap = (heatmapProps: HeatmapProps) => {
  useEffect(() => {
    clear();
    const generageHeatmapData = {
      xlabels: heatmapProps.xlabels,
      ylabels: heatmapProps.ylabels,
      data: heatmapProps.data,
    };
    generateHeatmap(generageHeatmapData, heatmapProps.theme, heatmapProps.type);
  }, [heatmapProps]);

  const generateHeatmap = (
    generageHeatmapData: GenerageHeatmapData,
    theme: string,
    type: 'ns' | 'res'
  ) => {
    createHeatmap(
      '#d3-wrapper',
      generageHeatmapData,
      _calcColor,
      _breakString,
      theme,
      type
    );
  };
  const clear = () => {
    clearHeatmap('#d3-wrapper');
  };

  const _breakString = (str: string) => {
    const limit = 7;
    const _fn = (st: string, limit: number) =>
      str.length <= limit ? str + '   ' : str.substr(0, limit) + '...';
    return _fn(str, limit);
  };

  const _calcColor = (verbs: any, type: 'ns' | 'res') => {
    const lightColorList = ['#f1f1f1', '#9be9a8', '#40c463', '#30a14e']; // "#216e39" last one
    const darkColorList = ['#1e2124', '#0e4429', '#067037', '#2ba846']; // #39d353 last one
    const colorList =
      heatmapProps.theme === 'light' ? lightColorList : darkColorList;

    if (type === 'res') {
      if (verbs == undefined || verbs.length == 0) return colorList[0];
      let verbsSet = new Set(verbs);
      if (verbsSet.has('delete') || verbsSet.has('deletecollection')) {
        return colorList[3];
      } else if (
        verbsSet.has('update') ||
        verbsSet.has('create') ||
        verbsSet.has('patch')
      ) {
        return colorList[2];
      } else if (
        verbsSet.has('get') ||
        verbsSet.has('list') ||
        verbsSet.has('watch')
      ) {
        return colorList[1];
      } else {
        return colorList[0];
      }
    } else {
      let count = verbs[0];
      if (count == 'undefined' || count == 0) return colorList[0];
      else if (count > 20) {
        return colorList[3];
      } else if (count > 10) {
        return colorList[2];
      } else {
        return colorList[1];
      }
    }
  };

  return (
    <>
      {!heatmapProps.addressValidity ? (
        <div className='NoItems flex box'>
          <div className='box center'>invalid address</div>
        </div>
      ) : heatmapProps.loading ? (
        <Renderer.Component.Spinner center />
      ) : (
        <div className='Table scrollable' id='d3-wrapper' />
      )}
    </>
  );
};
