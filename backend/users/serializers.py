from djoser.serializers import UserCreateSerializer, UserSerializer
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers


class UserCreateSerializer(UserCreateSerializer):
    phone = PhoneNumberField()

    def validate_phone(self, value):
        return value.replace('8', '+7', 1)

    class Meta(UserCreateSerializer.Meta):
        fields = (
            'email',
            'first_name',
            'last_name',
            'floor',
            'intercom',
            'comment',
            'phone',
            'password',
            're_password'
        )


class UserSerializer(UserSerializer):
    phone = PhoneNumberField()

    class Meta(UserSerializer.Meta):
        ref_name = 'CustomUserSerializer'
        fields = (
            'email',
            'first_name',
            'last_name',
            'floor',
            'intercom',
            'comment',
            'phone',
            'delivery_address',
        )


class PhoneNumberSerializerField(PhoneNumberField):
    def to_representation(self, value):
        return super().to_representation(str(value))

    def to_internal_value(self, data):
        try:
            parsed_data = super().to_internal_value(data)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({'phone': e.detail[0]})

        return parsed_data
