const axios = require('axios').default;
import Notiflix from 'notiflix';

const refs = { 
    findImg: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    submitBtn: document.querySelector('button[type=submit]'),
    loadMore: document.querySelector('.load-more')

}

let searchQuery = '';
let page = 1;

const hidden = document.querySelector('.load-more')
hidden.classList.add('is-hidden')

refs.findImg.addEventListener('submit', onSubmit)
refs.loadMore.addEventListener('click', onLoadMore)


function onSubmit(event) {

    event.preventDefault();

    searchQuery = event.currentTarget.elements.searchQuery.value.trim();

     if (!searchQuery) {
         refs.gallery.innerHTML = '';
         hidden.classList.add('is-hidden')
         Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    return;  
    }


    resetPage()
    
     hidden.classList.remove('is-hidden')
    
        onSearchByName()
        .then(pictures => {
            clearPage();
            renderPictures(pictures)
            
        })
        .catch(error) 
}


async function onSearchByName() {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=31092155-fdd6914219543248b658a821f&q=${searchQuery}
   &image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
      return response
  } catch (error) {
   console.log("Ooooppsss I did it again");;
  }
}


function renderPictures(pictures) {
    if (pictures.data.hits.length === 0) {
        hidden.classList.add('is-hidden')
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    
    return;
    }
    timer()
           
    Notiflix.Notify.success(`Hooray! We found ${pictures.data.totalHits} images.`);

   addPage()
     const markup = pictures.data.hits
      .map((picture) => {
         
     return `<div class="photo-card">
            <img src="${picture.webformatURL}" alt="${picture.tags}" width="360" height="240" loading="lazy" />
            <div class="info">
            <p class="info-item"> likes:
            <b> ${picture.likes}</b>
            </p>
            <p class="info-item"> views: 
             <b>${picture.views}</b>
            </p>
            <p class="info-item"> comments:
              <b> ${picture.comments}</b>
            </p>
            <p class="info-item"> downloads:
           <b> ${picture.downloads}</b>
            </p>
            </div>
        </div>`;
       
    })
        .join("");
    
   
  refs.gallery.insertAdjacentHTML('beforeend' , markup)
    
    
}


function onLoadMore() {
    
    hidden.classList.add('is-hidden')
    onSearchByName()
        .then(renderPictures)     
}


function clearPage() {
   refs.gallery.innerHTML = ''
}


function timer() {
    const timerId = setTimeout(() => {
         
     hidden.classList.remove('is-hidden')
  }, 1000);
}


function error(error) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}


function addPage() { 
   
    page += 1;            
}

function resetPage() { 
    page = 1;
}
