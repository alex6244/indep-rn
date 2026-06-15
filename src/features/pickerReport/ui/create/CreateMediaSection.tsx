import React from "react";
import type { MediaUploadState } from "../../../../types/draftReport";
import type { RequiredMediaKey } from "../../../../shared/validation/mediaValidation";
import { MediaUploadCard } from "../MediaUploadCard";

type Props = {
  value: MediaUploadState;
  onChange: (next: MediaUploadState) => void;
  highlightKeys?: RequiredMediaKey[];
};

export function CreateMediaSection({ value, onChange, highlightKeys }: Props) {
  return (
    <MediaUploadCard
      value={value}
      onChange={onChange}
      highlightKeys={highlightKeys}
    />
  );
}
