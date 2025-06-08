




'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamLeads } from "@/store/features/dashSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TeamMembers() {
  const dispatch = useDispatch();
  const { teamLeads, status, error } = useSelector((state) => state.dash);

  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;

  useEffect(() => {
    dispatch(fetchTeamLeads());
  }, [dispatch]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    const totalPages = Math.ceil((teamLeads?.data?.length || 0) / membersPerPage);
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Guard states
  if (status === 'loading') return <p>Loading team leads...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;
  if (!teamLeads?.data?.length) return <p>No team leads found.</p>;

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = teamLeads.data.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(teamLeads.data.length / membersPerPage);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {currentMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 border rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={member.avatar || "/placeholder-user.jpg"} alt={member.teamLeadName} />
                <AvatarFallback>
                  {member.teamLeadName?.split(" ").map((n) => n[0]).join("") || "NA"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{member.teamLeadName}</p>
                <p className="text-sm text-muted-foreground">{member.projectName || "Team Lead"}</p>
              </div>
            </div>
            <Badge variant={member.status === "active" ? "default" : "outline"}>
              {member.status === "active" ? "Active" : member.teamMembersCount || "Unknown"}
            </Badge>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 pt-2">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm pt-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
