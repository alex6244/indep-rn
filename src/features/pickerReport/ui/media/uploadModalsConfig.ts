export type UploadMediaKind =
  | "salon_photo"
  | "body_photo"
  | "salon_video"
  | "body_video";

export type UploadModalMediaType = "photo" | "video";

export type UploadModalConfigItem = {
  title: string;
  intro: string;
  bullets: string[];
  minFiles: number;
  minFilesText: string;
  required: boolean;
  mediaType: UploadModalMediaType;
  pickLabel: string;
  closeLabel: string;
};

const SALON_BULLETS = ["спидометра", "мультимедийной системы"];
const BODY_BULLETS = ["подкапотное пространство", "багажник"];

function minFilesLabel(count: number): string {
  return `Необходимо загрузить минимум ${count} файлов.`;
}

export const UPLOAD_MODAL_CONFIG: Record<UploadMediaKind, UploadModalConfigItem> = {
  body_photo: {
    title: "Добавьте фото кузова",
    intro: "В обязательном порядке загрузите фотографии:",
    bullets: BODY_BULLETS,
    minFiles: 10,
    minFilesText: minFilesLabel(10),
    required: true,
    mediaType: "photo",
    pickLabel: "Выбрать фото",
    closeLabel: "Закрыть",
  },
  salon_photo: {
    title: "Добавьте фото салона",
    intro: "В обязательном порядке загрузите фотографии:",
    bullets: SALON_BULLETS,
    minFiles: 5,
    minFilesText: minFilesLabel(5),
    required: true,
    mediaType: "photo",
    pickLabel: "Выбрать фото",
    closeLabel: "Закрыть",
  },
  salon_video: {
    title: "Добавьте видео салона",
    intro: "Рекомендуется загрузить видео:",
    bullets: SALON_BULLETS,
    minFiles: 3,
    minFilesText: minFilesLabel(3),
    required: false,
    mediaType: "video",
    pickLabel: "Выбрать видео",
    closeLabel: "Закрыть",
  },
  body_video: {
    title: "Добавьте видео кузова",
    intro: "Рекомендуется загрузить видео:",
    bullets: BODY_BULLETS,
    minFiles: 3,
    minFilesText: minFilesLabel(3),
    required: false,
    mediaType: "video",
    pickLabel: "Выбрать видео",
    closeLabel: "Закрыть",
  },
};

export const getUploadModalConfig = (kind: UploadMediaKind): UploadModalConfigItem =>
  UPLOAD_MODAL_CONFIG[kind];

export const DAMAGE_PHOTO_MODAL_CONFIG: UploadModalConfigItem = {
  title: "Добавьте фото повреждения",
  intro: "В обязательном порядке загрузите фотографии:",
  bullets: ["повреждения крупным планом", "участка кузова с дефектом"],
  minFiles: 1,
  minFilesText: minFilesLabel(1),
  required: true,
  mediaType: "photo",
  pickLabel: "Выбрать фото",
  closeLabel: "Закрыть",
};
