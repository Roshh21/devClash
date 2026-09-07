import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between border-t border-glass px-4 py-3 sm:px-5">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={page <= 1}
        leftIcon={<ChevronLeft size={14} />}
      >
        Previous
      </Button>
      <span className="text-sm text-secondary">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={page >= totalPages}
        rightIcon={<ChevronRight size={14} />}
      >
        Next
      </Button>
    </div>
  );
}
