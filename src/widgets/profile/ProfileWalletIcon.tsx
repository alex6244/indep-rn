import React from "react";
import { View } from "react-native";
import WalletIcon from "../../assets/profile/wallet.svg";

/** Figma wallet layer (clipPath rotate -32.3225°). */
const WALLET_ROTATE_DEG = -5;

type Props = {
  width: number;
  height: number;
};

/**
 * RN часто не применяет rotate внутри clipPath в SVG — крутим обёртку.
 */
export function ProfileWalletIcon({ width, height }: Props) {
  return (
    <View
      style={{
        width,
        height,
        transform: [{ rotate: `${WALLET_ROTATE_DEG}deg` }],
      }}
      pointerEvents="none"
    >
      <WalletIcon width={width} height={height} />
    </View>
  );
}
