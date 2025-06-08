'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiUser } from 'react-icons/fi';
import { fetchTeamLeads } from '@/store/features/projectonboardingSlice';

export default function TeamLeadSelect({ value, onChange }) {
  const dispatch = useDispatch();
  const { teamLeads, loading, error } = useSelector((state) => ({
    teamLeads: state.projectOnboarding.teamLeads,
    loading: state.projectOnboarding.loading.teamLeads,
    error: state.projectOnboarding.error.teamLeads
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchTeamLeads());
  }, [dispatch]);

  const filteredTeamLeads = Array.isArray(teamLeads) ? teamLeads.filter(lead =>
    (lead.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (lead.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (lead.employeeID?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  ) : [];

  const selectedTeamLead = Array.isArray(teamLeads) ? teamLeads.find(lead => lead.employeeID === value) : null;



  const handleSelect = (teamLead) => {
    if (onChange && teamLead) {
      onChange({
        teamLeadId: teamLead.employeeID,
        teamLeadName: `${teamLead.firstName} ${teamLead.lastName}`
      });
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 hover:border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer flex items-center justify-between bg-white"
      >
        <div className="flex items-center gap-2">
          <FiUser className="text-gray-600" />
          <span className="text-black font-medium">{selectedTeamLead ? `${selectedTeamLead.firstName} ${selectedTeamLead.lastName}` : 'Select Team Lead'}</span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <div className="p-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Search team leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 hover:border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black bg-white"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredTeamLeads.map((teamLead) => (
              <div
                key={teamLead.employeeID}
                onClick={() => handleSelect(teamLead)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors text-black"
              >
                <div className="font-medium text-black">{`${teamLead.firstName} ${teamLead.lastName}`}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-black">{teamLead.employeeID}</span>
                
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}





