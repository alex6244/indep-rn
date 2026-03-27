import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Callpin from "../../assets/icons/mobilemenu/callpin.svg";
import Catalogpin from "../../assets/icons/mobilemenu/catalogpin.svg";
import Homepin from "../../assets/icons/mobilemenu/homepin.svg";
import Profilepin from "../../assets/icons/mobilemenu/profilepin.svg";

const ACTIVE = "#DB4431";
const INACTIVE = "#A0A0A0";

// Nav bar design tokens (Figma: Навигационная панель)
const NAV_BG = "#F7F7F7";
const NAV_HEIGHT = 78;
const ICON_SIZE = 28;

type SvgTabIconProps = {
  Icon: React.ComponentType<{ width: number; height: number; color?: string }>;
  color: string;
  focused: boolean;
};

function SvgTabIcon({ Icon, color, focused }: SvgTabIconProps) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon width={ICON_SIZE} height={ICON_SIZE} color={color} />
    </View>
  );
}

function TabLabel({
  label,
  focused,
  color,
}: {
  label: string;
  focused: boolean;
  color: string;
}) {
  return (
    <Text
      style={{
        fontSize: 10,
        lineHeight: 12,
        fontWeight: focused ? "500" : "400",
        color,
        textAlign: "center",
        marginTop: 2,
      }}
      numberOfLines={1}
    >
      {label}
    </Text>
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
          paddingTop: 8,
          paddingHorizontal: 20,
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
          height: 62,
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
            <View style={{ alignItems: "center" }}>
              <SvgTabIcon Icon={Homepin} color={color} focused={focused} />
              <TabLabel label="Главная" focused={focused} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <SvgTabIcon Icon={Catalogpin} color={color} focused={focused} />
              <TabLabel label="Каталог" focused={focused} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <SvgTabIcon Icon={Callpin} color={color} focused={focused} />
              <TabLabel label="Позвонить" focused={focused} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <SvgTabIcon Icon={Profilepin} color={color} focused={focused} />
              <TabLabel label="Профиль" focused={focused} color={color} />
            </View>
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
