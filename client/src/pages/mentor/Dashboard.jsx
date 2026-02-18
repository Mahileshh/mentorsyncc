import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiClock,
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSearch,
  FiMoreVertical,
  FiMessageSquare,
  FiBell,
  FiUser
} from 'react-icons/fi';

const MentorDashboard = () => {
  const navigate = useState();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - mentor's students
  const students = [
    {
      id: 1,
      name: 'David',
      batch: 'CB 2023',
      email: 'david.cb23@bitsathy.ac.in',
      attendance: 86,
      rp: 145,
      placementStatus: 'Mentor Verified',
      status: 'good',
      lastMeeting: '2 days ago',
      avatar: 'D'
    },
    {
      id: 2,
      name: 'Kumaran',
      batch: 'CS 2024',
      email: 'kumaran.cs24@bitsathy.ac.in',
      attendance: 92,
      rp: 98,
      placementStatus: 'Not Applied',
      status: 'good',
      lastMeeting: '5 days ago',
      avatar: 'K'
    },
    {
      id: 3,
      name: 'Priya',
      batch: 'EC 2023',
      email: 'priya.ec23@bitsathy.ac.in',
      attendance: 68,
      rp: 132,
      placementStatus: 'Pending Mentor',
      status: 'warning',
      lastMeeting: '7 days ago',
      avatar: 'P'
    },
    {
      id: 4,
      name: 'Arjun',
      batch: 'ME 2023',
      email: 'arjun.me23@bitsathy.ac.in',
      attendance: 72,
      rp: 87,
      placementStatus: 'Officially Placed',
      status: 'success',
      lastMeeting: '1 day ago',
      avatar: 'A'
    },
    {
      id: 5,
      name: 'Sneha',
      batch: 'CB 2024',
      email: 'sneha.cb24@bitsathy.ac.in',
      attendance: 95,
      rp: 112,
      placementStatus: 'Not Applied',
      status: 'good',
      lastMeeting: '3 days ago',
      avatar: 'S'
    }
  ];

  // Pending leave requests
  const pendingLeaves = [
    {
      id: 1,
      student: 'David',
      batch: 'CB 2023',
      fromDate: '18 Feb 2026',
      toDate: '20 Feb 2026',
      reason: 'Sick leave',
      type: 'Sick'
    },
    {
      id: 2,
      student: 'Priya',
      batch: 'EC 2023',
      fromDate: '19 Feb 2026',
      toDate: '19 Feb 2026',
      reason: 'OD - Hackathon',
      type: 'OD'
    }
  ];

  // Stats cards
  const stats = [
    { label: 'Total Students', value: '15', icon: FiUsers },
    { label: 'Pending Leaves', value: '3', icon: FiClock },
    { label: 'Avg RP', value: '114', icon: FiAward },
    { label: 'Placed', value: '4', icon: FiBriefcase }
  ];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-medium text-gray-800">Mentor Dashboard</h1>
            <span className="text-sm text-gray-400">Prof. Sharma</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <FiBell size={20} />
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <FiUser className="text-gray-600" size={18} />
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-5 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-medium text-gray-800 mt-1">{stat.value}</p>
                </div>
                <stat.icon className="text-gray-400" size={24} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Students List */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-gray-800">My Students</h2>
                  <span className="text-sm text-gray-400">15 total</span>
                </div>
                <div className="mt-3 relative">
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name or batch"
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => navigate(`/mentor/students/${student.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                          student.status === 'warning' ? 'bg-yellow-500' :
                          student.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          {student.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-800">{student.name}</span>
                            <span className="text-xs text-gray-400">{student.batch}</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">RP: {student.rp}</span>
                            <span className={`text-xs ${
                              student.attendance < 75 ? 'text-red-500' : 'text-green-600'
                            }`}>
                              Att: {student.attendance}%
                            </span>
                            <span className="text-xs text-gray-400">{student.lastMeeting}</span>
                          </div>
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              student.placementStatus === 'Officially Placed' ? 'bg-green-100 text-green-700' :
                              student.placementStatus === 'Pending Mentor' ? 'bg-yellow-100 text-yellow-700' :
                              student.placementStatus === 'Mentor Verified' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {student.placementStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiMoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Leaves */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-gray-800">Leave Requests</h2>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                    {pendingLeaves.length} pending
                  </span>
                </div>
              </div>
              <div>
                {pendingLeaves.map((leave) => (
                  <div key={leave.id} className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium text-gray-800">{leave.student}</span>
                        <span className="text-xs text-gray-400 ml-2">{leave.batch}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        leave.type === 'Sick' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {leave.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                    <div className="flex items-center text-xs text-gray-400 mb-3">
                      <FiCalendar className="mr-1" size={14} />
                      {leave.fromDate} - {leave.toDate}
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-50 text-green-600 py-1.5 rounded text-xs font-medium hover:bg-green-100 transition">
                        Approve
                      </button>
                      <button className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-xs font-medium hover:bg-red-100 transition">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
                {pendingLeaves.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No pending requests
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity - Optional small section */}
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Updates</h3>
              <div className="space-y-3">
                <div className="text-xs">
                  <span className="text-gray-800">Arjun</span>
                  <span className="text-gray-400 ml-2">placement verified</span>
                  <p className="text-gray-400 mt-1">2 hours ago</p>
                </div>
                <div className="text-xs">
                  <span className="text-gray-800">Kumaran</span>
                  <span className="text-gray-400 ml-2">leave approved</span>
                  <p className="text-gray-400 mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;