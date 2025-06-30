from django.contrib import admin

from .models import DishType, Goods, Image, Order, Promotion, Reservation


class PostImageAdmin(admin.StackedInline):
    model = Image


@admin.register(DishType)
class DishTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(Goods)
class GoodsAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'title',
        'compound',
        'weight',
        'calories',
        'price',
    )
    inlines = [PostImageAdmin]
    ordering = ('title', )
    search_fields = ('title', 'price', 'type',)
    list_filter = ('price', 'type',)


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    pass


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'user',
        'order_date',
        'total_price',
        'cutlery',
        'delivery_cost'
    )
    ordering = ('-order_date',)
    search_fields = ('user',)
    list_filter = ('order_date', 'total_price',)


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'date_time',
        'room_type',
        'table_number',
        'num_people',
        'phone',

    )
    list_filter = ('table_number', 'room_type', 'date_time')
    search_fields = ('user__email', )
