# Shenzhen Summit Front Page

[![news-image-20261118](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/quintana111/news-image-20261118/rank.svg)](https://make.fun/bounty/news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/quintana111/news-image-20261118/reward.svg)](https://make.fun/bounty/news-image-20261118)

One image summing up Wednesday 18 November 2026 in world news: a flat-SVG newspaper front page, "THE WORLD TODAY", with 35 stories across 6 continents — three lead panels (the Shenzhen summit, the escalating Gulf war, and the fall of the Kerch Bridge), nine small fact-graphic panels (Alaska, Nvidia, Gaza, COP31, measles, Ebola in DRC, the Siberia crash, the NSA outage, Yemen), a world map strip with 12 numbered pins on the right countries, a 23-item "Also Today" list, and a markets ticker footer. Every headline and figure comes from the day's reporting (AP, Reuters, Bloomberg, AFP, Al Jazeera, BBC, CNBC); the image is rendered deterministically with sharp and contains no AI-generated art.

## Run

```sh
# Re-render the front page (needs sharp; deterministic — two runs are byte-identical)
node ../news-image-20261118-work/compose-20261118.cjs

# Copy the entry image to /output/entry.png with sha256 verification
node main.ts
```

## Files

- `entry.png` — the entry image (1024×1024, PNG)
- `main.ts` — Node 22, stdlib only; copies `entry.png` to `/output/entry.png` and verifies byte-length + sha256 on read-back
