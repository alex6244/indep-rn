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
  minFilesText: string;
  mediaType: UploadModalMediaType;
  pickLabel: string;
  closeLabel: string;
};

const SALON_BULLETS = ["спидометра", "мультимедийной системы"];
const BODY_BULLETS = ["подкапотное пространство", "багажник"];

export const UPLOAD_MODAL_CONFIG: Record<UploadMediaKind, UploadModalConfigItem> = {
  salon_photo: {
    title: "Добавьте фото салона",
    intro: "В обязательном порядке загрузите фотографии:",
    bullets: SALON_BULLETS,
    minFilesText: "Необходимо загрузить минимум 12 файлов.",
    mediaType: "photo",
    pickLabel: "Выбрать фото",
    closeLabel: "Закрыть",
  },
  body_photo: {
    title: "Добавьте фото кузова",
    intro: "В обязательном порядке загрузите фотографии:",
    bullets: BODY_BULLETS,
    minFilesText: "Необходимо загрузить минимум 12 файлов.",
    mediaType: "photo",
    pickLabel: "Выбрать фото",
    closeLabel: "Закрыть",
  },
  salon_video: {
    title: "Добавьте видео салона",
    intro: "В обязательном порядке загрузите видео:",
    bullets: SALON_BULLETS,
    minFilesText: "Необходимо загрузить минимум 3 файла.",
    mediaType: "video",
    pickLabel: "Выбрать видео",
    closeLabel: "Закрыть",
  },
  body_video: {
    title: "Добавьте видео кузова",
    intro: "В обязательном порядке загрузите видео:",
    bullets: BODY_BULLETS,
    minFilesText: "Необходимо загрузить минимум 3 файла.",
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
  minFilesText: "Необходимо загрузить минимум 1 файл.",
  mediaType: "photo",
  pickLabel: "Выбрать фото",
  closeLabel: "Закрыть",
};
