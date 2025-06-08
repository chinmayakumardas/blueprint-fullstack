'use client';

import { useState } from 'react';
import CpcTaskList from './CpcTaskList';
import EmployeeTaskList from './EmployeeTaskList';
import { useDispatch, useSelector } from "react-redux";


// Dummy tasks data
const dummyTasks = [
  {
    taskId: 1,
    taskName: 'Design Landing Page',
    projectId: 'P001',
    projectName: 'Website Redesign',
    assignee: 'John Doe',
    status: 'In Progress',
    dueDate: '2025-06-10',
    priority: 'High',
    teamLead: 'Jane Smith',
    teamLeadId: 'TL001',
  },
  {
    taskId: 2,
    taskName: 'Database Migration',
    projectId: 'P002',
    projectName: 'Backend Upgrade',
    assignee: 'Alice Johnson',
    status: 'Planned',
    dueDate: '2025-06-15',
    priority: 'Medium',
    teamLead: 'Bob Wilson',
    teamLeadId: 'TL002',
  },
  {
    taskId: 3,
    taskName: 'API Integration',
    projectId: 'P001',
    projectName: 'Website Redesign',
    assignee: 'John Doe',
    status: 'Completed',
    dueDate: '2025-05-20',
    priority: 'High',
    teamLead: 'Jane Smith',
    teamLeadId: 'TL001',
  },
  {
    taskId: 4,
    taskName: 'User Testing',
    projectId: 'P003',
    projectName: 'Mobile App',
    assignee: 'Emma Brown',
    status: 'In Progress',
    dueDate: '2025-06-05',
    priority: 'Low',
    teamLead: 'Bob Wilson',
    teamLeadId: 'TL002',
  },
];



export default function AllTaskListByRole() {
      const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {};


const currentUser = {
  role: "employee", // Change to 'employee' or 'team_lead' for testing
  // role: employeeData?.designation, // Change to 'employee' or 'team_lead' for testing
  name: employeeData?.name,
  teamLeadId: 'TL001', // Set to null for employees without team lead role
};
  return (
    <div className="">
      {currentUser.role === "cpc" ? (
        <CpcTaskList tasks={dummyTasks} currentUser={currentUser} />
      ) : (
        <EmployeeTaskList tasks={dummyTasks} currentUser={currentUser} />
      )}
    </div>
  );
}