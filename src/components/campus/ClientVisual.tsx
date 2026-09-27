import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const CesiumScene = lazy(() => import("./CesiumScene"));
const CampusModel = lazy(() => import("./CampusModel"));

function Loading({ text }: { text: string }) {
  return (
    <div className="scan-grid absolute inset-0 flex items-center justify-center">
      <div className="flex items-center gap-2 text-xs tracking-widest text-muted-foreground">
        <span className="h-2 w-2 animate-ping rounded-full bg-primary" />
        {text}
      </div>
    </div>
  );
}

export function CesiumSceneClient(props: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ClientOnly fallback={<Loading text="三维地球加载中" />}>
      <Suspense fallback={<Loading text="三维地球加载中" />}>
        <CesiumScene {...props} />
      </Suspense>
    </ClientOnly>
  );
}

export function CampusModelClient(props: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ClientOnly fallback={<Loading text="园区模型加载中" />}>
      <Suspense fallback={<Loading text="园区模型加载中" />}>
        <CampusModel {...props} />
      </Suspense>
    </ClientOnly>
  );
}
