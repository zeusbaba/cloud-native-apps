
// FIXME: NB! remember to use this global switch before publishing!!!
const MODE = 'LIVE';
//const MODE = 'DEV';

const IS_DEV = (MODE !== 'LIVE');

let api_url;
let link_base_url;
let selectedDomain;

const appTokenKey = 'ulink-jwt';
let appToken;

if (MODE==='LIVE') {
	api_url = 'https://api.ulink.no';
	link_base_url = 'https://ulink.no';
	selectedDomain = 'ulink.no';
}
else {
	// DEV mode by default
	api_url = 'http://localhost:4042';
	link_base_url = 'http://localhost:4042';
	selectedDomain = 'ulink.no';
}

function initPopup() {
	
	document.getElementById('make-link').value = chrome.i18n.getMessage('shorten');

    document.getElementById('img-mainlogo').src = 'images/mainlogo_ulink.png';
    document.getElementById('img-mainlogo').alt = 'uLINK.NO';
	
	//urlsSelect();
	chrome.windows.getCurrent(function(w) {
		const wid = w.id;
		chrome.tabs.getSelected(wid, function(t) {
			if (t.url.substr(0, 7) === 'http://' || t.url.substr(0, 8) === 'https://') {
				//-document.getElementById('param_long_link').value = t.url;
				document.getElementById('param_long_link').innerText = t.url;
			}
		});
	});

	document.getElementById('param_long_link').addEventListener('keyup', function(event) {
		if (event.keyCode !== 13) {
			document.getElementById('result_makeDizLink').style.display = 'none';
			document.getElementById('div_makeDizLink').style.display = 'block';
			clearError();
		}
	}, false);
	
	delete init;

	toastr.options = {
		  "closeButton": true,
		  "debug": false,
		  "positionClass": "toast-bottom-right",
		  "onclick": null,
		  "showDuration": "300",
		  "hideDuration": "1000",
		  "timeOut": "2000",
		  "extendedTimeOut": "1000",
		  "showEasing": "swing",
		  "hideEasing": "linear",
		  "showMethod": "fadeIn",
		  "hideMethod": "fadeOut"
		};
}

function makeDizLink(event) {
	
	if (IS_DEV) console.log("makeDizLink>> ");
	event.preventDefault();
	
	clearError();
	
	if (IS_DEV) console.log("makeDizLink>> "+ " | api_url: "+api_url );
	
	document.getElementById('result_makeDizLink').style.display = 'none';
	document.getElementById('div_makeDizLink').style.display = 'block';
	//-document.getElementById('short_link').value = '';

	//-let long_link = document.getElementById('param_long_link').value;
	let long_link = document.getElementById('param_long_link').innerText;
	
	if (IS_DEV) console.log("makeDizLink>> "+ "long_link: "+long_link + " | api_url: "+api_url );

	if (long_link !== '') {
		if (isValidUrl(long_link) === true) {
			document.getElementById('loading').style.display = 'block';
			
			if (selectedDomain===undefined) selectedDomain='ulink.no';
			let data = '{"long_link": "'+long_link+'"' + ',"domain":"'+selectedDomain+'"' + '}';
			let xhr = new XMLHttpRequest();
			xhr.open('POST', api_url+'/links', true);
			xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + appToken);
			xhr.onreadystatechange = function() {
				document.getElementById('loading').value = xhr.readyState;
				if (xhr.readyState === 4) {
					document.getElementById('loading').value = xhr.readyState;
					document.getElementById('loading').style.display = 'none';
					document.getElementById('loading').value = 0;
					if (xhr.getAllResponseHeaders() !== '') {
						let response = JSON.parse(xhr.responseText);
                        if (IS_DEV) console.log(JSON.stringify(response));
						if (response.errors === undefined) {
							document.getElementById('short_link').innerText = link_base_url+'/'+response['short_link'];
							document.getElementById('test_short_link').href = link_base_url+'/'+response['short_link'];
							document.getElementById('copy_short_link').value = link_base_url+'/'+response['short_link'];
							document.getElementById('result_makeDizLink').style.display = 'block';
							document.getElementById('div_makeDizLink').style.display = 'none';
						} else {
							showError('general_error', response.message); //JSON.stringify(response) );
						}
					} else {
						showError('network_error', '');
					}
				}
			};
			xhr.send(data);
		} else {
			showError('url_not_valid', '');
		}
	}
}

function isValidUrl(url) {
	
	return url.substr(0, 7) === 'http://' || url.substr(0, 8) === 'https://';
}

function urlsSelect() {
	chrome.windows.getAll({'populate': true}, function(windows) {
		windows.forEach(function(w) {
			w.tabs.forEach(function(t) {
				if (isValidUrl(t.url) === true) {
					document.getElementById('urls').innerHTML += '<option>'+String(t.url)+'</option>';
				}
			});
		});
	});
}

function showError(type, message) {
	document.getElementById('loading').style.display = 'none';
	document.getElementById('loading').value = 0;
	document.getElementById('result_makeDizLink').style.display = 'none';
	document.getElementById('result_makeDizLink').innerText = '';
	document.getElementById('error').innerText = chrome.i18n.getMessage(type);
	if (message !== '') {
		document.getElementById('error').innerText += ' ('+String(message)+')';
	}
	//-document.getElementById('error').innerText = '<i class="fa fa-warning fa-2x fa-fw"></i> ' + document.getElementById('error').innerText;
	document.getElementById('error').style.backgroundImage = 'url(images/'+type+'.png)';
	document.getElementById('error').style.display = 'block';
}

