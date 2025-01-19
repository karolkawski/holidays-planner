const ProcessDataWrapper = ({children}: {children: React.ReactNode}) => {
  const url = process.env.URL?.toUpperCase() || null;
  const name = process.env.NAME?.toUpperCase() || null;
  const url2 = process.env.URL2?.toUpperCase() || null;
  const name2 = process.env.NAME2?.toUpperCase() || null;

  if (!url || !name || !url2 || !name2) {
    return <></>;
  }

  return <>{children}</>;
};

export default ProcessDataWrapper;
