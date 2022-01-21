from django.shortcuts import render
from django.views.generic.base import View
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
# import speech_recognition as sr
# import sounddevice as sd
# import wavio as wv

# Create your views here.
class Home(View):
    def get(self, request):
        context = {}
        return render(request, 'index.html', context)

class Contact(View):
    def get(self, request):
        context = {'title': 'Get in touch', 'message': 'We’d love to hear from you.'}
        return render(request, 'contact.html', context)

class Support(View):
    def get(self, request):
        context = {}
        return render(request, 'support.html', context)

class AboutUs(View):
    def get(self, request):
        context = {'title': 'Our Story'}
        return render(request, 'about.html', context)

class Chat(View):   
    # chatterbot = ChatBot(**settings.CHATTERBOT)
    chatterbot = getattr(settings, "BOT")

    @method_decorator(csrf_exempt)
    def post(self, request):
        input_data = request.body.decode('utf-8')
        if not input_data:
            return JsonResponse({
                'text': [
                    'The attribute "text" is required.'
                ]
            }, status=400)

        response = self.chatterbot.get_response(input_data)
        response_data = response.serialize()

        return JsonResponse(response_data, status=200)
    
    def get(self, request, *args, **kwargs):
        """
        Return data corresponding to the current conversation.
        """
        return JsonResponse({
            'name': self.chatterbot.name
        })

class Speech(View):
    @method_decorator(csrf_exempt)
    def post(self, request):
        # r = sr.Recognizer()
        # fs = 44100
        # seconds = 6.0
        # recording = sd.rec(int(seconds * fs), samplerate=fs, channels=2)
        # sd.wait()
        # wv.write("file.wav", recording, fs, sampwidth=2)
        # audio = sr.AudioFile("file.wav")
        # with audio as source:
        #     audio = r.record(source)
        #
        # return JsonResponse(r.recognize_google(audio), status=200, safe=False)
        return JsonResponse({
            'name': 'speech'
        })

    def get(self, request, *args, **kwargs):
        """
        Return data corresponding to the current conversation.
        """
        return JsonResponse({
            'name': 'speech'
        })