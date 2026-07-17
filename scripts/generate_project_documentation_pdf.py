from __future__ import annotations

import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    LongTable,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "DOCUMENTACAO_TECNICA_SITE_JD.md"
OUTPUT = ROOT / "docs" / "generated" / "documentacao-tecnica-site-jd-v1.8.1.pdf"

PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
TOP = 18 * mm
BOTTOM = 17 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_X

NAVY = colors.HexColor("#081022")
NAVY_2 = colors.HexColor("#111b36")
BLUE = colors.HexColor("#58a6ff")
PURPLE = colors.HexColor("#a855f7")
TEXT = colors.HexColor("#182033")
MUTED = colors.HexColor("#59647a")
LINE = colors.HexColor("#dbe3f2")
SOFT = colors.HexColor("#f3f6fb")
WHITE = colors.white


def register_fonts() -> tuple[str, str, str]:
    candidates = [
        (
            Path("C:/Windows/Fonts/arial.ttf"),
            Path("C:/Windows/Fonts/arialbd.ttf"),
            Path("C:/Windows/Fonts/consola.ttf"),
        ),
        (
            Path("C:/Windows/Fonts/calibri.ttf"),
            Path("C:/Windows/Fonts/calibrib.ttf"),
            Path("C:/Windows/Fonts/consola.ttf"),
        ),
    ]
    for regular, bold, mono in candidates:
        if regular.exists() and bold.exists() and mono.exists():
            pdfmetrics.registerFont(TTFont("JD-Regular", str(regular)))
            pdfmetrics.registerFont(TTFont("JD-Bold", str(bold)))
            pdfmetrics.registerFont(TTFont("JD-Mono", str(mono)))
            return "JD-Regular", "JD-Bold", "JD-Mono"
    return "Helvetica", "Helvetica-Bold", "Courier"


REGULAR, BOLD, MONO = register_fonts()


class ProjectDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename,
            pagesize=A4,
            leftMargin=MARGIN_X,
            rightMargin=MARGIN_X,
            topMargin=TOP,
            bottomMargin=BOTTOM,
            title="Site JD - Documentacao tecnica e guia de estudo",
            author="Jever Dias",
            subject="Arquitetura, dados, seguranca, componentes e operacao do Site JD",
        )
        frame = Frame(MARGIN_X, BOTTOM, CONTENT_W, PAGE_H - TOP - BOTTOM, id="content")
        self.addPageTemplates(PageTemplate(id="main", frames=[frame], onPage=draw_page))


def draw_page(canvas, doc):
    canvas.saveState()
    if doc.page == 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        canvas.setFillColor(colors.HexColor("#142049"))
        canvas.circle(PAGE_W - 18 * mm, PAGE_H - 18 * mm, 55 * mm, fill=1, stroke=0)
        canvas.setFillColor(colors.HexColor("#321c63"))
        canvas.circle(4 * mm, 8 * mm, 48 * mm, fill=1, stroke=0)
        canvas.setStrokeColor(BLUE)
        canvas.setLineWidth(2)
        canvas.line(MARGIN_X, 35 * mm, PAGE_W - MARGIN_X, 35 * mm)
    else:
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.6)
        canvas.line(MARGIN_X, PAGE_H - 12 * mm, PAGE_W - MARGIN_X, PAGE_H - 12 * mm)
        canvas.setFont(REGULAR, 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(MARGIN_X, PAGE_H - 9 * mm, "SITE JD  |  DOCUMENTAÇÃO TÉCNICA")
        canvas.drawRightString(PAGE_W - MARGIN_X, 9 * mm, f"Pagina {doc.page}")
        canvas.line(MARGIN_X, 13 * mm, PAGE_W - MARGIN_X, 13 * mm)
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="CoverKicker", fontName=BOLD, fontSize=11, leading=14, textColor=BLUE,
    tracking=1.4, spaceAfter=10 * mm,
))
styles.add(ParagraphStyle(
    name="CoverTitle", fontName=BOLD, fontSize=30, leading=34, textColor=WHITE,
    spaceAfter=8 * mm,
))
styles.add(ParagraphStyle(
    name="CoverSubtitle", fontName=REGULAR, fontSize=14, leading=20,
    textColor=colors.HexColor("#c9d6f2"), spaceAfter=10 * mm,
))
styles.add(ParagraphStyle(
    name="CoverMeta", fontName=REGULAR, fontSize=10, leading=16,
    textColor=colors.HexColor("#9eb2d9"),
))
styles.add(ParagraphStyle(
    name="H1JD", fontName=BOLD, fontSize=20, leading=24, textColor=NAVY,
    spaceBefore=5 * mm, spaceAfter=3 * mm, keepWithNext=True,
))
styles.add(ParagraphStyle(
    name="H2JD", fontName=BOLD, fontSize=14, leading=18, textColor=colors.HexColor("#253c76"),
    spaceBefore=4 * mm, spaceAfter=2 * mm, keepWithNext=True,
))
styles.add(ParagraphStyle(
    name="H3JD", fontName=BOLD, fontSize=11.5, leading=15, textColor=PURPLE,
    spaceBefore=3 * mm, spaceAfter=1.5 * mm, keepWithNext=True,
))
styles.add(ParagraphStyle(
    name="BodyJD", fontName=REGULAR, fontSize=9.2, leading=13.4, textColor=TEXT,
    spaceAfter=2.3 * mm, alignment=TA_LEFT,
))
styles.add(ParagraphStyle(
    name="BulletJD", parent=styles["BodyJD"], leftIndent=5 * mm, firstLineIndent=-3 * mm,
    bulletIndent=1.5 * mm, spaceAfter=1.2 * mm,
))
styles.add(ParagraphStyle(
    name="CodeJD", fontName=MONO, fontSize=7.3, leading=10, textColor=colors.HexColor("#e9f1ff"),
    backColor=NAVY_2, borderColor=colors.HexColor("#34466f"), borderWidth=0.5,
    borderPadding=6, leftIndent=1 * mm, rightIndent=1 * mm, spaceBefore=1.5 * mm,
    spaceAfter=3 * mm,
))
styles.add(ParagraphStyle(
    name="TableHeadJD", fontName=BOLD, fontSize=7.6, leading=10, textColor=WHITE,
))
styles.add(ParagraphStyle(
    name="TableCellJD", fontName=REGULAR, fontSize=7.4, leading=10, textColor=TEXT,
))
styles.add(ParagraphStyle(
    name="SmallJD", fontName=REGULAR, fontSize=8, leading=11, textColor=MUTED,
))


