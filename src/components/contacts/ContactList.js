'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate dummy data
  useEffect(() => {
    const dummyContacts = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
      phone: `555-010${String(i + 1).padStart(2, '0')}`,
      status: i % 2 === 0 ? 'active' : 'inactive',
      feedback: '',
    }));
    setContacts(dummyContacts);
    setFilteredContacts(dummyContacts);
  }, []);

  // Filter and sort contacts
  useEffect(() => {
    let result = contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      const valA = a[sortKey].toLowerCase();
      const valB = b[sortKey].toLowerCase();
      return sortOrder === 'asc' ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
    });

    setFilteredContacts(result);
    setCurrentPage(1);
  }, [searchTerm, sortKey, sortOrder, filterStatus, contacts]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    setIsModalOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedContact = {
      ...selectedContact,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      status: formData.get('status'),
      feedback: formData.get('feedback'),
    };

    setContacts(
      contacts.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact))
    );
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact List</h1>

      {/* Search and Filter */}
      <div className="mb-4 flex gap-4">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
          value={filterStatus}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Contact Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 cursor-pointer" onClick={() => handleSort('name')}>
              Name{' '}
              {sortKey === 'name' &&
                (sortOrder === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </th>
            <th className="border p-2 cursor-pointer" onClick={() => handleSort('email')}>
              Email{' '}
              {sortKey === 'email' &&
                (sortOrder === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedContacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-100">
              <td className="border p-2">{contact.name}</td>
              <td className="border p-2">{contact.email}</td>
              <td className="border p-2">{contact.phone}</td>
              <td className="border p-2">{contact.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleView(contact)}
                  className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>

          {selectedContact && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  defaultValue={selectedContact.name}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={selectedContact.email}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  name="phone"
                  defaultValue={selectedContact.phone}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  defaultValue={selectedContact.status}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                <textarea
                  name="feedback"
                  defaultValue={selectedContact.feedback}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  rows={4}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="destructive" type="button" onClick={() => handleDelete(selectedContact.id)}>
                  Delete
                </Button>
                <Button type="submit" variant="default">
                  Save
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
