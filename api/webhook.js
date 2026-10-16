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
    if (
      !text.startsWith('/start') &&
      !text.startsWith('/open') &&
      !text.startsWith('/app') &&
      !text.startsWith('/status') &&
      !text.startsWith('/briefing') &&
      !text.startsWith('/today')
    ) {
      return res.status(200).json({ ok: true, note: 'Command ignored' });
    }

    const fromUser = msg.from || {};
    const usernameClean = (fromUser.username || '').replace(/^@/, '').toLowerCase().trim();
    const firstNameLower = (fromUser.first_name || '').toLowerCase().trim();

    const isCreator =
      usernameClean === 'a7rcana' ||
      usernameClean === 'x417e' ||
      usernameClean === 'maxim_fit' ||
      usernameClean === 'oqpie' ||
      fromUser.id === 8180640504;

    const isArtemiy =
      usernameClean === 'yarvexor' ||
      firstNameLower === 'артемий' ||
      firstNameLower === 'artemiy' ||
      fromUser.id === 1007600503;

    // Pin the WebApp Menu Button for this user so it's always available
    try {
      await fetch(`${API_URL}/setChatMenuButton`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          menu_button: {
            type: 'web_app',
            text: 'PROJECT 417',
            web_app: { url: WEB_APP_URL },
          },
        }),
      });
    } catch {}

    let replyText = '';
    const isBriefing = text.startsWith('/briefing') || text.startsWith('/today');

    if (isBriefing) {
      const todayRu = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
      replyText = `⚡ <b>PROJECT 417 // ЕЖЕДНЕВНЫЙ БРИФИНГ</b>\n` +
        `📅 <i>${todayRu}</i>\n\n` +
        `👤 Атлет: <b>${fromUser.first_name || 'Атлет'}</b>\n` +
        `🎯 Авторегуляция: <b>Double Progression активна (+2.5 кг к закрытым сетам)</b>\n` +
        `💧 Норма гидратации: <b>2500 мл (баланс электролитов)</b>\n` +
        `⚡ Готовность ЦНС: <b>Оптимальный Sweet Spot (ACWR 0.8–1.3)</b>\n\n` +
        `Нажмите кнопку ниже для старта тренировки:`;
    } else if (isCreator) {
      replyText = `⚡ <b>PROJECT 417 // СИСТЕМА АКТИВНА</b>\n\n` +
        `Приветствую, Создатель (<b>${fromUser.first_name || 'Максим'}</b>).\n` +
        `Статус доступа: <b>SUPER ADMIN • ID #417-MAX</b>\n\n` +
        `Система развернута в автономном облаке (24/7). Ноутбук полностью освобожден от нагрузок.\n` +
        `Готова к тренировочным циклам, биомеханическому учету и управлению атлетами.`;
    } else if (isArtemiy) {
      replyText = `⚡ <b>PROJECT 417 // ДОСТУП АВТОРИЗОВАН</b>\n\n` +
        `Приветствуем в закрытом дивизионе, <b>Артемий (@yarvexor)</b>.\n` +
        `Статус доступа: <b>РЕЗИДЕНТ СИНДИКАТА • ID #417-ART</b>\n\n` +
        `Персональный скоростно-силовой протокол и антропометрия инициализированы.\n` +
        `Нажмите кнопку ниже для запуска биомеханического терминала:`;
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
