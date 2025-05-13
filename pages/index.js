import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

const CATEGORY_EXPIRY = {
  "Fee earning": null,
  "Marketing": 14,
  "Business development": 14,
  "Team support": 14,
  "Business management": 14,
  "Personal": 14,
};

const getExpiryDate = (days) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

export default function ExpiringTodoApp() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("");
  const [customDays, setCustomDays] = useState(14);
  const [tasks, setTasks] = useState([]);
  const [showExpired, setShowExpired] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("expiringTasks") || "[]");
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTasks((prev) => {
        const filtered = prev.filter((t) => {
          if (t.category === "Fee earning") return true;
          return new Date(t.expiresAt) > now;
        });
        localStorage.setItem("expiringTasks", JSON.stringify(filtered));
        return filtered;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    if (!task.trim() || !category) return;
    const expiryDays = category === "Fee earning" ? null : customDays;
    const expiresAt = expiryDays !== null ? getExpiryDate(expiryDays).toISOString() : null;
    const newTasks = [
      ...tasks,
      { text: task, category, expiresAt },
    ];
    setTasks(newTasks);
    localStorage.setItem("expiringTasks", JSON.stringify(newTasks));
    setTask("");
    setCategory("");
    setCustomDays(14);
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    localStorage.setItem("expiringTasks", JSON.stringify(newTasks));
  };

  const isUrgentFeeEarning = (task) => {
    if (task.category !== "Fee earning" || !task.expiresAt) return false;
    const overdue = new Date(task.expiresAt) < new Date();
    return overdue;
  };

  const expiredTasks = tasks.filter(
    (t) => t.expiresAt && new Date(t.expiresAt) < new Date() && t.category !== "Fee earning"
  );

  const activeTasks = tasks.filter(
    (t) =>
      (t.category === "Fee earning" || !t.expiresAt || new Date(t.expiresAt) > new Date()) &&
      (filterCategory === "all" || t.category === filterCategory)
  );

  const sortedTasks = [...(showExpired ? expiredTasks : activeTasks)].sort((a, b) => {
    if (sortOption === "category") {
      return a.category.localeCompare(b.category);
    }
    if (sortOption === "expiry") {
      return new Date(a.expiresAt || 0) - new Date(b.expiresAt || 0);
    }
    return 0;
  });

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4 bg-[#f3efe7] text-[#232d59] p-4 rounded-xl shadow-lg">
      <Card className="bg-white border border-[#cdae34]">
        <CardContent className="p-4 space-y-2">
          <h2 className="text-xl font-bold text-[#424d77]">Expiring To-Do List</h2>
          <div className="flex flex-col gap-2">
            <Input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Add a task"
              className="border-[#424d77]"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full border-[#424d77]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(CATEGORY_EXPIRY).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {category && category !== "Fee earning" && (
              <Input
                type="number"
                min="1"
                value={customDays}
                onChange={(e) => setCustomDays(parseInt(e.target.value))}
                placeholder="Days until expiry (default 14)"
                className="border-[#424d77]"
              />
            )}
            <Button onClick={addTask} className="bg-[#cdae34] text-[#232d59] hover:bg-[#a08d50]">Add</Button>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full border-[#424d77]">
                <SelectValue placeholder="Filter by category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.keys(CATEGORY_EXPIRY).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full border-[#424d77]">
                <SelectValue placeholder="Sort by (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="expiry">Expiry date</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => setShowExpired(!showExpired)} className="border-[#424d77] text-[#232d59]">
              {showExpired ? "Hide" : "Show"} Expired
            </Button>
          </div>

          <ul className="space-y-2 mt-2">
            {sortedTasks.map((t, i) => (
              <li
                key={i}
                className={`flex justify-between items-center p-2 rounded ${isUrgentFeeEarning(t) ? 'bg-red-200' : 'bg-[#f3efe7]'} border border-[#cdae34]`}
              >
                <div>
                  <span className="font-semibold text-[#424d77]">[{t.category}]</span> {t.text}
                </div>
                <Button variant="outline" onClick={() => removeTask(i)} className="text-[#232d59] border-[#cdae34]">
                  Done
                </Button>
              </li>
            ))}
            {sortedTasks.length === 0 && (
              <p className="text-sm text-gray-500">No tasks to show.</p>
            )}
          </ul>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-[#424d77] mb-2">Calendar View (Deadlines)</h3>
            <Calendar
              mode="multiple"
              selected={tasks.filter(t => t.expiresAt).map(t => new Date(t.expiresAt))}
              className="rounded border border-[#cdae34] text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
