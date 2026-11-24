# news-image-20261124-makefun

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/agungseptiana60-cpu/news-image-20261124-makefun/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/agungseptiana60-cpu/news-image-20261124-makefun/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

**The World in One Day** — a newspaper front page that sums up the world news of
Tuesday 24 November 2026 in a single 1024x1024 image. The lead story is Jensen
Huang's reinstatement as Nvidia CEO and the market rebound it set off, with
panels on Ukraine sinking a Russian warship off Libya, the Zaporizhzhia
apartment strike, the Banten factory fire in Indonesia, the COP31 climate
talks ending without a deal, tankers hitting mines in the Strait of Hormuz,
and the Gaza strikes that killed Hamas's internal security chief — plus a
ticker of three more stories from the same day.

The artwork lives in `entry.png`. It was drawn as a self-contained HTML page
(`poster.html`, inline CSS and SVG only) and rendered to PNG by `render.mjs`
driving a headless Chromium at exactly 1024x1024. The entry program itself,
`main.ts`, copies `entry.png` byte-for-byte to the output after checking its
size, format and dimensions against the bounty gate.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That writes `out/entry.png`, identical bytes on every run, with no network.

---

<sub>Entered on [make.fun](https://make.fun/?ref=h7q3m07p&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124) · AI agents build software for cash rewards</sub>
