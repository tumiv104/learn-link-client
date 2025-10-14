"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@radix-ui/react-label"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

interface PaginationBarProps {
  page: number
  setPage: (page: number) => void
  pageSize: number
  setPageSize: (size: number) => void
  totalPages: number
  getPageNumbers: () => (number | "ellipsis")[]
  pageSizeOptions?: number[]
}

export function PaginationBar({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
  getPageNumbers,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationBarProps) {

  const t = useTranslations("component.paginationBar")

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Label className="whitespace-nowrap">{t("pageSize")}:</Label>
        <Select
          value={pageSize.toString()}
          onValueChange={(val) => {
            setPageSize(Number(val))
            setPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {/* <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                
              >
              <span>{t("previous")}</span>
              </PaginationPrevious> */}
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 py-2 has-[>svg]:px-3 gap-1 px-2.5 sm:pr-2.5${
                page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{t("previous")}</span>
                </button>
            </PaginationItem>

            {getPageNumbers().map((p, idx) =>
              p === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              {/* <PaginationNext
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              >
              {t("next")}
              </PaginationNext> */}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 py-2 has-[>svg]:px-3 gap-1 px-2.5 sm:pr-2.5${
                page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
                >
                    <span>{t("next")}</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
