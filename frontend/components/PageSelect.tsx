import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type pageSelectProps = {
  page: number;
  getPage: (p: number) => void;
  totalPages: number;
};

const pageRange = [-3, -2, -1, 0, 1, 2, 3];
const maxRange = 3;

function PageSelect({ page, getPage, totalPages }: pageSelectProps) {
  return (
    <div>
      <Pagination className="pt-8">
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => getPage(page - 1)} />
            </PaginationItem>
          )}
          {pageRange.map((delta: number, index: number) => {
            if (page + delta >= 1 && page + delta <= totalPages) {
              return (
                <PaginationItem key={delta}>
                  <PaginationLink
                    onClick={() => getPage(page + delta)}
                    className={delta == 0 ? "bg-gray-100" : ""}
                  >
                    {page + delta}
                  </PaginationLink>
                </PaginationItem>
              );
            }
          })}
          {page + maxRange < totalPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {page + maxRange < totalPages && (
            <PaginationItem>
              {/* <PaginationNext onClick={() => getPage(page + 1)} /> */}
              <PaginationLink onClick={() => getPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default PageSelect;
