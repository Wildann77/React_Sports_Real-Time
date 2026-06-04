import React from 'react';
import { Skeleton } from './Skeleton';

interface TableRowSkeletonProps {
  columns?: number;
}

export const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({ columns = 7 }) => {
  return (
    <tr className="border-b border-border/10">
      <td className="p-4">
        <Skeleton className="h-5 w-32" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-20 font-mono" />
      </td>
      <td className="p-4">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </td>
    </tr>
  );
};
export default TableRowSkeleton;
