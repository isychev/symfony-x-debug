'use strict';

(function () {
  var iconSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">\n<path fill="#AAAAAA" d="M9.8,18l-3.8,4.4c-0.3,0.3-0.8,0.4-1.1,0L1,18c-0.4-0.5-0.1-1,0.5-1H3V6.4C3,3.8,5.5,2,8.2,2h3.9\n    c1.1,0,2,0.9,2,2s-0.9,2-2,2H8.2C7.7,6,7,6,7,6.4V17h2.2C9.8,17,10.2,17.5,9.8,18z M23,6l-3.8-4.5c-0.3-0.3-0.8-0.3-1.1,0L14.2,6\n    c-0.4,0.5-0.1,1,0.5,1H17v10.6c0,0.4-0.7,0.4-1.2,0.4h-3.9c-1.1,0-2,0.9-2,2s0.9,2,2,2h3.9c2.6,0,5.2-1.8,5.2-4.4V7h1.5\n    C23.1,7,23.4,6.5,23,6z"></path>\n</svg>';
  var stylesText = '\n  #symfonyProfilerCounter{\n      display:block;\n      position:fixed;\n      bottom: 0px;\n      left: 0px;\n      height: 30px;\n      z-index: 99;\n      white-space: no-wrap;\n      background-color: #222;\n      padding: 3px;\n      color: white;\n  }\n  #symfonyProfilerCounter.symfonyProfilerCounter__open,\n  #symfonyProfilerCounter:hover{\n      background-color: #444;\n  }\n  #symfonyProfilerCounter.symfonyProfilerCounter__open #symfonyProfilerCounter__popover,\n  #symfonyProfilerCounter:hover #symfonyProfilerCounter__popover{\n     display:block\n  } \n  #symfonyProfilerCounter__count{\n     vertical-align: super;\n  }\n  #symfonyProfilerCounter__popover{\n      display: none;\n      position:absolute;\n      left:100%;\n      bottom:0;    \n      background-color: #444;\n      padding: 4px;\n  }\n  #symfonyProfilerCounter__table td{\n      vertical-align: super;\n      background-color: #444;\n      border-bottom: 1px solid #777;\n      color: #F5F5F5;\n      font-size: 12px;\n      padding: 4px;\n  }\n  #symfonyProfilerCounter__table td a{\n      color: #99CDD8;\n  }\n  \n  #symfonyProfilerCounter__table th{\n      background-color: #222;\n      border-bottom: 0;\n      color: #AAA;\n      font-size: 11px;\n      padding: 4px; \n  }\n';
  var profilerArr = [];
  var appendProfiler = function appendProfiler(profilerObj) {
    profilerArr.push(profilerObj);
    updateCount();
    renderPopup();
  };
  var renderPanel = function renderPanel() {
    var div = document.createElement('div');
    var styles = document.createElement('style');
    div.addEventListener('click', function (e) {
      e.currentTarget.classList.toggle('symfonyProfilerCounter__open');
    }, false);
    div.id = 'symfonyProfilerCounter';
    div.innerHTML = '\n                      ' + iconSvg + '\n                      <span id="symfonyProfilerCounter__count">0</span>\n                      <div id="symfonyProfilerCounter__popover">\n                        <table id="symfonyProfilerCounter__table">\n                            <thead>\n                                <tr>\n                                    <th>status</th>\n                                    <th>url</th>\n                                    <th>time</th>\n                                    <th>profile</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                            \n                            </tbody>\n                        </table>\n                      </div>\n                    ';

    if (styles.styleSheet) {
      styles.styleSheet.cssText = stylesText;
    } else {
      styles.appendChild(document.createTextNode(stylesText));
    }
    document.body.appendChild(div);
    document.body.appendChild(styles);
    updateCount(profilerArr.length);
  };
  var updateCount = function updateCount() {
    document.getElementById('symfonyProfilerCounter__count').innerHTML = profilerArr.length;
  };
  var renderPopup = function renderPopup() {
    var table = document.getElementById('symfonyProfilerCounter__table');
    var tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    for (var i = 0; i < profilerArr.length; i++) {
      var _profilerArr$i = profilerArr[i],
          status = _profilerArr$i.status,
          responseURL = _profilerArr$i.responseURL,
          profilerLink = _profilerArr$i.profilerLink,
          duration = _profilerArr$i.duration;

      var item = document.createElement('tr');
      item.innerHTML = '\n      <td>' + status + '</td>\n      <td>' + responseURL + '</td>\n      <td>' + duration + 'ms</td>\n      <td><a href="' + profilerLink + '" target="_blank">' + profilerLink + '</a></td>\n      ';
      tbody.appendChild(item);
    }
  };
  renderPanel();
  if (window && window.XMLHttpRequest) {
    var origOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function () {
      var startTime = Date.now();
      this.addEventListener('load', function (e) {
        var endTime = Date.now();
        var findStr = e.target.getAllResponseHeaders().split('\n').filter(function (el) {
          return el.indexOf('x-debug-token-link') > -1;
        })[0];
        if (findStr) {
          var profilerLink = findStr.split(':').slice(1).join(':');
          var responseURL = e.target.responseURL;
          var status = e.target.status;
          var duration = endTime - startTime;
          appendProfiler({ status: status, responseURL: responseURL, profilerLink: profilerLink, duration: duration });
        }
      });
      origOpen.apply(this, arguments);
    };
  }
})();
