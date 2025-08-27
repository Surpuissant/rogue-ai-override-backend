import axios from 'axios';

test('GET /health -> Verify if server can response if he is alive or not', async () => {
    const res = await axios.get('http://localhost:3000/health');
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Server is alive !' });
});