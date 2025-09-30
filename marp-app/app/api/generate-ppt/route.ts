import { NextRequest, NextResponse } from 'next/server';
import pptxgen from 'pptxgenjs';

export async function POST(request: NextRequest) {
  try {
    const { marpContent } = await request.json();

    if (!marpContent) {
      return NextResponse.json({ error: 'Marp内容がありません' }, { status: 400 });
    }

    const pptx = new pptxgen();
    const slides = marpContent.split('---').filter((s: string) => s.trim());

    slides.forEach((slideContent: string) => {
      const slide = pptx.addSlide();
      const lines = slideContent.trim().split('\n');
      const FONT_NAME = 'BIZ UDPゴシック';

      let yPos = 0.5;
      const MAX_Y = 7.5;

      lines.forEach((line: string) => {
        line = line.trim();
        line = line.replace(/\*\*(.+?)\*\*/g, '$1');
        line = line.replace(/```\w*/g, '');
        if (line) line = line.replace(/^\s+/g, '');
        if (!line) return;

        if (line.startsWith('# ')) {
          if (yPos > MAX_Y) return;  // ← これを追加
          slide.addText(line.replace('# ', ''), {
            x: 0.5,
            y: yPos,
            w: 9,
            h: 0.5,
            fontSize: 32,
            bold: true,
            color: '363636',
            fontFace: FONT_NAME
          });
          yPos += 0.8;
        } else if (line.startsWith('## ')) {
          if (yPos > MAX_Y) return;  // ← これを追加
          slide.addText(line.replace('## ', ''), {
            x: 0.5,
            y: yPos,
            w: 9,
            h: 0.4,
            fontSize: 24,
            bold: true,
            color: '363636',
            fontFace: FONT_NAME
          });
          yPos += 0.6;

        } else if (line.startsWith('### ')) {
          if (yPos > MAX_Y) return;  // ← これを追加
          slide.addText(line.replace('### ', ''), {
            x: 0.5,
            y: yPos,
            w: 9,
            h: 0.3,
            fontSize: 18,
            bold: true,
            color: '363636',
            fontFace: FONT_NAME
          });
          yPos += 0.5;




        } else if (line.startsWith('- ')) {
          if (yPos > MAX_Y) return;  // ← これを追加
          slide.addText('• ' + line.replace('- ', ''), {
            x: 1,
            y: yPos,
            w: 8.5,
            h: 0.3,
            fontSize: 18,
            color: '363636',
            fontFace: FONT_NAME
          });
          yPos += 0.4;
        } else {
          if (yPos > MAX_Y) return;  // ← これを追加
          slide.addText(line, {
            x: 0.5,
            y: yPos,
            w: 9,
            h: 0.3,
            fontSize: 18,
            color: '363636',
            fontFace: FONT_NAME
          });
          yPos += 0.4;
        }
      });
    });

    const pptxData = await pptx.write({ outputType: 'base64' });

    return new NextResponse(Buffer.from(pptxData as string, 'base64'), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': 'attachment; filename="presentation.pptx"',
      },
    });

  } catch (error) {
    console.error('エラー:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}