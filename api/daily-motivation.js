const BOT_TOKEN = '8915688395:AAG01msf24L6trUNVhYE2fxeiMOA7bQY0LI';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const WEB_APP_URL = 'https://qr-code-component-three-sand.vercel.app';

const ARTEMIY_CHAT_ID = 1007600503;
const CREATOR_CHAT_ID = 8180640504;

const MOTIVATION_QUOTES = [
  'Артемий (@yarvexor), сканеры Синдиката зафиксировали опасное падение плотности твоих мышц. Гантели в зале скучают, а гравитация начинает побеждать. Хватит косплеить тростинку — вставай и тащи свой тоннаж в зал!',
  'Артемий, пока ты ищешь оправдания, твои мышечные волокна атрофируются до субатомных частиц. Создатель следит за протоколом: жим сам себя не пожмет, а спина шире дверного проема сама не станет. В зал, бегом!',
  'Внимание, Артемий! В протоколе PROJECT 417 нет графы «я устал» или «потренируюсь завтра». Твой текущий рабочий вес выглядит как разминка. Иди перекрывай рекорды, пока тебя не перевели в категорию «Дрыщ года»!',
  'Артемий, уровень тестостерона в организме требует тяжелого железа, а не мягкого дивана. Если сегодня не закроешь тренировку — карточка атлета переходит в статус «Декоративный экспонат». Ноги в кроссовки и вперед!',
  'Артемий, биомеханический датчик показывает нулевую активность в районе грудных и широчайших. В Синдикате дрыщей не держат! Поднимай свой вес и отправляйся доказывать, что в тебе есть стержень!',
  'Экстренное оповещение для Артемия: твои руки по толщине скоро сравняются с кабелями кроссовера. Только прогрессивная сверхнагрузка спасет эту ситуацию. Пора в зал, железо ждет жертв!',
  'Артемий, Создатель Максим уже закрыл свой тоннаж на этой неделе, а ты все еще надеешься накачаться силой мысли? Чудес не бывает — иди ломай гравитацию под грифом!',
  'Артемий, хватит беречь свои связки для пенсии. Сегодня отличный день, чтобы перестать быть худым и наконец заставить весы показать достойную цифру. Марш на тренировку!',
  'Системный протокол PROJECT 417: обнаружен недопустимый уровень лени у резидента @yarvexor. Наказание — 4 подхода тяжелого жима до отказа. Исполнять немедленно!',
  'Артемий, каждый пропущенный подход приближает тебя к статусу манекена. Мышцы растут только от боли и сверхусилий. Вставай, одевайся и двигай в зал, пока штанги не остыли!',
  'Внимание, @yarvexor! Твой метаболизм требует анаболизма. Хватит кормить воздух обещаниями — иди загрузи белки и забей мышцы до каменного состояния. Синдикат ждет отчета!',
  'Артемий, если ты сегодня не придешь в зал, штанга пожалуется на отсутствие нагрузки. Перестань жалеть себя, бери лямки, магнезию и иди пахать как зверь!',
  'Артемий, зеркало в раздевалке ждет твоего триумфа, а не твоих отмазок. Сделай сегодня форму, которой будешь гордиться, а не прятать под оверсайз худи. В бой!',
  'Артемий, формула гипертрофии проста: стимул, механическое напряжение и дисциплина. Хватит быть теоретиком — покажи на практике, на что способен твой корсет!',
  'Артемий, если гравитация сегодня кажется тяжелее обычного — значит, ты слишком долго сидел без дела. В Синдикате слабость лечится только блинами на штанге. Подъем и на тренировку!',
];

export default async function handler(req, res) {
  try {
    const now = new Date();
    // Rotate smoothly by day of year
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
    
    let dayIndex = dayOfYear % MOTIVATION_QUOTES.length;
    if (req.query && req.query.index !== undefined) {
      const parsedIndex = parseInt(req.query.index, 10);
      if (!isNaN(parsedIndex)) {
        dayIndex = Math.abs(parsedIndex) % MOTIVATION_QUOTES.length;
      }
    }

    const quote = MOTIVATION_QUOTES[dayIndex];

    // Preview mode: return quote without sending telegram messages
    if (req.query && (req.query.preview === '1' || req.query.preview === 'true')) {
      return res.status(200).json({
        preview: true,
        quoteIndex: dayIndex,
        totalQuotes: MOTIVATION_QUOTES.length,
        quote,
        target: '@yarvexor',
        time: now.toISOString(),
      });
    }

    const messageText =
      `⚡ <b>PROJECT 417 // УТРЕННИЙ БОЕВОЙ ПИНГ (10:00)</b>\n\n` +
      `${quote}\n\n` +
      `<i>Статус: Синдикат требует явки на тренировку.</i>`;

    // 1. Send motivation to Artemiy (@yarvexor)
    const sendRes = await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ARTEMIY_CHAT_ID,
        text: messageText,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '⚡ Открыть терминал PROJECT 417',
                web_app: { url: WEB_APP_URL },
              },
            ],
          ],
        },
      }),
    });

    const sendResult = await sendRes.json();

    // 2. Notify Creator (Maxim) that motivation was dispatched
    let creatorResult = null;
    try {
      const creatorRes = await fetch(`${API_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CREATOR_CHAT_ID,
          text: `⚡ <b>PROJECT 417 // МОТИВАЦИЯ АРТЕМИЮ ДОСТАВЛЕНА</b>\n\nАртемию (@yarvexor) отправлен утренний разнос:\n<i>"${quote}"</i>`,
          parse_mode: 'HTML',
        }),
      });
      creatorResult = await creatorRes.json();
    } catch (notifyErr) {
      console.warn('Creator notification failed:', notifyErr);
    }

    return res.status(200).json({
      success: true,
      deliveredTo: ARTEMIY_CHAT_ID,
      quoteIndex: dayIndex,
      quoteUsed: quote,
      telegramResponse: sendResult,
      creatorNotified: creatorResult?.ok ?? false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in daily-motivation handler:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
