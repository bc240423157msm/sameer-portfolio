import { Suspense } from "react";
import PortalLoginForm from "./PortalLoginForm";

export default function PortalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-text-muted">
          Loading...
        </div>
      }
    >
      <PortalLoginForm />
    </Suspense>
  );
}
