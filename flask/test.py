

if __name__ =="__main__":
    BASE_URL = "http://localhost:5000"

    #test /predict
    test = json.dumps([{"X0": 0, "X1": 0, "X2": 0, "X3": 0},
                {"X0": 1, "X1": 3.4, "X2": 2, "X3": 1}])
    response = requests.post("{}/predict".format(BASE_URL), json=test)
    print(response.json())

    #test /retrain
    data = json.dumps([{"X0": -2.5, "X1": 3.0, "X2": 2.1, "X3": -4.3, "Label": 0},
                       {"X0": -2.9, "X1": -1.40, "X2": 1.4, "X3": 3.9, "Label": 1}])
    response = requests.post("{}/retrain".format(BASE_URL), json=data)
    print(response.json())
