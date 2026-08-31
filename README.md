# Court Scoreboard

A live court scoreboard you can put on a TV — two teams, points and sets, serve, match time, and a sponsor strip — without buying a hardware board or standing up a backend.

Built for clubs, court operators, and match-day crews who need the audience looking at a real board while someone at the table is actually running the match.

- Full-screen display with team names, logos, scores, sets, match clock, and who is serving
- Admin panel to bump points, switch serve, run or pause the timer, and reset a game or the whole match
- Sponsor carousel on the board — upload the logos, they loop under the score
- Players, lineups, and a live event feed on the board (goals, cards, substitutions, timeouts, injuries)

**Try it:** [court-scoreboard.vercel.app](https://court-scoreboard.vercel.app)

Open the board at `/` and the controls at `/admin` in two tabs of the **same browser**. Full-screen the display onto the court screen; keep admin in front of the scorer. Players and lineups live at `/admin/players`.

## Run it locally

No login, no database — just Node and a browser.

```bash
npm install
npm run dev
```

- Display: [http://localhost:5173](http://localhost:5173)
- Admin: [http://localhost:5173/admin](http://localhost:5173/admin)
- Players: [http://localhost:5173/admin/players](http://localhost:5173/admin/players)

To put it on your own domain, ship it as a static site (`vercel.json` already handles SPA routing) or follow the Docker + Nginx notes in [`QUICKSTART_DEPLOYMENT.md`](QUICKSTART_DEPLOYMENT.md).

---

[MaVoid](https://mavoid.com) · [LinkedIn](https://linkedin.com/in/ziad-ahmed-634202332) · [GitHub](https://github.com/Ziad-NasrEldin)
