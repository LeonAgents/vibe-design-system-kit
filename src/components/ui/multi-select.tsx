"use client"

import * as React from "react"
import { X, ChevronDown, Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  maxTagCount?: number | "responsive"
  allowClear?: boolean
}

function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  maxTagCount = 1,
  allowClear = true,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const filtered = React.useMemo(() => {
    if (!search) return options
    const lower = search.toLowerCase()
    return options.filter(
      (o) => o.label.toLowerCase().includes(lower) || o.value.toLowerCase().includes(lower)
    )
  }, [options, search])

  const selectedLabels = React.useMemo(() => {
    return value
      .map((v) => options.find((o) => o.value === v))
      .filter(Boolean) as MultiSelectOption[]
  }, [value, options])

  const displayCount = typeof maxTagCount === "number" ? maxTagCount : 1

  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          className={cn(
            "flex h-[var(--component-input-height)] w-full items-center justify-between gap-1 rounded-[var(--component-input-radius)] border border-input bg-background px-3 py-1 text-sm ring-offset-background",
            "transition-colors duration-150",
            "hover:border-[var(--highlight)] focus:outline-none",
            "data-[state=open]:border-[var(--text-secondary)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <div className="hide-scrollbar flex flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap">
            {selectedLabels.length === 0 ? (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            ) : (
              <>
                {selectedLabels.slice(0, displayCount).map((item) => (
                  <Badge
                    key={item.value}
                    variant="secondary"
                    className="shrink-0 gap-1 rounded-[4px] text-xs font-normal"
                  >
                    <span className="truncate max-w-[120px]">{item.label}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="ml-0.5 cursor-pointer rounded-full outline-none hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggle(item.value)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          toggle(item.value)
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}
                {selectedLabels.length > displayCount && (
                  <Badge variant="secondary" className="shrink-0 rounded-[4px] text-xs font-normal">
                    +{selectedLabels.length - displayCount}
                  </Badge>
                )}
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {allowClear && value.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                onClick={clear}
                className="cursor-pointer rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    clear(e as unknown as React.MouseEvent)
                  }
                }}
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150",
                open && "rotate-180",
              )}
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="gap-0 p-0"
        align="start"
        // Popover 渲染时同步读取 trigger 宽度做尺寸匹配（Popover 在 trigger 后才挂载，此时 ref 已就位）
        // eslint-disable-next-line react-hooks/refs
        style={{ minWidth: triggerRef.current?.offsetWidth ?? 200, width: "auto", maxWidth: 360 }}
      >
        <div className="p-4 pb-2">
          <div className="relative flex items-center">
            <input
              className={cn(
                "h-[var(--component-input-height)] w-full rounded-[var(--component-input-radius)] border border-[var(--border-divider)] bg-[var(--bg-card)] pl-3 pr-9 text-sm",
                "text-[var(--text-regular)] placeholder:text-[var(--text-disabled)]",
                "outline-none transition-colors duration-150",
                "focus:border-[var(--text-secondary)] focus:shadow-none!",
              )}
              placeholder="搜索"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="pointer-events-none absolute right-3 h-4 w-4 text-[var(--text-secondary)]" />
          </div>
        </div>
        <div className="max-h-[240px] overflow-y-auto px-1 pb-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-[var(--text-disabled)]">
              暂无匹配结果
            </div>
          ) : (
            filtered.map((option) => {
              const isSelected = value.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => toggle(option.value)}
                  className="group flex h-10 w-full items-center px-1 outline-none"
                >
                  <div
                    className={cn(
                      "flex h-8 w-full items-center gap-2.5 rounded px-3 transition-colors duration-100",
                      isSelected
                        ? "bg-[var(--bg-secondary)]"
                        : "group-hover:bg-[var(--bg-secondary)]",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border transition-colors duration-100",
                        isSelected
                          ? "border-[var(--highlight)] bg-[var(--highlight)] text-[var(--highlight-foreground)]"
                          : "border-[var(--border-divider)] bg-transparent",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" strokeWidth={2.5} />}
                    </div>
                    <span
                      className={cn(
                        "truncate text-sm",
                        isSelected
                          ? "font-medium text-[var(--text-strong)]"
                          : "text-[var(--text-regular)]",
                      )}
                    >
                      {option.label}
                    </span>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
export type { MultiSelectProps, MultiSelectOption }
