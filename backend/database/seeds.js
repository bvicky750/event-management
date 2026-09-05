import bcrypt from 'bcryptjs';

export const getSeedData = () => {
  const staffPasswordHash = bcrypt.hashSync('staff123', 10);

  const users = [
    {
      id: 'staff_001',
      name: 'Dr. K. Ramanathan',
      email: 'staff@college.edu',
      password_hash: staffPasswordHash,
      role: 'staff',
      department: 'Computer Science and Engineering',
      phone: '+91 94432 10987',
      college: 'Paavai Engineering College',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      employee_id: 'EMP-CSE-104',
      designation: 'Associate Professor & Event Convener',
      cabin: 'CSE Block - Room 304',
      status: 'active'
    },
    {
      id: 'staff_002',
      name: 'Prof. S. Meenakshi',
      email: 'meenakshi.it@college.edu',
      password_hash: staffPasswordHash,
      role: 'staff',
      department: 'Information Technology',
      phone: '+91 94432 10988',
      college: 'Paavai Engineering College',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      employee_id: 'EMP-IT-082',
      designation: 'Assistant Professor (Sr. Gr)',
      cabin: 'IT Block - Room 201',
      status: 'active'
    },
    {
      id: 'staff_003',
      name: 'Dr. R. Balaji',
      email: 'balaji.ece@college.edu',
      password_hash: staffPasswordHash,
      role: 'staff',
      department: 'Electronics and Communication',
      phone: '+91 94432 10989',
      college: 'Paavai Engineering College',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      employee_id: 'EMP-ECE-045',
      designation: 'Professor & HOD',
      cabin: 'ECE Block - Room 102',
      status: 'active'
    }
  ];

  return { users };
};
