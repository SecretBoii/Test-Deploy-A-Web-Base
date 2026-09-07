import { ArrowUp, ArrowDown } from 'lucide-react';

interface SortIconIndicatorProps {
  active: boolean;
  direction: 'asc' | 'desc';
}

/**
 * คอมโพเนนต์แสดงไอคอนสถานะการเรียงลำดับในตาราง (Sort Icon Indicator)
 * แยกเป็น Shared Component เพื่อหลีกเลี่ยงการเขียนโค้ดซ้ำซ้อนในหน้ารายงานต่างๆ
 */
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
