from PIL import Image, ImageDraw, ImageFont, ImageFilter

im = Image.open('VICTORY_final.png').convert('RGB')
px = im.load()
WHITE = (250, 250, 250)
PURPLE = (172, 163, 212)
CREAM = (248, 247, 216)

# ---------- 1) erase blonde hair ----------
for y in range(64, 88):
    for x in range(80, 118):
        r, g, b = px[x, y]
        if g > 95 and b < g - 8 and r > 80:          # blonde/gold
            px[x, y] = PURPLE if y >= 83 else WHITE

# ---------- spiky quills (shiny-blue, Sandslash style) ----------
NAVY = (32, 44, 80); BLUE = (62, 96, 158); LBLUE = (120, 158, 212); HL = (172, 200, 236)

def spike(tipx, tipy, basex, basey, half):
    H = basey - tipy
    for y in range(tipy, basey + 1):
        f = (y - tipy) / H
        cx = tipx + (basex - tipx) * f
        w = half * f
        x0, x1 = int(round(cx - w)), int(round(cx + w))
        if x1 < x0:
            x1 = x0
        for x in range(x0, x1 + 1):
            if x == x1:
                c = NAVY
            elif x == x0:
                c = BLUE
            elif (x - x0) <= (x1 - x0) * 0.45:
                c = HL
            else:
                c = LBLUE
            px[x, y] = c
    px[tipx, tipy] = NAVY

# back-to-front fan, leaning back-left like Sandslash quills
for s in [(80,77,88,86,3),(84,70,91,86,3),(90,66,95,86,4),
          (97,66,100,86,4),(104,70,105,86,3),(109,75,108,86,2)]:
    spike(*s)

# ---------- cleanup stray blonde specks left around the quills ----------
for y in range(64, 88):
    for x in range(80, 118):
        r, g, b = px[x, y]
        if r > 140 and g > 125 and b < g - 12:       # any remaining yellow
            px[x, y] = PURPLE if y >= 83 else WHITE

# ---------- 2) remove the tongue (close the little mouth) ----------
for y in range(84, 89):
    for x in range(113, 117):
        px[x, y] = px[111, y]          # copy adjacent snout purple

# ---------- 3) remove the red stripes on the chest ----------
# rebuild the patch with clean purple chest texture copied from just above
band = im.crop((90, 96, 109, 108))     # x90..108, y96..107 (clean upper chest)
im.paste(band, (90, 108))              # covers the stripe rows y108..119
px = im.load()

# ---------- 4 & 5) HP bars ----------
GREEN = {0:(216,239,221),1:(73,220,132),2:(116,243,162),3:(153,238,199)}
RED   = {0:(250,176,166),1:(228,46,46),2:(248,86,78),3:(243,150,140)}
DARK  = {0:(195,194,202),1:(60,76,73),2:(84,99,94),3:(127,138,130)}

# Victory: full green (track 207..256, fill through the end cap to 260)
for i, y in enumerate([95,96,97,98]):
    for x in range(207, 261):
        px[x, y] = GREEN[i]

# Charizard: 10% red (track 84..127, len 44 -> ~4px)
fill_end = 84 + round(0.10 * (127 - 84))
for i, y in enumerate([34,35,36,37]):
    for x in range(84, 128):
        px[x, y] = RED[i] if x <= fill_end else DARK[i]

# Victory HP number 77/154 -> 200/200
d = ImageDraw.Draw(im)
f_num = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 9)
d.rectangle((214, 98, 274, 109), fill=CREAM)
s = '200/200'; w = f_num.getbbox(s)[2]
d.text((272 - w, 98), s, font=f_num, fill=(74, 66, 42))

# soften the redrawn head area to blend
reg = (76, 62, 118, 92)
im.paste(im.crop(reg).filter(ImageFilter.GaussianBlur(0.4)), reg)

im.save('VICTORY_v5.png')
print('fill_end', fill_end, 'saved')
