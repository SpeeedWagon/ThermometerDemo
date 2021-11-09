import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [measurements, setMeasurements] = useState(["0", "0"]);
  const [service, setService] = useState<
    BluetoothRemoteGATTService | undefined
  >(undefined);
  useEffect(() => {
    const metricsLoop = async () => {
      while (service) {
        const characteristic = await service?.getCharacteristic(
          "beb5483e-36e1-4688-b7f5-ea07361b26a8"
        );
        const characteristic2 = await service?.getCharacteristic(
          "beb5483e-36e1-4688-b7f5-ea07361b26a9"
        );
        const value = await characteristic?.readValue();
        const value2 = await characteristic2?.readValue();
        setMeasurements([enc.decode(value), enc.decode(value2)]);
      }
    };
    metricsLoop();
  }, [service]);
  const enc = new TextDecoder("utf-8");
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <button
            type="button"
            onClick={async () => {
              const device = await navigator.bluetooth.requestDevice({
                filters: [
                  { services: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"] },
                ],
              });
              const conection = await device.gatt?.connect();
              const service = await conection?.getPrimaryService(
                "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
              );
              setService(service);
            }}
          >
            Get Data
          </button>
          <div>
            <p>
              Oxigenation:{" "}
              {measurements[0].indexOf("-") != -1
                ? "no data yet"
                : measurements[0].slice(0, 5)}
            </p>
            <p>
              Heart rate:{" "}
              {measurements[0].indexOf("-") != -1
                ? "no data yet"
                : measurements[0].slice(5, measurements[0].length)}
            </p>
            <p>Temperature: {measurements[1]}</p>
          </div>
        </p>
      </header>
    </div>
  );
}

export default App;
