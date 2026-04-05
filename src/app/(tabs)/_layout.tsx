import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Callpin from "../../assets/icons/mobilemenu/callpin2.svg";
import Catalogpin from "../../assets/icons/mobilemenu/catalogpin2.svg";
import Homepin from "../../assets/icons/mobilemenu/homepin2.svg";
import Profilepin from "../../assets/icons/mobilemenu/profilepin2.svg";
import { tabBarSafeAreaBottom, tabBarTotalHeight } from "./tabBarMetrics";

const ACTIVE = "#DB4431";
const INACTIVE = "#A0A0A0";
const NAV_BG = "#FFFFFF";
const ICON_SIZE = 24;

type SvgTabIconProps = {
  Icon: React.ComponentType<{ width: number; height: number; color?: string }>;
  color: string;
  focused: boolean;
};

function SvgTabIcon({ Icon, color, focused }: SvgTabIconProps) {
  return (
    <View
      style={{
        width: ICON_SIZE + 8,
        height: ICON_SIZE + 4,
        alignItems: "center",
        justifyContent: "center",
        opacity: focused ? 1 : 0.85,
      }}
    >
      <Icon width={ICON_SIZE} height={ICON_SIZE} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = tabBarSafeAreaBottom(insets.bottom);
  const barHeight = tabBarTotalHeight(bottomInset);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarStyle: {
          backgroundColor: NAV_BG,
          borderTopWidth: 1,
          borderTopColor: "#E8E8E8",
          elevation: 0,
          shadowOpacity: 0,
          height: barHeight,
          paddingBottom: bottomInset,
          paddingTop: 6,
          paddingHorizontal: 4,
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
          paddingVertical: 2,
          alignItems: "center",
          justifyContent: "flex-start",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ color, focused }) => (
            <SvgTabIcon Icon={Homepin} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Каталог",
          tabBarIcon: ({ color, focused }) => (
            <SvgTabIcon Icon={Catalogpin} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: "Позвонить",
          tabBarIcon: ({ color, focused }) => (
            <SvgTabIcon Icon={Callpin} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color, focused }) => (
            <SvgTabIcon Icon={Profilepin} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
