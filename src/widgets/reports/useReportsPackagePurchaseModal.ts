import { useCallback, useState } from "react";

export function useReportsPackagePurchaseModal() {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  return { visible, open, close };
}
