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

app.get('/leaderboard/:id', (ctx) => {
	const id = ctx.req.param('id')
	const specificLeaderboard = leaderboard.find(item => item.team.id === id)
	
	return specificLeaderboard
		? ctx.json(specificLeaderboard)
		: ctx.json({ message: 'Team not found' }, 404)
})

app.get('/teams', (ctx) => {
	return ctx.json(teams)
})

app.get('/teams/:id', (ctx) => {
	const id = ctx.req.param('id')
	const team = teams.find(item => item.id === id)

	return team
		? ctx.json(team)
		: ctx.json({ message: 'Team not found' }, 404)
})

app.get('/presidents', (ctx) => {
	return ctx.json(presidents)
})

app.get('/presidents/:id', (ctx) => {
	const id = ctx.req.param('id')
	const president = presidents.find(item => item.id === id)

	return president
		? ctx.json(president)
		: ctx.json({ message: 'President not found' }, 404)
})

app.get('/static/*', serveStatic({ root: './' }))

export default app