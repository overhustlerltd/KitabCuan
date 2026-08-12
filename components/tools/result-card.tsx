import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/tools/copy-button";

interface ResultCardProps {
  title: string;
  badge?: ReactNode;
  copyText: string;
  copyLabel?: string;
  children: ReactNode;
}

export function ResultCard({ title, badge, copyText, copyLabel, children }: ResultCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <div className="flex items-center gap-2.5">
          {badge && (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {badge}
            </span>
          )}
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <CopyButton text={copyText} label={copyLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
