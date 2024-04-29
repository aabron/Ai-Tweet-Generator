from django.contrib import admin
from .models import Tweet, Image, Conversation, UserProfile

# Register your models here.
admin.site.register(Tweet)
admin.site.register(Image)
admin.site.register(Conversation)
admin.site.register(UserProfile)