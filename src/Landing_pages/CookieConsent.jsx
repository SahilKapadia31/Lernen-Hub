import { useEffect } from 'react';

const CookieConsent = () => {
  useEffect(() => {
    const iubendaConfigScript = document.createElement('script');
    iubendaConfigScript.type = 'text/javascript';
    iubendaConfigScript.innerHTML = `
      var _iub = _iub || [];
      _iub.csConfiguration = {
        "lang": "en",
        "siteId": "3777357",  
        "cookiePolicyId": "67735824", 
        "banner": {
          "acceptButtonDisplay": true,
          "customizeButtonDisplay": true,
          "position": "bottom", 
          "acceptButtonColor": "#0073CE",
          "rejectButtonColor": "#CCC",
          "textColor": "#FFF",
          "backgroundColor": "#000" 
        }
      };
    `;

    const iubendaExternalScript = document.createElement('script');
    iubendaExternalScript.src = "https://cdn.iubenda.com/cs/iubenda_cs.js"; 
    iubendaExternalScript.async = true;

    document.head.appendChild(iubendaConfigScript);
    document.head.appendChild(iubendaExternalScript);

    return () => {
      document.head.removeChild(iubendaConfigScript);
      document.head.removeChild(iubendaExternalScript);
    };
  }, []);

  return null; 
};

export default CookieConsent;



