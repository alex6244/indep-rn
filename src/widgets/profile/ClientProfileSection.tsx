import { type Href, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, type ImageSourcePropType, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AboutIcon from "../../assets/icons/burger/about.svg";
import CooperationIcon from "../../assets/icons/burger/ads.svg";
import FavIcon from "../../assets/icons/burger/favourites.svg";
import SelectionIcon from "../../assets/icons/burger/selection.svg";
import { BurgerMenu } from "../../shared/ui/BurgerMenu";
import { scrollBottomPaddingBelowTabBar } from "../../app/(tabs)/tabBarMetrics";
import { styles } from "../../app/(tabs)/profile.styles";
import { ClientEmptyState } from "./ClientEmptyState";
import { ClientProfileHeader } from "./ClientProfileHeader";
import { ClientReportCard } from "./ClientReportCard";
import { ProfileEditMenu } from "./ProfileEditMenu";
import { ProfileLogoutRow } from "./ProfileLogoutRow";
import { ProfileQuickActions } from "./ProfileQuickActions";
import { useProfileEditFlow } from "./useProfileEditFlow";

type Props = {
  name: string;
  phone?: string;
  onLogout: () => Promise<void>;
};

export function ClientProfileSection({ name, phone, onLogout }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const editFlow = useProfileEditFlow(onLogout, router);

  const reports = useMemo<
    {
      id: string;
      price: string;
      title: string;
      subtitle: string;
      city: string;
      imageUrl: ImageSourcePropType;
    }[]
  >(() => [], []);
  const hasReports = reports.length > 0;

  return (
    <View style={styles.pickerScreen}>
      <ClientProfileHeader
        name={name}
        phone={phone}
        showTitle={hasReports}
        onOpenEdit={() => editFlow.setEditMenuOpen(true)}
        onOpenBurger={() => setMenuOpen(true)}
      />

      <ScrollView
        contentContainerStyle={[
          styles.pickerContent,
          {
            paddingBottom: scrollBottomPaddingBelowTabBar(insets.bottom),
          },
        ]}
      >
        {hasReports ? (
          <>
            {reports.map((r) => (
              <ClientReportCard
                key={r.id}
                report={r}
                onOpen={() => router.push(`/reports/${r.id}` as Href)}
                onDownloadPdf={() => {
                  Alert.alert("PDF пока недоступен");
                }}
              />
            ))}
          </>
        ) : (
          <>
            <ProfileQuickActions
              variant="client"
              onOpenFavorites={() => router.push("/(tabs)/favorites" as Href)}
              onOpenBest={() => router.push("/selection" as Href)}
            />
            <ClientEmptyState onOpenCatalog={() => router.push("/(tabs)/catalog" as Href)} />
          </>
        )}
      </ScrollView>

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={[
          {
            key: "favorites",
            label: "Избранное",
            href: "/(tabs)/favorites" as Href,
            Icon: FavIcon,
          },
          {
            key: "selection",
            label: "Подбор авто",
            href: "/selection" as Href,
            Icon: SelectionIcon,
          },
          {
            key: "coop",
            label: "Сотрудничество",
            href: "/cooperation" as Href,
            Icon: CooperationIcon,
          },
          {
            key: "about",
            label: "О нас",
            href: "/about" as Href,
            Icon: AboutIcon,
          },
        ]}
        footer={
          <ProfileLogoutRow
            onPress={() => {
              void (async () => {
                await onLogout();
                router.replace("/(auth)" as Href);
              })();
            }}
          />
        }
      />

      <ProfileEditMenu
        editMenuOpen={editFlow.editMenuOpen}
        confirmDeleteOpen={editFlow.confirmDeleteOpen}
        deletedOpen={editFlow.deletedOpen}
        onCloseEditMenu={() => editFlow.setEditMenuOpen(false)}
        onChangePhone={() => {}}
        onOpenDeleteConfirm={() => editFlow.setConfirmDeleteOpen(true)}
        onCloseDeleteConfirm={() => editFlow.setConfirmDeleteOpen(false)}
        onConfirmDelete={editFlow.handleDeleteConfirm}
        onCloseDeleted={editFlow.handleCloseDeleted}
      />
    </View>
  );
}
