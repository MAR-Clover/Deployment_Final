const request = require('supertest')
const app = require('../../../server/app')

test('Books an appointment', async () => {
    const res = await request(app)
    .post('/appointments')
    .send({ userId: 1, time: '2025-07-09T14:00:00' })
    expect(resizeBy.statusCode).toBe(200)
})