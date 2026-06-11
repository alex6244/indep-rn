import React from "react";
import { AiPickerScreen } from "../features/aiPicker/ui/AiPickerScreen";
import { useRequireAuth } from "../hooks/useProtected";
import { ScreenStateLoading } from "../shared/ui/ScreenStateLoading";

export default function AiPickerRoute() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return <ScreenStateLoading />;
  }

  return <AiPickerScreen />;
}
