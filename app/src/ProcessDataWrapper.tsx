const ProcessDataWrapper = ({ children }: { children: React.ReactNode }) => {
  const url = process.env.URL?.toUpperCase() || null;
  const name = process.env.NAME?.toUpperCase() || null;
  const url2 = process.env.URL2?.toUpperCase() || null;
  const name2 = process.env.NAME2?.toUpperCase() || null;

  if (!url || !name || !url2 || !name2) {
    return <></>;
  }

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main>{children}</main>
      <footer></footer>
    </div>
  );
};

export default ProcessDataWrapper;
