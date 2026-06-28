import os
import json
import urllib.request
import urllib.parse

def handler(event: dict, context) -> dict:
    """Отправляет заполненную анкету в Telegram бот"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))

    nickname = body.get('nickname', '—')
    age = body.get('age', '—')
    username = body.get('username', '—')
    hobbies = body.get('hobbies', '—')
    how_found = body.get('howFound', '—')
    expectations = body.get('expectations', '—')
    characters = body.get('characters', '—')

    text = (
        "🐾 *Новая анкета — The Flock of Heavenly Creators*\n\n"
        f"*1. Кличка:* {nickname}\n"
        f"*2. Возраст:* {age}\n"
        f"*3. Юзернейм:* {username}\n"
        f"*4. Хобби и увлечения:*\n{hobbies}\n\n"
        f"*5. Как узнал о стае:*\n{how_found}\n\n"
        f"*6. Ожидания от стаи:*\n{expectations}\n\n"
        f"*7. Любимые персонажи из «Дом, в котором…»:*\n{characters}"
    )

    token = os.environ['TELEGRAM_BOT_TOKEN']
    chat_id = os.environ['TELEGRAM_CHAT_ID']

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = json.dumps({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }).encode('utf-8')

    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