def inline_markup(value: str) -> str:
    value = html.escape(value.strip())
    value = re.sub(r"\[([^]]+)\]\(([^)]+)\)", r'<link href="\2" color="#2563a8">\1</link>', value)
    value = re.sub(r"`([^`]+)`", r'<font name="JD-Mono" color="#394d7c">\1</font>', value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", value)
    return value


def make_table(rows: list[list[str]]) -> LongTable:
    columns = max(len(row) for row in rows)
    normalized = [row + [""] * (columns - len(row)) for row in rows]
    data = []
    for row_index, row in enumerate(normalized):
        style_name = "TableHeadJD" if row_index == 0 else "TableCellJD"
        data.append([Paragraph(inline_markup(cell), styles[style_name]) for cell in row])
    if columns == 2:
        widths = [CONTENT_W * 0.30, CONTENT_W * 0.70]
    elif columns == 3:
        widths = [CONTENT_W * 0.22, CONTENT_W * 0.38, CONTENT_W * 0.40]
    else:
        widths = [CONTENT_W / columns] * columns
    table = LongTable(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY_2),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, SOFT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return table


def markdown_story(text: str):
    story = []
    lines = text.splitlines()
    index = 0
    in_code = False
    code_lines: list[str] = []
    paragraph_lines: list[str] = []
    body_started = False

    def flush_paragraph():
        nonlocal paragraph_lines
        if paragraph_lines:
            story.append(Paragraph(inline_markup(" ".join(line.strip() for line in paragraph_lines)), styles["BodyJD"]))
            paragraph_lines = []

    while index < len(lines):
        line = lines[index]
        if not body_started:
            if line.startswith("## "):
                body_started = True
            else:
                index += 1
                continue
        if line.startswith("```"):
            flush_paragraph()
            if in_code:
                code = "<br/>".join(html.escape(item).replace(" ", "&nbsp;") for item in code_lines)
                story.append(Paragraph(code or "&nbsp;", styles["CodeJD"]))
                code_lines = []
                in_code = False
            else:
                in_code = True
            index += 1
            continue
        if in_code:
            code_lines.append(line)
            index += 1
            continue
        if line.startswith("|") and index + 1 < len(lines) and re.match(r"^\|?\s*:?-+", lines[index + 1]):
            flush_paragraph()
            table_rows = []
            while index < len(lines) and lines[index].startswith("|"):
                cells = [cell.strip() for cell in lines[index].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-+:?", cell.replace(" ", "")) for cell in cells):
                    table_rows.append(cells)
                index += 1
            story.append(make_table(table_rows))
            story.append(Spacer(1, 3 * mm))
            continue
        if line.startswith("# "):
            flush_paragraph()
            index += 1
            continue
        if line.startswith("## "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(line[3:]), styles["H1JD"]))
        elif line.startswith("### "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(line[4:]), styles["H2JD"]))
        elif line.startswith("#### "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(line[5:]), styles["H3JD"]))
        elif re.match(r"^\d+\. ", line):
            flush_paragraph()
            number, content = line.split(". ", 1)
            story.append(Paragraph(f"<b>{number}.</b> {inline_markup(content)}", styles["BulletJD"]))
        elif line.startswith("- "):
            flush_paragraph()
            story.append(Paragraph(f"- {inline_markup(line[2:])}", styles["BulletJD"]))
        elif line.strip() in {"---", "***"}:
            flush_paragraph()
            story.append(Spacer(1, 2 * mm))
        elif not line.strip():
            flush_paragraph()
        elif line.startswith("**") and line.rstrip().endswith("  "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(line), styles["SmallJD"]))
        else:
            paragraph_lines.append(line)
        index += 1
    flush_paragraph()
    return story


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    source = SOURCE.read_text(encoding="utf-8")
    story = [
        Spacer(1, 38 * mm),
        Paragraph("ARQUITETURA E GUIA DE ESTUDO", styles["CoverKicker"]),
        Paragraph("Site JD", styles["CoverTitle"]),
        Paragraph(
            "Documentação técnica do portfólio profissional, da página pública ao painel administrativo.",
            styles["CoverSubtitle"],
        ),
        Spacer(1, 20 * mm),
        Paragraph("React + Vite + Supabase + Netlify", styles["CoverMeta"]),
        Paragraph("Versão documentada: 1.8.1", styles["CoverMeta"]),
        Paragraph("Preparado para estudo e análise por assistentes de IA", styles["CoverMeta"]),
        PageBreak(),
    ]
    story.extend(markdown_story(source))
    doc = ProjectDocTemplate(str(OUTPUT))
    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
