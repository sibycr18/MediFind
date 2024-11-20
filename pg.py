from meta_ai_api import MetaAI

ai = MetaAI()
response = ai.prompt(message="Give a detailed summary of Apple company.", stream=True)
for r in response:
    print(r)