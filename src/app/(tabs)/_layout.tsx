import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Homepin from "../../assets/icons/mobilemenu/homepin.svg";
import Catalogpin from "../../assets/icons/mobilemenu/catalogpin.svg";
import Callpin from "../../assets/icons/mobilemenu/callpin.svg";
import Profilepin from "../../assets/icons/mobilemenu/profilepin.svg";

const ACTIVE = "#DB4431";
const INACTIVE = "#8E8E93";

type SvgTabIconProps = {
  Icon: React.ComponentType<{ width: number; height: number; color?: string }>;
  color: string;
};

function SvgTabIcon({ Icon, color }: SvgTabIconProps) {
  return <Icon width={24} height={24} color={color} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === "ios" ? 10 : 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#E5E5EA",
          height: 78 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ color }) => (
            <SvgTabIcon Icon={Homepin} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Каталог",
          tabBarIcon: ({ color }) => (
            <SvgTabIcon Icon={Catalogpin} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: "Позвонить",
          tabBarIcon: ({ color }) => (
            <SvgTabIcon Icon={Callpin} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color }) => (
            <SvgTabIcon Icon={Profilepin} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Избранное",
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
