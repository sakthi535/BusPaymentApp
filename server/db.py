import mysql.connector


from flask import Flask

app = Flask(__name__)

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  database="upi_payment"
)

mycursor = mydb.cursor()


mycursor.execute("SELECT * FROM transaction")
transactions = mycursor.fetchall()

mycursor.execute("SELECT * FROM Routes")
routes = mycursor.fetchall()

myresult = transactions

for x in myresult:
  print(x)
  print(routes[x[-1]])
# for x in routes:
#   print(x)


@app.route('/')
def insertRecord():
        
    sql = "INSERT INTO transaction (User, Source, Destination, Route, Status) VALUES (1, 2, 5, 4, 1)"
    mycursor.execute(sql)   
    mydb.commit()
 
    return "hello"

app.run(port=4343, host='0.0.0.0')
