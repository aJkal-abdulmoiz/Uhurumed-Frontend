
export function sortAddress(add) {
  const sortAdd = `${add.slice(0, 6)}...${add.slice(add.length - 4)}`;

  return sortAdd;
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked();
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

export const getTypeLabel = (type) => {
  switch (type) {
  case 'about':
    return 'About Us';
  case 'work':
    return 'Partnerships & Affiliations';
  case 'values':
    return 'Leadership';
  case 'feedback':
    return 'Customer Feedback';
  default:
    return type; // fallback if no match
  }
};

export const getBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    fetch(filePath)
      .then(res => res.blob())
      .then(blob => {
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
  });
};



export const calculateTimeLeft = (endDate) => {
  if (endDate) {
    let difference = endDate * 1000 - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  } else {
    return false;
  }
};


export const getColor= (requestType)=>{
  if (requestType?.toLowerCase().includes('withdraw')) {
    return 'red';
  } else if (
    requestType?.toLowerCase().includes('deposit') 
    ||
    requestType?.toLowerCase().includes('subscription purchase') ||
    requestType?.toLowerCase().includes('renewal')
  ) {
    return '#38c592';
  } else {
    return 'gray';
  }
};


