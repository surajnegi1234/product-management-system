import { AlertCircle, PackageOpen } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="state-message">
      <span className="state-icon">
        <PackageOpen size={22} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  action?: ReactNode;
}

export function ErrorState({ title = "Something went wrong", message, onRetry, action }: ErrorStateProps) {
  return (
    <div className="state-message" role="alert">
      <span className="state-icon state-icon-error">
        <AlertCircle size={22} />
      </span>
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
      {action}
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="state-message" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="skeleton-list" role="status" aria-label="Loading products">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="skeleton-row">
          <span className="skeleton-bar skeleton-wide" />
          <span className="skeleton-bar" />
          <span className="skeleton-bar" />
          <span className="skeleton-bar" />
        </div>
      ))}
    </div>
  );
}
