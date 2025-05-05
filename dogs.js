function loadRandomDogs() {
    fetch('https://dog.ceo/api/breeds/image/random/10')
      .then(response => response.json())
      .then(data => {
        const container = document.querySelector('.carousel-container');
        container.innerHTML = ''; 
        data.message.forEach(url => {
          const img = document.createElement('img');
          img.src = url;
          img.alt = 'Cute dog';
          img.classList.add('carousel-image');  
          container.appendChild(img);
        });
  
      })
      .catch(err => {
        console.error('Failed to load dog images:', err);
      });
  }
  
  function loadDogBreeds() {
    fetch('https://api.thedogapi.com/v1/breeds')
      .then(response => response.json())
      .then(data => {
        const breedList = document.querySelector('.breed-list');
        breedList.innerHTML = '';  
  
        data.forEach(breed => {
          const btn = document.createElement('button');
          btn.textContent = breed.name;
          btn.classList.add('custom-button');
          btn.addEventListener('click', () => showBreedInfo(breed));
          btn.setAttribute('data-breed', breed.name.toLowerCase());
          breedList.appendChild(btn);
        });
  
        window.breedsData = data;
      });
  }
  
  function showBreedInfo(breed) {
    const container = document.querySelector('.breed-info');
    container.innerHTML = `
      <h3>${breed.name}</h3>
      <p><strong>Description:</strong> ${breed.temperament || 'N/A'}</p>
      <p><strong>Life Span:</strong> ${breed.life_span}</p>
    `;
    container.style.display = 'block';
  }
  
  function pageSpecificCommands() {
    return {
      'load dog breed *breed': function(breedName) {
        const match = window.breedsData.find(b =>
          b.name.toLowerCase() === breedName.toLowerCase()
        );
        if (match) {
          showBreedInfo(match);
        } else {
          alert(`Could not find breed "${breedName}"`);
        }
      }
    };
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    loadRandomDogs();
    loadDogBreeds();
  });
  