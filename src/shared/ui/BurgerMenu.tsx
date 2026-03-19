import { router, type Href } from "expo-router";
import React, { useEffect } from "react";
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
  useEffect(() => {
    if (!open) return;

    console.log("[debug] BurgerMenu opened", { itemsCount: items.length });

    // #region agent log
    fetch(
      "http://127.0.0.1:7574/ingest/90ad6a03-168e-422b-be89-831782cd6f2b",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "7a6ed6",
        },
        body: JSON.stringify({
          sessionId: "7a6ed6",
          runId: "debug_initial",
          hypothesisId: "H4",
          location: "src/shared/ui/BurgerMenu.tsx:useEffect(open)",
          message: "burger_menu_opened",
          data: { itemsCount: items.length },
          timestamp: Date.now(),
        }),
      },
    ).catch(() => {});
    // #endregion
  }, [open, items.length]);

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
        onPress={() => {
          console.log("[debug] BurgerMenu overlay closed");
          // #region agent log
          fetch(
            "http://127.0.0.1:7574/ingest/90ad6a03-168e-422b-be89-831782cd6f2b",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": "7a6ed6",
              },
              body: JSON.stringify({
                sessionId: "7a6ed6",
                runId: "debug_initial",
                hypothesisId: "H4",
                location: "src/shared/ui/BurgerMenu.tsx:overlay.onPress",
                message: "burger_menu_overlay_closed",
                data: {},
                timestamp: Date.now(),
              }),
            },
          ).catch(() => {});
          // #endregion
          onClose();
        }}
      >
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
                console.log("[debug] BurgerMenu item pressed", {
                  key: it.key,
                  href: it.href ?? null,
                });
                // #region agent log
                fetch(
                  "http://127.0.0.1:7574/ingest/90ad6a03-168e-422b-be89-831782cd6f2b",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-Debug-Session-Id": "7a6ed6",
                    },
                    body: JSON.stringify({
                      sessionId: "7a6ed6",
                      runId: "debug_initial",
                      hypothesisId: "H4",
                      location: "src/shared/ui/BurgerMenu.tsx:item.onPress",
                      message: "burger_menu_item_pressed",
                      data: { key: it.key, href: it.href ?? null },
                      timestamp: Date.now(),
                    }),
                  },
                ).catch(() => {});
                // #endregion
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
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
