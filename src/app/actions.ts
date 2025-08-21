// 移除所有Server Actions，因为静态导出不支持它们

export async function getCheckoutURL(subscriptionType: "monthly" | "yearly", redirectUrl?: string) {
  // 由于移除了登录功能和静态导出限制，我们返回空字符串
  return "";
}

export async function getCustomerPortalURL() {
  // 由于移除了登录功能和静态导出限制，我们返回空字符串
  return "";
}

export async function getStatistics(fallbackKey: string) {
  // 由于移除了登录功能和静态导出限制，我们返回默认统计数据
  return { 
    statistics: {
      graphModeView: 0,
      tableModeView: 0,
      textComparison: 0,
      jqExecutions: 0,
    },
    expiredAt: new Date() 
  };
}

export async function reportStatistics(fallbackKey: string, k: string) {
  // 由于移除了登录功能和静态导出限制，我们不做任何操作
  return;
}