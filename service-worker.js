// Source - https://stackoverflow.com/q/59401933
// Posted by user72840184
// Retrieved 2026-04-15, License - CC BY-SA 4.0

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.foo === 'bar') {
    var url = "https://app.libraries.london.ac.uk/umbraco/api/libapps/getaz";
    fetch(url)
      .then(response => response.text()
        .then(t => sendResponse(t))
        .catch(error => handleError(error)));
    return true;  // Will respond asynchronously.
  }
});


chrome.runtime.onInstalled.addListener(() =>
    chrome.contextMenus.create({
        title: 'Search University of London Libraries for "%s"',
        contexts: ["selection"],
        id: "myContextMenuId",
    })
);
    
chrome.contextMenus.onClicked.addListener((info, tab) =>
    chrome.tabs.create({
        url: `https://search.libraries.london.ac.uk/discovery/search?query=any,contains,${encodeURIComponent(info.selectionText)}&vid=44SHL_INST:MAIN` 
    })
);

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

  if (changeInfo.status == 'complete' && tab.active) {

    GetContent();

    // if (tab.url.indexOf("openathens.net")  > -1 &&
    //   changeInfo.url === undefined) {
    //   chrome.action.openPopup();
    // }
  }



});


function GetContent() {
  chrome.cookies.get({ url: 'https://my.openathens.net', name: 'oa-session' },
    function (cookie) {
      if (cookie) {

        var jwt = parseJwt(cookie.value);


        chrome.action.setBadgeText({ text: getOrgName(jwt.o) });
        chrome.action.setTitle({ title: "You are now logged in as " + jwt.on });

      }

      else {

    
        chrome.action.setBadgeText({ text: "" });
        chrome.action.setTitle({ title: "" });
        console.log('Can\'t get cookie! Check the name!');
      }


    });
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

  var jsonPayload = decodeURIComponent(a2b(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


function a2b(a) {
  var b, c, d, e = {}, f = 0, g = 0, h = "", i = String.fromCharCode, j = a.length;
  for (b = 0; 64 > b; b++) e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b;
  for (c = 0; j > c; c++) for (b = e[a.charAt(c)], f = (f << 6) + b, g += 6; g >= 8;) ((d = 255 & f >>> (g -= 8)) || j - 2 > c) && (h += i(d));
  return h;
}