function clearError() {
	document.getElementById('error').style.display = 'none';
	document.getElementById('error').innerText = '';
	//document.getElementById('error_alert').style.display = 'none';
	//document.getElementById('error_alert').innerText = '';
}

// --- COPY to Clipboard! ---
function copyLinkToClipboard() {
	
	event.preventDefault();
	let textToCopy = document.getElementById('short_link').innerText;
	if (IS_DEV) console.log("textToCopy>> " + textToCopy);
	
    let copyFrom = $('<textarea/>');
    copyFrom.text(textToCopy);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy', false);
    copyFrom.remove();
    toastr.info("<em>copied #uLINK!</em><br> <strong>"+textToCopy+"</strong>");
}

function openLink(url) {
	//chrome.tabs.create({'url': url});
	switch (window.localStorage.getItem('link_target')) {
		case null:
		case undefined:
		case 'new_tab':
			chrome.tabs.create({'url': url});
			break;
		case 'active_tab':
			chrome.windows.getCurrent(function(w) {
				const wid = w.id;
				chrome.tabs.getSelected(wid, function(t) {
					const tid = t.id;
					chrome.tabs.update(tid, {'url': url});
				});
			});
			break;
		case 'new_window':
			chrome.windows.create({'url': url});
			break;
	}
	
	window.close();
	
}


//Shorthand for document.querySelector.
function select(selector) {
	return document.querySelector(selector);
}

function generateUUID() {
    let d = new Date().getTime();
    //let uuid = 'BAET-2018-chrome-yxxx-xxxxxxxxxxxx'
	let uuid = 'uLINK-2020-chrome-yxxx-xxxxxxxxxxxx'
		.replace(/[xy]/g, function(c) {
        let r = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
    });
    return uuid;
}

/*// TODO: use this to migrate BAET users if necessary
function getUserIdFromToken(token) {
	const decodedToken = jwt_decode(token);
	if (IS_DEV) console.log("decodedToken >> " + JSON.stringify(decodedToken));
	return decodedToken['userId'];
}*/
function isValidToken(token) {
	const tokenExpiration = token.exp;
	const tokenExpirationTimeInSeconds = (tokenExpiration - moment(Math.floor(Date.now() / 1000)));
	return (!tokenExpiration || tokenExpirationTimeInSeconds > 360);
}
function loadVerifyJwtToken() {
    chrome.storage.sync.get(['ulink-jwt','baet-jwt'], function(result) {
        appToken = result['ulink-jwt'];
        if (appToken === undefined) {
			appToken = result['baet-jwt'];
		}

        if (IS_DEV) {
            console.log("local storage >> " + JSON.stringify(result) );
			console.log("appToken >> " + appToken );
        }

        if (appToken === undefined || !isValidToken(appToken)) {

            // create a new user
            let userId = generateUUID();

            let user = {};
            user['userid'] = userId;
            user['password'] = userId;
            user['extra'] = {};
            user['extra']['client'] = 'chrome-extension';
            user['extra']['name'] = chrome.runtime.getManifest().name;
            user['extra']['version'] = chrome.runtime.getManifest().version;

            if (selectedDomain===undefined) {
            	selectedDomain='ulink.no';
			}
            //let data = '{' + '"userid":"'+dizlinkCookieID+'"' + ',"client":"chrome-extension"' + ',"domain":"'+selectedDomain+'"' + '}';
            let data = {};
            data['userid'] = user['userid'];
            data['password'] = user['password'];
            data['extra'] = user['extra'];
            let xhr = new XMLHttpRequest();
            xhr.open('POST', api_url+'/users', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function() {
                document.getElementById('loading').value = xhr.readyState;
                if (xhr.readyState === 4) {
                    document.getElementById('loading').value = xhr.readyState;
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('loading').value = 0;
                    if (xhr.getAllResponseHeaders() !== '') {
                        let response = JSON.parse(xhr.responseText);
                        if (response['errors'] === undefined) {
                            let data = {};
                            data['userid'] = user['userid'];
                            data['password'] = user['password'];
                            data['strategy'] = "local";
                            let xhr2 = new XMLHttpRequest();
                            xhr2.open('POST', api_url+'/authentication', true);
                            xhr2.setRequestHeader('Content-Type', 'application/json');
                            xhr2.onreadystatechange = function() {
                                document.getElementById('loading').value = xhr2.readyState;
                                if (xhr2.readyState === 4) {

                                    let response2 = JSON.parse(xhr2.responseText);
                                    if (response2['errors'] === undefined) {
                                        appToken = response2['accessToken'];

                                        chrome.storage.sync.set({'ulink-jwt': appToken}, function() {
                                            if (IS_DEV) {
                                                console.log("stored! appToken >> " + appToken );
                                            }
                                        });

                                        document.getElementById('result_makeDizLink').style.display = 'none';
                                        document.getElementById('div_makeDizLink').style.display = 'block';
                                    } else {
                                        showError('general_error', response2.message);
                                    }
                                }
                            };
                            xhr2.send(JSON.stringify(data));
                        } else {
                            showError('general_error', response.message);
                        }
                    } else {
                        showError('network_error', '');
                    }
                }
            };
            xhr.send(JSON.stringify(data));
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {

	initPopup();
    loadVerifyJwtToken();

	document.getElementById('div_makeDizLink').addEventListener('submit', makeDizLink);

	document.getElementById('result_makeDizLink').addEventListener('submit', copyLinkToClipboard);
	
});
