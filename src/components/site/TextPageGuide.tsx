import Link from 'next/link';

const checks = [
  {
    title: 'Coverage',
    body: 'Scan the source once more and confirm that every major topic appears somewhere in the map. If an important argument is missing, add it manually or generate again with a more detailed depth.',
  },
  {
    title: 'Hierarchy',
    body: 'Check that supporting details sit below the idea they explain. A common weak result is a flat list where every sentence becomes a first-level branch. Move or merge nodes when the relationship is wrong.',
  },
  {
    title: 'Wording',
    body: 'Node labels should be short enough to scan but specific enough to remain meaningful later. Replace vague labels such as “Other” or “More information” with the actual concept they contain.',
  },
  {
    title: 'Usefulness',
    body: 'The final map should support the job you selected: revision, structural analysis, meeting follow-up or a general overview. Delete branches that do not help that job instead of keeping every generated node.',
  },
];

export function TextPageGuide() {
  return (
    <>
      <section className="border-y bg-surface" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <div className="max-w-3xl">
            <span className="eyebrow">From linear text to visible structure</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">What a text to mind map generator actually changes</h2>
            <p className="mt-5 text-base leading-8 text-text-muted">
              A text to mind map generator does more than shorten a passage. It looks for the main subject, groups related ideas, and places supporting details beneath the topic they explain. The result is a hierarchy you can scan from the centre outward. That makes relationships visible in a way that a normal paragraph or bullet-point summary cannot.
            </p>
            <p className="mt-4 text-base leading-8 text-text-muted">
              MindMapAny keeps the result editable because the first structure is a working draft, not an unquestionable answer. You can rename a branch, move an idea to a better parent, add something the source implies, or remove a detail that is irrelevant to your goal. Read our <Link href="/blog/ai-mind-map-guide" className="font-semibold text-brand-600 hover:underline">guide to evaluating AI mind maps</Link> for a deeper explanation of what makes a generated structure useful.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <article className="rounded-2xl border bg-bg p-6" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600">Short paragraph</div>
              <h3 className="mt-3 text-lg font-bold">Expose the central idea</h3>
              <p className="mt-3 text-sm leading-7 text-text-muted">Use a focused paragraph when you want to separate one claim from its reasons, examples and consequences. The resulting map will be compact, which is useful for explaining a concept or preparing a slide.</p>
            </article>
            <article className="rounded-2xl border bg-bg p-6" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600">Long notes</div>
              <h3 className="mt-3 text-lg font-bold">Consolidate repeated themes</h3>
              <p className="mt-3 text-sm leading-7 text-text-muted">Lecture notes and research notes often repeat an idea in several places. A map can bring those references under one topic, giving you a revision structure instead of another chronological transcript.</p>
            </article>
            <article className="rounded-2xl border bg-bg p-6" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600">Meeting or project text</div>
              <h3 className="mt-3 text-lg font-bold">Separate decisions from actions</h3>
              <p className="mt-3 text-sm leading-7 text-text-muted">Paste meeting minutes, a project brief or product requirements to group goals, owners, risks, open questions and next actions. Edit the labels afterwards so they match the language your team already uses.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <span className="eyebrow">Better input, better map</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">How to prepare text before generating</h2>
          <p className="mt-5 text-sm leading-7 text-text-muted">
            You do not need to rewrite clean prose. Rough notes are fine, but the source should contain enough context to distinguish topics. Keep headings when they carry meaning, retain names or dates you need later, and remove navigation, repeated disclaimers or unrelated boilerplate. For a very long document, start with one coherent section so you can judge the structure before spending credits on the rest.
          </p>
          <p className="mt-4 text-sm leading-7 text-text-muted">
            Choose concise depth for a quick overview and detailed depth when examples and supporting evidence matter. Select the purpose that matches the task rather than the source format. The same article may need a concise general map for briefing a colleague and a detailed study map for revision. Current character allowances vary by plan, so check the <Link href="/pricing" className="font-semibold text-brand-600 hover:underline">pricing and limits</Link> before processing a large input.
          </p>
          <div className="mt-7 rounded-2xl border border-brand-200 bg-brand-50/60 p-5 dark:border-brand-800 dark:bg-brand-900/15">
            <h3 className="font-bold">A practical input checklist</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-text-muted">
              <li>✓ Include the complete section whose relationships you want to understand.</li>
              <li>✓ Keep meaningful headings, lists, names, dates and action verbs.</li>
              <li>✓ Remove menus, email signatures and unrelated copied material.</li>
              <li>✓ Pick the output purpose before choosing how much detail to retain.</li>
            </ul>
          </div>
        </div>

        <div>
          <span className="eyebrow">Human review still matters</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">How to check an AI-generated mind map</h2>
          <p className="mt-5 text-sm leading-7 text-text-muted">
            Generative output can omit a point, combine ideas that should remain separate, or choose a label that is too broad. Review the map while the original text is still fresh. These four checks turn the generated result into a structure you can trust and continue using.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {checks.map((check, index) => (
              <article key={check.title} className="rounded-2xl border bg-surface p-5" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs font-bold text-brand-600">0{index + 1}</div>
                <h3 className="mt-2 font-bold">{check.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{check.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-surface" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <span className="eyebrow">Choose the right output</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">Mind map versus text summary</h2>
              <p className="mt-5 text-sm leading-7 text-text-muted">
                Choose a mind map when relationships, categories and navigation matter. It is useful for studying a topic, planning work, comparing themes or presenting an overview. Choose a linear summary when you need a short narrative that can be read from beginning to end. Neither format is always better: the right one depends on what you need to do next.
              </p>
              <p className="mt-4 text-sm leading-7 text-text-muted">
                A map is especially valuable when the source contains several branches that would become buried in prose. A summary is usually clearer when sequence and argument flow must stay intact. See our detailed <Link href="/blog/mind-map-vs-summary" className="font-semibold text-brand-600 hover:underline">mind map versus summary comparison</Link> before choosing an output for a report or study session.
              </p>
            </div>
            <div>
              <span className="eyebrow">Privacy and continued editing</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">What happens after you paste text</h2>
              <p className="mt-5 text-sm leading-7 text-text-muted">
                The landing page keeps your draft in the browser while you sign in. It sends the text for processing only after you choose Generate. Product analytics records events such as starting and completing a generation plus a broad character-count band; it does not receive the pasted passage or the generated node labels. Avoid entering secrets or regulated personal data into any online AI tool unless your organisation has approved that use. The <Link href="/privacy" className="font-semibold text-brand-600 hover:underline">privacy policy</Link> explains the service-level handling in more detail.
              </p>
              <p className="mt-4 text-sm leading-7 text-text-muted">
                After generation, the structured map is saved to your map library so you can return to it. You can edit node text, add or remove branches, collapse levels, change the visual format, create a share link and export the result as PNG, SVG or Markdown. That makes the output useful beyond the first AI response: it can become a study sheet, project outline, meeting follow-up or starting point for a presentation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
