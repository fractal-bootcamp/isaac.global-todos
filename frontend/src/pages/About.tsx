function About() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Project Overview</h2>

      <div className="space-y-6 text-left">
        <section>
          <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>React 18 with TypeScript</li>
            <li>Vite for build tooling</li>
            <li>Zustand for state management</li>
            <li>TailwindCSS for styling</li>
            <li>Claude AI integration via Anthropic SDK</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Project Structure</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><code>/components</code> - Reusable UI components</li>
            <li><code>/pages</code> - Route-level components</li>
            <li><code>/store</code> - Zustand store definitions</li>
            <li><code>/types</code> - TypeScript type definitions</li>
            <li><code>/AI</code> - Claude integration services</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Key Features</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Task state management using Zustand store</li>
            <li>Epic-based task grouping system</li>
            <li>AI task generation via Claude</li>
            <li>Dark mode support via Tailwind</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Development Notes</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Environment requires VITE_CLAUDE_API_KEY for AI features</li>
            <li>Uses ESLint with TypeScript-aware rules</li>
            <li>Strict TypeScript mode enabled</li>
            <li>Component props use explicit interfaces</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default About;
