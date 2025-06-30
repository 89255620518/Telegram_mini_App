from django.contrib import admin

from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'email',
        'first_name',
        'last_name',
        'phone',
        'date_joined'
    )
    ordering = ('email', )
    search_fields = ('email', 'phone', 'last_name')
    list_filter = ('email', 'first_name', 'last_name', 'phone')


admin.site.register(User, UserAdmin)
