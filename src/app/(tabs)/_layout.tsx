import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Callpin from "../../assets/icons/mobilemenu/callpin.svg";
import Catalogpin from "../../assets/icons/mobilemenu/catalogpin.svg";
import Homepin from "../../assets/icons/mobilemenu/homepin.svg";
import Profilepin from "../../assets/icons/mobilemenu/profilepin.svg";

const ACTIVE = "#DB4431";
const INACTIVE = "#A0A0A0";

// Nav bar design tokens (Figma: Навигационная панель)
const NAV_BG = "#F7F7F7";
const NAV_HEIGHT = 92;
const ICON_SIZE = 62;

type SvgTabIconProps = {
  Icon: React.ComponentType<{ width: number; height: number; color?: string }>;
  color: string;
  focused: boolean;
};

function SvgTabIcon({ Icon, color, focused }: SvgTabIconProps) {
  return (
    <View
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon width={ICON_SIZE} height={ICON_SIZE} color={color} />
    </View>
  );
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
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: NAV_BG,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: NAV_HEIGHT + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 6,
          paddingHorizontal: 20,
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
          height: 70,
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <SvgTabIcon Icon={Homepin} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <SvgTabIcon Icon={Catalogpin} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <SvgTabIcon Icon={Callpin} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
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
