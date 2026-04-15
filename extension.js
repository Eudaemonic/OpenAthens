
var display = true;

function GetContent() {

    chrome.cookies.get({ url: 'https://my.openathens.net', name: 'oa-session' },
        function (cookie) {
            if (cookie) {
                display = true;


                var jwt = parseJwt(cookie.value);

                document.getElementById('cookie-status').textContent = jwt.on;
                document.getElementById('cookie-identity').textContent = jwt.a;
                document.getElementById('catalogue-link').href = getCatalogueLink(jwt.o);

                chrome.action.setBadgeText({ text: getOrgName(jwt.o) });
                chrome.action.setTitle({ title: "You are now logged in as " + jwt.on });



            }

            else {

                display = false;
                chrome.action.setBadgeText({ text: "" });
                chrome.action.setTitle({ title: "" });
                console.log('Can\'t get cookie! Check the name!');
            }

            displayContent();
        });

}





function getCatalogueLink(orgId) {

    return "https://search.libraries.london.ac.uk/discovery/search?vid=44SHL_INST:" + getOrgName(orgId);

}

function getOrgName(orgId) {

    switch (orgId) {
        case '80105057':
            return 'SHL';
        case '82068664':
            return 'IALS';
        case '82068665':
            return 'ICLAS';
        case '82068667':
            return 'IHR';
        case '82068663':
            return 'WARB';
        default:
            return '';
    }

}


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function displayContent() {
    if (display) {
        document.getElementById('signed-in').style.display = 'block';
        document.getElementById('signed-out').style.display = 'none';
    }
    else {
        document.getElementById('signed-in').style.display = 'none';
        document.getElementById('signed-out').style.display = 'block';
    }

}

const ORIGIN = "openathens.net";

// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//     if (!tab.url) return;
//     const url = new URL(tab.url);
//     // Enables the side panel
//     if (url.origin === ORIGIN) {
//         GetContent();

//     } else {
//         display = false;
//         chrome.action.setBadgeText({ text: "" });
//         chrome.action.setTitle({ title: "" });

//     }
// });
// chrome.webNavigation.onCompleted.addListener(
//     async () => {
//       await chrome.action.openPopup();
//     },
//     { url: [
//       { urlMatches: ORIGIN },
//     ] },
//   );

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
      if (tab.url.indexOf(ORIGIN) != -1) {
     
          chrome.action.openPopup();
          
      }
  
    }
  });

GetContent();


