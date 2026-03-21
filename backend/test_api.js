async function testApi() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
    });
    const { token } = await loginRes.json();

    const getUpcoming = await fetch('http://localhost:5000/api/movie-nights?status=upcoming', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('UPCOMING Status:', getUpcoming.status);
    console.log('UPCOMING Data:', await getUpcoming.json());

    const getPast = await fetch('http://localhost:5000/api/movie-nights?status=past', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('PAST Status:', getPast.status);
    console.log('PAST Data:', await getPast.json());

  } catch (err) {
    console.error('Test API Error:', err);
  }
}

testApi();
