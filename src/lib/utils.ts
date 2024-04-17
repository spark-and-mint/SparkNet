import { compareItems, rankItem } from "@tanstack/match-sorter-utils"
import { FilterFn, SortingFn, sortingFns } from "@tanstack/react-table"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank,
  })

  return itemRank.passed
}

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank,
      rowB.columnFiltersMeta[columnId]?.itemRank
    )
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export const toRelativeTimeString = (date: Date) => {
  const now = new Date()
  const differenceInSeconds = (now.getTime() - date.getTime()) / 1000
  const differenceInMinutes = differenceInSeconds / 60
  const differenceInHours = differenceInMinutes / 60
  const differenceInDays = differenceInHours / 24
  const differenceInWeeks = differenceInDays / 7
  const differenceInMonths = differenceInDays / 30
  const differenceInYears = differenceInDays / 365

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" })

  if (differenceInYears >= 1) {
    return rtf.format(-Math.floor(differenceInYears), "year")
  } else if (differenceInMonths >= 1) {
    return rtf.format(-Math.floor(differenceInMonths), "month")
  } else if (differenceInWeeks >= 1) {
    return rtf.format(-Math.floor(differenceInWeeks), "week")
  } else if (differenceInDays >= 1) {
    return rtf.format(-Math.floor(differenceInDays), "day")
  } else if (differenceInHours >= 1) {
    return rtf.format(-Math.floor(differenceInHours), "hour")
  } else {
    return "Less than 1 hour ago"
  }
}
