import React, { useCallback, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCatalogCars } from "../../features/catalog/hooks/useCatalogCars";
import { useCatalogFiltersController } from "../../features/catalog/hooks/useCatalogFiltersController";
import { CatalogView } from "../../features/catalog/ui/CatalogView";
import {
  buildCatalogFiltersOverlayProps,
  CatalogFiltersOverlay,
} from "../../features/filters/ui/CatalogFiltersOverlay";
import {
  getMainBurgerMenuItems,
  MainBurgerMenuFooter,
} from "../../shared/config/mainBurgerMenu";
import { BurgerMenu } from "../../shared/ui/BurgerMenu";
import { CatalogFiltersDrawer } from "../../widgets/catalog/CatalogFiltersDrawer";
import { ReportsPackageSelectModal } from "../../widgets/reports/ReportsPackageSelectModal";
import { useReportsPackagePurchaseModal } from "../../widgets/reports/useReportsPackagePurchaseModal";

export default function CatalogTab() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const reportsPackageModal = useReportsPackagePurchaseModal();
  const {
    cars,
    loading,
    error: dataError,
    reload: reloadCars,
  } = useCatalogCars();
  const controller = useCatalogFiltersController(cars);

  const handleOpenFilters = useCallback(() => {
    setFiltersOpen(true);
  }, []);

  return (
    <CatalogView
      loading={loading}
      dataError={dataError}
      reloadCars={reloadCars}
      controller={controller}
      filtersOpen={filtersOpen}
      onOpenBurger={() => setMenuOpen(true)}
      onBuyReport={reportsPackageModal.open}
      onOpenFilters={handleOpenFilters}
    >
      <CatalogFiltersDrawer open={filtersOpen} onOpenChange={setFiltersOpen}>
        {(closeFilters) => (
          <CatalogFiltersOverlay
            {...buildCatalogFiltersOverlayProps(controller, closeFilters)}
          />
        )}
      </CatalogFiltersDrawer>

      <ReportsPackageSelectModal
        visible={reportsPackageModal.visible}
        onClose={reportsPackageModal.close}
      />

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={getMainBurgerMenuItems(user?.role)}
        footer={<MainBurgerMenuFooter onLogout={logout} />}
      />
    </CatalogView>
  );
}
