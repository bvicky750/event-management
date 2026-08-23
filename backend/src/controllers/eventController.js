export const getAllEvents = (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'evt-1',
        title: 'Tech Symposium 2026',
        category: 'Technical',
        date: '2026-09-15',
        location: 'Main Auditorium',
      },
    ],
  });
};

export const getEventById = (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    data: {
      id,
      title: 'Tech Symposium 2026',
      category: 'Technical',
      date: '2026-09-15',
      location: 'Main Auditorium',
    },
  });
};
