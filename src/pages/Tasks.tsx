import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Calendar, User, AlertTriangle, CheckCircle2, Clock, Send,
} from "lucide-react";

interface Comment {
  author: string;
  date: string;
  text: string;
}

interface Task {
  id: string;
  name: string;
  client: string;
  assignee: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  description: string;
  comments: Comment[];
}

const TODAY = "2026-03-08";
const WEEK_START = "2026-03-02";

const sampleTasks: Task[] = [
  {
    id: "1", name: "Review campaign creatives", client: "BrightStar Media", assignee: "Priya Sharma",
    dueDate: "2026-03-06", priority: "High", completed: false,
    description: "Review and approve the Q2 campaign creative assets before sending to the client for final sign-off.",
    comments: [{ author: "Arjun Kapoor", date: "2026-03-05", text: "Uploaded the latest versions to the shared folder." }],
  },
  {
    id: "2", name: "Send revised proposal", client: "PixelForge Studios", assignee: "Arjun Kapoor",
    dueDate: "2026-03-05", priority: "High", completed: false,
    description: "Update pricing on the full-service digital campaign proposal and resend to client.",
    comments: [],
  },
  {
    id: "3", name: "Schedule onboarding call", client: "Zenith Brands", assignee: "Arjun Kapoor",
    dueDate: "2026-03-08", priority: "Medium", completed: false,
    description: "Set up the kickoff call with the Zenith Brands team for next week.",
    comments: [{ author: "Priya Sharma", date: "2026-03-07", text: "Client prefers Thursday afternoon." }],
  },
  {
    id: "4", name: "Prepare monthly report", client: "Crescendo Digital", assignee: "Priya Sharma",
    dueDate: "2026-03-08", priority: "Low", completed: false,
    description: "Compile February performance metrics and prepare the monthly report deck.",
    comments: [],
  },
  {
    id: "5", name: "Follow up on invoice #1042", client: "NovaAd Co.", assignee: "Priya Sharma",
    dueDate: "2026-03-10", priority: "Medium", completed: false,
    description: "Follow up with accounts on the overdue invoice from February.",
    comments: [],
  },
  {
    id: "6", name: "Update CRM contacts", client: "BrightStar Media", assignee: "Arjun Kapoor",
    dueDate: "2026-03-12", priority: "Low", completed: false,
    description: "Add new stakeholder contacts shared during last week's meeting.",
    comments: [],
  },
  {
    id: "7", name: "Send contract for signing", client: "Zenith Brands", assignee: "Arjun Kapoor",
    dueDate: "2026-03-04", priority: "High", completed: true,
    description: "Final contract sent and signed via DocuSign.",
    comments: [{ author: "Arjun Kapoor", date: "2026-03-04", text: "Done — signed copy received." }],
  },
  {
    id: "8", name: "Competitor analysis deck", client: "Crescendo Digital", assignee: "Priya Sharma",
    dueDate: "2026-03-03", priority: "Medium", completed: true,
    description: "Completed the competitive landscape analysis presentation.",
    comments: [],
  },
];

const teamMembers = [...new Set(sampleTasks.map((t) => t.assignee))];

