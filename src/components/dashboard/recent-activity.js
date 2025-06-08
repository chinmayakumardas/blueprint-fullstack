"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  deleteNotification,
  deleteAllNotifications,
  markAsRead,
  markAllAsRead,
} from "@/store/features/notificationSlice";
import { useEffect } from "react";

export function RecentActivity() {
  const dispatch = useDispatch();
  const {
    items: notifications,
    status,
    error: notificationError,
  } = useSelector((state) => state.notifications) || { items: [] };
    const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {};

const recipientId = employeeData?.employeeID ;
  useEffect(() => {
    dispatch(fetchNotifications(recipientId));
  }, [dispatch, recipientId]);
 
  const activities =notifications;
  console.log(activities)
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          {/* <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar> */}
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.message}</span>{" "}
              <span className="text-muted-foreground">{activity.read}</span>{" "}
             
            </p>
            <p className="text-xs text-muted-foreground">{activity.createdAt}</p>
          </div>
        </div>
      ))}
    </div>
  );
}