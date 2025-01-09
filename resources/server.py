from openai import OpenAI

client = OpenAI(api_key="sk-38a0a4eb35c64c659c079e68e70d3504", base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Explain what is regular expression"},
    ],
    stream=False
)

print(response.choices[0].message.content)





