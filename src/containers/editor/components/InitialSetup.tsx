import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { setupGlobalGraphStyle } from "@/lib/graph/layout";
import { px2num } from "@/lib/utils";
import { type MyWorker } from "@/lib/worker/worker";
import { useConfigFromCookies } from "@/stores/hook";
import { useEditorStore } from "@/stores/editorStore";
import { useStatusStore } from "@/stores/statusStore";
import { useUserStore } from "@/stores/userStore";
import { wrap } from "comlink";
import { useShallow } from "zustand/shallow";

export default function InitialSetup() {
  useInitial();

  return (
    <div id="width-measure" className="absolute invisible graph-node">
      <div className="graph-kv">
        <div className="graph-k">
          <span>{"measure"}</span>
        </div>
        <div className="graph-v" />
      </div>
    </div>
  );
}

function useInitial() {
  const cc = useConfigFromCookies();
  const { user, updateActiveOrder } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      updateActiveOrder: state.updateActiveOrder,
    })),
  );
  const searchParams = useSearchParams();
  const mainEditor = useEditorStore((state) => state.main);

  useEffect(() => {
    updateActiveOrder(user);
    useStatusStore.setState({ _hasHydrated: true, ...cc });

    // initial worker
    window.rawWorker = new Worker(new URL("@/lib/worker/worker.ts", import.meta.url));
    window.worker = wrap<MyWorker>(window.rawWorker);
    window.addEventListener("beforeunload", () => {
      console.l("worker is terminated.");
      window.rawWorker?.terminate();
    });

    // measure graph style
    const el = document.getElementById("width-measure")!;
    const span = el.querySelector("span")!;
    const { lineHeight } = getComputedStyle(span);
    const { borderWidth } = getComputedStyle(el);
    const { paddingLeft, paddingRight } = getComputedStyle(el.querySelector(".graph-kv")!);
    const { marginRight, maxWidth: maxKeyWidth } = getComputedStyle(el.querySelector(".graph-k")!);
    const { maxWidth: maxValueWidth } = getComputedStyle(el.querySelector(".graph-v")!);
    const measured = {
      fontWidth: span.offsetWidth / span.textContent!.length,
      kvHeight: px2num(lineHeight),
      padding: px2num(paddingLeft) + px2num(paddingRight),
      borderWidth: px2num(borderWidth),
      kvGap: px2num(marginRight),
      maxKeyWidth: px2num(maxKeyWidth),
      maxValueWidth: px2num(maxValueWidth),
    };

    setupGlobalGraphStyle(measured);
    window.worker.setupGlobalGraphStyle(measured);
    console.l("finished measuring graph base style:", measured);
  }, []);

  // 从URL参数读取data并填充到编辑器
  useEffect(() => {
    const data = searchParams?.get("data");
    if (data && mainEditor) {
      if (data === "copyFromClipboard") {
        // 从剪贴板读取数据
        navigator.clipboard.readText().then(text => {
          mainEditor.parseAndSet(text);
        }).catch(err => {
          console.error("Failed to read from clipboard:", err);
        });
      } else {
        mainEditor.parseAndSet(data);
      }
      // 清除URL参数
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("data");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams, mainEditor]);
}