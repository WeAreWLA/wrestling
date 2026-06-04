from PIL import Image, ImageFilter

im = Image.open('VICTORY_quills.png').convert('RGB')
px = im.load()
WHITE = (250, 250, 250)

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
def skin(lum):
    t = max(0.0, min(1.0, (lum - 55) / 150.0))
    return lerp((122, 80, 56), (250, 224, 194), t)
def isred(r, g, b): return r > 120 and r > g + 45 and r > b + 35

# 1) clear the quill zone above the head dome
for y in range(58, 84):
    for x in range(81, 111):
        px[x, y] = WHITE

# 2) recolor body lavender -> human skin
for y in range(58, 121):
    for x in range(72, 149):
        r, g, b = px[x, y]
        if b > r + 12 and b > g + 9 and (r + g + b) > 150 and not isred(r, g, b):
            px[x, y] = skin((r + g + b) / 3.0)

# ---------- dark navy long hair (hat removed, hair filled in) ----------
HI = (98, 102, 134); MID = (50, 56, 90); SH = (30, 34, 56); DK = (14, 16, 30)

cx = 96.0
def bottom(x):
    if x < 92:        return 100 - (x - 83)      # long drape down the back-left
    elif x <= 104:    return 89                  # crown meets forehead
    else:             return 89 - (x - 104)      # taper near the face

for x in range(82, 111):
    top = 72 + int(round(((x - cx) / 14.0) ** 2 * 6))
    b = bottom(x)
    for y in range(top, b + 1):
        if y == top or x == 110:
            c = SH
        elif x < 92 and y == b:
            c = DK
        elif top + 2 <= y <= top + 3 and 88 <= x <= 104:
            c = HI                                # sleek sheen band
        elif x < 92 and y > 91:
            c = SH                                # drape shading
        else:
            c = MID
        px[x, y] = c

# ---------- beard (dark, rounded on the chin/jaw) ----------
bcx = 119.0
for x in range(112, 127):
    top = 91 + int(round(((x - bcx) / 8.0) ** 2 * 2))
    b = 101 - int(round(((x - bcx) / 8.0) ** 2 * 7))
    if b < top:
        continue
    for y in range(top, b + 1):
        if y == b or x == 126:
            c = DK
        elif x <= 113:
            c = SH
        else:
            c = MID
        px[x, y] = c

# clean cleared white block / stray specks above the hair -> match bg
for y in range(56, 81):
    bg = px[73, y]
    for x in range(81, 116):
        r, g, b = px[x, y]
        whiteish = r > 233 and g > 233 and b > 227
        stray = (y <= 73 and x >= 103) and not (r < 95 and b >= r - 12)
        if whiteish or stray:
            px[x, y] = bg

# soften head + face region
reg = (78, 58, 130, 104)
im.paste(im.crop(reg).filter(ImageFilter.GaussianBlur(0.4)), reg)

im.save('VICTORY_darkhair.png')
print('saved')
