var __extends = (this && this.__extends) || function (d, b) {
for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
function __() { this.constructor = d; }
__.prototype = b.prototype;
d.prototype = new __();
};
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
var Kurve;
(function (Kurve) {
    // Based on https://www.npmjs.com/package/typescript-promises
    var Deferred = (function () {
        function Deferred() {
            this.doneCallbacks = [];
            this.failCallbacks = [];
            this.progressCallbacks = [];
            this._promise = new Promise(this);
            this._state = 'pending';
        }
        Object.defineProperty(Deferred.prototype, "promise", {
            get: function () {
                return this._promise;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deferred.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deferred.prototype, "rejected", {
            get: function () {
                return this.state === 'rejected';
            },
            set: function (rejected) {
                this._state = rejected ? 'rejected' : 'pending';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deferred.prototype, "resolved", {
            get: function () {
                return this.state === 'resolved';
            },
            set: function (resolved) {
                this._state = resolved ? 'resolved' : 'pending';
            },
            enumerable: true,
            configurable: true
        });
        Deferred.prototype.resolve = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            args.unshift(this);
            return this.resolveWith.apply(this, args);
        };
        Deferred.prototype.resolveWith = function (context) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._result = args;
            this.doneCallbacks.forEach(function (callback) {
                callback.apply(context, args);
            });
            this.doneCallbacks = [];
            this.resolved = true;
            return this;
        };
        Deferred.prototype.reject = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            args.unshift(this);
            return this.rejectWith.apply(this, args);
        };
        Deferred.prototype.rejectWith = function (context) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.failCallbacks.forEach(function (callback) {
                callback.apply(context, args);
            });
            this.failCallbacks = [];
            this.rejected = true;
            return this;
        };
        Deferred.prototype.progress = function () {
            var _this = this;
            var callbacks = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                callbacks[_i - 0] = arguments[_i];
            }
            var d = new Deferred();
            if (this.resolved || this.rejected) {
                callbacks.forEach(function (callback) {
                    callback.apply(_this._notifyContext, _this._notifyArgs);
                });
                return d;
            }
            callbacks.forEach(function (callback) {
                _this.progressCallbacks.push(_this.wrap(d, callback, d.notify));
            });
            this.checkStatus();
            return d;
        };
        Deferred.prototype.notify = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            args.unshift(this);
            return this.notifyWith.apply(this, args);
        };
        Deferred.prototype.notifyWith = function (context) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.resolved || this.rejected) {
                return this;
            }
            this._notifyContext = context;
            this._notifyArgs = args;
            this.progressCallbacks.forEach(function (callback) {
                callback.apply(context, args);
            });
            return this;
        };
        Deferred.prototype.checkStatus = function () {
            if (this.resolved) {
                this.resolve.apply(this, this._result);
            }
            else if (this.rejected) {
                this.reject.apply(this, this._result);
            }
        };
        Deferred.prototype.then = function (doneFilter, failFilter, progressFilter) {
            var d = new Deferred();
            this.progressCallbacks.push(this.wrap(d, progressFilter, d.progress));
            this.doneCallbacks.push(this.wrap(d, doneFilter, d.resolve));
            this.failCallbacks.push(this.wrap(d, failFilter, d.reject));
            this.checkStatus();
            return this;
        };
        Deferred.prototype.wrap = function (d, f, method) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var result = f.apply(f, args);
                if (result && result instanceof Promise) {
                    result.then(function () { d.resolve(); }, function () { d.reject(); });
                }
                else {
                    method.apply(d, [result]);
                }
            };
        };
        Deferred.prototype.done = function () {
            var _this = this;
            var callbacks = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                callbacks[_i - 0] = arguments[_i];
            }
            var d = new Deferred();
            callbacks.forEach(function (callback) {
                _this.doneCallbacks.push(_this.wrap(d, callback, d.resolve));
            });
            this.checkStatus();
            return d;
        };
        Deferred.prototype.fail = function () {
            var _this = this;
            var callbacks = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                callbacks[_i - 0] = arguments[_i];
            }
            var d = new Deferred();
            callbacks.forEach(function (callback) {
                _this.failCallbacks.push(_this.wrap(d, callback, d.reject));
            });
            this.checkStatus();
            return d;
        };
        Deferred.prototype.always = function () {
            var _this = this;
            var callbacks = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                callbacks[_i - 0] = arguments[_i];
            }
            var d = new Deferred();
            callbacks.forEach(function (callback) {
                _this.doneCallbacks.push(_this.wrap(d, callback, d.resolve));
                _this.failCallbacks.push(_this.wrap(d, callback, d.reject));
            });
            this.checkStatus();
            return d;
        };
        return Deferred;
    })();
    Kurve.Deferred = Deferred;
    var Promise = (function () {
        function Promise(deferred) {
            this.deferred = deferred;
        }
        Promise.prototype.then = function (doneFilter, failFilter, progressFilter) {
            return this.deferred.then(doneFilter, failFilter, progressFilter).promise;
        };
        Promise.prototype.done = function () {
            var callbacks = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                callbacks[_i - 0] = arguments[_i];
            }
            return this.deferred.done.apply(this.deferred, callbacks).promise;
        };
        Promise.prototype.fail = function () {
            var callbacks = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                callbacks[_i - 0] = arguments[_i];
            }
            return this.deferred.fail.apply(this.deferred, callbacks).promise;
        };
        Promise.prototype.always = function () {
            var callbacks = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                callbacks[_i - 0] = arguments[_i];
            }
            return this.deferred.always.apply(this.deferred, callbacks).promise;
        };
        Object.defineProperty(Promise.prototype, "resolved", {
            get: function () {
                return this.deferred.resolved;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Promise.prototype, "rejected", {
            get: function () {
                return this.deferred.rejected;
            },
            enumerable: true,
            configurable: true
        });
        return Promise;
    })();
    Kurve.Promise = Promise;
    Kurve.when = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (args.length === 1) {
            var arg = args[0];
            if (arg instanceof Deferred) {
                return arg.promise;
            }
            if (arg instanceof Promise) {
                return arg;
            }
        }
        var done = new Deferred();
        if (args.length === 1) {
            done.resolve(args[0]);
            return done.promise;
        }
        var pending = args.length;
        var results = [];
        var onDone = function () {
            var resultArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                resultArgs[_i - 0] = arguments[_i];
            }
            results.push(resultArgs);
            if (--pending === 0) {
                done.resolve.apply(done, results);
            }
        };
        var onFail = function () {
            done.reject();
        };
        args.forEach(function (a) {
            a.then(onDone, onFail);
        });
        return done.promise;
    };
})(Kurve || (Kurve = {}));
//*********************************************************   
//   
//Kurve js, https://github.com/microsoftdx/kurvejs
//  
//Copyright (c) Microsoft Corporation  
//All rights reserved.   
//  
// MIT License:  
// Permission is hereby granted, free of charge, to any person obtaining  
// a copy of this software and associated documentation files (the  
// ""Software""), to deal in the Software without restriction, including  
// without limitation the rights to use, copy, modify, merge, publish,  
// distribute, sublicense, and/or sell copies of the Software, and to  
// permit persons to whom the Software is furnished to do so, subject to  
// the following conditions:  
// The above copyright notice and this permission notice shall be  
// included in all copies or substantial portions of the Software.  
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,  
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE  
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION  
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION  
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  
//   
//*********************************************************   

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
var Kurve;
(function (Kurve) {
    var Error = (function () {
        function Error() {
        }
        return Error;
    })();
    Kurve.Error = Error;
    var Identity = (function () {
        function Identity(clientId, redirectUri) {
            var _this = this;
            if (clientId === void 0) { clientId = ""; }
            if (redirectUri === void 0) { redirectUri = ""; }
            this.authContext = null;
            this.config = null;
            this.isCallback = false;
            this.clientId = clientId;
            this.redirectUri = redirectUri;
            this.req = new XMLHttpRequest();
            this.tokenCache = {};
            //Callback handler from other windows
            window.addEventListener("message", (function (event) {
                if (event.data.type === "id_token") {
                    //Callback being called by the login window
                    if (!event.data.token) {
                        _this.loginCallback(event.data);
                    }
                    else {
                        //check for state
                        if (_this.state !== event.data.state) {
                            var error = new Error();
                            error.statusText = "Invalid state";
                            _this.loginCallback(error);
                        }
                        else {
                            _this.decodeIdToken(event.data.token);
                            _this.loginCallback(null);
                        }
                    }
                }
                else if (event.data.type === "access_token") {
                    //Callback being called by the iframe with the token
                    if (!event.data.token)
                        _this.getTokenCallback(null, event.data);
                    else {
                        var token = event.data.token;
                        var iframe = document.getElementById("tokenIFrame");
                        iframe.parentNode.removeChild(iframe);
                        if (event.data.state !== _this.state) {
                            var error = new Error();
                            error.statusText = "Invalid state";
                            _this.getTokenCallback(null, error);
                        }
                        else {
                            _this.getTokenCallback(token, null);
                        }
                    }
                }
            }));
        }
        Identity.prototype.decodeIdToken = function (idToken) {
            var _this = this;
            var decodedToken = this.base64Decode(idToken.substring(idToken.indexOf('.') + 1, idToken.lastIndexOf('.')));
            var decodedTokenJSON = JSON.parse(decodedToken);
            var expiryDate = new Date(new Date('01/01/1970 0:0 UTC').getTime() + parseInt(decodedTokenJSON.exp) * 1000);
            this.idToken = {
                token: idToken,
                expiry: expiryDate,
                upn: decodedTokenJSON.upn,
                tenantId: decodedTokenJSON.tid,
                family_name: decodedTokenJSON.family_name,
                given_name: decodedTokenJSON.given_name,
                name: decodedTokenJSON.name
            };
            this.refreshTimer = setTimeout((function () {
                _this.renewIdToken();
            }), parseInt(decodedTokenJSON.exp) * 1000 - 300000);
        };
        Identity.prototype.decodeAccessToken = function (accessToken, resource) {
            var decodedToken = this.base64Decode(accessToken.substring(accessToken.indexOf('.') + 1, accessToken.lastIndexOf('.')));
            var decodedTokenJSON = JSON.parse(decodedToken);
            var expiryDate = new Date(new Date('01/01/1970 0:0 UTC').getTime() + parseInt(decodedTokenJSON.exp) * 1000);
            this.tokenCache[resource] = {
                resource: resource,
                token: accessToken,
                expiry: expiryDate
            };
        };
        Identity.prototype.getIdToken = function () {
            return this.idToken;
        };
        Identity.prototype.isLoggedIn = function () {
            if (!this.idToken)
                return false;
            return (this.idToken.expiry > new Date());
        };
        Identity.prototype.renewIdToken = function () {
            clearTimeout(this.refreshTimer);
            this.login((function () {
            }));
        };
        Identity.prototype.getAccessTokenAsync = function (resource) {
            var d = new Kurve.Deferred();
            this.getAccessToken(resource, (function (token, error) {
                if (error) {
                    d.reject(error);
                }
                else {
                    d.resolve(token);
                }
            }));
            return d.promise;
        };
        Identity.prototype.getAccessToken = function (resource, callback) {
            var _this = this;
            //Check for cache and see if we have a valid token
            var cachedToken = this.tokenCache[resource];
            if (cachedToken) {
                //We have it cached, has it expired? (5 minutes error margin)
                if (cachedToken.expiry > (new Date(new Date().getTime() + 60000))) {
                    callback(cachedToken.token, null);
                    return;
                }
            }
            //If we got this far, we need to go get this token
            //Need to create the iFrame to invoke the acquire token
            this.getTokenCallback = (function (token, error) {
                if (error) {
                    callback(null, error);
                }
                else {
                    _this.decodeAccessToken(token, resource);
                    callback(token, null);
                }
            });
            this.nonce = this.generateNonce();
            this.state = this.generateNonce();
            var iframe = document.createElement('iframe');
            iframe.style.display = "none";
            iframe.id = "tokenIFrame";
            iframe.src = "./login.html?clientId=" + encodeURIComponent(this.clientId) +
                "&resource=" + encodeURIComponent(resource) +
                "&redirectUri=" + encodeURIComponent(this.redirectUri) +
                "&state=" + encodeURIComponent(this.state) +
                "&nonce=" + encodeURIComponent(this.nonce);
            document.body.appendChild(iframe);
        };
        Identity.prototype.loginAsync = function () {
            var d = new Kurve.Deferred();
            this.login((function (error) {
                if (error) {
                    d.reject(error);
                }
                else {
                    d.resolve();
                }
            }));
            return d.promise;
        };
        Identity.prototype.login = function (callback) {
            this.loginCallback = callback;
            this.state = this.generateNonce();
            this.nonce = this.generateNonce();
            window.open("./login.html?clientId=" + encodeURIComponent(this.clientId) +
                "&redirectUri=" + encodeURIComponent(this.redirectUri) +
                "&state=" + encodeURIComponent(this.state) +
                "&nonce=" + encodeURIComponent(this.nonce), "_blank");
        };
        Identity.prototype.logOut = function () {
            var url = "https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=" + encodeURI(window.location.href);
            window.location.href = url;
        };
        Identity.prototype.base64Decode = function (encodedString) {
            var e = {}, i, b = 0, c, x, l = 0, a, r = '', w = String.fromCharCode, L = encodedString.length;
            var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for (i = 0; i < 64; i++) {
                e[A.charAt(i)] = i;
            }
            for (x = 0; x < L; x++) {
                c = e[encodedString.charAt(x)];
                b = (b << 6) + c;
                l += 6;
                while (l >= 8) {
                    ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a));
                }
            }
            return r;
        };
        Identity.prototype.generateNonce = function () {
            var text = "";
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 32; i++) {
                text += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return text;
        };
        return Identity;
    })();
    Kurve.Identity = Identity;
})(Kurve || (Kurve = {}));
//*********************************************************   
//   
//Kurve js, https://github.com/microsoftdx/kurvejs
//  
//Copyright (c) Microsoft Corporation  
//All rights reserved.   
//  
// MIT License:  
// Permission is hereby granted, free of charge, to any person obtaining  
// a copy of this software and associated documentation files (the  
// ""Software""), to deal in the Software without restriction, including  
// without limitation the rights to use, copy, modify, merge, publish,  
// distribute, sublicense, and/or sell copies of the Software, and to  
// permit persons to whom the Software is furnished to do so, subject to  
// the following conditions:  
// The above copyright notice and this permission notice shall be  
// included in all copies or substantial portions of the Software.  
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,  
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE  
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION  
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION  
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  
//   
//*********************************************************   

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
var Kurve;
(function (Kurve) {
    var Graph = (function () {
        function Graph(identityInfo) {
            this.req = null;
            this.state = null;
            this.nonce = null;
            this.accessToken = null;
            this.KurveIdentity = null;
            this.defaultResourceID = "https://graph.microsoft.com";
            this.baseUrl = "https://graph.microsoft.com/v1.0/";
            if (identityInfo.defaultAccessToken) {
                this.accessToken = identityInfo.defaultAccessToken;
            }
            else {
                this.KurveIdentity = identityInfo.identity;
            }
        }
        //Users
        Graph.prototype.meAsync = function (odataQuery) {
            var d = new Kurve.Deferred();
            this.me(function (user, error) {
                if (error) {
                    d.reject(error);
                }
                else {
                    d.resolve(user);
                }
            }, odataQuery);
            return d.promise;
        };
        Graph.prototype.me = function (callback, odataQuery) {
            var urlString = this.buildMeUrl() + "/";
            if (odataQuery) {
                urlString += "?" + odataQuery;
            }
            this.getUser(urlString, callback);
        };
        Graph.prototype.userAsync = function (userId) {
            var d = new Kurve.Deferred();
            this.user(userId, function (users, error) {
                if (error) {
                    d.reject(error);
                }
                else {
                    d.resolve(users);
                }
            });
            return d.promise;
        };
        Graph.prototype.user = function (userId, callback) {
            var urlString = this.buildUsersUrl() + "/" + userId;
            this.getUser(urlString, callback);
        };
        Graph.prototype.usersAsync = function (odataQuery) {
            var d = new Kurve.Deferred();
            this.users(function (users, error) {
                if (error) {
                    d.reject(error);
                }
                else {
                    d.resolve(users);
                }
            }, odataQuery);
            return d.promise;
        };
        Graph.prototype.users = function (callback, odataQuery) {
            var urlString = this.buildUsersUrl() + "/";
            if (odataQuery) {
                urlString += "?" + odataQuery;
            }
            this.getUsers(urlString, callback);
        };
        //Groups
        Graph.prototype.groupAsync = function (groupId) {
            var d = new Kurve.Deferred();
            this.group(groupId, function (group, error) {
                if (error) {
                    d.reject(error);
                }
                else {
                    d.resolve(group);
                }
            });
            return d.promise;
        };
        Graph.prototype.group = function (groupId, callback) {
            var urlString = this.buildGroupsUrl() + "/" + groupId;
            this.getGroup(urlString, callback);
        };
        Graph.prototype.groups = function (callback, odataQuery) {
            var urlString = this.buildGroupsUrl() + "/";
            if (odataQuery) {
                urlString += "?" + odataQuery;
            }
            this.getGroups(urlString, callback);
        };
        Graph.prototype.groupsAsync = function (odataQuery) {
            var d = new Kurve.Deferred();
            this.groups(function (groups, error) {
                if (error) {
                    d.reject(error);
                }
                else {
                    d.resolve(groups);
                }
            }, odataQuery);
            return d.promise;
        };
        //http verbs
        Graph.prototype.getAsync = function (url) {
            var d = new Kurve.Deferred();
            this.get(url, function (response, error) {
                if (!error)
                    d.resolve(response);
                else
                    d.reject(error);
            });
            return d.promise;
        };
        Graph.prototype.get = function (url, callback, responseType) {
            var _this = this;
            var xhr = new XMLHttpRequest();
            if (responseType)
                xhr.responseType = responseType;
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (!responseType)
                        callback(xhr.responseText, null);
                    else
                        callback(xhr.response, null);
                }
                else if (xhr.readyState === 4 && xhr.status !== 200) {
                    callback(null, _this.generateError(xhr));
                }
            });
            xhr.open("GET", url);
            this.addAccessTokenAndSend(xhr, function (addTokenError) {
                if (addTokenError) {
                    callback(null, addTokenError);
                }
            });
        };
        Graph.prototype.generateError = function (xhr) {
            var response = new Kurve.Error();
            response.status = xhr.status;
            response.statusText = xhr.statusText;
            if (xhr.responseType === '' || xhr.responseType === 'text')
                response.text = xhr.responseText;
            else
                response.other = xhr.response;
            return response;
        };
        //Private methods
        Graph.prototype.getUsers = function (urlString, callback) {
            var _this = this;
            this.get(urlString, (function (result, errorGet) {
                if (errorGet) {
                    callback(null, errorGet);
                    return;
                }
                var usersODATA = JSON.parse(result);
                if (usersODATA.error) {
                    var errorODATA = new Kurve.Error();
                    errorODATA.other = usersODATA.error;
                    callback(null, errorODATA);
                    return;
                }
                var resultsArray = !usersODATA.value ? [usersODATA] : usersODATA.value;
                for (var i = 0; i < resultsArray.length; i++) {
                    _this.decorateUserObject(resultsArray[i]);
                }
                var users = {
                    resultsPage: resultsArray
                };
                //implement nextLink
                var nextLink = usersODATA['@odata.nextLink'];
                if (nextLink) {
                    users.nextLink = (function (callback) {
                        var d = new Kurve.Deferred();
                        _this.getUsers(nextLink, (function (result, error) {
                            if (callback)
                                callback(result, error);
                            else if (error)
                                d.reject(error);
                            else
                                d.resolve(result);
                        }));
                        return d.promise;
                    });
                }
                callback(users, null);
            }));
        };
        Graph.prototype.getUser = function (urlString, callback) {
            var _this = this;
            this.get(urlString, function (result, errorGet) {
                if (errorGet) {
                    callback(null, errorGet);
                    return;
                }
                var userODATA = JSON.parse(result);
                if (userODATA.error) {
                    var errorODATA = new Kurve.Error();
                    errorODATA.other = userODATA.error;
                    callback(null, errorODATA);
                    return;
                }
                _this.decorateUserObject(userODATA);
                callback(userODATA, null);
            });
        };
        Graph.prototype.addAccessTokenAndSend = function (xhr, callback) {
            if (this.accessToken) {
                //Using default access token
                xhr.setRequestHeader('Authorization', 'Bearer ' + this.accessToken);
                xhr.send();
            }
            else {
                //Using the integrated Identity object
                this.KurveIdentity.getAccessToken(this.defaultResourceID, (function (token, error) {
                    //cache the token
                    if (error)
                        callback(error);
                    else {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        xhr.send();
                        callback(null);
                    }
                }));
            }
        };
        Graph.prototype.decorateUserObject = function (user) {
            var _this = this;
            user.messages = (function (callback, odataQuery) {
                var urlString = _this.buildUsersUrl() + "/" + user.userPrincipalName + "/messages";
                if (odataQuery)
                    urlString += "?" + odataQuery;
                _this.getMessages(urlString, function (result, error) {
                    callback(result, error);
                }, odataQuery);
            });
            user.messagesAsync = (function (odataQuery) {
                var d = new Kurve.Deferred();
                user.messages(function (result, error) {
                    if (error) {
                        d.reject(error);
                    }
                    else {
                        d.resolve(result);
                    }
                }, odataQuery);
                return d.promise;
            });
            user.memberOf = (function (callback, odataQuery) {
                var urlString = _this.buildUsersUrl() + "/" + user.userPrincipalName + "/memberOf";
                if (odataQuery)
                    urlString += "?" + odataQuery;
                _this.getGroups(urlString, callback, odataQuery);
            });
            user.memberOfAsync = (function (odataQuery) {
                var d = new Kurve.Deferred();
                user.memberOf(function (result, error) {
                    if (error) {
                        d.reject(error);
                    }
                    else {
                        d.resolve(result);
                    }
                }, odataQuery);
                return d.promise;
            });
            user.manager = (function (callback) {
                var urlString = _this.buildUsersUrl() + "/" + user.userPrincipalName + "/manager";
                _this.getUser(urlString, callback);
            });
            user.managerAsync = (function (odataQuery) {
                var d = new Kurve.Deferred();
                user.manager(function (result, error) {
                    if (error) {
                        d.reject(error);
                    }
                    else {
                        d.resolve(result);
                    }
                }, odataQuery);
                return d.promise;
            });
            user.directReports = (function (callback) {
                var urlString = _this.buildUsersUrl() + "/" + user.userPrincipalName + "/directReports";
                _this.getUsers(urlString, callback);
            });
            user.directReportsAsync = (function (odataQuery) {
                var d = new Kurve.Deferred();
                user.directReports(function (result, error) {
                    if (error) {
                        d.reject(error);
                    }
                    else {
                        d.resolve(result);
                    }
                }, odataQuery);
                return d.promise;
            });
            user.photo = (function (callback) {
                var urlString = _this.buildUsersUrl() + "/" + user.userPrincipalName + "/photo";
                _this.getPhoto(urlString, callback);
            });
            user.photoAsync = (function () {
                var d = new Kurve.Deferred();
                user.photo(function (result, error) {
                    if (error) {
                        d.reject(error);
                    }
                    else {
                        d.resolve(result);
                    }
                });
                return d.promise;
            });
            user.photoValue = (function (callback) {
                var urlString = _this.buildUsersUrl() + "/" + user.userPrincipalName + "/photo/$value";
                _this.getPhotoValue(urlString, callback);
            });
            user.photoValueAsync = (function () {
                var d = new Kurve.Deferred();
                user.photoValue(function (result, error) {
                    if (error) {
                        d.reject(error);
                    }
                    else {
                        d.resolve(result);
                    }
                });
                return d.promise;
            });
        };
        Graph.prototype.decorateMessageObject = function (message) {
        };
        Graph.prototype.decorateGroupObject = function (message) {
        };
        Graph.prototype.decoratePhotoObject = function (message) {
        };
        Graph.prototype.getMessages = function (urlString, callback, odataQuery) {
            var _this = this;
            var url = urlString;
            if (odataQuery)
                urlString += "?" + odataQuery;
            this.get(url, (function (result, errorGet) {
                if (errorGet) {
                    callback(null, errorGet);
                    return;
                }
                var messagesODATA = JSON.parse(result);
                if (messagesODATA.error) {
                    var errorODATA = new Kurve.Error();
                    errorODATA.other = messagesODATA.error;
                    callback(null, errorODATA);
                    return;
                }
                var resultsArray = !messagesODATA.value ? [messagesODATA] : messagesODATA.value;
                for (var i = 0; i < resultsArray.length; i++) {
                    _this.decorateMessageObject(resultsArray[i]);
                }
                var messages = {
                    resultsPage: resultsArray
                };
                var nextLink = messagesODATA['@odata.nextLink'];
                //implement nextLink
                if (nextLink) {
                    messages.nextLink = (function (callback) {
                        var d = new Kurve.Deferred();
                        _this.getMessages(nextLink, (function (result, error) {
                            if (callback)
                                callback(result, error);
                            else if (error)
                                d.reject(error);
                            else
                                d.resolve(result);
                        }));
                        return d.promise;
                    });
                }
                callback(messages, null);
            }));
        };
        Graph.prototype.getGroups = function (urlString, callback, odataQuery) {
            var _this = this;
            var url = urlString;
            if (odataQuery)
                urlString += "?" + odataQuery;
            this.get(url, (function (result, errorGet) {
                if (errorGet) {
                    callback(null, errorGet);
                    return;
                }
                var groupsODATA = JSON.parse(result);
                if (groupsODATA.error) {
                    var errorODATA = new Kurve.Error();
                    errorODATA.other = groupsODATA.error;
                    callback(null, errorODATA);
                    return;
                }
                var resultsArray = !groupsODATA.value ? [groupsODATA] : groupsODATA.value;
                for (var i = 0; i < resultsArray.length; i++) {
                    _this.decorateGroupObject(resultsArray[i]);
                }
                var groups = {
                    resultsPage: resultsArray
                };
                var nextLink = groupsODATA['@odata.nextLink'];
                //implement nextLink
                if (nextLink) {
                    groups.nextLink = (function (callback) {
                        var d = new Kurve.Deferred();
                        _this.getGroups(nextLink, (function (result, error) {
                            if (callback)
                                callback(result, error);
                            else if (error)
                                d.reject(error);
                            else
                                d.resolve(result);
                        }));
                        return d.promise;
                    });
                }
                callback(groups, null);
            }));
        };
        Graph.prototype.getGroup = function (urlString, callback) {
            var _this = this;
            this.get(urlString, function (result, errorGet) {
                if (errorGet) {
                    callback(null, errorGet);
                    return;
                }
                var ODATA = JSON.parse(result);
                if (ODATA.error) {
                    var ODATAError = new Kurve.Error();
                    ODATAError.other = ODATA.error;
                    callback(null, ODATAError);
                    return;
                }
                _this.decorateGroupObject(ODATA);
                callback(ODATA, null);
            });
        };
        Graph.prototype.getPhoto = function (urlString, callback) {
            var _this = this;
            this.get(urlString, function (result, errorGet) {
                if (errorGet) {
                    callback(null, errorGet);
                    return;
                }
                var ODATA = JSON.parse(result);
                if (ODATA.error) {
                    var errorODATA = new Kurve.Error();
                    errorODATA.other = ODATA.error;
                    callback(null, errorODATA);
                    return;
                }
                _this.decoratePhotoObject(ODATA);
                callback(ODATA, null);
            });
        };
        Graph.prototype.getPhotoValue = function (urlString, callback) {
            this.get(urlString, function (result, errorGet) {
                if (errorGet) {
                    callback(null, errorGet);
                    return;
                }
                callback(result, null);
            }, "blob");
        };
        Graph.prototype.buildMeUrl = function () {
            return this.baseUrl + "me";
        };
        Graph.prototype.buildUsersUrl = function () {
            return this.baseUrl + "/users";
        };
        Graph.prototype.buildGroupsUrl = function () {
            return this.baseUrl + "/groups";
        };
        return Graph;
    })();
    Kurve.Graph = Graph;
})(Kurve || (Kurve = {}));
//*********************************************************   
//   
//Kurve js, https://github.com/microsoftdx/kurvejs
//  
//Copyright (c) Microsoft Corporation  
//All rights reserved.   
//  
// MIT License:  
// Permission is hereby granted, free of charge, to any person obtaining  
// a copy of this software and associated documentation files (the  
// ""Software""), to deal in the Software without restriction, including  
// without limitation the rights to use, copy, modify, merge, publish,  
// distribute, sublicense, and/or sell copies of the Software, and to  
// permit persons to whom the Software is furnished to do so, subject to  
// the following conditions:  
// The above copyright notice and this permission notice shall be  
// included in all copies or substantial portions of the Software.  
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,  
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE  
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION  
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION  
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  
//   
//*********************************************************   

if (((typeof window != "undefined" && window.module) || (typeof module != "undefined")) && typeof module.exports != "undefined") {
    module.exports = Kurve;
};
