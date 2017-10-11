(function() {
  const iconSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
<path fill="#AAAAAA" d="M9.8,18l-3.8,4.4c-0.3,0.3-0.8,0.4-1.1,0L1,18c-0.4-0.5-0.1-1,0.5-1H3V6.4C3,3.8,5.5,2,8.2,2h3.9
    c1.1,0,2,0.9,2,2s-0.9,2-2,2H8.2C7.7,6,7,6,7,6.4V17h2.2C9.8,17,10.2,17.5,9.8,18z M23,6l-3.8-4.5c-0.3-0.3-0.8-0.3-1.1,0L14.2,6
    c-0.4,0.5-0.1,1,0.5,1H17v10.6c0,0.4-0.7,0.4-1.2,0.4h-3.9c-1.1,0-2,0.9-2,2s0.9,2,2,2h3.9c2.6,0,5.2-1.8,5.2-4.4V7h1.5
    C23.1,7,23.4,6.5,23,6z"></path>
</svg>`;
  const stylesText = `
  #symfonyProfilerCounter{
      display:block;
      position:fixed;
      bottom: 0px;
      left: 0px;
      height: 30px;
      z-index: 99;
      white-space: no-wrap;
      background-color: #222;
      padding: 3px;
      color: white;
  }
  #symfonyProfilerCounter.symfonyProfilerCounter__open,
  #symfonyProfilerCounter:hover{
      background-color: #444;
  }
  #symfonyProfilerCounter.symfonyProfilerCounter__open #symfonyProfilerCounter__popover,
  #symfonyProfilerCounter:hover #symfonyProfilerCounter__popover{
     display:block
  } 
  #symfonyProfilerCounter__count{
     vertical-align: super;
  }
  #symfonyProfilerCounter__popover{
      display: none;
      position:absolute;
      left:100%;
      bottom:0;    
      background-color: #444;
      padding: 4px;
  }
  #symfonyProfilerCounter__table td{
      vertical-align: super;
      background-color: #444;
      border-bottom: 1px solid #777;
      color: #F5F5F5;
      font-size: 12px;
      padding: 4px;
  }
  #symfonyProfilerCounter__table td a{
      color: #99CDD8;
  }
  
  #symfonyProfilerCounter__table th{
      background-color: #222;
      border-bottom: 0;
      color: #AAA;
      font-size: 11px;
      padding: 4px; 
  }
`;
  const profilerArr = [];
  const appendProfiler = function(profilerObj) {
    profilerArr.push(profilerObj);
    updateCount();
    renderPopup();
  };
  const renderPanel = function() {
    const div = document.createElement('div');
    const styles = document.createElement('style');
    div.addEventListener(
      'click',
      e => {
        e.currentTarget.classList.toggle('symfonyProfilerCounter__open');
      },
      false,
    );
    div.id = 'symfonyProfilerCounter';
    div.innerHTML = `
                      ${iconSvg}
                      <span id="symfonyProfilerCounter__count">0</span>
                      <div id="symfonyProfilerCounter__popover">
                        <table id="symfonyProfilerCounter__table">
                            <thead>
                                <tr>
                                    <th>status</th>
                                    <th>url</th>
                                    <th>time</th>
                                    <th>profile</th>
                                </tr>
                            </thead>
                            <tbody>
                            
                            </tbody>
                        </table>
                      </div>
                    `;

    if (styles.styleSheet) {
      styles.styleSheet.cssText = stylesText;
    } else {
      styles.appendChild(document.createTextNode(stylesText));
    }
    document.body.appendChild(div);
    document.body.appendChild(styles);
    updateCount(profilerArr.length);
  };
  var updateCount = function() {
    document.getElementById('symfonyProfilerCounter__count').innerHTML =
      profilerArr.length;
  };
  var renderPopup = function() {
    const table = document.getElementById('symfonyProfilerCounter__table');
    const tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    for (let i = 0; i < profilerArr.length; i++) {
      const { status, responseURL, profilerLink, duration } = profilerArr[i];
      const item = document.createElement('tr');
      item.innerHTML = `
      <td>${status}</td>
      <td>${responseURL}</td>
      <td>${duration}ms</td>
      <td><a href="${profilerLink}" target="_blank">${profilerLink}</a></td>
      `;
      tbody.appendChild(item);
    }
  };
  renderPanel();
  if (window && window.XMLHttpRequest) {
    const origOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
      const startTime = Date.now();
      this.addEventListener('load', e => {
        const endTime = Date.now();
        const findStr = e.target
          .getAllResponseHeaders()
          .split('\n')
          .filter(el => el.indexOf('x-debug-token-link') > -1)[0];
        if (findStr) {
          const profilerLink = findStr
            .split(':')
            .slice(1)
            .join(':');
          const responseURL = e.target.responseURL;
          const status = e.target.status;
          const duration = endTime - startTime;
          appendProfiler({ status, responseURL, profilerLink, duration });
        }
      });
      origOpen.apply(this, arguments);
    };
  }
})();
