/** Metro-safe resolver for bundled images (see src/data/reports.ts). */
declare module "react-native/Libraries/Image/resolveAssetSource" {
  export type Resolved = { uri: string; width: number; height: number; scale: number };

  function resolveAssetSource(source: number): Resolved | null;

  export default resolveAssetSource;
}
