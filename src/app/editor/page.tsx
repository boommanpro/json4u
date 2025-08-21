import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainPanel from "@/containers/editor/panels/MainPanel";
import SideNav from "@/containers/editor/sidenav";
import { PricingOverlay } from "@/containers/pricing";

// 设置动态渲染模式以支持静态导出
export const dynamic = "force-static";

export default async function Page() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full w-full">
        <SideNav />
        <Separator orientation="vertical" />
        <MainPanel />
        <PricingOverlay />
      </div>
    </TooltipProvider>
  );
}
