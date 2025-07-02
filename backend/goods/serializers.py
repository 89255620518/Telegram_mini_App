from rest_framework import serializers, validators

from .models import (Favorite, Goods, Image, Order, OrderItem, Reservation,
                    ShoppingCart)


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('images', )


class GoodsSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    is_favorited = serializers.SerializerMethodField()
    is_in_shopping_cart = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = Goods
        fields = (
            'id',
            'title',
            'description',
            'compound',
            'weight',
            'calories',
            'price',
            'images',
            'count',
            'type',
            'is_favorited',
            'is_in_shopping_cart',
        )

    def in_list(self, obj, model):
        request = self.context.get('request')
        if request is None or request.user.is_anonymous:
            return False
        return model.objects.filter(user=request.user, goods=obj).exists()

    def get_is_favorited(self, obj):
        return self.in_list(obj, Favorite)

    def get_is_in_shopping_cart(self, obj):
        return self.in_list(obj, ShoppingCart)

    def get_type(self, obj):
        return obj.type.name if obj.type else None


class ShortGoodsSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Goods
        fields = (
            'id',
            'title',
            'description',
            'compound',
            'weight',
            'calories',
            'price',
            'images',
            'count',
            'type',
        )


class ShoppingCartSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShoppingCart
        fields = (
            'goods',
            'user',
            'count',
            'price',
        )


class FavoriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Favorite
        fields = (
            'user',
            'goods',
        )
        validators = [
            validators.UniqueTogetherValidator(
                queryset=Favorite.objects.all(),
                fields=('user', 'goods'),
                message='Кий уже добавлен в избранное'
            )
        ]

    def to_representation(self, instance):
        request = self.context['request']
        return ShortGoodsSerializer(
            instance.goods,
            context={'request': request}
        ).data


class OrderItemSerializer(serializers.ModelSerializer):
    goods = GoodsSerializer()

    class Meta:
        model = OrderItem
        fields = (
            'goods',
            'count',
            'price',
        )


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set',
                                many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'user',
            'order_date',
            'total_price',
            'cutlery',
            'delivery_cost',
            'fio',
            'email',
            'address',
            'delivery_time',
            'payment_method',
            'items',
        )


class ReservationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(),
        read_only=True
    )

    class Meta:
        model = Reservation
        fields = (
            'id',
            'user',
            'room_type',
            'table_number',
            'date_time',
            'num_people',
            'email',
            'name',
            'phone',
            'comment',
            'status',
        )
