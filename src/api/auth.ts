export const loginApi = async ({ email, password }) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email === 'user@example.com' && password === 'password') {
    return {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
    };
  } else {
    throw new Error('Invalid credentials');
  }
};

