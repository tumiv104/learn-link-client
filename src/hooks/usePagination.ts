import { useState } from "react"

export function usePagination(totalPages: number, initialPage = 1, initialPageSize = 5) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const getPageNumbers = (delta = 2): (number | "ellipsis")[] => {
    const range: (number | "ellipsis")[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i)
      } else if (
        range[range.length - 1] !== "ellipsis" &&
        (i === page - delta - 1 || i === page + delta + 1)
      ) {
        range.push("ellipsis")
      }
    }

    return range
  }

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    getPageNumbers,
  }
}
