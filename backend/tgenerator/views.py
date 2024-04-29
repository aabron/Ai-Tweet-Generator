from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout, get_user
from django.contrib.auth.models import User
from django.contrib.auth import models
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.core.management import call_command
import requests
import json
import sys, os, base64, datetime, hashlib, hmac 
from .models import Tweet, Image, Conversation, UserProfile
from .serializers import TweetSerializer, ImageSerializer, ConversationSerializer, UserProfileSerializer
from openai import OpenAI
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import parser_classes, permission_classes
from .utils import google_setup, google_callback
from rest_framework.authtoken.models import Token
from django.contrib.auth.decorators import login_required
from requests_oauthlib import OAuth1Session

def index(request):
    tag_to_monitor = 'test'
    
    return JsonResponse({'conversations': 'test'})

#all the following code handles api interactions
#Notes: google login does not work due to client key issues and authorization issues
#everything else works

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([TokenAuthentication])
def set_twitter_codes(request):
        userProfile = UserProfile.objects.filter(user=request.user).first()
        userProfile.twitter_key = request.data.get('twitter_key')
        userProfile.twitter_secret = request.data.get('twitter_secret')
        userProfile.twitter_access_key = request.data.get('twitter_access_key')
        userProfile.twitter_acces_secret = request.data.get('twitter_acces_secret')
        userProfile.save()
        return JsonResponse({'message':"Twitter keys saved successfully"})
    
@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([TokenAuthentication])
def get_twitter_codes(request):
        userProfile = UserProfile.objects.filter(user=request.user).first()
        serializer = UserProfileSerializer(userProfile)
        return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([TokenAuthentication])
def google_oauth2_signup(request):
        redirect_uri = request.build_absolute_uri(reverse("google_signup_callback"))
        return redirect(google_setup(redirect_uri))

@api_view(['POST']) 
@permission_classes([AllowAny])
@authentication_classes([TokenAuthentication])
def google_oauth2_signup_callback(request):
        redirect_uri = request.build_absolute_uri(reverse("google_signup_callback"))
        auth_uri = request.build_absolute_uri()

        user_data = google_callback(redirect_uri, auth_uri)
        user, _ = User.objects.get_or_create(
            email=user_data["email"],
            username=user_data["email"],
            defaults={"first_name": user_data["given_name"]},
        )

        UserProfile.objects.get_or_create(
            user=user, defaults={"google_id": user_data["id"]}
        )

        token, _ = Token.objects.get_or_create(user=user)

        #assume that once we are logged in we should send
        return JsonResponse({"token": token.key})
    
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([TokenAuthentication])
def google_oauth2_login(request):
        redirect_uri = request.build_absolute_uri(reverse("google_login_callback"))
        return redirect(google_setup(redirect_uri))

