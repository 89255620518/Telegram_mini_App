import phonenumbers
from django.core.exceptions import ValidationError


def validate_phone_number(value):
    try:
        parsed_phone = phonenumbers.parse(value, None)
        if not phonenumbers.is_valid_number(parsed_phone):
            raise ValidationError('Неправильный номер телефона')
    except phonenumbers.NumberParseException:
        raise ValidationError('Неправильный номер телефона')
