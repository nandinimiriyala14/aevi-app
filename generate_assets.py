from PIL import Image, ImageDraw, ImageFont
import os

def find_font(size):
    candidates = [
        r"C:\Windows\Fonts\seguisym.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

def draw_icon(bg_rgba, out_path):
    img = Image.new('RGBA', (1024, 1024), bg_rgba)
    draw = ImageDraw.Draw(img)

    cx = cy = 512
    r = 200
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill='#867070')

    font = find_font(180)
    symbol = '✶'  # ✦
    bbox = draw.textbbox((0, 0), symbol, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text(
        (cx - tw // 2 - bbox[0], cy - th // 2 - bbox[1]),
        symbol,
        fill='white',
        font=font,
    )

    if bg_rgba[3] == 255:
        img = img.convert('RGB')

    img.save(out_path)
    print(f'Saved {out_path}')

os.makedirs('assets', exist_ok=True)

draw_icon((0, 0, 0, 0), 'assets/splash-icon.png')
draw_icon((253, 246, 240, 255), 'assets/icon.png')
