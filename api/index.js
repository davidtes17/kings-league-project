import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static.module';
import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'
import presidents from '../db/presidents.json'

const app = new Hono();

app.get('/', (ctx) => {
	return ctx.json([
		{
			endpoint: '/leaderboard',
			method: 'GET',
			description: 'Returns the leaderboard'
		},
		{
			endpoint: '/teams',
			method: 'GET',
			description: 'Returns the teams'
		},
		{
			endpoint: '/presidents',
			method: 'GET',
			description: 'Returns the presidents'
		}
	]);
})

app.get('/leaderboard', (ctx) => {
	return ctx.json(leaderboard)
})

app.get('/teams', (ctx) => {
	return ctx.json(teams)
})

app.get('/presidents', (ctx) => {
	return ctx.json(presidents)
})

app.get('/static/*', serveStatic({ root: './'}))

export default app