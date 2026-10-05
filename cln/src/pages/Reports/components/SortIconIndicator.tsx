import { ArrowUp, ArrowDown } from 'lucide-react';

interface SortIconIndicatorProps {
  active: boolean;
  direction: 'asc' | 'desc';
}

export function SortIconIndicator({ active, direction }: SortIconIndicatorProps) {
  if (!active) {
    return <ArrowUp size={14} style={{ color: '#cbd5e1', marginLeft: 4 }} />;
  }
  return direction === 'asc' ? (
    <ArrowUp size={14} style={{ color: '#2563eb', marginLeft: 4 }} />
  ) : (
    <ArrowDown size={14} style={{ color: '#2563eb', marginLeft: 4 }} />
  );
}
