��#� �t�e�s�t�2�
�
�



import functions_framework
from io import StringIO
import pandas as pd
from google.cloud import storage
import json

storage_client = storage.Client()
bucket_name = 'joeltestfiles'
BUCKET = storage_client.get_bucket(bucket_name)

@functions_framework.http
def readcsv(request):

    request_json = request.get_json(silent=True)
    request_args = request.args
    if request_json and 'action' in request_json:
       action = request_json['action']
    elif request_args and 'action' in request_args:
       action = request_args['action']
    else:
       action = '2021-05-09'

    filename = 'bikedata/' + action + '.csv'

    blob = BUCKET.get_blob(filename)
    csv_content = blob.download_as_string().decode("utf-8")
    df = pd.read_csv(StringIO(csv_content))

    json_data = df.to_json(orient='index')

    headers= {
      'Access-Control-Allow-Origin': '*',
      'Content-Type':'application/json'
    }
    return (json_data, 200, headers)



