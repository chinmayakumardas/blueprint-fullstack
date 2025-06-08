

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { ProjectOverview } from "@/components/dashboard/project-overview";
import { TeamMembers } from "@/components/dashboard/team-members";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import UpcomingTasks from "@/components/dashboard/upcoming-tasks";
import { Chart } from "@/components/ui/chart";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProjects } from "@/store/features/fetchallProjectsSlice";
import { getAllTaskList } from "@/store/features/TaskSlice";


export default function CPCDashboardContainer() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { projects, status, error } = useSelector(
    (state) => state.fetchallProjects
  );
    const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {};
const currentUser = {
  role: employeeData?.designation, // Change to 'employee' or 'team_lead' for testing
  name: employeeData?.name,
 
};


  const { allTaskList } = useSelector((state) => state.task);
  console.log("Projects:", projects);

  useEffect(() => {
    toast({
      title: "Welcome back!",
      description: "You have 3 tasks due today",
    });
  }, []);
  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(getAllTaskList());
  }, [dispatch]);
  console.log("All Tasks:", allTaskList);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="mr-1 h-4 w-4 text-green-500" />;
      case "overdue":
        return <AlertTriangle className="mr-1 h-4 w-4 text-red-500" />;
      default:
        return <Clock className="mr-1 h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CPC Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userData?.fullName} Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTaskList.length}</div>
            <p className="text-xs text-muted-foreground">6 due today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+1 new this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ProjectOverview />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions from your team</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Team Leaders</CardTitle>
                <CardDescription>
                  Invited team leaders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamMembers />
              </CardContent>
            </Card>
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingTasks />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>
                Manage and monitor all your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {projects.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-lg font-medium">
                            {project.projectName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Client: {project.clientId}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          project.statusColor !== "default"
                            ? project.statusColor
                            : ""
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>

                    <Progress
                      value={project.progress}
                      className={project.progressBg || ""}
                    />

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>Due date:{project.endDate}</span>
                      </div>
                      <div>{project.progress}% complete</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                View and manage your assigned tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm font-medium text-muted-foreground">
                <div>Project Name</div>
                <div>Task</div>
                <div>Assigned By</div>
                <div>Assigned To</div>
                <div>Due Date</div>
                <div>Priority</div>
                <div>Status</div>
              </div>

              <div className="divide-y border-b">
                {allTaskList.map((task, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 items-center gap-4 py-3"
                  >
                    <div className="font-medium break-words">
                      {task.projectName}
                    </div>
                    <div className="font-medium break-words">{task.title}</div>
                    <div className="font-medium break-words">
                      {task.assignedBy}
                    </div>
                    <div className="font-medium break-words">
                      {task.assignedToName}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {getStatusIcon(task.status)}
                      <span className="whitespace-nowrap">
                        {new Date(task.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div>
                      <Badge className={task.priorityColor}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div>
                      {task.statusVariant === "outline" ? (
                        <Badge variant="outline">{task.status}</Badge>
                      ) : (
                        <Badge className={task.statusColor}>
                          {task.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>
                Team productivity and task completion metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Chart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
