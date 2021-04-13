const $cards = document.querySelector('.cards__items');
const $cardsSection = document.querySelectorAll('section');
// const $links = document.querySelector('.header__links');
const $search = document.querySelector('.header__input')
const $pagination = document.querySelector('.pagination__items');
const $fullInfo = document.querySelector('.full-info__items');
const $goBackBtn = document.querySelector('.full-info__btn');

const urlAPI = "https://swapi.dev/api/";
let eventCategory = 'people';
generatePaginationAndFirstData(eventCategory)

async function getApiData(url){
    const resolve = await fetch(url);
    return await resolve.json();
}

//--получаем название категории (category) и меняем активную кнопку--
// $links.addEventListener('click', getCategory); //если понадобятся страницы

// function getCategory(event){
//     event.preventDefault();
//     const target = event.target;
//     if(target.classList.contains('header__href')){
//         changeActiveBtn($links, '.header__href', target, 'active');
//         eventCategory = target.dataset.name;
//         if (!eventCategory) return;
//         generatePaginationAndFirstData(eventCategory);
//     }
// }
//-------------------------------------------------------------------

function generatePaginationAndFirstData(category){
    const url = urlAPI + category + "/";
    getApiData(url).then(result => {
        const pages = Math.ceil(result.count / 10);
        createPagination(pages)
        createCards(result.results)
    })
}

function genereatePaginationEvent(page){
    const url = urlAPI + eventCategory + "/?page=" + page;
    getApiData(url).then(result => {
        createCards(result.results)
    })
}

function generateFullInfo(url){
    url = url.replace('http', 'https');
    getApiData(url).then(res => {
        createFullPage(res);
        changeHiddenElements();
    })
}

//----- заполнение пагинации -----
function createPagination(pages){
    let array = [];
    for (let i = 1; i <= pages; i++){
        let liItem;
        if (i === 1) liItem = `<li class="pagination__item pagination__active">${i}</li>`
        else liItem = `<li class="pagination__item">${i}</li>`

        array.push(liItem);
    }
    $pagination.innerHTML = array.join('\n');
}
//--------------------------------

//----смена активной кнопки----
function changeActiveBtn(selector, selectorName, target, className){
    selector.querySelectorAll(`${selectorName}`).forEach(el => {
        el.classList.remove(`${className}`)
    });
    const classList = target.classList;
    if(!classList.contains(`${className}`)){
        classList.add(`${className}`)
    }
}
//-----------------------------

//------- наполнение страницы li карточками -------
function createCards(data){
    let array = [];
    data.forEach(obj => {
        const title = obj.name;
        const info = obj['birth_year'];
        const infoSmaller = obj.gender;

        let cardsTemplate = `<li class="cards__item" data-url="${obj.url}">
                        <img class="cards__image" src="img/card-image.png" alt="card-image">
                        <div class="cards__text">
                            <p class="cards__title">${title}</p>
                            <p class="cards__info">Birth year: ${info}</p>
                            <p class="cards__info-smaller">Gender: ${infoSmaller}</p>
                        </div>
                      </li>`

        array.push(cardsTemplate)
    });

    $cards.innerHTML = array.join('\n');
}
//-----------------------------------------------

//---- получаем название категории (category) и меняем активную кнопку ----
$pagination.addEventListener('click', getPage)

function getPage(event){
    const target = event.target;
    if (target.classList.contains('pagination__item')){
        changeActiveBtn($pagination, '.pagination__item', target, 'pagination__active');
        genereatePaginationEvent(target.textContent);
    }
}
//-------------------------------------------------------------------------

//---- получаем полные данные по карточке ----
$cards.addEventListener('click', showFullInfo)
function showFullInfo(event) {
    const liElement = event.target.closest('li');
    if (!liElement) return;
    const url = liElement.dataset.url;
    generateFullInfo(url);
}
//--------------------------------------------

//--- создаём карточку с полной информацией ---
function createFullPage(obj){
    const liArray = [];
    const arrayKeys = ["name", "birth_year", "gender", "height", "mass", "skin_color", "eye_color"];

    for (let i = 0; i < arrayKeys.length; i++){
        let title = arrayKeys[i].split("_").join(" ");
        let description = obj[`${arrayKeys[i]}`];
        const liItem = `<li class="full-info__item">
                        <p class="full-info__title">${title}</p>
                        <p class="full-info__description">${description}</p>
                    </li>`;
        liArray.push(liItem);
    }
    $fullInfo.innerHTML = liArray.join('\n');
}
//---------------------------------------------

function changeHiddenElements(){
    $cardsSection.forEach(el => {
        el.hidden = !el.hidden;
    })
    $search.hidden = !$search.hidden;
    // $links.parentElement.hidden = !$links.parentElement.hidden;
}

$goBackBtn.addEventListener('click', () => {
    changeHiddenElements();
})

//--- SEARCH ---
$search.addEventListener('input', searchElements)

function searchElements(event){
    const url = `https://swapi.dev/api/people/?search=${event.target.value}`;
    getApiData(url).then(res => {
        const pages = Math.ceil(res.count / 10);
        createPagination(pages)
        createCards(res.results)
    });
}
