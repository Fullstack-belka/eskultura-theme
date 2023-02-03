
import { classifyForm } from './common/utils/form-utils';

  // WhatsApp Button Redirect Function
  var whatsappRedirect  = function(e) {
    e.preventDefault();
  
    fetch('/content/whatsapp-identify.json')
      .then(res => res.json())
      .then(data => {


        const whatsAppDispatcherValues = data;
        const whatsAppOrganicValues = data.organic;
        const whatsAppUtmsValues = data.utms;
        let selectedNumber = '+19396083102';
        const whatsAppMessageUrl = `https://api.whatsapp.com/send?phone=${selectedNumber}&text=`;
        let whatsAppEmoji = whatsAppDispatcherValues.direct || '';

         // get query params
         const queryString = window.location.search.substring(1);
         const urlParams = new URLSearchParams(queryString);
         let locationHref = sessionStorage.getItem("locationHref");
         let utm_source = sessionStorage.getItem("utm_source");
         let utm_medium = sessionStorage.getItem("utm_medium");
        // get product / landing data        
        const landingTitle = $('.page-product .productView-title').html()
        const meskProduct = $('.page-product .productView-info-reference-value').html()
        // get referrer
        const getReferrer = document.referrer;
        
        if (!!utm_source && !!utm_medium) {
            whatsAppEmoji = whatsAppUtmsValues.filter((item) => {
              //console.log(item.utm_source.toLowerCase()+' == '+ utm_source.toLowerCase())
              //console.log(item.utm_medium.toLowerCase()+' == '+ utm_medium.toLowerCase())
            return (
              item.utm_source.toLowerCase().trim() ===
                        utm_source.toLowerCase().trim() &&
                    item.utm_medium.toLowerCase().trim() ===
                        utm_medium.toLowerCase().trim()
            );
            })[0];
            if (whatsAppEmoji) {
              whatsAppEmoji = whatsAppEmoji.name.split("-");
            }else{
              whatsAppEmoji = whatsAppDispatcherValues.direct;
            }
          
        } else if (getReferrer) {
            whatsAppEmoji = whatsAppOrganicValues.filter((item) => {
            return getReferrer.toLowerCase().includes(item.source.toLowerCase());
            });
            if (!whatsAppEmoji.length) {
            whatsAppEmoji = whatsAppDispatcherValues.direct;
            } else {
            whatsAppEmoji = whatsAppEmoji[0].name.split("-");
            }
        }
        let whatsAppBaseMessage = "";
        if (landingTitle) {
            whatsAppBaseMessage = `%C2%A1Hola, chicas Eskultura! ${whatsAppEmoji}+quiero+comprar+${encodeURIComponent(landingTitle).replace(/%20/g,"+")}%21+|+REF+${meskProduct}`;
        } else{
            whatsAppBaseMessage = `%C2%A1Hola, chicas Eskultura! ${whatsAppEmoji} más información sobre sus productos y servicios.`;                
        }
        window.location.href = `${whatsAppMessageUrl}${whatsAppBaseMessage}`;

      })
      .catch(err => console.error(err));
  };
  
  
  var whatsAppFloatingButton = document.getElementById("whatsAppFloatingButton");

  window.addEventListener("load", async function () {
  
      fetch('//cdn.shopify.com/s/files/1/0646/6479/7440/t/2/assets/emojis.json?v=119836887905866646051669417933')
      .then((response) => response.json())
      .then((valuesJson) => {
        // get query params
      const locationHref = window.location.href;
      const queryString = window.location.search.substring(1);
      const urlParams = new URLSearchParams(queryString);
      let utm_source = urlParams.get("utm_source");
      let utm_medium = urlParams.get("utm_medium");
      
      !sessionStorage.getItem("locationHref") && sessionStorage.setItem("locationHref", locationHref);
      utm_source && sessionStorage.setItem("utm_source", utm_source);
      utm_medium && sessionStorage.setItem("utm_medium", utm_medium);
    
      if (!!utm_source && !!utm_medium) {
      const emojiFounded = valuesJson.utms.filter((item) => {
          return (
            item.utm_source.toLowerCase().trim() ===
                  utm_source.toLowerCase().trim() &&
              item.utm_medium.toLowerCase().trim() ===
                  utm_medium.toLowerCase().trim()
          );
      })[0];
            
      if (!emojiFounded || emojiFounded === undefined) {
          whatsAppFloatingButton.setAttribute(
          "data-source",
          `error-${utm_source}`
          );
          whatsAppFloatingButton.setAttribute(
          "data-medium",
          `error-${utm_medium}`
          );
          whatsAppFloatingButton.classList.add("error-utm");
      }
      }
      whatsAppFloatingButton?.addEventListener("click", whatsappRedirect);
  });
  });