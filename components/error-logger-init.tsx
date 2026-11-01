"use client";

import { useEffect } from "react";
import { installErrorLogger } from "@/lib/error-logger";

export function ErrorLoggerInit() {
  useEffect(() => installErrorLogger(), []);
  return null;
}
