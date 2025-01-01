import React, { useState, useEffect } from 'react';

const Adv = () => {
  const messages = [
    "10 % discount till Dec 10",
    "Buy 2 GET 1 free",
    "Happy sales for women day"
  ]

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(()=>{
    const interval = setInterval(() =>{
      setCurrentMessage((previousMessage)=>
        previousMessage === messages.length - 1 ? 0 : previousMessage + 1)
    },5000)

    return () => clearInterval(interval)
  },[messages.length])

   


  return (
    <div className="bg-white text-black py-3 text-center">
      <p className="animate-fade">{messages[currentMessage]}</p>
    </div>
  );
};

export default Adv;
