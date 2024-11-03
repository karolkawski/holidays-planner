import Panel from "./src/Panel";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col">
      <Panel/>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
