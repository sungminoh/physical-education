# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, Response, g, jsonify
from ast import literal_eval as parseJson
import MySQLdb as mdb
from db_info import mysql_conf
from pdb import set_trace as bp
import time


app = Flask(__name__, static_url_path='/static', static_folder='static')


@app.before_request
def before_request():
    g.db = mdb.connect(**mysql_conf())


@app.teardown_request
def teardown_request(exception):
    g.db.close()


@app.route('/')
@app.route('/app1')
@app.route('/app1/game')
@app.route('/app1/history')
@app.route('/app2')
@app.route('/app2/game')
@app.route('/app2/history')
def index():
    return render_template('index.html')


def get_test_id(table):
    cur = g.db.cursor()
    cur.execute('SELECT MAX(test_id) FROM %s' % table)
    max_test_id = cur.fetchone()[0]
    return max_test_id+1 if max_test_id is not None else 1


def convert_to_float_rec(data):
    if hasattr(data, '__iter__'):
        return map(convert_to_float_rec, data)
    else:
        try:
            float_data = float(data)
            return float_data
        except:
            return data


def fetch_data(query, params=None):
    print query
    cur = g.db.cursor()
    if params:
        query = query % tuple(params)
    cur.execute(query)
    return convert_to_float_rec(cur.fetchall())


@app.route('/app1/result', methods=['POST', 'GET', 'DELETE'])
def app1Result():
    if request.method == 'POST':
        request_data = parseJson(request.data)
        target_positions = request_data['targetPositions']
        target_radii = request_data['targetRadii']
        touches = request_data['touches']
        touch_sizes = request_data['touchSizes']
        touch_durations = request_data['touchDurations']
        accuracies = request_data['accuracies']
        delays = request_data['delays']
        count = request_data['count']
        test_id = get_test_id('app1')
        data = [(test_id,
                 target_positions[i][0], target_positions[i][1], target_radii[i],
                 touches[i][0], touches[i][1], touch_sizes[i], touch_durations[i],
                 accuracies[i], delays[i])
                for i in range(count)]
        query = ('INSERT INTO app1 '
                 '(test_id, target_x, target_y, target_r, '
                 'touch_x, touch_y, touch_s, touch_d, '
                 'accuracy, delay) '
                 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ')
        g.db.cursor().executemany(query, data)
        g.db.commit()
        return jsonify(result='success')
    elif request.method == 'GET':
        query = ('SELECT '
                 'test_id, target_x, target_y, target_r, '
                 'touch_x, touch_y, touch_s, touch_d, '
                 'accuracy, delay, ts '
                 'FROM app1 ')
        data = fetch_data(query)
        return jsonify(result=data)
    elif request.method == 'DELETE':
        query = ('DELETE FROM app1')
        g.db.cursor().execute(query)
        g.db.commit()
        return jsonify(result='success')


@app.route('/app1/download', methods=['GET'])
def app1Download():
    if request.method == 'GET':
        current_time_string = time.strftime('%Y-%m-%d %H:%M:%S')
        filename = ('app1(%s)' % current_time_string) + '.csv'

        header = ['test_id', 'target_x', 'target_y', 'target_r',
                  'touch_x', 'touch_y', 'touch_size', 'touch_duration',
                  'error', 'delay', 'timestamp']
        query = ('SELECT '
                 'test_id, target_x, target_y, target_r, '
                 'touch_x, touch_y, touch_s, touch_d, '
                 'accuracy, delay, ts '
                 'FROM app1 ')
        data = fetch_data(query)
        csvData = [','.join(header)]
        csvData.extend([','.join(str(x) for x in entity) for entity in data])
        csvText = '\n'.join(csvData)
        return Response(csvText,
                        mimetype='text/csv',
                        headers={
                            'Content-disposition':
                            'attachment; filename=%s' % filename
                        })


@app.route('/app2/result', methods=['POST', 'GET', 'DELETE'])
def app2Result():
    if request.method == 'POST':
        request_data = parseJson(request.data)
        phone_numbers = request_data['phoneNumbers']
        delays = request_data['delays']
        touch_durations = request_data['touchDurations']
        touch_sizes = request_data['touchSizes']
        accuracies = request_data['accuracies']
        button_widths = request_data['buttonWidths']
        button_heights = request_data['buttonHeights']
        numpad_size = request_data['numpadSize']
        test_id = get_test_id('app2')
        data = [(test_id, phone_numbers[i],
                 touch_sizes[i], touch_durations[i],
                 accuracies[i], delays[i],
                 numpad_size, button_widths[i], button_heights[i])
                for i in range(len(phone_numbers))]
        query = ('INSERT INTO app2 '
                 '(test_id, phone_number, touch_s, touch_d, '
                 'accuracy, delay, numpad, button_w, button_h) '
                 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) ')
        g.db.cursor().executemany(query, data)
        g.db.commit()
        return jsonify(result='success')
    elif request.method == 'GET':
        query = ('SELECT '
                 'test_id, phone_number, touch_s, touch_d, '
                 'accuracy, delay, numpad, button_w, button_h, ts '
                 'FROM app2 ')
        data = fetch_data(query)
        return jsonify(result=data)
    elif request.method == 'DELETE':
        query = ('DELETE FROM app2')
        g.db.cursor().execute(query)
        g.db.commit()
        return jsonify(result='success')


@app.route('/app2/download', methods=['GET'])
def app2Download():
    if request.method == 'GET':
        current_time_string = time.strftime('%Y-%m-%d %H:%M:%S')
        filename = ('app2(%s)' % current_time_string) + '.csv'
        header = ['test_id', 'phone_number', 'touch_size', 'touch_duration',
                  'error', 'delay', 'numpad', 'button_width', 'button_height', 'timestamp']
        query = ('SELECT '
                 'test_id, phone_number, touch_s, touch_d, '
                 'accuracy, delay, numpad, button_w, button_h, ts '
                 'FROM app2 ')
        data = fetch_data(query)
        csvData = [','.join(header)]
        csvData.extend([','.join(str(x) for x in entity) for entity in data])
        csvText = '\n'.join(csvData)
        return Response(csvText,
                        mimetype='text/csv',
                        headers={
                            'Content-disposition':
                            'attachment; filename=%s' % filename
                        })


if __name__ == '__main__':
    app.run(debug=True)
