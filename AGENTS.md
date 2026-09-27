<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## 三维可视化

- Cesium 静态资源复制到 `public/cesium`,并在 `src/components/campus/cesium-base.ts` 中设置 `CESIUM_BASE_URL`,该文件必须在 `import "cesium"` 之前引入 —— Worker 运行时没有运行时模块解析。
- Cesium / Three.js 组件一律通过 `ClientOnly` + `React.lazy` 动态加载(`src/components/campus/ClientVisual.tsx`),避免 SSR 阶段求值 WebGL 模块。
- 底图使用 Esri World Imagery 瓦片服务,免密钥即可获得真实卫星影像。
