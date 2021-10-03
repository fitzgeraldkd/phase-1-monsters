document.addEventListener('DOMContentLoaded', () => {
    const parameters = {
        '_limit': 50,
        '_page': 1
    }
    sendRequest('/monsters', renderMonsters, {}, parameters);

    document.getElementById('create-monster-form').addEventListener('submit', handleNewMonster);

    const backBttn = document.getElementById('back');
    backBttn.addEventListener('click', handleChangePage);
    backBttn.setAttribute('destination', 1);

    const forwardBttn = document.getElementById('forward');
    forwardBttn.addEventListener('click', handleChangePage);
    forwardBttn.setAttribute('destination', 2);

})

function renderMonsters(monsters) {
    const container = document.getElementById('monster-container');
    container.replaceChildren();
    monsters.forEach(monster => {
        const monsterDiv = document.createElement('div');
        const monsterName = document.createElement('h2');
        const monsterAge = document.createElement('h4');
        const monsterBio = document.createElement('p');

        monsterName.textContent = monster.name;
        monsterAge.textContent = monster.age;
        monsterBio.textContent = monster.description;

        monsterDiv.append(monsterName, monsterAge, monsterBio);
        container.append(monsterDiv);
    })
}

function handleChangePage(e) {
    const destination = e.target.getAttribute('destination');
    console.log(`New page: ${destination}`)
    const parameters = {
        '_limit': 50,
        '_page': destination
    };
    sendRequest('/monsters', renderMonsters, {}, parameters);
    document.getElementById('back').setAttribute('destination', Math.max(1, +destination - 1));
    document.getElementById('forward').setAttribute('destination', +destination + 1);
}

function handleNewMonster(e) {
    e.preventDefault();
    const form = e.target;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            name: form.querySelector('#new-monster-name').value,
            age: form.querySelector('#new-monster-age').value,
            description: form.querySelector('#new-monster-bio').value
        })
    };

    sendRequest('/monsters', () => {}, options);

    form.reset();
}

function sendRequest(endpoint, callback, options={}, parameters={}) {
    const paramsString = new URLSearchParams(parameters);
    fetch(`http://localhost:3000${endpoint}?${paramsString}`, options)
        .then(resp => resp.json())
        .then(callback)
        .catch(error => {
            console.error(error);
            console.error(`Endpoint: ${endpoint}`);
            console.table(options);
        })
}