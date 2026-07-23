#!/usr/bin/env python3
"""Sample the dominant colours from the delivered artwork."""
from PIL import Image
import glob, collections

paths = sorted(glob.glob("site/assets/media/a*.jpeg"))
counter = collections.Counter()

for p in paths:
    im = Image.open(p).convert("RGB")
    im.thumbnail((120, 120))
    for px in im.getdata():
        # ignore near-white and near-black so we find real hues
        if sum(px) > 720 or sum(px) < 90:
            continue
        counter[tuple(v // 24 * 24 for v in px)] += 1

print(f"sampled {len(paths)} panels\n")
print("dominant colours:")
for (r, g, b), n in counter.most_common(14):
    print(f"  #{r:02X}{g:02X}{b:02X}   {n:>8,}")
