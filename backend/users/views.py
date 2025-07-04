import base64

import requests
from django.conf import settings
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from goods.models import Goods
from .backends import PhoneBackend


@method_decorator(csrf_exempt, name='dispatch')
class TokenCreateByPhoneView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        password = request.data.get('password')

        if phone is None or password is None:
            return Response(
                {'message': _('Телефон и пароль являются '
                                'обязательными полями')},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            request,
            phone=phone,
            password=password,
            backend=PhoneBackend()
        )

        if not user:
            return Response({'message': _('Неверный телефон или пароль.')},
                            status=status.HTTP_401_UNAUTHORIZED)

        token, created = Token.objects.get_or_create(user=user)

        return Response({'auth_token': token.key})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_order(request):
    try:
        user = request.user

        address = request.data.get('address', '')
        comments = request.data.get('comments', '')
        description = request.data.get('description', '')
        delivery_time = request.data.get('delivery_time', '')
        goods_ids = request.data.get('goods_id', [])
        count_goods = request.data.get('count_goods', [])
        price_goods = request.data.get('price_goods', [])
        final_price = request.data.get('final_price', '')

        if not all([
            request.data.get('address'),
            request.data.get('delivery_time'),
            request.data.get('goods_id'),
            request.data.get('count_goods'),
            request.data.get('price_goods'),
            request.data.get('final_price')
        ]):
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(set(map(len, [goods_ids, count_goods, price_goods]))) > 1:
            return Response(
                {'error': 'Несовпадение длины массивов данных'},
                status=status.HTTP_400_BAD_REQUEST
            )

        first_name = user.first_name
        last_name = user.last_name
        phone = user.phone
        email_user = user.email

        message = (
            f"ЗАКАЗ НА ДОСТАВКУ ОТ {last_name} {first_name}\n\n"
            f"НАЗВАНИЕ ЗАКАЗА: {description}\n\n"
            f"НОМЕР ТЕЛЕФОНА: {phone}\nПОЧТА: {email_user}\n\nЗАКАЗ:\n"
            f"АДРЕС ДОСТАВКИ:{address}\n"
            f"ДАТА ДОСТАВКИ: {delivery_time}\n"
            f"КОММЕНТАРИИ: {comments}\n\n"
        )

        for i, goods_id in enumerate(goods_ids):
            try:
                goods = Goods.objects.get(pk=goods_id)
                message += (
                    f"ТОВАР {i + 1}:\n"
                    f"НАЗВАНИЕ: {goods.title}\n"
                    f"КОЛИЧЕСТВО: {count_goods[i]}\n"
                    f"ЦЕНА: {price_goods[i]}\n\n"
                )
            except Goods.DoesNotExist:
                message += (
                    f"ТОВАР {i + 1}:\n"
                    f"НАЗВАНИЕ: Товар не найден (ID: {goods_id})\n"
                    f"КОЛИЧЕСТВО: {count_goods[i]}\n"
                    f"ЦЕНА: {price_goods[i]}\n\n"
                )
        message += f"ОБЩАЯ СУММА: {final_price}"
        send_mail(
            f"ЗАКАЗ НА ДОСТАВКУ ОТ {last_name} {first_name}",
            message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.DEFAULT_FROM_EMAIL],
            fail_silently=False,
        )
        return Response({'success': 'Сообщение успешно отправлено'})
    except Exception:
        return Response(
            {'error': 'Internal server error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_preorder(request):
    try:
        user = request.user

        comments = request.data.get('comments', '')
        description = request.data.get('description', '')
        goods_ids = request.data.get('goods_id', [])
        count_goods = request.data.get('count_goods', [])
        price_goods = request.data.get('price_goods', [])
        final_price = request.data.get('final_price', '')

        if not all([
            request.data.get('goods_id'),
            request.data.get('count_goods'),
            request.data.get('price_goods'),
            request.data.get('final_price')
        ]):
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(set(map(len, [goods_ids, count_goods, price_goods]))) > 1:
            return Response(
                {'error': 'Несовпадение длины массивов данных'},
                status=status.HTTP_400_BAD_REQUEST
            )

        goods_list = Goods.objects.filter(pk__in=goods_ids)

        first_name = user.first_name
        last_name = user.last_name
        phone = user.phone
        email_user = user.email

        message = (
            f"Предзаказ ОТ {last_name} {first_name}\n\n"
            f"НАЗВАНИЕ ЗАКАЗА: {description}\n\n"
            f"НОМЕР ТЕЛЕФОНА: {phone}\nПОЧТА: {email_user}\n\n"
            f"КОММЕНТАРИИ: {comments}\n\n"
            f"ЗАКАЗ:\n"
        )

        for i, goods in enumerate(goods_list):
            message += (
                f"ТОВАР {i + 1}:\n"
                f"НАЗВАНИЕ: {goods.title}\n"
                f"КОЛИЧЕСТВО: {count_goods[i]}\n"
                f"ЦЕНА: {price_goods[i]}\n\n"
            )
        message += f"ОБЩАЯ СУММА: {final_price}"
        send_mail(
            f"ПРЕДЗАКАЗ ОТ {last_name} {first_name}",
            message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.DEFAULT_FROM_EMAIL],
            fail_silently=False,
        )
        return Response({'success': 'Сообщение успешно отправлено'})
    except Exception:
        return Response(
            {'error': 'Internal server error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_taxi(request):
    date = request.data.get('date', '')
    time = request.data.get('time', '')
    first_name = request.data.get('first_name', '')
    email_user = request.data.get('email_user', '')
    phone = request.data.get('phone', '')
    address = request.data.get('address', '')
    comment = request.data.get('comment', '')

    # Сообщение для администратора (подробное)
    message_admin = (
        f"🚖 НОВОЕ БРОНИРОВАНИЕ ТАКСИ 🚖\n\n"
        f"👤 Клиент: {first_name}\n"
        f"📞 Телефон: {phone}\n"
        f"📧 Email: {email_user}\n"
        f"📅 Дата: {date}\n"
        f"⏰ Время: {time}\n"
        f"📍 Адрес подачи: {address}\n"
        f"💬 Комментарий: {comment if comment else 'нет комментариев'}\n\n"
        f"ℹ️ Пожалуйста, подтвердите бронирование клиенту как можно скорее."
    )

    # Красивое сообщение для пользователя
    message_user = (
        f"Уважаемый(ая) {first_name},\n\n"
        f"Ваше бронирование такси успешно принято! 🎉\n\n"
        f"🔹 Детали брони:\n"
        f"   📅 Дата: {date}\n"
        f"   ⏰ Время: {time}\n"
        f"   📍 Адрес подачи: {address}\n\n"
        f"Мы свяжемся с вами в ближайшее время для подтверждения.\n\n"
        f"С уважением, Дали-Хинкали"
    )

    # Отправка письма администратору
    send_mail(
        subject=f"🚖 Новое бронирование такси от {first_name}",
        message=message_admin,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.DEFAULT_FROM_EMAIL],
        fail_silently=False,
    )

    # Отправка письма пользователю
    if email_user:
        send_mail(
            subject=f"Подтверждение бронирования такси на {date}",
            message=message_user,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email_user],
            fail_silently=False,
        )

    return Response(
        {'success': 'Сообщения успешно отправлены'},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_banquet(request):
    date_time = request.data.get('date_time', '')
    first_name = request.data.get('first_name', '')
    phone = request.data.get('phone', '')
    email_user = request.data.get('email_user', '')
    hall = request.data.get('hall', '')
    count_people = request.data.get('count_people', '')
    additional_services = request.data.get('additional_services', '')

    if not all((
        date_time,
        first_name,
        phone,
        email_user,
        hall,
        count_people
    )):
        return Response({'Заполните обязательные поля.'}, status=400)

    # Формирование сообщений
    admin_message = (
        f"📋 БРОНИРОВАНИЕ БАНКЕТА ОТ {first_name}\n\n"
        f"📞 НОМЕР ТЕЛЕФОНА: {phone}\n"
        f"📧 ПОЧТА: {email_user}\n"
        f"🏛 ЗАЛ: {hall}\n"
        f"👥 КОЛИЧЕСТВО ГОСТЕЙ: {count_people}\n"
        f"📅 ДАТА И ВРЕМЯ: {date_time}\n\n"
        f"💬 ДОП. УСЛУГИ: {additional_services}"
    )

    user_message = (
        f"👋 Здравствуйте, {first_name}!\n\n"
        f"🎉 Ваш банкет успешно забронирован! 🎉\n\n"
        f"🔍 Детали брони:\n"
        f"🏰 Зал: {hall}\n"
        f"👥 Гостей: {count_people}\n"
        f"📅 Дата и время: {date_time}\n"
        f"💬 Доп. услуги: {additional_services}\n\n"
        f"🌟 Спасибо за выбор нашего заведения! 😊"
    )

    try:
        send_mail(
            f"Бронирование банкета от {first_name}",
            admin_message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.DEFAULT_FROM_EMAIL],
            fail_silently=False,
        )

        send_mail(
            "Подтверждение бронирования банкета",
            user_message,
            settings.DEFAULT_FROM_EMAIL,
            [email_user],
            fail_silently=False,
        )

        return Response({'Сообщение отправлено'}, status=200)
    except Exception:
        return Response({'Ошибка отправки сообщения.'}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_hookah(request):
    hall = request.data.get('hall', '')
    date = request.data.get('date', '')
    time = request.data.get('time', '')
    first_name = request.data.get('first_name', '')
    phone = request.data.get('phone', '')
    count_people = request.data.get('count_people', '')
    comment = request.data.get('comment', '')
    message = (f"БРОНИРОВАНИЕ СТОЛА В КАЛЬЯННОЙ ОТ {first_name}\n\n"
                f"НОМЕР ТЕЛЕФОНА: {phone}\nЗАЛ: {hall}\n"
                f"КОЛИЧЕСТВО ГОСТЕЙ: {count_people}\n"
                f"ДАТА И ВРЕМЯ БРОНИРОВАНИЯ: {date} {time}\n\n"
                f"КОММЕНТАРИЙ: {comment}")
    send_mail(
        f"БРОНИРОВАНИЕ СТОЛА В КАЛЬЯННОЙ ОТ {first_name}",
        message,
        settings.DEFAULT_FROM_EMAIL,
        [settings.DEFAULT_FROM_EMAIL],
        fail_silently=False,
    )
    return Response({'success': 'Сообщение успешно отправлено'})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def payment(request):
    user = "admin"
    password = "1234567Asd!"
    base64_auth = base64.b64encode(f"{user}:{password}".encode()).decode()
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': f'Basic {base64_auth}'
    }
    server_paykeeper = "https://dali-khinkali.server.paykeeper.ru"

    user = request.user
    price = request.data.get('price')
    num_order = request.data.get('num_order', '')
    user_data = request.user
    client_id = user_data.last_name + ' ' + user_data.first_name
    client_email = user_data.email
    service_name = request.data.get('service_name', '')
    client_phone = user_data.phone

    if not price or not num_order or not service_name:
        return Response(
            {'error': 'Отсутствуют обязательные поля в запросе'},
            status=status.HTTP_400_BAD_REQUEST
        )

    payment_data = {
        "pay_amount": int(price),
        "clientid": client_id,
        "orderid": num_order,
        "client_email": client_email,
        "service_name": service_name,
        "client_phone": f"{client_phone}"
    }

    # Готовим первый запрос на получение токена безопасности
    uri = "/info/settings/token/"
    token_response = requests.get(server_paykeeper + uri, headers=headers)
    token_data = token_response.json()

    # В ответе должно быть заполнено поле token, иначе - ошибка
    if 'token' not in token_data:
        return Response({'error': 'Не удалось получить токен'}, status=400)

    token = token_data['token']

    # Готовим запрос 3.4 JSON API на получение счёта
    uri = "/change/invoice/preview/"

    # Формируем список POST параметров
    payment_data['token'] = token
    invoice_response = requests.post(
        server_paykeeper + uri,
        headers=headers,
        data=payment_data
    )
    invoice_data = invoice_response.json()

    # В ответе должно быть поле invoice_id, иначе - ошибка
    if 'invoice_id' not in invoice_data:
        return Response({'error': 'Не удалось получить ID'}, status=400)

    invoice_id = invoice_data['invoice_id']
    # В этой переменной прямая ссылка на оплату с заданными параметрами
    link = f"{server_paykeeper}/bill/{invoice_id}/"

    return Response({'success': f'{link}', 'payment_status': 'success', })
