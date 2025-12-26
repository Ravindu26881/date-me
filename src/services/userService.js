const mockUsers = [
  {
    id: 1,
    username: 'alex_wanderer',
    age: 28,
    sex: 'male',
    sexualOrientation: 'heterosexual'
  },
  {
    id: 2,
    username: 'maya_sunrise',
    age: 25,
    sex: 'female',
    sexualOrientation: 'bisexual'
  },
  {
    id: 3,
    username: 'jordan_blue',
    age: 32,
    sex: 'non-binary',
    sexualOrientation: 'pansexual'
  },
  {
    id: 4,
    username: 'sophie_dreams',
    age: 27,
    sex: 'female',
    sexualOrientation: 'heterosexual'
  },
  {
    id: 5,
    username: 'mike_adventure',
    age: 30,
    sex: 'male',
    sexualOrientation: 'gay'
  },
  {
    id: 6,
    username: 'taylor_spark',
    age: 24,
    sex: 'female',
    sexualOrientation: 'lesbian'
  },
  {
    id: 7,
    username: 'chris_vibe',
    age: 29,
    sex: 'male',
    sexualOrientation: 'bisexual'
  },
  {
    id: 8,
    username: 'sam_horizon',
    age: 26,
    sex: 'non-binary',
    sexualOrientation: 'queer'
  }
];

export const getUsers = () => {
  return Promise.resolve(mockUsers);
};

export const getUserById = (id) => {
  const user = mockUsers.find(user => user.id === id);
  return Promise.resolve(user || null);
};

export default {
  getUsers,
  getUserById
};

