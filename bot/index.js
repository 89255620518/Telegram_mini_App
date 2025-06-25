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