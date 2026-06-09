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
        const [metaResult, catalogResult] = await Promise.allSettled([
          dispatch(aiPickerApi.endpoints.getAiMeta.initiate(siteId)).unwrap(),
          dispatch(aiPickerApi.endpoints.getAiCatalog.initiate(siteId)).unwrap(),
        ]);

        if (cancelled) return;

        let items: AiCatalogItem[] = [];
        let source: "api" | "seed" | null = null;

        if (catalogResult.status === "fulfilled") {
          items = catalogResult.value.items;
          source = catalogResult.value.catalogSource;
        } else if (isAiPickerLocalFallbackEnabled()) {
          const local = await loadAiCatalogWithMeta(siteId);
          if (cancelled) return;
          items = local.items;
          source = local.source;
        }

        setCatalog(items);

        if (metaResult.status === "fulfilled") {
          setApiServerWarning(null);
          setCatalogSource(metaResult.value.catalogSource ?? source);
          setWelcomeText(
            metaResult.value.welcomeText ?? buildWelcomeMessage(items.length),
          );
        } else {
          const metaError =
            metaResult.reason instanceof Error
              ? metaResult.reason.message
              : "Не удалось связаться с сервером подбора";
          setApiServerWarning(
            catalogResult.status === "fulfilled" ? null : metaError,
          );
          setCatalogSource(source);
          setWelcomeText(buildWelcomeMessage(items.length));
        }
      } else {
        setApiServerWarning(null);
        const { items, source } = await loadAiCatalogWithMeta(siteId);
        if (cancelled) return;
        setCatalog(items);
        setCatalogSource(source);
        setWelcomeText(buildWelcomeMessage(items.length));
      }
      setCatalogLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, siteId]);

  return {
    site,
    catalog,
    catalogSource,
    useRemoteApi,
    catalogLoading,
    apiServerWarning,
    welcomeText,
  };
}
