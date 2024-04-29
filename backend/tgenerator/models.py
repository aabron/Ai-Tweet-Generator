from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

#models for each image and each tweet
class Tweet(models.Model):
    tweet_text = models.CharField(max_length=280, null=True, blank=True)
    tweet_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    tweet_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    tweet_profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    tweet_username = models.CharField(max_length=50, null=True, blank=True)
    tweet_user_name = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return self.tweet_text  

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    user_name = models.CharField(max_length=255, null=True)
    twitter_key = models.CharField(max_length=255, null=True)
    twitter_secret = models.CharField(max_length=255, null=True)
    twitter_access_key = models.CharField(max_length=255, null=True)
    twitter_acces_secret = models.CharField(max_length=255, null=True)
    username = models.CharField(max_length=255, null=True)
    
    def __str__(self):
        return self.username  
    
class Image(models.Model):
    business = models.ForeignKey(User, related_name='images', on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='business_images/')
    
class Conversation(models.Model):
    messages = models.JSONField()  #field to store the entire conversation as a list of messages
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  #user who initiated the conversation
    timestamp = models.DateTimeField(auto_now_add=True)  # timestamp of the conversation

    def __str__(self):
        return f"Conversation {self.id}"
