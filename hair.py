from PIL import Image, ImageFilter

im = Image.open('VICTORY_final.png').convert('RGB')
px = im.load()

HI  = (178, 136, 90)
MID = (126, 90, 56)
SH  = (82, 55, 32)
DK  = (52, 34, 20)

def brown_ramp(t):
    t = max(0.0, min(1.0, t))
    c0, c1 = (52, 34, 20), (184, 142, 98)
    return tuple(int(c0[i] + (c1[i] - c0[i]) * t) for i in range(3))

# 1) recolor the blonde cap -> brown, preserving its shading
for y in range(66, 92):
    for x in range(80, 120):
        r, g, b = px[x, y]
        if g > 95 and b < g - 8 and r > 80:
            px[x, y] = brown_ramp((g - 70) / 180.0)

# 2) long hair mass: a full lock draping down the back/left side,
#    kept well left of the face/eye. Vertical strands.
mass = {
 85:(83,93), 86:(82,93), 87:(81,93), 88:(81,93), 89:(80,92), 90:(80,92),
 91:(79,91), 92:(79,90), 93:(78,89), 94:(78,88), 95:(78,87), 96:(78,86),
 97:(78,86), 98:(79,85), 99:(79,85), 100:(79,84), 101:(80,84), 102:(80,84),
 103:(81,84), 104:(81,85), 105:(82,85), 106:(82,85), 107:(83,86),
 108:(83,86), 109:(84,86), 110:(84,86), 111:(85,86),
}
for y, (xs, xe) in mass.items():
    for x in range(xs, xe + 1):
        if x == xs or x == xe:
            c = SH
        elif x % 3 == 0:
            c = HI
        else:
            c = MID
        px[x, y] = c

# 3) a second, shorter lock falling behind the right of the jaw (below the eye)
right = {93:(106,111),94:(106,112),95:(107,112),96:(107,112),97:(108,111),
         98:(108,111),99:(109,110)}
for y, (xs, xe) in right.items():
    for x in range(xs, xe + 1):
        px[x, y] = SH if (x == xs or x == xe) else (HI if x % 3 == 0 else MID)

# soften to blend
reg = (76, 64, 120, 116)
patch = im.crop(reg).filter(ImageFilter.GaussianBlur(0.45))
im.paste(patch, reg)

im.save('VICTORY_longhair.png')
print('saved')