const priorityColor: Record<string, string> = {
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function categorize(task: Task): "overdue" | "today" | "upcoming" {
  if (task.completed) return "upcoming";
  if (task.dueDate < TODAY) return "overdue";
  if (task.dueDate === TODAY) return "today";
  return "upcoming";
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [tab, setTab] = useState("all");
  const [filterMember, setFilterMember] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");

  const filtered = useMemo(() => {
    let list = tasks;
    if (tab === "my") list = list.filter((t) => t.assignee === "Priya Sharma");
    if (filterMember !== "all") list = list.filter((t) => t.assignee === filterMember);
    return list;
  }, [tasks, tab, filterMember]);

  const overdue = filtered.filter((t) => !t.completed && t.dueDate < TODAY);
  const dueToday = filtered.filter((t) => !t.completed && t.dueDate === TODAY);
  const upcoming = filtered.filter((t) => !t.completed && t.dueDate > TODAY);
  const completedThisWeek = filtered.filter((t) => t.completed && t.dueDate >= WEEK_START && t.dueDate <= TODAY);

  const toggleComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
    if (selectedTask?.id === id) setSelectedTask((s) => s ? { ...s, completed: !s.completed } : null);
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedTask) return;
    const comment: Comment = { author: "You", date: TODAY, text: newComment.trim() };
    setTasks((prev) => prev.map((t) => t.id === selectedTask.id ? { ...t, comments: [...t.comments, comment] } : t));
    setSelectedTask((s) => s ? { ...s, comments: [...s.comments, comment] } : null);
    setNewComment("");
  };

  const TaskRow = ({ task }: { task: Task }) => {
    const cat = categorize(task);
    const borderClass = cat === "overdue" ? "border-l-4 border-l-red-500" : cat === "today" ? "border-l-4 border-l-amber-400" : "";
    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors rounded-lg ${borderClass} ${task.completed ? "opacity-50" : ""}`}
        onClick={() => setSelectedTask(task)}
      >
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleComplete(task.id)}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium text-foreground truncate ${task.completed ? "line-through" : ""}`}>{task.name}</p>
          <p className="text-xs text-muted-foreground truncate">{task.client}</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          <User className="h-3 w-3" /> {task.assignee}
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          <Calendar className="h-3 w-3" /> {task.dueDate}
        </div>
        <Badge variant="outline" className={`text-[10px] shrink-0 ${priorityColor[task.priority]}`}>{task.priority}</Badge>
      </div>
    );
  };

  const SectionHeader = ({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) => (
    <div className="flex items-center gap-2 px-4 pt-4 pb-2">
      {icon}
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      <Badge variant="secondary" className="text-[10px]">{count}</Badge>
    </div>
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage and track team tasks</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 self-start">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{dueToday.length}</p>
              <p className="text-xs text-muted-foreground">Due Today</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{overdue.length}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedThisWeek.length}</p>
              <p className="text-xs text-muted-foreground">Completed This Week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="my">My Tasks</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={filterMember} onValueChange={setFilterMember}>
          <SelectTrigger className="w-48 h-9">
            <SelectValue placeholder="All Members" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members</SelectItem>
            {teamMembers.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task list */}
      <Card className="border-border">
        {overdue.length > 0 && (
          <>
            <SectionHeader title="Overdue" count={overdue.length} icon={<AlertTriangle className="h-3.5 w-3.5 text-red-500" />} />
            <div className="px-2">{overdue.map((t) => <TaskRow key={t.id} task={t} />)}</div>
          </>
        )}
        {dueToday.length > 0 && (
          <>
            <SectionHeader title="Due Today" count={dueToday.length} icon={<Clock className="h-3.5 w-3.5 text-amber-500" />} />
            <div className="px-2">{dueToday.map((t) => <TaskRow key={t.id} task={t} />)}</div>
          </>
        )}
        {upcoming.length > 0 && (
          <>
            <SectionHeader title="Upcoming" count={upcoming.length} icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />} />
            <div className="px-2">{upcoming.map((t) => <TaskRow key={t.id} task={t} />)}</div>
          </>
        )}
        {overdue.length === 0 && dueToday.length === 0 && upcoming.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">No tasks found</div>
        )}
      </Card>

      {/* Task detail side panel */}
      <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedTask && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedTask.completed}
                    onCheckedChange={() => toggleComplete(selectedTask.id)}
                    className="mt-1"
                  />
                  <div>
                    <SheetTitle className={`text-lg ${selectedTask.completed ? "line-through opacity-50" : ""}`}>{selectedTask.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{selectedTask.client}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`w-fit text-xs mt-2 ${priorityColor[selectedTask.priority]}`}>{selectedTask.priority} Priority</Badge>
              </SheetHeader>

              <div className="space-y-5">
                <section className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Assignee</p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{selectedTask.assignee}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{selectedTask.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium text-foreground">{selectedTask.completed ? "Completed" : categorize(selectedTask) === "overdue" ? "Overdue" : "Open"}</p>
                  </div>
                </section>

                <Separator />

                <section>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Description</h4>
                  <p className="text-sm text-foreground">{selectedTask.description}</p>
                </section>

                <Separator />

                <section>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Comments</h4>
                  {selectedTask.comments.length === 0 && (
                    <p className="text-xs text-muted-foreground mb-3">No comments yet</p>
                  )}
                  <div className="space-y-3 mb-4">
                    {selectedTask.comments.map((c, i) => (
                      <div key={i} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">{c.author}</span>
                          <span className="text-[10px] text-muted-foreground">{c.date}</span>
                        </div>
                        <p className="text-sm text-foreground">{c.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                    <Button size="icon" className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white h-10 w-10" onClick={addComment}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
