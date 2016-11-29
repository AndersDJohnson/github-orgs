// import 'whatwg-fetch'
import parseLinkHeader from 'parse-link-header'
import delay from 'delay'
// import chance from './promise-chance'

function cached(url) {
  var p
  var i = window.localStorage.getItem(url)
  if (i) {
    p = Promise.resolve(i)
            .then(function(body) {
              return JSON.parse(body)
            })
  }
  else {
    let link
    p = fetch(url)
            .then((response) => {
              console.log('response', url, response)
              if (!response.ok) {
                return Promise.reject()
              }
              link = response.headers.get('Link')
              console.log('header Link', link)
              return response.text()
            })
            .then(JSON.parse)
            .then((json) => {
              if (link) {
                const links = parseLinkHeader(link)
                console.log('links', links)
                const next = links.next
                if (!next) return json
                return cached(next.url)
                        .then(nextJSON => [].concat(json, nextJSON))
              }
              return json
            })
            .then(json => {
              // try/catch in case the storage fills up, we ignore caching
              try {
                window.localStorage.setItem(url, JSON.stringify(json))
              }
                catch (e) {
                  console.warn(e)
                }
              return json
            })
  }
  p = p.then(delay(Math.random() * 1000))
  // p = p.then(chance(0.5))
  // if (url.match(/members/)) p = p.then(chance(0.5))
  // if (url.match(/user/)) p = p.then(chance(0.5))
  return p
}

export function get(path) {
  if (!path.startsWith('http')) {
    path = 'https://api.github.com/' + path
  }
  return cached(path)
}
