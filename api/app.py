from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
  return 'Server Works!'
  
@app.route('/greet')
def say_hello():
  return 'Hello from Server'

@app.route('/', methods=['POST'])
def post():
  payload = str(request.get_data())
  print("Received Payload: " + payload)
  return payload
