from PIL import Image, ImageDraw, ImageFont, ImageFilter

im = Image.open('extracted_0.jpeg').convert('RGB')
px = im.load()

# ---------------- HP BARS -> half, yellow ----------------
yellow = {0:(230,223,169),1:(212,189,13),2:(254,223,47),3:(250,233,119)}
dark   = {0:(195,194,202),1:(60,76,73),2:(84,99,94),3:(127,138,130)}

def paint_bar(rows, x0, x1):
    n = x1 - x0 + 1
    mid = x0 + n//2
    for i, y in enumerate(rows):
        for x in range(x0, x1+1):
            px[x, y] = yellow[i] if x < mid else dark[i]

paint_bar([34,35,36,37], 84, 127)     # Charizard
paint_bar([95,96,97,98], 207, 256)    # Goku

# ---------------- TEXT ----------------
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f_name = ImageFont.truetype(FONT, 10)   # nameplate
f_num  = ImageFont.truetype(FONT, 9)    # numbers
f_batt = ImageFont.truetype(FONT, 12)   # battle line

CREAM = (248, 247, 216)
BLUE  = (36, 81, 104)
DARK  = (74, 66, 42)
WHITE = (252, 252, 252)
SHAD  = (54, 64, 86)

d = ImageDraw.Draw(im)

def fill(box, color):
    d.rectangle(box, fill=color)

def text_r(xr, y, s, font, color):           # right-align at xr
    w = font.getbbox(s)[2]
    d.text((xr - w, y), s, font=font, fill=color)

def text_l(x, y, s, font, color):
    d.text((x, y), s, font=font, fill=color)

# Charizard Lv40 -> Lv99  (redraw whole label)
fill((108,18,136,31), CREAM)
text_l(109, 19, 'Lv99', f_num, DARK)

# Goku name GOKU -> VICTORY (drop gender symbol)
fill((170,80,212,91), CREAM)
text_l(171, 80, 'VICTORY', f_name, DARK)

# Goku Lv50 -> Lv99  (redraw whole label)
fill((237,80,272,92), CREAM)
text_l(239, 80, 'Lv99', f_num, DARK)

# Goku 49/154 -> 77/154
fill((219,98,237,109), CREAM)
text_r(237, 98, '77', f_num, DARK)

# Battle line1 GOKU used -> VICTORY used
fill((32,128,120,142), BLUE)
def batt(x, y, s):
    d.text((x+1, y+1), s, font=f_batt, fill=SHAD)
    d.text((x, y), s, font=f_batt, fill=WHITE)
batt(34, 126, 'VICTORY used')

im.save('v1.png')
print('saved v1')
