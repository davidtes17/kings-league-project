import { Hono } from 'hono';
import leaderboard from '../db/leaderboard.json'

const app = new Hono();

app.get('/', (ctx) => {
	return ctx.json([
		{
			endpoint: '/leaderboard',
			method: 'GET',
			description: 'Returns the leaderboard'
		}
	]);
})

app.get('/leaderboard', (ctx) => {
	return ctx.json(leaderboard);
})

export default app