@api_view(['POST']) 
@permission_classes([AllowAny])
@authentication_classes([TokenAuthentication])
def google_oauth2_login_callback(request):
        redirect_uri = request.build_absolute_uri(reverse("google_login_callback"))
        auth_uri = request.build_absolute_uri()

        user_data = google_callback(redirect_uri, auth_uri)

        try:
            user = User.objects.get(email=user_data["email"])
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "User does not exist. Please sign up first."}, status=400
            )

        #create the auth token for the frontend to use.
        token, _ = Token.objects.get_or_create(user=user)

        #assume that once we are logged in we should send
        return JsonResponse({"token": token.key})

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([TokenAuthentication])
def signup(request):
    if request.method == 'POST':
        name = request.data.get('name')
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        if not (username and email and password):
            return Response({'error': 'Please provide username, email, and password.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.create_user(username=username, email=email, password=password, first_name=name)
            UserProfile.objects.create(user=user, twitter_key='null', twitter_secret='null', username=username, user_name=name)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@parser_classes([JSONParser])
@permission_classes([AllowAny])
@authentication_classes([TokenAuthentication])
def login_view(request):
    #login 
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        return JsonResponse({'token': token.key, 'userprofile': UserProfileSerializer(UserProfile.objects.filter(user=user).first()).data})
    else:
        print("login failed", request)
        return JsonResponse({'message': 'Login failed'}, status=401)

@api_view(['POST'])
@parser_classes([JSONParser])
@permission_classes([AllowAny])
@authentication_classes([TokenAuthentication])
def logout_view(request):
    #logout
    logout(request)
    return JsonResponse({'message': 'Logout successful'})

@api_view(['GET'])
def get_tweet_data(request):
    tweets = Tweet.objects.all()
    serializer = TweetSerializer(tweets, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_user_data(request):
    user = UserProfile.objects.filter(user=request.user).first()
    serializer = UserProfileSerializer(user)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def get_twitter_info(request):
    user = UserProfile.objects.filter(user=request.user).first()
    consumer_key = user.twitter_key
    consumer_secret = user.twitter_secret
    fields = "username,name"
    params = {"user.fields": fields}

    #request token
    request_token_url = "https://api.twitter.com/oauth/request_token"
    oauth = OAuth1Session(consumer_key, client_secret=consumer_secret)

    try:
        fetch_response = oauth.fetch_request_token(request_token_url)
    except ValueError:
        print(
            "There may have been an issue with the consumer_key or consumer_secret you entered."
        )

    resource_owner_key = fetch_response.get("oauth_token")
    resource_owner_secret = fetch_response.get("oauth_token_secret")
    print("Got OAuth token: %s" % resource_owner_key)

    #authorization
    base_authorization_url = "https://api.twitter.com/oauth/authorize"
    authorization_url = oauth.authorization_url(base_authorization_url)
    print("Please go here and authorize: %s" % authorization_url)
    verifier = input("Paste the PIN here: ")

    #access token
    access_token_url = "https://api.twitter.com/oauth/access_token"
    oauth = OAuth1Session(
        consumer_key,
        client_secret=consumer_secret,
        resource_owner_key=resource_owner_key,
        resource_owner_secret=resource_owner_secret,
        verifier=verifier,
    )
    oauth_tokens = oauth.fetch_access_token(access_token_url)

    access_token = oauth_tokens["oauth_token"]
    access_token_secret = oauth_tokens["oauth_token_secret"]

    #make the request
    oauth = OAuth1Session(
        consumer_key,
        client_secret=consumer_secret,
        resource_owner_key=access_token,
        resource_owner_secret=access_token_secret,
    )

    response = oauth.get("https://api.twitter.com/2/users/me", params=params)

    if response.status_code != 200:
        raise Exception(
            "Request returned an error: {} {}".format(response.status_code, response.text)
        )

    print("Response code: {}".format(response.status_code))

    json_response = response.json()

    print(json.dumps(json_response, indent=4, sort_keys=True))
    return JsonResponse(json_response, safe=False)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def post_tweet(request):
    user = UserProfile.objects.filter(user=request.user).first()
    consumer_key = user.twitter_key
    consumer_secret = user.twitter_secret

    # Be sure to add replace the text of the with the text you wish to Tweet. You can also add parameters to post polls, quote Tweets, Tweet with reply settings, and Tweet to Super Followers in addition to other features.
    payload = {"text": f"{request.data.get('tweet_text')}"}

    # Get request token
    request_token_url = "https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write"
    oauth = OAuth1Session(consumer_key, client_secret=consumer_secret)

    try:
        fetch_response = oauth.fetch_request_token(request_token_url)
    except ValueError:
        print(
            "There may have been an issue with the consumer_key or consumer_secret you entered."
        )

    resource_owner_key = fetch_response.get("oauth_token")
    resource_owner_secret = fetch_response.get("oauth_token_secret")
    print("Got OAuth token: %s" % resource_owner_key)

    #authorization
    base_authorization_url = "https://api.twitter.com/oauth/authorize"
    authorization_url = oauth.authorization_url(base_authorization_url)
    print("Please go here and authorize: %s" % authorization_url)
    verifier = input("Paste the PIN here: ")

    #access token
    access_token_url = "https://api.twitter.com/oauth/access_token"
    oauth = OAuth1Session(
        consumer_key,
        client_secret=consumer_secret,
        resource_owner_key=resource_owner_key,
        resource_owner_secret=resource_owner_secret,
        verifier=verifier,
    )
    oauth_tokens = oauth.fetch_access_token(access_token_url)

    access_token = oauth_tokens["oauth_token"]
    access_token_secret = oauth_tokens["oauth_token_secret"]

    #request
    oauth = OAuth1Session(
        consumer_key,
        client_secret=consumer_secret,
        resource_owner_key=access_token,
        resource_owner_secret=access_token_secret,
    )

    #making the request
    response = oauth.post(
        "https://api.twitter.com/2/tweets",
        json=payload,
    )

    if response.status_code != 201:
        raise Exception(
            "Request returned an error: {} {}".format(response.status_code, response.text)
        )

    print("Response code: {}".format(response.status_code))

    #saving the response as JSON
    json_response = response.json()
    # print(json.dumps(json_response, indent=4, sort_keys=True))
    return JsonResponse(json_response, safe=False)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def conversation_list(request):
    conversations = Conversation.objects.filter(user=request.user)
    serializer = ConversationSerializer(conversations, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_conversation(request):
    convo_id = request.GET.get('convo_id')
    conversation = Conversation.objects.filter(id=convo_id).first()
    if conversation:
        serializer = ConversationSerializer(conversation)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({"error": "Conversation not found"}, status=404)

@csrf_exempt
@api_view(['POST'])
@parser_classes([MultiPartParser])
def create_tweet(request):
    parser_classes = (MultiPartParser,FormParser,JSONParser)
    # print(request.FILES)
    # print(request.user.id)
    
    new_tweet = Tweet(
        tweet_text=request.data.get('tweet_text'),
        tweet_date=datetime.datetime.now(),
        tweet_user=request.user,
        tweet_username=request.user.username,
        tweet_user_name=request.user.first_name
    )
    
    new_tweet.save()
        
    serializer = TweetSerializer(new_tweet)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@csrf_exempt
@api_view(['POST'])
@parser_classes([MultiPartParser])
@authentication_classes([TokenAuthentication])
def add_tweet_conversation_data(request):
    parser_classes = (MultiPartParser,FormParser,JSONParser)
    #create a new conversation
    message_array = {
        "messages": [
            {
                "index":"0",
                "sender":"user",
                "content":request.data.get('query')
            },
            {
                "index":"1",
                "sender":"assistant",
                "content":request.data.get('response_payload')
            }
        ]
    }
    
    new_conversation = Conversation(
        messages=message_array['messages'],
        user=request.user
    )
    new_conversation.save()
    serializer = ConversationSerializer(new_conversation)
    
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@parser_classes([MultiPartParser])
@authentication_classes([TokenAuthentication])
def update_tweet_conversation(request):
    try:
        conversation = Conversation.objects.get(id=request.data.get('convo_id'), user=request.user)
        existing_messages = conversation.messages
        
        new_message = {
            "index": str(len(existing_messages)),  
            "sender": request.data.get('sender'),  
            "content": request.data.get('content')  
        }
        
        existing_messages.append(new_message)
        conversation.messages = existing_messages
        conversation.save()
        
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@parser_classes([JSONParser])
@authentication_classes([TokenAuthentication])
def OPAIEndpointCreate(request):
    client = OpenAI(organization='org-2oZsacQ1Ji3Xr0uveLpwg50m', api_key=settings.OPEN_AI_KEY)
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant who generates tweets for the platform X, ALWAYS format your response as follows: '<tweet_text>' with no extra text besides what goes in the tweet"},
            {"role": "user", "content": f"{request.data.get('query')}"}
        ]
    )
    return JsonResponse({'response-payload': response.choices[0].message.content})

@api_view(['POST'])
@parser_classes([MultiPartParser])
@authentication_classes([TokenAuthentication])
def OPAIEndpointExisting(request):
    client = OpenAI(organization='org-2oZsacQ1Ji3Xr0uveLpwg50m', api_key=settings.OPEN_AI_KEY)
    conversation = Conversation.objects.filter(id=request.data.get('convo_id'))
    
    convo_messages = conversation[0].messages
    messages = []
    
    for message in convo_messages:
        lines_message = {"role": message.get('sender'), "content": message.get('content')}
        messages.append(lines_message)
    
    user_message = {"role": "user", "content": request.data.get('query')}
    messages.append(user_message)
    
    response = client.chat.completions.create(
        model="ft:gpt-3.5-turbo-1106:personal::8Lj9L3WV",
        messages=messages
    )
    
    return JsonResponse({'response-payload': response.choices[0].message.content})