import { Button } from "@/client/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/client/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { eventHandler } from "@/client/lib/eventHandler";
import { useConnection, useNotification } from "@/client/providers";
import { ListX } from "lucide-react";
import { TracingTable } from "./Table";
import { HistoryProvider, HistoryTab, useHistory } from "./providers";

export default function HistoryPage() {
  return (
    <HistoryProvider>
      <HistoryPanel />
    </HistoryProvider>
  );
}

function HistoryPanel() {
  const { tab, changeTab } = useHistory();

  return (
    <div className="p-4 size-full">
      <Tabs
        value={tab.value}
        onValueChange={(value) => changeTab(value as HistoryTab)}
        className="size-full"
      >
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger
              value={HistoryTab.HISTORY}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value={HistoryTab.NOTIFICATIONS}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value={HistoryTab.ERRORS}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Errors
            </TabsTrigger>
          </TabsList>
          <PageHeader />
        </div>
        <div className="size-full flex flex-col gap-4 overflow-y-auto">
          <TracingTable />
        </div>
      </Tabs>
    </div>
  );
}

function PageHeader() {
  const { tab } = useHistory();
  const { clearNotifications, clearStdErrNotifications } = useNotification();
  const { setRequestHistory } = useConnection();

  const onClear = eventHandler(() => {
    switch (tab.value) {
      case HistoryTab.HISTORY:
        setRequestHistory([]);
        break;
      case HistoryTab.NOTIFICATIONS:
        clearNotifications();
        break;
      case HistoryTab.ERRORS:
        clearStdErrNotifications();
        break;
    }
  });

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-max has-[>svg]:px-1.5 py-1.5"
            onClick={onClear}
            onKeyDown={onClear}
          >
            <ListX className="size-4 stroke-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear all traces</TooltipContent>
      </Tooltip>
    </div>
  );
}
