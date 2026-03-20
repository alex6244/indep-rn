import Catalog from "../../screens/Catalog";
import React, { useEffect } from "react";

export default function CatalogTab() {
  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7574/ingest/90ad6a03-168e-422b-be89-831782cd6f2b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "7a6ed6",
      },
      body: JSON.stringify({
        sessionId: "7a6ed6",
        runId: "route-debug",
        hypothesisId: "H6_TAB_CATALOG_MOUNT",
        location: "src/app/(tabs)/catalog.tsx:CatalogTab.useEffect",
        message: "tabs_catalog_component_mounted",
        data: {},
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  return <Catalog navigation={undefined} />;
}

