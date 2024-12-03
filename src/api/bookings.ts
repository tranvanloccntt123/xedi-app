let bookings = [];

export const createBookingApi = async (booking) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newBooking = {
    ...booking,
    id: Date.now().toString(),
    status: "confirmed",
  };
  bookings.push(newBooking);
  return newBooking;
};

export const fetchBookingsApi = async () => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  return bookings;
};

