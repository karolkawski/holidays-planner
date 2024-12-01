import Panel from './src/Panel';
import { config } from './config';
import ProcessDataWrapper from './src/ProcessDataWrapper';

export default function Home() {
  const url = process.env.URL?.toUpperCase() || null;
  const name = process.env.NAME?.toUpperCase() || null;
  const url2 = process.env.URL2?.toUpperCase() || null;
  const name2 = process.env.NAME2?.toUpperCase() || null;

  if (!url || !name || !url2 || !name2) {
    return <></>;
  }

  return (
    <ProcessDataWrapper>
      <Panel config={config} />
    </ProcessDataWrapper>
  );
}
