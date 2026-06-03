from PIL import Image, ImageDraw, ImageFont, ImageFilter

SRC = 'extracted_0.jpeg'
im = Image.open('VICTORY_battle_menu.png').convert('RGB')
src = Image.open(SRC).convert('RGB')
d = ImageDraw.Draw(im)

CREAM  = (248, 247, 216)
INK    = (70, 64, 40)   # FRLG nameplate text color

# ---------------- FRLG-style pixel font for VICTORY ----------------
G = {
 'V': ["10001","10001","10001","10001","01010","01010","00100"],
 'I': ["111","010","010","010","010","010","111"],
 'C': ["01110","10001","10000","10000","10000","10001","01110"],
 'T': ["11111","00100","00100","00100","00100","00100","00100"],
 'O': ["01110","10001","10001","10001","10001","10001","01110"],
 'R': ["11110","10001","10001","11110","10100","10010","10001"],
 'Y': ["10001","10001","01010","00100","00100","00100","00100"],
}

def render_word(word, ink):
    gap = 1
    widths = [len(G[c][0]) for c in word]
    W = sum(widths) + gap*(len(word)-1)
    H = 7
    layer = Image.new('RGBA', (W, H), (0,0,0,0))
    lp = layer.load()
    x = 0
    for c in word:
        g = G[c]
        for ry, row in enumerate(g):
            for rx, ch in enumerate(row):
                if ch == '1':
                    lp[x+rx, ry] = (ink[0], ink[1], ink[2], 255)
        x += len(g[0]) + gap
    return layer

# nameplate: erase old DejaVu "VICTORY" and gender area, draw pixel VICTORY
d.rectangle((169, 80, 235, 91), fill=CREAM)
victory = render_word('VICTORY', INK)
# upscale-free 1:1 paste, then soften to match JPEG look
vx, vy = 171, 82
im.paste(victory, (vx, vy), victory)

# ---------------- copy the male (♂) symbol from CHARIZARD ----------------
male = src.crop((90, 20, 99, 31)).convert('RGB')      # ♂ on cream background
mp = male.load()
for yy in range(male.height):
    for xx in range(male.width):
        r, g, b = mp[xx, yy]
        is_blue = b > r + 12
        if not is_blue and (r + g + b) < 360:          # dark D-remnant -> cream
            mp[xx, yy] = CREAM
mw = victory.width
im.paste(male, (vx + mw + 2, 80))

# soften the freshly drawn name region slightly to blend with the JPEG art
reg = (168, 79, vx + mw + 14, 92)
patch = im.crop(reg).filter(ImageFilter.GaussianBlur(0.4))
im.paste(patch, reg)

# ---------------- rebuild move menu with ALL-CAPS text ----------------
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f_move = ImageFont.truetype(FB, 8)
f_info = ImageFont.truetype(FB, 9)
f_pp   = ImageFont.truetype(FB, 8)
GOLD=(196,182,92); BORDER=(88,88,112); FILL=(250,250,245); SHADOW=(170,168,150)
TXT=(74,74,92); RED=(226,50,38)

d.rectangle((28,121,272,163), fill=GOLD)
def box(x0,y0,x1,y1):
    d.rounded_rectangle((x0+1,y0+1,x1+1,y1+1), radius=4, fill=SHADOW)
    d.rounded_rectangle((x0,y0,x1,y1), radius=4, fill=FILL, outline=BORDER, width=1)
box(30,122,205,161); box(209,122,270,161)

def text(x,y,s,f,c=TXT): d.text((x,y), s, font=f, fill=c)
C1, C2 = 35, 127
R1, R2 = 128, 144
text(C1,R1,'POWER-UP PUNCH', f_move)
text(C2,R1,'BODY SLAM',      f_move)
text(C1,R2,'TAUNT',          f_move)
text(C2,R2,'CLOTHESLINE',    f_move)
bb = d.textbbox((C2,R2),'CLOTHESLINE', font=f_move)
d.rounded_rectangle((bb[0]-3,bb[1]-2,bb[2]+2,bb[3]+2), radius=2, outline=RED, width=1)
text(215,R1,'PP 80/100', f_pp)
text(215,R2,'NORMAL',    f_info)

im.save('VICTORY_final.png')
for s,f in [('POWER-UP PUNCH',f_move),('CLOTHESLINE',f_move)]:
    print(s,'->',f.getbbox(s)[2],'px')
print('VICTORY width', victory.width)
print('saved')
