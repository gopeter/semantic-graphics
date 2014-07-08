import os
import json
from rdflib import Graph
from flask import Flask, jsonify, render_template, request

################################################################################
# Init
################################################################################

app = Flask(__name__)

################################################################################
# Query SVG
################################################################################

@app.route('/query', methods = ['POST'])
def queryData():

  p_filename = request.form['filename']

  g = Graph()
  if not p_filename:
    g.parse('static/images/truck.svg', format = 'rdfa')
  else:
    g.parse('static/images/' + p_filename, format = 'rdfa')  

  results = []  
  for s, p, o in g:
    results.append([s, p, o])
  
  return json.dumps(results)
  
################################################################################
# Serve SVG files
################################################################################

@app.route('/svg/<filename>', methods = ['GET'])
def maps(filename):
  return app.send_static_file('images/' + filename)

################################################################################
# Serve index file
################################################################################

@app.route('/', methods = ['GET'])
def index():
  return render_template('index.html')
  
################################################################################
# Start app
################################################################################
 
if __name__ == '__main__':
  app.run(debug=True)