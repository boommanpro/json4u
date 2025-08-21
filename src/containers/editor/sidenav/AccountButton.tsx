"use client";

import { useEffect } from "react";
import AccountPanel from "@/components/AccountPanel";
import { useUserStore } from "@/stores/userStore";
import { CircleUserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import PopoverBtn from "./PopoverButton";

interface AccountButtonProps {
  avatarClassName: string;
  buttonClassName?: string;
  notOnSideNav?: boolean;
}

export default function AccountButton({ notOnSideNav, avatarClassName, buttonClassName }: AccountButtonProps) {
  const t = useTranslations("Home");
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  // 由于我们已经移除了登录功能，user始终为null，所以这里我们提供默认值
  const nameOrEmail = "User";

  // 由于我们已经移除了登录功能，我们不需要监听用户状态变化
  useEffect(() => {
    // 设置用户为null，因为我们已经移除了登录功能
    setUser(null);
  }, []);

  // 由于我们已经移除了登录功能，我们总是显示账户面板
  return (
    <>
    </>
  );
}
