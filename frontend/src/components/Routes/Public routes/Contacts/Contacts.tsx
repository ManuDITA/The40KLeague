import React, { useEffect, useState } from 'react'; // Add this import statement for React
import User from '../../Private routes/user';
import { Auth } from 'aws-amplify'

function Contacts() {

  useEffect(() => {
    getToken();
  }, [])

  const [outputString, setOutputString] = useState('')

  const getToken = async () => {
    const session = Auth.currentSession();
    //console.log(session);

    const token = (await session).getIdToken().getJwtToken();

    fetch('https://iw5168sfve.execute-api.eu-west-3.amazonaws.com/dev/user', {
      method: 'GET',
      headers: {
        'Authorization': "eyJraWQiOiJGN0Z1VVNaOFVDQW5mQTRKMWVcL1lCM1JQZmZXelR4VWp1RnBoZ0pQZ1BUST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxYjdhMWY4NC1jYWM3LTQzMDEtYWU0My02ODYxYjQ3OTBlOTMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMy5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTNfZ0VrcFZESW9qIiwiY29nbml0bzp1c2VybmFtZSI6IjFiN2ExZjg0LWNhYzctNDMwMS1hZTQzLTY4NjFiNDc5MGU5MyIsIm9yaWdpbl9qdGkiOiIxMDNhMGE3Ny1iNDc3LTQ5MGEtOTcyNS03OGU0YTgyZjQxMDkiLCJhdWQiOiIxNDB2OTBmN2lldTFzdXI2cGNjamgxcnU0cCIsImV2ZW50X2lkIjoiYWM2NDY0MDMtODZiMS00MjI2LWEwNzYtOGNmZGUwNGY4MTU5IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2OTk4MzQzMDQsIm5pY2tuYW1lIjoiTWFudURJVEEiLCJleHAiOjE2OTk4Mzc5MDQsImlhdCI6MTY5OTgzNDMwNCwianRpIjoiNjJmMzljOWYtY2I1MS00ZTliLWExNGYtODcyNmNjYjJjMzkwIiwiZW1haWwiOiJlbWFudWVsZXNpbWVvbmUwQGdtYWlsLmNvbSJ9.wCxnDOYYhLcFrCtLby11QM59EFb7lyPZPoPjVZuXXMmcE7yxf432pZDPaO48Dn3JnZf0rglSeNa4I__LxSHtrYl-7zcmpNtqY2T78J7HkiVtHwkormiL5ih0yoIruc6y2fuHsFaJP_Qh6h0kCOrbUF7o6q8tgy9qLHJog0PIZ11NQm8uGcCH9VLs3Q1RxnTxAXgrA_U89xHnj9gSqQ-x_dht1R07FAE9v2CLH2-58IWtAh9sW-mA3CHAqxzFaCJxkX-7w0a2XV-jNEzprDSv8z8n_-tMVjAlgqLe_9kFBsQbH7JV_kBtamrI7DtR0m57utOvOk70k8H_rnZ5vD7HEw"
      }
    }
    ).then((res) => (res.json())).then((out) => {
      console.log(out.myObject)
      setOutputString(out.myObject)
    })
  }

  return (
    <div>
      <h1>Hello</h1>
      {outputString}
    </div>
  );
}

export default Contacts;
