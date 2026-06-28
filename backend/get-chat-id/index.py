import os
import json
import urllib.request

def handler(event: dict, context) -> dict:
    """Получает последние обновления бота для определения chat_id"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }

    token = os.environ['TELEGRAM_BOT_TOKEN']
    url = f"https://api.telegram.org/bot{token}/getUpdates"

    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())

    updates = result.get('result', [])
    chats = []
    for upd in updates:
        msg = upd.get('message', {})
        chat = msg.get('chat', {})
        if chat:
            chats.append({
                'chat_id': chat.get('id'),
                'username': chat.get('username'),
                'first_name': chat.get('first_name'),
            })

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'chats': chats})
    }
