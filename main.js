function initAnnyang() {
    if (annyang) {
      const commands = {
        'hello': function() {
          alert('Hello World!');
        },
        'change the color to *color': function(color) {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': function(page) {
          navigateToPage(page.toLowerCase());
        }
      };
  
      if (typeof pageSpecificCommands === 'function') {
        const additionalCommands = pageSpecificCommands();
        Object.assign(commands, additionalCommands);
      }
  
      annyang.addCommands(commands);
  
      annyang.start();
      
      console.log('Annyang initialized and listening for commands');
    } else {
      console.error('Annyang not available');
    }
  }

  function navigateToPage(page) {
    switch (page) {
      case 'home':
        window.location.href = 'index.html';
        break;
      case 'stocks':
        window.location.href = 'stocks.html';
        break;
      case 'dogs':
        window.location.href = 'dogs.html';
        break;
      default:
        console.warn('Unknown page:', page);
    }
  }

  function turnOnAudio() {
    if (annyang) {
      annyang.start();
      console.log('Audio listening started');
    }
  }
  
  function turnOffAudio() {
    if (annyang) {
      annyang.abort();
      console.log('Audio listening stopped');
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    initAnnyang();
    
    const turnOnButton = document.getElementById('turn-on-audio');
    const turnOffButton = document.getElementById('turn-off-audio');
    
    if (turnOnButton) {
      turnOnButton.addEventListener('click', turnOnAudio);
    }
    
    if (turnOffButton) {
      turnOffButton.addEventListener('click', turnOffAudio);
    }
  });