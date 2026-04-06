import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationControlProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
};

function clampPage(n: number, pageCount: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(pageCount, Math.floor(n)));
}

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i += 1) out.push(i);
  return out;
}

function getPaginationItems({
  page,
  pageCount,
  siblingCount,
}: {
  page: number;
  pageCount: number;
  siblingCount: number;
}): Array<number | "ellipsis"> {
  if (pageCount <= 7 + siblingCount * 2) return range(1, pageCount);

  const firstPage = 1;
  const lastPage = pageCount;
  const leftSibling = Math.max(page - siblingCount, 2);
  const rightSibling = Math.min(page + siblingCount, pageCount - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < pageCount - 1;

  const items: Array<number | "ellipsis"> = [firstPage];

  if (showLeftEllipsis) items.push("ellipsis");
  items.push(...range(leftSibling, rightSibling));
  if (showRightEllipsis) items.push("ellipsis");

  items.push(lastPage);
  return items;
}

export function PaginationControl({
  page,
  pageCount,
  onPageChange,
  className,
  siblingCount = 1,
}: PaginationControlProps) {
  const safePageCount = Math.max(1, Math.floor(pageCount));
  const safePage = clampPage(page, safePageCount);
  const canPrev = safePage > 1;
  const canNext = safePage < safePageCount;

  const items = getPaginationItems({
    page: safePage,
    pageCount: safePageCount,
    siblingCount: Math.max(0, Math.floor(siblingCount)),
  });

  if (safePageCount <= 1) return null;

  return (
    <Pagination className={cn("justify-center", className)}>
      <PaginationContent className="gap-1.5">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (canPrev) onPageChange(safePage - 1);
            }}
            className={cn(!canPrev && "pointer-events-none opacity-50")}
          />
        </PaginationItem>

        {items.map((it, idx) => {
          if (it === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          const n = it;
          return (
            <PaginationItem key={n}>
              <PaginationLink
                href="#"
                isActive={n === safePage}
                onClick={(e) => {
                  e.preventDefault();
                  if (n !== safePage) onPageChange(n);
                }}
                className="min-w-9"
              >
                {n}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (canNext) onPageChange(safePage + 1);
            }}
            className={cn(!canNext && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

