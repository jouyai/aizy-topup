// file: app/api/validate-user/route.ts

import { NextResponse } from 'next/server';

// Fungsi helper untuk memanggil API Codashop
async function hitCoda(body: string) {
  try {
    const response = await fetch('https://order-sg.codashop.com/initPayment.action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      },
      body,
    });
    if (!response.ok) {
        // Log error jika response tidak OK
        console.error("Coda API response not OK:", response.status, await response.text());
        return { success: false, message: "Failed to connect to validation service." };
    }
    return await response.json();
  } catch (error) {
    console.error("Error hitting Coda API:", error);
    return { success: false, message: "An error occurred during validation." };
  }
}

export async function POST(req: Request) {
  try {
    const { game, userId, zoneId } = await req.json();

    if (!game || !userId) {
      return NextResponse.json({ success: false, message: 'Game and User ID are required' }, { status: 400 });
    }

    let body = '';
    
    // Logika untuk setiap game, mirip seperti di repositori 'valid'
    switch (game) {
      case 'mobile-legends':
      case 'mobile-legends-a':
      case 'mobile-legends-b':
        if (!zoneId) {
          return NextResponse.json({ success: false, message: 'Zone ID is required for Mobile Legends' }, { status: 400 });
        }
        body = `voucherPricePoint.id=4150&voucherPricePoint.price=1579&voucherPricePoint.variablePrice=0&user.userId=${userId}&user.zoneId=${zoneId}&voucherTypeName=MOBILE_LEGENDS&shopLang=id_ID`;
        break;
      
      case 'genshin-impact':
        let serverId = '';
        const idStr = userId.toString();
        if (idStr.startsWith('6')) serverId = 'os_usa';
        else if (idStr.startsWith('7')) serverId = 'os_euro';
        else if (idStr.startsWith('8')) serverId = 'os_asia';
        else if (idStr.startsWith('9')) serverId = 'os_cht';
        else {
            return NextResponse.json({ success: false, message: 'Invalid User ID for Genshin Impact' }, { status: 400 });
        }
        body = `voucherPricePoint.id=116054&voucherPricePoint.price=16500&voucherPricePoint.variablePrice=0&user.userId=${userId}&user.zoneId=${serverId}&voucherTypeName=GENSHIN_IMPACT&shopLang=id_ID`;
        break;

      // Tambahkan case untuk game lain di sini...
      // case 'valorant': ...

      default:
        return NextResponse.json({ success: false, message: 'Game not supported for validation' }, { status: 400 });
    }

    const data: any = await hitCoda(body);

    // Cek respons dari Codashop
    if (data.confirmationFields && data.confirmationFields.username) {
      const username = decodeURIComponent(data.confirmationFields.username.replace(/\+/g, ' '));
      return NextResponse.json({ success: true, username: username });
    } else {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

  } catch (error) {
    console.error('API validation error:', error);
    return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
  }
}