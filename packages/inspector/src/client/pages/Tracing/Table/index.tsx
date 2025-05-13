import { CopyButton } from "@/client/components/CopyButton";
import { Input } from "@/client/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { eventHandler } from "@/client/lib/eventHandler";
import { cn, numberFormatter } from "@/client/lib/utils";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import { MoveDown, MoveUp } from "lucide-react";
import { useMemo, useState } from "react";
import { SortingEnum, useLogs } from "../providers";
import { TableDrawer } from "./TableDrawer";

export function TracingTable() {
  const { logs, selected, setSelected, timestampSort, toggleTimestampSort } =
    useLogs();
  const [search, setSearch] = useState<string>("");

  const handleSortDate = eventHandler(() => toggleTimestampSort());

  const handleSelectData = (id: string) => eventHandler(() => setSelected(id));

  const parsedTraces = useMemo(() => {
    if (!search.trim()) return logs;

    const fuse = new Fuse(logs, {
      keys: ["session", "sRequest", "sResponse"],
    });

    return fuse.search(search).map(({ item }) => item);
  }, [search, logs]);

  return (
    <div className="w-full h-full flex gap-2 md:gap-3 lg:gap-4 overflow-y-auto">
      <div className="w-full flex flex-col gap-2">
        <Input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-9"
        />
        <div className="h-max grid overflow-hidden">
          <Table className="overflow-y-auto lg:table-fixed [&>thead>tr>th]:bg-accent [&>thead>tr>th]:sticky [&>thead>tr>th]:top-0 [&>thead>tr>th]:z-10">
            <TableHeader>
              <TableRow className="hover:bg-accent divide-x bg-accent">
                <TableHead>Session ID</TableHead>
                <TableHead
                  onClick={handleSortDate}
                  onKeyDown={handleSortDate}
                  className="w-64 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    Timestamp
                    {timestampSort === SortingEnum.ASCENDING && (
                      <MoveUp className="size-3.5" />
                    )}
                    {timestampSort === SortingEnum.DESCENDING && (
                      <MoveDown className="size-3.5" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>
                  <div className="flex items-center justify-between">
                    Method
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parsedTraces.length > 0 ? (
                parsedTraces.map((trace, index) => {
                  const isError = Boolean(trace.response?.error);

                  const requestWasSentOn = trace.timestamp.start;
                  const monthWithDay = dayjs(requestWasSentOn).format("MMM DD");
                  const time = dayjs(requestWasSentOn).format("hh:mm:ss");
                  const millisecond = dayjs(requestWasSentOn).format("SSS");

                  const latency =
                    "latency" in trace.timestamp
                      ? trace.timestamp.latency
                      : undefined;

                  return (
                    <TableRow
                      key={`row.${index + 1}`}
                      className={cn(
                        "cursor-pointer divide-x",
                        selected === trace.id && "bg-muted/50"
                      )}
                      onClick={handleSelectData(trace.id)}
                      onKeyDown={handleSelectData(trace.id)}
                    >
                      <TableCell>
                        <div className="flex justify-between items-center gap-1">
                          <p className="truncate">{trace.session}</p>
                          <CopyButton
                            data={trace.session}
                            tooltipContent="Copy Session ID"
                            className="[&>svg]:size-3.5 p-1 has-[>svg]:px-1"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="space-x-1 font-medium uppercase">
                        <span className="text-black/50 dark:text-white/50">
                          {monthWithDay}
                        </span>
                        {time}
                        <span className="text-black/50 dark:text-white/50">
                          .{millisecond}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "border px-1.5 w-max",
                            isError
                              ? "text-red-500 dark:text-red-300 bg-red-200/40 dark:bg-red-300/10"
                              : "text-green-600 dark:text-green-300 bg-green-200/40 dark:bg-green-300/10"
                          )}
                        >
                          {isError ? "Error" : "Success"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {latency
                          ? latency > 1000
                            ? `${numberFormatter(
                                Number((latency / 1000).toFixed(2)),
                                "decimal"
                              )} s`
                            : `${numberFormatter(latency, "decimal")} ms`
                          : "-"}
                      </TableCell>
                      <TableCell>{String(trace.request?.method)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    className="h-[500px] text-center select-none text-muted-foreground"
                    colSpan={5}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <TableDrawer traces={parsedTraces} />
    </div>
  );
}
