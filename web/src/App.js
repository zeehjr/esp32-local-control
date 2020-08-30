import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [led1, setLed1] = useState(false);
  const [led2, setLed2] = useState(false);
  const [led3, setLed3] = useState(false);

  const [needToSend, setNeedToSend] = useState(false);

  const [fetchingActive, setFetchingActive] = useState(false);

  useEffect(() => {
    axios.get("http://192.168.0.3:3000/web/states").then((res) => {
      const { one, two, three } = res.data;

      setLed1(one === 1);
      setLed2(two === 1);
      setLed3(three === 1);
    });

    setFetchingActive(true);
  }, []);

  useEffect(() => {
    if (!fetchingActive) {
      return;
    }
    const interval = setInterval(() => {
      axios.get("http://192.168.0.3:3000/web/states").then((res) => {
        const { one, two, three } = res.data;

        setLed1(one === 1);
        setLed2(two === 1);
        setLed3(three === 1);
      });
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, [fetchingActive]);

  useEffect(() => {
    if (!needToSend) return;

    setFetchingActive(false);
    setNeedToSend(false);

    axios
      .post("http://192.168.0.3:3000/web/states", {
        one: led1 ? 1 : 0,
        two: led2 ? 1 : 0,
        three: led3 ? 1 : 0,
      })
      .then((res) => {
        const { one, two, three } = res.data;

        setLed1(one === 1);
        setLed2(two === 1);
        setLed3(three === 1);

        setFetchingActive(true);
      });
  }, [needToSend, led1, led2, led3]);

  const handleLed1Click = () => {
    setLed1(!led1);
    setNeedToSend(true);
  };

  const handleLed2Click = () => {
    setLed2(!led2);
    setNeedToSend(true);
  };

  const handleLed3Click = () => {
    setLed3(!led3);
    setNeedToSend(true);
  };

  const buttonStyle = {
    padding: "20px",
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "black",
    border: "2px solid black",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        style={{ ...buttonStyle, backgroundColor: "red" }}
        onClick={handleLed1Click}
      >
        {led1 ? "Desligar" : "Ligar"}
      </button>
      <button
        style={{ ...buttonStyle, backgroundColor: "white" }}
        onClick={handleLed2Click}
      >
        {led2 ? "Desligar" : "Ligar"}
      </button>
      <button
        style={{ ...buttonStyle, backgroundColor: "blue" }}
        onClick={handleLed3Click}
      >
        {led3 ? "Desligar" : "Ligar"}
      </button>
    </div>
  );
}

export default App;
