import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 4000;

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
    { command: '/start', description: 'Начать работу с ботом' },
    { command: '/menu', description: 'Посмотреть меню ресторана' },
    { command: '/order', description: 'Сделать заказ' },
    { command: '/delivery', description: 'Условия доставки' },
    { command: '/reserve', description: 'Забронировать столик' },
    { command: '/hall', description: 'Забронировать банкет' },
    { command: '/taxi', description: 'Забронировать такси' },
    { command: '/contacts', description: 'Контактная информация' }
]).then(() => console.log('Командное меню установлено'))
    .catch(console.error);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

// CORS настройки
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

// API endpoint для проверки WebApp данных
app.post('/validate-webapp', (req, res) => {
    const initData = req.body.initData;
    // Здесь должна быть логика валидации данных от Telegram WebApp
    res.json({ valid: true });
});

// Обработчик всех маршрутов для SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const webAppUrl = `${process.env.WEB_APP_URL}?startapp=${chatId}`;

    const welcomeText = `
        🍖 Добро пожаловать в "Дали-Хинкали"!
        Кафе грузинской кухни с летней верандой

        ✨ Главное преимущество:
        🚚 БЕСПЛАТНАЯ ДОСТАВКА по всему Орехово-Зуевскому району!

        ⭐ Другие плюсы:
        • Хинкали ручной лепки
        • Шашлык из мраморной говядины
        • Свежие овощи с местных ферм
        • Уютная летняя веранда

        👇 Нажмите кнопку ниже, чтобы заказать с доставкой или забронировать столик:
    `;

    bot.sendMessage(chatId, welcomeText, {
        reply_markup: {
            inline_keyboard: [[{
                text: '🛍️ Открыть сайт',
                web_app: { url: webAppUrl }
            }]]
        }
    });
});

bot.onText(/\/order/, (msg) => {
    const chatId = msg.chat.id;
    const webAppUrl = `${process.env.WEB_APP_URL}?startapp=${chatId}`;
    bot.sendMessage(chatId, 'Для заказа перейдите в наше веб-приложение:', {
        reply_markup: {
            inline_keyboard: [[{
                text: '🛒 Сделать заказ',
                web_app: { url: webAppUrl }
            }]]
        }
    });
});

bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    const webAppUrl = `${process.env.WEB_APP_URL_MENU}?startapp=${chatId}`;
    bot.sendMessage(chatId, 'Для заказа перейдите в наше веб-приложение:', {
        reply_markup: {
            inline_keyboard: [[{
                text: '🛒 Сделать заказ',
                web_app: { url: webAppUrl }
            }]]
        }
    });
});

bot.onText(/\/delivery/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🚚 Условия доставки:\n\n• Бесплатная доставка по Орехово-Зуевскому району\n• Время доставки: от 60 минут\n • Если хотите узнать подробнее, то можете перейти в наше веб-приложение:', {
        reply_markup: {
            inline_keyboard: [[{
                text: '🛍️ Открыть сайт',
                web_app: { url: webAppUrl }
            }]]
        }
    });
});

bot.onText(/\/reserve/, (msg) => {
    const chatId = msg.chat.id;
    const websiteUrl = `${process.env.WEB_APP_URL}?startapp=${chatId}&section=reserve`;
    bot.sendMessage(chatId, 'Для бронирования столика перейдите в наше веб-приложение:', {
        reply_markup: {
            inline_keyboard: [[{
                text: '🪑 Забронировать столик',
                web_app: { url: websiteUrl }
            }]]
        }
    });
});

bot.onText(/\/hall/, (msg) => {
    const chatId = msg.chat.id;
    const websiteUrl = `${process.env.WEB_APP_URL}?startapp=${chatId}&section=hall`;
    bot.sendMessage(chatId, 'Для бронирования банкета перейдите в наше веб-приложение:', {
        reply_markup: {
            inline_keyboard: [[{
                text: '🪑 Забронировать банкет',
                web_app: { url: websiteUrl }
            }]]
        }
    });
});

bot.onText(/\/taxi/, (msg) => {
    const chatId = msg.chat.id;
    const websiteUrl = `${process.env.WEB_APP_URL}?startapp=${chatId}&section=taxi`;
    bot.sendMessage(chatId, 'Для бронирования такси перейдите в наше веб-приложение:', {
        reply_markup: {
            inline_keyboard: [[{
                text: '🪑 Забронировать такси',
                web_app: { url: websiteUrl }
            }]]
        }
    });
});

bot.onText(/\/contacts/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '📞 Контакты:\n\n📍 Адрес: ул. Ленина, 36А, Орехово-Зуево, Московская обл.\n☎ Телефон: +7 (968) 091-55-51\n🕒 Часы работы: с 11:00 до 23:00');
});

// Обработчик callback от кнопок
bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    bot.answerCallbackQuery(callbackQuery.id);
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    console.log(`WebApp URL: ${process.env.WEB_APP_URL}`);
});