import requests
import json

url = "http://localhost:3000/api/ip-data"
data = {"ip": "42.104.156.13"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, data=json.dumps(data), headers=headers)

print(response.json())
