#!/usr/bin/env bash

# POST method retrain

# POST method predict
curl -d '[
  {"text": "Re: Midterm Conflicts -- Qingen  hi ,  unfortunately, the physics midterm is 6-8pm. there is still a period of overlap with the dsp time (5-7pm), unless the exam time is changed. i m afraid we have to figure another way out.  best, qingen"}
]' -H "Content-Type: application/json" \
     -X POST http://127.0.0.1:5000/predict

