import "./cesium-base";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect, useRef } from "react";
import { buildings, CAMPUS_CENTER, type CampusBuilding } from "@/lib/campus-data";

const STATUS_COLOR: Record<CampusBuilding["status"], Cesium.Color> = {
  normal: Cesium.Color.fromCssColorString("#38d6ff"),
  warning: Cesium.Color.fromCssColorString("#ffc247"),
  alarm: Cesium.Color.fromCssColorString("#ff5c6c"),
};

/** 以米为单位在建筑中心生成一个矩形底面 */
function footprint(lon: number, lat: number, meters: number) {
  const dLat = meters / 111_320;
  const dLon = meters / (111_320 * Math.cos((lat * Math.PI) / 180));
  return Cesium.Cartesian3.fromDegreesArray([
    lon - dLon, lat - dLat,
    lon + dLon, lat - dLat,
    lon + dLon, lat + dLat,
    lon - dLon, lat + dLat,
  ]);
}

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CesiumScene({ selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Esri 全球影像服务:无需任何密钥即可获取真实卫星影像
    const imagery = new Cesium.UrlTemplateImageryProvider({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      maximumLevel: 19,
      credit: "Esri World Imagery",
    });

    const viewer = new Cesium.Viewer(el, {
      baseLayer: new Cesium.ImageryLayer(imagery),
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      shouldAnimate: true,
    });
    viewerRef.current = viewer;

    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#0d1b2c");
    if (viewer.scene.skyAtmosphere) {
      viewer.scene.skyAtmosphere.hueShift = -0.05;
      viewer.scene.skyAtmosphere.saturationShift = 0.1;
    }
    viewer.scene.globe.enableLighting = false;
    viewer.scene.fog.enabled = true;
    viewer.resolutionScale = Math.min(window.devicePixelRatio, 1.5);

    // 园区建筑体块
    for (const b of buildings) {
      const height = b.floors * 3.6;
      const color = STATUS_COLOR[b.status];
      viewer.entities.add({
        id: b.id,
        name: b.name,
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(footprint(b.lon, b.lat, 42)),
          extrudedHeight: height,
          material: color.withAlpha(0.42),
          outline: true,
          outlineColor: color,
        },
        label: {
          text: b.name,
          font: "500 13px 'Noto Sans SC', sans-serif",
          fillColor: Cesium.Color.WHITE,
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString("#0b1a2b").withAlpha(0.8),
          backgroundPadding: new Cesium.Cartesian2(8, 5),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(500, 1, 4000, 0.45),
        },
        position: Cesium.Cartesian3.fromDegrees(b.lon, b.lat, height + 10),
      });
    }

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        CAMPUS_CENTER.lon,
        CAMPUS_CENTER.lat - 0.0075,
        900,
      ),
      orientation: { heading: 0, pitch: Cesium.Math.toRadians(-38), roll: 0 },
      duration: 2.4,
    });

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((movement: { position: Cesium.Cartesian2 }) => {
      const picked = viewer.scene.pick(movement.position);
      const id = picked?.id?.id;
      if (typeof id === "string") selectRef.current(id);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);

  // 选中建筑:高亮 + 镜头定位
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    for (const b of buildings) {
      const entity = viewer.entities.getById(b.id);
      if (!entity?.polygon) continue;
      const base = STATUS_COLOR[b.status];
      const active = b.id === selectedId;
      entity.polygon.material = new Cesium.ColorMaterialProperty(
        base.withAlpha(active ? 0.85 : 0.42),
      );
    }

    const target = buildings.find((b) => b.id === selectedId);
    if (target) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          target.lon,
          target.lat - 0.0035,
          420,
        ),
        orientation: { heading: 0, pitch: Cesium.Math.toRadians(-35), roll: 0 },
        duration: 1.4,
      });
    }
  }, [selectedId]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
