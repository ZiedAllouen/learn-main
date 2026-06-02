/**
 * Inline notice shown when a list page's data could not be loaded from the API
 * (backend unreachable). Lets the page render normally with an empty list while
 * making the cause clear to the user — instead of crashing the whole page.
 */
export function UnavailableNotice({
  label = 'Ce contenu',
}: {
  /** What is unavailable, e.g. "Les programmes". Used in the sentence. */
  label?: string
}) {
  return (
    <div className="border border-page-accent/30 bg-page-accent/5 px-5 py-4 rounded-xl text-center">
      <p className="text-sm text-bsmk-black/70">
        {label} ne sont pas disponibles pour le moment. Veuillez réessayer dans
        quelques instants.
      </p>
    </div>
  )
}
