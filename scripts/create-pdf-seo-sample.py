from pathlib import Path
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak


OUTPUT = Path(sys.argv[1] if len(sys.argv) > 1 else "public/samples/pdf-to-mind-map-verification-sample.pdf")
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#102F53")
BLUE = colors.HexColor("#2563EB")
TEAL = colors.HexColor("#0F9F8F")
MUTED = colors.HexColor("#526174")
PALE = colors.HexColor("#EFF6FF")
LINE = colors.HexColor("#DFE7F1")


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(22 * mm, 17 * mm, 188 * mm, 17 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(22 * mm, 11 * mm, "MindMapAny fixed verification sample - version 1.0")
    canvas.drawRightString(188 * mm, 11 * mm, f"Page {doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
title = ParagraphStyle("Title", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=27, leading=32, textColor=NAVY, alignment=TA_LEFT, spaceAfter=8 * mm)
eyebrow = ParagraphStyle("Eyebrow", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=BLUE, tracking=1.2, spaceAfter=4 * mm)
h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=18, leading=23, textColor=NAVY, spaceBefore=5 * mm, spaceAfter=3 * mm)
body = ParagraphStyle("Body", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.5, leading=17, textColor=MUTED, spaceAfter=4 * mm)
callout = ParagraphStyle("Callout", parent=body, fontName="Helvetica-Bold", textColor=NAVY, leftIndent=4 * mm, rightIndent=4 * mm, spaceBefore=2 * mm, spaceAfter=2 * mm)

doc = BaseDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=22 * mm, leftMargin=22 * mm, topMargin=22 * mm, bottomMargin=24 * mm, title="PDF to Mind Map Verification Sample", author="MindMapAny")
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
doc.addPageTemplates([PageTemplate(id="sample", frames=[frame], onPage=footer)])

pages = [
    (
        "01 / VERIFICATION PROBLEM",
        "A mind map is useful only when its claims can be checked",
        [
            "Long PDFs make it difficult to remember where a conclusion came from. A clean diagram can hide omissions or incorrect grouping if the reader cannot return to the supporting page.",
            "The verification goal is simple: preserve enough source location data that a reader can compare each important map node with the original document.",
        ],
        ["Coverage", "Hierarchy", "Source page", "Editable result"],
    ),
    (
        "02 / PAGE-AWARE METHOD",
        "Extract text by page before building the hierarchy",
        [
            "The document is read page by page. Paragraphs inherit the page number they were extracted from, and chunks keep that location before any AI generation begins.",
            "The model refers to stable chunk identifiers. The application resolves those identifiers back to page numbers, so the model does not invent page citations itself.",
        ],
        ["Page 1 -> chunk A", "Page 2 -> chunk B", "Chunk ID -> source page", "Node -> page badge"],
    ),
    (
        "03 / EVALUATION",
        "Test completeness, placement and provenance separately",
        [
            "Completeness asks whether every major section appears. Placement asks whether details sit beneath the correct parent. Provenance asks whether a page badge points to text that actually supports the node.",
            "A map can pass one test and fail another. Keeping these checks separate makes the result easier to diagnose and improve.",
        ],
        ["Major sections present", "Branches correctly nested", "Page badges verified", "Failures recorded"],
    ),
    (
        "04 / DECISION LOG",
        "Keep, revise or reject the result using recorded evidence",
        [
            "After verification, record the sample version, generated output, test date and observed failures. A result should be kept only when its hierarchy is useful and its important claims can be traced back.",
            "If the map omits a section or points to the wrong page, revise the method and run the same fixed sample again. A stable input makes changes comparable over time.",
        ],
        ["Keep", "Revise", "Reject", "Run again"],
    ),
]

story = []
for index, (label, heading, paragraphs, checks) in enumerate(pages):
    story.extend([Paragraph(label, eyebrow), Paragraph(heading, title)])
    for text in paragraphs:
        story.append(Paragraph(text, body))
    story.extend([Spacer(1, 3 * mm), Paragraph("CONTROLLED CHECKS", eyebrow)])
    data = [[f"{i + 1:02d}", item] for i, item in enumerate(checks)]
    table = Table(data, colWidths=[18 * mm, 134 * mm], rowHeights=[13 * mm] * len(data))
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("TEXTCOLOR", (0, 0), (0, -1), TEAL),
        ("TEXTCOLOR", (1, 0), (1, -1), NAVY),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10.5),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(table)
    story.extend([Spacer(1, 8 * mm), Paragraph("Expected map branch", h2), Paragraph(f"{heading} - source badge p.{index + 1}", body)])
    if index < len(pages) - 1:
        story.append(PageBreak())

doc.build(story)
print(OUTPUT.resolve())
