import React from "react";
import { MediaUploadCard, type MediaUploadState } from "../MediaUploadCard";

type Props = {
  value: MediaUploadState;
  onChange: (next: MediaUploadState) => void;
};

export function CreateMediaSection({ value, onChange }: Props) {
  return <MediaUploadCard value={value} onChange={onChange} />;
}

