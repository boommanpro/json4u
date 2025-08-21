import { useEffect } from "react";
import Typography from "@/components/ui/typography";
import { type MessageKey } from "@/global";
import { type StatisticsKeys } from "@/lib/env";
import { dateToYYYYMMDD } from "@/lib/utils";
import { freeQuota, useUserStore } from "@/stores/userStore";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/shallow";
import BasePopover from "./BasePopover";

const i18nMap: Record<StatisticsKeys, MessageKey> = {
  graphModeView: "stats_graph",
  tableModeView: "stats_table",
  textComparison: "stats_compare",
  jqExecutions: "stats_jq",
};

export default function StatisticsPopover() {
  const t = useTranslations();
  const { statistics, setStatistics, nextQuotaRefreshTime, isPremium } = useUserStore(
    useShallow((state) => ({
      statistics: state.statistics,
      setStatistics: state.setStatistics,
      nextQuotaRefreshTime: state.nextQuotaRefreshTime,
      isPremium: state.isPremium(),
    })),
  );

  useEffect(() => {
    (async () => {
      // 由于移除了登录功能和静态导出限制，我们使用默认统计数据
      const fallbackKey = "default";
      const { statistics, expiredAt } = {
        statistics: {
          graphModeView: 0,
          tableModeView: 0,
          textComparison: 0,
          jqExecutions: 0,
        },
        expiredAt: new Date()
      };
      setStatistics(statistics, expiredAt, fallbackKey);
    })();
  }, []);

  return (
    <BasePopover title="statistics">
      <div className="flex flex-col gap-2 w-60">
        {!isPremium && nextQuotaRefreshTime && (
          <Typography affects="xs">{t("stats_description", { date: dateToYYYYMMDD(nextQuotaRefreshTime) })}</Typography>
        )}
        {Object.entries(statistics).map(([key, cnt]) => (
          <div key={key} className="flex">
            <Typography>{t(i18nMap[key as StatisticsKeys])}</Typography>
            <div className="ml-auto flex gap-1">
              {isPremium ? (
                <Typography affects="muted">{"∞"}</Typography>
              ) : (
                <>
                  <Typography>{cnt}</Typography>
                  <Typography affects="muted">{"/"}</Typography>
                  <Typography affects="muted">{freeQuota[key as StatisticsKeys]}</Typography>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </BasePopover>
  );
}

