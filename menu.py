from PIL import Image, ImageDraw, ImageFont

im = Image.open('VICTORY_vs_CHARIZARD.png').convert('RGB')
d = ImageDraw.Draw(im)

FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f_move = ImageFont.truetype(FB, 9)
f_info = ImageFont.truetype(FB, 9)
f_pp   = ImageFont.truetype(FB, 8)

GOLD   = (196, 182, 92)
BORDER = (88, 88, 112)
FILL   = (250, 250, 245)
SHADOW = (170, 168, 150)
TXT    = (74, 74, 92)
RED    = (226, 50, 38)

# ---- wipe interior of bottom box with gold backing (acts as frame/divider) ----
d.rectangle((28, 121, 272, 163), fill=GOLD)

def box(x0, y0, x1, y1):
    d.rounded_rectangle((x0+1, y0+1, x1+1, y1+1), radius=4, fill=SHADOW)
    d.rounded_rectangle((x0, y0, x1, y1), radius=4, fill=FILL, outline=BORDER, width=1)

# left move box + right info box
box(30, 122, 205, 161)
box(209, 122, 270, 161)

def text(x, y, s, font, color=TXT):
    d.text((x, y), s, font=font, fill=color)

# ---- moves (2x2) ----
C1, C2 = 35, 127
R1, R2 = 127, 143
text(C1, R1, 'Power-Up Punch', f_move)
text(C2, R1, 'Body Slam',      f_move)
text(C1, R2, 'Taunt',          f_move)
text(C2, R2, 'Clothesline',    f_move)

# ---- red selection box around Clothesline ----
bb = d.textbbox((C2, R2), 'Clothesline', font=f_move)
d.rounded_rectangle((bb[0]-3, bb[1]-2, bb[2]+2, bb[3]+2), radius=2, outline=RED, width=1)

# ---- right info box ----
text(215, R1, 'PP 80/100', f_pp)
text(215, R2, 'NORMAL',    f_info)

im.save('VICTORY_battle_menu.png')
# report fit
for s, f in [('Power-Up Punch', f_move), ('Clothesline', f_move), ('PP 80/100', f_pp)]:
    print(s, '->', f.getbbox(s)[2], 'px wide')
print('saved')
