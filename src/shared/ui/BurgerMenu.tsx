import { router, type Href } from "expo-router";
import { BlurView } from "expo-blur";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";
import Logo from "../../assets/logo.svg";

export type BurgerMenuItem = {
  key: string;
  label: string;
  href?: Href;
  Icon?: React.ComponentType<{ width?: number; height?: number }>;
  onPress?: () => void;
};

type Props = {
  open: boolean;
  onClose: () => void;
  items: BurgerMenuItem[];
  footer?: React.ReactNode;
  panelStyle?: ViewStyle;
};

export function BurgerMenu({
  open,
  onClose,
  items,
  footer,
  panelStyle,
}: Props) {
  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        >
          <View
            style={[StyleSheet.absoluteFillObject, styles.dim]}
          />
          <BlurView
            intensity={30}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
        </View>
        <View
          style={[styles.panel, panelStyle]}
          onStartShouldSetResponder={() => true}
        >
          <Logo width={110} height={28} />
          {items.map((it) => (
            <TouchableOpacity
              key={it.key}
              style={styles.item}
              onPress={() => {
                onClose();
                if (it.onPress) return it.onPress();
                if (it.href) router.push(it.href);
              }}
            >
              {it.Icon ? (
                <View style={styles.icon}>
                  <it.Icon width={22} height={22} />
                </View>
              ) : null}
              <Text style={styles.label}>{it.label}</Text>
            </TouchableOpacity>
          ))}

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  overlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  panel: {
    width: "78%",
    backgroundColor: "#FFFFFF",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 18,
    fontWeight: "800",
    color: "#DB4431",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#505050",
    gap: 10,
  },
  icon: {
    width: 26,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#1E1E1E",
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 14,
  },
});
