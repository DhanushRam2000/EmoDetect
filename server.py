# -*- coding: utf-8 -*-
"""
Created on Sun Mar 14 19:58:07 2021

@author: Ram
"""

# import the Flask class from the flask module
from flask import Flask, render_template, request, jsonify
import emoDetectV1

# create the application object
app = Flask(__name__,static_url_path="",static_folder="static")

# use decorators to link the function to a url
@app.route('/')
def home():
    return render_template('home.html')  # render a template

@app.route('/emotion', methods = ['POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['image']
      f.save("faceimage.jpg")
      return jsonify(emotion=emoDetectV1.emotion())

# start the server with the 'run()' method
if __name__ == '__main__':
    app.run()