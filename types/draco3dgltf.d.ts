declare module 'draco3dgltf' {
  export function createDecoderModule(opts?: unknown): Promise<unknown>
  export function createEncoderModule(opts?: unknown): Promise<unknown>
  const _default: {
    createDecoderModule: typeof createDecoderModule
    createEncoderModule: typeof createEncoderModule
  }
  export default _default
}
