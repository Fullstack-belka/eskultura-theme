
import { classifyForm } from './common/utils/form-utils';



// Check nested object for value 
var checkNested = function(obj, key) {
    return key.split(".").reduce(function(o, x) {
      return (typeof o == "undefined" || o === null) ? o : o[x];
  }, obj);
  };

  // WhatsApp Button Redirect Function
  var whatsAppButtonRedirect = function(e) {
    e.preventDefault();
  
    fetch('/content/whatsapp-identify.json')
      .then(res => res.json())
      .then(data => {
        const whatsAppDispatcherValues = data;
        const whatsAppOrganicValues = data.organic;
        const whatsAppUtmsValues = data.utms;
        const whatsAppMessageUrl = `https://api.whatsapp.com/send?phone=19396083102&text=`;
        let whatsAppEmoji = whatsAppDispatcherValues.direct || '';
        let whatsAppBaseMessage  = '';
        // get query params
        const queryString = window.location.search.substring(1);
        const queryParams = queryString ? JSON.parse(`{"${decodeURI(queryString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"')}"}`) : null;
  
        // get product / landing data        
        const landingTitle = $('.page-product .productView-title').html()
  
        // get referrer
        const getReferrer = document.referrer;
  
        if ( checkNested(queryParams, 'utm_source') &&  checkNested(queryParams, 'utm_medium')) {
          for (var i = 0; i < whatsAppUtmsValues.length; i++) {
              if (whatsAppUtmsValues[i].utm_source === queryParams.utm_source && whatsAppUtmsValues[i].utm_medium === queryParams.utm_medium) {
                whatsAppEmoji = whatsAppUtmsValues[i].name;
              }
          }
        } else if (getReferrer) {
          for (var i = 0; i < whatsAppOrganicValues.length; i++) {
            if (getReferrer.includes(whatsAppOrganicValues[i].source)) {
              whatsAppEmoji = whatsAppOrganicValues[i].name;
            }
          }
        }
   
        if (landingTitle) {
          whatsAppBaseMessage = `¡Hola Eskultura! +${whatsAppEmoji}+quiero+más+información+del+${encodeURIComponent(landingTitle).replace(/%20/g,'+')}%21`;
        } else {
          whatsAppBaseMessage = `¡Hola Eskultura! +${whatsAppEmoji}+ quiero contactarme con ustedes`;
        }
      
        window.location.href = `${whatsAppMessageUrl}${whatsAppBaseMessage}`;

      })
      .catch(err => console.error(err));
  };
  
  
  
  var whatsAppFloatingButton = document.getElementById('whatsAppFloatingButton');
  whatsAppFloatingButton.addEventListener("click", whatsAppButtonRedirect);
  

  $( document ).ready(function() {
    console.log( "ready!" );
});