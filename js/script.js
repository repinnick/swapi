const $cards = document.querySelector('.cards__items');
const $links = document.querySelector('.header__links');

//получаем название категории (category) и меняем активную кнопку
$links.addEventListener('click', getCategory);
function getCategory(event){
    event.preventDefault();
    const target = event.target;
    if(target.classList.contains('header__href')){
        changeActiveBtn(target);
        return target.dataset.name;
    }
}
function changeActiveBtn(target){
    $links.querySelectorAll('.header__href').forEach(el => {
        el.classList.remove('active')
    });
    const classList = target.classList;
    if(!classList.contains('active')){
        classList.add('active')
    }
}

//получение данных
async function getAPIjson(category, id = 1) {
    const url = "https://swapi.dev/api/"
    const resolve = await fetch(`${url}${category}/?page=${id}`);
    return await resolve.json();
    //results //count
}

