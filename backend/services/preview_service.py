# backend/services/preview_service.py

import math
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

import matplotlib
matplotlib.use("Agg")   # IMPORTANT: must be before pyplot import to avoid Tkinter GUI
import matplotlib.pyplot as plt


# ======================
# Font Helper
# ======================
def _choose_font(font_name: str, size: int):
    """Try to return a Pillow ImageFont, else fallback to default."""
    try:
        if font_name:
            return ImageFont.truetype(font_name, size)
    except Exception:
        pass
    try:
        return ImageFont.truetype("arial.ttf", size)  # common fallback on Windows
    except Exception:
        return ImageFont.load_default()


# ======================
# Template Drawing
# ======================
def _draw_template(ax, template: str, scale: float = 1.0):
    """Draw simple template backgrounds on matplotlib axes."""
    import matplotlib.patches as patches

    if template == "farm":
        rect = patches.Rectangle((-150*scale, -80*scale), 300*scale, 160*scale,
                                 linewidth=2*scale, edgecolor="#c7a252", facecolor="none")
        ax.add_patch(rect)
        ax.add_patch(patches.Circle((120*scale, 90*scale), 18*scale, color="#f6c85f"))

    elif template == "workshop":
        circ = patches.Circle((0, 0), 110*scale, linewidth=2*scale,
                              edgecolor="#8aa9cf", fill=False)
        ax.add_patch(circ)
        for i in range(12):
            ang = math.radians(i * 30)
            x = 140*scale * math.cos(ang)
            y = 140*scale * math.sin(ang)
            ax.add_patch(patches.Circle((x, y), 6*scale, color="#8aa9cf"))

    elif template == "camping":
        tri = patches.Polygon([(-80*scale, -60*scale), (0, 90*scale), (80*scale, -60*scale)],
                              closed=True, edgecolor="#6fbf73", fill=False, linewidth=2*scale)
        ax.add_patch(tri)
        ax.add_patch(patches.Circle((0, -80*scale), 10*scale, color="#e86e3b"))

    elif template == "heritage":
        arc = patches.Arc((0, 0), 220*scale, 120*scale, theta1=0, theta2=180,
                          edgecolor="#c9c9c9", linewidth=2*scale)
        ax.add_patch(arc)
        ax.add_patch(patches.Rectangle((-95*scale, -60*scale), 10*scale, 120*scale, color="#c9c9c9"))
        ax.add_patch(patches.Rectangle((85*scale, -60*scale), 10*scale, 120*scale, color="#c9c9c9"))


# ======================
# Main Preview Function
# ======================
def create_preview_png_bytes(
    text: str,
    layout: str = "straight",
    font_name: str = None,
    height: int = 40,
    template: str = None,
    scale: float = 1.0,
    watermark: bool = False,
    width_px: int = 1200,
    height_px: int = 600
) -> bytes:
    """
    Returns PNG bytes for preview.
    layout: straight / arched / circular / monogram / stacked
    """

    # safe text
    text = text.strip() if text else "Preview"
    fontsize = max(8, int(height * scale))

    # --- Setup matplotlib figure (headless) ---
    dpi = 100
    fig_w, fig_h = width_px / dpi, height_px / dpi
    fig = plt.figure(figsize=(fig_w, fig_h), dpi=dpi)
    ax = fig.add_subplot(111)
    ax.set_xlim(-width_px/2, width_px/2)
    ax.set_ylim(-height_px/2, height_px/2)
    ax.set_aspect('equal')
    ax.axis('off')

    # --- Draw template if given ---
    if template and template.lower() != "none":
        _draw_template(ax, template, scale)

    # --- Draw Text according to layout ---
    if layout in ("straight", "monogram"):
        display_text = text if layout == "straight" else text[:3].upper()
        ax.text(0, 0, display_text,
                fontsize=fontsize * (1.6 if layout == "monogram" else 1.0),
                ha="center", va="center", family=font_name or "sans-serif",
                weight="bold", color="black")

    elif layout == "stacked":
        y = fontsize * (len(text) - 1) / 2
        for ch in text:
            ax.text(0, y, ch, fontsize=fontsize, ha="center", va="center",
                    family=font_name or "sans-serif", color="black")
            y -= fontsize * 1.4

    elif layout in ("arched", "circular"):
        n = len(text)
        if n > 0:
            arc_deg = 180 if layout == "arched" else 360
            arc_rad = math.radians(arc_deg)
            start = -arc_rad/2
            step = arc_rad / max(n-1, 1)
            r = max(150*scale, fontsize*n/math.pi)

            for i, ch in enumerate(text):
                ang = start + i * step
                x, y = r*math.cos(ang), r*math.sin(ang)
                rotation = math.degrees(ang) + 90
                ax.text(x, y, ch, fontsize=fontsize, ha="center", va="center",
                        rotation=rotation, family=font_name or "sans-serif", color="black")

    # --- Save matplotlib fig to buffer ---
    buf = BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight", pad_inches=0.2, transparent=True)
    plt.close(fig)
    buf.seek(0)

    # --- Add Watermark if required (Pillow) ---
    img = Image.open(buf).convert("RGBA")
    if watermark:
        txt_layer = Image.new("RGBA", img.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(txt_layer)
        wm_text = "DEMO"
        fnt = _choose_font(font_name or "arial.ttf", int(40 * scale))
        w, h = draw.textsize(wm_text, font=fnt)
        draw.text((img.size[0]-w-20, img.size[1]-h-20),
                  wm_text, font=fnt, fill=(255, 255, 255, 100))
        img = Image.alpha_composite(img, txt_layer)

    # --- Final Output ---
    out_buf = BytesIO()
    img.convert("RGB").save(out_buf, format="PNG")
    out_buf.seek(0)
    return out_buf.read()
