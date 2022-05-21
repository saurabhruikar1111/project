from os import symlink
from flask import Flask, render_template, jsonify, request,flash
import mysql.connector as c
from flask_cors import CORS
import yfinance as yf
import mysql.connector as c
import re

con = c.connect(host='database-2.crbfgwhj5p1t.ap-south-1.rds.amazonaws.com',
                user='admin', password='Mydb1234', database='stocks')
if(con.is_connected):
    print('connection succesfull............')
else:
    print('connection failed') 


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY']='key'

@app.route('/')
def originalHome():
    return render_template('home.html')

@app.route('/Comparator')
def Comparator():
    return render_template('Comparator.html')

@app.route('/ContactUs')
def ContactUs():
    return render_template('ContactUs.html')

@app.route('/AboutUs')
def AboutUs():
    return render_template('SwapnilAboutUs.html')

@app.route('/SignUp')
def SignUp():
    return render_template('SignUp.html')

@app.route('/f')  # serach request dropdown
def home():
    data1 = request.args.get('stock_name')
    print(data1)
    cursor = con.cursor()
    new_str = '%' + data1 + '%'
    data = cursor.execute(
        "select name,symbol from equity where name like %s", (new_str,))

    data = cursor.fetchall()
    # print(data)
    info = {}
    if data:
        for entry in data:
            info[entry[0]] = entry[1]
        return jsonify(info)

    
    return jsonify({})


@app.route('/search')  # followup request
def home1():
    data = request.args.get('sym')
    symstr = data+'.NS'
    stockdata = yf.Ticker(symstr)
    params = ['currentPrice', 'pegRatio','debtToEquity', 'ebitdaMargins', 'revenueGrowth']
    params2=['returnOnEquity','targetHighPrice','bookValue','priceToBook','totalCashPerShare']
    params.extend(params2) 
    dic = {}
    for param in params:
        dic[param] = stockdata.info[param] if stockdata.info[param] is not None else 'unknown'

    print(data)
    return jsonify(dic)
regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
def check(email):
 
    # pass the regular expression
    # and the string into the fullmatch() method
    if(re.fullmatch(regex, email)):
        print("Valid Email")
        return True
 
    else:
        print("Invalid Email")
        return False


@app.route('/signup',methods=['POST','GET'])
def signUp():
    print('signup is called') 
    name = request.form.get('name')
    email= request.form.get('email')
    mno= request.form.get('mno')
    print(name,email,mno)
    
    if not check(email):
        flash('invalid email')
        return render_template('SignUp.html')

    if len(mno)!=10:
        flash('invalid mobile no')
        return render_template('SignUp.html')

    if len(name)>20:
        flash('too long name use nickname') 
        render_template('SignUp.html')

    # con2 = c.connect(host='localhost' , user = 'root' , password = 'Saurabh321' , database='new')
    cursor=con.cursor()
    searchquery = 'select * from users where email = %s'
    cursor.execute(searchquery,(email,))
    ans=cursor.fetchall()
    
    if  ans:
        flash(f" {email} aleready exisits try with different email")
        return render_template('SignUp.html')
        
    print(ans)
    
    try:
        query="insert into users(name,email,mobile_no) values(%s,%s,%s)"
        cursor.execute(query,(name,email,int(mno)))
        con.commit()
        flash(f"{name}, you are successfully registered with us!!")
        return render_template('Comparator.html')
    except:
        flash('an unknown error while inserting data in database try again later')
        return render_template('SignUp.html')


        
    
    
    
if __name__=='__main__':
    app.run(port=5000, debug=True)


