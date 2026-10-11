# Vendored site fonts

The site uses `next/font/local` so builds never request Google Fonts CSS or font files.
Google can return extensionless `/l/font?kit=…&skey=…` URLs; Next.js 16.3.8 Turbopack
misparses those URLs and fails with `next/font/google queries have exactly one entry`.
See [upstream issue #99114](https://github.com/vercel/next.js/issues/99114).

These are the same font versions previously served by `next/font/google`:

| File                     | Version | Weight range | Style  |
| ------------------------ | ------- | ------------ | ------ |
| RobotoSlab.woff2         | 2.002   | 200–500      | normal |
| RobotoSerif.woff2        | 1.008   | 300–500      | normal |
| RobotoSerif-Italic.woff2 | 1.008   | 300–500      | italic |
| RobotoMono.woff2         | 3.001   | 300–500      | normal |

Roboto Serif keeps Google's default `opsz=14`, `wdth=100`, `GRAD=0` axes.
The subset includes Latin, Latin Extended, Vietnamese, combining accents and the
punctuation/symbols used by Google's corresponding subsets. Other scripts use the
existing CSS fallback. Font variables, `display: swap`, fallback families and
preload policy remain in `app/layout.tsx`; only Roboto Slab is preloaded.

## Sources and licenses

Downloaded on 2026-10-11 from the official
[google/fonts revision `bd8f81ddb5c7`](https://github.com/google/fonts/tree/bd8f81ddb5c74d5c8897b36ad88b440266245103):

- [Roboto Slab](https://github.com/google/fonts/tree/bd8f81ddb5c74d5c8897b36ad88b440266245103/apache/robotoslab): Apache 2.0, retained in `licenses/RobotoSlab-LICENSE.txt`.
- [Roboto Serif](https://github.com/google/fonts/tree/bd8f81ddb5c74d5c8897b36ad88b440266245103/ofl/robotoserif): SIL OFL 1.1, retained in `licenses/RobotoSerif-OFL.txt`.
- [Roboto Mono](https://github.com/google/fonts/tree/bd8f81ddb5c74d5c8897b36ad88b440266245103/ofl/robotomono): SIL OFL 1.1, retained in `licenses/RobotoMono-OFL.txt`.

## Regenerating

Use Python with `fonttools[woff]==4.66.1` and `brotli==1.2.0` in a temporary virtual
environment. Download the four TTF files from the pinned revision above into an
`upstream/` directory, preserving the `apache/` and `ofl/` paths below. Then run this
from the repository root. This tooling is needed only for regeneration, not builds.

```python
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib.instancer import instantiateVariableFont

sources = [
    ('apache/robotoslab/RobotoSlab[wght].ttf', 'RobotoSlab.woff2', {'wght': (200, 400, 500)}),
    ('ofl/robotoserif/RobotoSerif[GRAD,opsz,wdth,wght].ttf', 'RobotoSerif.woff2', {'wght': (300, 400, 500), 'opsz': 14, 'wdth': 100, 'GRAD': 0}),
    ('ofl/robotoserif/RobotoSerif-Italic[GRAD,opsz,wdth,wght].ttf', 'RobotoSerif-Italic.woff2', {'wght': (300, 400, 500), 'opsz': 14, 'wdth': 100, 'GRAD': 0}),
    ('ofl/robotomono/RobotoMono[wght].ttf', 'RobotoMono.woff2', {'wght': (300, 400, 500)}),
]
root = Path('upstream')
target = Path('app/fonts')
target.mkdir(exist_ok=True)
for source, name, axes in sources:
    font = TTFont(root / source)
    options = subset.Options()
    options.layout_features = ['*']
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=subset.parse_unicodes('0000-02FF,0300-0301,0303-0304,0308-0309,0323,0329,1D00-1DBF,1E00-1EFF,2000-206F,20A0-20C4,2113,2122,2191,2193,2212,2215,2C60-2C7F,A720-A7FF,FEFF,FFFD'))
    subsetter.subset(font)
    font = instantiateVariableFont(font, axes, inplace=True)
    font.flavor = 'woff2'
    font.save(target / name)
    print(name, (target / name).stat().st_size, flush=True)
```
