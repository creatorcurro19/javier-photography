"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLanguage } from "@/lib/i18n";

export default function LocalizedLink({
  href,
  ...props
}: ComponentProps<typeof NextLink>) {
  const { href: localize } = useLanguage();
  const resolvedHref = typeof href === "string" ? localize(href) : href;
  return <NextLink href={resolvedHref} {...props} />;
}
