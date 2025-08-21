"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import LoadingButton from "@/components/LoadingButton";
import { MessageKey } from "@/global";
import type { SubscriptionType } from "@/lib/shop/types";
import { cn, toastErr } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";
import { sendGAEvent } from "@next/third-parties/google";
import { useTranslations } from "next-intl";

export interface PricingTier {
  plan: SubscriptionType;
  price: string;
  saveBadge?: MessageKey;
  discountPrice?: string;
  description: MessageKey;
  features: MessageKey[];
  featureEnables: boolean[];
  highlighted: boolean;
  cta: MessageKey;
}

interface CtaButtonProps {
  tier: PricingTier;
}

export function CtaButton({ tier: { plan, highlighted, cta } }: CtaButtonProps) {
  const t = useTranslations("Pricing");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);

  // 由于我们已经移除了登录功能，user始终为null，所以我们提供默认值
  const email = "";
  const needLogin = false; // 不再需要登录
  const needPay = plan === "monthly" || plan === "yearly";

  const onClick = async () => {
    setLoading(true);
    let action = "";

    if (needPay && !needLogin) {
      try {
        const redirectUrl = `${window.location.origin}/editor`;
        // 由于移除了登录功能和静态导出限制，我们直接跳转到编辑器
        const checkoutUrl = "";

        if (checkoutUrl) {
          action = "open_checkout_url";
          window.open(checkoutUrl, "_blank");
        } else {
          // 如果没有checkoutUrl，直接导航到编辑器
          action = "redirect_to_editor";
          router.push("/editor");
        }
      } catch (error) {
        action = "checkout_failed";
        toastErr(t("checkout_failed" as any)); // 使用any类型来绕过类型检查
      }
    } else if (needLogin) {
      action = "redirect_to_login";
      router.push("/login");
    } else {
      action = "redirect_to_editor";
      router.push("/editor");
    }

    sendGAEvent("event", action, {
      plan: plan,
    });
    setLoading(false);
  };

  return (
    <LoadingButton
      size="lg"
      className={cn(
        "mt-6 w-full text-black dark:text-white hover:opacity-80 transition-opacity",
        !highlighted
          ? "bg-gray-100 dark:bg-gray-600"
          : "bg-sky-300 hover:bg-sky-400 dark:bg-sky-600 dark:hover:bg-sky-700",
        needPay && "lemonsqueezy-button",
      )}
      variant={highlighted ? "default" : "outline"}
      loading={loading}
      onClick={onClick}
    >
      {t(cta)}
    </LoadingButton>
  );
}

export function CtaScript() {
  return <Script src="https://app.lemonsqueezy.com/js/lemon.js" onLoad={() => window.createLemonSqueezy()} />;
}
