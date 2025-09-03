import axios from 'axios';

test('POST /create-room -> Should create a room without gameType', async () => {
    const res = await axios.post('http://localhost:3000/create-room', {});
    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty('roomCode');
    expect(typeof res.data.roomCode).toBe('string');
    expect(res.data.roomCode).toHaveLength(6);

    expect(res.data).toHaveProperty('roomInfo');
    expect(res.data.roomInfo).toMatchObject({
        minPlayer: expect.any(Number),
        maxPlayer: expect.any(Number),
        gameDuration: expect.any(Number),
        roomRestriction: expect.any(String),
    });
});

test('POST /create-room -> Should create a room with gameType toggle', async () => {
    const res = await axios.post('http://localhost:3000/create-room', {
        gameType: 'toggle',
        soloGame: true,
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('roomCode');
    expect(typeof res.data.roomCode).toBe('string');

    expect(res.data.roomInfo.roomRestriction).toBe('ToggleCommand');
    expect(res.data.roomInfo.minPlayer).toBeGreaterThanOrEqual(1);
    expect(res.data.roomInfo.maxPlayer).toBeGreaterThanOrEqual(res.data.roomInfo.minPlayer);
    expect(res.data.roomInfo.gameDuration).toBeGreaterThan(0);
});

test('POST /create-room -> Should create a room with gameType slider', async () => {
    const res = await axios.post('http://localhost:3000/create-room', {
        gameType: 'slider',
        soloGame: false,
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('roomCode');
    expect(typeof res.data.roomCode).toBe('string');

    expect(res.data.roomInfo.roomRestriction).toBe('SliderCommand');
    expect(res.data.roomInfo.minPlayer).toBeGreaterThanOrEqual(1);
    expect(res.data.roomInfo.maxPlayer).toBeGreaterThanOrEqual(res.data.roomInfo.minPlayer);
    expect(res.data.roomInfo.gameDuration).toBeGreaterThan(0);
});

test('POST /create-room -> Should fail with invalid gameType', async () => {
    try {
        await axios.post('http://localhost:3000/create-room', {
            gameType: 'invalid',
        });
        throw new Error('Request should have failed');
    } catch (err: any) {
        expect(err.response.status).toBe(400);
        expect(err.response.data).toEqual({
            error: 'Invalid gameType. Must be either "toggle" or "slider"',
        });
    }
});

test('POST /create-room -> Should fail with invalid soloGame type', async () => {
    try {
        await axios.post('http://localhost:3000/create-room', {
            gameType: 'toggle',
            soloGame: "not-a-boolean",
        });
        throw new Error('Request should have failed');
    } catch (err: any) {
        expect(err.response.status).toBe(400);
        expect(err.response.data).toEqual({
            error: 'Invalid soloGame. Must be a boolean',
        });
    }
});

test('POST /create-room -> Should create a soloGame room with min/max players = 1', async () => {
    const res = await axios.post('http://localhost:3000/create-room', {
        gameType: 'toggle',
        soloGame: true,
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('roomInfo');

    const roomInfo = res.data.roomInfo;
    expect(roomInfo.minPlayer).toBe(1);
    expect(roomInfo.maxPlayer).toBe(1);
    expect(roomInfo.roomRestriction).toBe('ToggleCommand');
});
