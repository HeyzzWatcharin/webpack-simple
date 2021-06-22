require('./style.scss')

setInterval(() => {
  document.getElementById('date').innerHTML = moment().format('DD MMM YYYY')
  document.getElementById('time').innerHTML = moment().format('HH:mm:ss')
}, 1000)