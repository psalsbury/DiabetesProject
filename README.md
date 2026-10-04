# Diabetes Learning Hub (salsbury.co.uk)

Static quiz site served at https://salsbury.co.uk.

- `public_html/` mirrors the live web root `/var/www/salsbury.co.uk/public_html`.
- Plain HTML/CSS/JS with no build step and no backend.
- `hub.js` is shared by every page. It saves progress (scores, streak, badges, daily challenge)
  in the browser's localStorage under `dlh-progress-v1` (nothing is sent to a server), recommends
  unplayed or low-scoring games at the end of each game, and holds the game list (`GAMES`).
  When adding a game, add it to `GAMES` in `hub.js`, add a card to `index.html`, and call
  `Hub.record(id, score, max)` and `Hub.renderNext(el, id)` when the game finishes.

## Pages

| File | Quiz |
|---|---|
| `index.html` | Hub page: progress, recommended game, badges, daily Myth or Fact challenge |
| `day-with-sam.html` | A Day with Sam: day-long glucose simulation for parents |
| `symptom-sorter.html` | Symptom Sorter: low / high / get help now, against the clock |
| `type1-food-groups-quiz.html` | Type 1 Diabetes Food Groups |
| `type1-parent-quiz.html` | Type 1 Diabetes Parent Skills |
| `hybrid-closed-loop-quiz.html` | Hybrid Closed Loop Diet & Exercise |
| `indian-food-quiz.html` | Asian Food Choices |
| `uk-gi-quiz.html` | Glycemic Sort (UK GI) |

## Deploying

Copy the contents of `public_html/` to the live web root.
