import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 });
    }

    const text = await file.text();
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `以下のテキストを、Marp形式のスライドに変換してください。
        
ルール：
- 必ず最初に --- で始める
- 各スライドは --- で区切る
- タイトルは # を使う
- 箇条書きは - を使う
- 適切なページ数に分割する
- 見やすく整理する

テキスト：
${text}`
      }]
    });

    const marpContent = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    return NextResponse.json({ marp: marpContent });
    
  } catch (error) {
    console.error('エラー:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}