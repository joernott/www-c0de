// The search index of VitePress' local search: one loader per locale (root, de), each
// returning the MiniSearch index as JSON.
declare module '@localSearchIndex' {
  const index: Record<string, () => Promise<{ default: string }>>
  export default index
}
