��#� �t�e�s�t�2�
�
�

```

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

```

dada

```

import pandas as pd
import json
import numpy as np
df = pd.read_csv(r"C:\Users\joel_\Downloads\Helsingin_ja_Espoon.csv")
df = df.set_index('ID')
# Convert the DataFrame to a JSON object
json_data = df.to_json(orient='index')
# Open the file for writing
with open("stations_HelsinkiEspoo.json", "w") as f:
    # Write the JSON object to the file
    json.dump(json_data, f)
    
```
    
    from datetime import datetime

df5 = pd.read_csv(r"C:\Users\joel_\Downloads\2021-05.csv")
df6 = pd.read_csv(r"C:\Users\joel_\Downloads\2021-06.csv")
df7 = pd.read_csv(r"C:\Users\joel_\Downloads\2021-07.csv")

df_all = pd.concat([df5, df6])
df_all = pd.concat([df_all, df7])
#startmonth = 5
startyear = 2021
dayinmonth=[31,30,31]
for startmonth in range(5,7):
    for startday in range(1,dayinmonth[startmonth-5]+1):
        df=df_all
        df = df.drop(columns=['Departure station name','Return station name'])
        start_time = pd.to_datetime(str(startyear) +"-" + str(startmonth).zfill(2) + "-" + str(startday).zfill(2) + "T00:00:00")
        end_time = pd.to_datetime(str(startyear) +"-" + str(startmonth).zfill(2) + "-" + str(startday).zfill(2) + "T23:59:59")
        df['Departure2'] = pd.to_datetime(df['Departure'])
        df = df[(df['Departure2'] >= start_time) & (df['Departure2'] <= end_time)]

        mask = df.duplicated()
        df = df[~mask]
        delrows = []
        relreason = []

        for index, row in df.iterrows():
            if df['Covered distance (m)'][index]<10 or df['Duration (sec.)'][index]<10:
                delrows.append(index)
                relreason.append(1)
            start_time = datetime.fromisoformat(df['Departure'][index]).timestamp()    
            end_time = datetime.fromisoformat(df['Return'][index]).timestamp()         
            if start_time>end_time:
                delrows.append(index)
                relreason.append(2) 

            depstatval=df['Departure station id'][index]                
            if not (isinstance(depstatval, (int, np.int64)) and depstatval > 0):
                delrows.append(index)
                relreason.append(3) 
            retstatval=df['Return station id'][index]                
            if not (isinstance(retstatval, (int, np.int64)) and retstatval > 0):
                delrows.append(index)
                relreason.append(4)         

        df.drop(delrows, inplace=True) 

        df = df.drop(columns=['Return','Departure2'])
        df = df.iloc[::-1] # time goes up down
        # shorter names better for json
        df = df.rename(columns={'Departure station id': 'did', 'Return station id': 'rid', 'Covered distance (m)': 'dis', 'Duration (sec.)': 'time'}) 
        df['dis'] = (df['dis']/1000).round(1) # distance in km with one decimal
        df['time'] = (df['time']/60).round().astype(int) # time in min no decimal
        df = df.reset_index(drop=True) 

        if not df.empty:
            filename='bikedata2/' + str(startyear) +"-" + str(startmonth).zfill(2) + "-" + str(startday).zfill(2) + '.json'
            with open(filename, "w") as f:
                json_data = df.to_json(orient='index')
                json.dump(json_data, f)
            
            #filename='bikedata1/' + str(startyear) +"-" + str(startmonth).zfill(2) + "-" + str(startday).zfill(2) + '.csv'
            #df.to_csv(filename, index=False)
            
            






