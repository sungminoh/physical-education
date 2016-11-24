# -*- coding: utf-8 -*-

from flask import Flask, render_template, request
from ast import literal_eval as parseJson
from pdb import set_trace as bp


app = Flask(__name__)


@app.before_request
def before_request():
    pass


@app.teardown_request
def teardown_request(exception):
    pass


@app.route('/')
@app.route('/app1')
@app.route('/app2')
def index():
    return render_template('index.html')


@app.route('/result', methods=['POST', 'GET'])
def result():
    if request.method == 'POST':
        try:
            target_positions = parseJson(request.form['targetPositions'])
            target_positions = [(target_positions[i], target_positions[i+1])
                                for i in range(0, len(target_positions), 2)]
            target_radii = parseJson(request.form['targetRadii'])
            accuracies = parseJson(request.form['accuracies'])
            delays = parseJson(request.form['delays'])
        except BaseException:
            pass
        return 'post'
    elif request.method == 'GET':
        return 'get'


if __name__ == '__main__':
    app.run(debug=True)
