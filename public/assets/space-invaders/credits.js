document.addEventListener('DOMContentLoaded', function () {
  const creditAmount = document.getElementById('creditAmount')

  const insertCredits = () => {
    return new Promise((resolve, reject) => {
      fetch('/api/insertCredits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userid: localStorage.getItem('userid'),
          credits: localStorage.getItem('credits')
        })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            resolve()
          } else {
            reject('Failed to insert credits')
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  const retrieveCredits = () => {
    console.log('attempting to retrieve credits')
    return new Promise((resolve, reject) => {
      fetch('/api/retrieveCredits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userid: localStorage.getItem('userid') })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            creditAmount.textContent = data.credits // Update the credit amount element with the retrieved credits
            resolve() // Resolve the promise
          } else {
            console.log('Failed to retrieve credits')
            reject('Failed to retrieve credits') // Reject the promise with an error message
          }
        })
        .catch((error) => {
          reject(error) // Reject the promise with the caught error
        })
    })
  }

  const backButton = document.getElementById('backButton')
  backButton.addEventListener('click', function () {
    // Run both functions concurrently when the "Back" button is clicked
    Promise.all([retrieveCredits(), insertCredits()]).catch((error) =>
      console.error('Error:', error)
    )
  })
})
