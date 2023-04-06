import React from 'react';
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';
import { useState, useEffect } from 'react';

// Random component
const Completionist = () => <></>;

// Renderer callback with condition, hours, minutes, seconds, completed
const renderer = ({
  seconds,
  completed,
}: {
  seconds: number;
  completed: boolean;
}) => {
  if (completed) {
    // Render a complete state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <span>
        Надіслати повторно через {seconds < 10 ? '0' : ''}
        {seconds} секунд
      </span>
    );
  }
};

const getLocalStorageValue = (s: string) => localStorage.getItem(s);

export const CountDownLocalStorage = ({
  seconds,
  storageKey,
  onComplete,
}: {
  seconds: number;
  storageKey: string;
  onComplete: () => void;
}) => {
  const [data, setData] = useState(
    { date: Date.now(), delay: 59000 }, //60 seconds
  );
  const wantedDelay = seconds; //60 s

  //[START] componentDidMount
  //Code runs only one time after each reloading
  useEffect(() => {
    const savedDate = getLocalStorageValue(storageKey);
    if (savedDate != null && !isNaN(savedDate as never)) {
      const currentTime = Date.now();
      const delta = parseInt(savedDate, 10) - currentTime;
      if (delta > wantedDelay) {
        const countDownKey = localStorage.getItem(storageKey);
        if (countDownKey && countDownKey.length > 0)
          localStorage.removeItem(storageKey);
      } else {
        setData({ date: currentTime, delay: delta });
      }
    }
  }, []);

  return (
    <Countdown
      date={data.date + data.delay}
      renderer={renderer}
      onStart={() => {
        if (localStorage.getItem(storageKey) == null)
          localStorage.setItem(
            storageKey,
            JSON.stringify(data.date + data.delay),
          );
      }}
      onComplete={onComplete}
    />
  );
};
