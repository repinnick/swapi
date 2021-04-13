const $cards = document.querySelector('.cards__items');
const $links = document.querySelector('.header__links');
const $pagination = document.querySelector('.pagination__items')
const $fullInfo = document.querySelector('.full-info__items')

const urlAPI = "https://swapi.dev/api/"
let eventCategory;

// !!!! позже объединить в одну функцию, передавать разные url !!!!
async function getJsonAPI(category) {
    const link = urlAPI + category + "/"
    const resolve = await fetch(link);
    return await resolve.json();
}

async function getPageAPI(category, page){
    const link = urlAPI + category + "/?page=" + page;
    const resolve = await fetch(link)
    return await resolve.json();
}

async function getDetailsInfoAPI(url){
    const resolve = await fetch(url);
    return await resolve.json();
}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//--получаем название категории (category) и меняем активную кнопку--
$links.addEventListener('click', getCategory);

function getCategory(event){
    event.preventDefault();
    const target = event.target;
    if(target.classList.contains('header__href')){
        changeActiveBtn($links, '.header__href', target, 'active');
        eventCategory = target.dataset.name;
        generatePaginationAndFirstData(eventCategory);
    }
}
//-------------------------------------------------------------------

function generatePaginationAndFirstData(category){
    getJsonAPI(category).then(result => {
        const pages = Math.ceil(result.count / 10);
        createPagination(pages)
        createCards(result.results)
    })
}

function genereatePaginationEvent(page){
    getPageAPI(eventCategory, page).then(result => {
        createCards(result.results)
    })
}

function generateFullInfo(url){
    getDetailsInfoAPI(url).then(res => {
        createFullPage(res);
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
    const url = event.target.closest('li').dataset.url;
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

function changeHidenElements(){

}