export type UploadMediaKind =
  | "salon_photo"
  | "body_photo"
  | "salon_video"
  | "body_video";

export type UploadModalConfigItem = {
  title: string;
  subtitle: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
};

export const UPLOAD_MODAL_CONFIG: Record<UploadMediaKind, UploadModalConfigItem> = {
  salon_photo: {
    title: "Фото салона",
    subtitle: "Добавьте фото салона, чтобы отчёт был полнее и прозрачнее для клиента.",
    primaryActionLabel: "Выбрать фото",
    secondaryActionLabel: "Закрыть",
  },
  body_photo: {
    title: "Фото кузова",
    subtitle: "Загрузите фото кузова с разных ракурсов для наглядной оценки состояния.",
    primaryActionLabel: "Выбрать фото",
    secondaryActionLabel: "Закрыть",
  },
  salon_video: {
    title: "Видео салона",
    subtitle: "Короткое видео помогает показать фактическое состояние интерьера.",
    primaryActionLabel: "Выбрать видео",
    secondaryActionLabel: "Закрыть",
  },
  body_video: {
    title: "Видео кузова",
    subtitle: "Добавьте видео кузова, чтобы зафиксировать состояние автомобиля в движении.",
    primaryActionLabel: "Выбрать видео",
    secondaryActionLabel: "Закрыть",
  },
};

export const getUploadModalConfig = (kind: UploadMediaKind): UploadModalConfigItem =>
  UPLOAD_MODAL_CONFIG[kind];
