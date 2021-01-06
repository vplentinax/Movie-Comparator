const autoCompleteConfig = {
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: '66015c0f',
        s: searchTerm,
      },
    })

    if (response.data.Error) {
      return []
    }

    return response.data.Search
  },

  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
    <img src="${imgSrc}"/>
    ${movie.Title} (${movie.Year})
  `
  },

  inputValue(movie) {
    return movie.Title
  },
}
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),

  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
  },
})
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),

  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
  },
})
let leftMovie
let rightMovie

const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '66015c0f',
      i: movie.imdbID,
    },
  })
  summaryElement.innerHTML = movieTemplate(response.data)

  if (side === 'left') {
    leftMovie = response.data
  } else {
    rightMovie = response.data
  }

  if (leftMovie && rightMovie) {
    runComparision()
  }
}

const runComparision = () => {
  debugger
  const leftSideStats = document.querySelectorAll('#left-summary .notification')
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  )
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index]
    const leftSideValue = parseInt(leftStat.dataset.value)
    const rightSideValue = parseInt(rightStat.dataset.value)

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    } else {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  })
}

const movieTemplate = (movieDetail) => {
  const metascore = parseInt(movieDetail.Metascore)
  const imdbRating = parseFloat(movieDetail.imdbRating)
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word)

    if (isNaN(value)) {
      return prev
    } else {
      return prev + value
    }
  }, 0)
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    ${
      movieDetail.Awards === 'N/A'
        ? ''
        : `<article data-value="${awards}" class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
    </article>`
    }
    ${
      movieDetail.Metascore === 'N/A'
        ? ''
        : `<article data-value="${metascore}" class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
    </article>`
    }
    ${
      movieDetail.imdbRating === 'N/A'
        ? ''
        : `<article data-value="${imdbRating}" class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">Rating</p>
    </article>`
    }
    ${
      movieDetail.imdbVotes === 'N/A'
        ? ''
        : `<article data-value="${imdbVotes}" class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">Votes</p>
    </article>`
    }
  `
}
