import { useEffect, useState } from "react";
import { aiPickerApi } from "../api/aiPickerApi";
import {
  isAiPickerApiEnabled,
  isAiPickerLocalFallbackEnabled,
} from "../api/aiPickerEnv";
import { getAiSiteProfile, loadAiCatalogWithMeta } from "../catalog/aiCatalogService";
import { buildWelcomeMessage } from "../chat/ruleBasedReply";
import type { AiCatalogItem } from "../types";
import { useAppDispatch } from "../../../store/hooks";

export function useAiPickerBootstrap(siteId: string) {
  const dispatch = useAppDispatch();
  const site = getAiSiteProfile(siteId);

  const [catalog, setCatalog] = useState<AiCatalogItem[]>([]);
  const [catalogDisplayCount, setCatalogDisplayCount] = useState(0);
  const [catalogSource, setCatalogSource] = useState<"api" | "seed" | null>(null);
  const [useRemoteApi, setUseRemoteApi] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [apiServerWarning, setApiServerWarning] = useState<string | null>(null);
  const [welcomeText, setWelcomeText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCatalogLoading(true);
      const remote = isAiPickerApiEnabled();
      setUseRemoteApi(remote);

      if (remote) {
        const catalogTask = (async () => {
          try {
            return await dispatch(
              aiPickerApi.endpoints.getAiCatalog.initiate(siteId),
            ).unwrap();
          } catch {
            return null;
          }
        })();

        try {
          const meta = await dispatch(
            aiPickerApi.endpoints.getAiMeta.initiate(siteId),
          ).unwrap();
          if (cancelled) return;

          setApiServerWarning(null);
          setCatalogSource(meta.catalogSource);
          setCatalogDisplayCount(meta.catalogCount);
          setWelcomeText(
            meta.welcomeText ?? buildWelcomeMessage(meta.catalogCount),
          );
          setCatalogLoading(false);

          const catalogData = await catalogTask;
          if (cancelled || !catalogData) return;

          setCatalog(catalogData.items);
          if (catalogData.items.length > 0) {
            setCatalogDisplayCount(catalogData.items.length);
            setCatalogSource(catalogData.catalogSource);
          }
        } catch (metaError) {
          const catalogData = await catalogTask;
          if (cancelled) return;

          let items: AiCatalogItem[] = [];
          let source: "api" | "seed" | null = null;

          if (catalogData) {
            items = catalogData.items;
            source = catalogData.catalogSource;
          } else if (isAiPickerLocalFallbackEnabled()) {
            const local = await loadAiCatalogWithMeta(siteId);
            if (cancelled) return;
            items = local.items;
            source = local.source;
          }

          setCatalog(items);
          setCatalogDisplayCount(items.length);
          setCatalogSource(source);

          if (items.length > 0) {
            setApiServerWarning(null);
            setWelcomeText(buildWelcomeMessage(items.length));
          } else {
            const message =
              metaError instanceof Error
                ? metaError.message
                : "Не удалось связаться с сервером подбора";
            setApiServerWarning(message);
            setWelcomeText(buildWelcomeMessage(0));
          }

          setCatalogLoading(false);
        }
      } else {
        setApiServerWarning(null);
        const { items, source } = await loadAiCatalogWithMeta(siteId);
        if (cancelled) return;
        setCatalog(items);
        setCatalogDisplayCount(items.length);
        setCatalogSource(source);
        setWelcomeText(buildWelcomeMessage(items.length));
        setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, siteId]);

  return {
    site,
    catalog,
    catalogDisplayCount,
    catalogSource,
    useRemoteApi,
    catalogLoading,
    apiServerWarning,
    welcomeText,
  };
}
