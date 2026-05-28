const jwt = require('jsonwebtoken');

// Generate a token for the user ID from your screenshot
const token = jwt.sign({ id: '69f71700c0b75a0ca0b7ac00' }, 'carpoolsecretkey123', {
  expiresIn: '30d',
});

console.log('Generated Token:', token);

// Perform the PUT request to cancel the booking
fetch('http://localhost:5000/api/bookings/69f71bb813fc259cb306acf9/status', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'cancelled' })
})
.then(res => res.json())
.then(data => {
  console.log('Response from server:', data);
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
