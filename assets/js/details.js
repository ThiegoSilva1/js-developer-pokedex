const urlParams = new URLSearchParams(window.location.search)

const pokemonId = urlParams.get('id')

const pokemonDetail =
    document.getElementById('pokemonDetail')


function goBack() {
    window.location.href = 'index.html'
}

function openPokemon(id) {
    window.location.href = `details.html?id=${id}`
}

function selectEvolutionCard(event, id) {

    const cards =
        document.querySelectorAll('.evolution-card')

    cards.forEach(card => {
        card.classList.remove('active')
    })

    event.currentTarget.classList.add('active')

    setTimeout(() => {
        openPokemon(id)
    }, 250)
}

function openTab(event, tabId) {

    const contents =
        document.querySelectorAll('.tab-content')

    contents.forEach(content => {
        content.classList.remove('active')
    })

    const buttons =
        document.querySelectorAll('.tab-button')

    buttons.forEach(button => {
        button.classList.remove('active')
    })

    document.getElementById(tabId)
        .classList.add('active')

    event.currentTarget.classList.add('active')
}


async function loadPokemonDetail() {

    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    )

    const pokemon = await response.json()

    const types = pokemon.types.map(
        typeSlot => typeSlot.type.name
    )

    pokemonDetail.className = 'pokemon-card'

    pokemonDetail.classList.add(types[0])


    document.getElementById('pokemonNumber')
        .innerText = `#${pokemon.id}`

    document.getElementById('pokemonName')
        .innerText = pokemon.name

    document.getElementById('pokemonImage')
        .src =
        pokemon.sprites.other['official-artwork'].front_default

    document.getElementById('pokemonImage')
        .alt = pokemon.name

    document.getElementById('pokemonTypes')
        .innerHTML = types.map(type => `
        
            <span class="type ${type}">
                ${type}
            </span>

        `).join('')

   
    document.getElementById('height')
        .innerText = `${pokemon.height / 10} m`

    document.getElementById('weight')
        .innerText = `${pokemon.weight / 10} kg`

    document.getElementById('experience')
        .innerText = pokemon.base_experience



    const statsContainer =
        document.getElementById('stats')

    statsContainer.innerHTML =
        pokemon.stats.map(stat => `
    
            <div class="stat">

                <span>
                    ${stat.stat.name}
                </span>

                <div class="bar">

                    <div class="progress"
                        style="width: ${Math.min(stat.base_stat, 100)}%">
                    </div>

                </div>

            </div>

        `).join('')



    const movesContainer =
        document.getElementById('moves')

    movesContainer.innerHTML = `
    
        <div class="moves-container">

            ${pokemon.moves
                .slice(0, 20)
                .map(move => `
            
                    <span class="move">
                        ${move.move.name}
                    </span>

                `).join('')}

        </div>
    `

    

    const speciesResponse = await fetch(
        pokemon.species.url
    )

    const speciesData =
        await speciesResponse.json()

    const evolutionResponse = await fetch(
        speciesData.evolution_chain.url
    )

    const evolutionData =
        await evolutionResponse.json()

    const evolutionContainer =
        document.getElementById('evolutionContainer')

    const evolutions = []

    let currentEvolution =
        evolutionData.chain

    while (currentEvolution) {

        evolutions.push(
            currentEvolution.species.name
        )

        currentEvolution =
            currentEvolution.evolves_to[0]
    }

    const evolutionHTML = await Promise.all(

        evolutions.map(async (name, index) => {

            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${name}`
            )

            const evolutionPokemon =
                await response.json()

            return `
            
                <div class="evolution-card"
                    onclick="selectEvolutionCard(event, ${evolutionPokemon.id})">

                    <img
                        src="${evolutionPokemon.sprites.other['official-artwork'].front_default}"
                        alt="${name}"
                    >

                    <div class="evolution-name">
                        ${name}
                    </div>

                </div>

                ${index < evolutions.length - 1
                    ? `<div class="evolution-arrow">→</div>`
                    : ''
                }
            `
        })
    )

    evolutionContainer.innerHTML =
        evolutionHTML.join('')
}



loadPokemonDetail()