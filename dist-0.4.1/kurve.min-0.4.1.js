var __extends=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);r.prototype=t.prototype,e.prototype=new r},Kurve;!function(e){function t(e){setTimeout(e,0)}var r;!function(e){e[e.Pending=0]="Pending",e[e.ResolutionInProgress=1]="ResolutionInProgress",e[e.Resolved=2]="Resolved",e[e.Rejected=3]="Rejected"}(r||(r={}));var n=function(){function e(e,t,r){this._dispatcher=e,this._successCB=t,this._errorCB=r,this.result=new o(e)}return e.prototype.resolve=function(e,t){var r=this;return"function"!=typeof this._successCB?void this.result.resolve(e):void(t?this._dispatcher(function(){return r._dispatchCallback(r._successCB,e)}):this._dispatchCallback(this._successCB,e))},e.prototype.reject=function(e,t){var r=this;return"function"!=typeof this._errorCB?void this.result.reject(e):void(t?this._dispatcher(function(){return r._dispatchCallback(r._errorCB,e)}):this._dispatchCallback(this._errorCB,e))},e.prototype._dispatchCallback=function(e,t){var r;try{r=e(t),this.result.resolve(r)}catch(n){return void this.result.reject(n)}},e}(),o=function(){function e(e){this._stack=[],this._state=r.Pending,this._dispatcher=e?e:t,this.promise=new s(this)}return e.prototype.DispatchDeferred=function(e){setTimeout(e,0)},e.prototype.then=function(e,t){if("function"!=typeof e&&"function"!=typeof t)return this.promise;var o=new n(this._dispatcher,e,t);switch(this._state){case r.Pending:case r.ResolutionInProgress:this._stack.push(o);break;case r.Resolved:o.resolve(this._value,!0);break;case r.Rejected:o.reject(this._error,!0)}return o.result.promise},e.prototype.resolve=function(e){return this._state!==r.Pending?this:this._resolve(e)},e.prototype._resolve=function(e){var t,n=this,o=typeof e,s=!0;try{if(null===e||"object"!==o&&"function"!==o||"function"!=typeof(t=e.then))this._state=r.ResolutionInProgress,this._dispatcher(function(){n._state=r.Resolved,n._value=e;var t,o=n._stack.length;for(t=0;o>t;t++)n._stack[t].resolve(e,!1);n._stack.splice(0,o)});else{if(e===this.promise)throw new TypeError("recursive resolution");this._state=r.ResolutionInProgress,t.call(e,function(e){s&&(s=!1,n._resolve(e))},function(e){s&&(s=!1,n._reject(e))})}}catch(i){s&&this._reject(i)}return this},e.prototype.reject=function(e){return this._state!==r.Pending?this:this._reject(e)},e.prototype._reject=function(e){var t=this;return this._state=r.ResolutionInProgress,this._dispatcher(function(){t._state=r.Rejected,t._error=e;var n=t._stack.length,o=0;for(o=0;n>o;o++)t._stack[o].reject(e,!1);t._stack.splice(0,n)}),this},e}();e.Deferred=o;var s=function(){function e(e){this._deferred=e}return e.prototype.then=function(e,t){return this._deferred.then(e,t)},e.prototype.fail=function(e){return this._deferred.then(void 0,e)},e}();e.Promise=s}(Kurve||(Kurve={}));var Kurve;!function(e){!function(e){e[e.v1=1]="v1",e[e.v2=2]="v2"}(e.OAuthVersion||(e.OAuthVersion={}));var t=e.OAuthVersion,r=function(){function e(){}return e}();e.Error=r;var n=function(){function e(e,t,r,n,o){this.id=e,this.scopes=t,this.resource=r,this.token=n,this.expiry=o}return Object.defineProperty(e.prototype,"isExpired",{get:function(){return this.expiry<=new Date((new Date).getTime()+6e4)},enumerable:!0,configurable:!0}),e.prototype.hasScopes=function(e){var t=this;return this.scopes?e.every(function(e){return t.scopes.some(function(t){return e===t})}):!1},e}(),o=function(){function e(e){var t=this;this.tokenStorage=e,this.cachedTokens={},e&&e.getAll().forEach(function(e){var r=e.id,o=e.scopes,s=e.resource,i=e.token,a=e.expiry,c=new n(r,o,s,i,new Date(a));c.isExpired?t.tokenStorage.remove(c.id):t.cachedTokens[c.id]=c})}return e.prototype.add=function(e){this.cachedTokens[e.id]=e,this.tokenStorage&&this.tokenStorage.add(e.id,e)},e.prototype.getForResource=function(e){var t=this.cachedTokens[e];return t&&t.isExpired?(this.remove(e),null):t},e.prototype.getForScopes=function(e){for(var t in this.cachedTokens){var r=this.cachedTokens[t];if(r.hasScopes(e)){if(!r.isExpired)return r;this.remove(t)}}return null},e.prototype.clear=function(){this.cachedTokens={},this.tokenStorage&&this.tokenStorage.clear()},e.prototype.remove=function(e){this.tokenStorage&&this.tokenStorage.remove(e),delete this.cachedTokens[e]},e}(),s=function(){function e(){}return e}();e.IdToken=s;var i=function(){function i(e){var n=this;this.policy="",this.clientId=e.clientId,this.tokenProcessorUrl=e.tokenProcessingUri,this.version=e.version?e.version:t.v1,this.tokenCache=new o(e.tokenStorage),window.addEventListener("message",function(e){if("id_token"===e.data.type)if(e.data.error){var t=new r;t.text=e.data.error,n.loginCallback(t)}else if(n.state!==e.data.state){var o=new r;o.statusText="Invalid state",n.loginCallback(o)}else n.decodeIdToken(e.data.token),n.loginCallback(null);else if("access_token"===e.data.type)if(e.data.error){var t=new r;t.text=e.data.error,n.getTokenCallback(null,t)}else{var s=e.data.token,i=document.getElementById("tokenIFrame");if(i.parentNode.removeChild(i),e.data.state!==n.state){var o=new r;o.statusText="Invalid state",n.getTokenCallback(null,o)}else n.getTokenCallback(s,null)}})}return i.prototype.checkForIdentityRedirect=function(){function e(e){var t=window.location.href.indexOf(e);if(0>t)return null;var r=window.location.href.indexOf("&",t+e.length);return window.location.href.substring(t,r>0?r:window.location.href.length)}function t(e){var t=e||window.location.search||"",r=[],n={};if(t=t.replace(/.*?\?/,""),t.length){r=t.split("&");for(var o in r){var s=r[o].split("=")[0];s.length&&("undefined"==typeof n[s]&&(n[s]=[]),n[s].push(r[o].split("=")[1]))}}return n}var r=(t(window.location.href),e("#id_token=")),n=e("#access_token");if(r){return this.decodeIdToken(r),this.loginCallback&&this.loginCallback(null),!0}if(n)throw"Should not get here.  This should be handled via the iframe approach.";return!1},i.prototype.decodeIdToken=function(e){var t=this,r=this.base64Decode(e.substring(e.indexOf(".")+1,e.lastIndexOf("."))),n=JSON.parse(r),o=new Date(new Date("01/01/1970 0:0 UTC").getTime()+1e3*parseInt(n.exp));this.idToken=new s,this.idToken.FullToken=n,this.idToken.Token=e,this.idToken.Expiry=o,this.idToken.UPN=n.upn,this.idToken.TenantId=n.tid,this.idToken.FamilyName=n.family_name,this.idToken.GivenName=n.given_name,this.idToken.Name=n.name,this.idToken.PreferredUsername=n.preferred_username;var i=o.getTime()-(new Date).getTime()-3e5;this.refreshTimer=setTimeout(function(){t.renewIdToken()},i)},i.prototype.decodeAccessToken=function(e,t,r){var o=this.base64Decode(e.substring(e.indexOf(".")+1,e.lastIndexOf("."))),s=JSON.parse(o),i=new Date(new Date("01/01/1970 0:0 UTC").getTime()+1e3*parseInt(s.exp)),a=t||r.join(" "),c=new n(a,r,t,e,i);this.tokenCache.add(c)},i.prototype.getIdToken=function(){return this.idToken},i.prototype.isLoggedIn=function(){return this.idToken?this.idToken.Expiry>new Date:!1},i.prototype.renewIdToken=function(){clearTimeout(this.refreshTimer),this.login(function(){})},i.prototype.getCurrentOauthVersion=function(){return this.version},i.prototype.getAccessTokenAsync=function(t){var r=new e.Deferred;return this.getAccessToken(t,function(e,t){t?r.reject(t):r.resolve(e)}),r.promise},i.prototype.getAccessToken=function(e,n){var o=this;if(this.version!==t.v1){var s=new r;return s.statusText="Currently this identity class is using v2 OAuth mode. You need to use getAccessTokenForScopes() method",void n(null,s)}var i=this.tokenCache.getForResource(e);if(i)return n(i.token,null);this.getTokenCallback=function(t,r){r?n(null,r):(o.decodeAccessToken(t,e),n(t,null))},this.nonce="token"+this.generateNonce(),this.state="token"+this.generateNonce();var a=document.createElement("iframe");a.style.display="none",a.id="tokenIFrame",a.src=this.tokenProcessorUrl+"?clientId="+encodeURIComponent(this.clientId)+"&resource="+encodeURIComponent(e)+"&redirectUri="+encodeURIComponent(this.tokenProcessorUrl)+"&state="+encodeURIComponent(this.state)+"&version="+encodeURIComponent(this.version.toString())+"&nonce="+encodeURIComponent(this.nonce)+"&op=token",document.body.appendChild(a)},i.prototype.getAccessTokenForScopesAsync=function(t,r){void 0===r&&(r=!1);var n=new e.Deferred;return this.getAccessTokenForScopes(t,r,function(e,t){t?n.reject(t):n.resolve(e)}),n.promise},i.prototype.getAccessTokenForScopes=function(e,n,o){var s=this;if(void 0===n&&(n=!1),this.version!==t.v2){var i=new r;return i.statusText="Dynamic scopes require v2 mode. Currently this identity class is using v1",void o(null,i)}var a=this.tokenCache.getForScopes(e);if(a)return o(a.token,null);if(this.getTokenCallback=function(t,r){r?n||!r.text?o(null,r):r.text.indexOf("AADSTS65001")>=0?s.getAccessTokenForScopes(e,!0,s.getTokenCallback):o(null,r):(s.decodeAccessToken(t,null,e),o(t,null))},this.nonce="token"+this.generateNonce(),this.state="token"+this.generateNonce(),n)window.open(this.tokenProcessorUrl+"?clientId="+encodeURIComponent(this.clientId)+"&scopes="+encodeURIComponent(e.join(" "))+"&redirectUri="+encodeURIComponent(this.tokenProcessorUrl)+"&version="+encodeURIComponent(this.version.toString())+"&state="+encodeURIComponent(this.state)+"&nonce="+encodeURIComponent(this.nonce)+"&op=token","_blank");else{var c=document.createElement("iframe");c.style.display="none",c.id="tokenIFrame",c.src=this.tokenProcessorUrl+"?clientId="+encodeURIComponent(this.clientId)+"&scopes="+encodeURIComponent(e.join(" "))+"&redirectUri="+encodeURIComponent(this.tokenProcessorUrl)+"&version="+encodeURIComponent(this.version.toString())+"&state="+encodeURIComponent(this.state)+"&nonce="+encodeURIComponent(this.nonce)+"&login_hint="+encodeURIComponent(this.idToken.PreferredUsername)+"&domain_hint="+encodeURIComponent("9188040d-6c67-4c5b-b112-36a304b66dad"===this.idToken.TenantId?"consumers":"organizations")+"&op=token",document.body.appendChild(c)}},i.prototype.loginAsync=function(t){var r=new e.Deferred;return this.login(function(e){e?r.reject(e):r.resolve(null)},t),r.promise},i.prototype.login=function(e,n){if(this.loginCallback=e,n||(n={}),n.policy&&(this.policy=n.policy),n.scopes&&this.version===t.v1){var o=new r;return o.text="Scopes can only be used with OAuth v2.",void e(o)}if(n.policy&&!n.tenant){var o=new r;return o.text="In order to use policy (AAD B2C) a tenant must be specified as well.",void e(o)}this.state="login"+this.generateNonce(),this.nonce="login"+this.generateNonce();var s=this.tokenProcessorUrl+"?clientId="+encodeURIComponent(this.clientId)+"&redirectUri="+encodeURIComponent(this.tokenProcessorUrl)+"&state="+encodeURIComponent(this.state)+"&nonce="+encodeURIComponent(this.nonce)+"&version="+encodeURIComponent(this.version.toString())+"&op=login&p="+encodeURIComponent(this.policy);n.tenant&&(s+="&tenant="+encodeURIComponent(n.tenant)),this.version===t.v2&&(n.scopes||(n.scopes=[]),n.scopes.indexOf("profile")<0&&n.scopes.push("profile"),n.scopes.indexOf("openid")<0&&n.scopes.push("openid"),s+="&scopes="+encodeURIComponent(n.scopes.join(" "))),window.open(s,"_blank")},i.prototype.loginNoWindowAsync=function(t){var r=new e.Deferred;return this.loginNoWindow(function(e){e?r.reject(e):r.resolve(null)},t),r.promise},i.prototype.loginNoWindow=function(e,t){this.loginCallback=e,this.state="clientId="+this.clientId+"&tokenProcessorUrl="+this.tokenProcessorUrl,this.nonce=this.generateNonce();var r=this.checkForIdentityRedirect();if(!r){var n=t?t:window.location.href.split("#")[0],o="https://login.microsoftonline.com/common/oauth2/authorize?response_type=id_token&client_id="+encodeURIComponent(this.clientId)+"&redirect_uri="+encodeURIComponent(n)+"&state="+encodeURIComponent(this.state)+"&nonce="+encodeURIComponent(this.nonce);window.location.href=o}},i.prototype.logOut=function(){this.tokenCache.clear();var e="https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri="+encodeURI(window.location.href);window.location.href=e},i.prototype.base64Decode=function(e){var t,r,n,o,s={},i=0,a=0,c="",u=String.fromCharCode,l=e.length,p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(t=0;64>t;t++)s[p.charAt(t)]=t;for(n=0;l>n;n++)for(r=s[e.charAt(n)],i=(i<<6)+r,a+=6;a>=8;)((o=i>>>(a-=8)&255)||l-2>n)&&(c+=u(o));return c},i.prototype.generateNonce=function(){for(var e="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r=0;32>r;r++)e+=t.charAt(Math.floor(Math.random()*t.length));return e},i}();e.Identity=i}(Kurve||(Kurve={}));var __extends=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)},Kurve;!function(e){var t;!function(e){var t=function(){function e(){}return e.rootUrl="https://graph.microsoft.com/",e}(),r=function(){function e(){}return e.OpenId="openid",e.OfflineAccess="offline_access",e}();e.General=r;var n=function(){function e(){}return e.Read=t.rootUrl+"User.Read",e.ReadWrite=t.rootUrl+"User.ReadWrite",e.ReadBasicAll=t.rootUrl+"User.ReadBasic.All",e.ReadAll=t.rootUrl+"User.Read.All",e.ReadWriteAll=t.rootUrl+"User.ReadWrite.All",e}();e.User=n;var o=function(){function e(){}return e.Read=t.rootUrl+"Contacts.Read",e.ReadWrite=t.rootUrl+"Contacts.ReadWrite",e}();e.Contacts=o;var s=function(){function e(){}return e.ReadAll=t.rootUrl+"Directory.Read.All",e.ReadWriteAll=t.rootUrl+"Directory.ReadWrite.All",e.AccessAsUserAll=t.rootUrl+"Directory.AccessAsUser.All",e}();e.Directory=s;var i=function(){function e(){}return e.ReadAll=t.rootUrl+"Group.Read.All",e.ReadWriteAll=t.rootUrl+"Group.ReadWrite.All",e.AccessAsUserAll=t.rootUrl+"Directory.AccessAsUser.All",e}();e.Group=i;var a=function(){function e(){}return e.Read=t.rootUrl+"Mail.Read",e.ReadWrite=t.rootUrl+"Mail.ReadWrite",e.Send=t.rootUrl+"Mail.Send",e}();e.Mail=a;var c=function(){function e(){}return e.Read=t.rootUrl+"Calendars.Read",e.ReadWrite=t.rootUrl+"Calendars.ReadWrite",e}();e.Calendars=c;var u=function(){function e(){}return e.Read=t.rootUrl+"Files.Read",e.ReadAll=t.rootUrl+"Files.Read.All",e.ReadWrite=t.rootUrl+"Files.ReadWrite",e.ReadWriteAppFolder=t.rootUrl+"Files.ReadWrite.AppFolder",e.ReadWriteSelected=t.rootUrl+"Files.ReadWrite.Selected",e}();e.Files=u;var l=function(){function e(){}return e.ReadWrite=t.rootUrl+"Tasks.ReadWrite",e}();e.Tasks=l;var p=function(){function e(){}return e.Read=t.rootUrl+"People.Read",e.ReadWrite=t.rootUrl+"People.ReadWrite",e}();e.People=p;var h=function(){function e(){}return e.Create=t.rootUrl+"Notes.Create",e.ReadWriteCreatedByApp=t.rootUrl+"Notes.ReadWrite.CreatedByApp",e.Read=t.rootUrl+"Notes.Read",e.ReadAll=t.rootUrl+"Notes.Read.All",e.ReadWriteAll=t.rootUrl+"Notes.ReadWrite.All",e}();e.Notes=h}(t=e.Scopes||(e.Scopes={}));var r=function(){function e(e,t){this.graph=e,this._data=t}return Object.defineProperty(e.prototype,"data",{get:function(){return this._data},enumerable:!0,configurable:!0}),e}();e.DataModelWrapper=r;var n=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(r);e.DataModelListWrapper=n;var o=function(){function e(){}return e}();e.ProfilePhotoDataModel=o;var s=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(r);e.ProfilePhoto=s;var i=function(){function e(){}return e}();e.UserDataModel=i,function(e){e[e.events=0]="events",e[e.calendarView=1]="calendarView"}(e.EventsEndpoint||(e.EventsEndpoint={}));var a=e.EventsEndpoint,c=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t.prototype.events=function(e,t){this.graph.eventsForUser(this._data.userPrincipalName,a.events,e,t)},t.prototype.eventsAsync=function(e){return this.graph.eventsForUserAsync(this._data.userPrincipalName,a.events,e)},t.prototype.memberOf=function(e,t,r){this.graph.memberOfForUser(this._data.userPrincipalName,e,r)},t.prototype.memberOfAsync=function(e){return this.graph.memberOfForUserAsync(this._data.userPrincipalName,e)},t.prototype.messages=function(e,t){this.graph.messagesForUser(this._data.userPrincipalName,e,t)},t.prototype.messagesAsync=function(e){return this.graph.messagesForUserAsync(this._data.userPrincipalName,e)},t.prototype.manager=function(e,t){this.graph.managerForUser(this._data.userPrincipalName,e,t)},t.prototype.managerAsync=function(e){return this.graph.managerForUserAsync(this._data.userPrincipalName,e)},t.prototype.profilePhoto=function(e,t){this.graph.profilePhotoForUser(this._data.userPrincipalName,e,t)},t.prototype.profilePhotoAsync=function(e){return this.graph.profilePhotoForUserAsync(this._data.userPrincipalName,e)},t.prototype.profilePhotoValue=function(e,t){this.graph.profilePhotoValueForUser(this._data.userPrincipalName,e,t)},t.prototype.profilePhotoValueAsync=function(e){return this.graph.profilePhotoValueForUserAsync(this._data.userPrincipalName,e)},t.prototype.calendarView=function(e,t){this.graph.eventsForUser(this._data.userPrincipalName,a.calendarView,e,t)},t.prototype.calendarViewAsync=function(e){return this.graph.eventsForUserAsync(this._data.userPrincipalName,a.calendarView,e)},t.prototype.mailFolders=function(e,t){this.graph.mailFoldersForUser(this._data.userPrincipalName,e,t)},t.prototype.mailFoldersAsync=function(e){return this.graph.mailFoldersForUserAsync(this._data.userPrincipalName,e)},t.prototype.message=function(e,t,r){this.graph.messageForUser(this._data.userPrincipalName,e,t,r)},t.prototype.messageAsync=function(e,t){return this.graph.messageForUserAsync(this._data.userPrincipalName,e,t)},t.prototype.event=function(e,t,r){this.graph.eventForUser(this._data.userPrincipalName,e,t,r)},t.prototype.eventAsync=function(e,t){return this.graph.eventForUserAsync(this._data.userPrincipalName,e,t)},t.prototype.messageAttachment=function(e,t,r,n){this.graph.messageAttachmentForUser(this._data.userPrincipalName,e,t,r,n)},t.prototype.messageAttachmentAsync=function(e,t,r){return this.graph.messageAttachmentForUserAsync(this._data.userPrincipalName,e,t,r)},t}(r);e.User=c;var u=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(n);e.Users=u;var l=function(){function e(){}return e}();e.MessageDataModel=l;var p=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(r);e.Message=p;var h=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(n);e.Messages=h;var d=function(){function e(){}return e}();e.EventDataModel=d;var f=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(r);e.Event=f;var v=function(e){function t(t,r,n){e.call(this,t,n),this.graph=t,this.endpoint=r,this._data=n}return __extends(t,e),t}(n);e.Events=v;var m=function(){function e(){}return e}();e.Contact=m;var g=function(){function e(){}return e}();e.GroupDataModel=g;var y=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(r);e.Group=y;var U=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(n);e.Groups=U;var A=function(){function e(){}return e}();e.MailFolderDataModel=A;var k=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(r);e.MailFolder=k;var R=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(n);e.MailFolders=R,function(e){e[e.fileAttachment=0]="fileAttachment",e[e.itemAttachment=1]="itemAttachment",e[e.referenceAttachment=2]="referenceAttachment"}(e.AttachmentType||(e.AttachmentType={}));var w=e.AttachmentType,_=function(){function e(){}return e}();e.AttachmentDataModel=_;var F=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t.prototype.getType=function(){switch(this._data["@odata.type"]){case"#microsoft.graph.fileAttachment":return w.fileAttachment;case"#microsoft.graph.itemAttachment":return w.itemAttachment;case"#microsoft.graph.referenceAttachment":return w.referenceAttachment}},t}(r);e.Attachment=F;var T=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(n);e.Attachments=T;var I=function(){function r(e){this.req=null,this.accessToken=null,this.KurveIdentity=null,this.defaultResourceID="https://graph.microsoft.com",this.baseUrl="https://graph.microsoft.com/v1.0/",e.defaultAccessToken?this.accessToken=e.defaultAccessToken:this.KurveIdentity=e.identity}return r.prototype.scopesForV2=function(t){return this.KurveIdentity?this.KurveIdentity.getCurrentOauthVersion()===e.OAuthVersion.v1?null:t:null},r.prototype.meAsync=function(t){var r=new e.Deferred;return this.me(function(e,t){return t?r.reject(t):r.resolve(e)},t),r.promise},r.prototype.me=function(e,r){var n=[t.User.Read],o=this.buildMeUrl("",r);this.getUser(o,e,this.scopesForV2(n))},r.prototype.userAsync=function(t,r,n){void 0===n&&(n=!0);var o=new e.Deferred;return this.user(t,function(e,t){return t?o.reject(t):o.resolve(e)},r,n),o.promise},r.prototype.user=function(e,r,n,o){void 0===o&&(o=!0);var s=o?[t.User.ReadBasicAll]:[t.User.ReadAll],i=this.buildUsersUrl(e,n);this.getUser(i,r,this.scopesForV2(s))},r.prototype.usersAsync=function(t,r){void 0===r&&(r=!0);var n=new e.Deferred;return this.users(function(e,t){return t?n.reject(t):n.resolve(e)},t,r),n.promise},r.prototype.users=function(e,r,n){void 0===n&&(n=!0);var o=n?[t.User.ReadBasicAll]:[t.User.ReadAll],s=this.buildUsersUrl("",r);this.getUsers(s,e,this.scopesForV2(o),n)},r.prototype.groupAsync=function(t,r){var n=new e.Deferred;return this.group(t,function(e,t){return t?n.reject(t):n.resolve(e)},r),n.promise},r.prototype.group=function(e,r,n){var o=[t.Group.ReadAll],s=this.buildGroupsUrl(e,n);this.getGroup(s,r,this.scopesForV2(o))},r.prototype.groupsAsync=function(t){var r=new e.Deferred;return this.groups(function(e,t){return t?r.reject(t):r.resolve(e)},t),r.promise},r.prototype.groups=function(e,r){var n=[t.Group.ReadAll],o=this.buildGroupsUrl("",r);this.getGroups(o,e,this.scopesForV2(n))},r.prototype.messageForUserAsync=function(t,r,n){var o=new e.Deferred;return this.messageForUser(t,r,function(e,t){return t?o.reject(t):o.resolve(e)},n),o.promise},r.prototype.messageForUser=function(e,r,n,o){var s=[t.Mail.Read],i=this.buildUsersUrl(e+"/messages/"+r,o);this.getMessage(i,r,function(e,t){return n(e,t)},this.scopesForV2(s))},r.prototype.messagesForUserAsync=function(t,r){var n=new e.Deferred;return this.messagesForUser(t,function(e,t){return t?n.reject(t):n.resolve(e)},r),n.promise},r.prototype.messagesForUser=function(e,r,n){var o=[t.Mail.Read],s=this.buildUsersUrl(e+"/messages",n);this.getMessages(s,function(e,t){return r(e,t)},this.scopesForV2(o))},r.prototype.mailFoldersForUserAsync=function(t,r){var n=new e.Deferred;return this.mailFoldersForUser(t,function(e,t){return t?n.reject(t):n.resolve(e)},r),n.promise},r.prototype.mailFoldersForUser=function(e,r,n){var o=[t.Mail.Read],s=this.buildUsersUrl(e+"/mailFolders",n);this.getMailFolders(s,function(e,t){return r(e,t)},this.scopesForV2(o))},r.prototype.eventForUserAsync=function(t,r,n){var o=new e.Deferred;return this.eventForUser(t,r,function(e,t){return t?o.reject(t):o.resolve(e)},n),o.promise},r.prototype.eventForUser=function(e,r,n,o){var s=[t.Calendars.Read],i=this.buildUsersUrl(e+"/events/"+r,o);this.getEvent(i,r,function(e,t){return n(e,t)},this.scopesForV2(s))},r.prototype.eventsForUserAsync=function(t,r,n){var o=new e.Deferred;return this.eventsForUser(t,r,function(e,t){return t?o.reject(t):o.resolve(e)},n),o.promise},r.prototype.eventsForUser=function(e,r,n,o){var s=[t.Calendars.Read],i=this.buildUsersUrl(e+"/"+a[r],o);this.getEvents(i,r,function(e,t){return n(e,t)},this.scopesForV2(s))},r.prototype.memberOfForUserAsync=function(t,r){var n=new e.Deferred;return this.memberOfForUser(t,function(e,t){return t?n.reject(t):n.resolve(e)},r),n.promise},r.prototype.memberOfForUser=function(e,r,n){var o=[t.Group.ReadAll],s=this.buildUsersUrl(e+"/memberOf",n);this.getGroups(s,r,this.scopesForV2(o))},r.prototype.managerForUserAsync=function(t,r){var n=new e.Deferred;return this.managerForUser(t,function(e,t){return t?n.reject(t):n.resolve(e)},r),n.promise},r.prototype.managerForUser=function(e,r,n){var o=[t.Directory.ReadAll],s=this.buildUsersUrl(e+"/manager",n);this.getUser(s,r,this.scopesForV2(o))},r.prototype.directReportsForUserAsync=function(t,r){var n=new e.Deferred;return this.directReportsForUser(t,function(e,t){return t?n.reject(t):n.resolve(e)},r),n.promise},r.prototype.directReportsForUser=function(e,r,n){var o=[t.Directory.ReadAll],s=this.buildUsersUrl(e+"/directReports",n);this.getUsers(s,r,this.scopesForV2(o))},r.prototype.profilePhotoForUserAsync=function(t,r){var n=new e.Deferred;return this.profilePhotoForUser(t,function(e,t){return t?n.reject(t):n.resolve(e)},r),n.promise},r.prototype.profilePhotoForUser=function(e,r,n){var o=[t.User.ReadBasicAll],s=this.buildUsersUrl(e+"/photo",n);this.getPhoto(s,r,this.scopesForV2(o))},r.prototype.profilePhotoValueForUserAsync=function(t,r){var n=new e.Deferred;return this.profilePhotoValueForUser(t,function(e,t){return t?n.reject(t):n.resolve(e)},r),n.promise},r.prototype.profilePhotoValueForUser=function(e,r,n){var o=[t.User.ReadBasicAll],s=this.buildUsersUrl(e+"/photo/$value",n);this.getPhotoValue(s,r,this.scopesForV2(o))},r.prototype.messageAttachmentsForUserAsync=function(t,r,n){var o=new e.Deferred;return this.messageAttachmentsForUser(t,r,function(e,t){return t?o.reject(t):o.resolve(e)},n),o.promise},r.prototype.messageAttachmentsForUser=function(e,r,n,o){var s=[t.Mail.Read],i=this.buildUsersUrl(e+"/messages/"+r+"/attachments",o);this.getMessageAttachments(i,n,this.scopesForV2(s))},r.prototype.messageAttachmentForUserAsync=function(t,r,n,o){var s=new e.Deferred;return this.messageAttachmentForUser(t,r,n,function(e,t){return t?s.reject(t):s.resolve(e)},o),s.promise},r.prototype.messageAttachmentForUser=function(e,r,n,o,s){var i=[t.Mail.Read],a=this.buildUsersUrl(e+"/messages/"+r+"/attachments/"+n,s);this.getMessageAttachment(a,o,this.scopesForV2(i))},r.prototype.getAsync=function(t){var r=new e.Deferred;return this.get(t,function(e,t){return t?r.reject(t):r.resolve(e)}),r.promise},r.prototype.get=function(e,t,r,n){var o=this,s=new XMLHttpRequest;r&&(s.responseType=r),s.onreadystatechange=function(){4===s.readyState&&(200===s.status?t(r?s.response:s.responseText,null):t(null,o.generateError(s)))},s.open("GET",e),this.addAccessTokenAndSend(s,function(e){e&&t(null,e)},n)},r.prototype.generateError=function(t){var r=new e.Error;return r.status=t.status,r.statusText=t.statusText,""===t.responseType||"text"===t.responseType?r.text=t.responseText:r.other=t.response,r},r.prototype.getUsers=function(r,n,o,s){var i=this;void 0===s&&(s=!0),this.get(r,function(r,o){if(o)return void n(null,o);var a=JSON.parse(r);if(a.error){var l=new e.Error;return l.other=a.error,void n(null,l)}var p=a.value?a.value:[a],h=new u(i,p.map(function(e){return new c(i,e)})),d=a["@odata.nextLink"];d&&(h.nextLink=function(r){var n=s?[t.User.ReadBasicAll]:[t.User.ReadAll],o=new e.Deferred;return i.getUsers(d,function(e,t){r?r(e,t):t?o.reject(t):o.resolve(e)},i.scopesForV2(n),s),o.promise}),n(h,null)},null,o)},r.prototype.getUser=function(t,r,n){var o=this;this.get(t,function(t,n){if(n)return void r(null,n);var s=JSON.parse(t);if(s.error){var i=new e.Error;return i.other=s.error,void r(null,i)}var a=new c(o,s);r(a,null)},null,n)},r.prototype.addAccessTokenAndSend=function(e,t,r){this.accessToken?(e.setRequestHeader("Authorization","Bearer "+this.accessToken),e.send()):r?this.KurveIdentity.getAccessTokenForScopes(r,!1,function(r,n){n?t(n):(e.setRequestHeader("Authorization","Bearer "+r),e.send(),t(null))}):this.KurveIdentity.getAccessToken(this.defaultResourceID,function(r,n){n?t(n):(e.setRequestHeader("Authorization","Bearer "+r),e.send(),t(null))})},r.prototype.getMessage=function(t,r,n,o){var s=this;this.get(t,function(t,r){if(r)return void n(null,r);var o=JSON.parse(t);if(o.error){var i=new e.Error;return i.other=o.error,void n(null,i)}var a=new p(s,o);n(a,null)},null,o)},r.prototype.getMessages=function(r,n,o){var s=this;this.get(r,function(r,o){if(o)return void n(null,o);var i=JSON.parse(r);if(i.error){var a=new e.Error;return a.other=i.error,void n(null,a)}var c=i.value?i.value:[i],u=new h(s,c.map(function(e){return new p(s,e)})),l=i["@odata.nextLink"];l&&(u.nextLink=function(r){var n=[t.Mail.Read],o=new e.Deferred;return s.getMessages(l,function(e,t){r?r(e,t):t?o.reject(t):o.resolve(e)},s.scopesForV2(n)),o.promise}),n(u,null)},null,o)},r.prototype.getEvent=function(t,r,n,o){var s=this;this.get(t,function(t,r){if(r)return void n(null,r);var o=JSON.parse(t);if(o.error){var i=new e.Error;return i.other=o.error,void n(null,i)}var a=new f(s,o);n(a,null)},null,o)},r.prototype.getEvents=function(r,n,o,s){var i=this;this.get(r,function(r,s){if(s)return void o(null,s);var a=JSON.parse(r);if(a.error){var c=new e.Error;return c.other=a.error,void o(null,c)}var u=a.value?a.value:[a],l=new v(i,n,u.map(function(e){return new f(i,e)})),p=a["@odata.nextLink"];p&&(l.nextLink=function(r){var o=[t.Mail.Read],s=new e.Deferred;return i.getEvents(p,n,function(e,t){r?r(e,t):t?s.reject(t):s.resolve(e)},i.scopesForV2(o)),s.promise}),o(l,null)},null,s)},r.prototype.getGroups=function(r,n,o){var s=this;this.get(r,function(r,o){if(o)return void n(null,o);var i=JSON.parse(r);if(i.error){var a=new e.Error;return a.other=i.error,void n(null,a)}var c=i.value?i.value:[i],u=new U(s,c.map(function(e){return new y(s,e)})),l=i["@odata.nextLink"];l&&(u.nextLink=function(r){var n=[t.Group.ReadAll],o=new e.Deferred;return s.getGroups(l,function(e,t){r?r(e,t):t?o.reject(t):o.resolve(e)},s.scopesForV2(n)),o.promise}),n(u,null)},null,o)},r.prototype.getGroup=function(t,r,n){var o=this;this.get(t,function(t,n){if(n)return void r(null,n);var s=JSON.parse(t);if(s.error){var i=new e.Error;return i.other=s.error,void r(null,i)}var a=new y(o,s);r(a,null)},null,n)},r.prototype.getPhoto=function(t,r,n){var o=this;this.get(t,function(t,n){if(n)return void r(null,n);var i=JSON.parse(t);if(i.error){var a=new e.Error;return a.other=i.error,void r(null,a)}var c=new s(o,i);r(c,null)},null,n)},r.prototype.getPhotoValue=function(e,t,r){this.get(e,function(e,r){return r?void t(null,r):void t(e,null)},"blob",r)},r.prototype.getMailFolders=function(r,n,o){var s=this;this.get(r,function(r,o){if(o)return void n(null,o);var i=JSON.parse(r);if(i.error){var a=new e.Error;a.other=i.error,n(null,a)}var c=i.value?i.value:[i],u=new R(s,c.map(function(e){return new k(s,e)})),l=i["@odata.nextLink"];l&&(u.nextLink=function(r){var n=[t.User.ReadAll],o=new e.Deferred;return s.getMailFolders(l,function(e,t){r?r(e,t):t?o.reject(t):o.resolve(e)},s.scopesForV2(n)),o.promise}),n(u,null)},null,o)},r.prototype.getMessageAttachments=function(r,n,o){var s=this;this.get(r,function(r,o){if(o)return void n(null,o);var i=JSON.parse(r);if(i.error){var a=new e.Error;return a.other=i.error,void n(null,a)}var c=i.value?i.value:[i],u=new T(s,c.map(function(e){return new F(s,e)})),l=i["@odata.nextLink"];l&&(u.nextLink=function(r){var n=[t.Mail.Read],o=new e.Deferred;return s.getMessageAttachments(l,function(e,t){r?r(e,t):t?o.reject(t):o.resolve(e)},s.scopesForV2(n)),o.promise}),n(u,null)},null,o)},r.prototype.getMessageAttachment=function(t,r,n){var o=this;this.get(t,function(t,n){if(n)return void r(null,n);var s=JSON.parse(t);if(s.error){var i=new e.Error;return i.other=s.error,void r(null,i)}var a=new F(o,s);r(a,null)},null,n)},r.prototype.buildUrl=function(e,t,r){return this.baseUrl+e+t+(r?"?"+r:"")},r.prototype.buildMeUrl=function(e,t){return void 0===e&&(e=""),this.buildUrl("me/",e,t)},r.prototype.buildUsersUrl=function(e,t){return void 0===e&&(e=""),this.buildUrl("users/",e,t)},r.prototype.buildGroupsUrl=function(e,t){return void 0===e&&(e=""),this.buildUrl("groups/",e,t)},r}();e.Graph=I;var C=function(){function t(e,t,r){this.path=e,this.scopes=t,this.odataQuery=r}return t.prototype.getAsync=function(t){var r=new e.Deferred;return this.get(t,function(e,t){return t?r.reject(t):r.resolve(e)}),r.promise},t.prototype.get=function(t,r){var n="https://graph.microsoft.com/v1.0/"+this.path+(this.odataQuery?"?"+this.odataQuery:"");t.get(n,function(t,n){if(n)return void r(null,n);var o=JSON.parse(t);if(o.error){var s=new e.Error;

return s.other=o.error,void r(null,s)}r(o,null)},null,t.scopesForV2(this.scopes))},t}();e.GraphInfo=C;var b=function(){function e(){}return e}();e.ItemAttachmentDataModel=b;var P=function(e){function r(){e.apply(this,arguments)}return __extends(r,e),r.fromMessageForMe=function(e,r,n){return new C("/me/messages/"+e+"/attachments/"+r,[t.Mail.Read],n)},r.fromMessageForUser=function(e,r,n,o){return new C("/users/#{userId}/messages/"+r+"/attachments/"+n,[t.Mail.Read],o)},r}(b);e.ItemAttachment=P}(Kurve||(Kurve={})),("undefined"!=typeof window&&window.module||"undefined"!=typeof module)&&"undefined"!=typeof module.exports&&(module.exports=Kurve);