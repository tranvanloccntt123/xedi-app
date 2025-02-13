// Reexport the native module. On web, it will be resolved to ExpoOsmModule.web.ts
// and on native platforms to ExpoOsmModule.ts
export { default } from './ExpoOsmModule';
export { default as ExpoOsmView } from './ExpoOsmView';
export * from  './ExpoOsm.types';
