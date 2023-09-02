import stripe
import os

import ipdb

from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv, find_dotenv


# DB Connection
import mysql.connector
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  database="upi_payment"
)
mycursor = mydb.cursor(buffered=True)




stripe.api_key = "sk_test_51MwjIqSGXC921HlElKIOHY9dorOBqYIl0NxSKtaaTMEvJlLdpuARk7MMVq7P8t3wOoXcLghNpDwyi7wxNeSnXSWz00uQgBInzx"
print(stripe.Plan.list())

app = Flask(__name__)

@app.route('/get-ticket-state', methods = ['POST'])
def get_ticket_state():
    data = request.json
    sql = f"Select * from transaction where User = 1 and Source = {data['source']} and Destination = {data['destination']} and Route = {data['route']}"
    mycursor.execute(sql)
    transactions = mycursor.fetchall()
    print(transactions)
    if(len(transactions) == 0):
        return jsonify({"ticket_state" : 0})
    # ipdb.set_trace()
    
    return jsonify({"ticket_state" : transactions[0][4]})
    



@app.route('/validate-ticket', methods = ['POST'])
def consume_ticket():
    data = request.json
    # ipdb.set_tra
    sql = f"Select * from transaction where User = 1 and Source = {data['source']} and Destination = {data['destination']} and Route = {data['route']}"
    mycursor.execute(sql)
    transactions = mycursor.fetchall()
    print(transactions)
 
    if len(transactions) == 0 :
        return jsonify({"state_response" : 0})
    else:
        print("updated here")
        sql = f"update transaction set status = 0 where User = 1 and Source = {data['source']} and Destination = {data['destination']} and Route = {data['route']}"
        mycursor.execute(sql)   
        mydb.commit()
 
    return jsonify({"state_response" : 1})    
    

@app.route('/add-ticket', methods = ['POST'])
def insertRecord():
        
        
    data = request.json
    sql = f"INSERT INTO transaction (User, Source, Destination, Route, Status) VALUES (1, {data['source']}, {data['destination']}, {data['route']}, 1)"
    # # val = (1, 2, 5, 4, 1)
    mycursor.execute(sql)   
    mydb.commit()
 
    # ipdb.set_trace()
    print(sql)
 
    return "hello"


@app.route('/')
def index():
    return stripe.Plan.list()

@app.route('/get-tickets', methods=['POST'])
def get_tickets():
    
    mycursor.execute("SELECT * FROM transaction")
    transactions = mycursor.fetchall()
 
    # ipdb.set_trace()
    print(transactions)
    
 
    return jsonify({"tickets" : transactions})

@app.route('/payment-sheet', methods=['POST'])
def payment_sheet():

    
    print(request.json)
    # ipdb.set_trace()
    # Set your secret key. Remember to switch to your live secret key in production.
    # See your keys here: https://dashboard.stripe.com/apikeys
    stripe.api_key = 'sk_test_51MwjIqSGXC921HlElKIOHY9dorOBqYIl0NxSKtaaTMEvJlLdpuARk7MMVq7P8t3wOoXcLghNpDwyi7wxNeSnXSWz00uQgBInzx'
    # Use an existing Customer ID if this is a returning customer
    customer = stripe.Customer.create(
        name="Jenny Rosen",
        address={
            "line1": "510 Townsend St",
            "postal_code": "98140",
            "city": "San Francisco",
            "state": "CA",
            "country": "US",
        },
    )

    ephemeralKey = stripe.EphemeralKey.create(
        customer=customer['id'],
        stripe_version='2022-11-15',
    )
    paymentIntent = stripe.PaymentIntent.create(
        amount=100+request.json['price']*100,
        currency='inr',
        customer=customer['id'],
        description="Software development services",
        automatic_payment_methods={
            'enabled': True,
        },
    )

    print(paymentIntent)
    return jsonify(paymentIntent=paymentIntent.client_secret,
                   ephemeralKey=ephemeralKey.secret,
                   customer=customer.id,
                   publishableKey='pk_test_51MwjIqSGXC921HlEuJpzifXA235k4a2G5GlhAQxyYdyXm2YfuqVLlY74Pm3oDXfMZngpuizJ8mzmMHWNLarsCXWW00JwrSd0It')







app.run(port=4242, host='0.0.0.0')
