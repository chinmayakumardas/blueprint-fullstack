"use client";

import ViewProject from "@/components/project/AssignedProjectsView";
import React from "react";
import { use } from "react";

export default function Page() {
  const resolvedParams = use(params);
  return (
    <>
      <div className="px-4 lg:px-6">
        <ViewProject projectId={resolvedParams.id} />
      </div>
    </>
  );
}
