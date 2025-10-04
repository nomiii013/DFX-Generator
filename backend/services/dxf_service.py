# services/dxf_service.py
import ezdxf
import math


# ---------------- Layout Generators ---------------- #

def generate_dxf_straight(text: str, doc, msp, height=20, insert=(0,0)):
    """Add a single text entity (straight)."""
    txt = msp.add_text(text, dxfattribs={'height': height})
    txt.dxf.insert = insert
    return txt


def generate_dxf_arch(text: str, doc, msp, height=20, radius=None, arc_degrees=180):
    """Naive 'arched' implementation: place each character individually around an arc."""
    n = len(text)
    if n == 0:
        return

    if radius is None:
        radius = max(50, height * n / (2 * math.pi))

    arc_rad = math.radians(arc_degrees)
    start_angle = -arc_rad / 2
    step = arc_rad / max(n - 1, 1)

    for i, ch in enumerate(text):
        angle = start_angle + i * step
        x = radius * math.cos(angle)
        y = radius * math.sin(angle)
        ent = msp.add_text(ch, dxfattribs={'height': height})
        ent.dxf.insert = (x, y)

        # rotate character so it 'faces' tangent
        angle_deg = math.degrees(angle) + 90
        ent.dxf.rotation = angle_deg


def generate_dxf_monogram(text: str, doc, msp, height=20):
    """Monogram layout: large centered initials (1-3 letters)."""
    if not text:
        return
    big_text = text[:3].upper()
    ent = msp.add_text(big_text, dxfattribs={'height': height * 2})
    ent.dxf.insert = (0, 0)


def generate_dxf_stacked(text: str, doc, msp, height=20):
    """Stacked layout: each character below the previous."""
    if not text:
        return
    y = 0
    for char in text:
        ent = msp.add_text(char, dxfattribs={'height': height})
        ent.dxf.insert = (0, y)
        y -= height * 1.5


# ---------------- Template Helpers ---------------- #

def add_template_farm(msp):
    """Farm Signage: decorative border with barn style"""
    msp.add_lwpolyline([( -100, -50), (100, -50), (100, 50), (-100, 50), (-100, -50)],
                       dxfattribs={"color": 2})  # rectangle border
    msp.add_circle((0, 60), 15, dxfattribs={"color": 3})  # sun icon


def add_template_workshop(msp):
    """Workshop Panel: gear-like circle"""
    msp.add_circle((0, 0), 80, dxfattribs={"color": 1})
    for i in range(12):
        angle = math.radians(i * 30)
        x, y = 90 * math.cos(angle), 90 * math.sin(angle)
        msp.add_circle((x, y), 5, dxfattribs={"color": 4})


def add_template_camping(msp):
    """Camping Plaque: triangle (tent) + campfire"""
    msp.add_lwpolyline([(-50, -50), (0, 50), (50, -50), (-50, -50)],
                       dxfattribs={"color": 6})  # tent
    msp.add_circle((0, -60), 10, dxfattribs={"color": 1})  # campfire


def add_template_heritage(msp):
    """Heritage Theme: arch + columns"""
    msp.add_arc(center=(0, 0), radius=100, start_angle=0, end_angle=180, dxfattribs={"color": 7})
    msp.add_line((-80, -50), (-80, 50), dxfattribs={"color": 7})  # left column
    msp.add_line((80, -50), (80, 50), dxfattribs={"color": 7})   # right column


def apply_template(msp, template: str):
    """Attach decorative template elements."""
    if template == "farm":
        add_template_farm(msp)
    elif template == "workshop":
        add_template_workshop(msp)
    elif template == "camping":
        add_template_camping(msp)
    elif template == "heritage":
        add_template_heritage(msp)


# ---------------- Main DXF Generator ---------------- #

def generate_dxf(text: str, out_path: str, layout='straight', height=20, font=None, template=None):
    """
    Creates a DXF file at out_path.
    - layout: 'straight', 'arched', 'circular', 'monogram', 'stacked'
    - template: 'farm', 'workshop', 'camping', 'heritage'
    """
    doc = ezdxf.new(dxfversion='R2010')
    msp = doc.modelspace()

    # --- Text Layout ---
    if layout == 'straight':
        generate_dxf_straight(text, doc, msp, height=height, insert=(0,0))
    elif layout == 'arched':
        generate_dxf_arch(text, doc, msp, height=height, arc_degrees=180)
    elif layout == 'circular':
        generate_dxf_arch(text, doc, msp, height=height, arc_degrees=360)
    elif layout == 'monogram':
        generate_dxf_monogram(text, doc, msp, height=height)
    elif layout == 'stacked':
        generate_dxf_stacked(text, doc, msp, height=height)
    else:
        generate_dxf_straight(text, doc, msp, height=height)

    # --- Apply Template ---
    if template and template != "none":
        apply_template(msp, template)

    doc.saveas(out_path)
    return out_path
