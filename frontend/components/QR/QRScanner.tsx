import React from 'react';
import { QrReader } from 'react-qr-reader';

export default function QRScanner() {
  const [data, setData] = React.useState('No result');
  const constraints = {};

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.toString());
          }

          if (!!error) {
            null;
          }
        }}
        constraints={constraints}
      />
      <p>{data}</p>
    </>
  );
}
