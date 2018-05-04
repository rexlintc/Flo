#references : https://www.wintellect.com/creating-machine-learning-web-api-flask/
#https://github.com/amirziai/sklearnflask

from flask import Flask, jsonify, request
from sklearn.ensemble import RandomForestClassifier
from sklearn.externals import joblib
import pandas as pd
import nltk
from keras.preprocessing import sequence
import keras
import pickle
import operator

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello! This is an email reply bot :)'

@app.route('/predict', methods=["POST"])
def predict():
    if request.method == "POST":
        json_ = request.json
        print(json_)
        try:
            sentence = json_[0]["text"]
            label = predict_email_label(sentence)
            return jsonify({'label': label})
        except ValueError:
            return jsonify("Please send a json file in format {'text': .....}")

def predict_email_label(sentence):

    def clean_txt(data):
        return [nltk.word_tokenize(x.decode('utf-8').strip()) for x in data]

    def convert_data(data, vocabulary, max_length=500):
        return sequence.pad_sequences([[vocabulary[word] if word in vocabulary else vocabulary['unk'] for word in sent]
                                       for sent in data], maxlen=max_length)

    def predict_single(s):
        x = convert_data(clean_txt([s]), vocabulary)
        probas = {invlabmap[i]: p for i, p in enumerate(model.predict(x)[0])}
        category = max(probas.iteritems(), key=operator.itemgetter(1))[0]
        return (category)

    with open('vocab.pkl', 'rb') as pfile:
        vocabulary, vocabulary_inv, labmap, invlabmap = pickle.load(pfile)

    model = keras.models.load_model('bilstm.h5')
    label = predict_single(sentence)
    return label

if __name__ == '__main__':
    app.run(debug=True)

