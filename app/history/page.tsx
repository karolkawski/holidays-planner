import { config } from '../config';
import History from '../src/History';

export default function HistoryPage() {
  const names = [config.scrapper.domains[0].name, config.scrapper.domains[1].name];

  return <History names={names} config={config} />;
}
