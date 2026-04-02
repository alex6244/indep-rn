import React from "react";
import { BottomNextButton } from "../BottomNextButton";

type Props = {
  bottomPadding: number;
  onPress: () => void;
};

export function CreateFooterActions({ bottomPadding, onPress }: Props) {
  return (
    <BottomNextButton bottomPadding={bottomPadding} onPress={onPress} />
  );
}

