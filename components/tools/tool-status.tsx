import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToolLoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-neutral-50/50 py-16 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm font-semibold text-neutral-600">{message}</p>
    </div>
  );
}

export function ToolErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50/70 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="h-5 w-5" />
      </div>
      <p className="max-w-sm text-sm font-medium text-red-700">{message}</p>
      <Button type="button" variant="outline" size="sm" onClick={onRetry} className="mt-1">
        <RotateCcw className="h-3.5 w-3.5" />
        Coba Lagi
      </Button>
    </div>
  );
}
