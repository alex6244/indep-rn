import type { Href } from "expo-router";
import { useCallback, useState } from "react";

type ReplaceRouter = {
  replace: (href: Href) => void;
};

export function useProfileEditFlow(
  onLogout: () => Promise<void>,
  router: ReplaceRouter,
) {
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletedOpen, setDeletedOpen] = useState(false);

  const handleDeleteConfirm = useCallback(async () => {
    setConfirmDeleteOpen(false);
    await onLogout();
    setDeletedOpen(true);
  }, [onLogout]);

  const handleCloseDeleted = useCallback(() => {
    setDeletedOpen(false);
    router.replace("/(auth)" as Href);
  }, [router]);

  return {
    editMenuOpen,
    confirmDeleteOpen,
    deletedOpen,
    setEditMenuOpen,
    setConfirmDeleteOpen,
    handleDeleteConfirm,
    handleCloseDeleted,
  };
}

