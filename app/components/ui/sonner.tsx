"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircleRegular,
  CloseCircleRegular,
  InformationRegular,
  LoadingRegular,
  WarningRegular,
} from "@mingcute/react/core-regular";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      icons={{
        success: <CheckCircleRegular className="size-4" />,
        info: <InformationRegular className="size-4" />,
        warning: <WarningRegular className="size-4" />,
        error: <CloseCircleRegular className="size-4" />,
        loading: <LoadingRegular className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
