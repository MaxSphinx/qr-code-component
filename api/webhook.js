const BOT_TOKEN = '8915688395:AAG01msf24L6trUNVhYE2fxeiMOA7bQY0LI';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const WEB_APP_URL = 'https://qr-code-component-three-sand.vercel.app';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      protocol: 'PROJECT 417 // BIOMECHANICAL PERFORMANCE PROTOCOL',
      version: 'v4.1.7-prod',
      provider: 'Vercel Serverless Edge (24/7 Free Cloud)',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = req.body;
    if (!update || !update.message) {
      return res.status(200).json({ ok: true, note: 'No message in update' });
    }

    const msg = update.message;
    const chatId = msg.chat?.id;
    if (!chatId) {
      return res.status(200).json({ ok: true, note: 'No chat ID' });
    }

    const text = (msg.text || '').trim();
    if (!text.startsWith('/start') && !text.startsWith('/open') && !text.startsWith('/app') && !text.startsWith('/status')) {
      return res.status(200).json({ ok: true, note: 'Command ignored' });
    }

    const fromUser = msg.from || {};
    const username = fromUser.username ? `@${fromUser.username}` : fromUser.first_name || 'Атлет';
    const isCreator =
      fromUser.username === 'a7rcana' ||
      fromUser.username === 'x417e' ||
      fromUser.username === 'maxim_fit' ||
      fromUser.username === 'oqpie' ||
      fromUser.id === 8180640504 ||
      fromUser.id === 1007600503 ||
      fromUser.id === 99999999;

    let replyText = '';
    if (isCreator) {
      replyText = `⚡ <b>PROJECT 417 // СИСТЕМА АКТИВНА</b>\n\n` +
        `Приветствую, Создатель (<b>${fromUser.first_name || 'Максим'}</b>).\n` +
        `Статус доступа: <b>SUPER ADMIN • ID #417-MAX</b>\n\n` +
        `Система развернута в автономном облаке (24/7). Ноутбук полностью освобожден от нагрузок.\n` +
        `Готова к тренировочным циклам, биомеханическому учету и протоколам восстановления.`;
    } else {
      replyText = `⚡ <b>PROJECT 417 // BIOMECHANICAL PERFORMANCE PROTOCOL</b>\n\n` +
        `Приветствуем в закрытом дивизионе атлетической подготовки, <b>${fromUser.first_name || 'Атлет'}</b>.\n\n` +
        `Доступ осуществляется строго для авторизованных резидентов синдиката.\n` +
        `Нажмите кнопку ниже для запуска биомеханического терминала:`;
    }

    await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '⚡ Открыть PROJECT 417',
                web_app: { url: WEB_APP_URL },
              },
            ],
            [
              {
                text: '💬 Связь с Создателем (@a7rcana)',
                url: 'https://t.me/a7rcana',
              },
            ],
          ],
        },
      }),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(200).json({ ok: false, error: err.message });
  }
}
