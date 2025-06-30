from django_filters.rest_framework import FilterSet, RangeFilter, filters

from .models import Goods


class GoodsFilter(FilterSet):
    title = filters.CharFilter(
        lookup_expr='icontains',
        field_name='title'
    )
    description = filters.CharFilter(
        lookup_expr='icontains',
        field_name='description'
    )
    compound = filters.CharFilter(
        lookup_expr='icontains',
        field_name='compound'
    )
    weight = filters.NumberFilter(
        lookup_expr='exact',
        field_name='weight'
    )
    calories = filters.NumberFilter(
        lookup_expr='exact',
        field_name='calories'
    )
    price = RangeFilter(field_name='price')
    type = filters.CharFilter(
        lookup_expr='icontains',
        field_name='type__name'
    )
    promotion = filters.CharFilter(
        lookup_expr='icontains',
        field_name='promotion__name'
    )
    is_favorited = filters.BooleanFilter(method='get_is_favorited')
    is_in_shopping_cart = filters.BooleanFilter(
        method='get_is_in_shopping_cart'
    )

    def get_is_in_shopping_cart(self, queryset, name, value):
        if self.request.user.is_authenticated and value is True:
            return queryset.filter(shopping_cart_goods__user=self.request.user)
        return queryset

    def get_is_favorited(self, queryset, name, value):
        if self.request.user.is_authenticated and value is True:
            return queryset.filter(users_favorites__user=self.request.user)
        return queryset

    class Meta:
        model = Goods
        fields = (
            'title',
            'description',
            'compound',
            'weight',
            'calories',
            'price',
            'type',
            'promotion',
            'is_favorited',
            'is_in_shopping_cart'
        )
