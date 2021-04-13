const $cards = document.querySelector('.cards__items');
const $links = document.querySelector('.header__links');
const $pagination = document.querySelector('.pagination__items')

//как идея - можно передвигаться по страницам с помощью next previous
// эти ссылки указаны в соответствующих полях в данных
// создать ещё одну ассинхронную функцию, которая будет получать эти данные

// или загрузить все данные со всех страниц для категории,
// сделать массив объектов
// из массива брать данные при перемещении по страницам
// при загрузке другой страницы проделывать то же самое.
// так же можно всё записывать в localstorage (подумать над обновлением localstorage)

//--получаем название категории (category) и меняем активную кнопку--
$links.addEventListener('click', getCategory);
function getCategory(event){
    event.preventDefault();
    const target = event.target;
    if(target.classList.contains('header__href')){
        changeActiveBtn($links, '.header__href', target, 'active');
        generateData(target.dataset.name)
    }
}
//-------------------------------------------------------------------

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

//-----получение данных-----
async function getAPIjson(category, id = 1) {
    const url = "https://swapi.dev/api/"
    const resolve = await fetch(`${url}${category}/?page=${id}`);
    return await resolve.json();
    //results //count
}
//--------------------------



const array = [];
// вызов функции для генерации данных
function generateData(category){
    // здесь ещё нужно передать id из функции;
    // const id =

    // getAPIjson(cagerory)
    //     .then(result => {
    //     const pages = Math.ceil(result.count / 10);
    //     createPagination(pages)
    //     return {results: result.results, pages: pages};
    // })
    //     .then(res => {
    //         if (array.length) array.length = 0;
    //         for (let i = 1; i <= res.pages; i++){
    //             array.push(res.results)
    //         }
    //     })

    getAPIjson(category).then(result => {
        const pages = Math.ceil(result.count / 10);
        createPagination(pages)

        // console.log(result)
        // console.log(result.results)

        let fields;
        if (category === "people"){
            fields = {title: 'name', info: 'birth_year', infoSmaller: 'gender', infoStr: "Birth year", infoSmallerStr: "Gender"}
        }
        else if (category === "planets"){
            fields = {title: 'name', info: 'climate', infoSmaller: 'diameter', infoStr: "Climate", infoSmallerStr: "Diameter"}
        }
        else if (category === "starships"){
            fields = {title: 'name', info: 'cost_in_credits', infoSmaller: 'length', infoStr: "Cost", infoSmallerStr: "Length"}
        }
        else if (category === "films"){
            fields = {title: 'title', info: 'director', infoSmaller: 'episode_id', infoStr: "Director", infoSmallerStr: "Episode"}
        }
        createCards(result.results, fields);
    })
}

//получение номера страницы(id)
function getId(get){
}


// получаем объекты с данными
function getDataObj(data){

}


//------- наполнение страницы li карточки -------
function createCards(data, fields){
    let array = [];
    data.forEach(obj => {
        const title = obj[fields.title];
        const info = obj[fields.info];
        const infoSmaller = obj[fields.infoSmaller];

        const infoStr = fields.infoStr;
        const infoSmallerStr = fields.infoSmallerStr;

        let cardsTemplate = `<li class="cards__item">
                        <img class="cards__image" src="img/card-image.png" alt="card-image">
                        <div class="cards__text">
                            <p class="cards__title">${title}</p>
                            <p class="cards__info">${infoStr}: ${info}</p>
                            <p class="cards__info-smaller">${infoSmallerStr}: ${infoSmaller}</p>
                        </div>
                      </li>`

        array.push(cardsTemplate)
    });

    $cards.innerHTML = array.join('\n');
}
//-----------------------------------------------

//----- заполнение пагинации -----
function createPagination(pages){
    let array = [];
    for (let i = 1; i <= pages; i++){
        const liItem = `<li class="pagination__item">${i}</li>`
        array.push(liItem);
    }
    $pagination.innerHTML = array.join('\n');
}
//--------------------------------

//получаем название категории (category) и меняем активную кнопку
$pagination.addEventListener('click', getPage)
function getPage(event){
    const target = event.target;
    if (target.classList.contains('pagination__item')){
        changeActiveBtn($pagination, '.pagination__item', target, 'pagination__active');
        const id = target.textContent;
    }
}
