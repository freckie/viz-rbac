/* heatmap 컴포넌트를 반환 */
import React, { useEffect } from "react";
import { clearHeatmap, createHeatmap } from "../api/heatmap";
import { Renderer } from "@k8slens/extensions";

type HeatmapProps = {
  xlabels: Array<string>;
  ylabels: Array<string>;
  data: Array<Array<Array<string>>>;
  loading: boolean;
  addressValidity: boolean;
};
export const Heatmap = (heatmapData: HeatmapProps) => {
  useEffect(() => {
    clear();
    generateHeatmap(heatmapData);
  }, [heatmapData]);

  const generateHeatmap = (heatmapData: HeatmapProps) => {
    createHeatmap("#d3-wrapper", heatmapData, _calcColor, _breakString);
  };
  const clear = () => {
    clearHeatmap("#d3-wrapper");
  };

  const _breakString = (str: string) => {
    const limit = 7;
    const _fn = (st: string, limit: number) =>
      str.length <= limit ? str + "   " : str.substr(0, limit) + "...";
    return _fn(str, limit);
  };

  const _calcColor = (verbs: any) => {
    const colorList = ["#27641907", "#27641954", "#276419a8", "#276419"]; // rgb(39, 100, 25)
    if (verbs == undefined || verbs.length == 0) return colorList[0];
    let verbsSet = new Set(verbs);
    if (verbsSet.has("delete") || verbsSet.has("deletecollection")) {
      return colorList[3];
    } else if (
      verbsSet.has("update") ||
      verbsSet.has("create") ||
      verbsSet.has("patch")
    ) {
      return colorList[2];
    } else if (
      verbsSet.has("get") ||
      verbsSet.has("list") ||
      verbsSet.has("watch")
    ) {
      return colorList[1];
    } else {
      return colorList[0];
    }
  };

  return (
    <>
      {!heatmapData.addressValidity ? (
        <div className="NoItems flex box grow">
          <div className="box center">invalid address</div>
        </div>
      ) : heatmapData.loading ? (
        <Renderer.Component.Spinner center />
      ) : (
        <div className="VirtualList KubeObjectListLayout box grow">
          <div className="List">
            <div id="d3-wrapper" />
          </div>
        </div>
      )}
    </>
  );
};
