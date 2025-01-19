import {config} from '../config';
import History from '@/src/pages/History';

export default function HistoryPage() {
  return (
    <main className="flex flex-col w-full">
      <History config={config} />
    </main>
  );
}
