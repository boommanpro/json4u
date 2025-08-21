import { create } from "zustand";

export const initialStatistics = {
  graphModeView: 0,
  tableModeView: 0,
  textComparison: 0,
  jqExecutions: 0,
};

export const freeQuota = {
  graphModeView: Infinity,
  tableModeView: Infinity,
  textComparison: Infinity,
  jqExecutions: Infinity,
};

export interface UserState {
  user: null;
  activeOrder: null;
  statistics: typeof initialStatistics;
  nextQuotaRefreshTime?: Date;
  fallbackKey: string;

  usable: (key: keyof typeof initialStatistics) => boolean;
  count: (key: keyof typeof initialStatistics) => void;
  isPremium: () => boolean;
  getPlan: () => "free";
  setUser: (user: null) => Promise<void>;
  updateActiveOrder: (user: null) => Promise<void>;
  setStatistics: (statistics: typeof initialStatistics, nextQuotaRefreshTime: Date, fallbackKey: string) => void;
}

const initialStates: Omit<UserState, "usable" | "count" | "isPremium" | "getPlan" | "setUser" | "updateActiveOrder" | "setStatistics"> = {
  user: null,
  activeOrder: null,
  statistics: initialStatistics,
  fallbackKey: "",
};

export const useUserStore = create<UserState>()((set, get) => ({
  ...initialStates,

  usable(key: keyof typeof initialStatistics) {
    return true;
  },

  count(key: keyof typeof initialStatistics) {
    const { statistics } = get();
    statistics[key] += 1;
    set({ statistics });
  },

  isPremium() {
    return true;
  },

  getPlan() {
    return "free";
  },

  async setUser(user: null) {
    const { updateActiveOrder } = get();
    set({ user });
    await updateActiveOrder(user);
  },

  async updateActiveOrder(user: null) {
    set({ activeOrder: null });
  },

  setStatistics(statistics: typeof initialStatistics, nextQuotaRefreshTime: Date, fallbackKey: string) {
    set({ statistics, nextQuotaRefreshTime, fallbackKey });
  },
}));

export function getUserState() {
  return useUserStore.getState();
}