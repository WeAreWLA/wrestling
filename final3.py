from PIL import Image, ImageFilter

im = Image.open('VICTORY_quills.png').convert('RGB')
px = im.load()
WHITE = (250, 250, 250)

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
def skin(lum):
    t = max(0.0, min(1.0, (lum - 55) / 150.0))
    return lerp((122, 80, 56), (250, 224, 194), t)
def isred(r, g, b): return r > 120 and r > g + 45 and r > b + 35

# 1) clear the whole quill zone above the head dome
for y in range(58, 84):
    for x in range(81, 111):
        px[x, y] = WHITE

# 2) recolor body lavender -> human skin
for y in range(58, 121):
    for x in range(72, 149):
        r, g, b = px[x, y]
        if b > r + 12 and b > g + 9 and (r + g + b) > 150 and not isred(r, g, b):
            px[x, y] = skin((r + g + b) / 3.0)

# ---------- brown hair / beard ----------
HI = (154, 116, 78); MID = (112, 80, 52); DK = (50, 34, 20)

def scallop(xs, xe, topbase, topcurve, base, period, phase, depth, hiph=0):
    cx = (xs + xe) / 2.0
    half = (xe - xs) / 2.0
    for x in range(xs, xe + 1):
        top = topbase + int(((x - cx) / half) ** 2 * topcurve)
        ph = ((x - xs + phase) % period) / period
        d = int(round(depth * (1 - abs(ph - 0.5) * 2)))
        ybot = base + d
        for y in range(top, ybot + 1):
            if y == ybot:
                c = DK
            elif (x + hiph) % 4 == 0:
                c = HI
            else:
                c = MID
            px[x, y] = c

# two layered rows of downward locks
scallop(84, 109, 76, 5, 83, 6, 0, 3)        # upper layer
scallop(85, 108, 81, 4, 88, 6, 3, 3, hiph=2)  # lower layer (points down)

# a lock draping down the back-left
for x in range(83, 92):
    base = 95 - (x - 83)
    for y in range(82, base + 1):
        px[x, y] = DK if y == base else (HI if x % 4 == 0 else MID)

# beard on the jaw / chin
def beard(xs, xe, top, base, depth):
    for x in range(xs, xe + 1):
        ph = ((x - xs) % 4) / 4.0
        d = int(round(depth * (1 - abs(ph - 0.5) * 2)))
        ybot = base + d
        for y in range(top, ybot + 1):
            px[x, y] = DK if y == ybot else (HI if x % 4 == 0 else MID)
beard(108, 125, 91, 96, 3)

# clean the cleared white block + stray specks above the hair -> match bg
for y in range(56, 81):
    bg = px[73, y]
    for x in range(81, 116):
        r, g, b = px[x, y]
        whiteish = r > 233 and g > 233 and b > 227
        stray = (x >= 105 and y <= 74) and (r > 80 and r > b + 8 and g < r and r < 205)
        if whiteish or stray:
            px[x, y] = bg

# soften head + face region
reg = (78, 58, 130, 104)
im.paste(im.crop(reg).filter(ImageFilter.GaussianBlur(0.4)), reg)

im.save('VICTORY_human.png')
print('saved')
