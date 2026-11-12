// Replaces the meshopt decoder of three.js in the bundle (config.mts, vite.resolve.alias). The
// decoder compiles WebAssembly as soon as it is imported, which the Content-Security-Policy of
// the site forbids ('wasm-unsafe-eval' is not allowed). <model-viewer> imports it, but only
// uses it for models compressed with meshopt, and the scenes of the programs aren't.
export const MeshoptDecoder = { supported: false, ready: Promise.resolve() }
