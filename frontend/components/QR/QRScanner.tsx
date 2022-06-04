import React from 'react';
import QrScan from 'react-qr-scanner';

export default function QRScanner() {
  const [qrScan, setQrScan] = React.useState('');
  const handleScan = (data) => {
    if (data) {
      setQrScan(data);
      console.log(data);
    }
  };

  console.log(qrScan);

  return (
    <div>
      <QrScan
        delay={300}
        onError={(err) => console.log(err)}
        onScan={handleScan}
        style={{ height: 240, width: 320 }}
      />
    </div>
  );
}
