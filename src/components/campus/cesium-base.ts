// Cesium 需要在加载核心模块之前知道静态资源目录(public/cesium)。
// 该文件必须在任何 `import "cesium"` 之前被引入。
declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
  }
}

if (typeof window !== "undefined") {
  window.CESIUM_BASE_URL = "/cesium";
}

export {};
