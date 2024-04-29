from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('OPAICreateConvo/', views.OPAIEndpointCreate, name='OPAI-create'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.signup, name='signup'),
    path('OPAIEndpointExisting/', views.OPAIEndpointExisting, name='OPAI-existing'),
    path('updateTweetConversation/', views.update_tweet_conversation, name='update tweet conversation'),
    path('addTweetConversation/', views.add_tweet_conversation_data, name='add tweet conversation'),
    path('getConversation/', views.get_conversation, name='get conversation'),
    path('conversationList/', views.conversation_list, name='conversation list'),
    path('getTweetData/', views.get_tweet_data, name='get tweet data'),
    path("signup/google/", views.google_oauth2_signup, name="google_signup"),
    path("google/callback/signup", views.google_oauth2_signup_callback, name="google_signup_callback"),
    path("login/google/", views.google_oauth2_login, name="google_login"),
    path("google/callback/login", views.google_oauth2_login_callback, name="google_login_callback"),
    path("getTweetSettings/", views.get_twitter_codes, name="get_tweet_settings"),
    path("setTweetCodes/", views.set_twitter_codes, name="set_tweet_codes"),
    path("getTwitterInfo/", views.get_twitter_info, name="get_twitter_info"),
    path("postTweet/", views.post_tweet, name="post_tweet"),
    path("createTweet/", views.create_tweet, name="create_tweet"),
    path("getUserData/", views.get_user_data, name="get_user_data"),
]